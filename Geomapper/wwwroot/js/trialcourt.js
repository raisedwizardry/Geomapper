var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoicmFpc2Vkd2l6YXJkcnkiLCJhIjoiY2ppcTRudnZjMDB1NzN3bzMyOWswYzNlYSJ9.ryEkxuzJq8FlhLFUtXRm5w'
}).addTo(map);


// control that shows state info on hover
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info');
	this.update();
	return this._div;
};

info.update = function (props) {
	this._div.innerHTML = '<h4>County Names</h4>' +  (props ?
		'<b>' + props.NAME + '</b><br />' + props.ACRES + '  Acres'
		: 'Hover over a state');
};

info.addTo(map);

function getColor(d) {
	return d > 1200 ? '#800026' :
			d > 1000  ? '#BD0026' :
			d > 800  ? '#E31A1C' :
			d > 600  ? '#FC4E2A' :
			d > 400   ? '#FD8D3C' :
			d > 200   ? '#FEB24C' :
			d > 10   ? '#FED976' :
						'#FFEDA0';
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.SQMILES),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
    };
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
}

var geojson;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

geojson=L.geoJson(micounty, {style: style, onEachFeature: onEachFeature}).addTo(map);
