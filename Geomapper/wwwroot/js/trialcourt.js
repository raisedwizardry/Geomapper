var map = L.map('map').setView([45.1, -86.4997], 6);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 18
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

info.listcourts = function (props) {
    console.log(props.FIPSCODE);
    var CRMApi = 'http://web-dev/CRMAPI/api/GetCurrentCourtAddressByFIPS';
    var url = createUrl(CRMApi, "fipsCode", props.FIPSCODE);
    var countyCourts = doAjax(url);
    var countyCourtsData = countyCourts.responseJSON;
    document.getElementById("county").innerHTML = '<p>' + props.NAME + '</p>';

    for (var i = 0; i < countyCourtsData.length; i++) {
        var obj = countyCourtsData[i];
        var courtli = document.createElement("li");
        courtli.id = i;
        courtli.innerHTML = obj.FullCourtCode + ' - ' + obj.Court ;
        var countydiv = document.getElementById("county");
        countydiv.appendChild(courtli);
    }
};

info.addTo(map);

function createUrl(endpoint, prop, value) {
    var url = endpoint + '?' + prop + '=' + value;
    return url;
}

function doAjax(ajaxurl) {
    let result;

    try {
        result = $.ajax({
            url: ajaxurl,
            headers: { 'Accept': 'application/json' },
            success: function (result) {
                if (result.isOk == false) alert(result.message);
            },
            async: false,
        });
        return result;
    } catch (error) {
        console.error(error);
    }
}

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
        fillOpacity: 0.5
    };
}

function clickCourt(e) {
    document.getElementById("county").child; 
}

function clickFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#000',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.listcourts(layer.feature.properties);
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

//function zoomToFeature(e) {
//	map.fitBounds(e.target.getBounds());
//}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
        click: clickFeature, clickCourt,
	});
}

geojson=L.geoJson(micounty, {style: style, onEachFeature: onEachFeature}).addTo(map);
