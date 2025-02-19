//igaz, ha megy a játék (a pályák közötti szünetnél nem megy a játék ebben az értelemben)
let gameInProgress = false;
//játéktér
let gameArea;
//következő sor tere
let nextRowArea;
//a game over feliratot tartalmazó div
let gameOverDiv;
//a next level gombot tartalmazó div
let nextLevelDiv;
//eddig elért pontszám
let score;
//az eddigi elért pontszámot kiíró div
let scoreDiv;
//az aktuális pálya száma
let level;
//az aktuális pálya számát kiíró div
let levelDiv;
//az aktuális pályán hátralévő sorok száma
let linesLeft;
//az aktuális pályán hátralévő sorok számát kiíró div
let linesLeftDiv;
//a főmenü elemeit tartalmazó div
let menuDiv;
//a start gombot tartalmazó div
let startDiv;
//a segítség gombot tartalmazó div
let helpDiv;
//a következő sor, pontszám, pálya száma és hátralévő sorok számát tartalmazó div
let dataDiv;
//a main menu gombot tartalmazó div
let mainMenuDiv;
//a segítő leírást tartalmazó div
let instructionsDiv;
//a logót tartalmazó iv
let logoDiv;
//a pontszám rögzítésére való felületet tartalmazó div
let submitRecordDiv;
//a pontszám rögzítésére való gomb
let submitRecordButton;
//a leaderboardot tartalmazó div
let leaderBoardDiv;
//a háttérzene
let bgMusic;
//a négyzetek kitörésekor lejátszott hangeffekt
let breakBlockSound;
//a játék végén lejátszott hangeffekt
let gameOverSound;
//az időmegállító powerup hangeffektje
let clockSound;
//a bomba powerup hangeffektje
let explosionSound;
//a sorkiütés powerup hangeffektje
let lineBreakSound;
//egy négyzet szélessége/magassága
let blockSize = 30;
//négyzetek sorainak száma
let blocksHeight = 20;
//négyzetek oszlopainak száma
let blocksWidth = 15;
//játéktér magassága
let gameHeight = blockSize * blocksHeight;
//játéktér szélessége
let gameWidth = blockSize * blocksWidth;
//a következő négyzetek megjelenése közötti idő
let nextRowSpeed = 100;
//az új sor folyamatos feltöltéséért felelős ismételt időzítő száma
let blockPlacer;
//a négyzetek folyamatos eséséért felelős ismételt időzítő száma
let fallTimer;
//a sebesség gyorsításáért felelős ismételt időzítő száma
let speedIncreaseTimer;
//a játék folyamatos kirajzolásáért felelős ismételt időzítő száma
let drawInterval;
//az időmegállító powerup után az idő folytatásáért felelős időzítő száma
let resumeTimeTimeout;

//a leaderboard sorait tartalmazó tömb
const leaderBoard = new Array(10);
//a négyzetek sorait tartalmazó tömb
const blocks = new Array(blocksHeight);
//a következő négyzetek sora
const nextRow = new Array(blocksWidth);

