class DemonProjectile {
    constructor(speed, pos, dmg) {
        this.speed = speed;
        this.spriteSheet = this.createSpriteSheet();
        this.animatedSprite = this.create(pos);
        this.damage = dmg;
    }

    get position() {
        return { 
            x: this.animatedSprite.x, 
            y: this.animatedSprite.y 
        };
    }

    create(pos) {
        let animatedSprite = new PIXI.AnimatedSprite(this.spriteSheet[this.getMovement(pos)]);
        animatedSprite.scale.set(1.0, 1.0);    
        animatedSprite.animationSpeed = 0.4;
        animatedSprite.loop = false;
        animatedSprite.x = pos.x;
        animatedSprite.y = pos.y;
        animatedSprite.anchor.set(0.5);
        app.stage.addChild(animatedSprite);
        animatedSprite.play();
        return animatedSprite;
    }

    getType() {
        return this.type;
    }
}

class FireOrb extends DemonProjectile {
    constructor(pos) {
        super(4, pos, 10);
        this.direction = this.getMovement(pos) === MovementEnum.LEFT ? DirectionEnum.LEFT : DirectionEnum.RIGHT;
        this.type = DemonProjectileEnum.FIRE_ORB;

        this.secondPoint = {x: player.position.x, y: player.position.y};
        this.startPos = pos;
        this.slope = (this.secondPoint.y - this.position.y) / (this.position.x - this.secondPoint.x); // slope of the line
        this.xCoordinateIncrement = 1 / Math.sqrt((1 + Math.pow(this.slope, 2)));
        this.yCoordinateIncrement = this.slope / Math.sqrt((1 + Math.pow(this.slope, 2)));
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[MovementEnum.LEFT]  = getFramesSlice(fireOrbAssetSpriteSheetId, fireOrbAssetSpriteSheetJsonId, FireOrbAnimationEnum.LEFT);
        spriteSheet[MovementEnum.RIGHT] = getFramesSlice(fireOrbAssetSpriteSheetId, fireOrbAssetSpriteSheetJsonId, FireOrbAnimationEnum.RIGHT);
        return spriteSheet;
    }

    getMovement(pos) {
        return player.position.x > pos.x ? MovementEnum.RIGHT : MovementEnum.LEFT;
    }

    calculateNextPoint() {
        // https://math.stackexchange.com/questions/1150607/compute-position-of-next-point-on-a-line
        let xInc = this.xCoordinateIncrement;
        let yInc = this.yCoordinateIncrement;

        // correction for coordinate system
        if (this.secondPoint.x > this.startPos.x) yInc *= -1;
        if (this.secondPoint.x < this.startPos.x) xInc *= -1;
        
        // add corrected increment to previous coordinate and apply speed
        let xNew = this.position.x + xInc * this.speed;
        let yNew = this.position.y + yInc * this.speed;

        return { x: xNew, y: yNew };
    }

    update() {
        let pos = this.calculateNextPoint();
        this.animatedSprite.x = pos.x;
        this.animatedSprite.y = pos.y;
    }

    handleCollision() {
        player.collideWithProjectile(this);
    }

}

class StormFly extends DemonProjectile {
    constructor(pos) {
        super(3, pos, 20);
        this.animationState = this.getMovement(pos);
        this.type = DemonProjectileEnum.STORM_FLY;
        this.hitPlayer = false;
        this.animatedSprite.scale.set(1, 1);
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[StormFlyAnimationEnum.LEFT]  = getFramesSlice(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheetJsonId, StormFlyAnimationEnum.LEFT);
        spriteSheet[StormFlyAnimationEnum.RIGHT] = getFramesSlice(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheetJsonId, StormFlyAnimationEnum.RIGHT);
        spriteSheet[StormFlyAnimationEnum.SURGE_LEFT]  = getFramesSlice(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheetJsonId, StormFlyAnimationEnum.SURGE_LEFT);
        spriteSheet[StormFlyAnimationEnum.SURGE_RIGHT] = getFramesSlice(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheetJsonId, StormFlyAnimationEnum.SURGE_RIGHT);
        spriteSheet[StormFlyAnimationEnum.EXPLODE_LEFT]  = getFramesSlice(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheetJsonId, StormFlyAnimationEnum.EXPLODE_LEFT);
        spriteSheet[StormFlyAnimationEnum.EXPLODE_RIGHT] = getFramesSlice(stormFlyAssetSpriteSheetId, stormFlyAssetSpriteSheetJsonId, StormFlyAnimationEnum.EXPLODE_RIGHT);
        return spriteSheet;
    }

    getMovement(pos) {
        if (this.animationState) {
            return this.animationState;
        }

        return player.position.x > pos.x ? StormFlyAnimationEnum.RIGHT : StormFlyAnimationEnum.LEFT;
    }

    transitionAnimationState() {
        switch (this.animationState) {
            case StormFlyAnimationEnum.LEFT:
            case StormFlyAnimationEnum.RIGHT:
                this.animationState = player.position.x > this.position.x ? StormFlyAnimationEnum.SURGE_RIGHT : StormFlyAnimationEnum.SURGE_LEFT;
                break;
            case StormFlyAnimationEnum.SURGE_LEFT:
            case StormFlyAnimationEnum.SURGE_RIGHT:
                this.animationState = player.position.x > this.position.x ? StormFlyAnimationEnum.EXPLODE_RIGHT : StormFlyAnimationEnum.EXPLODE_LEFT;
                break;
        }
    }

    handleCollision(index) {
        if (this.animationState === StormFlyAnimationEnum.LEFT || this.animationState === StormFlyAnimationEnum.RIGHT) {
            this.hitPlayer = true;
            this.transitionAnimationState();
            this.animatedSprite.textures = this.spriteSheet[this.animationState];
            this.animatedSprite.loop = true;
            this.animatedSprite.play();
            setTimeout(this.explosion, 1100, this, index);
        }
    }

    explosion(projectile, index) {
        projectile.transitionAnimationState();
        projectile.animatedSprite.textures = projectile.spriteSheet[projectile.animationState];
        projectile.animatedSprite.loop = true;
        projectile.animatedSprite.play();
        playSoundAsset(sparksSoundId);

        if (intersects(projectile.animatedSprite, player.animatedSprite)) {
            player.collideWithProjectile(projectile);
        }

        setTimeout( demonController.despawnDemonProjectile, 1100, projectile, index, demonController );
    }

    update() {
        if (!this.hitPlayer) {
            let pos = this.getNextPosition();
            this.animatedSprite.x = pos.x;
            this.animatedSprite.y = pos.y;
        }
    }

    getNextPosition() {
        let pos = {};
        let direction = player.position.x > this.position.x ? MovementEnum.RIGHT : MovementEnum.LEFT;
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

        if (!this.animatedSprite.playing) {
            this.animatedSprite.textures = this.spriteSheet[player.position.x > pos.x ? StormFlyAnimationEnum.RIGHT : StormFlyAnimationEnum.LEFT];
            this.animatedSprite.play();
        }

        return pos;
    }
}

FireOrbAnimationEnum = {
    LEFT: "left",
    RIGHT: "right"
};

StormFlyAnimationEnum = {
    LEFT: "move-left",
    RIGHT: "move-right",
    SURGE_LEFT: "surge-left",
    SURGE_RIGHT: "surge-right",
    EXPLODE_LEFT: "explode-left",
    EXPLODE_RIGHT: "explode-right"
};