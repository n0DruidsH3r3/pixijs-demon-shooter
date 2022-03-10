const playerAssetSpriteSheetId = "player";
const playerAssetSpriteSheet = "/player/spritesheet.png";
const playerAssetSpriteSheetJsonId = "playerSpriteSheetJson";
const playerAssetSpriteSheetJson = "/player/spritesheet.json";

const demonTankAssetSpriteSheetId = "demonTank";
const demonTankAssetSpriteSheet = "/demon-tank/spritesheet.png";
const demonTankAssetSpriteSheetJsonId = "demonTankSpriteSheetJson";
const demonTankAssetSpriteSheetJson = "/demon-tank/spritesheet.json";

const demonCasterAssetSpriteSheetId = "demonCaster";
const demonCasterAssetSpriteSheet = "/demon-caster/spritesheet.png";
const demonCasterAssetSpriteSheetJsonId = "demonCasterSpriteSheetJson";
const demonCasterAssetSpriteSheetJson = "/demon-caster/spritesheet.json";

const fireOrbAssetSpriteSheetId = "fireOrb";
const fireOrbAssetSpriteSheet = "/fire-orb/spritesheet.png";
const fireOrbAssetSpriteSheetJsonId = "fireOrbSpriteSheetJson";
const fireOrbAssetSpriteSheetJson = "/fire-orb/spritesheet.json";

const stormFlyAssetSpriteSheetId = "stormFly";
const stormFlyAssetSpriteSheet = "/storm-fly/spritesheet.png";
const stormFlyAssetSpriteSheetJsonId = "stormFlySpriteSheetJson";
const stormFlyAssetSpriteSheetJson = "/storm-fly/spritesheet.json";

const healthPotionAssetSpriteSheetId = "healthPotion";
const healthPotionAssetSpriteSheet = "/health-potion/spritesheet.png";
const healthPotionAssetSpriteSheetJsonId = "healthPotionSpriteSheetJson";
const healthPotionAssetSpriteSheetJson = "/health-potion/spritesheet.json";

const demonRunnerGateAssetSpriteSheetId = "demonRunnerGate";
const demonRunnerGateAssetSpriteSheet = "/demon-runner-gate/spritesheet.png";
const demonRunnerGateAssetSpriteSheetJsonId = "demonRunnerGateSpriteSheetJson";
const demonRunnerGateAssetSpriteSheetJson = "/demon-runner-gate/spritesheet.json";

const demonRunnerAssetSpriteSheetId = "demonRunner";
const demonRunnerAssetSpriteSheet = "/demon-runner/spritesheet.png";
const demonRunnerAssetSpriteSheetJsonId = "demonRunnerSpriteSheetJson";
const demonRunnerAssetSpriteSheetJson = "/demon-runner/spritesheet.json";

// https://limofeus.itch.io/pixel-simulations
const demonRunnerExplosionAssetSpriteSheetId = "demonRunnerExplosion";
const demonRunnerExplosionAssetSpriteSheet = "/demon-runner-explosion/spritesheet.png";
const demonRunnerExplosionAssetSpriteSheetJsonId = "demonRunnerExplosionSpriteSheetJson";
const demonRunnerExplosionAssetSpriteSheetJson = "/demon-runner-explosion/spritesheet.json";

const teleportAssetSpriteSheetId = "teleport";
const teleportAssetSpriteSheet = "/teleport/spritesheet.png";
const teleportAssetSpriteSheetJsonId = "teleportSpriteSheetJson";
const teleportAssetSpriteSheetJson = "/teleport/spritesheet.json";

const pistolBulletAssetSpriteId = "pistolBullet";
const pistolBulletAssetSprite = "/weapon-pistol/bullet.png";

const rifleBulletAssetSpriteId = "rifleBullet";
const rifleBulletAssetSprite = "/weapon-rifle/bullet.png";

const shotgunBulletAssetSpriteId = "shotgunBullet";
const shotgunBulletAssetSprite = "/weapon-shotgun/bullet.png";

const pistolAssetSpriteId = "pistol";
const pistolAssetSprite = "/weapon-pistol/weapon.png";

const rifleAssetSpriteId = "rifle";
const rifleAssetSprite = "/weapon-rifle/weapon.png";

const shotgunAssetSpriteId = "shotgun";
const shotgunAssetSprite = "/weapon-shotgun/weapon.png";

const demonDeathSoundId = "demonDeath";
const demonDeathSound = "sounds/demon/death.mp3";

const spawnablePickupSoundId = "spawnablePickup";
const spawnablePickupSound = "sounds/spawnables/pickup.wav";

const pistolSoundId = "pistolSound";
const pistolSound = "sounds/weapons/pistol.wav";

const shotgunSoundId = "shotgunSound";
const shotgunSound = "sounds/weapons/shotgun.wav";

const rifleSoundId = "rifleSound";
const rifleSound = "sounds/weapons/rifle.wav";

const flySpawnSoundId = "flySpawnSound";
const flySpawnSound = "sounds/demon/fly.wav";

const sparksSoundId = "sparksSound";
const sparksSound = "sounds/demon/sparks.wav";

const backgroundMusic1Id = "backgroundMusic1";
const backgroundMusic1 = "sounds/background/1.ogg";

