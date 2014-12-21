var baseUrl = 'https://rest.ehrscape.com/rest/v1';
var queryUrl = baseUrl + '/query';

var username = "ois.seminar";
var password = "ois4fri";

var EHRIDUser;
var pacientId;
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
function urediUporabnika(){
	sessionID = getSessionId();
	var imeU = $("#urediIme").val();
	var priimekU = $("#urediPriimek").val();
	var rojstvoU = $("#urediDOB").val();

	var partyData = {
		id: pacientId,
		firstNames: imeU,
		lastNames: priimekU,
		dateOfBirth: rojstvoU,
		partyAdditionalInfo: [
			{
				key: "ehrId",
				value: EHRIDUser
			}
		]
	};
	$.ajax({
		url: baseUrl + "/demographics/party/",
		type: 'PUT',
		contentType: 'application/json',
		data: JSON.stringify(partyData),
		headers: {"Ehr-Session": sessionId},
		success: function (party) {
			console.log(firstName+lastName+gender+dateOfBirth +"FIXED");
		},error: function(error){
			console.log(error);
		}
	});
}
function generirajMeritve(){
	sessionId = getSessionId();
	var time = new Date();
	time = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+"T"+time.getHours()+":"+time.getMinutes();
	var visina;
	var teza;
	var temp;
	var utrip;
	var sisTlak;
	var diaTlak;
	for(var i = 0; i < 50; i++){
		//console.log(i);
		visina = Math.floor(Math.random() * (240 - 100 + 1)) + 100;
		teza = Math.floor(Math.random() * (180 - 40 + 1)) + 40;
		temp = Math.floor(Math.random() * (45 - 15 + 1)) + 15;
		utrip = Math.floor(Math.random() * (130 - 40 + 1)) + 40;
		sisTlak = Math.floor(Math.random() * (180 - 60 + 1)) + 60;
		diaTlak = Math.floor(Math.random() * (120 - 40 + 1)) + 40;

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
		    	//console.log(res.meta.href);
		        //$("#dodajSporocilo").text("Uspešen vnos podatkov");
		        $("#nasvetiTekst").text("");
		    },
		    error: function(err) {
		    	//$("#dodajSporocilo").text("Neuspešen vnos podatkov");
				console.log(JSON.parse(err.responseText).userMessage);
		    }
		});
	}
	$("#dodajSporocilo").text("Uspešen vnos podatkov");
    izpisZadnjeMerTeza();
	izpisZadnjeMerTemp();
	izpisZadnjeMerUtrip();
	izpisZadnjeMerTlak();
}
function dodajMeritve() {
	sessionId = getSessionId();
	var time = new Date();
	time = time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()+"T"+time.getHours()+":"+time.getMinutes();
	//console.log(time);
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
	    	//console.log(res.meta.href);
	        $("#dodajSporocilo").text("Uspešen vnos podatkov");
	        $("#nasvetiTekst").text("");
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
				grafZaVisino();
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
				grafZaTezo();
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
		if((Math.round((teza/(visina*visina))))>= 25)
			naloziNasvet(Nasveti.debelost);
		else if((Math.round((teza/(visina*visina))))<= 18)
			naloziNasvet(Nasveti.podhranjenost);
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
				grafZaTemp();
				if(res[0].temperature >= 38)
					naloziNasvet(Nasveti.vrocina);
				else if(res[0].temperature <= 35)
					naloziNasvet(Nasveti.podhladitev);
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
				grafZaPuls();
				if(res[0].pulse < 60)
					naloziNasvet(Nasveti.nizekUtrip);
				else if(res[0].pulse > 100)
					naloziNasvet(Nasveti.visokUtrip);
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
				if(res[0].diastolic && res[0].systolic){
					$("#vrednostPritisk").text(res[0].systolic+"/"+res[0].diastolic);
					if(res[0].diastolic < 60 || res[0].systolic < 90)
						naloziNasvet(Nasveti.nizekTlak);
					else if(res[0].diastolic > 90 || res[0].systolic > 140)
						naloziNasvet(Nasveti.visokTlak);
				}
				else if(res[0].systolic){
					$("#vrednostPritisk").text(res[0].systolic);
					if(res[0].systolic < 90)
						naloziNasvet(Nasveti.nizekTlak);
					else if(res[0].systolic > 140)
						naloziNasvet(Nasveti.visokTlak);
				}
				else{
					$("#vrednostPritisk").text(res[0].diastolic);
					if(res[0].diastolic < 60)
						naloziNasvet(Nasveti.nizekTlak);
					else if(res[0].diastolic > 90)
						naloziNasvet(Nasveti.visokTlak);
				}
				//grafZaTlak();
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
function grafZaTezo() {
	sessionId = getSessionId();	
	$("#narisiGrafTeza").text("");
	$.ajax({
	    url: baseUrl + "/view/" + EHRIDUser + "/" + "weight",
	    type: 'GET',
	    headers: {"Ehr-Session": sessionId},
	    success: function (res) {
	    	grafTeza(res);
	    },
	    error: function() {
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});	
}
function grafZaVisino() {
	sessionId = getSessionId();	
	$("#narisiGrafVisina").text("");
	$.ajax({
	    url: baseUrl + "/view/" + EHRIDUser + "/" + "height",
	    type: 'GET',
	    headers: {"Ehr-Session": sessionId},
	    success: function (res) {
	    	grafVisina(res);
	    },
	    error: function() {
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});	
}
function grafZaTemp() {
	sessionId = getSessionId();	
	$("#narisiGrafTemp").text("");
	$.ajax({
	    url: baseUrl + "/view/" + EHRIDUser + "/" + "body_temperature",
	    type: 'GET',
	    headers: {"Ehr-Session": sessionId},
	    success: function (res) {
	    	grafTemp(res);
	    },
	    error: function() {
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});	
}
function grafZaTlak() {
	sessionId = getSessionId();	
	$("#narisiGrafTlak").text("");
	$.ajax({
	    url: baseUrl + "/view/" + EHRIDUser + "/" + "blood_pressure",
	    type: 'GET',
	    headers: {"Ehr-Session": sessionId},
	    success: function (res) {
			grafSis(res);
			grafDia(res);
	    },
	    error: function() {
			console.log(JSON.parse(err.responseText).userMessage);
	    }
	});	
}
function narisiQR(){
	getQR("http://sibalk.github.io/ois-dn4/bolnik.html?ehrid="+EHRIDUser);
}

function grafZaPuls () {
	sessionId = getSessionId();	
	$("#narisiGrafUtrip").text("");
	var AQL = 
	"select a_a/data[at0002]/events[at0003]/data[at0001]/items[at0004]/value/magnitude as Rate_magnitude from EHR e[e/ehr_id/value='"+ EHRIDUser+"'] contains OBSERVATION a_a[openEHR-EHR-OBSERVATION.heart_rate-pulse.v1] offset 0 limit 10";
		$.ajax({
		url: baseUrl + "/query?" + $.param({"aql": AQL}),
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (res) {
			//console.log(res.resultSet);	
			var rows = res.resultSet;
	        for (var i in rows) {
	            //console.log(rows[i].Rate_magnitude);

	        }
	        grafUtrip(rows);
	    },
	    error: function(err) {
	    	console.log(JSON.parse(err.responseText).userMessage);
	    }
	});
}
function naloziNasvet(podatki){
	$("#nasvetiTekst").append(podatki)
}
function izpisiVitalneZnake(){
	sessionId = getSessionId();
	var tip = $("#preberiTipZaVitalneZnake").val();
	if(tip == "teza"){
		$.ajax({
			url: baseUrl + "/view/" + EHRIDUser + "/" + "weight",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function (res) {
				if (res.length > 0) {
					var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Telesna teza</th></tr>";
					for (var i in res) {
					    results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].weight + " " 	+ res[i].unit + "</td>";
					}
					results += "</table>";
					$("#rezultatMeritveVitalnihZnakov").append(results);
				}
				else{
					$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
				}
			},
			error: function() {
				$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}
	else if(tip == "visina"){
		$.ajax({
			url: baseUrl + "/view/" + EHRIDUser + "/" + "height",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function (res) {
				if (res.length > 0) {
					var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Telesna visina</th></tr>";
					for (var i in res) {
					    results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].height + " " 	+ res[i].unit + "</td>";
					}
					results += "</table>";
					$("#rezultatMeritveVitalnihZnakov").append(results);
				}
				else{
					$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
				}
			},
			error: function() {
				$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}
	else if(tip == "temp"){
		$.ajax({
			url: baseUrl + "/view/" + EHRIDUser + "/" + "body_temperature",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function (res) {
				if (res.length > 0) {
					var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Telesna temperatura</th></tr>";
					for (var i in res) {
					    results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].temperature + " " 	+ res[i].unit + "</td>";
					}
					results += "</table>";
					$("#rezultatMeritveVitalnihZnakov").append(results);
				}
				else{
					$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
				}
			},
			error: function() {
				$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}
	else if(tip == "utrip"){
		$.ajax({
			url: baseUrl + "/view/" + EHRIDUser + "/" + "pulse",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function (res) {
				if (res.length > 0) {
					var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Srcni utrip</th></tr>";
					for (var i in res) {
					    results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].pulse + " " 	+ res[i].unit + "</td>";
					}
					results += "</table>";
					$("#rezultatMeritveVitalnihZnakov").append(results);
				}
				else{
					$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
				}
			},
			error: function() {
				$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}
	else if(tip == "sistolicni"){
		$.ajax({
			url: baseUrl + "/view/" + EHRIDUser + "/" + "blood_pressure",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function (res) {
				if (res.length > 0) {
					var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Krvni tlak(sistolični)</th></tr>";
					for (var i in res) {
					    results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].systolic + " " 	+ res[i].unit + "</td>";
					}
					results += "</table>";
					$("#rezultatMeritveVitalnihZnakov").append(results);
				}
				else{
					$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
				}
			},
			error: function() {
				$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}
	else{
		$.ajax({
			url: baseUrl + "/view/" + EHRIDUser + "/" + "blood_pressure",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
			success: function (res) {
				if (res.length > 0) {
					var results = "<table class='table table-striped table-hover'><tr><th>Datum in ura</th><th class='text-right'>Krvni tlak(diastolični)</th></tr>";
					for (var i in res) {
					    results += "<tr><td>" + res[i].time + "</td><td class='text-right'>" + res[i].diastolic + " " 	+ res[i].unit + "</td>";
					}
					results += "</table>";
					$("#rezultatMeritveVitalnihZnakov").append(results);
				}
				else{
					$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-warning fade-in'>Ni podatkov!</span>");
				}
			},
			error: function() {
				$("#preberiMeritveVitalnihZnakovSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}

	
}
$(document).ready(function() {

	
	var html = window.location.href;
	var tab= html.split("=");
	EHRIDUser = tab[1];
	//console.log(EHRIDUser);
	sessionId = getSessionId();	
	grafZaTezo();
	grafZaVisino();
	grafZaTemp();
	grafZaPuls();
	grafZaTlak();
	/*
	naloziNasvet(Nasveti.debelost);
	naloziNasvet(Nasveti.podhranjenost);
	naloziNasvet(Nasveti.vrocina);
	naloziNasvet(Nasveti.podhladitev);
	naloziNasvet(Nasveti.nizekUtrip);
	naloziNasvet(Nasveti.visokUtrip);
	naloziNasvet(Nasveti.nizekTlak);
	naloziNasvet(Nasveti.visokTlak);
	$("#nasvetiTekst").text("");*/

	

	$.ajax({
		url: baseUrl + "/demographics/ehr/" + EHRIDUser + "/party",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (data) {
			var party = data.party;
			pacientId = data.party.id;
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