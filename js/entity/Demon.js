class Demon {
    constructor(speed, health, damage, hitRate, animSpeed, pos) {
        this.direction = player.direction;
        this.animSpeed = animSpeed;
        this.spriteSheet = this.createSpriteSheet();
        this.animatedSprite = this.create();
        this.speed = speed;
        this.health = health;
        this.maxHealth = health;
        this.damage = damage;
        this.hitRate = hitRate;
        this.playerHit = false;
        this.playerHitDt = 0.0;
        this.healthBar = this.createHealthBar(100);
    }

    get position() {
        return { 
            x: this.animatedSprite.x, 
            y: this.animatedSprite.y 
        };
    }

    createHealthBar(w) {
        let bar = new PIXI.Graphics();
        bar.beginFill(0x00BB00);
        bar.lineStyle(1, 0x000000);
        bar.drawRect(-this.animatedSprite.width / 1.75, -this.animatedSprite.height / 1.5, w, 5);
        this.animatedSprite.addChild(bar);
        return bar;
    }

    getSpawnPosition() {

        let offset = 200;
        let x = Math.ceil(offset + Math.random() * (pixiAppWidth - 2 * offset));
        let y = Math.ceil(offset + Math.random() * (pixiAppHeight - 2 * offset));

        // spawn on other side of player
        if (player.position.x < (app.view.width / 2) && x < (app.view.width / 2)) {
            x += app.view.width / 2;
        } else if (player.position.x > (app.view.width / 2) && x > (app.view.width / 2)) {
            x -= app.view.width / 2;
        }

        // spawn on other side of player
        if (player.position.y < (app.view.height / 2) && y < (app.view.height / 2)) {
            y += app.view.height / 2;
        } else if (player.position.y > (app.view.height / 2) && y > (app.view.height / 2)) {
            y -= app.view.height / 2;
        }

        // correction
        if ((x + offset) > app.view.width) {
            x -= offset;
        } else if ((x - offset) < 0) {
            x+= offset;
        }

        // correction
        if ((y + offset) > app.view.height) {
            y -= offset;
        } else if ((y - offset) < 0) {
            y += offset;
        }

        return { x: x, y: y };
    }

    create() {
        let pos = this.getSpawnPosition();
        let animatedSprite = new PIXI.AnimatedSprite(this.spriteSheet[this.getMovement(pos)]);
        animatedSprite.scale.set(1.0, 1.0);    
        animatedSprite.animationSpeed = this.animSpeed;
        animatedSprite.loop = false;
        animatedSprite.x = pos.x;
        animatedSprite.y = pos.y;
        animatedSprite.anchor.set(0.5);
        app.stage.addChild(animatedSprite);
        animatedSprite.play();
        return animatedSprite;
    }

    move() {
        let pos = this.getNextPosition();
        if (!this.animatedSprite.playing) {
            this.animatedSprite.textures = this.spriteSheet[this.getMovement(pos)];
            this.animatedSprite.play();
        }
        this.animatedSprite.x = pos.x;
        this.animatedSprite.y = pos.y;
    }

    getMovement(pos) {
        return player.position.x > pos.x ? MovementEnum.RIGHT : MovementEnum.LEFT;
    }

    collideWithBullet(bullet) {
        this.health -= bullet.damage;
        this.animatedSprite.removeChild(this.healthBar);
        this.healthBar = this.createHealthBar(100 * (this.health / this.maxHealth));
        
        if (this.health <= 0) {
            return true;
        }

        return false;
    }

    getNextPosition() {
        let pos = {};
        let direction = this.getMovement(this.position);

        if (direction === MovementEnum.RIGHT) {
            pos.x = this.position.x + this.speed;
        } else if (direction === MovementEnum.LEFT) {
            pos.x = this.position.x - this.speed;
        }
        
        if (player.position.y > this.position.y) {
            pos.y = this.position.y + this.speed;
        } else if (player.position.y < this.position.y) {
            pos.y = this.position.y - this.speed;
        } else {
            // make the tank demon hit and stay for a while
            pos.y = this.position.y;
        }

        let diff = player.position.x - this.position.x;
        diff = diff < 0 ? diff * (-1) : diff;

        if (diff <= this.speed) {
            pos.x = player.position.x;
        }

        diff = player.position.y - this.position.y;
        diff = diff < 0 ? diff * (-1) : diff;

        if (diff <= this.speed) {
            pos.y = player.position.y;
        }

        return pos;
    }

    update(dt) {
        this.move();
        this.attackPlayer(dt); // each demon has its own attack
    }
}

class TankDemon extends Demon {
    constructor(pos) {
        super(1, 100, 20, 50, 0.4); // speed, health, damage, hitRate, animSpeed
        this.animatedSprite.x = pos.x;
        this.animatedSprite.y = pos.y;
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[MovementEnum.LEFT]  = getFramesSlice(demonTankAssetSpriteSheetId, demonTankAssetSpriteSheetJsonId, DemonAnimationEnum.LEFT_RUN);
        spriteSheet[MovementEnum.RIGHT] = getFramesSlice(demonTankAssetSpriteSheetId, demonTankAssetSpriteSheetJsonId, DemonAnimationEnum.RIGHT_RUN);
        return spriteSheet;
    }

