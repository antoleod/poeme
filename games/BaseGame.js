class BaseGame {
    constructor(gameContainer, gameData, gameManager) {
        if (new.target === BaseGame) {
            throw new TypeError("Cannot construct BaseGame instances directly");
        }

        this.gameContainer = gameContainer; // The DOM element where the game will be rendered
        this.gameData = gameData;           // Game-specific data from gameData.js
        this.gameManager = gameManager;     // Provides access to global functions like addStars, addCoins, showFeedback, setGameCompleted, playSound, showScreen

        this.currentLevel = 1;
        this.score = 0;
        this.isGameActive = false;
        this.gameId = this.constructor.name.replace(/Game$/, '').toLowerCase(); // Derive gameId from class name

        // Bind 'this' to methods that will be used as event listeners or callbacks
        this.handleBackToMiniGames = this.handleBackToMiniGames.bind(this);
    }

    // --- Core Game Lifecycle Methods ---

    // Initializes the game for a specific level
    initLevel(level) {
        this.currentLevel = level;
        this.score = 0;
        this.isGameActive = true;
        this.gameContainer.innerHTML = ''; // Clear previous game content

        const levelData = this.getLevelData(level);
        if (!levelData) {
            console.error(`${this.gameId}: No data found for level ${level}`);
            this.endGame(false); // End game if no level data
            return;
        }

        this.renderGame(levelData);
        this.addEventListeners();
        console.log(`${this.gameId}: Level ${this.currentLevel} initialized.`);
    }

    // Abstract method: Must be implemented by subclasses to render game-specific UI
    renderGame(levelData) {
        throw new Error("Subclasses must implement the renderGame(levelData) method.");
    }

    // Abstract method: Must be implemented by subclasses to add game-specific event listeners
    addEventListeners() {
        throw new Error("Subclasses must implement the addEventListeners() method.");
    }

    // Abstract method: Must be implemented by subclasses to remove game-specific event listeners
    removeEventListeners() {
        throw new Error("Subclasses must implement the removeEventListeners() method.");
    }

    // Handles the end of a game or level
    endGame(isCompleted) {
        this.isGameActive = false;
        this.removeEventListeners(); // Clean up event listeners

        let message = '';
        if (isCompleted) {
            message = `Félicitations ! Tu as terminé le niveau ${this.currentLevel} avec un score de ${this.score}.`;
            this.gameManager.addCoins(50); // Award coins for completing a level
            this.gameManager.setGameCompleted(`${this.gameId}-level-${this.currentLevel}`); // Mark specific level as completed
        } else {
            message = `Le jeu est terminé. Ton score final est de ${this.score}.`;
        }

        this.gameContainer.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>${message}</p>
                <button class="btn-primary next-level-btn" ${isCompleted && this.hasMoreLevels() ? '' : 'disabled'}>Niveau Suivant</button>
                <button class="btn-secondary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;

        const nextLevelButton = this.gameContainer.querySelector('.next-level-btn');
        if (nextLevelButton) {
            nextLevelButton.addEventListener('click', () => {
                this.initLevel(this.currentLevel + 1);
            });
        }

        this.gameContainer.querySelector('.back-to-mini-games-menu').addEventListener('click', this.handleBackToMiniGames);

        console.log(`${this.gameId}: Game ended. Completed: ${isCompleted}`);
    }

    // --- Utility Methods for Subclasses ---

    // Retrieves data for a specific level
    getLevelData(level) {
        if (this.gameData && this.gameData.levels && this.gameData.levels[level - 1]) {
            return this.gameData.levels[level - 1];
        }
        return null;
    }

    // Checks if there are more levels available
    hasMoreLevels() {
        return this.gameData && this.gameData.levels && this.gameData.levels.length > this.currentLevel;
    }

    // Common handler for "Back to Mini-Games" button
    handleBackToMiniGames() {
        this.gameManager.showScreen('mini-games-menu-screen');
    }

    // --- Feedback and Reward Methods (delegated to gameManager) ---

    // Shows visual feedback (e.g., checkmark, cross)
    showFeedback(isCorrect, targetElement) {
        this.gameManager.showFeedback(isCorrect, targetElement);
    }

    // Adds stars to the user's total
    addStars(amount) {
        this.gameManager.addStars(amount);
    }

    // Adds coins to the user's total
    addCoins(amount) {
        this.gameManager.addCoins(amount);
    }

    // Plays a sound
    playSound(soundName) {
        this.gameManager.playSound(soundName);
    }
}
