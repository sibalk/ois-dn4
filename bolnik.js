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
function preberiEHRodBolnika() {
	sessionId = getSessionId();

	var ehrId = $("#preberiEHRid").val();

	if (!ehrId || ehrId.trim().length == 0) {
		$("#preberiSporocilo").html("<span class='obvestilo label label-warning fade-in'>Prosim vnesite zahtevan podatek!");
	} else {
		$.ajax({
			url: baseUrl + "/demographics/ehr/" + ehrId + "/party",
			type: 'GET',
			headers: {"Ehr-Session": sessionId},
	    	success: function (data) {
				var party = data.party;
				$("#preberiSporocilo").html("<span class='obvestilo label label-success fade-in'>Bolnik '" + party.firstNames + " " + party.lastNames + "', ki se je rodil '" + party.dateOfBirth + "'.</span>");
				console.log("Bolnik '" + party.firstNames + " " + party.lastNames + "', ki se je rodil '" + party.dateOfBirth + "'.");
			},
			error: function(err) {
				$("#preberiSporocilo").html("<span class='obvestilo label label-danger fade-in'>Napaka '" + JSON.parse(err.responseText).userMessage + "'!");
				console.log(JSON.parse(err.responseText).userMessage);
			}
		});
	}	
}
$(document).ready(function() {
	var html = window.location.href;
	var tab= html.split("=");
	EHRIDUser = tab[1];
	console.log(EHRIDUser);
	sessionId = getSessionId();	

	$.ajax({
		url: baseUrl + "/demographics/ehr/" + EHRIDUser + "/party",
		type: 'GET',
		headers: {"Ehr-Session": sessionId},
		success: function (data) {
			var party = data.party;
			console.log(party.firstNames);
			$("#vrednostIme").text(party.firstNames + " "+ party.lastNames);
			console.log(party.weight)
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
			})
			$.ajax({
				url: baseUrl + "/view/" + EHRIDUser + "/" + "height?limit=12",
				type: 'GET',
				headers: {"Ehr-Session": sessionId},
				success: function (res){
					if(res.length > 0){
						$("#vrednostVisina").text(res[0].height);
						visina = res[0].height;
						visina = visina/100;
						$("#vrednostITM").text(Math.round((teza/(visina*visina))));
					}
					else{
						$("#vrednostVisina").text("/");
					}
				}
				,error: function() {
					console.log("Napaka");
				}
			})
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
			$.ajax({
				url: baseUrl + "/view/" + EHRIDUser + "/" + "blood_pressure?limit=12",
				type: 'GET',
				headers: {"Ehr-Session": sessionId},
				success: function (res){
					if(res.length > 0){
						if(res[0].diatolic)
							$("#vrednostPritisk").text(res[0].diatolic);
						else if(res[0].systolic)
							$("#vrednostPritisk").text(res[0].systolic);
						else
							$("#vrednostPritisk").text(res[0].systolic+"/"+res[0].diatolic);
					}
					else{
						$("#vrednostPritisk").text("/");
					}
				}
				,error: function() {
					console.log("Napaka");
				}
			})
		},
		error: function() {
			console.log("EHR ID ne obstaja");
		}
	})
});
console.log(EHRIDUser);