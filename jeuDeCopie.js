// jeuDeCopie.js - Logic for the "Jeu de Copie" game

const initJeuDeCopie = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("jeuDeCopie.js: initJeuDeCopie called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "jeuDeCopie";
    const wordsToCopy = gameData;

    let currentWordIndex = 0;
    let score = 0;

    function renderWord() {
        if (currentWordIndex < wordsToCopy.length) {
            const wordObj = wordsToCopy[currentWordIndex];
            gameContent.innerHTML = `
                <div class="jeu-de-copie-game">
                    <p class="game-instructions">Observe le mot, puis écris-le de mémoire !</p>
                    <div class="word-display">${wordObj.word}</div>
                    <input type="text" class="copy-input" placeholder="Écris le mot ici...">
                    <button class="btn-primary check-copy-btn">Vérifier</button>
                    <div class="feedback-message"></div>
                </div>
            `;

            const wordDisplay = gameContent.querySelector('.word-display');
            const copyInput = gameContent.querySelector('.copy-input');
            const checkBtn = gameContent.querySelector('.check-copy-btn');
            const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

            // Step 1: Display word, then hide it
            setTimeout(() => {
                wordDisplay.style.opacity = '0';
                copyInput.focus();
            }, 2000); // Display for 2 seconds

            checkBtn.addEventListener('click', () => {
                const userAnswer = copyInput.value.trim().toLowerCase();
                const correctAnswer = wordObj.word.toLowerCase();
                const isCorrect = (userAnswer === correctAnswer);

                showFeedback(isCorrect, copyInput);

                if (isCorrect) {
                    score++;
                    addStars(1); // Award 1 star for each correct answer
                    audioManager.playSound('correct');
                    feedbackMessageDiv.textContent = wordObj.feedback;
                    feedbackMessageDiv.style.color = 'var(--correct-color)';
                } else {
                    audioManager.playSound('incorrect');
                    feedbackMessageDiv.textContent = `${wordObj.incorrectFeedback} Le mot était : ${wordObj.word}`;
                    feedbackMessageDiv.style.color = 'var(--incorrect-color)';
                }

                // Disable input and check button after answer
                copyInput.disabled = true;
                checkBtn.disabled = true;

                setTimeout(() => {
                    currentWordIndex++;
                    renderWord();
                }, 2500); // Short delay to show feedback
            });

        } else {
            endGame();
        }
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Ton score : ${score} sur ${wordsToCopy.length}</p>
                <p>Tu es un champion de la copie !</p>
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
    renderWord();
};

// Expose to global scope
window.initJeuDeCopie = initJeuDeCopie;