import Map from "esri/Map";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import MapView from "esri/views/MapView";

// If GeoJSON files are not on the same domain as your website, a CORS enabled server
// or a proxy is required.
const url =
  "http://planning-permit-db.herokuapp.com/get-active-permits-layer";

// Paste the url into a browser's address bar to download and view the attributes
// in the GeoJSON file. These attributes include:
// * mag - magnitude
// * type - earthquake or other event such as nuclear test
// * place - location of the event
// * time - the time of the event
// Use the Arcade Date() function to format time field into a human-readable format

const template = {
  title: "{Permit Title}",
  content: `Permit Title: {Permit Title}<br>
    Permit Number: {Permit Number}<br>            
    Project ID: {Project ID}<br>
    Location ID: {Location ID}<br>
    Template name: {Template name}<br>             
    Permit Description: {Permit Description}<br>
    Project Address: {Project Address}<br>
    Status: {Status}<br>
    Status Date: {Status Date}
    GEOCODE: {GEOCODE}<br>`
};

const renderer = {
  type: "simple",
  symbol: {
    type: "simple-fill",
    outline: { width: 1.25, color: [255, 85, 0, 1] },
    color: [230, 76, 0, 0.25]
  }
};

const geojsonLayer = new GeoJSONLayer({
  url: url,
  popupTemplate: template,
  renderer: renderer //optional
});


const map = new Map({
  basemap: "gray",
  layers: [geojsonLayer]
});

const view = new MapView({
  container: "viewDiv",
  center: [-111, 45.7],
  zoom: 12,
  map: map
});
geojsonLayer.when(()=>{
  view.goTo(geojsonLayer.fullExtent);
})
