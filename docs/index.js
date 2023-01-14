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
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          `<b>📍 ${feature.properties.Store} <br> 🏷️ ${
            feature.properties.Coffee
          } $${parseFloat(feature.properties.Price / 100).toFixed(2)}</b>`
        );
      },
    }).addTo(map);
  });
