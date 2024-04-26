document.getElementById('startButton').addEventListener('click', function() {
    document.getElementById('welcomeScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    resetGame();
    initGame();
    animate();
});

document.getElementById('restartButton').addEventListener('click', function() {
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('welcomeScreen').style.display = 'block';
});

let canvas, c;
let player, enemies = [], weapon;
let animationId;
let gameIsOver = false;
let playerVelocity = { x: 0, y: 0 };
let spaceBarClicked = false;
let playerSpeed = 1;
let lastDirection = 'right'; // Default direction
let sprintTimer = null;

function initGame() {
    canvas = document.getElementById('gameCanvas');
    c = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', adjustCanvasSize);

    function adjustCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        if (player) {
            player.position.x = canvas.width / 2;
            player.position.y = canvas.height / 2;
        }
    }

    class Sprite {
        constructor({ type, position, velocity, color, width, height, health, stamina }) {
            this.position = position;
            this.velocity = velocity || { x: 0, y: 0 };
            this.color = color;
            this.width = width;
            this.height = height;
            this.health = health;
            this.stamina = stamina;
            this.type = type;
        }

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        update() {
            this.draw();
            if (this.type === 'player') {
                this.position.x += this.velocity.x * playerSpeed;
                this.position.y += this.velocity.y * playerSpeed;
            } else {
                this.position.x += this.velocity.x;
                this.position.y += this.velocity.y;
            }

            
        }

        isColliding(other) {
            return this.position.x < other.position.x + other.width && this.position.x + this.width > other.position.x && this.position.y < other.position.y + other.height && this.position.y + this.height > other.position.y;
        }
    }

    player = new Sprite({
        position: { x: 350, y: 250 },
        color: 'red',
        width: 50,
        height: 50,
        health: 200,
        stamina: 10,
        type: 'player'
    });

    weapon = new Sprite({
        position: { x: player.position.x - 20, y: player.position.y },
        color: 'white',
        width: 60, //20
        height: 50, //50
        health: Infinity,
        type: 'weapon'
    });

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    function spawnEnemies() {
        setInterval(() => {
            const size = Math.random() * 30 + 20;
            const side = Math.floor(Math.random() * 4);
            let position;
            switch (side) {
                case 0: // Top
                    position = { x: Math.random() * canvas.width, y: -size };
                    break;
                case 1: // Right
                    position = { x: canvas.width + size, y: Math.random() * canvas.height };
                    break;
                case 2: // Bottom
                    position = { x: Math.random() * canvas.width, y: canvas.height + size };
                    break;
                case 3: // Left
                    position = { x: -size, y: Math.random() * canvas.height };
                    break;
            }

            let velocity = {
                x: (player.position.x - position.x) / 200,
                y: (player.position.y - position.y) / 200
            };

            let color = 'blue';
            let health = 5;
            enemies.push(new Sprite({ position, velocity, color, width: size, height: size, health, type: 'enemy'}));
        }, 3000);
    }

    spawnEnemies();
}

function keyDownHandler(e) {
    switch (e.key) {
        case 'w':
            playerVelocity.y = -2;
            weapon.position = { x: player.position.x, y: player.position.y - 50  };  // sword to swing up
            break;
        case 's':
            playerVelocity.y = 2;
            weapon.position = { x: player.position.x, y: player.position.y };  // sword to swing down
            break;
        case 'a':
            playerVelocity.x = -2;
            lastDirection = 'left'; // Update last direction
            weapon.position = { x: player.position.x - 50, y: player.position.y };  // sword to swing left
            break;
        case 'd':
            playerVelocity.x = 2;
            lastDirection = 'right'; // Update last direction
            weapon.position = { x: player.position.x + 30, y: player.position.y };  // sword to swing right
            break;
        case ' ':
            spaceBarClicked = true;
            weapon.position = { x: player.position.x + 30, y: player.position.y };  // sword to swing right
            break;

        case 'm':
            if (player.stamina > 0 && sprintTimer === null) {
                playerSpeed = 2; // Increase player speed
                sprintTimer = setInterval(() => { // Start the sprint duration timer
                    player.stamina -= 1; // Decrease stamina every second
                    if (player.stamina <= 0) {
                        clearInterval(sprintTimer); // Clear the timer when stamina runs out
                        sprintTimer = null; // Reset the timer variable
                        playerSpeed = 1; // Reset player speed
                    }
                }, 1000); // Decrease stamina every 1000ms (1 second)
            }
            break;
        
    }
}

function keyUpHandler(e) {
    if (e.key == 'w' || e.key == 's') {
        playerVelocity.y = 0;
    }
    if (e.key == 'a' || e.key == 'd') {
        playerVelocity.x = 0;
    }
    if (e.key == ' ') {
        spaceBarClicked = false;
    }
    if (e.key == 'm') {
        playerSpeed = 1; // Reset player speed
    }   
}


function resetGame() {
    player = null;
    enemies = [];
    weapon = null;
    gameIsOver = false;
    //c.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayerHealthBar() {
    c.fillStyle = '#555';  // Color of the background of the health bar
    c.fillRect(player.position.x - 25, player.position.y - 20, 100, 10);  // Draw background bar
    c.fillStyle = '#f00';  // Color of the health
    c.fillRect(player.position.x - 25, player.position.y - 20, player.health / 2, 10);  // Draw health bar
}

function drawEnemyHealthBar(enemy) {
    c.fillStyle = '#555';  // Color of the background of the health bar
    c.fillRect(enemy.position.x, enemy.position.y - 10, enemy.width, 5);  // Draw background bar
    c.fillStyle = '#0f0';  // Color of the health
    c.fillRect(enemy.position.x, enemy.position.y - 10, enemy.health / 2, 5);  // Draw health bar
}

function animate() {
    if (gameIsOver) {
        document.getElementById('gameScreen').style.display = 'none';
        document.getElementById('gameOverScreen').style.display = 'block';
        cancelAnimationFrame(animationId);
        return;
    }
    animationId = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    player.velocity = playerVelocity;
    player.update();
    drawPlayerHealthBar();
    weapon.position.x = player.position.x + (playerVelocity.x < 0 ? - 60 : 50); // Adjust weapon position based on movement
    //weapon.draw();
    // if (spaceBarClicked) {
    //     weapon.draw()
    // }

    if (spaceBarClicked && lastDirection == 'right') {
        weapon.position = { x: player.position.x + 50, y: player.position.y };  // sword to swing right
        weapon.draw();
    }
    if (spaceBarClicked && lastDirection == 'left') {
        weapon.position = { x: player.position.x - 60, y: player.position.y };  // sword to swing left
        weapon.draw();
    }



    enemies.forEach((enemy, index) => {
        enemy.update();
        drawEnemyHealthBar(enemy);

        //if the weapon is colliding with the enemy and spacebar is clicked
        if (weapon.isColliding(enemy) && spaceBarClicked) {
            enemy.health -= 5.0; // Damage caused by the weapon
            player.health += 5.0; // Health gained by hitting the enemy
        }

        // Check if the player collides with an enemy
        if (player.isColliding(enemy)) {
            player.health -= 2;
            if (player.health <= 0) {
                gameIsOver = true;
            }
        }

        // Remove dead enemies
        if (enemy.health <= 0) {
            enemies.splice(index, 1);
        }
    });
}