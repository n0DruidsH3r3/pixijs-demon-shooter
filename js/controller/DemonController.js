class DemonController {
    constructor() {
        this.demons = [];
        this.demonProjectiles = [];
        this.demonSpawnRate = 120;
        this.demonSpawnDt = 0.0;
        this.tankDemonSpawnLimit = 2;
        this.runnerDemonSpawnLimit = 3;
        this.casterDemonSpawnLimit = 2;

        this.demonsKilled = new Map();
        this.demonsKilled.set(DemonTypeEnum.TANK, 0);
        this.demonsKilled.set(DemonTypeEnum.CASTER, 0);
        this.demonsKilled.set(DemonTypeEnum.RUNNER, 0);

        this.fliesSpawned = 0;
    }

    // resets state of the DemonController instance
    resetState() {
        this.demonsKilled = new Map();
        this.demonsKilled.set(DemonTypeEnum.TANK, 0);
        this.demonsKilled.set(DemonTypeEnum.CASTER, 0);
        this.demonsKilled.set(DemonTypeEnum.RUNNER, 0);

        this.fliesSpawned = 0;

        for (let i = 0; i < this.demons.length; i++) {
            app.stage.removeChild(this.demons[i].healthBar);
            app.stage.removeChild(this.demons[i].animatedSprite);
        }

        for (let i = 0; i < this.demonProjectiles.length; i++) {
            app.stage.removeChild(this.demonProjectiles[i].animatedSprite);
        }

        this.demons = [];
        this.demonProjectiles = [];
    }

    createTeleportSpriteSheet() {
        let spriteSheet = Object.create(null);
        spriteSheet[TeleportAnimationEnum.SPAWNING]  = getFramesSlice(teleportAssetSpriteSheetId, teleportAssetSpriteSheetJsonId, TeleportAnimationEnum.SPAWNING);
        return spriteSheet;
    }

    createTeleportAnimatedSprite(pos) {
        let spriteSheet = this.createTeleportSpriteSheet();
        let animatedSprite = new PIXI.AnimatedSprite(spriteSheet[TeleportAnimationEnum.SPAWNING]);
        animatedSprite.scale.set(0.7, 0.7);    
        animatedSprite.animationSpeed = 0.3;
        animatedSprite.loop = false;
        animatedSprite.x = pos.x;
        animatedSprite.y = pos.y;
        animatedSprite.anchor.set(0.5);
        app.stage.addChild(animatedSprite);
        animatedSprite.play();
        return animatedSprite;
    }

    spawnTeleport(pos) {
        let animatedSprite = this.createTeleportAnimatedSprite(pos);
        setTimeout(this.despawnTeleport, 1000, animatedSprite);
    }

    despawnTeleport(animatedSprite) {
        app.stage.removeChild(animatedSprite);
    }

    spawnDemon(demonType, pos) {
        let numDemonsSpawned = this.demons.filter((demon) => demon.getType() === demonType).length;
        let demon;
        switch (demonType) {
            case DemonTypeEnum.TANK:
                if (numDemonsSpawned >= this.tankDemonSpawnLimit) return;
                this.spawnTeleport(pos);
                demon = new TankDemon(pos);
                break;
            case DemonTypeEnum.CASTER:
                if (numDemonsSpawned >= this.casterDemonSpawnLimit) return;
                this.spawnTeleport(pos);
                demon = new CasterDemon(pos);
                break;
            case DemonTypeEnum.RUNNER:
                if (numDemonsSpawned >= this.runnerDemonSpawnLimit) return;
                demon = new RunnerDemon(pos);
                break;
        }
        
        this.demons.push(demon);
    }

    handleBulletCollision(demon) {
        for (let j = 0; j < bulletController.bullets.length; j++) {
            let bullet = bulletController.bullets[j];
            if (intersects(demon.animatedSprite, bullet.sprite)) {
                if (demon.collideWithBullet(bullet)) {
                    playSoundAsset(demonDeathSoundId);
                    this.demonsKilled.set(demon.getType(), this.demonsKilled.get(demon.getType()) + 1);
                    bulletController.despawnBullet(j, bullet);
                    return true;
                }
                bulletController.despawnBullet(j, bullet);
            }
        }
    }

    handleDemonProjectileCollision(projectile, index) {
        if (intersects(projectile.animatedSprite, player.animatedSprite)) {
            projectile.handleCollision(index);
            if (projectile.getType() === DemonProjectileEnum.FIRE_ORB) {
                this.despawnDemonProjectile(projectile, index);
            } else if (projectile.getType() === DemonProjectileEnum.STORM_FLY) {
                // no despawn for storm-fly here
            }
        }
    }

    update(dt) {

        // spawn demon
        if (this.demonSpawnDt >= this.demonSpawnRate) {
            this.demonSpawnDt = 0.0;
            let rand = Math.random();
            if (rand >= 0.30) {
                this.spawnDemon(DemonTypeEnum.CASTER, spawnableController.getPosition(SpawnableTypeEnum.DEMON_RUNNER_GATE));
            } else {
                this.spawnDemon(DemonTypeEnum.TANK, spawnableController.getPosition(SpawnableTypeEnum.DEMON_RUNNER_GATE));
            }
        } else {
            this.demonSpawnDt += dt;
        }

        // update each demon
        let slainDemonIndices = [];
        for (let i = 0; i < this.demons.length; i++) {
            let demon = this.demons[i];

            demon.update(dt);

            let isDemonSlain = this.handleBulletCollision(demon, i);
            if (isDemonSlain) slainDemonIndices.push(i);

            if (demon.getType() === DemonTypeEnum.RUNNER && demon.exploding && !demon.animatedSprite.playing) {
                app.stage.removeChild(demon.animatedSprite);
                this.demons.splice(i, 1);
            }
        }

        // map slain demons to a string and remove them
        for (let i = 0; i < slainDemonIndices.length; i++) {
            app.stage.removeChild(this.demons[slainDemonIndices[i]].healthBar);
            app.stage.removeChild(this.demons[slainDemonIndices[i]].animatedSprite);
            this.demons[slainDemonIndices[i]] = "SLAIN";
        }

        this.demons = this.demons.filter(val => val !== "SLAIN"); // update demons state

        // update each demon projectile
        for (let i = 0; i < this.demonProjectiles.length; i++) {
            this.demonProjectiles[i].update();
            if (isOutOfScene(this.demonProjectiles[i].animatedSprite)) {
                app.stage.removeChild(this.demonProjectiles[i].animatedSprite);
                this.demonProjectiles.splice(i, 1);
            } else {
                this.handleDemonProjectileCollision(this.demonProjectiles[i], i);
            }
        }
    }

    despawnDemonProjectile(projectile, index , self) {
        if (!self) {
            self = this;
        }
        app.stage.removeChild(projectile.animatedSprite);
        for (let i = 0; i < self.demonProjectiles.length; i++) {
            if (self.demonProjectiles[i] === projectile) {
                self.demonProjectiles.splice(i, 1);
                break;
            }
        }

        
    }
}

DemonTypeEnum = {
    TANK: "tank",
    CASTER: "caster",
    RUNNER: "runner"
};

DemonProjectileEnum = {
    STORM_FLY: "fly",
    FIRE_ORB: "orb"
};

TeleportAnimationEnum = {
    SPAWNING: "teleport"
};