var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var EHRIDUser;
var teza;
var visina;

function getSessionId() {
    var response = $.ajax({
        type: "POST",
        url: baseUrl + "/session?username=" + encodeURIComponent(username) +
                "&password=" + encodeURIComponent(password),
        async: false
    });
    return response.responseJSON.sessionId;
}
function dodajMeritve() {
	sessionId = getSessionId();
	var time = new Date();
	time = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+"T"+time.getHours()+":"+time.getMinutes();
	console.log(time);
	var visina = $("#dodajVisina").val();
	var teza = $("#dodajTeza").val();
	var temp = $("#dodajTemp").val();
	var utrip = $("#dodajUtrip").val();
	var sisTlak = $("#dodajSis").val();
	var diaTlak = $("#dodajDia").val();
	
	$.ajaxSetup({
	    headers: {"Ehr-Session": sessionId}
	});
	var podatki = {
	    "ctx/language": "en",
	    "ctx/territory": "SI",
	    "ctx/time": time,
	    "vital_signs/height_length/any_event/body_height_length": visina,
	    "vital_signs/body_weight/any_event/body_weight": teza,
	   	"vital_signs/body_temperature/any_event/temperature|magnitude": temp,
	    "vital_signs/body_temperature/any_event/temperature|unit": "°C",
	    "vital_signs/blood_pressure/any_event/systolic": sisTlak,
	    "vital_signs/blood_pressure/any_event/diastolic": diaTlak,
	    "vital_signs/pulse/any_event/rate": utrip 
	};
	var parametriZahteve = {
	    "ehrId": EHRIDUser,
	    templateId: 'Vital Signs',
	    format: 'FLAT'
	};
	$.ajax({
	    url: baseUrl + "/composition?" + $.param(parametriZahteve),
	    type: 'POST',
	    contentType: 'application/json',
	    data: JSON.stringify(podatki),
	    success: function (res) {
	    	console.log(res.meta.href);
	        $("#dodajSporocilo").text("Uspešen vnos podatkov");
	        izpisZadnjeMerTeza();
			izpisZadnjeMerTemp();
			izpisZadnjeMerUtrip();
			izpisZadnjeMerTlak();
	    },
	    error: function(err) {
	    	$("#dodajSporocilo").text("Neuspešen vnos podatkov");
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});
}
function izpisZadnjeMerVisina () {
	$.ajax({
		url: baseUrl + "/view/" + EHRIDUser + "/" + "height?limit=12",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res){
			if(res.length > 0){
				$("#vrednostVisina").text(res[0].height);
				visina = res[0].height;
			}
			else{
				$("#vrednostVisina").text("/");
			}
		}
		,error: function() {
			console.log("Napaka");
		}
	}).always(function(){
		izpisZadnjeMerITM();
	})
}
function izpisZadnjeMerTeza () {
	$.ajax({
		url: baseUrl + "/view/" + EHRIDUser + "/" + "weight?limit=12",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res){
			if(res.length > 0){
				$("#vrednostTeza").text(res[0].weight);
				teza = res[0].weight;
			}
			else{
				$("#vrednostTeza").text("/");
			}
		}
		,error: function() {
			console.log("Napaka");
		}
	}).always(function(){
		izpisZadnjeMerVisina();
	})
}
function izpisZadnjeMerITM (){
	if(teza && visina){
		visina = visina/100;
		$("#vrednostITM").text(Math.round((teza/(visina*visina))));
	}
	else
		$("#vrednostITM").text("/");
}
function izpisZadnjeMerTemp () {
	$.ajax({
		url: baseUrl + "/view/" + EHRIDUser + "/" + "body_temperature?limit=12",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res){
			if(res.length > 0){
				$("#vrednostTemp").text(res[0].temperature);
			}
			else{
				$("#vrednostTemp").text("/");
			}
		}
		,error: function() {
			console.log("Napaka");
		}
	})
}
function izpisZadnjeMerUtrip () {
	$.ajax({
		url: baseUrl + "/view/" + EHRIDUser + "/" + "pulse?limit=12",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res){
			if(res.length > 0){
				$("#vrednostUtrip").text(res[0].pulse);
			}
			else{
				$("#vrednostUtrip").text("/");
			}
		}
		,error: function() {
			console.log("Napaka");
		}
	})
}
function izpisZadnjeMerTlak () {
	$.ajax({
		url: baseUrl + "/view/" + EHRIDUser + "/" + "blood_pressure?limit=12",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res){
			if(res.length > 0){
				if(res[0].diastolic && res[0].systolic)
					$("#vrednostPritisk").text(res[0].systolic+"/"+res[0].diastolic);
				else if(res[0].systolic)
					$("#vrednostPritisk").text(res[0].systolic);
				else
					$("#vrednostPritisk").text(res[0].diastolic);
			}
			else{
				$("#vrednostPritisk").text("/");
			}
		}
		,error: function() {
			console.log("Napaka");
		}
	})
}
function grafZaPuls () {
	sessionId = getSessionId();	

	var AQL = 
	"select a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as Rate_magnitude from EHR e[e/ehr_id/value='"+ EHRIDUser+"'] contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1] offset 0 limit 10";
		$.ajax({
		url: baseUrl + "/query?" + $.param({"aql": AQL}),
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res) {
			console.log(res.resultSet);	
			var rows = res.resultSet;
	        for (var i in rows) {
	            console.log(rows[i].Rate_magnitude);

	        }
	        InitChart(rows);
	    },
	    error: function(err) {
	    	console.log(JSON.parse(err.responseText).userMessage);
	    }
	});
}
$(document).ready(function() {
	//InitChart();
	
	var html = window.location.href;
	var tab= html.split("=");
	EHRIDUser = tab[1];
	//console.log(EHRIDUser);
	sessionId = getSessionId();	
	grafZaPuls();

	$.ajax({
		url: baseUrl + "/demographics/ehr/" + EHRIDUser + "/party",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (data) {
			var party = data.party;
			//console.log(party.firstNames);
			$("#vrednostIme").text(party.firstNames + " "+ party.lastNames);
			//console.log(party.weight)
			izpisZadnjeMerTeza();
			izpisZadnjeMerTemp();
			izpisZadnjeMerUtrip();
			izpisZadnjeMerTlak();
		},
		error: function() {
			console.log("EHR ID ne obstaja");
		}
	})
});