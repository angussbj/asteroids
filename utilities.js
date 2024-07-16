export function outOfBounds({ x, y }) {
    return x < -100 || x > window.innerWidth + 100 || y < -100 || y > window.innerHeight + 100
}

export function collided(a, b) {
    return distance(center(a), center(b)) < (a.size + b.size) / 2
}

export function center(a) {
    return { x: a.x + a.size / 2, y: a.y + a.size / 2 }
}

export function distance(a, b) {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2)
}
