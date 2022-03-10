class SpawnableController {
    constructor() {
        this.spawnables = [];
        this.demonGateSpawnDt = 0.0;
        this.potionSpawnDt = 0.0;
        this.weaponSpawnDt = 0.0;
        this.demonGateSpawnRate = 200;
        this.potionSpawnRate = 120;
        this.weaponSpawnRate = 100;
        this.potionSpawnLimit = 3;
        this.weaponSpawnLimit = 3;
        this.demonRunnerGateSpawnLimit = 1;
        this.healthPotionsConsumed = 0;
        this.weaponsPicked = 0;
        this.demonGatesSpawned = 0;
    }

    // resets state of the SpawnableController instance
    resetState() {
        this.potionSpawnLimit = 3;
        this.weaponSpawnLimit = 3;
        this.demonRunnerGateSpawnLimit = 1;
        this.healthPotionsConsumed = 0;
        this.weaponsPicked = 0;
        this.demonGatesSpawned = 0;

        for (let i = 0; i < this.spawnables.length; i++) {
            app.stage.removeChild(this.spawnables[i].animatedSprite);
        }

        this.spawnables = [];
    }

    spawnSpawnable(type) {

        // limit the number of spawnables by type
        let numAlreadySpawned = this.spawnables.filter(s => s.getType() === type).length;
        switch (type) {
            case SpawnableTypeEnum.HEALTH_POTION:
                if (numAlreadySpawned >= this.potionSpawnLimit) return;
                break;
            case SpawnableTypeEnum.DEMON_RUNNER_GATE:
                if (numAlreadySpawned >= this.demonRunnerGateSpawnLimit) return;
                break;
            case SpawnableTypeEnum.RIFLE:
            case SpawnableTypeEnum.PISTOL:
            case SpawnableTypeEnum.SHOTGUN:
                if (numAlreadySpawned >= this.weaponSpawnLimit) return;
                break;
                
        }


        let spawnable;
        let pos = this.getPosition(type);
        switch (type) {
            case SpawnableTypeEnum.HEALTH_POTION:
                spawnable = new HealthPotion(pos);
                break;
            case SpawnableTypeEnum.DEMON_RUNNER_GATE:
                this.demonGatesSpawned += 1;
                spawnable = new DemonRunnerGate(pos);
                break;
            case SpawnableTypeEnum.RIFLE:
                spawnable = new Rifle(pos);
                break;
            case SpawnableTypeEnum.PISTOL:
                spawnable = new Pistol(pos);
                break;
            case SpawnableTypeEnum.SHOTGUN:
                spawnable = new Shotgun(pos);
                break;
        }

        this.spawnables.push(spawnable);
    }

    getPosition(type) {
        let offset = type === SpawnableTypeEnum.HEALTH_POTION ? 120 : 200;
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

        // do not spawn close to border
        if ((x + offset) > app.view.width) {
            x -= offset;
        } else if ((x - offset) < 0) {
            x+= offset;
        }

        // do not spawn close to border
        if ((y + offset) > app.view.height) {
            y -= offset;
        } else if ((y - offset) < 0) {
            y += offset;
        }

        return { x: x, y: y };
    }

    update(dt) {

        // update each spawnable instance
        for (let i = 0; i < this.spawnables.length; i++) {
            let spawnable = this.spawnables[i];
            
            spawnable.update();
            
            if (spawnable.getType() === SpawnableTypeEnum.HEALTH_POTION) {
                this.handlePlayerCollision(spawnable);
            } else if (spawnable.getType() === SpawnableTypeEnum.DEMON_RUNNER_GATE) {
                this.handleBulletCollision(spawnable);
                
                // after the DemonRunnerGate is spawned, it can spawn RunnerDemons
                if (spawnable.animationState === DemonRunnerGateAnimationEnum.FLOATING) {
                    if (spawnable.spawnDt >= spawnable.spawnRate) {
                        spawnable.spawnDt = 0.0;
                        demonController.spawnDemon(DemonTypeEnum.RUNNER, spawnable.position);
                    } else {
                        spawnable.spawnDt += dt;
                    }
                }
            } else if (spawnable.getType() === SpawnableTypeEnum.PISTOL || spawnable.getType() === SpawnableTypeEnum.RIFLE || spawnable.getType() === SpawnableTypeEnum.SHOTGUN) {
                this.handleWeaponCollision(spawnable);
            }
        }

        // spawn DemonRunnerGate
        if (this.demonGateSpawnDt >= this.demonGateSpawnRate) {
            this.demonGateSpawnDt = 0.0;
            this.spawnSpawnable(SpawnableTypeEnum.DEMON_RUNNER_GATE);
        } else {
            this.demonGateSpawnDt += dt;
        }
        
        // spawn HealthPotion (max 2)
        if (this.spawnables.filter(s => s.getType() === SpawnableTypeEnum.HEALTH_POTION).length != 2) {
            if (this.potionSpawnDt >= this.potionSpawnRate) {
                this.potionSpawnDt = 0.0;
                this.spawnSpawnable(SpawnableTypeEnum.HEALTH_POTION);
            } else {
                this.potionSpawnDt += dt;
            }
        }

        // spawn a Weapon (max 3)
        if (this.spawnables.filter(s => s.getType() === SpawnableTypeEnum.PISTOL || 
                                    s.getType() === SpawnableTypeEnum.SHOTGUN || 
                                    s.getType() === SpawnableTypeEnum.RIFLE).length != 3) {
            if (this.weaponSpawnDt >= this.weaponSpawnRate) {
                this.weaponSpawnDt = 0.0;

                let weaponType;
                let rand = Math.random();
                if (rand >= 0.6) weaponType = SpawnableTypeEnum.SHOTGUN;
                else if (rand >= 0.3) weaponType = SpawnableTypeEnum.RIFLE;
                else weaponType = SpawnableTypeEnum.PISTOL;

                this.spawnSpawnable(weaponType);
            } else {
                this.weaponSpawnDt += dt;
            }
        }
    }

    handleWeaponCollision(weapon) {
        if (intersects(weapon.animatedSprite, player.animatedSprite)) {
            this.weaponsPicked += 1;
            playSoundAsset(spawnablePickupSoundId);
            bulletController.pickUpWeapon(weapon);
            this.despawnSpawnable(weapon);
        }
    }

    handleBulletCollision(spawnable) {
        for (let i = 0; i < bulletController.bullets.length; i++) {
            let bullet = bulletController.bullets[i];
            if (intersects(spawnable.animatedSprite, bullet.sprite)) {
                if (spawnable.collideWithBullet(bullet)) {
                    this.despawnSpawnable(spawnable);
                }
                bulletController.despawnBullet(i, bullet);
            }
        }
    }

    handlePlayerCollision(spawnable) {
        if (intersects(spawnable.animatedSprite, player.animatedSprite)) {
            this.healthPotionsConsumed += 1;
            playSoundAsset(spawnablePickupSoundId);
            player.collideWithHealthPotion(spawnable);
            this.despawnSpawnable(spawnable);
        }
    }

    despawnSpawnable(spawnable) {
        app.stage.removeChild(spawnable.animatedSprite);
        for (let i = 0; i < this.spawnables.length; i++) {
            let currentSpawnable = this.spawnables[i];
            if (currentSpawnable === spawnable) {
                this.spawnables.splice(i, 1);
                break;
            }
        }
    }
}

SpawnableTypeEnum = {
    HEALTH_POTION: "healthPotion",
    DEMON_RUNNER_GATE: "demonRunnerGate",
    RIFLE: "rifle",
    PISTOL: "pistol",
    SHOTGUN: "shotgun"
};