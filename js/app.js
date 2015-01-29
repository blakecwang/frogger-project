/* TO DO:
- make different color artwork for levels
    - use color filter
x make level number change
- make splash screen between level-ups
- download cool retro font
- maybe make it grow with level-ups
- fix magically appearing enemies
- increase game difficulty with level-ups
*/

// text controls
var level = 1;
var titleText = "welcome to frogger";
var levelText = "level " + level;
$("#title").text(titleText);
$("#level").text(levelText);


// color controls
var white = {"r" : 255, "g" : 255, "b" : 255};
var green = {"r" : 0, "g" : 255, "b" : 0};
var yellow = {"r" : 255, "g" : 255, "b" : 0};
var orange = {"r" : 255, "g" : 255, "b" : 100};
var red = {"r" : 255, "g" : 0, "b" : 0};
var blue = {"r" : 0, "g" : 0, "b" : 255};
var colors = [white, green, yellow, orange, red, blue];


// overall dimension controls
var blockUnit = 100;
var blockWidth = 5;
var blockHeight = 6;
var canvasWidth = blockWidth*blockUnit;
var canvasHeight = blockHeight*blockUnit;


// image controls
var waterImgSrc = 'images/square-blue.png';
var roadImgSrc = 'images/square-black.png';
var grassImgSrc = 'images/square-yellow.png';
var enemyImgSrc = 'images/van.png';
var playerImgSrc = 'images/frog.png';


// enemy controls
var enemyCount = 10;
var enemyX = -blockUnit + Math.random() * canvasWidth;
var enemyY;
var enemySpeed;
enemyInit = function() {
    enemyX = -blockUnit + Math.random() * canvasWidth;
    enemyY = blockUnit * (Math.floor((Math.random() * 3) + 1));
    enemySpeed = Math.random() * 100 + 100;
};


// player controls
var playerX;
var playerY;
var playerIncrement = blockUnit;
playerInit = function() {
    playerX = (canvasWidth / 2) - (blockUnit / 2);
    playerY = blockUnit * 4;
};


// enemy start
// initialize enemy objects
var Enemy = function() {
    enemyInit();
    this.sprite = enemyImgSrc;
    this.x = enemyX;
    this.y = enemyY;
    this.speed = enemySpeed;
};


// updates enemy position
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;
    
    if (this.x > canvasWidth) {
        enemyInit();
        enemyX = -(blockUnit + canvasWidth) + Math.random() * canvasWidth;
        this.x = enemyX;
        this.y = enemyY;
        this.speed = enemySpeed;
    }

    //handle collisions
    var enemyCenterX = this.x + blockUnit / 2;
    var enemyCenterY = this.y + blockUnit / 2;
    var playerCenterX = player.x + blockUnit / 2;
    var playerCenterY = player.y + blockUnit / 2;
    var distance = Math.sqrt(Math.pow((enemyCenterX - playerCenterX), 2)
                 + Math.pow((enemyCenterY - playerCenterY), 2));
    if (distance <= blockUnit / 2) {

        playerInit();
        player.x = playerX;
        player.y = playerY;

        allEnemies = [];
        for (var i=0; i<enemyCount; i++) {
            allEnemies.push(new Enemy());
        }

        level = 1;
        levelText = "level " + level;
        $("#level").text(levelText);
    }
};


// render enemy objects to screen
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
// enemy end

// player start
// initialize player objects
var Player = function() {
    playerInit();
    this.sprite = playerImgSrc;
    this.x = playerX;
    this.y = playerY;
};


// update player position
Player.prototype.update = function() {
    switch (this.keyPressed) {
    case 'left':
        if (this.x > 0) {
            this.x -= playerIncrement;
        }
        break;
    case 'up':
        if (this.y > 0) {
            this.y -= playerIncrement;
        }
        break;
    case 'right':
        if (this.x < canvasWidth - blockUnit) {
            this.x += playerIncrement;
        }
        break;
    case 'down':
        if (this.y < canvasHeight - blockUnit) {
            this.y += playerIncrement;
        }
        break;
    }
    this.keyPressed = '';

    if (this.y === 0) {
        playerInit();
        this.x = playerX;
        this.y = playerY;

        level++;
        levelText = "level " + level;
        $("#level").text(levelText);
    }
};


// render player to screen
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// listens for key presses
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});


// handle keypresses sent by event listener
Player.prototype.handleInput = function(key) {
    console.info( key + ", ");
    this.keyPressed = key;
};
// player end


// instantiate objects
var player = new Player();
var allEnemies = [];
for (var i=0; i<enemyCount; i++) {
    allEnemies.push(new Enemy());
}




