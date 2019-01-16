let canvas;
let canvasContext;
let ballX = 0;
let ballY = 225;
let xPos = 25;
let yPos = 100;
//let ballSpeedX = 25 ; 
let ballSpeedX = 5;
let ballSpeedY = 0;

let player1Score = 0
let player2Score = 0
const WINNING_SCORE = 10

let showingWinScreen = false;

let paddle1X = 40;
let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE1_HEIGHT = 45;
//const PADDLE1_HEIGHT = 100; 
const PADDLE_HEIGHT = 50;
      //const PADDLE_HEIGHT = 50;
      
function drawNet() {
  for (let i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white')
  }
}

function drawEverything(boolean) {
  //next line creates court
  colorRect(0, 0, canvas.width, canvas.height, "black")

  let bg = document.getElementById('bg')
  canvasContext.drawImage(bg, 0, 0, 960, 540)

  if (showingWinScreen) {
    canvasContext.fillStyle = 'white'

    if (player1Score >= WINNING_SCORE) {
      canvasContext.fillText("Player 1 Wins", 240, 180)
      canvasContext.font = 'bold 24px courier'

    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("Player 2 wins", 240, 180)
      canvasContext.font = 'bold 24px courier'

    }
    canvasContext.fillText("Click to Continue", 350, 00)
    return;
  }
  //drawNet()

  //next line is left paddle 
  colorRect(xPos, yPos, PADDLE_THICKNESS, PADDLE_HEIGHT, 'black')
  //colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'black')

  //next line is right paddle 
  colorRect(canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'black')

  //colorRect(xPos, yPos, 40, 40, 'darkgreen')
  // player sprites 

  if (boolean === false) {
    let player1 = document.getElementById('player1move')
    canvasContext.drawImage(player1, xPos, yPos, 154, 47)
  } else {
    let player1 = document.getElementById('player1')
    canvasContext.drawImage(player1, xPos, yPos, 36, 46)
  }

  if (boolean === 1) {
    let player2 = document.getElementById('player2move')
    canvasContext.drawImage(player2, canvas.width - 100, paddle2Y, 154, 47)
  } else {
    let player2 = document.getElementById('player2')
    canvasContext.drawImage(player2, canvas.width - 100, paddle2Y, 78, 78)

  }

  //let player2 = document.getElementById('player2')
  //canvasContext.drawImage(player2, canvas.width - 100, paddle2Y, 42, 48)
  //canvasContext.drawImage(player2, canvas.width - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT)
  //next line is the ball 
  colorCircle(ballX, ballY, 7, 'white')

  //let player2 = document.getElementById('player2')
  //canvasContext.drawImage(player2, 900, 200, 50, 50)

  canvasContext.fillText(player1Score, 100, 100)
  canvasContext.fillText(player2Score, canvas.width - 100, 100)

  //window.requestAnimationFrame(drawEverything)
}

        //window.requestAnimationFrame(drawEverything)
