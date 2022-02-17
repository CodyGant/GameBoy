
let score = 0;
let squares = [];
let currentSnake = [2,1,0];
let direction = 1;
const width = 10;
let appleIndex = 0;
let grow = +1;
let death =[0];
let closeScreen = 1;
let screenInterval = 50;
let intervalTime = 1000;
let speed = 0.9;
let timerId = 0;
let alive = false;
let highscore = 0;


const grid = document.querySelector('.grid');
const startButton = document.getElementById('start');
const scoreEl = document.getElementById('score');
const selectButton = document.getElementById('select');
const displayGameName = document.querySelector('#displayGame');

const youDied = document.querySelector('.deathText');
const playText = document.querySelector('.playAgain');
const selectMenu = document.querySelector('.selectMenu');
const resumeGame = document.querySelector('#resumeGame');
const highScore = document.querySelector('#highScore');
const snakeMenu = document.querySelector('#snakeMenu');
const highScoreEl = document.querySelector('.highScore');
const pressStart = document.querySelector('.pressStart');
const snakeGif = document.querySelector('.snaketest');
const square = document.createElement('div');
const snakeStyle = document.querySelector('.snake')

localStorage.setItem("highscore",0);

//hiding html elements
selectMenu.style.display = 'none'
playText.style.display = 'none';
youDied.style.display = "none";
highScoreEl.style.display = 'none';
scoreEl.style.display = 'none';
displayGameName.classList.add('displayGame')

const menuArr = [highScore, snakeMenu, resumeGame];
let add = 0;






//creates the grid for the snake (makes 100 divs where the snake can walk)
function createGrid() {
    //create 100 of these elements with a for loop
    for (let i=0; i < width*width; i++) {
     //create element
    const square = document.createElement('div');
    //add styling to the element
    square.classList.add('square');
    //put the element into our grid
    grid.appendChild(square);
    //push it into a new squares array    
    squares.push(square);
    
    
    }
}createGrid()


   



//start game function
function startGame(){
    
    displayGameName.style.display = 'none';
    snakeGif.style.display = 'none';
    displayGameName.classList.remove('displayGame')
    displayGameName.classList.add('displayGameStart')
    pressStart.style.display = 'none';
    document.addEventListener('keydown', control);
    squares[appleIndex].classList.remove('apple');
    alive = true;
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    squares[currentSnake[0]].classList.add('snakeHead');
    generateApples();
    clearInterval(timerId);
    direction = 1;
    timerId = 0;
    score = 0;
    scoreEl.textContent = score;
    speed = 0.9;
    playText.style.display = 'none';
    youDied.style.display = "none";
    intervalTime = 1000;
    timerId = setInterval(move, intervalTime);
    currentSnake.forEach(index => squares[index].classList.remove('snake', 'snakeHead'));
    currentSnake = [2,1,0];
    squares[currentSnake[0]].classList.add('snakeHead');
    currentSnake.forEach(index => squares[index].classList.add('snake'));
    scoreEl.style.display = 'inline';
    scoreEl.textContent = 'Score:' + score;
    clearDeath();
    
}




//if snake hits the edges of the grid (you die!!!)
function move() {
    //if the snake hits bottom of the grid
    if(
    (currentSnake[0] + width >= width*width && direction === width) || //if snake has hit bottom
    (currentSnake[0] % width === width-1 && direction === 1) || //if snake has hit right wall
    (currentSnake[0] % width === 0 && direction === -1) || //if snake has hit left wall
    (currentSnake[0] - width < 0 && direction === -width) ||//if snake has hit top
    squares[currentSnake[0] + direction].classList.contains('snake')
    
    )return clearInterval(timerId),  youDied.style.display = "inline",  sleep(), alive = false
    




    //remove last element from our currentSnake array
    const tail = currentSnake.pop();
    //remove styling from last element
    squares[tail].classList.remove('snake');
    //add square in direction we are heading
    currentSnake.unshift(currentSnake[0] + direction);
    
   
    
    
        //deal with snake head getting the apple
        if(currentSnake[0] === appleIndex){
            squares[appleIndex].classList.remove('apple');
            squares[tail].classList.add('snake');
            currentSnake.push(tail);
            score++;
            scoreEl.textContent = 'Score:' + score;
            clearInterval(timerId);
            intervalTime = intervalTime * speed;
            timerId = setInterval(move, intervalTime);
            
            generateApples();
            

        }
        //saves the highest score in local storage
        if (score > parseInt(localStorage.getItem("highscore"))) {
            localStorage.setItem("highscore", score);
          }

    
    //add styling so we can see it
    squares[currentSnake[0]].classList.add('snakeHead', 'snake')
    squares[currentSnake[1]].classList.add('snake')
    squares[currentSnake[1]].classList.remove('snakeHead')
    
   
    
}



