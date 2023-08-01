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
  },
  imageSrc: './assets/hero1/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset:  {
    x: 215,
    y: 157
  },
  sprites: {
    idle: {
      imageSrc: './assets/hero1/Idle.png',
      framesMax: 8
    },

    run: {
      imageSrc: './assets/hero1/Run.png',
      framesMax: 8
    },

    jump: {
      imageSrc: './assets/hero1/Jump.png',
      framesMax: 2
    },

    fall: {
      imageSrc: './assets/hero1/Fall.png',
      framesMax: 2
    },

    attack1: {
      imageSrc: './assets/hero1/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './assets/hero1/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './assets/hero1/Death.png',
      framesMax: 6
    }
  },

  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 175,
    height: 50
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
  },
  imageSrc: './assets/hero2/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset:  {
    x: 215,
    y: 167
  },
  sprites: {
    idle: {
      imageSrc: './assets/hero2/Idle.png',
      framesMax: 4
    },

    run: {
      imageSrc: './assets/hero2/Run.png',
      framesMax: 8
    },

    jump: {
      imageSrc: './assets/hero2/Jump.png',
      framesMax: 2
    },

    fall: {
      imageSrc: './assets/hero2/Fall.png',
      framesMax: 2
    },

    attack1: {
      imageSrc: './assets/hero2/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './assets/hero2/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './assets/hero2/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 175,
    height: 50
  }
});

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

  f: {
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
  },

  Shift: {
    pressed: false
  }
}

decreaseTimer()

  function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = 'rgba(255, 255, 255, 0.1)';
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
  
    //Player  
    player.velocity.x = 0;
  
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = PLAYER_SPEED_FORWARD;
      player.switchSprite('run');
    }
  
    else if (keys.d.pressed && player.lastKey === 'd') {
      player.velocity.x = PLAYER_SPEED_BACKWARD;
      player.switchSprite('run');
    }

    else{
      player.switchSprite('idle');
    }
  
    if (keys.w.pressed && player.lastKey === 'w') {
      player.velocity.y = PLAYER_SPEED_UP;
    }

    if(player.velocity.y < 0){
      player.switchSprite('jump');
    } else if(player.velocity.y > 0){
      player.switchSprite('fall');
    }
  
    //Enemy
    enemy.velocity.x = 0;
  
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = PLAYER_SPEED_FORWARD;
      enemy.switchSprite('run');
    }
  
    else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
      enemy.velocity.x = PLAYER_SPEED_BACKWARD;
      enemy.switchSprite('run');
    }

    else{
      enemy.switchSprite('idle');
    }
  
    if (keys.ArrowUp.pressed && enemy.lastKey === 'ArrowUp') {
      enemy.velocity.y = PLAYER_SPEED_UP;
    }

    if(enemy.velocity.y < 0){
      enemy.switchSprite('jump');
    } else if(enemy.velocity.y > 0){
      enemy.switchSprite('fall');
    }

      //Attack - Detect Collision & Enemy gets hit
    if(rectCollide({
      rectangle1: player,
      rectangle2: enemy
    }) && player.isAttacking
      && player.framesCurrent === 4){

        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
          width: enemy.health + '%'
        })
    }

    //If player misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false;
    }

    if(rectCollide({
      rectangle1: enemy,
      rectangle2: player
    }) && enemy.isAttacking
      && enemy.framesCurrent === 2){
        player.takeHit();
        enemy.isAttacking = false;

        gsap.to('#playerHealth', {
          width: player.health + '%'
        })
    }

    //If enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
      enemy.isAttacking = false;
    }

    //If health runs out
    if (enemy.health <= 0 || player.health <= 0) {
      determineWinner({ player, enemy, timerId });
    }
  }

animate()

window.addEventListener('keydown', (event) => {
  if(timer > 0){
    if(!player.dead){
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
          player.isAttacking = true;
          player.attack();
          break;
      }
    }

    if(!enemy.dead){
      switch (event.key) {

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
    }
  }

});

window.addEventListener('keyup', (event) => {
  if(!player.dead){
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
    }
  }

  if(!enemy.dead){
    switch (event.key) {
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
  }
});