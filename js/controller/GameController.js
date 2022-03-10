class GameController {

    constructor() {
        this.gameDt = 0.0;
        this.gameDifficultyRate = 1000;
        this.difficulty = 1;
        this.isPaused = false;

        preLoadAssets();
        registerKeyListeners();
        registerMousePointerListeners();
    }

    setUp() {
        player = new Player();
        demonController = new DemonController();
        spawnableController = new SpawnableController();
        bulletController = new BulletController();
        soundController = new SoundController();
        app.ticker.add(gameLoop); // add our game loop to the ticker
        app.stage.interactive = true; // enables interactivity (e.g. "pointermove")
        soundController.playBackgroundMusic();
    }

    update(dt) {
        if (!this.isPaused) {
            this.gameDt += dt;

            // increase game difficulty based on time played
            if (this.gameDt >= this.gameDifficultyRate) {
                this.difficulty += 1;
                demonController.tankDemonSpawnLimit += 2;
                demonController.runnerDemonSpawnLimit += 3;
                demonController.casterDemonSpawnLimit += 2;
    
                spawnableController.demonRunnerGateSpawnLimit += 1;
    
                this.gameDt = 0;
            }
    
            // update all relevant entities
            player.update(dt);
            bulletController.update();
            demonController.update(dt);
            spawnableController.update(dt);
        }
    }

    // reset the game to initial state
    resetGame() {
        player.resetState();
        bulletController.resetState();
        demonController.resetState();
        spawnableController.resetState();

        // stop playing a track 
        if (soundController.currentBackgroundMusic == 0) {
            soundController.backgroundMusic[soundController.backgroundMusicOrder[2]].stop();
        } else {
            soundController.backgroundMusic[soundController.backgroundMusicOrder[soundController.currentBackgroundMusic - 1]].stop();
        }
        
        soundController.playBackgroundMusic();

        this.difficulty = 1;

        document.getElementById("game-over").style.display = "none";
        this.isPaused = false;
    }

}

// this function is passed to PixiJS ticker
function gameLoop(dt) {
    gameController.update(dt);
}