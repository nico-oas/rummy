const canvas = document.getElementById('canvas');
const center = document.getElementById('center');
const ctx = canvas.getContext('2d');
var centerX, centerY;
var currentRotation = 0;
var wantedRotation = 0;
var globalOffset = 0;
var players = 2;
var currentPlayer = -1;
var gameRunning = false;
var animationRunning = false;

function drawArrow(centerX, centerY){
    var centerA = centerX - 200;
    var centerB = centerX + 200;
    ctx.beginPath();
    ctx.fillStyle = "hsl(" + currentRotation + ", 100%, 50%)";
    ctx.moveTo(centerX, canvas.height);
    ctx.lineTo(centerA, centerY);
    ctx.lineTo(centerB, centerY);
    ctx.fill();
    ctx.textAlign = "center";
    ctx.font = "3rem sans-serif";
    ctx.fillStyle = "black";
    ctx.fillText("Spieler " + (currentPlayer+1), centerX, centerY + 100)
    ctx.closePath();
}

function rotate(degree, rotatePoint) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.translate(rotatePoint.x, rotatePoint.y);
    ctx.rotate((Math.PI / 180)*degree);
    ctx.translate(-rotatePoint.x, -rotatePoint.y);
}

function animate(){
    animationRunning = true;
    let offset = Math.sin((Math.PI / 180)*(-currentRotation)).toFixed(2);
    canvas.style.margin = "0 0 0 " + offset*globalOffset;
    rotate(1, {x: centerX, y: centerY});
    drawArrow(centerX, centerY + 100);
    currentRotation = (currentRotation + 1)%360;
    if(wantedRotation != currentRotation){
        requestAnimationFrame(animate);
    }else{
        animationRunning = false;
    }
}

function initAnimation(){
    if (canvas.getContext) {
        //set size
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        globalOffset = (window.innerWidth - window.innerHeight) / 2;
    
        //get center
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
    }
}

/* functions for setup */

function decrease(){
    if(players > 2){
        players--;
        document.getElementById('count').innerHTML = players;
        if(players == 2){
            document.getElementById('decrease').disabled = true;
        }else{
            document.getElementById('decrease').disabled = false;
        }
        document.getElementById('increase').disabled = false;
    }
}

function increase(){
    if(players < 8){
        players++;
        document.getElementById('count').innerHTML = players;
        if(players == 8){
            document.getElementById('increase').disabled = true;
        }else{
            document.getElementById('increase').disabled = false;
        }
        document.getElementById('decrease').disabled = false;
    }
}

function next(){
    if(gameRunning){
        currentPlayer = (currentPlayer+1)%players;
        wantedRotation = (360*currentPlayer)/players;
        if(!animationRunning){
            animate();
        }
    }
}

function start(){
    center.innerHTML = "";
    gameRunning = true;
    initAnimation();
    currentPlayer++;
    drawArrow(centerX, centerY + 100);
}