//a játék betöltődik az oldal betöltése után
$(document).ready(function() {
    gameArea = $("#gameArea");
    gameArea.css({
        "height": gameHeight,
        "width": gameWidth
    });
    gameArea.on('mousedown', '.block', function(event) {
        let y = Math.floor(event.target.id.substring(5) / blocksWidth);
        let x = event.target.id.substring(5) - y * blocksWidth;
        breakBlocks(x, y);
    });

    gameOverDiv = $("#gameOverDiv");
    gameOverDiv.css({
        "width": Math.min(gameWidth * 0.8, 500),
        "top": gameHeight * 0.1,
        //a game over felirat a játéktér közepén lesz
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.8, 500) * 0.5),
        "z-index": "1"
    });

    mainMenuDiv = $("#mainMenuDiv");
    mainMenuDiv.css({
        "width": Math.min(gameWidth * 0.8, 500),
        //a game over felirat a játéktér közepén lesz
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.8, 500) * 0.5),
        "top": gameHeight * 0.8,
        "z-index": 2,
        "cursor": "pointer"
    });
    mainMenuDiv.attr("onclick", "reset()");

    nextLevelDiv = $("#nextLevelDiv");
    nextLevelDiv.css({
        "width": Math.min(gameWidth * 0.5, 300),
        "top": gameHeight * 0.3,
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.5, 300) * 0.5),
        "cursor": "pointer"
    });
    nextLevelDiv.attr("onclick", "nextLevel()");

    menuDiv = $("#menuDiv");
    menuDiv.css({
        "height": gameHeight,
        "width": gameWidth
    });

    logoDiv = $("#logoDiv");
    logoDiv.css({
        "width": Math.min(gameWidth * 0.7, 400),
        "top": gameHeight * 0.05,
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.7, 400) * 0.5),
    });

    startDiv = $("#startDiv");
    startDiv.css({
        "width": Math.min(gameWidth * 0.5, 300),
        "top": gameHeight * 0.4,
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.5, 300) * 0.5),
        "cursor": "pointer"
    });
    startDiv.attr("onclick", "startNewGame()");

    helpDiv = $("#helpDiv");
    helpDiv.css({
        "width": Math.min(gameWidth * 0.5, 300),
        "top": gameHeight * 0.6,
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.5, 300) * 0.5),
        "cursor": "pointer"
    });
    helpDiv.attr("onclick", "showHelp()");

    instructionsDiv = $("#instructionsDiv");
    instructionsDiv.css({
        "width" : Math.min(gameWidth * 0.8, 300),
        "top": gameHeight * 0.05,
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.8, 300) * 0.5)
    });

    submitRecordDiv = $("#submitRecordDiv");
    submitRecordDiv.css({
        "width" : gameWidth * 0.9,
        "height" : gameHeight * 0.4,
        "top": gameHeight * 0.5,
        "left": (gameWidth * 0.5 - gameWidth * 0.45)
    });

    submitRecordButton = $("#submitRecord");
    submitRecordButton.css({
        "width": "50%"
    })

    leaderBoardDiv = $("#leaderBoardDiv");
    leaderBoardDiv.css({
        "width" : Math.min(gameWidth * 0.9, 300),
        "height" : gameHeight * 0.7,
        "top": gameHeight * 0.05,
        "left": (gameWidth * 0.5 - Math.min(gameWidth * 0.9, 300) * 0.5)
    });

    nextRowArea = $("#nextRowArea");
    nextRowArea.css({
        "height": blockSize,
        "width": gameWidth,
        "top": gameHeight + 3
    });

    dataDiv = $("#dataDiv");

    scoreDiv = $("#score");
    scoreDiv.css("top", gameHeight + blockSize + 32);

    levelDiv = $("#level");
    levelDiv.css("top", gameHeight + blockSize * 2 + 48);

    linesLeftDiv = $("#linesLeft");
    linesLeftDiv.css("top", gameHeight + blockSize * 3 + 64);

    bgMusic = document.getElementById("bgMusic");
    bgMusic.volume = 0.5;
    bgMusic.loop = true;
    bgMusic.load;

    gameOverSound = document.getElementById("gameOverSound");
    gameOverSound.volume = 0.1;
    gameOverSound.load();

    breakBlockSound = document.getElementById("breakBlockSound");
    breakBlockSound.volume = 0.1;
    breakBlockSound.load();

    clockSound = document.getElementById("clockSound");
    clockSound.volume = 0.25;
    clockSound.load();

    explosionSound = document.getElementById("explosionSound");
    explosionSound.volume = 0.25;
    explosionSound.load();

    lineBreakSound = document.getElementById("lineBreakSound");
    lineBreakSound.volume = 0.25;
    lineBreakSound.load();

    for (let i = 0; i < blocksHeight; i++) {
        blocks[i] = new Array(blocksWidth);
    }

    reset();
});

