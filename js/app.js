/* 
    visit url: http://blakecwang.github.io/frogger-project/
*/


/* TO DO:
- make splash screen between level-ups
- download cool retro font
- change game with level-ups
    - scalability
    x more cars
    - different colors
        - create artwork
        - make different color artwork for levels
*/


// overall dimension controls
var blockUnit = 75;
var blockWidth = 5;
var blockHeight = 5;
var canvasWidth = blockWidth*blockUnit;
var canvasHeight = blockHeight*blockUnit;


// text controls
var titleText = "welcome to frogger";
$("#title").text(titleText);
var level, levelStart;
var levelInit = function(lev) {
    level = lev;
    $("#level").text("level " + level);
};
levelStart = 1;
levelInit(levelStart);


// image controls
var colorArray = ['white', 'green', 'yellow', 'orange', 'red', 'blue']
var imgSrcArray = [
'images/road.png',              // road - index 0
'images/water_1_white.png',     // water1 - index 1
'images/water_2_white.png',     // water2 - index 2
'images/water_3_white.png',     // water3 - index 3
'images/water_4_white.png',     // water4 - index 4
'images/grass_white.png',       // graass - index 5
'images/car_right_white.png',   // right-car - index 6
'images/truck_right_white.png', // right-truck - index 7
'images/car_left_white.png',    // left-car - index 8
'images/truck_left_white.png',  // left-truck - index 9
'images/frog_white.png']        // frog - index 10
var roadImgSrc, waterImgSrc1, waterImgSrc2, waterImgSrc3, waterImgSrc4,
    grassImgSrc, carImgSrc, truckImgSrc, frogImgSrc;
var pullImages = function() {
    roadImgSrc = imgSrcArray[0];
    waterImgSrc1 = imgSrcArray[1];
    waterImgSrc2 = imgSrcArray[2];
    waterImgSrc3 = imgSrcArray[3];
    waterImgSrc4 = imgSrcArray[4];
    grassImgSrc = imgSrcArray[5];
    carImgSrc = imgSrcArray[6];
    truckImgSrc = imgSrcArray[7];
    frogImgSrc = imgSrcArray[10];
};
pullImages();
var imgInit = function(lev) {
    for (var i=0; i<imgSrcArray.length; i++) {
        var str = imgSrcArray[i].replace('white', colorArray[lev-1]);
        imgSrcArray[i] = str;
    }
    pullImages();
};
//imgInit(levelStart);


// enemy controls
var difficultyFactor, enemyCount, enemyX, enemyY, enemySpeed, enemyImgSrc;
enemyInit = function(lev) {
//    var enemyCount = difficultyFactor * lev;
    enemyImgSrc = imgSrcArray[Math.floor(Math.random() * 2) + 6];
    enemyX = -blockUnit + Math.random() * canvasWidth;
    enemyY = blockUnit * (Math.floor((Math.random() * (blockHeight-2)) + 1));
    enemySpeed = Math.random() * 30 + 30;
};
difficultyFactor = 2;
enemyCount = difficultyFactor * levelStart;


// player controls
var playerX, playerY, playerIncrement;
playerInit = function() {
    playerX = (canvasWidth / 2) - (blockUnit / 2);
    playerY = blockUnit * (blockHeight - 1);
};
playerIncrement = blockUnit;


// enemy start
// initialize enemy objects
var Enemy = function() {
    enemyInit();
    imgInit(level);
    this.sprite = enemyImgSrc;
    this.x = enemyX;
    this.y = enemyY;
    this.speed = enemySpeed;
};


// updates enemy position
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;
    
    if (this.x > canvasWidth) {

        enemyInit(level);
        if (this.sprite.indexOf("car") != -1) {
            this.x = -(blockUnit + canvasWidth) + Math.random() * canvasWidth;
        } else {
            this.x = -(2*blockUnit + canvasWidth) + Math.random() * canvasWidth;
        }
        this.y = enemyY;
        this.speed = enemySpeed;
    }

    // handle collisions
    if (this.y === player.y) {

        var playerCX = player.x + blockUnit / 2;
        var tooClose;
        if (this.sprite.indexOf("car") != -1) {
            tooClose = blockUnit / 2;
        } else {
            tooClose = blockUnit;
        }
        var enemyCX = this.x + tooClose;

        if (Math.abs(enemyCX-playerCX) <= tooClose) {
            playerInit();
            player.x = playerX;
            player.y = playerY;

            levelInit(levelStart);
            imgInit(levelStart);

            enemyInit(level);
            enemyCount = difficultyFactor * level;
            allEnemies = [];
            for (var i=0; i<enemyCount; i++) {
                allEnemies.push(new Enemy());
            }
        }
    }
};


// render enemy objects to screen
Enemy.prototype.render = function() {
    imgInit(level);
    if (this.sprite.indexOf("car") != -1) {
        ctx.drawImage(Resources.get(this.sprite), this.x,this.y, blockUnit,blockUnit);
    } else {
        ctx.drawImage(Resources.get(this.sprite), this.x,this.y, 2*blockUnit,blockUnit);
    }
};
// enemy end

// player start
// initialize player objects
var Player = function() {
    playerInit();
    this.sprite = imgSrcArray[7];
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

    // handle level-ups
    if (this.y === 0) {

        level++;
        levelInit(level);

        imgInit(level);
        this.sprite = frogImgSrc;

        playerInit();
        this.x = playerX;
        this.y = playerY;

        enemyCount = difficultyFactor * level;
        allEnemies = [];
        for (var i=0; i<enemyCount; i++) {
            allEnemies.push(new Enemy());
        }
    }
};


// render player to screen
Player.prototype.render = function() {
    imgInit(level);
    this.sprite = frogImgSrc;
    ctx.drawImage(Resources.get(this.sprite), this.x,this.y, blockUnit,blockUnit);
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
    console.info(key + ", ");
    this.keyPressed = key;
};
// player end


// instantiate objects
var player = new Player();
var allEnemies = [];
for (var i=0; i<enemyCount; i++) {
    allEnemies.push(new Enemy());
}




