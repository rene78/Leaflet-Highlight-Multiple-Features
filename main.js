let myMap;

//Add the base map without any layers.
addLeafletMap();

//Load the example GeoJSON into the map
showGeoJson(continents);

//Add a Leaflet map to the page
function addLeafletMap() {
  const EsriWorldShadedRelief = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri',
    maxZoom: 13,
    minZoom: 2
  });

  myMap = L.map('map', {
    // center: [0, 0], //defined by "fitBounds"
    // zoom: 4, //defined by "fitBounds"
    //zoomControl: false, //hide zoom control buttons
    layers: EsriWorldShadedRelief
  });
}

//Show GeoJSON polygons on the Leaflet map & add functions to determine what happens on mouseover
function showGeoJson(continents) {
  let leafletContinents = L.geoJSON(continents, {
    onEachFeature: onEachFeature,
    style: style
  })
  // console.log(leafletContinents.getLayers());
  leafletContinents.addTo(myMap);
  //Center and zoom the map on the provided GeoJSON
  myMap.fitBounds(leafletContinents.getBounds());
  //What happens when clicking or hovering over each polygon
  function onEachFeature(feature, layer) {
    // console.log(feature);
    // console.log(layer);

    //Change opacity to 0.9 when polygon gets focus
    layer.on('mouseover', function (e) {
      // console.log(layer);
      highlightOnOff(0.9, feature);
    });

    //Change opacity back to 0.7 when polygon loses focus
    layer.on('mouseout', function (e) {
      highlightOnOff(0.7, feature);
    });

    //bind click
    // layer.on('click', function (e) {
    //   // console.log(e);
    //   console.log(feature.properties.continent);
    // });

    //Add contintent name as a tooltip (TODO: Add translation - "America", "Asia, Australia and Oceania", "Europe and Russia", "Africa")
    const tooltipContent = feature.properties.continent;
    layer.bindTooltip(tooltipContent);
  }

  //Style the polygons according to continent
  function style(feature) {
    let style = { "opacity": 1, "fillOpacity": 0.7, "color": "#555555", "weight": 2 };
    // console.log(feature.properties.continent);
    switch (feature.properties.continent) {
      case 'africa': style.fillColor = "#4F93C0"; break;
      case 'asia': style.fillColor = "#8A84A3"; break;
      case 'europe': style.fillColor = "#D5DC76"; break;
      case 'america': style.fillColor = "#AC5C91"; break;
    }
    // console.log(style);
    return style;
  }

  function highlightOnOff(fillOpacity, feature) {

    let continentOfHighlightedPolygon = feature.properties.continent;
    // console.log(continentOfHighlightedPolygon);

    //For each layer (i.e. polygon) of the layerGroup (i.e. the GeoJSON) the code below is executed.
    leafletContinents.eachLayer(function (layer) {
      if (layer.feature.properties.continent == continentOfHighlightedPolygon) {
        layer.setStyle({ fillOpacity }) //equals "fillOpacity: fillOpacity"
      }
    });
  };
}