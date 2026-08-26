import { Map, } from 'maplibre-gl';
import { addGeolocationControl } from './geolocation.js';
import 'maplibre-gl/dist/maplibre-gl.css';
import { createHalteBuffer } from './bufferhalte.js';
import { addHaltePopup } from './popup.js';

const mapLayout = document.createElement('div');
mapLayout.id = 'map-layout';

const sidePanel = document.createElement('aside');
sidePanel.id = 'side-panel';
sidePanel.innerHTML = `
  <section>
    <h2>Layer Peta</h2>

    <label>
      <input type="checkbox" data-layer="halte-points" checked>
      Halte
    </label>

    <label>
      <input type="checkbox" data-layer="jaringan-jalan-line" checked>
      Jaringan Jalan
    </label>
  </section>

  <section>
    <h2>Buffer Halte</h2>

    <label>
      <input type="checkbox" data-layer="halte-buffer">
      Buffer 300 meter
    </label>
  </section>
`;

const mapElement = document.createElement('div');
mapElement.id = 'map';

mapLayout.appendChild(sidePanel);
mapLayout.appendChild(mapElement);
document.body.appendChild(mapLayout);

sidePanel.querySelectorAll('input[data-layer]').forEach((toggle) => {
  toggle.addEventListener('change', () => {
    const visibility = toggle.checked ? 'visible' : 'none';

    if (map.getLayer(toggle.dataset.layer)) {
      map.setLayoutProperty(
        toggle.dataset.layer,
        'visibility',
        visibility
      );
    }
  });
});

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

map.on('load', async () => {
  try {
    const [halteResponse, jalanResponse] = await Promise.all([
      fetch(`${import.meta.env.BASE_URL}data/Halte.geojson`),
      fetch(`${import.meta.env.BASE_URL}data/jaringan-jalan.geojson`)
    ]);

    if (!halteResponse.ok || !jalanResponse.ok) {
      throw new Error(
        `Data request failed: halte=${halteResponse.status}, jalan=${jalanResponse.status}`
      );
    }

    const halteData = await halteResponse.json();
    const jalanData = await jalanResponse.json();

    console.log('Halte:', halteData.features.length);
    console.log('Jalan:', jalanData.features.length);

    map.addSource('halte', {
      type: 'geojson',
      data: halteData
    });

    map.addSource('jaringan-jalan', {
      type: 'geojson',
      data: jalanData
    });

    map.addLayer({
      id: 'jaringan-jalan-line',
      type: 'line',
      source: 'jaringan-jalan',
      paint: {
        'line-color': '#bdbdbd',
        'line-width': 2,
        'line-opacity': 0.8
      }
    });

    map.addLayer({
      id: 'halte-points',
      type: 'circle',
      source: 'halte',
      paint: {
        'circle-radius': 8,
        'circle-color': '#ff0000',
        'circle-stroke-color': '#ffffff',
        'circle-stroke-width': 2
      }
    });

    map.addSource('halte-buffer', {
      type: 'geojson',
      data: createHalteBuffer(halteData)
    });

    map.addLayer({
      id: 'halte-buffer',
      type: 'fill',
      source: 'halte-buffer',
      layout: {
        visibility: 'none'
      },
      paint: {
        'fill-color': '#ffff00',
        'fill-opacity': 0.4
      }
    });

    addHaltePopup(map);
  } catch (error) {
    console.error('Map data failed:', error);
  }
});

const geolocateControl = addGeolocationControl(map, sidePanel);

geolocateControl.on('geolocate', (position) => {
  const { latitude, longitude } = position.coords;

  map.flyTo({
    center: [longitude, latitude],
    zoom: 15
  });
});
