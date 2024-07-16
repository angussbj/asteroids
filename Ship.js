const A_XY = 0.001
const A_THETA = 0.0001
const V_BULLET = 2

export class Ship {
    size = 40
    isDead = false

    constructor(createStuff) {
        this.reset()
        this.createStuff = createStuff
    }

    reset() {
        Array.from(document.getElementsByClassName("ship"))
            .forEach((s) => document.body.removeChild(s))
        this.element = document.createElement("div")
        this.element.classList.add("ship")

        this.x = window.innerWidth / 2
        this.y = window.innerHeight / 2
        this.vx = 0
        this.vy = 0
        this.theta = 0
        this.vtheta = 0
        this.isDead = false

        this.setShipPosition()
        document.body.appendChild(this.element)
    }

    onKeyPress(key, t) {
        switch (key) {
            case "w":
                this.vx += A_XY * Math.sin(this.theta)
                this.vy -= A_XY * Math.cos(this.theta)
                return
            case "s":
                this.vx -= A_XY * Math.sin(this.theta)
                this.vy += A_XY * Math.cos(this.theta)
                return
            case "a":
                this.vtheta -= A_THETA
                return
            case "d":
                this.vtheta += A_THETA
                return
            case " ":
                this.shoot(t)
        }
    }

    move(dt) {
        this.theta += this.vtheta * dt
        this.element.style.transform = `rotate(${this.theta}rad)`
        this.x += this.vx * dt
        this.y += this.vy * dt
        this.setShipPosition()
    }

    setShipPosition() {
        this.element.style.left = this.x
        this.element.style.top = this.y
    }

    explode() {
        this.isDead = true
        this.element.classList.remove("ship")
        this.element.classList.add("explosion")
    }

    shoot(t) {
        if (this.isDead || this.lastShot && t - this.lastShot < 200) {
            return
        }

        this.lastShot = t
        const bullet = this.createStuff({
            x: this.x + 20 + this.size * Math.sin(this.theta) * 0.7,
            y: this.y + 25 - this.size * Math.cos(this.theta) * 0.7,
            vx: this.vx + V_BULLET * Math.sin(this.theta),
            vy: this.vy - V_BULLET * Math.cos(this.theta),
            size: 4,
            isBullet: true
        })
        bullet.style.backgroundColor = "lime "
    }
}

