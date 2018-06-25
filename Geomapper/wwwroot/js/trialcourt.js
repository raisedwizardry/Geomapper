var map = L.map('map').setView([45.1, -86.4997], 6);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    maxZoom: 18,
    id: null,
    //accessToken: 'pk.eyJ1IjoicmFpc2Vkd2l6YXJkcnkiLCJhIjoiY2ppcTRudnZjMDB1NzN3bzMyOWswYzNlYSJ9.ryEkxuzJq8FlhLFUtXRm5w'
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
    console.log(props.NAME);
    //hit the crmapi to retrieve county data
    //const countyCourtsData = fetch('http://web-dev/CRMAPI/api/GetCurrentCourtAddressByCounty?countyName='+ props.NAME);
    //console.log(countyCourtsData); 
    var countyCourtsData = [
        {
            "OrganizationId": "f224a5c9-dbd0-e511-80db-005056836f2c",
            "FullOrganizationCode": "C29~1",
            "OrganizationCode": "C29",
            "DivisionType": null,
            "OrganizationName": "29th Circuit Court - Clinton",
            "OrganizationType": "Court",
            "OrganizationSubType": "Circuit",
            "ParentOrganizationId": "a8c13f54-dcd0-e511-80db-005056836f2c",
            "JurisdictionalCountyList": "CLINTON",
            "OraclePrimaryKey": 5010,
            "MCLAText": "Clinton County",
            "segment": 167410000
        },
        {
            "OrganizationId": "f5b19fcf-dbd0-e511-80db-005056836f2c",
            "FullOrganizationCode": "P19",
            "OrganizationCode": "P19",
            "DivisionType": null,
            "OrganizationName": "Clinton County Probate Court",
            "OrganizationType": "Court",
            "OrganizationSubType": "Probate",
            "ParentOrganizationId": null,
            "JurisdictionalCountyList": "CLINTON",
            "OraclePrimaryKey": 425,
            "MCLAText": "Clinton County",
            "segment": null
        },
        {
            "OrganizationId": "a8c13f54-dcd0-e511-80db-005056836f2c",
            "FullOrganizationCode": "C29",
            "OrganizationCode": "C29",
            "DivisionType": null,
            "OrganizationName": "29th Circuit Court",
            "OrganizationType": "Court",
            "OrganizationSubType": "Circuit",
            "ParentOrganizationId": null,
            "JurisdictionalCountyList": "CLINTON, GRATIOT",
            "OraclePrimaryKey": 128,
            "MCLAText": "Clinton and Gratiot Counties",
            "segment": null
        },
        {
            "OrganizationId": "490eeb88-ddd0-e511-80db-005056836f2c",
            "FullOrganizationCode": "D65A",
            "OrganizationCode": "D65A",
            "DivisionType": null,
            "OrganizationName": "65A District Court",
            "OrganizationType": "Court",
            "OrganizationSubType": "District",
            "ParentOrganizationId": null,
            "JurisdictionalCountyList": "CLINTON",
            "OraclePrimaryKey": 312,
            "MCLAText": "Clinton County",
            "segment": null
        }
    ];

    document.getElementById("county").innerHTML = '<p>' + props.NAME + '</p>';

    for (var i = 0; i < countyCourtsData.length; i++) {
        var obj = countyCourtsData[i];
        var courtli = document.createElement("li");
        courtli.id = i;
        courtli.innerHTML = obj.FullOrganizationCode + ' - ' + obj.OrganizationSubType ;
        var countydiv = document.getElementById("county");
        countydiv.appendChild(courtli);
    }
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

function displayCountyDetails(e) {
    map.fitBounds(e.target.getBounds());
    clickFeature(e);
}
//function zoomToFeature(e) {
//	map.fitBounds(e.target.getBounds());
//}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
        click: clickFeature
	});
}

geojson=L.geoJson(micounty, {style: style, onEachFeature: onEachFeature}).addTo(map);
