class SnakeGame {
    constructor() {
        this.boardSize = 20;
        this.snake = [{x: 10, y: 10}];
        this.food = this.generateFood();
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.gameOverElement = document.getElementById('game-over');
        this.restartButton = document.getElementById('restart-button');
        this.themeToggle = document.getElementById('theme-toggle');
        
        this.initializeBoard();
        this.setupEventListeners();
        this.setupTheme();
        this.startGame();
    }

    initializeBoard() {
        this.gameBoard.innerHTML = '';
        for (let i = 0; i < this.boardSize * this.boardSize; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            this.gameBoard.appendChild(cell);
        }
    }

    setupEventListeners() {
        // Klavye kontrolleri
        document.addEventListener('keydown', (e) => {
            this.handleDirectionChange(e.key);
        });

        // Mobil kontroller
        document.getElementById('up-btn').addEventListener('click', () => this.handleDirectionChange('ArrowUp'));
        document.getElementById('down-btn').addEventListener('click', () => this.handleDirectionChange('ArrowDown'));
        document.getElementById('left-btn').addEventListener('click', () => this.handleDirectionChange('ArrowLeft'));
        document.getElementById('right-btn').addEventListener('click', () => this.handleDirectionChange('ArrowRight'));

        // Yeniden başlatma butonu
        this.restartButton.addEventListener('click', () => this.restart());

        // Gece modu toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    handleDirectionChange(key) {
        switch(key) {
            case 'ArrowUp':
                if (this.direction !== 'down') this.direction = 'up';
                break;
            case 'ArrowDown':
                if (this.direction !== 'up') this.direction = 'down';
                break;
            case 'ArrowLeft':
                if (this.direction !== 'right') this.direction = 'left';
                break;
            case 'ArrowRight':
                if (this.direction !== 'left') this.direction = 'right';
                break;
        }
    }

    setupTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            this.updateThemeIcon(savedTheme);
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeIcon(newTheme);
    }

    updateThemeIcon(theme) {
        this.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.boardSize),
                y: Math.floor(Math.random() * this.boardSize)
            };
        } while (this.snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    update() {
        if (this.gameOver) return;

        const head = {...this.snake[0]};

        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Duvarlarla çarpışma kontrolü
        if (head.x < 0 || head.x >= this.boardSize || head.y < 0 || head.y >= this.boardSize) {
            this.endGame();
            return;
        }

        // Kendiyle çarpışma kontrolü
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.endGame();
            return;
        }

        this.snake.unshift(head);

        // Yem yeme kontrolü
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.scoreElement.textContent = this.score;
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }

        this.draw();
    }

    draw() {
        const cells = this.gameBoard.getElementsByClassName('cell');
        
        // Tüm hücreleri temizle
        Array.from(cells).forEach(cell => {
            cell.className = 'cell';
        });

        // Yılanı çiz
        this.snake.forEach(segment => {
            const index = segment.y * this.boardSize + segment.x;
            cells[index].classList.add('snake');
        });

        // Yemi çiz
        const foodIndex = this.food.y * this.boardSize + this.food.x;
        cells[foodIndex].classList.add('food');
    }

    startGame() {
        this.gameInterval = setInterval(() => this.update(), 150);
    }

    endGame() {
        this.gameOver = true;
        clearInterval(this.gameInterval);
        this.gameOverElement.classList.remove('hidden');
    }

    restart() {
        this.snake = [{x: 10, y: 10}];
        this.direction = 'right';
        this.score = 0;
        this.gameOver = false;
        this.food = this.generateFood();
        this.scoreElement.textContent = this.score;
        this.gameOverElement.classList.add('hidden');
        this.startGame();
    }
}

// Oyunu başlat
window.onload = () => {
    new SnakeGame();
}; 