const canvas = document.getElementById('canvas');
const center = document.getElementById('center');
const ctx = canvas.getContext('2d');
var centerX, centerY, countdown;
var currentRotation = 0;
var wantedRotation = 0;
var globalOffset = 0;
var players = 2;
var currentPlayer = -1;
var gameRunning = false;
var animationRunning = false;
var fullscreen = false;
var totalSeconds = 0;
var currentSeconds = 0;
var textOffset = 4 * parseFloat(getComputedStyle(document.documentElement).fontSize);

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
    ctx.font = "700 3rem sans-serif";
    ctx.fillStyle = "#222";
    ctx.fillText("Spieler " + (currentPlayer+1), centerX, centerY + textOffset);
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
    drawArrow(centerX, centerY + textOffset);
    currentRotation = (currentRotation + 1)%360;
    if(wantedRotation != currentRotation){
        requestAnimationFrame(animate);
    }else{
        animationRunning = false;
    }
}

function initCanvas(){
    if (canvas.getContext) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        globalOffset = (window.innerWidth - window.innerHeight) / 2;
        centerX = canvas.width / 2;
        centerY = canvas.height / 2;
    }
}

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
        clearInterval(countdown);
        resetTimer();
        currentPlayer = (currentPlayer+1)%players;
        wantedRotation = (360*currentPlayer)/players;
        if(!animationRunning){
            animate();
        }
    }
}

function toggleFullscreen(){
    if(fullscreen){
        fullscreen = false;
        document.exitFullscreen();
    }else{
        fullscreen = true;
        document.getElementsByTagName('body')[0].requestFullscreen();
    }
    initCanvas();
}

function validateInputs(){
    let minutes = document.getElementById("minutes");
    let seconds = document.getElementById("seconds");
    if(isNaN(minutes.value) || minutes.value > 5){
        minutes.value = "1";
    }
    if(isNaN(seconds.value) || seconds.value >= 60){
        seconds.value = "0";
    }
    if(seconds.value.length === 1) {
        seconds.value = '0' + seconds.value;
    }
}

function displayTime(seconds){
    let s = seconds%60;
    center.dataset.time = Math.floor(seconds/60) + ":" + (s<10?"0"+s:s);
}

function resetTimer(){
    center.style.color = "";
    if(totalSeconds > 0){
        currentSeconds = totalSeconds;
        displayTime(currentSeconds);
        countdown = setInterval(function(){
            currentSeconds--;
            displayTime(currentSeconds);
            if(currentSeconds < 5){
                document.getElementsByTagName("html")[0].style.filter = "invert(1)";
                setTimeout(function(){
                    document.getElementsByTagName("html")[0].style.filter = "";
                }, 500);
            }
            if(currentSeconds == 0){
                clearInterval(countdown);
                center.style.color = "red";
            }
        }, 1000);
    }
}

function start(){
    let minutes = document.getElementById("minutes").value;
    let seconds = document.getElementById("seconds").value;
    totalSeconds = parseInt(seconds) + 60*parseInt(minutes);
    center.innerHTML = "";
    resetTimer();
    gameRunning = true;
    currentPlayer++;
    initCanvas();
    drawArrow(centerX, centerY + textOffset);
}