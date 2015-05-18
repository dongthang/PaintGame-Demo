$(document).ready(function(){
	time = 10;
	loadColor();
}) 

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
}

function countTime(){
	time = time - 1;
	if(time == 0){
		clearInterval(threadTime);
		alert("Sorry !!! You LOST");
	}
	$("#time").text(time);
}

function startPlay(){
	threadTime = setInterval(countTime, 1000);
}



