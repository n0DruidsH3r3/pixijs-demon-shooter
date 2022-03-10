class SoundController {
    constructor() {
        this.backgroundMusic = [];
        this.backgroundMusic.push(PIXI.sound.Sound.from(app.loader.resources[backgroundMusic1Id].url));
        this.backgroundMusic.push(PIXI.sound.Sound.from(app.loader.resources[backgroundMusic2Id].url));
        this.backgroundMusic.push(PIXI.sound.Sound.from(app.loader.resources[backgroundMusic3Id].url));

        this.backgroundMusicOrder = [0, 1, 2];

        this.currentBackgroundMusic = 0;
    }

    playBackgroundMusic() {
        
        this.backgroundMusic[this.backgroundMusicOrder[this.currentBackgroundMusic]].play({volume: 0.05});
        this.currentBackgroundMusic += 1;
        this.currentBackgroundMusic %= 3;
    }

}