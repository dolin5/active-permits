var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define(["require", "exports", "esri/Map", "esri/layers/GeoJSONLayer", "esri/views/MapView", "esri/layers/FeatureLayer"], function (require, exports, Map_1, GeoJSONLayer_1, MapView_1, FeatureLayer_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Map_1 = __importDefault(Map_1);
    GeoJSONLayer_1 = __importDefault(GeoJSONLayer_1);
    MapView_1 = __importDefault(MapView_1);
    FeatureLayer_1 = __importDefault(FeatureLayer_1);
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
    var permitLinkTemplate = "https://web.mygov.us/app/#{%22page%22:[{%22url%22:%22/pi/%22,%22params%22:{%22container%22:%22#mn%22,%22value%22:%22pi%22,%22bc%22:%22Permits%20&%20Inspections%22,%22url%22:%22/pi/%22,%22environment%22:%22page%22},%22tabs%22:[]},{%22url%22:%22/pi/projects/details?id=$PROJECTID&list=all%22,%22params%22:{%22container%22:%22#main%22,%22class%22:%22module%22,%22bc%22:%22Project%20Details%20-%20$PERMITNUMBER%22,%22url%22:%22/pi/projects/details?id=$PROJECTID&list=all%22,%22environment%22:%22page%22},%22tabs%22:[{%22url%22:%22/pi/projects/overview?id=$PROJECTID&activetab=0%22,%22params%22:{%22tabContainer%22:%22#project-details-tabs%22,%22container%22:%22#project-tab-overview%22,%22bc%22:%22Overview%22}}]},{%22url%22:%22/pi/projects/overview?id=$PROJECTID&activetab=0%22,%22params%22:{%22tabContainer%22:%22#project-details-tabs%22,%22container%22:%22#project-tab-overview%22,%22bc%22:%22Overview%22}},{%22url%22:%22/pi/projects/details/overview/steps/listing?project_id=$PROJECTID%22,%22params%22:{%22tabContainer%22:%22#project-overview-tabs%22,%22container%22:%22#project-overview-steps%22,%22bc%22:%22Project%20Steps%22}}],%22modal%22:[]}";
    var template = {
        title: "{Permit Title}",
        content: "Permit Title: {Permit Title}<br>\n    Permit Number: {Permit Number}<br>            \n    Project ID: {Project ID}<br>\n    Location ID: {Location ID}<br>\n    Template name: {Template name}<br>             \n    Permit Description: {Permit Description}<br>\n    Project Address: {Project Address}<br>\n    Status: {Status}<br>\n    Status Date: {Status Date}\n    GEOCODE: {GEOCODE}<br>"
    };
    var renderer = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            outline: { width: 1.25, color: [255, 85, 0, 1] },
            color: [230, 76, 0, 0.25]
        }
    };
    var geojsonLayer = new GeoJSONLayer_1.default({
        //url,
        url: "https://planning-permit-db.herokuapp.com/get-active-permits-layer",
        id: "permits",
        popupTemplate: template,
        renderer: renderer //optional
    });
    var parcelsLayer = new FeatureLayer_1.default({
        portalItem: {
            id: "f47b4acbb13b44e1b516de9b48405f1e"
        },
        id: "parcels"
    });
    var map = new Map_1.default({
        basemap: "gray",
        layers: [parcelsLayer, geojsonLayer]
    });
    var view = new MapView_1.default({
        container: "viewDiv",
        center: [-111, 45.7],
        zoom: 12,
        map: map
    });
    geojsonLayer.when(function () {
        geojsonLayer.queryFeatureCount().then(function (result) {
            document.getElementById("active-permit-count").innerText = result;
        });
        geojsonLayer.queryFeatures().then(function (result) {
            var permits = result.features;
            permits.sort(function (a, b) {
                if (b.attributes["Permit Number"] < a.attributes["Permit Number"])
                    return -1;
                return 1;
            });
            var listNode = document.getElementById("active-permit-list");
            permits.forEach(function (permit) {
                var li = document.createElement("li");
                li.innerHTML = permit.attributes["Permit Number"] + " - " + permit.attributes["Permit Title"];
                li.addEventListener('click', function (event) {
                    permit.geometry ? view.goTo(permit.geometry) : view.goTo(geojsonLayer.fullExtent);
                });
                listNode.appendChild(li);
            });
        });
    });
});
//# sourceMappingURL=main.js.map