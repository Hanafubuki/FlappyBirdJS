console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


// [msgGetReady]
const msgGetReady = {
    spriteX: 134,
    spriteY: 0,
    width: 174,
    height: 152,
    canvasX: (canvas.width / 2) - 174 / 2,
    canvasY: 50,
    draw() {
      context.drawImage(
        sprites,
        msgGetReady.spriteX, msgGetReady.spriteY,
        msgGetReady.width, msgGetReady.height,
        msgGetReady.canvasX, msgGetReady.canvasY,
        msgGetReady.width, msgGetReady.height
      );
    }
}

// [Plano de Fundo]
const background = {
    spriteX: 390,
    spriteY: 0,
    width: 275,
    height: 204,
    canvasX: 0,
    canvasY: canvas.height - 204,
    draw() {
      context.fillStyle = '#70c5ce'; //define uma cor que queremos que o fundo tenha
      context.fillRect(0,0, canvas.width, canvas.height) //pinta no canvas, de ponta a ponta
  
      context.drawImage(
        sprites,
        background.spriteX, background.spriteY,
        background.width, background.height,
        background.canvasX, background.canvasY,
        background.width, background.height,
      );
  
      context.drawImage(
        sprites,
        background.spriteX, background.spriteY,
        background.width, background.height,
        (background.canvasX + background.width), background.canvasY, //pra cobrir todo o canvas
        background.width, background.height,
      );
    },
  };
  
  // [floor]
  const floor = {
    spriteX: 0,
    spriteY: 610,
    width: 224,
    height: 112,
    canvasX: 0,
    canvasY: canvas.height - 112,
    draw() {
      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        floor.canvasX, floor.canvasY,
        floor.width, floor.height,
      );
  
      context.drawImage(
        sprites,
        floor.spriteX, floor.spriteY,
        floor.width, floor.height,
        (floor.canvasX + floor.width), floor.canvasY, //pra cobrir todo o canvas
        floor.width, floor.height,
      );
    },
  };

const bird = {
    spriteX: 0,
    spriteY: 0,
    widthBird: 33,
    heightBird: 24,
    canvasX: 10,
    canvasY: 50,
    gravity: 0.05,
    velocity: 0, 
    update() {
        bird.velocity += bird.gravity;
        bird.canvasY += bird.velocity;
    },
    draw(){
        context.drawImage(
            sprites, //imagem
            bird.spriteX, bird.spriteY, //a partir de qual pedaco da imagem devemos pegar a imagem (tipo a margem), em px
            bird.widthBird, bird.heightBird, //tamanho do recorte na sprite: width e height
            bird.canvasX, bird.canvasY, //qual parte do canvas eu quero que inicie a imagem
            bird.widthBird, bird.heightBird//dentro do canvas, qual q eh o tamanho que eu quero q a imagem tenha
        );
    }
}


let activeScreen = {}
function changeToNewScreen(newScreen){
    activeScreen = newScreen
}
const screens = {
    START: {
        draw(){
            background.draw()
            floor.draw()
            bird.draw()
            msgGetReady.draw();
        },
        click(){
            changeToNewScreen(screens.GAME) //vai executar diretamente o draw e o update pq a funcao loop ta rodando
        },
        update(){

        }
    },

    GAME: {
        draw(){
            //tem que colocar nessa ordem pra que quem ta na frente de tudo (o flapbird) sempre apareca
            background.draw()
            floor.draw()
            bird.draw()            
        },
        update(){
            bird.update()
        }
    }
}


function loop(){
    activeScreen.draw();
    activeScreen.update();
    requestAnimationFrame(loop); //vai colocar os quadros da imagem (fps) pra rodarem infinitamente. Nesse caso, a cada quadra, cada segundo, essa mesma funcao vai ser chamada pra ficar printando na tela infinitamente
}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click()
    }
})
changeToNewScreen(screens.START)
loop();
