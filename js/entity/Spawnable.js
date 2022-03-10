class Spawnable {
    constructor(pos) {
        this.spriteSheet = this.createSpriteSheet();
        this.animatedSprite = this.create(pos);
    }

    get position() {
        return { 
            x: this.animatedSprite.x, 
            y: this.animatedSprite.y 
        };
    }

    getType() {
        return this.type;
    }
}

class HealthPotion extends Spawnable {
    constructor(pos) {
        super(pos);
        this.type = SpawnableTypeEnum.HEALTH_POTION;
        this.size = 50;
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[HealthPotionAnimationEnum.FLOATING]  = getFramesSlice(healthPotionAssetSpriteSheetId, healthPotionAssetSpriteSheetJsonId, HealthPotionAnimationEnum.FLOATING);
        return spriteSheet;
    }

    create(pos) {
        let animatedSprite = new PIXI.AnimatedSprite(this.spriteSheet[HealthPotionAnimationEnum.FLOATING]);
        animatedSprite.scale.set(0.15, 0.15);    
        animatedSprite.animationSpeed = 0.2;
        animatedSprite.loop = true;
        animatedSprite.x = pos.x;
        animatedSprite.y = pos.y;
        animatedSprite.anchor.set(0.5);
        app.stage.addChild(animatedSprite);
        animatedSprite.play();
        return animatedSprite;
    }

    update() { }
}

class DemonRunnerGate extends Spawnable {
    constructor(pos) {
        super(pos);
        this.type = SpawnableTypeEnum.DEMON_RUNNER_GATE;
        this.health = 50;
        this.animationState = DemonRunnerGateAnimationEnum.SPAWNING;
        this.spawnRate = 100;
        this.spawnDt = 0.0;
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[DemonRunnerGateAnimationEnum.SPAWNING]  = getFramesSlice(demonRunnerGateAssetSpriteSheetId, demonRunnerGateAssetSpriteSheetJsonId, DemonRunnerGateAnimationEnum.SPAWNING);
        spriteSheet[DemonRunnerGateAnimationEnum.FLOATING]  = getFramesSlice(demonRunnerGateAssetSpriteSheetId, demonRunnerGateAssetSpriteSheetJsonId, DemonRunnerGateAnimationEnum.FLOATING);
        return spriteSheet;
    }

    create(pos) {
        let animatedSprite = new PIXI.AnimatedSprite(this.spriteSheet[DemonRunnerGateAnimationEnum.SPAWNING]);
        animatedSprite.scale.set(1.0, 1.0);    
        animatedSprite.animationSpeed = 0.22;
        animatedSprite.loop = false;
        animatedSprite.x = pos.x;
        animatedSprite.y = pos.y;
        animatedSprite.anchor.set(0.5);
        app.stage.addChild(animatedSprite);
        animatedSprite.play();
        return animatedSprite;
    }

    update() {

        // transition to other animation after being spawned
        if (!this.animatedSprite.playing && this.animationState === DemonRunnerGateAnimationEnum.SPAWNING) {
            this.animatedSprite.textures = this.spriteSheet[DemonRunnerGateAnimationEnum.FLOATING];
            this.animationState = DemonRunnerGateAnimationEnum.FLOATING;
            this.animatedSprite.loop = true;
            this.animatedSprite.animationSpeed = 0.1;
            this.animatedSprite.play();
        }
    }

    collideWithBullet(bullet) {
        this.health -= bullet.damage;
        console.log("Demon Runner Gate: ", this.health);
        if (this.health <= 0) {
            return true;
        }
        return false;
    }

}
class Weapon extends Spawnable {
    
    constructor(pos) {
        super(pos);
        this.floatLevel = 0;
        this.maxFloatLevel = 5;
        this.floatDown = false;
    }

    createSpriteSheet() { }

    create(pos) {
        let weapon = new PIXI.Sprite.from(this.getSpriteURL());
        weapon.anchor.set(0.5);
        weapon.scale.set(0.3, 0.3);
        weapon.x = pos.x;
        weapon.y = pos.y;
        app.stage.addChild(weapon);
        return weapon;
    }

    getBullets() {
        return this.numOfBullets;
    }

    // animate floating of the Weapon
    update() {
        if (!this.floatDown) {
            if (this.floatLevel < this.maxFloatLevel) {
                this.floatLevel++;
                this.animatedSprite.y -= 1;
            } else {
                this.floatDown = true;
            }
        } else {
            if (this.floatLevel > 0) {
                this.floatLevel--;
                this.animatedSprite.y += 1;
            } else {
                this.floatDown = false;
            }
        }
    }
}

class Rifle extends Weapon {
    constructor(pos) {
        super(pos);
        this.type = BulletTypeEnum.RIFLE;
        this.numOfBullets = 60;
    }

    getSpriteURL() {
        return app.loader.resources[rifleAssetSpriteId].url;
    }
}

class Pistol extends Weapon {
    constructor(pos) {
        super(pos);
        this.type = BulletTypeEnum.PISTOL;
        this.numOfBullets = 30;
    }

    getSpriteURL() {
        return app.loader.resources[pistolAssetSpriteId].url;
    }
}

class Shotgun extends Weapon {
    constructor(pos) {
        super(pos);
        this.type = BulletTypeEnum.SHOTGUN;
        this.numOfBullets = 15;
    }

    getSpriteURL() {
        return app.loader.resources[shotgunAssetSpriteId].url;
    }
}

HealthPotionAnimationEnum = {
    FLOATING: "health-potion"
};

DemonRunnerGateAnimationEnum = {
    SPAWNING: "spawning",
    FLOATING: "floating"
};

WeaponAnimationEnum = {
    FLOATING: "floating"
};