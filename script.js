// Controle de Popups
document.querySelectorAll('.link-item, .nav-item').forEach(item => {
    item.addEventListener('click', function() {
        const target = this.getAttribute('data-target') || 
                      this.textContent.trim().toLowerCase();
        showPopup(target);
    });
});

function showPopup(target) {
    // Esconder todos os popups primeiro
    document.querySelectorAll('.popup').forEach(popup => {
        popup.classList.add('hidden');
    });
    
    // Mostrar o popup alvo
    const popup = document.getElementById(`${target}-popup`);
    if (popup) popup.classList.remove('hidden');
}

// Fechar popups
document.querySelectorAll('.close-popup, .window-icon.fa-times').forEach(btn => {
    btn.addEventListener('click', function() {
        this.closest('.popup').classList.add('hidden');
    });
});

// Jogo do Dinossauro (300px height)
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 300;

const dino = {
    x: 50,
    y: 250,
    width: 40,
    height: 60,
    jumping: false,
    velocityY: 0
};

let obstacles = [];
let score = 0;
let gameSpeed = 5;
let gameOver = false;

// Controles
document.addEventListener('keydown', (e) => {
    if ((e.code === 'Space' || e.key === 'ArrowUp') && !dino.jumping) {
        dino.jumping = true;
        dino.velocityY = -15;
    }
});

// Game Loop
function gameLoop() {
    if (gameOver) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenhar dinossauro
    ctx.fillStyle = '#0b0e59';
    ctx.fillRect(dino.x, dino.y, dino.width, dino.height);
    
    // Física do pulo
    dino.y += dino.velocityY;
    dino.velocityY += 0.8;
    
    if (dino.y > 250) {
        dino.y = 250;
        dino.jumping = false;
        dino.velocityY = 0;
    }
    
    // Obstáculos
    if (Math.random() < 0.02) {
        obstacles.push({
            x: canvas.width,
            width: 20 + Math.random() * 30,
            height: 30 + Math.random() * 50,
            y: canvas.height - (30 + Math.random() * 50)
        });
    }
    
    // Desenhar e mover obstáculos
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= gameSpeed;
        
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
        
        // Detecção de colisão
        if (dino.x < obstacles[i].x + obstacles[i].width &&
            dino.x + dino.width > obstacles[i].x &&
            dino.y < obstacles[i].y + obstacles[i].height &&
            dino.y + dino.height > obstacles[i].y) {
            gameOver = true;
            alert(`Game Over! Score: ${score}`);
        }
        
        // Remover obstáculos que saíram da tela
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score++;
            if (score % 5 === 0) gameSpeed += 0.5;
        }
    }
    
    // Chão
    ctx.fillStyle = '#000';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    
    // Score
    ctx.font = '20px "Press Start 2P"';
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    
    requestAnimationFrame(gameLoop);
}

// Reiniciar jogo quando clicar na janela
document.querySelector('.game-container').addEventListener('click', () => {
    if (!gameOver) return;
    
    // Resetar jogo
    obstacles = [];
    score = 0;
    gameSpeed = 5;
    gameOver = false;
    dino.y = 250;
    dino.jumping = false;
    dino.velocityY = 0;
    gameLoop();
});

// Iniciar jogo
gameLoop();