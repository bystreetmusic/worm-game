const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll("i");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let direction = undefined


const updateFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    console.log(score);
    location.reload();
}

const changeDirection = e => {
    // Changing velocity value based on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
        direction = "up"
    } else if(e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
        direction = "down"
    } else if(e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
        direction = "left"
    } else if(e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
        direction = "right"
    }
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if(gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Checking if the snake hit the food
    if(snakeX === foodX && snakeY === foodY) {
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); 
        score += 10;
        scoreElement.innerText = `Pontucao: ${score}`
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;
    
    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }
    
    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        
        if (direction == "up"){
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; ${(i == 0) ? "border-top-right-radius: 25px; border-top-left-radius: 25px" : ""}"></div>`;
        }else if (direction == "down") {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; ${(i == 0) ? "border-bottom-right-radius: 25px; border-bottom-left-radius: 25px" : ""}"></div>`;
        }else if (direction == "left") {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; ${(i == 0) ? "border-top-left-radius: 25px; border-bottom-left-radius: 25px" : ""}"></div>`;
        }else if (direction == "right") {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}; ${(i == 0) ? "border-top-right-radius: 25px; border-bottom-right-radius: 25px" : ""}"></div>`;
        }else {
            html += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        }
        
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

function isMobile() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iPad|iPhone|iPod/i.test(userAgent);
}

if (isMobile()) {
    document.querySelector('.direction-buttons').style.display = 'flex'
}


updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);