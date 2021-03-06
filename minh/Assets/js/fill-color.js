

var paintBucketApp = (function () {

	"use strict";

	var context,
		canvasWidth = 817,
		canvasHeight = 800,
		startgame,
		outlineImage = new Image(),
		swatchImage = new Image(),
		backgroundImage = new Image(),
		drawingAreaX = 0,
		drawingAreaY = 0,
		drawingAreaWidth = 817,
		drawingAreaHeight = 800,
		colorLayerData,
		outlineLayerData,
		totalLoadResources = 3,
		curLoadResNum = 0,
		// Clears the canvas.
		clearCanvas = function () {

			context.clearRect(0, 0, context.canvas.width, context.canvas.height);
		},
		// Draw the elements on the canvas
		redraw = function () {

			var locX,
				locY;

			// Make sure required resources are loaded before redrawing
			if (curLoadResNum < totalLoadResources) {
				return;
			}
			clearCanvas();
			// Draw the current state of the color layer to the canvas
			context.putImageData(colorLayerData, 0, 0);


			context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);
		},

		matchOutlineColor = function (r, g, b, a) {

			return (r + g + b < 100 && a === 255);
		},

		matchStartColor = function (pixelPos, startR, startG, startB) {

			var r = outlineLayerData.data[pixelPos],
				g = outlineLayerData.data[pixelPos + 1],
				b = outlineLayerData.data[pixelPos + 2],
				a = outlineLayerData.data[pixelPos + 3];

			// If current pixel of the outline image is black
			if (matchOutlineColor(r, g, b, a)) {
				return false;
			}

			r = colorLayerData.data[pixelPos];
			g = colorLayerData.data[pixelPos + 1];
			b = colorLayerData.data[pixelPos + 2];

			// If the current pixel matches the clicked color
			if (r === startR && g === startG && b === startB) {
				return true;
			}

			// If current pixel matches the new color
			if (r === curColor.r && g === curColor.g && b === curColor.b) {
				return false;
			}

			return true;
		},

		colorPixel = function (pixelPos, r, g, b, a) {

			colorLayerData.data[pixelPos] = r;
			colorLayerData.data[pixelPos + 1] = g;
			colorLayerData.data[pixelPos + 2] = b;
			colorLayerData.data[pixelPos + 3] = a !== undefined ? a : 255;
		},

		floodFill = function (startX, startY, startR, startG, startB) {

			var newPos,
				x,
				y,
				pixelPos,
				reachLeft,
				reachRight,
				drawingBoundLeft = drawingAreaX,
				drawingBoundTop = drawingAreaY,
				drawingBoundRight = drawingAreaX + drawingAreaWidth - 1,
				drawingBoundBottom = drawingAreaY + drawingAreaHeight - 1,
				pixelStack = [[startX, startY]];

			while (pixelStack.length) {

				newPos = pixelStack.pop();
				x = newPos[0];
				y = newPos[1];

				// Get current pixel position
				pixelPos = (y * canvasWidth + x) * 4;

				// Go up as long as the color matches and are inside the canvas
				while (y >= drawingBoundTop && matchStartColor(pixelPos, startR, startG, startB)) {
					y -= 1;
					pixelPos -= canvasWidth * 4;
				}

				pixelPos += canvasWidth * 4;
				y += 1;
				reachLeft = false;
				reachRight = false;

				// Go down as long as the color matches and in inside the canvas
				while (y <= drawingBoundBottom && matchStartColor(pixelPos, startR, startG, startB)) {
					y += 1;

					colorPixel(pixelPos, curColor.r, curColor.g, curColor.b);

					if (x > drawingBoundLeft) {
						if (matchStartColor(pixelPos - 4, startR, startG, startB)) {
							if (!reachLeft) {
								// Add pixel to stack
								pixelStack.push([x - 1, y]);
								reachLeft = true;
							}
						} else if (reachLeft) {
							reachLeft = false;
						}
					}

					if (x < drawingBoundRight) {
						if (matchStartColor(pixelPos + 4, startR, startG, startB)) {
							if (!reachRight) {
								// Add pixel to stack
								pixelStack.push([x + 1, y]);
								reachRight = true;
							}
						} else if (reachRight) {
							reachRight = false;
						}
					}

					pixelPos += canvasWidth * 4;
				}
			}
		},

		// Start painting with paint bucket tool starting from pixel specified by startX and startY
		paintAt = function (startX, startY) {

			var pixelPos = (startY * canvasWidth + startX) * 4,
				r = colorLayerData.data[pixelPos],
				g = colorLayerData.data[pixelPos + 1],
				b = colorLayerData.data[pixelPos + 2],
				a = colorLayerData.data[pixelPos + 3];

			if (r === curColor.r && g === curColor.g && b === curColor.b) {
				// Return because trying to fill with the same color
				return;
			}

			if (matchOutlineColor(r, g, b, a)) {
				// Return because clicked outline
				return;
			}

			floodFill(startX, startY, r, g, b);

			redraw();
		},

		// Add mouse event listeners to the canvas
		createMouseEvents = function () {

			$('#canvas').mousedown(function (e) {
				// Mouse down location
				
				var mouseX = e.pageX - this.offsetLeft,
					mouseY = e.pageY - this.offsetTop;
					
				processGame(mouseX, mouseY);
				if ((mouseY > drawingAreaY && mouseY < drawingAreaY + drawingAreaHeight) && (mouseX <= drawingAreaX + drawingAreaWidth)) {
					paintAt(mouseX, mouseY);
				}

				
			});
		},

		// Calls the redraw function after all neccessary resources are loaded.
		resourceLoaded = function () {

			curLoadResNum += 1;
			if (curLoadResNum === totalLoadResources) {
				createMouseEvents();
				redraw();
			}
		},

		// Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
		init = function () {
			

			// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
			var canvas = document.createElement('canvas');
			canvas.setAttribute('width', canvasWidth);
			canvas.setAttribute('height', canvasHeight);
			canvas.setAttribute('id', 'canvas');
			document.getElementById('right').appendChild(canvas);

			if (typeof G_vmlCanvasManager !== "undefined") {
				canvas = G_vmlCanvasManager.initElement(canvas);
			}
			context = canvas.getContext("2d");

			// Load images
			backgroundImage.onload = resourceLoaded;
			backgroundImage.src = linkImage;

			swatchImage.onload = resourceLoaded;
			swatchImage.src = linkImage;

			outlineImage.onload = function () {
				context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);

				// Test for cross origin security error (SECURITY_ERR: DOM Exception 18)
				try {
					outlineLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
				} catch (ex) {
					window.alert("Application cannot be run locally. Please run on a server.");
					return;
				}
				clearCanvas();
				colorLayerData = context.getImageData(0, 0, canvasWidth, canvasHeight);
				resourceLoaded();
			};
			outlineImage.src = linkImage;
		};

	return {
		init: init
	};
}());

