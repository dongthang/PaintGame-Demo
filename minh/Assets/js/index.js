function multiscreen(){
	console.log("call method multiscreen");
		var game = {
			element: document.getElementById("main"),
			width: 1280,
			height: 800,
			safeWidth: 1024,
			safeHeight: 720
		},
	
	resizeGame = function () {
	
		var viewport, newGameWidth, newGameHeight, newGameX, newGameY;
						
		// Get the dimensions of the viewport
		viewport = {
			width: window.innerWidth,
			height: window.innerHeight
		};
		
		// Determine game size
		if (game.height / game.width > viewport.height / viewport.width) {
			if (game.safeHeight / game.width > viewport.height / viewport.width) {
			  // A
			  newGameHeight = viewport.height * game.height / game.safeHeight;
			  newGameWidth = newGameHeight * game.width / game.height;
			} else {
			  // B
			  newGameWidth = viewport.width;
			  newGameHeight = newGameWidth * game.height / game.width;
			}
		} else {
			if (game.height / game.safeWidth > viewport.height / viewport.width) {
				// C
				newGameHeight = viewport.height;
				newGameWidth = newGameHeight * game.width / game.height;
			} else {
				// D
				newGameWidth = viewport.width * game.width / game.safeWidth;
				newGameHeight = newGameWidth * game.height / game.width;
			}
		}
		
		game.element.style.width = newGameWidth + "px";
		game.element.style.height = newGameHeight + "px";
		  
		newGameX = (viewport.width - newGameWidth) / 2;
		newGameY = (viewport.height - newGameHeight) / 2;
				
		game.element.style.margin = newGameY + "px " + newGameX + "px";
	};

	window.addEventListener("resize", resizeGame);
	resizeGame();
}


$(document).ready(function(){
	loadColor();
	//set curent color is white
	curColor = {
			r: 255,
			g: 255,
			b: 255
	};
	listColorUsed = [];
	curColorPick = "";
	//setup before play
	createLevelSession();
	displayStar();
	linkImage = "Assets/images/level" + localStorage.getItem("level") + ".png";
	startLevel(localStorage.getItem("level"));
}) 

function displayStar(){
	var stars = localStorage.getItem("star");
	list = stars.split("");
	htmlStar = "";
	for(i = 0; i < stars.length; i++){
		htmlStar += "<img alt='' src='Assets/images/star" + list[i] + ".png'>";
	}
	$("#star").html(htmlStar);
}

function createLevelSession(){
	if(localStorage.getItem("level") == null){
		localStorage.setItem("level", 1);
	}
	if(localStorage.getItem("star") == null){
		localStorage.setItem("star", "");
	}
}

function startLevel(level){
	switch(level){
	case "1":
		time = 30;
		onumberColor = 5;
		numberColor = 5;
		retry = 1;
		break;
	case "2":
		time = 40;
		onumberColor = 8;
		numberColor = 13;
		retry = 2;
		break;
	case "3":
		time = 60;
		onumberColor = 13;
		numberColor = 13;
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
	listColor = ["#FFFFFF","#00FFFF","#00CC33","#FF6633",
				"#FF3333","#FFCCCC","#FFFF66","#2CDECF",
				"#3FDE2C","#DE2C43", "#2CCADE","#96A433",
				"#3FE96C","#921FE3","#5BD3D9","#393DD3",
				"#FFFFFF", "#FFFFCC","#009900", "#003300"];
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
	curColorPick = color;
}

function countTime(){
	time = time - 1;
	processTime(time)
	$("#timeRemain").text("The Time Remain: " + time);
}

function processTime(time){
	switch(time){
	case halfTime:
		$("#message").text("HALF TIME");
		break;
	case 0:
		stopGame();
		break;
	}
	if(time < halfTime){
		changeColorTime(time);
	}
}

function changeColorTime(time){
	if(time % 2 == 0){
		$("#message").css("color","red");
	}else{
		$("#message").css("color","black");
	}
}

function startPlay(){
	startgame = true;
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
	listColorUsed.push(curColorPick);
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
	localStorage.setItem("level", 1);
	localStorage.setItem("star", "");
	location.reload();
}

function winGame(){
	alert(judgeColorUser());
	addLevel();
	location.reload();
}

function judgeColorUser(){
	var list = listColorUsed.filter(function(elem, index, self) {
	    return index == self.indexOf(elem);
	});
	count = list.length;
	result = "";
	if(count >= 1 && count <= 7){
		result = "3";
		addStarToResult(result);
		return "You win this game but you SUCK !!!";
	}
	if(count > 7 && count < onumberColor){
		result = "2";
		addStarToResult(result);
		return "You win this game, not bad, not bad";
	}
	if(count == onumberColor){
		result = "1";
		addStarToResult(result);
		return "OMG !!! YOU GOOD. YOU WIN THIS";
	}
}

function addStarToResult(result){
	localStorage.setItem("star", localStorage.getItem("star") + result);
}

function addLevel(){
	localStorage.setItem("level", parseInt(localStorage.getItem("level")) + 1);
}