    getType() {
        return DemonTypeEnum.TANK;
    }

    attackPlayer(dt) {
        if (this.playerHit) {
            this.playerHitDt += dt;
            if (this.playerHitDt >= this.hitRate) {
                this.playerHit = false;
                this.playerHitDt = 0.0;
            }
        }
    }

}

class CasterDemon extends Demon {
    constructor(pos) {
        super(3, 50, 40, 60, 0.15); // speed, health, damage, hitRate, animSpeed
        this.fireOrbHitRate = 40;
        this.stormFlyHitRate = 120;
        this.fireOrbDt = 0.0;
        this.stormFlyDt = 0.0;
        this.fireOrbs = [];
        this.stormFlies = [];
        this.animatedSprite.x = pos.x;
        this.animatedSprite.y = pos.y;
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[MovementEnum.LEFT]  = getFramesSlice(demonCasterAssetSpriteSheetId, demonCasterAssetSpriteSheetJsonId, DemonAnimationEnum.LEFT_RUN);
        spriteSheet[MovementEnum.RIGHT] = getFramesSlice(demonCasterAssetSpriteSheetId, demonCasterAssetSpriteSheetJsonId, DemonAnimationEnum.RIGHT_RUN);
        return spriteSheet;
    }

    getType() {
        return DemonTypeEnum.CASTER;
    }

    // hop around instead of following the player
    getNextPosition() {
        if (Math.random() < 0.75) {
            return { x: this.position.x, y: this.position.y };
        }

        let horizontalDirection = Math.random() >= 0.5 ? MovementEnum.RIGHT : MovementEnum.LEFT;
        let verticalDirection = Math.random() >= 0.5 ? MovementEnum.UP : MovementEnum.DOWN;
        
        let pos = {};
        if (horizontalDirection === MovementEnum.RIGHT) {
            pos.x = this.position.x + this.speed;
        } else {
            pos.x = this.position.x - this.speed;
        }

        if (verticalDirection === MovementEnum.UP) {
            pos.y = this.position.y - this.speed;
        } else {
            pos.y = this.position.y + this.speed;
        }

        return pos;
    }

    // attacking of CasterDemon is casting a FireOrb or a StormFly
    attackPlayer(dt) {
        let roll = Math.random();
        if (roll >= 0.75) {
            if (this.stormFlyDt >= this.stormFlyHitRate) {
                this.stormFlyDt = 0.0;
                let stormFly = new StormFly(this.position);
                demonController.demonProjectiles.push(stormFly);
                demonController.fliesSpawned += 1;
                playSoundAsset(flySpawnSoundId, 0.2);
            } else {
                this.stormFlyDt += dt;
            }
        } else if (roll >= 0.45) {
            if (this.fireOrbDt >= this.fireOrbHitRate) {
                this.fireOrbDt = 0.0;
                let fireOrb = new FireOrb(this.position);
                demonController.demonProjectiles.push(fireOrb);
            } else {
                this.fireOrbDt += dt;
            }
        }
    }
}

class RunnerDemon extends Demon {
    constructor(pos) {
        super(3, 20, 40, 60, 0.4); // speed, health, damage, hitRate, animSpeed
        this.exploding = false;
        this.animatedSprite.x = pos.x;
        this.animatedSprite.y = pos.y;
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[MovementEnum.LEFT]  = getFramesSlice(demonRunnerAssetSpriteSheetId, demonRunnerAssetSpriteSheetJsonId, DemonAnimationEnum.LEFT_RUN);
        spriteSheet[MovementEnum.RIGHT] = getFramesSlice(demonRunnerAssetSpriteSheetId, demonRunnerAssetSpriteSheetJsonId, DemonAnimationEnum.RIGHT_RUN);
        spriteSheet[MovementEnum.IDLE] = getFramesSlice(demonRunnerExplosionAssetSpriteSheetId, demonRunnerExplosionAssetSpriteSheetJsonId, DemonAnimationEnum.EXPLOSION);
        return spriteSheet;
    }

    getType() {
        return DemonTypeEnum.RUNNER;
    }

    move() {
        if (!this.exploding) {
            super.move();
        }
    }

    attackPlayer() {
        
        // explode on contact with player
        if (!this.exploding && intersects(this.animatedSprite, player.animatedSprite)) {
            this.exploding = true;
            this.animatedSprite.textures = this.spriteSheet[MovementEnum.IDLE];
            this.animatedSprite.loop = false;
            this.animatedSprite.animationSpeed = 3.0;
            this.animatedSprite.scale.set(2.5, 2.5);
            this.animatedSprite.removeChild(this.healthBar);
            this.animatedSprite.play();
            
            player.collideWithDemon(this);
        }
    }
}

DemonAnimationEnum = {
    LEFT_RUN: "left",
    RIGHT_RUN: "right",
    EXPLOSION: "0"
}
