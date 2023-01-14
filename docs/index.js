const center = L.bounds([1.56073, 104.11475], [1.16, 103.502]).getCenter();
const map = L.map("mapdiv").setView([center.x, center.y], 12.5);
const basemap = L.tileLayer(
  "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",
  {
    detectRetina: true,
    maxZoom: 18,
    minZoom: 11,
  }
);

map.setMaxBounds([
  [1.56073, 104.1147],
  [1.16, 103.502],
]);
basemap.addTo(map);

fetch("data.geojson")
  .then((res) => res.json())
  .then((data) => {
    L.geoJson(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          color: getColor(feature.properties.Price),
          radius: 7,
          fillColor: getColor(feature.properties.Price),
          fillOpacity: 1,
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          `<span style='font-size:20px;'>📍 ${
            feature.properties.Store
          }</span> <br> <span style='font-size:20px;'>☕ ${
            feature.properties.Coffee
          } $${parseFloat(feature.properties.Price / 100).toFixed(2)}</span>`
        );
      },
    }).addTo(map);
  });

function getColor(d) {
  return d > 700
    ? "red"
    : d > 600
    ? "blue"
    : d > 500
    ? "green"
    : d > 100
    ? "black"
    : "grey";
}
