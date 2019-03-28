var canvas,
    context,
    dragging = false,
    dragStartLocation,
    snapshot,a=0,positionX,positionY;

function getCanvasCoordinates(event) {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;

    return {x: x, y: y};
}

function takeSnapshot() {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

function restoreSnapshot() {
    context.putImageData(snapshot, 0, 0);
}

function drawLine(position) {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

function drawCircle(position) {
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
}

function drawPolygon(position, sides, angle) {
    var coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
        index = 0;

    for (index = 0; index < sides; index++) {
        coordinates.push({x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle)});
        angle += (2 * Math.PI) / sides;
    }

    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }

    context.closePath();
}

function draw(position) {

    var fillBox = document.getElementById("fillBox"),
        shape = document.querySelector('input[type="radio"][name="shape"]:checked').value,
        polygonSides = document.getElementById("polygonSides").value,
        polygonAngle = document.getElementById("polygonAngle").value,
        lineCap = document.querySelector('input[type="radio"][name="lineCap"]:checked').value;

    context.lineCap = lineCap;
    if (shape === "circle") {
        drawCircle(position);
    }
    if (shape === "line") {
        drawLine(position);
    }

    if (shape === "polygon") {
        drawPolygon(position, polygonSides, polygonAngle * (Math.PI / 180));
    }
    if (fillBox.checked) {
        context.fill();
	}
	else 
	{	
        context.stroke();
    }
}
function brushDraw(canvas, positionX, positionY) {
	if(dragging) {
		context.lineTo(positionX, positionY);
		context.stroke();
		canvas.style.cursor = "pointer";
	}
}

function dragStart(event) {
    dragging = true;
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
}

function drag(event) {
    var position;
	var shape = document.querySelector('input[type="radio"][name="shape"]:checked').value;
    if (dragging === true) {
		if(shape === "free")
		{
	var coordinates = getCanvasCoordinates(event);
	positionX = coordinates.x;
	positionY = coordinates.y;
	brushDraw(canvas, positionX, positionY);
		}
		else
		{
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        draw(position, "polygon");
    }
	}
}
function resetClick() {
	window.location.reload();
}

function saveClick() {
	var data = canvas.toDataURL(); 
	console.log(data);
	saveLink.href = data;
	saveLink.download = "myImage.png";
}
function dragStop(event) {
    dragging = false;
    restoreSnapshot();
	canvas.style.cursor = "default";
    var position = getCanvasCoordinates(event);
    draw(position, "polygon");
	context.beginPath();
}
function download(){
        var download = document.getElementById("download");
        var image = document.getElementById("canvas").toDataURL("image/png")
                    .replace("image/png", "image/octet-stream");
        download.setAttribute("href", image);

    }
	function refresh()
	{
	window.location.reload();
	}
function changeLineWidth() {
    context.lineWidth = this.value;
    event.stopPropagation();
}

function changeFillStyle() {
    context.fillStyle = this.value;
    event.stopPropagation();
}

function changeStrokeStyle() {
    context.strokeStyle = this.value;
    event.stopPropagation();
}

function changeBackgroundColor() {
    context.save();
    context.fillStyle = document.getElementById("backgroundColor").value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.restore();
}

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext('2d');
    var lineWidth = document.getElementById("lineWidth"),
        fillColor = document.getElementById("fillColor"),
        strokeColor = document.getElementById("strokeColor"),
        canvasColor = document.getElementById("backgroundColor");

    context.strokeStyle = strokeColor.value;
    context.fillStyle = fillColor.value;
    context.lineWidth = lineWidth.value;


    canvas.addEventListener('mousedown', dragStart, false);
    canvas.addEventListener('mousemove', drag, false);
    canvas.addEventListener('mouseup', dragStop, false);
    lineWidth.addEventListener("input", changeLineWidth, false);
    fillColor.addEventListener("input", changeFillStyle, false);
    strokeColor.addEventListener("input", changeStrokeStyle, false);
    canvasColor.addEventListener("input", changeBackgroundColor, false);

}

window.addEventListener('load', init, false);