//leellenőrzi, hogy vége van-e a pályának, vagy a játéknak és hozzáad egy négyzetet az új sorhoz
function tick() {
    if (linesLeft < 0) levelFinished();
    else {
        for (let i = 0; i < blocksWidth; i++) {
            if (blocks[0][i] != null) {
                endGame();
                break;
            }
        }
    }

    //új véletlenszerű négyzet hozzáadása a következő sorhoz
    addRandomBlock();
}

//kirajzolja a játék aktuális állását
function draw() {
    gameArea.empty();
    nextRowArea.empty();

    for (let i = 0; i < blocksHeight; i++) {
        for (let j = 0; j < blocksWidth; j++) {
            let block = blocks[i][j];
            if (block != null){
                block.css({
                    "position": "absolute",
                    "top": i * blockSize,
                    "left": j * blockSize,
                    "cursor": "pointer"
                });
                block.attr('id', "block" + (i * blocksWidth + j));
            }
            gameArea.append(block);
        }
    }

    for (let i = 0; i < blocksWidth; i++) {
        let block = nextRow[i];
        if (block != null) {
            block.css({
                "position": "absolute",
                "top": 0,
                "left": i * blockSize
            });
        }
        nextRowArea.append(block);
    }

    scoreDiv.html("Score: " + score);
    levelDiv.html("Level: " + level);
    linesLeftDiv.html("Lines: " + Math.max(0, linesLeft));
}

//hozzáad egy véletlenszerű négyzetet az új sorhoz
function addRandomBlock() {
    //ha tele van a következő sor, berakja a játékban lévők aljára
    if (nextRow[blocksWidth - 1] != null) {
        insertNextRow();
        return;
    }

    //új véletlenszerű színű block hozzáadása a nextRow végéhez
    let randomType = Math.random() * 300;
    let block;
    if (randomType < 1) {
        block = $("<img src='img/timestopblockborder.png' class='block time'>");
    } else if (randomType < 2) {
        block = $("<img src='img/lineblockborder.png' class='block line'>");
    } else if (randomType < 3) {
        block = $("<img src='img/bombblockborder.png' class='block bomb'>");
    } else {
        block = $("<img src='img/blockborder.png' class='block'>");
    }
    let randomColor = "";
    let randomFloat = Math.random() * 4;
    if (randomFloat < 1) {
        randomColor = "red";
    } else if (randomFloat < 2) {
        randomColor = "yellow";
    } else if (randomFloat < 3) {
        randomColor = "green";
    } else {
        randomColor = "blue";
    }
    block.css({
        "height": blockSize,
        "width": blockSize,
        "background-color": randomColor
    });

    for (let i = 0; i < blocksWidth; i++) {
        if (nextRow[i] == null) {
            nextRow[i] = block;
            break;
        }
    }
}

//beilleszti az új sort a négyzetek tömb végére
function insertNextRow() {
    for (let i = 0; i < blocksHeight - 1; i++) {
        for (let j = 0; j < blocksWidth; j++) {
            blocks[i][j] = blocks[i + 1][j];
        }
    }
    for (let i = 0; i < blocksWidth; i++) {
        blocks[blocksHeight - 1][i] = nextRow[i];
    }
    nextRow.length = 0;
    linesLeft--;
}

//véget vet a játéknak
function endGame() {
    bgMusic.load();
    stopTime();
    gameInProgress = false;
    gameOverDiv.css("visibility", "visible");
    setTimeout(showSubmitRecord, 3000);
    gameOverSound.play();
}

