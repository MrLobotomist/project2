function GameManager() {
    var gridCanvasAI = document.getElementById('grid-canvas-ai');
    var nextCanvasAI = document.getElementById('next-canvas-ai');
    var scoreContainerAI = document.getElementById("score-container-ai");
    var gridContextAI = gridCanvasAI.getContext('2d');
    var nextContextAI = nextCanvasAI.getContext('2d');

    var heightWeight = document.getElementById('in1');
    var linesWeight = document.getElementById('in2');
    var holesWeight = document.getElementById("in3");
    var bumpinessWeight = document.getElementById("in3");

    var gridAI = new Grid(22, 10);
    var rpgAi = new RandomPieceGenerator();
    var ai = new AI({
        heightWeight: heightWeight.value,         //0.510066,
        linesWeight: linesWeight.value,           //0.760666,
        holesWeight: holesWeight.value,           //0.35663,
        bumpinessWeight: bumpinessWeight.value    //0.184483
    });
    var workingPiecesAI = [null, rpgAi.nextPiece()];
    var workingPieceAI = null;
    var isAiActive = false;          // Активация AI

    var gridCanvasPlayer = document.getElementById('grid-canvas-player');
    var nextCanvasPlayer = document.getElementById('next-canvas-player');
    var scoreContainerPlayer = document.getElementById("score-container-player");
    var gridContextPlayer = gridCanvasPlayer.getContext('2d');
    var nextContextPlayer = nextCanvasPlayer.getContext('2d');
    var gridPlayer = new Grid(22, 10);
    var rpgPlayer = new RandomPieceGenerator();
    var workingPiecesPlayer = [null, rpgPlayer.nextPiece()];
    var workingPiecePlayer = null;
    document.addEventListener('keydown', onKeyDown);

    var resetButton = document.getElementById('stop-button');
    var aiButton = document.getElementById('ai-button');

    var dropButton = document.getElementById('drop-button');
    var startButton = document.getElementById('start-button');
    var stopAllButton = document.getElementById('stopAll-button');

    var recreateAi = document.getElementById('recreate-ai');


    var gravityTimerPlayer = new Timer(onGravityTimerTickPlayer, 500);
    var scoreAI = 0;
    var scorePlayer = 0;

    var dropSpeed = 60;
    var lastScore = 0;

    var loose = false;

    var gameStarted

    // Graphics AI
    function intToRGBHexStringAI(v) {
        return 'rgb(' + ((v >> 16) & 0xFF) + ',' + ((v >> 8) & 0xFF) + ',' + (v & 0xFF) + ')';
    }

    function redrawGridCanvasAI(workingPieceVerticalOffset = 0) {
        gridContextAI.save();

        // Clear
        gridContextAI.clearRect(0, 0, gridCanvasAI.width, gridCanvasAI.height);

        // Draw grid
        for (var r = 2; r < gridAI.rows; r++) {
            for (var c = 0; c < gridAI.columns; c++) {
                if (gridAI.cells[r][c] != 0) {
                    gridContextAI.fillStyle = intToRGBHexStringAI(gridAI.cells[r][c]);
                    gridContextAI.fillRect(20 * c, 20 * (r - 2), 20, 20);
                    gridContextAI.strokeStyle = "#FFFFFF";
                    gridContextAI.strokeRect(20 * c, 20 * (r - 2), 20, 20);
                }
            }
        }

        // Draw working piece
        try{
            for (var r = 0; r < workingPieceAI.dimension; r++) {
                for (var c = 0; c < workingPieceAI.dimension; c++) {
                    if (workingPieceAI.cells[r][c] != 0) {
                        gridContextAI.fillStyle = intToRGBHexStringAI(workingPieceAI.cells[r][c]);
                        gridContextAI.fillRect(20 * (c + workingPieceAI.column), 20 * ((r + workingPieceAI.row) - 2) + workingPieceVerticalOffset, 20, 20);
                        gridContextAI.strokeStyle = "#FFFFFF";
                        gridContextAI.strokeRect(20 * (c + workingPieceAI.column), 20 * ((r + workingPieceAI.row) - 2) + workingPieceVerticalOffset, 20, 20);
                    }
                }
            }
        }
        catch{

        }
        gridContextAI.restore();
    }

    function redrawNextCanvasAI() {
        nextContextAI.save();

        nextContextAI.clearRect(0, 0, nextCanvasAI.width, nextCanvasAI.height);
        var next = workingPiecesAI[1];
        var xOffset = next.dimension == 2 ? 20 : next.dimension == 3 ? 10 : next.dimension == 4 ? 0 : null;
        var yOffset = next.dimension == 2 ? 20 : next.dimension == 3 ? 20 : next.dimension == 4 ? 10 : null;
        for (var r = 0; r < next.dimension; r++) {
            for (var c = 0; c < next.dimension; c++) {
                if (next.cells[r][c] != 0) {
                    nextContextAI.fillStyle = intToRGBHexStringAI(next.cells[r][c]);
                    nextContextAI.fillRect(xOffset + 20 * c, yOffset + 20 * r, 20, 20);
                    nextContextAI.strokeStyle = "#FFFFFF";
                    nextContextAI.strokeRect(xOffset + 20 * c, yOffset + 20 * r, 20, 20);
                }
            }
        }

        nextContextAI.restore();
    }

    function updateScoreContainerAI() {
        scoreContainerAI.innerHTML = scoreAI.toString();
    }


    // Graphics Player
    function intToRGBHexStringPlayer(v) {
        return 'rgb(' + ((v >> 16) & 0xFF) + ',' + ((v >> 8) & 0xFF) + ',' + (v & 0xFF) + ')';
    }

    function redrawGridCanvasPlayer(workingPieceVerticalOffset = 0) {
        gridContextPlayer.save();

        // Clear
        gridContextPlayer.clearRect(0, 0, gridCanvasPlayer.width, gridCanvasPlayer.height);

        // Draw grid
        for (var r = 2; r < gridPlayer.rows; r++) {
            for (var c = 0; c < gridPlayer.columns; c++) {
                if (gridPlayer.cells[r][c] != 0) {
                    gridContextPlayer.fillStyle = intToRGBHexStringPlayer(gridPlayer.cells[r][c]);
                    gridContextPlayer.fillRect(20 * c, 20 * (r - 2), 20, 20);
                    gridContextPlayer.strokeStyle = "#FFFFFF";
                    gridContextPlayer.strokeRect(20 * c, 20 * (r - 2), 20, 20);
                }
            }
        }

        // Draw working piece
        for (var r = 0; r < workingPiecePlayer.dimension; r++) {
            for (var c = 0; c < workingPiecePlayer.dimension; c++) {
                if (workingPiecePlayer.cells[r][c] != 0) {
                    gridContextPlayer.fillStyle = intToRGBHexStringPlayer(workingPiecePlayer.cells[r][c]);
                    gridContextPlayer.fillRect(20 * (c + workingPiecePlayer.column), 20 * ((r + workingPiecePlayer.row) - 2) + workingPieceVerticalOffset, 20, 20);
                    gridContextPlayer.strokeStyle = "#FFFFFF";
                    gridContextPlayer.strokeRect(20 * (c + workingPiecePlayer.column), 20 * ((r + workingPiecePlayer.row) - 2) + workingPieceVerticalOffset, 20, 20);
                }
            }
        }
        gridContextPlayer.restore();
    }

    function redrawNextCanvasPlayer() {
        nextContextPlayer.save();

        nextContextPlayer.clearRect(0, 0, nextCanvasPlayer.width, nextCanvasPlayer.height);
        var next = workingPiecesPlayer[1];
        var xOffset = next.dimension == 2 ? 20 : next.dimension == 3 ? 10 : next.dimension == 4 ? 0 : null;
        var yOffset = next.dimension == 2 ? 20 : next.dimension == 3 ? 20 : next.dimension == 4 ? 10 : null;
        for (var r = 0; r < next.dimension; r++) {
            for (var c = 0; c < next.dimension; c++) {
                if (next.cells[r][c] != 0) {
                    nextContextPlayer.fillStyle = intToRGBHexStringPlayer(next.cells[r][c]);
                    nextContextPlayer.fillRect(xOffset + 20 * c, yOffset + 20 * r, 20, 20);
                    nextContextPlayer.strokeStyle = "#FFFFFF";
                    nextContextPlayer.strokeRect(xOffset + 20 * c, yOffset + 20 * r, 20, 20);
                }
            }
        }

        nextContextPlayer.restore();
    }

    function updateScoreContainerPlayer() {
        scoreContainerPlayer.innerHTML = scorePlayer.toString();
    }




    // Drop animation AI
    var workingPieceDropAnimationStopwatchAI = null;

    function startWorkingPieceDropAnimationAI(callback = function () { }) {
        // Calculate animation height
        animationHeightAI = 0;
        _workingPieceAI = workingPieceAI.clone();
        while (_workingPieceAI.moveDown(gridAI)) {
            animationHeightAI++;
        }

        var stopwatchAI = new Stopwatch(function (elapsedAI) {
            if (elapsedAI >= animationHeightAI * dropSpeed) {
                stopwatchAI.stop();
                redrawGridCanvasAI(20 * animationHeightAI);
                callback();
                return;
            }

            redrawGridCanvasAI(elapsedAI/(dropSpeed/20));
        });

        workingPieceDropAnimationStopwatchAI = stopwatchAI;
    }

    function cancelWorkingPieceDropAnimationAI() {
        if (workingPieceDropAnimationStopwatchAI === null) {
            return;
        }
        workingPieceDropAnimationStopwatchAI.stop();
        workingPieceDropAnimationStopwatchAI = null;
    }


    // Drop animation Player
    var workingPieceDropAnimationStopwatchPlayer = null;

    function startWorkingPieceDropAnimationPlayer(callback = function () { }) {
        // Calculate animation height
        animationHeightPlayer = 0;
        _workingPiecePlayer = workingPiecePlayer.clone();
        while (_workingPiecePlayer.moveDown(gridPlayer)) {
            animationHeightPlayer++;
        }

        var stopwatchPlayer = new Stopwatch(function (elapsedPlayer) {
            if (elapsedPlayer >= animationHeightPlayer * 20) {
                stopwatchPlayer.stop();
                redrawGridCanvasPlayer(20 * animationHeightPlayer);
                callback();
                return;
            }

            redrawGridCanvasPlayer(elapsedPlayer);
        });

        workingPieceDropAnimationStopwatchPlayer = stopwatchPlayer;
    }

    function cancelWorkingPieceDropAnimationPlayer() {
        if (workingPieceDropAnimationStopwatchPlayer === null) {
            return;
        }
        workingPieceDropAnimationStopwatchPlayer.stop();
        workingPieceDropAnimationStopwatchPlayer = null;
    }


    // Process start of turn
    function startTurnAI() {
        if (isAiActive) {
            // Shift working pieces
            for (var i = 0; i < workingPiecesAI.length - 1; i++) {
                workingPiecesAI[i] = workingPiecesAI[i + 1];
            }
            workingPiecesAI[workingPiecesAI.length - 1] = rpgAi.nextPiece();
            workingPieceAI = workingPiecesAI[0];


            // Refresh Graphics
            redrawGridCanvasAI();
            redrawNextCanvasAI();

            workingPieceAI = ai.best(gridAI, workingPiecesAI);
            startWorkingPieceDropAnimationAI(function () {
                while (workingPieceAI.moveDown(gridAI)); // Drop working piece
                if (!endTurnAI()) {
                    alert('You Won4!');
                    return;
                }

                console.log(dropSpeed)

                if (scoreAI >= lastScore + 20){                    
                    dropSpeed -= 10;
                    lastScore = scoreAI;
                    if (lastScore < 20){
                        lastScore = 20;
                    } 
                }
                
                startTurnAI();
            })
        }
    }

    function startTurnPlayer() {
        // Shift working pieces
        for (var i = 0; i < workingPiecesPlayer.length - 1; i++) {
            workingPiecesPlayer[i] = workingPiecesPlayer[i + 1];
        }
        workingPiecesPlayer[workingPiecesPlayer.length - 1] = rpgPlayer.nextPiece();
        workingPiecePlayer = workingPiecesPlayer[0];

        // Refresh Graphics
        redrawGridCanvasPlayer();
        redrawNextCanvasPlayer();

        isKeyEnabled = true;
        gravityTimerPlayer.resetForward(500);

    }

    // Process end of turn
    function endTurnAI() {
        // Add working piece
        gridAI.addPiece(workingPieceAI);
        // Clear lines
        scoreAI += gridAI.clearLines();
        // Refresh graphics
        redrawGridCanvasAI();
        updateScoreContainerAI();

        return !gridAI.exceeded();
    }
    function endTurnPlayer() {
        // Add working piece
        gridPlayer.addPiece(workingPiecePlayer);
        // Clear lines
        scorePlayer += gridPlayer.clearLines();
        // Refresh graphics
        redrawGridCanvasPlayer();
        updateScoreContainerPlayer();

        return !gridPlayer.exceeded();
    }

    // Process gravity tick Player
    function onGravityTimerTickPlayer() {
        // If working piece has not reached bottom
        if (workingPiecePlayer.canMoveDown(gridPlayer)) {
            workingPiecePlayer.moveDown(gridPlayer);
            redrawGridCanvasPlayer();
            return;
        }

        // Stop gravity if working piece has reached bottom
        gravityTimerPlayer.stop();

        // If working piece has reached bottom, end of turn has been processed
        // and game cannot continue because grid has been exceeded
        if (!endTurnPlayer() & !loose) {
            isKeyEnabled = false;
            alert('Game Over2!');
            isAiActive = false;
            loose = true;
            sendRecord();
            return;
        }

        // If working piece has reached bottom, end of turn has been processed
        // and game can still continue.
        startTurnPlayer();
    }


    // Process keys
    function onKeyDown(event) {
        if(loose){
            return;
        }
        switch (event.which) {
            case 38: // up
                isKeyEnabled = false;
                gravityTimerPlayer.stop(); // Stop gravity
                startWorkingPieceDropAnimationPlayer(function () { // Start drop animation
                    while (workingPiecePlayer.moveDown(gridPlayer)); // Drop working piece
                    if (!endTurnPlayer() & !loose) {
                        alert('Game Over1!');
                        isAiActive = false;
                        sendRecord();
                        loose = true;
                        return;
                    }
                    startTurnPlayer();
                });
                break;
            case 40: // down
                gravityTimerPlayer.resetForward(500);
                break;
            case 37: // left
                if (workingPiecePlayer.canMoveLeft(gridPlayer)) {
                    workingPiecePlayer.moveLeft(gridPlayer);
                    redrawGridCanvasPlayer();
                }
                break;
            case 39: // right
                if (workingPiecePlayer.canMoveRight(gridPlayer)) {
                    workingPiecePlayer.moveRight(gridPlayer);
                    redrawGridCanvasPlayer();
                }
                break;
            case 32: // spacebar
                workingPiecePlayer.rotate(gridPlayer);
                redrawGridCanvasPlayer();
                break;
        }
    }

    aiButton.onclick = function () {
        if (isAiActive) {
            isAiActive = false;
            aiButton.style.backgroundColor = "#f9f9f9";
        } else {
            isAiActive = true;
            aiButton.style.backgroundColor = "#e9e9ff";

            startTurnAI();
/*             startWorkingPieceDropAnimationAI(function () { // Start drop animation
                while (workingPieceAI.moveDown(gridAI)); // Drop working piece
                if (!endTurnAI()) {
                    alert('Game Over3!');
                    return;
                }
                startTurnAI();
            });
 */
        }
    }

    resetButton.onclick = function () {
        cancelWorkingPieceDropAnimationAI();
        gridAI = new Grid(22, 10);
        rpgAi = new RandomPieceGenerator();
        workingPiecesAI = [null, rpgAi.nextPiece()];
        workingPieceAI = null;
        scoreAI = 0;
        dropSpeed = 60;
        updateScoreContainerAI();
        redrawGridCanvasAI();
        redrawNextCanvasAI();
//        startTurnAI();
        isAiActive = false;
        aiButton.style.backgroundColor = "#f9f9f9";
        
    }

    dropButton.onclick = function () {
        isAiActive = true;
        cancelWorkingPieceDropAnimationAI();
        gridAI = new Grid(22, 10);
        rpgAi = new RandomPieceGenerator();
        workingPiecesAI = [null, rpgAi.nextPiece()];
        workingPieceAI = null;
        scoreAI = 0;
        dropSpeed = 60;
        updateScoreContainerAI();
        startTurnAI();

        gravityTimerPlayer.stop();
        cancelWorkingPieceDropAnimationPlayer();
        gridPlayer = new Grid(22, 10);
        rpgPlayer = new RandomPieceGenerator();
        workingPiecesPlayer = [null, rpgPlayer.nextPiece()];
        workingPiecePlayer = null;
        scorePlayer = 0;
        updateScoreContainerPlayer();
        startTurnPlayer();
        loose = false;
    }

    startButton.onclick = function () {
        if (gameStarted){

        }
        else {
            isAiActive = true;
            aiButton.style.backgroundColor = "#e9e9ff";
            startTurnPlayer();
            startTurnAI();
            gameStarted = true;
            loose = false;
        }
    }

    stopAllButton.onclick = function () {
        gameStarted = false;
        isAiActive = true;
        aiButton.style.backgroundColor = "#f9f9f9";
        cancelWorkingPieceDropAnimationAI();
        gridAI = new Grid(22, 10);
        rpgAi = new RandomPieceGenerator();
        workingPiecesAI = [null, rpgAi.nextPiece()];
        workingPieceAI = null;
        scoreAI = 0;
        dropSpeed = 60;
        updateScoreContainerAI();

        redrawGridCanvasAI();
        redrawNextCanvasAI();

        gravityTimerPlayer.stop();
        cancelWorkingPieceDropAnimationPlayer();
        gridPlayer = new Grid(22, 10);
        rpgPlayer = new RandomPieceGenerator();
        workingPiecesPlayer = [null, rpgPlayer.nextPiece()];
        workingPiecePlayer = null;
        scorePlayer = 0;
        loose = false;
        updateScoreContainerPlayer();

        redrawGridCanvasPlayer();
        redrawNextCanvasPlayer();
    }

    recreateAi.onclick = function () {
        ai = new AI({
            heightWeight: heightWeight.value,         //0.510066,
            linesWeight: linesWeight.value,           //0.760666,
            holesWeight: holesWeight.value,           //0.35663,
            bumpinessWeight: bumpinessWeight.value    //0.184483
        });
    }
    
    async function sendRecord(){
        record = document.getElementById('rec').innerHTML;
        if(typeof(record) == 'string') record = 0;
        if(scorePlayer > record){
            let csrftoken = await document.querySelector('[name=csrfmiddlewaretoken]').value;
            let response = await fetch('/save_rec/', {
                method: 'POST',
                headers: {'X-CSRFToken': csrftoken},
                body: JSON.stringify(scorePlayer)
            });
            if (response.ok) {
                document.getElementById('rec').innerHTML = scorePlayer;
            }
        }
    }
    // var startButton = document.getElementById('start-button');
    // var stopAllButton = document.getElementById('stopAll-button');
}