let app;
let player;
let gameController;
let demonController;
let spawnableController;
let bulletController;
let soundController;
let pixiAppWidth;
let pixiAppHeight = 720;
let backgroundColor = 0xAAAAAA;

if (window.innerWidth <= 960) {
    pixiAppWidth = window.innerWidth * 0.9;
} else {
    pixiAppWidth = window.innerWidth * 0.67;
}

window.onload = function() {
    
    app = new PIXI.Application(
        { 
            width: pixiAppWidth, 
            height: pixiAppHeight,
            backgroundColor: backgroundColor
        }
    );
    document.querySelector("#game-div").appendChild(app.view);
    gameController = new GameController();
}

window.addEventListener("resize", function(event) {
    if (window.innerWidth <= 960) {
        app.renderer.view.style.width = window.innerWidth * 0.9 + "px";
        return;
    } 

    app.renderer.view.style.width = window.innerWidth * 0.67 + "px";
});