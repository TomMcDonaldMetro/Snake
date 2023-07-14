// buttons
const start = document.getElementById("start");
start.addEventListener("click", startSnake);

const end = document.getElementById("end");
end.addEventListener("click", () => {
    window.location.reload();
});

// Necessaries.
let gameId; // keeps track of the setInterval Id
let direction = "right"; // default direction if the user doesn't press anything.
let prevDirection = direction;
let interval = 400; // game speed.
let ate = false; // keeps track of the food on the board.
let snake = []; // list of tiles belonging to the snake.
let tokens = new Map(); // keep track of empty spaces for the randomly generated food.
for(let i = 0; i < 1600; i++){
    tokens.set(i, true);
} // populate the food map once. Updates in snakeMove function.
createGrid();

// take user input from keyboard. 
// added a "direction" variable for readability.
document.onkeydown = checkKey;
function checkKey(e) {

    e = e || window.event; 

    if (e.keyCode == '38') {
        if(prevDirection === 'down'){ // can't go inside self.
            direction = 'down'; 
            console.log("blocked invalid move.");
        }else{
            console.log("up");
            direction = "up";
        }
        
    }
    else if (e.keyCode == '40') {
        if(prevDirection === 'up'){ // can't go inside self.
            direction = 'up'; 
            console.log("blocked invalid move.");
        }else{
            console.log("down");
            direction = "down";
        }
        
    }
    else if (e.keyCode == '37') {
        if(prevDirection === 'right'){ // can't go inside self.
            direction = 'right'; 
            console.log("blocked invalid move.");
        }else{
            console.log("left");
            direction = "left";
        }
        
    }
    else if (e.keyCode == '39') {
        if(prevDirection === 'left'){ // can't go inside self.
            direction = 'left'; 
            console.log("blocked invalid move.");
        }else{
            console.log("right");
            direction = "right"; 
        }
        
    }

}



// set up the board.
function createGrid(){
    let grid = document.getElementById("grid");
    let count = 0;
    while(count < 1600){
        let row = grid.insertRow();
        for(let i = 0; i < 40; i++){
            let cell = row.insertCell(i);
            cell.id = count;
            count++;
        }
    }
    
}

// pseudo function. setinterval calls with a direction from the keyboard.
function updateBoard(){

    let front = snake[0];
    
    switch(direction){
        case "right":
            if((front+1) % 40 ==0){
                front = front - 39;
                break;
            }
            front = front + 1; // pseudo. The new direction is now 1 tile to the right (+1).
            break;
        case "left": 
            if(front % 40 == 0){
                 front = front + 39;
                 break;   
            }
            front = front - 1; // 1 tile to the left of current position.
            break;
        case "down": 
            if(front >= 1560 && front < 1600){
                front = front-1560;
                break;
            }
            front = front + 40; // move down 1 tile is 40 tiles forward.
            break;
        case "up":
            if(front >= 0 && front < 40){
                front = front+1560;
                break;
            }
            front = front - 40; // move up 1 tile 40 tiles backwards.
            break;
        default:
            console.log(direction);
            console.log("didn't switch correctly");
    }

    snakeMove(front);
}

// initial state of the game after pressing "Start".
function startSnake(){
    // create 4 tiles dedicated to snake.
    for(let i = 43; i >= 40; i--){
        addToSnake(i);
        tokens.delete(i); // tokens
    }
    document.getElementById("snake-score").innerHTML = snake.length;
    generateFood();

    gameId = setInterval(updateBoard, interval);

}

// increases the length of the snake.
function addToSnake(id){
    let cell = document.getElementById(id);
    cell.classList.add("snakebody");
    snake.push(id); 
}

function snakeMove(front){
    
    // check if we crash
    if(document.getElementById(front).classList.contains("snakebody")){
        crashed();
    }

    let last = snake[snake.length - 1];
    // the snake all moves to the position in front.
    for(let i = snake.length - 1; i > 0; i--){
        snake[i] = snake[i-1]; // everything moves to 1 position before it.
    }
    // front moves 1 position in a direction.
    snake[0] = front;
    if(front == document.getElementsByClassName("food")[0].id){
        ateFood(front);
    }
    // update colors on the board.
    for(let i = 0; i < snake.length; i++){
        let cell = document.getElementById(snake[i]);
        cell.classList.add("snakebody");
    }
    document.getElementById(last).classList.remove("snakebody");
    
    tokens.set(last, true);
    tokens.delete(front);

    // once we move, save this information to prevent illegal moves.
    // user can go left after going right by pressing up/down in between.
    prevDirection = direction;
}


// map keeps track of empty spaces.
// when we need to generate a random food position we take a random
// open location from the map.
function generateFood(){    

    let arr = Array.from(tokens.keys());
    let val = arr[Math.floor(Math.random() * arr.length)]
    let cell = document.getElementById(val);
    cell.classList.add("food");

}

// when the snake eats the food: speed increases, length increases, score increases.
function ateFood(frontVal){
    speedup();
    document.getElementById(frontVal).classList.remove("food");
    generateFood();
    addToSnake(snake[snake.length - 1]);
    if(snake.length === 1600){ // if the length hits maximum tiles hardcoded at 40x40;
        winner();
    }
    ate = true;
    // update the score.
    document.getElementById("snake-score").innerHTML = snake.length;
}

// increases the gamespeed by clearing currently executing 
function speedup(){
    clearInterval(gameId);
    gameId = setInterval(updateBoard, interval-=.25);
}

// ends the game and displays a message to the user.
function crashed(){

    clearInterval(gameId);
    document.getElementById("message").innerHTML = "Game Over! Your score was: " + snake.length;

}

// nobody wins but if someone does...
function winner(){
    clearInterval(gameId);
    document.getElementById("message").innerHTML = "Congratulations! Your score was: " + snake.length;

}
