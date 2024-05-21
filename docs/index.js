// Create the map and set its view and zoom level
const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
const map = L.map("mapdiv").setView([center.x, center.y], 12.5);

// Create the basemap layer
const basemap = L.tileLayer(
  "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",
  {
    detectRetina: true,
    maxZoom: 18,
    minZoom: 11,
  }
);

// Add the basemap layer to the map
map.setMaxBounds([
  [1.56073, 104.1147],
  [1.16, 103.502],
]);
basemap.addTo(map);

// Keep track of whether a marker has been clicked
let isClicked = false;

// Fetch the data and create the markers
fetch("data.geojson")
  .then((res) => res.json())
  .then((data) => {
    // Create the markers and add them to the map
    const markers = L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          color: getColor(feature.properties.Price),
          radius: 7,
          fillColor: getColor(feature.properties.Price),
          fillOpacity: 1,
        });
      },
      onEachFeature: function (feature, layer) {
        // Add the information to the popup
        layer.bindPopup(
          `<span style='font-size:18px;'>📍 ${
            feature.properties.Store
          }</span> <br> <span style='font-size:18px;'>☕ ${
            feature.properties.Coffee
          } $${parseFloat(feature.properties.Price / 100).toFixed(2)}</span>`
        );

        // Add the event listeners for hover and click
        layer.on({
          mouseover: function () {
            if (!isClicked) {
              this.openPopup();
            }
          },
          mouseout: function () {
            if (!isClicked) {
              this.closePopup();
            }
          },
          click: function () {
            isClicked = true;
            this.openPopup();
          },
        });
      },
    }).addTo(map);
  });

// Add event listeners for clicks and popup close events on the map
map.on({
  click: function () {
    isClicked = false;
  },
  popupclose: function () {
    isClicked = false;
  },
});

// A function to get the color of the marker based on its price
function getColor(d) {
  return d > 700
    ? "red"
    : d > 650
    ? "blue"
    : d > 500
    ? "green"
    : d > 100
    ? "black"
    : "grey";
}
