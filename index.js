import { updateAsteroids, createAsteroid, destroyAsteroid } from "./asteroids.js"
import { collided, outOfBounds } from "./utilities.js"
import { Ship } from "./Ship.js"

let lastRender = undefined
let asteroids = []
let gameOver = false
let ship = new Ship((x) => createAsteroid(x, asteroids))
let pressedKeys = []

setupKeyEventHandlers()
startGame()

function setupKeyEventHandlers() {
    document.addEventListener("keydown", (e) => {
        pressedKeys.push(e.key)
        e.preventDefault()
    })
    document.addEventListener("keyup", (e) => {
        pressedKeys = pressedKeys.filter(k => k != e.key)
        e.preventDefault()
    })
}

function startGame() {
    window.requestAnimationFrame(renderFrame)
}

function renderFrame(t) {
    pressedKeys.forEach(k => ship.onKeyPress(k, t))

    if (lastRender) {
        const dt = t - lastRender
        ship.move(dt)
        updateAsteroids(asteroids, dt)
        detectShipCollisions(ship, asteroids)
    }

    if (outOfBounds(ship)) {
        endGame()
    }

    lastRender = t
    window.requestAnimationFrame(renderFrame)
}

function detectShipCollisions(ship, asteroids) {
    asteroids.forEach((a) => {
        if (!a.isBullet && collided(ship, a)) {
            destroyAsteroid(a, asteroids)
            endGame()
        }
    })
}

function endGame() {
    gameOver = true
    const gameOverMessage = document.getElementById("game-over")
    gameOverMessage.style.visibility = "visible"
    ship.explode()
    setTimeout(reset, 2000)
}

function reset() {
    gameOver = false
    asteroids.forEach((a) => document.body.removeChild(a.element))
    asteroids = []
    const gameOverMessage = document.getElementById("game-over")
    gameOverMessage.style.visibility = "hidden"
    ship.reset()
}