define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // If GeoJSON files are not on the same domain as your website, a CORS enabled server
    // or a proxy is required.
    var url = "http://planning-permit-db.herokuapp.com/get-active-permits-layer";
    // Paste the url into a browser's address bar to download and view the attributes
    // in the GeoJSON file. These attributes include:
    // * mag - magnitude
    // * type - earthquake or other event such as nuclear test
    // * place - location of the event
    // * time - the time of the event
    // Use the Arcade Date() function to format time field into a human-readable format
    var template = {
        title: "{Permit Title}",
        content: "Permit Title: {Permit Title}<br>\n    Permit Number: {Permit Number}<br>            \n    Project ID: {Project ID}<br>\n    Location ID: {Location ID}<br>\n    Template name: {Template name}<br>             \n    Permit Description: {Permit Description}<br>\n    Project Address: {Project Address}<br>\n    Status: {Status}<br>\n    Status Date: {Status Date}\n    GEOCODE: {GEOCODE}<br>\n};\n\nconst renderer = {\n  type: \"simple\",\n  symbol: {\n    type: \"simple-fill\",\n    outline: { width: 1.25, color: [255, 85, 0, 1] },\n    color: [230, 76, 0, 0.25]\n  }\n};\n\nconst geojsonLayer = new GeoJSONLayer({\n  //url,\n  url:\"https://planning-permit-db.herokuapp.com/get-active-permits-layer\",\n  id:\"permits\",\n  popupTemplate: template,\n  renderer: renderer //optional\n});\n\nconst parcelsLayer = new FeatureLayer({\n  portalItem:{\n    id:\"f47b4acbb13b44e1b516de9b48405f1e\"\n  },\n  id:\"parcels\"\n})\n\nconst map = new Map({\n  basemap: \"gray\",\n  layers: [parcelsLayer,geojsonLayer]\n});\n\nconst view = new MapView({\n  container: \"viewDiv\",\n  center: [-111, 45.7],\n  zoom: 12,\n  map: map\n});\n\n\n\ngeojsonLayer.when(()=>{\n  geojsonLayer.queryFeatureCount().then(result=>{\n    document.getElementById(\"active-permit-count\").innerText = result;\n  })\n  geojsonLayer.queryFeatures().then(result=>{\n    let permits = result.features;\n    permits.sort((a,b)=>{\n      if (b.attributes[\"Permit Number\"]<a.attributes[\"Permit Number\"]) return -1\n      return 1\n    })\n    let listNode = document.getElementById(\"active-permit-list\") as HTMLUListElement;\n    permits.forEach(permit=>{\n      let li = document.createElement(\"li\");\n      li.innerHTML = permit.attributes[\"Permit Number\"] + \" - \" + permit.attributes[\"Permit Title\"]\n      li.addEventListener('click', (event) => {\n        permit.geometry ? view.goTo(permit.geometry) :view.goTo(geojsonLayer.fullExtent);      \n      });\n      listNode.appendChild(li);\n    })\n\n  })\n\n  \n})"
    };
});
//# sourceMappingURL=main.js.map