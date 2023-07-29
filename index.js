//Player and Enemy Speed
const PLAYER_SPEED_FORWARD = -5;
const PLAYER_SPEED_BACKWARD = 5;
const PLAYER_SPEED_UP = -15;

const canvas = document.querySelector('canvas');

//Canvas context where the sprites and animations are added
const c = canvas.getContext('2d');

//16:9 Ratio
canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position:{
    x: 0,
    y: 0
  },
  imageSrc: './assets/background.png'

})

const shop = new Sprite({
  position:{
    x: 600,
    y: 130
  },
  imageSrc: './assets/shop.png',
  scale: 2.75,
  framesMax: 6
})

const player = new Fighter({
  position: {
    x: 0,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'red',
  offset: {
    x: 0,
    y: 0
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  }
});

console.log(player);

const keys = {
  a: {
    pressed: false
  },

  d: {
    pressed: false
  },

  w: {
    pressed: false
  },

  ArrowLeft: {
    pressed: false
  },

  ArrowRight: {
    pressed: false
  },

  ArrowUp: {
    pressed: false
  }
}

  //Attack - Detect Collision
  if (collide({
    rectangle1: player,
    rectangle2: enemy
  }) && player.isAttacking) {

    player.isAttacking = false;
    console.log('Player Attacked');

    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }

  if (collide({
    rectangle1: enemy,
    rectangle2: player
  }) && enemy.isAttacking) {

    enemy.isAttacking = false;
    console.log('Enemy Attacked');

    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  //If health runs out
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }

  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    player.update();
    enemy.update();
  
    //Player
    player.velocity.x = 0;
  
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = PLAYER_SPEED_FORWARD;
    }
  
    else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = PLAYER_SPEED_BACKWARD;
    }
  
    else if (keys.w.pressed && player.lastKey === 'w') {
      player.velocity.y = PLAYER_SPEED_UP;
    }
  
    //Enemy
    enemy.velocity.x = 0;
  
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = PLAYER_SPEED_FORWARD;
    }
  
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.velocity.x = PLAYER_SPEED_BACKWARD;
    }
  
    else if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp') {
      enemy.velocity.y = PLAYER_SPEED_UP;
    }
  }

animate()

window.addEventListener('keydown', (event) => {
  console.log(event.key);

  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd'
      break;

    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a'
      break;

    case 'w':
      keys.w.pressed = true;
      player.lastKey = 'w';
      break;

    case 'f':
      player.attack();
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight'
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft'
      break;

    case 'ArrowUp':
      keys.ArrowUp.pressed = true;
      enemy.lastKey = 'ArrowUp';
      break;

    case 'Shift':
      enemy.attack();
      break;
  }
});


window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      player.lastKey = '';
      break;

    case 'a':
      keys.a.pressed = false;
      player.lastKey = ''
      break;

    case 'w':
      keys.w.pressed = false;
      player.lastKey = ''
      break;

    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      enemy.lastKey = ''
      break;

    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      enemy.lastKey = ''
      break;

    case 'ArrowUp':
      keys.ArrowUp.pressed = false;
      enemy.lastKey = '';
      break;
  }
});