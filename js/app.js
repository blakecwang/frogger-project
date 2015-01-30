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
var roadImgSrc = 'images/road.png';
var waterImgSrc1 = 'images/water_1_blue.png';
var waterImgSrc2 = 'images/water_2_blue.png';
var waterImgSrc3 = 'images/water_3_blue.png';
var waterImgSrc4 = 'images/water_4_blue.png';
var grassImgSrc = 'images/grass_blue.png';
var carImgSrc = 'images/car_right_blue.png';
var truckImgSrc = 'images/truck_right_blue.png';
var frogImgSrc = 'images/frog_green.png';
var imgSrcArray = [waterImgSrc1,
                   waterImgSrc2,
                   waterImgSrc3,
                   waterImgSrc4,
                   grassImgSrc,
                   carImgSrc,       // car: index 5
                   truckImgSrc,     // truck index 6
                   frogImgSrc];
var colorArray = ['white', 'green', 'yellow', 'orange', 'red', 'blue']
var imgInit = function(lev) {
    for (imgSrc in imgSrcArray) {
        imgSrc.replace('%color%', colorArray[lev-1]);
    }
};
imgInit(levelStart);


// enemy controls
var difficultyFactor, enemyCount, enemyX, enemyY, enemySpeed, enemyImgSrc;
enemyInit = function(lev) {
//    var enemyCount = difficultyFactor * lev;
    enemyImgSrc = imgSrcArray[Math.floor(Math.random() * 2) + 5];
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

    //handle collisions
    var enemyCX=-1000, enemyCX1=-1000, enemyCX2=-1000, 
        enemyCY=-1000, playerCX=-1000, playerCY=-1000;

    if (this.sprite.indexOf("car") != -1) {
        enemyCX = this.x + blockUnit / 2;
    } else {
        enemyCX1 = this.x + blockUnit / 4;
        enemyCX2 = this.x + 3 * blockUnit / 4;
    }
    enemyCY = this.y + blockUnit / 2;
    playerCX = player.x + blockUnit / 2;
    playerCY = player.y + blockUnit / 2;

    var distance = function(x1,y1,x2,y2) {
        return Math.sqrt(Math.pow((x1 - x2), 2)
               + Math.pow((y1 - y2), 2));
    };

    if (distance(enemyCX,enemyCY,playerCX,playerCY) <= blockUnit
        || distance(enemyCX1,enemyCY,playerCX,playerCY) <= blockUnit
        || distance(enemyCX2,enemyCY,playerCX,playerCY) <= blockUnit) {

        playerInit();
        player.x = playerX;
        player.y = playerY;

        levelInit(levelStart);

        enemyInit(level);
        enemyCount = difficultyFactor * level;
        allEnemies = [];
        for (var i=0; i<enemyCount; i++) {
            allEnemies.push(new Enemy());
        }
    }
};


// render enemy objects to screen
Enemy.prototype.render = function() {
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
    this.sprite = frogImgSrc;
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




