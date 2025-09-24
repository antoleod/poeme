// dicteeAudio.js - Logic for the "Dictée Audio" game, refactored to use BaseGame

class DicteeAudioGame extends BaseGame {
    constructor(gameContainer, gameData, gameManager) {
        super(gameContainer, gameData, gameManager);
        this.gameId = "dicteeAudio";
        this.questions = this.gameData.levels; // Assuming gameData for this game has a 'levels' array
        this.currentQuestionIndex = 0;
        this.score = 0;

        // Bind 'this' to methods that will be used as event listeners or callbacks
        this.handlePlayAudio = this.handlePlayAudio.bind(this);
        this.handleCheckAnswer = this.handleCheckAnswer.bind(this);
    }

    initLevel(level) {
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
            <div class="dictee-audio-game">
                <p class="game-instructions">Écoute le mot ou la phrase et écris ce que tu entends !</p>
                <button class="btn-primary play-audio-btn">▶️ Écouter</button>
                <input type="text" class="audio-input" placeholder="Écris ici...">
                <button class="btn-primary check-answer-btn">Vérifier</button>
                <div class="feedback-message"></div>
            </div>
        `;
        this.gameContainer.querySelector('.audio-input').focus();
    }

    addEventListeners() {
        this.gameContainer.querySelector('.play-audio-btn').addEventListener('click', this.handlePlayAudio);
        this.gameContainer.querySelector('.check-answer-btn').addEventListener('click', this.handleCheckAnswer);
    }

    removeEventListeners() {
        this.gameContainer.querySelector('.play-audio-btn').removeEventListener('click', this.handlePlayAudio);
        this.gameContainer.querySelector('.check-answer-btn').removeEventListener('click', this.handleCheckAnswer);
    }

    handlePlayAudio() {
        const question = this.questions[this.currentQuestionIndex];
        this.gameManager.audioManager.speakText(question.word);
    }

    handleCheckAnswer() {
        const audioInput = this.gameContainer.querySelector('.audio-input');
        const checkAnswerBtn = this.gameContainer.querySelector('.check-answer-btn');
        const feedbackMessageDiv = this.gameContainer.querySelector('.feedback-message');
        const question = this.questions[this.currentQuestionIndex];

        const userAnswer = audioInput.value.trim().toLowerCase();
        const correctAnswer = question.word.toLowerCase();
        const isCorrect = (userAnswer === correctAnswer);

        this.gameManager.showFeedback(isCorrect, audioInput);

        if (isCorrect) {
            this.score++;
            this.gameManager.addStars(1);
            this.gameManager.playSound('correct');
            feedbackMessageDiv.textContent = question.feedback;
            feedbackMessageDiv.style.color = 'var(--correct-color)';
        } else {
            this.gameManager.playSound('incorrect');
            feedbackMessageDiv.textContent = `${question.incorrectFeedback} La bonne réponse était : ${question.word}`;
            feedbackMessageDiv.style.color = 'var(--incorrect-color)';
        }

        audioInput.disabled = true;
        checkAnswerBtn.disabled = true;

        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.renderGame(this.questions[this.currentQuestionIndex]);
                this.addEventListeners();
            } else {
                this.endGame(true);
            }
        }, 2500);
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

// Expose to global scope for registration in script.js
window.DicteeAudioGame = DicteeAudioGame;
