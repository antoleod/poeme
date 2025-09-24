// jeuDesIntrus.js - Logic for the "Jeu des Intrus" game

const initJeuDesIntrus = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("jeuDesIntrus.js: initJeuDesIntrus called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "jeuDesIntrus";
    const questions = gameData;

    let currentQuestionIndex = 0;
    let score = 0;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            gameContent.innerHTML = `
                <div class="jeu-des-intrus-game">
                    <p class="game-instructions">Clique sur le mot qui n'a PAS le son ${question.sound} !</p>
                    <div class="words-container"></div>
                    <div class="feedback-message"></div>
                </div>
            `;

            const wordsContainer = gameContent.querySelector('.words-container');
            const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

            // Shuffle words
            const shuffledWords = shuffleArray([...question.words]);

            shuffledWords.forEach(word => {
                const button = document.createElement('button');
                button.classList.add('btn-option');
                button.textContent = word;
                button.addEventListener('click', () => checkAnswer(word, question.intruder, button, question.feedback, question.incorrectFeedback));
                wordsContainer.appendChild(button);
            });
        } else {
            endGame();
        }
    }

    function checkAnswer(selectedWord, intruderWord, buttonElement, feedbackText, incorrectFeedbackText) {
        const isCorrect = (selectedWord === intruderWord);
        showFeedback(isCorrect, buttonElement);
        const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

        if (isCorrect) {
            score++;
            addStars(1); // Award 1 star for each correct answer
            audioManager.playSound('correct');
            feedbackMessageDiv.textContent = feedbackText;
            feedbackMessageDiv.style.color = 'var(--correct-color)';
        } else {
            audioManager.playSound('incorrect');
            feedbackMessageDiv.textContent = `${incorrectFeedbackText} L'intrus était : ${intruderWord}`;
            feedbackMessageDiv.style.color = 'var(--incorrect-color)';
        }

        // Disable buttons after answer
        gameContent.querySelectorAll('.btn-option').forEach(btn => btn.disabled = true);

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 2500); // Short delay to show feedback
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Ton score : ${score} sur ${questions.length}</p>
                <p>Tu as démasqué tous les intrus !</p>
                <button class="btn-primary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;
        addCoins(20); // Award coins for completing the game
        setGameCompleted(gameId); // Mark this specific game as completed

        // Re-attach event listener for the back button if it's dynamically created
        gameContent.querySelector('.back-to-mini-games-menu').addEventListener('click', () => {
            document.getElementById('mini-games-menu-screen').classList.add('active');
            gameContainer.classList.remove('active');
        });
    }

    // Initial render
    renderQuestion();
};

// Expose to global scope
window.initJeuDesIntrus = initJeuDesIntrus;