const backgroundMusic2Id = "backgroundMusic2";
const backgroundMusic2 = "sounds/background/3.ogg";

const backgroundMusic3Id = "backgroundMusic3";
const backgroundMusic3 = "sounds/background/2.ogg";

const assetsMap = new Map();

function preLoadAssets() {
    app.loader.baseUrl = "new-assets";
    app.loader.add(playerAssetSpriteSheetId, playerAssetSpriteSheet)
        .add(playerAssetSpriteSheetJsonId, playerAssetSpriteSheetJson)
        .add(demonTankAssetSpriteSheetId, demonTankAssetSpriteSheet)
        .add(demonTankAssetSpriteSheetJsonId, demonTankAssetSpriteSheetJson)
        .add(demonCasterAssetSpriteSheetId, demonCasterAssetSpriteSheet)
        .add(demonCasterAssetSpriteSheetJsonId, demonCasterAssetSpriteSheetJson)
        .add(fireOrbAssetSpriteSheetId, fireOrbAssetSpriteSheet)
        .add(fireOrbAssetSpriteSheetJsonId, fireOrbAssetSpriteSheetJson)
        .add(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheet)
        .add(stormFlyAssetSpriteSheetJsonId, stormFlyAssetSpriteSheetJson)
        .add(healthPotionAssetSpriteSheetId, healthPotionAssetSpriteSheet)
        .add(healthPotionAssetSpriteSheetJsonId, healthPotionAssetSpriteSheetJson)
        .add(demonRunnerGateAssetSpriteSheetId, demonRunnerGateAssetSpriteSheet)
        .add(demonRunnerGateAssetSpriteSheetJsonId, demonRunnerGateAssetSpriteSheetJson)
        .add(demonRunnerAssetSpriteSheetId, demonRunnerAssetSpriteSheet)
        .add(demonRunnerAssetSpriteSheetJsonId, demonRunnerAssetSpriteSheetJson)
        .add(demonRunnerExplosionAssetSpriteSheetId, demonRunnerExplosionAssetSpriteSheet)
        .add(demonRunnerExplosionAssetSpriteSheetJsonId, demonRunnerExplosionAssetSpriteSheetJson)
        .add(rifleBulletAssetSpriteId, rifleBulletAssetSprite)
        .add(shotgunBulletAssetSpriteId, shotgunBulletAssetSprite)
        .add(pistolBulletAssetSpriteId, pistolBulletAssetSprite)
        .add(rifleAssetSpriteId, rifleAssetSprite)
        .add(shotgunAssetSpriteId, shotgunAssetSprite)
        .add(pistolAssetSpriteId, pistolAssetSprite)
        .add(teleportAssetSpriteSheetId, teleportAssetSpriteSheet)
        .add(teleportAssetSpriteSheetJsonId, teleportAssetSpriteSheetJson)
        .add(demonDeathSoundId, demonDeathSound)
        .add(spawnablePickupSoundId, spawnablePickupSound)
        .add(pistolSoundId, pistolSound)
        .add(shotgunSoundId, shotgunSound)
        .add(rifleSoundId, rifleSound)
        .add(flySpawnSoundId, flySpawnSound)
        .add(sparksSoundId, sparksSound)
        .add(backgroundMusic1Id, backgroundMusic1)
        .add(backgroundMusic2Id, backgroundMusic2)
        .add(backgroundMusic3Id, backgroundMusic3)
        .load(); // start the asset preloading process

    app.loader.onProgress.add(function(event) { // assets are being preloaded
        console.log(event.progress);
    });

    app.loader.onComplete.add(function(event) { // assets are successfully preloaded
        console.log("Asset preloading process is successfully finished");
        gameController.setUp();
    });

    app.loader.onError.add(function(event) { // error during the preloading of assets
        console.log("ERROR during asset preloading process:", event.mesage);
    });
}


// returns desired portion of sprite sheet's JSON data
function getFrames(spriteSheetJsonId, spriteNameSubStr) {
    return Object.keys(app.loader.resources[spriteSheetJsonId].data.frames)
        .filter(spriteName => spriteName.includes(spriteNameSubStr))
        .map(spriteName => app.loader.resources[spriteSheetJsonId].data.frames[spriteName].frame);
}


// slices and caches the sprite sheet based on it's JSON data for a specific animation.
function getFramesSlice(spriteSheetId, spriteSheetJsonId, spriteName) {
    if (!assetsMap.has(spriteSheetId + "-" + spriteName)) {
        console.log("Caching: ", spriteSheetId + "-" + spriteName);
        let spriteSheet = PIXI.BaseTexture.from(app.loader.resources[spriteSheetId].url);
        let frames = getFrames(spriteSheetJsonId, spriteName)
            .map(frame => new PIXI.Texture(spriteSheet, new PIXI.Rectangle(frame.x, frame.y, frame.w, frame.h)));
        assetsMap.set(spriteSheetId + "-" + spriteName, frames);
    }
    return assetsMap.get(spriteSheetId + "-" + spriteName);
}

function playSoundAsset(id, volume = 0.05) {
    if (!assetsMap.has(id)) {
        console.log("Caching ", id);
        assetsMap.set(id, PIXI.sound.Sound.from(app.loader.resources[id].url));
    }

    assetsMap.get(id).play({volume: volume});
}