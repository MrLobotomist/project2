function GameManager() {
    var gridCanvasAI = document.getElementById('grid-canvas-ai');
    var nextCanvasAI = document.getElementById('next-canvas-ai');
    var scoreContainerAI = document.getElementById("score-container-ai");
    var gridContextAI = gridCanvasAI.getContext('2d');
    var nextContextAI = nextCanvasAI.getContext('2d');
    var gridAI = new Grid(22, 10);
    var rpgAi = new RandomPieceGenerator();
    var ai = new AI({
        heightWeight: 0.510066,
        linesWeight: 0.760666,
        holesWeight: 0.35663,
        bumpinessWeight: 0.184483
    });
    var workingPiecesAI = [null, rpgAi.nextPiece()];
    var workingPieceAI = null;
    var isAiActive = true;          // Активация AI

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

    var resetButton = document.getElementById('reset-button');
    var aiButton = document.getElementById('ai-button');

    var dropButton = document.getElementById('drop-button');


    var gravityTimerPlayer = new Timer(onGravityTimerTickPlayer, 500);
    var scoreAI = 0;
    var scorePlayer = 0;

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
        animationHeight = 0;
        _workingPiece = workingPieceAI.clone();
        while (_workingPiece.moveDown(gridAI)) {
            animationHeight++;
        }

        var stopwatchAI = new Stopwatch(function (elapsed) {
            if (elapsed >= animationHeight * 20) {
                stopwatchAI.stop();
                redrawGridCanvasAI(20 * animationHeight);
                callback();
                return;
            }

            redrawGridCanvasAI(20 * elapsed / 20);
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
        animationHeight = 0;
        _workingPiece = workingPiecePlayer.clone();
        while (_workingPiece.moveDown(gridPlayer)) {
            animationHeight++;
        }

        var stopwatchPlayer = new Stopwatch(function (elapsed) {
            if (elapsed >= animationHeight * 20) {
                stopwatchPlayer.stop();
                redrawGridCanvasPlayer(20 * animationHeight);
                callback();
                return;
            }

            redrawGridCanvasPlayer(20 * elapsed / 20);
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
        if (!endTurnPlayer()) {
            isKeyEnabled = false;
            alert('Game Over2!');
            isAiActive = false;
            return;
        }

        // If working piece has reached bottom, end of turn has been processed
        // and game can still continue.
        startTurnPlayer();
    }


    // Process keys
    function onKeyDown(event) {
        if(!isKeyEnabled){
            return;
        }
        switch (event.which) {
            case 38: // up
                isKeyEnabled = false;
                gravityTimerPlayer.stop(); // Stop gravity
                startWorkingPieceDropAnimationPlayer(function () { // Start drop animation
                    while (workingPiecePlayer.moveDown(gridPlayer)); // Drop working piece
                    if (!endTurnPlayer()) {
                        alert('Game Over1!');
                        isAiActive = false;
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
        updateScoreContainerAI();
        redrawGridCanvasAI();
        redrawNextCanvasAI();
//        startTurnAI();
    }

    dropButton.onclick = function () {
        isAiActive = true;
        cancelWorkingPieceDropAnimationAI();
        gridAI = new Grid(22, 10);
        rpgAi = new RandomPieceGenerator();
        workingPiecesAI = [null, rpgAi.nextPiece()];
        workingPieceAI = null;
        scoreAI = 0;
        updateScoreContainerAI();
        startTurnAI();

        gravityTimerPlayer.stop();
        cancelWorkingPieceDropAnimationPlayer();
        gridPlayer = new Grid(22, 10);
        rpgPlayer = new RandomPieceGenerator();
        workingPiecesPlayer = [null, rpgAi.nextPiece()];
        workingPiecePlayer = null;
        scorePlayer = 0;
        updateScoreContainerPlayer();
        startTurnPlayer();
    }




    startTurnPlayer();
    startTurnAI();



}
