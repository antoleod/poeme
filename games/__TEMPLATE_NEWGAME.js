// __TEMPLATE_NEWGAME.js - Template for a new game

// This is a template for creating new games.
// Each game should be defined as a class that extends a BaseGame class (to be created).
// It should handle its own rendering, game logic, and interaction with the global game system.

class TemplateNewGame {
    constructor(gameContainer, gameData, gameManager) {
        this.gameContainer = gameContainer; // The DOM element where the game will be rendered
        this.gameData = gameData;           // Game-specific data from gameData.js
        this.gameManager = gameManager;     // Provides access to global functions like addStars, addCoins, showFeedback, setGameCompleted, playSound

        this.currentLevel = 1;
        this.score = 0;
        this.isGameActive = false;

        // Bind 'this' to methods that will be used as event listeners or callbacks
        this.handleUserInput = this.handleUserInput.bind(this);
    }

    // Initialize the game for a specific level
    initLevel(level) {
        this.currentLevel = level;
        this.score = 0;
        this.isGameActive = true;
        this.gameContainer.innerHTML = ''; // Clear previous game content

        // Load level-specific data
        const levelData = this.gameData.levels[level - 1]; // Assuming levels are 1-indexed in game, 0-indexed in array
        if (!levelData) {
            console.error(`TemplateNewGame: No data found for level ${level}`);
            this.endGame(false); // End game if no level data
            return;
        }

        // Render game elements based on levelData
        this.renderGame(levelData);

        // Attach event listeners
        this.addEventListeners();

        console.log(`TemplateNewGame: Level ${this.currentLevel} initialized.`);
    }

    renderGame(levelData) {
        // Implement rendering logic for the specific game
        // Example:
        this.gameContainer.innerHTML = `
            <div class="game-header">
                <h3>Level ${this.currentLevel}</h3>
                <p>Score: ${this.score}</p>
            </div>
            <div class="game-content">
                <p>This is a template game for level ${this.currentLevel}.</p>
                <button class="template-action-btn">Perform Action</button>
            </div>
            <div class="game-controls">
                <button class="btn-secondary back-to-mini-games-menu">Back to Mini-Games</button>
            </div>
        `;
    }

    addEventListeners() {
        // Implement event listeners specific to the game
        const actionButton = this.gameContainer.querySelector('.template-action-btn');
        if (actionButton) {
            actionButton.addEventListener('click', this.handleUserInput);
        }

        const backButton = this.gameContainer.querySelector('.back-to-mini-games-menu');
        if (backButton) {
            backButton.addEventListener('click', () => this.gameManager.showScreen('mini-games-menu-screen'));
        }
    }

    removeEventListeners() {
        // Clean up event listeners to prevent memory leaks
        const actionButton = this.gameContainer.querySelector('.template-action-btn');
        if (actionButton) {
            actionButton.removeEventListener('click', this.handleUserInput);
        }
    }

    handleUserInput() {
        // Implement game-specific logic for user input
        console.log("TemplateNewGame: User input received.");
        // Example: Check answer, update score, provide feedback
        const isCorrect = Math.random() > 0.5; // Simulate a correct/incorrect answer
        if (isCorrect) {
            this.score++;
            this.gameManager.addStars(1);
            this.gameManager.playSound('correct');
            this.gameManager.showFeedback(true, this.gameContainer.querySelector('.game-content'));
        } else {
            this.gameManager.playSound('incorrect');
            this.gameManager.showFeedback(false, this.gameContainer.querySelector('.game-content'));
        }

        // After some action, decide if level continues or ends
        setTimeout(() => {
            if (this.score >= 3) { // Example win condition
                this.endGame(true);
            } else {
                // Continue game or next question
                console.log("TemplateNewGame: Continuing level.");
            }
        }, 1500);
    }

    endGame(isCompleted) {
        this.isGameActive = false;
        this.removeEventListeners(); // Clean up

        let message = '';
        if (isCompleted) {
            message = `Félicitations ! Tu as terminé le niveau ${this.currentLevel} avec un score de ${this.score}.`;
            this.gameManager.addCoins(50); // Award coins for completing a level
            this.gameManager.setGameCompleted(`templateNewGame-level-${this.currentLevel}`); // Mark specific level as completed
        } else {
            message = `Le jeu est terminé. Ton score final est de ${this.score}.`;
        }

        this.gameContainer.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>${message}</p>
                <button class="btn-primary next-level-btn" ${isCompleted ? '' : 'disabled'}>Niveau Suivant</button>
                <button class="btn-secondary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;

        const nextLevelButton = this.gameContainer.querySelector('.next-level-btn');
        if (nextLevelButton) {
            nextLevelButton.addEventListener('click', () => {
                this.initLevel(this.currentLevel + 1);
            });
        }

        const backButton = this.gameContainer.querySelector('.back-to-mini-games-menu');
        if (backButton) {
            backButton.addEventListener('click', () => this.gameManager.showScreen('mini-games-menu-screen'));
        }

        console.log(`TemplateNewGame: Game ended. Completed: ${isCompleted}`);
    }
}

// Register the game with the global game manager (this will be handled by script.js later)
// window.gameManager.registerGame('templateNewGame', TemplateNewGame);
