const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

class Sprite {
    constructor({position, color}) {
        this.position = position;
        this.color = color;
        
    }
    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, 50, 150)
    }
}



const player = new Sprite({
    position: { x: 500, y: 300 },
    color: 'red'
})

player.draw()

/*
const enemy = new Sprite({
    position: { x: 400, y: 100 },
    color: 'blue'

})
*/

"set interval function to draw enemy at random times"
"set interval function to draw enemy at random positions"
"only draw up to 10 on the screen"

/*
setInterval(() => {
    enemy.position.x = Math.random() * canvas.width
    enemy.position.y = Math.random() * canvas.height
    enemy.draw()
}, 5000) 
*/

function spawnEnemy() {
    if (enemies.length < 10) {
        const enemy = new Sprite({
            position: { x: Math.random() * canvas.width, y: Math.random() * canvas.height }, // Start above the canvas
            color: 'blue'
        });
        enemy.draw();
        enemies.push(enemy);
    }
}

const enemies = [];
setInterval(spawnEnemy, 2000);

"enemy.draw()"

console.log(player)

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height); 
    player.draw();
    enemies.forEach(enemy => {
        const dx = player.position.x - enemy.position.x;
        const dy = player.position.y - enemy.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const speed = 1; // Adjust speed as needed

        // Update enemy position towards the player
        if (distance > 0) {
            enemy.position.x += (dx / distance) * speed;
            enemy.position.y += (dy / distance) * speed;
        }
        
        enemy.draw();
    });
}

animate();