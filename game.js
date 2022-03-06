console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const hitSound = new Audio();
hitSound.src = './effects/hit.wav';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

let frames = 0;

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
function createFloor(){
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
        update(){
            const floorMovement = 1; //velocidade
            const repeatAt = floor.width / 2; //a partir de qual pedaco da imagem eh bom repetir? (no caso metade)
            const movement = floor.canvasX - floorMovement; //faz andar
            floor.canvasX = movement % repeatAt; //toda vez que chegar perto do valor do repeatAt, vai voltar a repetir
        }
    };
    return floor;
}

function createBird(){
    const bird = {
        spriteX: 0,
        spriteY: 0,
        widthBird: 33,
        heightBird: 24,
        canvasX: 10,
        canvasY: 50,
        gravity: 0.05,
        velocity: 0, 
        jumpSize: 2.6,
        movements: [
            {spriteX: 0, spriteY: 0}, //get first image in sprite
            {spriteX: 0, spriteY: 26}, //get second image in sprite
            {spriteX: 0, spriteY: 52}, //get third image in sprite
        ],
        frameNow: 0,
        
        draw(){
            bird.updateFrame();
            const { spriteX, spriteY } = bird.movements[bird.frameNow];
            context.drawImage(
                sprites, //imagem
                spriteX, spriteY, //a partir de qual pedaco da imagem devemos pegar a imagem (tipo a margem), em px
                bird.widthBird, bird.heightBird, //tamanho do recorte na sprite: width e height
                bird.canvasX, bird.canvasY, //qual parte do canvas eu quero que inicie a imagem
                bird.widthBird, bird.heightBird//dentro do canvas, qual q eh o tamanho que eu quero q a imagem tenha
            );
        },

        update() {
            if(collision(bird, globals.floor)){
                hitSound.play();
                setTimeout(() =>{
                    changeToNewScreen(screens.END);
                    //bird.reset(); //ao inves disso, cria uma funcao q faz wrap de toda essa classe e chama ela                 
                }, 500)
                return;
            }
            bird.velocity += bird.gravity;
            bird.canvasY += bird.velocity;
        },

        jump(){
            bird.velocity = -bird.jumpSize
        },

        updateFrame(){
            const framesInterval = 15;
            const frameIntervalHasPassed = frames % framesInterval;
            if(frameIntervalHasPassed == 0){ //for every 15 frames, the bird will flapp it's wings
                const startI = 1;
                const i = startI + bird.frameNow; 
                const repetition = bird.movements.length; //faz andar
                bird.frameNow = i % repetition;
            }
        },

        
    }
    return bird;
}

const globals = {}
let activeScreen = {}
function changeToNewScreen(newScreen){
    activeScreen = newScreen

    if(activeScreen.initialize){ //every time it goes back to the main screen, reset the bird
        activeScreen.initialize();
    }
}
const screens = {
    START: {
        initialize(){
            globals.bird = createBird();
            globals.floor = createFloor();
        },
        draw(){
            background.draw()
            globals.floor.draw()
            globals.bird.draw()
            msgGetReady.draw();
        },
        click(){
            changeToNewScreen(screens.GAME) //vai executar diretamente o draw e o update pq a funcao loop ta rodando
        },
        update(){
            globals.floor.update();
        }
    },

    GAME: {
        draw(){
            //tem que colocar nessa ordem pra que quem ta na frente de tudo (o flapbird) sempre apareca
            background.draw()
            globals.floor.draw()
            globals.bird.draw()            
        },
        click(){
            globals.bird.jump();
        },
        update(){
            globals.bird.update()
            globals.floor.update();
        }
    },

    END: {
        draw(){
            //tem que colocar nessa ordem pra que quem ta na frente de tudo (o flapbird) sempre apareca
            background.draw()
            globals.floor.draw()
            msgGetReady.draw()            
        },
        click(){
            changeToNewScreen(screens.START)
        },
        update(){
            
        }
    }
}

function collision(bird, floor){
    if(bird.canvasY + bird.heightBird >= floor.canvasY){
        return true;
    }
    return false;
}

function loop(){
    activeScreen.draw();
    activeScreen.update();
    frames += 1;
    requestAnimationFrame(loop); //vai colocar os quadros da imagem (fps) pra rodarem infinitamente. Nesse caso, a cada quadra, cada segundo, essa mesma funcao vai ser chamada pra ficar printando na tela infinitamente
}

window.addEventListener('click', function(){
    if(activeScreen.click){
        activeScreen.click()
    }
})
changeToNewScreen(screens.START)
loop();
