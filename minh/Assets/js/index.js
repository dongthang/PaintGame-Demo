$(document).ready(function(){
	//Set variable for time to play
	time = 10;
	halfTime = time/2;
	
	//load button color
	loadColor();
	
	//setup before play
	startLevel(1);
}) 

function startLevel(level){
	switch(level){
	case 1:
		numberColor = 4;
		retry = 0;
		break;
	case 2:
		numberColor = 6;
		retry = 2;
		break;
	case 3:
		numberColor = 8;
		retry = 3;
		break;	
	}
}

function loadColor(){
	htmlButton = "";
	listColor = ["#1567DD","#DDA615","#DD1538","#7CA381","#1F0E1E","#DA29CF","#2CDE43","#2CDECF","#3FDE2C","#DE2C43", "#2CCADE", "#96A433","#3FE96C","#921FE3","#5BD3D9","#393DD3" ];
	for(i = 0; i < listColor.length; i++){
		htmlButton += rendButton("color" + i, listColor[i]);
	}
	htmlButton += "<input type='button' id='button_image' style='background-color: white;' class='button_image'>"
	$("#color").html(htmlButton);
}

function rendButton(id, color){
	htmlButton = "<input type='button' id=" + id + " style='background-color: " + color + ";' class='button' onclick=\"pickColor(\'" + color + "\')\" >"
	return htmlButton;
}

function pickColor(color){
	$("#button_image").attr("style","background-color: " + color + ";");
	curColor = color;
}

function countTime(){
	time = time - 1;
	processTime(time)
	$("#time").text(time);
}

function processTime(time){
	switch(time){
	case halfTime:
		$("#message").text("Hurry ! Its half of time");
		break;
	case 0:
		clearInterval(threadTime);
		$("#message").text("Sorry !!! You LOST");
		time = 10;
		break;
	}
}

function startPlay(){
	threadTime = setInterval(countTime, 1000);
	$("#play").attr('onclick', "submitResult()");
	$("#play").val("Submit");
	$("#message").text("Game Start");
}

function submitResult(){
	alert("Game Done");
	clearInterval(threadTime);
}


