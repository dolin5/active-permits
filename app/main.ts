import Map from "esri/Map";
import GeoJSONLayer from "esri/layers/GeoJSONLayer";
import MapView from "esri/views/MapView";
import FeatureLayer from "esri/layers/FeatureLayer";
import Expand from "esri/widgets/Expand";

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
  //url,
  url:"https://planning-permit-db.herokuapp.com/get-active-permits-layer",
  id:"permits",
  popupTemplate: template,
  renderer: renderer //optional
});

const parcelsLayer = new FeatureLayer({
  portalItem:{
    id:"f47b4acbb13b44e1b516de9b48405f1e"
  },
  id:"parcels"
})

const map = new Map({
  basemap: "gray",
  layers: [parcelsLayer,geojsonLayer]
});

const view = new MapView({
  container: "viewDiv",
  center: [-111, 45.7],
  zoom: 12,
  map: map
});



geojsonLayer.when(()=>{
  geojsonLayer.queryFeatureCount().then(result=>{
    document.getElementById("active-permit-count").innerText = result;
  })
  geojsonLayer.queryFeatures().then(result=>{
    let permits = result.features;
    permits.sort((a,b)=>{
      if (b.attributes["Permit Number"]<a.attributes["Permit Number"]) return -1
      return 1
    })
    let listNode = document.getElementById("active-permit-list") as HTMLUListElement;
    permits.forEach(permit=>{
      let li = document.createElement("li");
      li.innerHTML = permit.attributes["Permit Number"] + " - " + permit.attributes["Permit Title"]
      li.addEventListener('click', (event) => {
        permit.geometry ? view.goTo(permit.geometry) :view.goTo(geojsonLayer.fullExtent);      
      });
      listNode.appendChild(li);
    })

  })

  
})