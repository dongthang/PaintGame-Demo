var canvas;
var canvasWidth = 600;
var canvasHeight = 804;
var paint;
var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var canvasDiv;
var context;
var colorPurple = "#cb3594";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var curColor = colorPurple;
var clickColor = new Array();
var clickSize = new Array();
var curSize = "large"; //small, normal, large, huge
var clickTool = new Array();
var curTool = "crayon";//crayon, marker, eraser
var crayonTextureImage = new Image();
var outlineImage = new Image();
var drawingAreaX = 0;
var drawingAreaY = 0;
var drawingAreaWidth = canvasWidth;
var drawingAreaHeight = canvasHeight;
var startBtn1X = 24;
var startBtn1Y = 22;
var endBtn1X = 132;
var endBtnY = 46;

function multiscreen(){
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
				
		// Set the new padding of the game so it will be centered
		game.element.style.margin = newGameY + "px " + newGameX + "px";
	};

	window.addEventListener("resize", resizeGame);
	resizeGame();
}


function prepareCanvas(){
	
	canvasDiv = document.getElementById('right');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasDiv.offsetWidth);
	canvas.setAttribute('height', canvasDiv.offsetHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d");
	
	
	outlineImage.onload = function(){
		context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
	}
	outlineImage.src = "Assets/images/image1.png";
	
	$('#canvas').mousedown(function(e){
		console.log("mousedown");
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		
		if(mouseX > startBtn1X && mouseX < endBtn1X && mouseY > startBtn1Y && mouseY < endBtnY){
			console.log("save image");
			//saveCanvas(canvas, path, type, options)
		}else{
			paint = true;
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			redraw();
		}
		
	});
	
	$('#canvas').mousemove(function(e){
		if(paint){
			console.log("mousemove");
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	$('#canvas').mouseup(function(e){
		paint = false;
		console.log("mouseup");
	});
	
	$('#canvas').mouseleave(function(e){
		console.log("mouseleave");
		paint = false;
	});
	
	function addClick(x, y, dragging){
		console.log("addclick");
		clickX.push(x);
		clickY.push(y);
		clickDrag.push(dragging);
		if(curTool == "eraser"){
			clickColor.push("white");
		}else{
			clickColor.push(curColor);
		}
		clickSize.push(curSize);
	}
	
	function redraw(){
		console.log("round");
		context.clearRect(0,0, context.canvas.width, context.canvas.height);
		context.lineJoin = "round";
		context.save();
		context.beginPath();
		context.rect(drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
		context.clip();
		var radius;
		
		for(var i = 0; i < clickX.length; i++){		
			if(clickSize[i] == "small"){
				radius = 2;
			}else if(clickSize[i] == "normal"){
				radius = 5;
			}else if(clickSize[i] == "large"){
				radius = 10;
			}else if(clickSize[i] == "huge"){
				radius = 20;
			}else{
				alert("Error: Radius is zero for click " + i);
				radius = 0;	
			}
		}
		context.restore();
		
		for(var i = 0; i <clickX.length; i++){
			context.beginPath();
			if(clickDrag[i] && i){
				context.moveTo(clickX[i-1], clickY[i - 1]);
			}else{
				context.moveTo(clickX[i] - 1, clickY[i]);
			}
			context.lineTo(clickX[i], clickY[i]);
			context.closePath();
			context.strokeStyle = clickColor[i];
			context.lineWidth = radius;
			context.stroke();
		}
		context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
		if(curTool == "crayon"){
			context.globalAlpha = 0.4;
			context.drawImage(crayonTextureImage, 0, 0, canvasWidth, canvasHeight);
		}
		context.globalAlpha = 1;
		
	}
}