//puts a 'apple' on grid for snake to eat
function generateApples() {
    do {
        //generate a random number
        appleIndex = Math.floor(Math.random() * squares.length)
    } while (squares[appleIndex].classList.contains('snake'))
    squares[appleIndex].classList.add('apple')
    
}



//using keys to move snake in certain directions
function control(e) {
    e.preventDefault();
    if (e.key === 'ArrowRight') {
        direction = 1
    } else if (e.key === 'ArrowUp') { 
        direction =  -width
    } else if (e.key === 'ArrowLeft') { 
        direction = -1
    } else if (e.key === 'ArrowDown') {  
        direction = + width
    }
}
//document.addEventListener('keydown', control)
startButton.addEventListener('click', startGame)
selectButton.addEventListener('click', menu)



//fills grid with diffrent style when you die 
async function sleep(){
    //slows the for loop down so its not instant
    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }
    
    squares[appleIndex].classList.remove('apple')
    closeScreen = 1
    for(let i =0; i < 99; i++){
        await sleep(20)
        death.push(closeScreen++)
        death.forEach(index => squares[index].classList.add('death'))
    }
    
    

}

//clears the .death class from the squares in grid that sleep() added to them
function clearDeath(){
    death.forEach(index => squares[index].classList.remove('death'))
    death.splice(0, death.length)
    death = [0]
    closeScreen = 1

}

//shows menu when you press select button and pauses game
function menu(){
    
    startButton.removeEventListener('click', startGame)
    document.addEventListener('keydown', controlMenu)
    document.removeEventListener('keydown', control)
    youDied.style.display = "none"
    clearInterval(timerId)
    selectMenu.style.display = 'inline'
    displayGameName.style.display = 'inline'
}

//hides the display and resumes game depending if youre alive
function resume(){
    displayGameName.style.display = 'none';
    snakeGif.style.display = 'none';
    pressStart.style.display = 'none';
    startButton.addEventListener('click', startGame)
    document.removeEventListener('keydown', controlMenu)
    document.removeEventListener('keydown',menu)
    document.addEventListener('keydown', control)
    highScoreEl.style.display = 'none'

    if (alive === true){
        squares[appleIndex].classList.add('apple');
        selectMenu.style.display = 'none';
        displayGameName.style.display = 'none';
        timerId = setInterval(move, intervalTime);
    }else{
        selectMenu.style.display = 'none';
        displayGameName.style.display = 'none';
        startGame();
        

    }
    
    
    
    
    

}

//controls the keys for the menu section 
function controlMenu(e) {
    e.preventDefault();
    
    //shows highscore on enter
    if (e.key === 'Enter' & menuArr[add] === highScore){
        highScoreEl.textContent = 'high Score: ' + localStorage.getItem("highscore")
        highScoreEl.style.display = 'inline'

        //brings you to main menu on enter
        }else if (e.key === 'Enter' & menuArr[add] === snakeMenu){
            window.location.reload();
 

        //resumes game on enter
        }else if (e.key === 'Enter' & menuArr[add] === resumeGame){
            e.preventDefault();
            resume()
            
        //resets the menu array to 0 when you reach the end of the array and press down arrow
        }if (e.key === 'ArrowDown' & menuArr[add] === resumeGame){
            menuArr[add].classList.remove('active')
            add = 0
            menuArr[add].classList.add('active')

        //changes the right caret through the menu array
        }else if (e.key === 'ArrowDown') { 
            add++
            menuArr[add].classList.add('active')
            menuArr[add-add].classList.remove('active')
            menuArr[add -1].classList.remove('active')
    }
}

        


