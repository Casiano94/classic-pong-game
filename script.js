const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: canvas.height,
    color: "#FFF"
};

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;

const player = {
    x: 0,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#FFF",
    score: 0,
    dy: 0
};

const ai = {
    x: canvas.width - paddleWidth,
    y: (canvas.height - paddleHeight) / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: "#FFF",
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: "#05EDFF"
};

function drawNet() {
    context.fillStyle = net.color;
    context.fillRect(net.x, net.y, net.width, net.height);
}

function drawPaddle(x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function render() {
    context.fillStyle = "#000";
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawNet();

    drawPaddle(player.x, player.y, player.width, player.height, player.color);
    drawPaddle(ai.x, ai.y, ai.width, ai.height, ai.color);

    drawBall(ball.x, ball.y, ball.radius, ball.color);
}

function update() {
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = -ball.velocityY;
    }

    let playerPaddle = (ball.x < canvas.width / 2) ? player : ai;

    if (collision(ball, playerPaddle)) {
        ball.velocityX = -ball.velocityX;
    }

    // Simple AI to follow the ball
    ai.y += (ball.y - (ai.y + ai.height / 2)) * 0.1;

    // Move player paddle
    player.y += player.dy;

    // Prevent paddles from going out of bounds
    if (player.y < 0) {
        player.y = 0;
    } else if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
    }
    
    if (ai.y < 0) {
        ai.y = 0;
    } else if (ai.y + ai.height > canvas.height) {
        ai.y = canvas.height - ai.height;
    }
}

function collision(b, p) {
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

function gameLoop() {
    update();
    render();
}

document.addEventListener('keydown', movePaddle);
document.addEventListener('keyup', stopPaddle);

function movePaddle(event) {
    switch(event.keyCode) {
        case 38: // flecha hacia arriba
            player.dy = -5;
            break;
        case 40: // flecha hacia abajo
            player.dy = 5;
            break;
    }
}

function stopPaddle(event) {
    switch(event.keyCode) {
        case 38: // flecha hacia arriba
        case 40: // flecha hacia abajo
            player.dy = 0;
            break;
    }
}

setInterval(gameLoop, 1000 / 50);
