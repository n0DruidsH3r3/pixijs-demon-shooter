class Player {
    constructor() {
        this.direction = DirectionEnum.RIGHT;
        this.spriteSheet = this.createSpriteSheet();
        this.animatedSprite = this.create();
        this.speed = 5;
        this.health = 200;
        this.maxHealth = 200;
        this.facingDirection = DirectionEnum.RIGHT;
        this.mousePointerX;
        this.mousePointerY;
        this.weaponSwitched = false;
        this.movementCorrection = 0.45;
        this.previousDirection = DirectionEnum.RIGHT;
        this.canAnimateIdle = false;
    }

    get position() {
        return { 
            x: this.animatedSprite.x, 
            y: this.animatedSprite.y 
        };
    }

    resetState() {
        this.health = this.maxHealth;
    }

    createSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[MovementEnum.LEFT_IDLE]  = getFramesSlice(playerAssetSpriteSheetId, playerAssetSpriteSheetJsonId, PlayerAnimationEnum.LEFT_IDLE);
        spriteSheet[MovementEnum.RIGHT_IDLE]  = getFramesSlice(playerAssetSpriteSheetId, playerAssetSpriteSheetJsonId, PlayerAnimationEnum.RIGHT_IDLE);
        spriteSheet[MovementEnum.LEFT]  = getFramesSlice(playerAssetSpriteSheetId, playerAssetSpriteSheetJsonId, PlayerAnimationEnum.LEFT_RUN);
        spriteSheet[MovementEnum.RIGHT] = getFramesSlice(playerAssetSpriteSheetId, playerAssetSpriteSheetJsonId, PlayerAnimationEnum.RIGHT_RUN);
        return spriteSheet;
    }

    create() {
        let animatedSprite = new PIXI.AnimatedSprite(this.spriteSheet[MovementEnum.RIGHT_IDLE]);
        animatedSprite.scale.set(0.4, 0.4);    
        animatedSprite.animationSpeed = 0.1;
        animatedSprite.loop = false;
        animatedSprite.x = app.view.width / 2;
        animatedSprite.y = app.view.height / 2;
        animatedSprite.anchor.set(0.5);
        app.stage.addChild(animatedSprite);
        animatedSprite.play();
        return animatedSprite;
    }

    move(x, y, direction) {

        if (this.previousDirection !== this.direction || !this.animatedSprite.playing) {

            // animation speed correction for up/down direction
            if (this.direction === DirectionEnum.DOWN || this.direction === DirectionEnum.UP) {
                this.animatedSprite.animationSpeed = 0.1;
            } else {
                this.animatedSprite.animationSpeed = 0.4;
            }

            this.animatedSprite.textures = this.spriteSheet[direction];
            this.animatedSprite.play();
        }

        // vertical bounds detection
        let hitsLeftBorder = (this.animatedSprite.x + x) <= (this.animatedSprite.width * 0.60);
        let hitsRightBorder = (this.animatedSprite.x + x) >= (app.view.width * 0.97);
        if (!hitsLeftBorder && !hitsRightBorder) 
            this.animatedSprite.x += x;

        // horizontal bounds detection
        let hitsTopBorder = (this.animatedSprite.y + y) <= (this.animatedSprite.height * 0.50);
        let hitsBottomBorder = (this.animatedSprite.y + y) >= (app.view.height * 0.93);
        if (!hitsTopBorder && !hitsBottomBorder)
            this.animatedSprite.y += y;

    }

    idle() {

        if (!this.canAnimateIdle) {
            this.animatedSprite.stop();
            this.canAnimateIdle = true;
        }

        if (this.canAnimateIdle && !this.animatedSprite.playing) {
            this.animatedSprite.textures = this.spriteSheet[this.getIdleMovementFromDirection()];
            this.direction = this.facingDirection;
            this.animatedSprite.animationSpeed = 0.1;
            this.animatedSprite.play();
        }
        
    }

    getIdleMovementFromDirection() {
        return this.facingDirection === DirectionEnum.RIGHT ? MovementEnum.RIGHT_IDLE : MovementEnum.LEFT_IDLE;
    }

    update(dt) {

        if (this.health <= 0) {
            gameController.isPaused = true;
            document.getElementById("game-over").style.display = "block";
        }

        this.updateMovement();
        this.updateWeapon(dt);
        this.handleDemonCollision();
    }

    updateWeapon(dt) {
        if (isKeyUp("R")) this.weaponSwitched = false;

        if (isKeyDown("spacebar")) {
            bulletController.fireBullet(dt);
        }

        if (isKeyDown("R") && !this.weaponSwitched) {
            this.weaponSwitched = true;
            bulletController.switchWeapon();
        }
    }

    updateMovement() {
        let idle = true;

        // contradicting keys are pressed
        if (isKeyDown("A") && isKeyDown("D") || isKeyDown("W") && isKeyDown("S")) {
            this.idle();
            return;
        }

        if (isKeyDown("W")) {
            if (isKeyDown("A")) { // "W" + "A"
                this.direction = DirectionEnum.LEFT;
                this.facingDirection = DirectionEnum.LEFT;
                this.move(-this.speed * this.movementCorrection, -this.speed * this.movementCorrection, MovementEnum.LEFT);
            } else if (isKeyDown("D")) { // "W" + "D"
                this.direction = DirectionEnum.RIGHT;
                this.facingDirection = DirectionEnum.RIGHT;
                this.move(this.speed * this.movementCorrection, -this.speed * this.movementCorrection, MovementEnum.RIGHT);
            } else { // only "W"
                this.direction = DirectionEnum.UP;
                this.move(0, -this.speed, this.getIdleMovementFromDirection());
            }
            idle = false;
        }

        if (isKeyDown("S")) {
            if (isKeyDown("A")) { // "S" + "A"
                this.direction = DirectionEnum.LEFT;
                this.facingDirection = DirectionEnum.LEFT;
                this.move(-this.speed * this.movementCorrection, this.speed * this.movementCorrection, MovementEnum.LEFT);               
            } else if (isKeyDown("D")) { // "S" + "D"
                this.direction = DirectionEnum.RIGHT;
                this.facingDirection = DirectionEnum.RIGHT;
                this.move(this.speed * this.movementCorrection, this.speed * this.movementCorrection, MovementEnum.RIGHT);
            } else { // only "S"
                this.direction = DirectionEnum.DOWN;
                this.move(0, this.speed, this.getIdleMovementFromDirection());
            }
            idle = false;
        }

        if (isKeyDown("A")) { // A
            idle = false;
            this.direction = DirectionEnum.LEFT;
            this.facingDirection = DirectionEnum.LEFT;
            this.move(-this.speed, 0, MovementEnum.LEFT);
        }

        if (isKeyDown("D")) { // D
            idle = false;
            this.direction = DirectionEnum.RIGHT;
            this.facingDirection = DirectionEnum.RIGHT;
            this.move(this.speed, 0, MovementEnum.RIGHT);
        }

        this.previousDirection = this.direction;

        if (idle) {
            this.idle();
        } else {
            this.canAnimateIdle = false;
        }

    }

    collideWithDemon(demon) {
        demon.playerHit = true;
        this.health -= demon.damage;
        if (this.health <= 0) {
            return true;
        }

        return false;
    }

    collideWithProjectile(projectile) {
        this.health -= projectile.damage;
    }

    collideWithHealthPotion(healthPotion) {
        this.health += healthPotion.size;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
    }

    handleDemonCollision() {
        for (let i = 0; i < demonController.demons.length; i++) {
            let demon = demonController.demons[i];
            if (intersects(demon.animatedSprite, this.animatedSprite)) {
                if (!demon.playerHit && this.collideWithDemon(demon)) {
                    // game over
                }
            }
        }
    }
}

PlayerAnimationEnum = {
    LEFT_IDLE: "stand-left",
    RIGHT_IDLE: "stand-right",
    LEFT_RUN: "run-left",
    RIGHT_RUN: "run-right"
}

