class BulletController {

    constructor() {
        this.bullets = [];
        this.bulletFireDt = BulletTypeFireRate[BulletTypeEnum.PISTOL]; // can shoot immediately
        this.bulletType = BulletTypeEnum.PISTOL;
        
        this.weapons = new Map();
        this.weapons.set(this.bulletType, 30);
        this.weapons.set(BulletTypeEnum.RIFLE, 0);
        this.weapons.set(BulletTypeEnum.SHOTGUN, 0);

        this.bulletsFired = 0;
    }

    // resets state of the BulletController instance
    resetState() {
        this.bulletFireDt = BulletTypeFireRate[BulletTypeEnum.PISTOL]; // can shoot immediately
        this.bulletType = BulletTypeEnum.PISTOL;
        this.weapons = new Map();
        this.weapons.set(this.bulletType, 30);
        this.weapons.set(BulletTypeEnum.RIFLE, 0);
        this.weapons.set(BulletTypeEnum.SHOTGUN, 0);
        this.bulletsFired = 0;

        for (let i = 0; i < this.bullets.length; i++) {
            app.stage.removeChild(this.bullets[i].sprite);
        }

        this.bullets = [];
    }

    fireBullet(dt) {
        if (this.bulletFireDt >= BulletTypeFireRate[this.bulletType]) {
            if (!this.weapons.get(this.bulletType) == 0) {
                this.bulletFireDt = 0.0;
                this.spawnBullet(this.bulletType);
                this.weapons.set(this.bulletType, this.weapons.get(this.bulletType) - 1);
            }
        } else {
            this.bulletFireDt += dt;
        }    
    }

    // switches weapon based on previously used weapon
    switchWeapon() {
        if (this.bulletType === BulletTypeEnum.PISTOL) {
            if (this.weapons.get(BulletTypeEnum.RIFLE) != 0) {
                this.setBulletType(BulletTypeEnum.RIFLE);
            } else if (this.weapons.get(BulletTypeEnum.SHOTGUN) != 0) {
                this.setBulletType(BulletTypeEnum.SHOTGUN);
            }
        } else if (this.bulletType === BulletTypeEnum.RIFLE) {
            if (this.weapons.get(BulletTypeEnum.SHOTGUN) != 0) {
                this.setBulletType(BulletTypeEnum.SHOTGUN);
            } else if (this.weapons.get(BulletTypeEnum.PISTOL) != 0) {
                this.setBulletType(BulletTypeEnum.PISTOL);
            }
        } else if (this.bulletType === BulletTypeEnum.SHOTGUN) {
            if (this.weapons.get(BulletTypeEnum.PISTOL) != 0) {
                this.setBulletType(BulletTypeEnum.PISTOL);
            } else if (this.weapons.get(BulletTypeEnum.RIFLE) != 0) {
                this.setBulletType(BulletTypeEnum.RIFLE);
            }
        }
    }

    despawnBullet(index, bullet) {
        app.stage.removeChild(bullet.sprite);
        this.bullets.splice(index, 1);
    }

    setBulletType(type) {
        this.bulletType = type;
        this.bulletFireDt = BulletTypeFireRate[type]; // can shoot immediately
    }

    spawnBullet(type) {
        let bullet;
        switch (type) {
            case BulletTypeEnum.PISTOL:
                playSoundAsset(pistolSoundId);
                bullet = new PistolBullet();
                this.bullets.push(bullet);
                this.bulletsFired += 1;
                break;
            case BulletTypeEnum.RIFLE:
                playSoundAsset(rifleSoundId);
                bullet = new RifleBullet();
                this.bullets.push(bullet);
                this.bulletsFired += 1;
                break;
            case BulletTypeEnum.SHOTGUN:
                playSoundAsset(shotgunSoundId);
                let pos = getMousePointerPosition();
                let middleBullet = new ShotgunBullet(pos);
                let topBullet = new ShotgunBullet({x: pos.x, y: pos.y - pos.y / 4});
                let bottomBullet = new ShotgunBullet({x: pos.x, y: pos.y + pos.y / 4});
                this.bullets.push(middleBullet);
                this.bullets.push(topBullet);
                this.bullets.push(bottomBullet);
                this.bulletsFired += 3;
                break;
        }

        
    }

    pickUpWeapon(weapon) {
        if (this.weapons.has(weapon.getType())) {
            this.weapons.set(weapon.getType(), this.weapons.get(weapon.getType()) + weapon.getBullets());
        } else {
            this.weapons.set(weapon.getType(), weapon.getBullets());
        }
    }

    update() {
        for (let i = 0; i < this.bullets.length; i++) {
            let bullet = this.bullets[i];

            bullet.update();
            if (isOutOfScene(bullet.sprite)) this.despawnBullet(i, bullet);
            
        }
    }

}

BulletTypeEnum = {
    PISTOL: "pistol",
    RIFLE: "rifle",
    SHOTGUN: "shotgun"
};

// fire rate for each bullet type
BulletTypeFireRate = {};
BulletTypeFireRate[BulletTypeEnum.PISTOL] = 20;
BulletTypeFireRate[BulletTypeEnum.RIFLE] = 8;
BulletTypeFireRate[BulletTypeEnum.SHOTGUN] = 30;

