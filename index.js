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

const gravity = 0.6;

class Sprite {
  constructor({ position, velocity, color = 'red', offset }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 50;
    this.height = 150;

    //Tracks what the last pressed key was, which helps in keeping the movement accurate
    this.lastKey;

    //Attacking hitbox
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y
      },
      offset,   //Shorthand for offset: offset
      width: 100,
      height: 50
    }

    this.color = color
    this.isAttacking;
    this.health = 100;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);


    //Attack Hitbox
    if (this.isAttacking) {
      c.fillStyle = 'rgba(55,126,33,0.4)';
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height);
    }
  }

  update() {
    this.draw()
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x
    this.attackBox.position.y = this.position.y

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //Prevents players and enemy from falling off the screen
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    }

    else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}

const player = new Sprite({
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

const enemy = new Sprite({
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

function determineWinner({player, enemy, timerId}) {
  clearTimeout(timerId)
  document.querySelector('#resultText').style.display = 'flex'

  if (player.health === enemy.health) {
    document.querySelector('#resultText').innerHTML = 'Tie'
  }

  else if (player.health > enemy.health) {
    document.querySelector('#resultText').innerHTML = 'Player 1 Wins'
  }

  else {
    document.querySelector('#resultText').innerHTML = 'Player 2 Wins'
  }
}

let timer = 60
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }

  if (timer === 0) {

  }

}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
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

  function collide({ rectangle1, rectangle2 }) {
    return (
      rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
      && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
      && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
      && rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
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
    determineWinner({ player, enemy });
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