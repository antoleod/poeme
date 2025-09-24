// associeImageMot.js - Logic for the "Associe Image ↔ Mot" game, refactored to use BaseGame

class AssocieImageMotGame extends BaseGame {
    constructor(gameContainer, gameData, gameManager) {
        super(gameContainer, gameData, gameManager);
        this.gameId = "associeImageMot";
        this.questions = this.gameData; // Assuming gameData for this game is directly the array of questions
        this.currentQuestionIndex = 0;
        this.score = 0;

        // Bind 'this' to methods that will be used as event listeners or callbacks
        this.checkAnswer = this.checkAnswer.bind(this);
    }

    initLevel(level) {
        // For this game, we treat each question as a 'level' for simplicity, or we can adapt BaseGame's level concept
        // Let's adapt BaseGame's level concept to iterate through questions
        this.currentLevel = level;
        this.score = 0; // Score for the current 'run' of the game
        this.isGameActive = true;
        this.gameContainer.innerHTML = ''; // Clear previous game content

        if (this.currentQuestionIndex >= this.questions.length) {
            this.endGame(true); // All questions answered
            return;
        }

        this.renderGame(this.questions[this.currentQuestionIndex]);
        this.addEventListeners();
        console.log(`${this.gameId}: Question ${this.currentQuestionIndex + 1} initialized.`);
    }

    renderGame(question) {
        this.gameContainer.innerHTML = `
            <div class="associe-image-mot-game">
                <p class="game-instructions">Clique sur le mot qui correspond à l'image !</p>
                <div class="image-display">${question.image}</div>
                <div class="options-container"></div>
            </div>
        `;

        const optionsContainer = this.gameContainer.querySelector('.options-container');
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);

        shuffledOptions.forEach(option => {
            const button = document.createElement('button');
            button.classList.add('btn-option');
            button.textContent = option;
            button.addEventListener('click', this.checkAnswer);
            optionsContainer.appendChild(button);
        });
    }

    addEventListeners() {
        // Event listeners are added during renderGame for dynamically created buttons
        // No need to add them here again, but this method must exist.
    }

    removeEventListeners() {
        // Event listeners are removed implicitly when gameContainer.innerHTML is cleared
        // or explicitly by re-rendering. For dynamically created buttons, this is sufficient.
        // If there were persistent listeners, they would be removed here.
        this.gameContainer.querySelectorAll('.btn-option').forEach(button => {
            button.removeEventListener('click', this.checkAnswer);
        });
    }

    checkAnswer(event) {
        const selectedOption = event.target.textContent;
        const currentQuestion = this.questions[this.currentQuestionIndex];
        const isCorrect = (selectedOption === currentQuestion.correct);
        
        this.gameManager.showFeedback(isCorrect, event.target);

        if (isCorrect) {
            this.score++;
            this.gameManager.addStars(1);
            this.gameManager.playSound('correct');
        } else {
            this.gameManager.playSound('incorrect');
        }

        this.gameContainer.querySelectorAll('.btn-option').forEach(btn => btn.disabled = true);

        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.renderGame(this.questions[this.currentQuestionIndex]);
                this.addEventListeners(); // Re-add listeners for new buttons
            } else {
                this.endGame(true); // All questions answered, game completed
            }
        }, 1500);
    }

    endGame(isCompleted) {
        this.isGameActive = false;
        this.removeEventListeners();

        let message = '';
        if (isCompleted) {
            message = `Félicitations ! Tu as terminé le jeu avec un score de ${this.score} sur ${this.questions.length}.`;
            this.gameManager.addCoins(50);
            this.gameManager.setGameCompleted(this.gameId); // Mark the game as completed
        } else {
            message = `Le jeu est terminé. Ton score final est de ${this.score}.`;
        }

        this.gameContainer.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>${message}</p>
                <button class="btn-secondary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;
        this.gameContainer.querySelector('.back-to-mini-games-menu').addEventListener('click', this.handleBackToMiniGames);
        console.log(`${this.gameId}: Game ended. Completed: ${isCompleted}`);
    }
}
