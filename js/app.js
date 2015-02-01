/* 
    url: http://blakecwang.github.io/frogger-project/
*/


// overall dimension controls
var canvasWidth = 500;
var canvasHeight = 400;
var blockUnit = 50;
var blockWidth = canvasWidth / blockUnit;
var blockHeight = canvasHeight / blockUnit;
var stopGame = false;


// set a loop timer for water movement
var loopTime = 500;
var timeIndex = 4;
setInterval(function(){
    if (timeIndex != 1) {
        timeIndex--;
    } else {
        timeIndex = 4;
    }
}, loopTime/4);


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

var white = "#FFFFFF";          // index 0
var green = "#00C800";          // index 1
var yellow = "#E6E600";         // index 2
var orange = "#FF8200";         // index 3
var red = "#C80000";            // index 4
var blue = "#0000C8";           // index 5
var colors = [white, green, yellow, orange, red, blue];
var changeTextColor = function(lev) {
    document.getElementById("title").style.color=colors[lev-1];
    document.getElementById("level").style.color=colors[lev-1];
};



// image controls
var colorArray = ['white.png', 'green.png', 'yellow.png', 'orange.png', 'red.png', 'blue.png'];
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
'images/frog_white.png'];       // frog - index 10
var roadImgSrc, waterImgSrc1, waterImgSrc2, waterImgSrc3, waterImgSrc4,
    grassImgSrc, carImgSrc, truckImgSrc, frogImgSrc;
var pullImages = function() {
    roadImgSrc = imgSrcArray[0];
    waterImgSrc1 = imgSrcArray[1];
    waterImgSrc2 = imgSrcArray[2];
    waterImgSrc3 = imgSrcArray[3];
    waterImgSrc4 = imgSrcArray[4];
    grassImgSrc = imgSrcArray[5];
    rCarImgSrc = imgSrcArray[6];
    rTruckImgSrc = imgSrcArray[7];
    lCarImgSrc = imgSrcArray[8];
    lTruckImgSrc = imgSrcArray[9];
    frogImgSrc = imgSrcArray[10];
};
pullImages();
var imgInit = function(lev) {
    for (var i=1; i<imgSrcArray.length; i++) {
            var splitArray = imgSrcArray[i].split("_");
            var lastWord = splitArray[splitArray.length - 1];
            var newSrc = imgSrcArray[i].replace(lastWord, colorArray[lev-1]);
            imgSrcArray[i] = newSrc;
    }
    pullImages();
};


// enemy controls
var difficultyFactor, enemyCount, enemyX, enemyY, enemySpeed, enemyImgSrc;
enemyInit = function(lev) {
    enemyImgSrc = imgSrcArray[Math.floor(Math.random() * 4) + 6];
    enemyX = -blockUnit + Math.random() * (canvasWidth + 2*blockUnit);
    enemyY = blockUnit * (Math.floor((Math.random() * (blockHeight-2)) + 1));
    enemySpeed = Math.random() * 300 + 30;
//    enemySpeed = 30;
};
difficultyFactor = 3;
enemyCount = difficultyFactor * levelStart;


// player controls
var playerX, playerY, playerIncrement;
playerInit = function() {
    playerX = (canvasWidth / 2)
    if ((canvasWidth/blockUnit)%2 === 1) {
         playerX -= (blockUnit / 2);
    }
    playerY = blockUnit * (blockHeight - 1);
};
playerIncrement = blockUnit;


// enemy start
// initialize enemy objects
var Enemy = function() {
        imgInit(level);
        enemyInit();
        this.sprite = enemyImgSrc;
        this.x = enemyX;
        this.y = enemyY;
        if (this.sprite.indexOf("right") != -1) {
            this.speed = enemySpeed;
        } else {
            this.speed = -enemySpeed;
        }
};


// updates enemy position
Enemy.prototype.update = function(dt) {

    this.x += this.speed * dt;
    
    if (this.speed > 0 && this.x > canvasWidth) {
        enemyInit(level);
        this.x = -(2*blockUnit + canvasWidth) + Math.random() * canvasWidth;
        this.y = enemyY;
        //this.speed = enemySpeed;
    }
    if (this.speed < 0 && this.x < -(2 * blockUnit)) {
        enemyInit(level);
        this.x = canvasWidth + Math.random() * canvasWidth;
        this.y = enemyY;
        //this.speed = enemySpeed;
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
            
            levelInit(levelStart);
            imgInit(levelStart);
            changeTextColor(levelStart);

            playerInit();
            player.x = playerX;
            player.y = playerY;

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

        if (level < 6) {
            level++;

            levelInit(level);
            changeTextColor(level);

            playerInit();
            this.x = playerX;
            this.y = playerY;

            enemyCount = difficultyFactor * level;
            allEnemies = [];
            for (var i=0; i<enemyCount; i++) {
                allEnemies.push(new Enemy());
            }
        } else {
            stopGame = true;

            var colorIndex = 1;
            setInterval(function() {

                ctx.drawImage(Resources.get('images/frog_' + colorArray[colorIndex]),
                    canvasWidth/2-canvasHeight/2,0, canvasHeight,canvasHeight);
                
                if (colorIndex < 5) {
                    colorIndex++;
                } else {
                    colorIndex = 1;
                }

                ctx.save();
                ctx.font = '20pt "Press Start 2P"';
                ctx.fillStyle = '#FFFFFF';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('you beat frogger', canvasWidth/2,canvasHeight/2);
                ctx.restore();

            }, 250);
        }
    }
};


// render player to screen
Player.prototype.render = function() {
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




