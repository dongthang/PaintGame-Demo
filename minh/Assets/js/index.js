$(document).ready(function(){
	//Set variable for time to play
	
	//load button color
	loadColor();
	curColor = {
			r: 255,
			g: 255,
			b: 255
	};
	
	
	//setup before play
	startLevel(1);
}) 

function startLevel(level){
	switch(level){
	case 1:
		time = 20;
		numberColor = 13;
		retry = 1;
		break;
	case 2:
		time = 10;
		numberColor = 6;
		retry = 2;
		break;
	case 3:
		time = 10;
		numberColor = 8;
		retry = 3;
		break;	
	}
	halfTime = time/2;
	$("#retry").text("Number Remaining: " + retry);
	$("#colorUser").text("Number Color To User: " + numberColor);
	$("#timeRemain").text("The Time Remain: " + time);
	
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
	curColor = parseHexToRGB(color);
}

function countTime(){
	time = time - 1;
	processTime(time)
	$("#timeRemain").text("The Time Remain: " + time);
}

function processTime(time){
	switch(time){
	case halfTime:
		$("#message").text("Hurry ! Its half of time");
		break;
	case 0:
		stopGame();
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
	if(numberColor == 0){
		winGame();
	}
	else{
		stopGame();
	}
}

function parseHexToRGB(hex){
	color = {
			r: hexToR(hex),
			g: hexToG(hex),
			b: hexToB(hex)
	}
	return color;
}

function hexToR(h) {return parseInt((cutHex(h)).substring(0,2),16)}
function hexToG(h) {return parseInt((cutHex(h)).substring(2,4),16)}
function hexToB(h) {return parseInt((cutHex(h)).substring(4,6),16)}
function cutHex(h) {return (h.charAt(0)=="#") ? h.substring(1,7):h}


function processGame(x, y){
	var ctx = document.getElementById('canvas').getContext('2d');
	var c = ctx.getImageData(x, y, 1, 1).data;
	if(c[0] != 0 && c[0] != 255){
		retry = retry - 1;
		$("#retry").text("Number Remaining: " + retry);
		checkRetry();
	}else{
		numberColor = numberColor - 1;
		$("#colorUser").text("Number Color To User: " + numberColor);
	}
}

function checkRetry(){
	if(retry == 0){
		stopGame();
	}
}

function stopGame(){
	alert("Sorry !!! You lost this game");
	clearInterval(threadTime);
	$("#message").text("Sorry !!! You LOST");
	location.reload();
}

function winGame(){
	alert("YOU WIN !!!");
	location.reload();
}
