var ws;
var demoType = 1;

function InitWebSockets() {	
	var url;
	
	switch (demoType){
	case 1:
		url = "wss://jjxotdemo1.eu-gb.mybluemix.net/ws";
		break;
	case 2:
		url = "wss://jjxotdemo2.eu-gb.mybluemix.net/ws";
		break;
	}
	
	ws = new WebSocket(url);

	ws.onopen = function(ev) {
		console.log('Connected');
	};
	
	ws.onclose = function(ev) {
		console.log('Reconnecting');
		InitWebSockets();
	};
	
	ws.onmessage = function(ev) {
		var payload = JSON.parse(ev.data);

		switch(payload.serviceType){
		case "1"://Echo Test
			toastr["info"](payload.message, payload.title);	
			break;
		case "2"://Fetch Tweets
			ProcessTweets(payload.serviceData);	
			break;
		case "3"://Translate to Spanish
			toastr["info"](payload.message, payload.title);	
			break;
		}
	}

	return true;
}

function RunWebServiceFunction(id, data){	
	var msg = {serviceType:id, serviceData:data};
	ws.send(JSON.stringify(msg));
	return true;
}

function ProcessTweets(payload){
	var htmlMain = "";
	
	for(var x in payload){
		htmlMain += CreateHTMLEntry(payload[x].payload);
	}
	
	$('#activityBody').append(htmlMain);
	CreateIconActions();
	return true;
}

function ProcessNewMessage(payload){
	var htmlMain = CreateHTMLEntry(payload);
	$('#activityBody').prepend(htmlMain);
	CreateIconActions();
	return true;
}

function CreateHTMLEntry(value){
	var htmlStart = "<tr>";
	var htmlEnd = "</tr>";
	var htmlMain = "";
	var td1 = "";
	var td2 = "";
	var action = "<i class='glyphicon glyphicon-volume-up action text-danger' style='cursor:pointer;'></i>";
	
	td1 = "<td>" +  value + "</td>";
	td2 = "<td><div class='pull-right'>" + action + "</div></td>";
	htmlMain = htmlStart + td1 + td2 + htmlEnd;
	
	return htmlMain;
}

function CreateIconActions(){
	$("#activityBody").children().off();
	
	$(".action").click( function(e) {
		var value = $(e.target).parent().parent().parent().children(":first").html();
		e.preventDefault();
		RunWebServiceFunction("3", value);
	});
	
	return true;
}

InitWebSockets();