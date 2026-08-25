import { Map } from 'maplibre-gl';


const mapLayout = document.createElement('div');
mapLayout.id = 'map-layout';

const sidePanel = document.createElement('aside');
sidePanel.id = 'side-panel';
sidePanel.innerHTML = `
  <h2>Informasi Peta</h2>
  <p>Pilih halte atau jaringan jalan pada peta.</p>
`;

const mapElement = document.createElement('div');
mapElement.id = 'map';

mapLayout.appendChild(sidePanel);
mapLayout.appendChild(mapElement);
document.body.appendChild(mapLayout);

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
  center: [112.0432747, -6.8928125],
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
map.on('load', () => {
   fetch('/data/jaringan-jalan.geojson')
    .then((response) => response.json())
    .then((jalanData) => {
      map.addSource('jaringan-jalan', {
        type: 'geojson',
        data: jalanData
      });

      map.addLayer({
        id: 'jaringan-jalan-line',
        type: 'line',
        source: 'jaringan-jalan',
        paint: {
          'line-color': '#dddddb',
          'line-width': 2,
          'line-opacity': 0.7
        }
      });
    });
});