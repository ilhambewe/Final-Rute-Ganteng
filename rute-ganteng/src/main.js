import { Map } from 'maplibre-gl';


const mapElement = document.createElement('div');
mapElement.id = 'map';
mapElement.style.height = "500px";
document.body.appendChild(mapElement);

const map = new Map({
  container: 'map',
  style: {
    version: 8,
    sources: {
      satellite: {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256,
        attribution: 'Tiles © Esri'
      }
    },
    layers: [
      {
        id: 'satellite',
        type: 'raster',
        source: 'satellite'
      }
    ]
  },
  center: [112.0693543, -6.8984631],
  zoom: 12,
  attributionControl: true
});

map.on('load', () => {
  fetch('/data/Halte.geojson')
    .then((response) => response.json())
    .then((halteData) => {
      map.addSource('halte', {
        type: 'geojson',
        data: halteData
      });

      map.addLayer({
        id: 'halte-points',
        type: 'circle',
        source: 'halte',
        paint: {
          'circle-radius': 6,
          'circle-color': '#e63946',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    });
});