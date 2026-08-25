import { Map } from 'maplibre-gl';

const mapElement = document.createElement('div');
mapElement.id = 'map';
mapElement.style.height = "500px";
document.body.appendChild(mapElement);

const map = new Map({
  container: 'map',
  style: 'https://demotiles.maplibre.org/globe.json',
  center: [112.1, -6.90],
  zoom: 3,
  attributionControl: false
});