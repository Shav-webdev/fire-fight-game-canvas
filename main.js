const CANVAS = document.getElementById('canvas')
const ctx = CANVAS.getContext('2d')
const startBtn = document.getElementById('startBtn')
const gameScore = document.getElementById('score')


const initialSet = () => {
    positionX = canvasW / 2;
    positionY = canvasH - 15;
    stepToMoveX = 8;
    stepToMoveY = -3;
    standX = (canvasW / 2) - (standW / 2);
    standY = canvasH - 5;
    intervalID = undefined;
    isRightBtnPressed = false;
    isLeftBtnPressed = false;
    score = 0;
}
const canvasW = CANVAS.width
const canvasH = CANVAS.height
let intervalID, positionX, positionY, stepToMoveX, stepToMoveY, standX, standY, isRightBtnPressed, isLeftBtnPressed, score;
let boxes = [];
const boxWidth = 25;
const boxHeight = 10;
const interval = 10;
const circleRadius = 10;
const standW = 30;
const standH = 5;
let scoreTxt = ''

const rowLength = 8;
const columnLength = 3;

const standNavigation = () => {
    const handleKeyDown = (e) => {
        //ArrowRight
        if (e.keyCode === 39) {
            isRightBtnPressed = true
        }
        //ArrowLeft
        if (e.keyCode === 37) {
            isLeftBtnPressed = true
        }
    }

    const handleKeyUp = (e) => {
        //ArrowRight
        if (e.keyCode === 39) {
            isRightBtnPressed = false
        }
        //ArrowLeft
        if (e.keyCode === 37) {
            isLeftBtnPressed = false
        }
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
}

const createInitialBoxes = () => {
    for (let i = 0; i < rowLength; i++) {
        boxes[i] = []
        for (let j = 0; j < columnLength; j++) {
            boxes[i][j] = {x: 0, y: 0, isVisible: true}
        }
    }
}

const drawBoxes = () => {
    for (let i = 0; i < rowLength; i++) {
        for (let j = 0; j < columnLength; j++) {
            const boxItem = boxes[i][j]
            if (boxItem.isVisible) {
                const boxPosX = 15 + (i * (interval + boxWidth))
                const boxPosY = 10 + (j * (interval + boxHeight))

                boxItem.x = boxPosX
                boxItem.y = boxPosY;


                ctx.beginPath();
                ctx.rect(boxPosX, boxPosY, boxWidth, boxHeight)
                ctx.fillStyle = '#c98612'
                ctx.fill()
                ctx.strokeStyle = "#670909";
                ctx.stroke();
                ctx.closePath()
            }

        }
    }
}

const drawCircle = () => {
    ctx.beginPath()
    ctx.arc(positionX, positionY - 1, circleRadius, 0, 2 * Math.PI, false)
    ctx.fillStyle = '#118B8B'
    ctx.fill()
    ctx.closePath()
    ctx.strokeStyle = "#000";
    ctx.stroke();
}

const drawScore = () => {
    scoreTxt = 'Your current score is ' + (score || 0)
    gameScore.innerText = scoreTxt
}

const drawStand = () => {
    ctx.beginPath()
    ctx.rect(standX, standY, standW, standH)
    ctx.fillStyle = '#4f3508'
    ctx.fill()
    ctx.strokeStyle = "#000";
    ctx.stroke();
    ctx.closePath()
}
initialSet()
drawCircle()
drawStand()
createInitialBoxes()
drawBoxes()
standNavigation()
drawScore()

const checkGameWon = () => {
    if (score === rowLength * columnLength) {
        alert('Congratulations you won the game !')
        clearInterval(intervalID)
        initialSet()
        createInitialBoxes()
    }
}

const detectDirectionOfBallMovement = () => {
    if (positionX + stepToMoveX >= canvasW || positionX + stepToMoveX <= 0) {
        stepToMoveX = -stepToMoveX
    }

    if (positionY + stepToMoveY > canvasH - circleRadius) {
        if (positionX + stepToMoveX > standX &&
            positionX + stepToMoveX < standX + standW) {
            stepToMoveY = -stepToMoveY
            stepToMoveX = stepToMoveX + (positionX + stepToMoveX - standX)/100
        }
    }

    if (positionY + stepToMoveY < 0) {
        stepToMoveY = -stepToMoveY
    }

    for (let i = 0; i < boxes.length; i++) {
        for (let j = 0; j < boxes[i].length; j++) {
            const boxItem = boxes[i][j]

            if (boxItem.isVisible) {
                if (positionX > boxItem.x && positionX < boxItem.x + boxWidth &&
                    positionY > boxItem.y && positionY < boxItem.y + boxHeight) {
                    score += 1
                    boxItem.isVisible = false;
                    stepToMoveY = -stepToMoveY
                    checkGameWon()
                }
            }
        }
    }
}


const gameOver = () => {
    if (positionY === canvasH) {
        alert('Game over !')
        clearInterval(intervalID)
        initialSet()
        createInitialBoxes()
    }
}



const startGame = () => {
    if (!intervalID) {
        intervalID = setInterval(() => {
            if (isRightBtnPressed && standX + standW <= canvasW) {
                standX += 10
            }

            if (isLeftBtnPressed && standX >= 0) {
                standX -= 10
            }

            detectDirectionOfBallMovement()
            positionX += stepToMoveX
            positionY += stepToMoveY
            gameOver()
            ctx.clearRect(0, 0, canvasW, canvasH)
            drawCircle()
            drawStand()
            drawBoxes()
            drawScore()
        }, 40)
    }
}
startBtn.addEventListener('click', startGame)







