let MovementEnum = {
    LEFT: "leftMovement",
    RIGHT: "rightMovement",
    LEFT_IDLE: "leftIdle",
    RIGHT_IDLE: "rightIdle",
    UP: "up",
    DOWN: "down",
    IDLE: "idle"
};


let DirectionEnum = {
    LEFT: "left",
    RIGHT: "right",
    UP: "up",
    DOWN: "down"
};

let mousePointerPosition;

function isOutOfScene(renderable) {
    return renderable.x >= app.view.width || renderable.x <= 0 || renderable.y <= 0 || renderable.y >= app.view.height;
}

function intersects(aRenderable, bRenderable) {
    let aRenderableBounds = aRenderable.getBounds();
    let bRenderableBounds = bRenderable.getBounds();

    return aRenderableBounds.x + aRenderableBounds.width > bRenderableBounds.x &&
        aRenderableBounds.x < bRenderableBounds.x + bRenderableBounds.width &&
        aRenderableBounds.y + aRenderableBounds.height > bRenderableBounds.y &&
        aRenderableBounds.y < bRenderableBounds.y + bRenderableBounds.height;
}

function registerMousePointerListeners() {
    app.stage.on("pointermove", function(event) {
        mousePointerPosition = event.data.global;
    });
}

function getMousePointerPosition() {
    return { x: mousePointerPosition.x, y: mousePointerPosition.y };
}