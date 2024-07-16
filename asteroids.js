import { outOfBounds, collided } from "./utilities.js"
const ASTEROID_SPEED = 0.3
const SHATTER_SPEED_REDUCTION_FACTOR = 3

export function updateAsteroids(asteroids, dt) {
    maybeAddAnAsteroid(asteroids)
    asteroids.forEach(a => updateAsteroid(a, asteroids, dt))
}

function maybeAddAnAsteroid(asteroids) {
    if (Math.random() < 0.03) {
        // TODO: waste fewer asteroids
        const positioningSeed = Math.random()
        const { x, y } = positioningSeed < 0.25
            ? { x: -50, y: positioningSeed * 4 * window.innerHeight }
            : positioningSeed < 0.5
                ? { x: window.innerWidth + 50, y: (positioningSeed - 0.25) * 4 * window.innerHeight }
                : positioningSeed < 0.75
                    ? { x: (positioningSeed - 0.5) * 4 * window.innerWidth, y: -50 }
                    : { x: (positioningSeed - 0.75) * 4 * window.innerWidth, y: window.innerHeight + 50 }

        const speedSeed = Math.random() * 2 * Math.PI
        const vx = ASTEROID_SPEED * Math.cos(speedSeed)
        const vy = ASTEROID_SPEED * Math.sin(speedSeed)
        const size = Math.random() * 50 + 10
        createAsteroid({ x, y, vx, vy, size }, asteroids)
    }
}

function updateAsteroid(asteroid, asteroids, dt) {
    if (outOfBounds(asteroid)) removeAsteroid(asteroid, asteroids)
    asteroid.x += asteroid.vx * dt
    asteroid.y += asteroid.vy * dt
    asteroid.element.style.left = asteroid.x
    asteroid.element.style.top = asteroid.y
    detectAsteroidCollisions(asteroids)
}

function detectAsteroidCollisions(asteroids) {
    for (let i = 0; i < asteroids.length; i++) {
        if (asteroids[i].isDust) continue
        for (let j = i + 1; j < asteroids.length; j++) {
            if (asteroids[j].isDust) continue
            if (collided(asteroids[i], asteroids[j])) {
                shatterAsteroid(asteroids[i], asteroids)
                shatterAsteroid(asteroids[j], asteroids)

            }
        }
    }
}

function shatterAsteroid(a, asteroids) {
    if (a.size > 40) {
        const offsetFactor = a.size * SHATTER_SPEED_REDUCTION_FACTOR / ASTEROID_SPEED
        const speedSeed = Math.random() * 2 * Math.PI
        const vx1 = ASTEROID_SPEED * Math.cos(speedSeed) / SHATTER_SPEED_REDUCTION_FACTOR + a.vx / SHATTER_SPEED_REDUCTION_FACTOR
        const vy1 = ASTEROID_SPEED * Math.sin(speedSeed) / SHATTER_SPEED_REDUCTION_FACTOR + a.vy / SHATTER_SPEED_REDUCTION_FACTOR
        const vx2 = -ASTEROID_SPEED * Math.cos(speedSeed) / SHATTER_SPEED_REDUCTION_FACTOR + a.vx / SHATTER_SPEED_REDUCTION_FACTOR
        const vy2 = -ASTEROID_SPEED * Math.sin(speedSeed) / SHATTER_SPEED_REDUCTION_FACTOR + a.vy / SHATTER_SPEED_REDUCTION_FACTOR
        createAsteroid({ x: a.x + vx1 * offsetFactor, y: a.y + vy1 * offsetFactor, vx: vx1, vy: vy1, size: a.size / 2 }, asteroids)
        createAsteroid({ x: a.x + vx2 * offsetFactor, y: a.y + vy1 * offsetFactor, vx: vx2, vy: vy2, size: a.size / 2 }, asteroids)
    }
    destroyAsteroid(a, asteroids)
}

export function createAsteroid({ x, y, vx, vy, size, ...rest }, asteroids) {
    const asteroidElement = document.createElement("div")
    asteroidElement.classList.add("asteroid")
    asteroidElement.style.width = `${size}px`
    asteroidElement.style.height = `${size}px`
    asteroidElement.style.left = `${x}px`
    asteroidElement.style.top = `${y}px`

    asteroids.push({ element: asteroidElement, x, y, vx, vy, size, ...rest })
    document.body.appendChild(asteroidElement)
    return asteroidElement
}

export function destroyAsteroid(asteroid, asteroids) {
    asteroid.element.classList.remove("asteroid")
    asteroid.element.classList.add("dust")
    asteroid.isDust = true
    asteroid.vx /= 5
    asteroid.vy /= 5
    setTimeout(() => removeAsteroid(asteroid, asteroids), 1000)
}

function removeAsteroid(asteroid, asteroids) {
    const index = asteroids.findIndex((a) => a === asteroid)
    if (index !== -1) {
        document.body.removeChild(asteroid.element)
        asteroids.splice(index, 1)
    }
}