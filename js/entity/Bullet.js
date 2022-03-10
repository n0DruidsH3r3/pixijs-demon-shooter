class Bullet {
    constructor(damage, speed, fireRate, secondPoint) {
        this.damage = damage;
        this.speed = speed;
        this.fireRate = fireRate;
        
        this.sprite = this.createBullet();
        
        // https://math.stackexchange.com/questions/1150607/compute-position-of-next-point-on-a-line
        this.startPos = { x: player.position.x, y: player.position.y }; // 1st point defining a line
        this.secondPoint = secondPoint; // 2nd point defining a line
        this.slope = (this.secondPoint.y - this.position.y) / (this.position.x - this.secondPoint.x); // slope of the line
        this.xCoordinateIncrement = 1 / Math.sqrt((1 + Math.pow(this.slope, 2)));
        this.yCoordinateIncrement = this.slope / Math.sqrt((1 + Math.pow(this.slope, 2)));
    }

    get position() {
        return { 
            x: this.sprite.x, 
            y: this.sprite.y 
        };
    }

    createBullet() {
        let bullet = new PIXI.Sprite.from(app.loader.resources[pistolBulletAssetSpriteId].url);
        bullet.anchor.set(0.5);
        bullet.x = player.position.x;
        bullet.y = player.position.y;
        app.stage.addChild(bullet);
        return bullet;
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
        this.move();
    }

    move() {
        let pos = this.calculateNextPoint();
        this.sprite.x = pos.x;
        this.sprite.y = pos.y;
    }
}

class PistolBullet extends Bullet {

    constructor() {
        super(25, 7, 20, getMousePointerPosition());
    }

}

class RifleBullet extends Bullet {

    constructor() {
        super(35, 9, 12, getMousePointerPosition());
    }

}

class ShotgunBullet extends Bullet {

    constructor(pos) {
        super(50, 12, 40, pos);
    }

}