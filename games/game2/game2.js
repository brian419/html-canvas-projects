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
        constructor({ position, velocity, color, width, height, health }) {
            this.position = position;
            this.velocity = velocity || { x: 0, y: 0 };
            this.color = color;
            this.width = width;
            this.height = height;
            this.health = health;
        }

        draw() {
            c.fillStyle = this.color;
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
        }

        update() {
            this.draw();
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
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
        health: 200
    });

    weapon = new Sprite({
        position: { x: player.position.x - 20, y: player.position.y },
        color: 'white',
        width: 60, //20
        height: 50, //50
        health: Infinity
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
            enemies.push(new Sprite({ position, velocity, color, width: size, height: size, health }));
        }, 3000);
    }

    spawnEnemies();
    //document.addEventListener('keydown', swingWeapon);
    //document.addEventListener('keyup', swingWeaponFalse);
}

function keyDownHandler(e) {
    switch (e.key) {
        case 'w':
            playerVelocity.y = -2;
            weapon.position = { x: player.position.x, y: player.position.y - 10  };  // sword to swing up
            break;
        case 's':
            playerVelocity.y = 2;
            weapon.position = { x: player.position.x, y: player.position.y };  // sword to swing down
            break;
        case 'a':
            playerVelocity.x = -2;
            weapon.position = { x: player.position.x - 50, y: player.position.y };  // sword to swing left
            break;
        case 'd':
            playerVelocity.x = 2;
            weapon.position = { x: player.position.x + 30, y: player.position.y };  // sword to swing right
            break;
        //click on spacebar
        case ' ':
            console.log("spacebar clicked");
            spaceBarClicked = true;
            weapon.position = { x: player.position.x + 30, y: player.position.y };  // sword to swing right
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
}

// function swingWeapon(event) { // Press 'Space' to swing the weapon
//     if (event.key === 'Space') { 
//         weapon.position.x = player.position.x + 30; // Move weapon to swing position
//         weapon.position.y = player.position.y;
//         setTimeout(() => { // Reset weapon position after swing
//             weapon.position.x = player.position.x + 30;
//         }, 500); // Duration of swing
//     }
// }

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
    if (spaceBarClicked) {
        weapon.draw()
    }

    enemies.forEach((enemy, index) => {
        enemy.update();
        drawEnemyHealthBar(enemy);

        // Check if the weapon hits an enemy
        if (weapon.isColliding(enemy)) {
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















// document.getElementById('startButton').addEventListener('click', function() {
//     document.getElementById('welcomeScreen').style.display = 'none';
//     document.getElementById('gameScreen').style.display = 'block';
//     resetGame();
//     initGame();
//     animate();
// });

// document.getElementById('restartButton').addEventListener('click', function() {
//     document.getElementById('gameOverScreen').style.display = 'none';
//     document.getElementById('welcomeScreen').style.display = 'block';
// });

// let canvas, c;
// let player, enemies = [], weapon;
// let animationId;
// let gameIsOver = false;
// let playerVelocity = { x: 0, y: 0 };

// function initGame() {
//     canvas = document.getElementById('gameCanvas');
//     c = canvas.getContext('2d');
//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;

//     window.addEventListener('resize', adjustCanvasSize);

//     function adjustCanvasSize() {
//         canvas.width = window.innerWidth;
//         canvas.height = window.innerHeight;
//         if (player) {
//             player.position.x = canvas.width / 2;
//             player.position.y = canvas.height / 2;
//         }
//     }

//     class Sprite {
//         constructor({ position, velocity, color, width, height, health }) {
//             this.position = position;
//             this.velocity = velocity || { x: 0, y: 0 };
//             this.color = color;
//             this.width = width;
//             this.height = height;
//             this.health = health;
//         }

//         draw() {
//             c.fillStyle = this.color;
//             c.fillRect(this.position.x, this.position.y, this.width, this.height);
//         }

//         update() {
//             this.draw();
//             this.position.x += this.velocity.x;
//             this.position.y += this.velocity.y;
//         }

//         isColliding(other) {
//             return this.position.x < other.position.x + other.width && this.position.x + this.width > other.position.x && this.position.y < other.position.y + other.height && this.position.y + this.height > other.position.y;
//         }
//     }

//     player = new Sprite({
//         position: { x: 350, y: 250 },
//         color: 'red',
//         width: 50,
//         height: 50,
//         health: 200
//     });

//     weapon = new Sprite({
//         position: { x: player.position.x - 20, y: player.position.y },
//         color: 'white',
//         width: 60, //20
//         height: 50, //50
//         health: Infinity
//     });

//     document.addEventListener('keydown', keyDownHandler);
//     document.addEventListener('keyup', keyUpHandler);

//     function spawnEnemies() {
//         setInterval(() => {
//             const size = Math.random() * 30 + 20;
//             const side = Math.floor(Math.random() * 4);
//             let position;
//             switch (side) {
//                 case 0: // Top
//                     position = { x: Math.random() * canvas.width, y: -size };
//                     break;
//                 case 1: // Right
//                     position = { x: canvas.width + size, y: Math.random() * canvas.height };
//                     break;
//                 case 2: // Bottom
//                     position = { x: Math.random() * canvas.width, y: canvas.height + size };
//                     break;
//                 case 3: // Left
//                     position = { x: -size, y: Math.random() * canvas.height };
//                     break;
//             }

//             let velocity = {
//                 x: (player.position.x - position.x) / 200,
//                 y: (player.position.y - position.y) / 200
//             };

//             let color = 'blue';
//             let health = 5;
//             enemies.push(new Sprite({ position, velocity, color, width: size, height: size, health }));
//         }, 3000);
//     }

//     spawnEnemies();
//     document.addEventListener('keydown', swingWeapon);
//     //document.addEventListener('keyup', swingWeaponFalse);
// }

// function keyDownHandler(e) {
//     switch (e.key) {
//         case 'w':
//             playerVelocity.y = -2;
//             weapon.position = { x: player.position.x, y: player.position.y - 10  };  // sword to swing up
//             break;
//         case 's':
//             playerVelocity.y = 2;
//             weapon.position = { x: player.position.x, y: player.position.y };  // sword to swing down
//             break;
//         case 'a':
//             playerVelocity.x = -2;
//             weapon.position = { x: player.position.x - 50, y: player.position.y };  // sword to swing left
//             break;
//         case 'd':
//             playerVelocity.x = 2;
//             weapon.position = { x: player.position.x + 30, y: player.position.y };  // sword to swing right
//             break;
//     }
// }

// function keyUpHandler(e) {
//     if (e.key == 'w' || e.key == 's') {
//         playerVelocity.y = 0;
//     }
//     if (e.key == 'a' || e.key == 'd') {
//         playerVelocity.x = 0;
//     }
// }

// function swingWeapon(event) { // Press 'Space' to swing the weapon
//     if (event.key === 'Space') { 
//         weapon.position.x = player.position.x + 30; // Move weapon to swing position
//         weapon.position.y = player.position.y;
//         setTimeout(() => { // Reset weapon position after swing
//             weapon.position.x = player.position.x + 30;
//         }, 500); // Duration of swing
//     }
// }

// function resetGame() {
//     player = null;
//     enemies = [];
//     weapon = null;
//     gameIsOver = false;
//     //c.clearRect(0, 0, canvas.width, canvas.height);
// }

// function drawPlayerHealthBar() {
//     c.fillStyle = '#555';  // Color of the background of the health bar
//     c.fillRect(player.position.x - 25, player.position.y - 20, 100, 10);  // Draw background bar
//     c.fillStyle = '#f00';  // Color of the health
//     c.fillRect(player.position.x - 25, player.position.y - 20, player.health / 2, 10);  // Draw health bar
// }

// function drawEnemyHealthBar(enemy) {
//     c.fillStyle = '#555';  // Color of the background of the health bar
//     c.fillRect(enemy.position.x, enemy.position.y - 10, enemy.width, 5);  // Draw background bar
//     c.fillStyle = '#0f0';  // Color of the health
//     c.fillRect(enemy.position.x, enemy.position.y - 10, enemy.health / 2, 5);  // Draw health bar
// }

// function animate() {
//     if (gameIsOver) {
//         document.getElementById('gameScreen').style.display = 'none';
//         document.getElementById('gameOverScreen').style.display = 'block';
//         cancelAnimationFrame(animationId);
//         return;
//     }

//     animationId = requestAnimationFrame(animate);
//     c.clearRect(0, 0, canvas.width, canvas.height);
//     player.velocity = playerVelocity;
//     player.update();
//     drawPlayerHealthBar();
//     weapon.position.x = player.position.x + (playerVelocity.x < 0 ? - 60 : 50); // Adjust weapon position based on movement
//     weapon.draw();

//     enemies.forEach((enemy, index) => {
//         enemy.update();
//         drawEnemyHealthBar(enemy);

//         // Check if the weapon hits an enemy
//         if (weapon.isColliding(enemy)) {
//             enemy.health -= 5.0; // Damage caused by the weapon
//         }

//         // Check if the player collides with an enemy
//         if (player.isColliding(enemy)) {
//             player.health -= 2;
//             if (player.health <= 0) {
//                 gameIsOver = true;
//             }
//         }

//         // Remove dead enemies
//         if (enemy.health <= 0) {
//             enemies.splice(index, 1);
//         }
//     });
// }