//megpróbálja széttörni az adott koordinátán található négyzetet
//x: a négyzet oszlopindexe
//y: a négyzet sorindexe
function breakBlocks(x, y) {
    if (!gameInProgress) return;
    let blocksToBreak = [{
        x: x,
        y: y
    }];
    for (let i = 0; i < blocksToBreak.length; i++) {
        if (blocks[blocksToBreak[i].y][blocksToBreak[i].x] == null) return;
        let color = blocks[blocksToBreak[i].y][blocksToBreak[i].x].css("background-color");
        if (blocksToBreak[i].y - 1 >= 0 && blocks[blocksToBreak[i].y - 1][blocksToBreak[i].x] != null && color === blocks[blocksToBreak[i].y - 1][blocksToBreak[i].x].css("background-color")) {
            let newBlockToBreak = {
                x: blocksToBreak[i].x,
                y: blocksToBreak[i].y - 1
            }
            if (blocksToBreak.findIndex(block => block.x === newBlockToBreak.x && block.y === newBlockToBreak.y) === -1) {
                blocksToBreak.push(newBlockToBreak);
            }
        }
        if (blocksToBreak[i].y + 1 < blocksHeight && blocks[blocksToBreak[i].y + 1][blocksToBreak[i].x] != null && color === blocks[blocksToBreak[i].y + 1][blocksToBreak[i].x].css("background-color")) {
            let newBlockToBreak = {
                x: blocksToBreak[i].x,
                y: blocksToBreak[i].y + 1
            };
            if (blocksToBreak.findIndex(block => block.x === newBlockToBreak.x && block.y === newBlockToBreak.y) === -1) {
                blocksToBreak.push(newBlockToBreak);
            }
        }
        if (blocksToBreak[i].x - 1 >= 0 && blocks[blocksToBreak[i].y][blocksToBreak[i].x - 1] != null && color === blocks[blocksToBreak[i].y][blocksToBreak[i].x - 1].css("background-color")) {
            let newBlockToBreak = {
                x: blocksToBreak[i].x - 1,
                y: blocksToBreak[i].y
            };
            if (blocksToBreak.findIndex(block => block.x === newBlockToBreak.x && block.y === newBlockToBreak.y) === -1) {
                blocksToBreak.push(newBlockToBreak);
            }
        }
        if (blocksToBreak[i].x + 1 < blocksWidth && blocks[blocksToBreak[i].y][blocksToBreak[i].x + 1] != null && color === blocks[blocksToBreak[i].y][blocksToBreak[i].x + 1].css("background-color")) {
            let newBlockToBreak = {
                x: blocksToBreak[i].x + 1,
                y: blocksToBreak[i].y
            };
            if (blocksToBreak.findIndex(block => block.x === newBlockToBreak.x && block.y === newBlockToBreak.y) === -1) {
                blocksToBreak.push(newBlockToBreak);
            }
        }
    }
    if (blocksToBreak.length > 2) {
        for (let i = 0; i < blocksToBreak.length; i++) {
            if (blocks[blocksToBreak[i].y][blocksToBreak[i].x] != null) {
                if (blocks[blocksToBreak[i].y][blocksToBreak[i].x].attr("class").includes("bomb")) bomb(blocksToBreak[i].x,blocksToBreak[i].y);
                else if (blocks[blocksToBreak[i].y][blocksToBreak[i].x].attr("class").includes("line")) line(blocksToBreak[i].y);
                else if (blocks[blocksToBreak[i].y][blocksToBreak[i].x].attr("class").includes("time")) time();
            }
            blocks[blocksToBreak[i].y][blocksToBreak[i].x] = null;
        }
        let cloneSound = breakBlockSound.cloneNode(true);
        cloneSound.volume = 0.05;
        cloneSound.play();
        score += 300 + blocksToBreak.length * 100;
    }
}

//Igazzal tér vissza, ha van lyuk valamelyik oszlopban, különbel hamissal
function checkHole() {
    for (let i = 1; i < blocksHeight; i++) {
        for (let j = 0; j < blocksWidth; j++) {
            if (blocks[i][j] == null && blocks[i - 1][j] != null) {
                return true;
            }
        }
    }
    return false;
}

