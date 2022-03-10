let keysTrack = {};
let lastKeyPressed;
let KeyCodeEnum = {
    "W": "87",
    "A": "65",
    "S": "83",
    "D": "68",
    "spacebar": "32",
    "Q": "81",
    "R": "82" 
}

function registerKeyListeners() {
    window.addEventListener("keydown", function(event) {
        if (event.keyCode === "82" && isKeyDown(event.keyCode)) {
            keysTrack[event.keyCode] = false;
            return;
        }
        keysTrack[event.keyCode] = true;
        
        // do not scroll down when spacebar is pressed
        if (event.keyCode == 32 && event.target == document.body) {
            event.preventDefault();
        }
    });
    
    window.addEventListener("keyup", function(event) {
        keysTrack[event.keyCode] = false;
    });
}

function isKeyDown(key) {
    return keysTrack[KeyCodeEnum[key]] === true;
}

function isKeyUp(key) {
    return !isKeyDown(key);
}