//a lyukak fölötti négyzetek egyel lejjebb esnek
function fall() {
    for (let i = blocksHeight - 1; i > 1; i--) {
        for (let j = 0; j < blocksWidth; j++) {
            if (blocks[i][j] == null) {
                blocks[i][j] = blocks[i - 1][j];
                blocks[i - 1][j] = null;
            }
        }
    }
}

//középre csúsznak a négyzetek
function slide() {
    //középtől jobbra eső négyzetek csúsznak balra
    for (let i = Math.floor(blocksWidth / 2) + 1; i < blocksWidth - 1; i++) {
        //ha a legalsó sorban van lyuk, akkor biztosan az egész oszlop üres,
        //ezért az egészet kicserélhetjük a jobbra mellette lévőre
        if (blocks[blocksHeight - 1][i] == null) {
            for (let j = 0; j < blocksHeight; j++) {
                blocks[j][i] = blocks[j][i + 1];
                blocks[j][i + 1] = null;
            }
        }
    }

    //középtől balra eső négyzetek csúsznak jobbra
    for (let i = Math.floor(blocksWidth / 2); i > 0; i--) {
        //ha a legalsó sorban van lyuk, akkor biztosan az egész oszlop üres,
        //ezért az egészet kicserélhetjük a balra mellette lévőre
        if (blocks[blocksHeight - 1][i] == null) {
            for (let j = 0; j < blocksHeight; j++) {
                blocks[j][i] = blocks[j][i - 1];
                blocks[j][i - 1] = null;
            }
        }
    }
}

//a játékos teljesít egy pályát
function levelFinished() {
    gameInProgress = false;
    stopTime();
    nextLevelDiv.css("visibility", "visible");
    nextLevelDiv.css("z-index", 1);
}

//elindítja a következő pályát
function nextLevel() {
    nextLevelDiv.css("visibility", "hidden");
    nextRowSpeed = 200;
    level++;
    for (let i = 0; i < blocksHeight; i++) {
        for (let j = 0; j < blocksWidth; j++) {
            blocks[i][j] = null;
        }
    }
    //kezdő sorok száma 1. szinten 4, minden szinten egyel több, mint az előzőn, max 15
    let filledRows = Math.min(3 + level, 15);
    linesLeft = filledRows + 1;
    while (blocks[blocksHeight - filledRows][0] == null) {
        addRandomBlock();
    }
    linesLeft = 10 + level * 2;
    gameInProgress = true;
    startTime();
}

//elindítja a folyamatos időzítőket
function startTime() {
    blockPlacer = setInterval(tick, nextRowSpeed);
    drawInterval = setInterval(draw, 50);
    speedIncreaseTimer = setInterval(function() {
        clearInterval(blockPlacer);
        blockPlacer = setInterval(tick, nextRowSpeed = Math.max(20, nextRowSpeed - 20));
    }, 5000);

    //ha van lyuk valamelyik oszlopban, akkor a négyzetek esnek,
    //ha nincs, de a legalsó sorban van lyuk, akkor a négyzetek csúsznak
    fallTimer = setInterval(function() {
        if (checkHole()) {
            fall();
        } else {
            slide();
        }
        draw();
    }, 100);
}

//megállítja az időt a pálya/játék végén
function stopTime() {
    clearInterval(blockPlacer);
    clearInterval(fallTimer);
    clearInterval(speedIncreaseTimer);
    clearInterval(drawInterval);
}

//nullázza a pontot, pálya számot és hátralévő sorok számát, majd indít egy új játékot
function startNewGame() {
    score = 0;
    level = 0;
    linesLeft = 0;
    logoDiv.css("visibility", "hidden");
    startDiv.css("visibility", "hidden");
    helpDiv.css("visibility", "hidden");
    menuDiv.css("visibility", "hidden");
    dataDiv.css("visibility", "visible");
    gameArea.empty();
    bgMusic.play();
    gameInProgress = true;
    nextLevel();
}

//kezdőállapotba rakja a játékot és feltölti a pályát véletlenszerű sorokkal
function reset() {
    instructionsDiv.css("visibility", "hidden");
    submitRecordDiv.css("visibility", "hidden");
    leaderBoardDiv.css("visibility", "hidden");
    mainMenuDiv.css("visibility", "hidden");
    dataDiv.css("visibility", "hidden");
    gameOverDiv.css("visibility", "hidden");
    menuDiv.css("visibility", "visible");
    logoDiv.css("visibility", "visible");
    startDiv.css("visibility", "visible");
    helpDiv.css("visibility", "visible");
    linesLeft = 20;
    while (blocks[0][0] == null) {
        addRandomBlock();
    }
    draw();
}

//megjeleníti a segítséget
function showHelp() {
    logoDiv.css("visibility", "hidden");
    startDiv.css("visibility", "hidden");
    helpDiv.css("visibility", "hidden");
    instructionsDiv.css("visibility", "visible");
    mainMenuDiv.css({
        "visibility": "visible",
	"z-index": 2
    });
}

//megjeleníti a leaderboardot
function showLeaderBoard() {
    submitRecordDiv.css("visibility", "hidden");
    gameOverDiv.css("visibility", "hidden");
    leaderBoardDiv.css("visibility", "visible");
    mainMenuDiv.css({
        "visibility": "visible",
        "z-index": 1,
    });

    leaderBoardDiv.empty();

    for (let i = 0; i < leaderBoard.length; i++) {
        if (leaderBoard[i] == null) break;
        let record = leaderBoard[i].split(";");
        leaderBoardDiv.append((i + 1) + ": " + record[0] + " - " + record[1] + "<br>");
    }
}

//megjeleníti a pontszám mentésre való felületet
function showSubmitRecord() {
    submitRecordDiv.css("visibility", "visible");
}

//menti a pontszámot és nevet
function submitRecord() {
    let recordName = $("#recordName").val();
    if (recordName === "" || recordName.includes(";")) {
        $("#errorMessage").html("Invalid name!");
        return;
    }
    for (let i = 0; i < leaderBoard.length; i++) {
        if (leaderBoard[i] == null) {
            leaderBoard[i] = recordName + ";" + score;
            break;
        }
        let actScore = leaderBoard[i].split(";")[1];
        if (actScore < score) {
            for (let j = leaderBoard.length - 1; j > i; j--) {
                leaderBoard[j] = leaderBoard[j - 1];
            }
            leaderBoard[i] = recordName + ";" + score;
            break;
        }
    }
    showLeaderBoard();
}

//bomba powerup használata
//x: bomba oszlopindexe
//y: bomba sorindexe
function bomb(x, y) {
    let cloneSound = explosionSound.cloneNode(true);
    cloneSound.volume = 1;
    cloneSound.play();
    for (let i = y - 2; i <= y + 2; i++) {
        for (let j = x - 2; j <= x + 2; j++) {
            if (i === y - 2 && (j === x - 2 || j === x + 2) || i === y + 2 && (j === x - 2 || j === x + 2)) continue;
            if (blocks[i] != null && blocks[i][j] != null) blocks[i][j] = null;
        }
    }
}

//sorkiütés powerup használata
//y: sor indexe
function line(y) {
    let cloneSound = lineBreakSound.cloneNode(true);
    cloneSound.volume = 0.2;
    cloneSound.play();
    for (let i = 0; i < blocksWidth; i++) {
        blocks[y][i] = null;
    }
}

//időmegállítás powerup használata
function time() {
    clockSound.load();
    clockSound.play();
    stopTime();
    drawInterval = setInterval(draw, 50);
    clearTimeout(resumeTimeTimeout);
    resumeTimeTimeout = setTimeout(function() {
        clearInterval(drawInterval);
        startTime();
    }, 3000);
}