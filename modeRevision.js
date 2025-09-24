// modeRevision.js - Logic for the "Mode Révision / Examen" game

const initModeRevision = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("modeRevision.js: initModeRevision called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "modeRevision";
    const quizWords = gameData.quizWords;

    let currentQuestionIndex = 0;
    let score = 0;
    const numberOfQuestions = 10; // As per user request
    let questionsForThisRound = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function setupQuiz() {
        // Select 10 random words for the quiz
        const shuffledWords = shuffleArray([...quizWords]);
        questionsForThisRound = shuffledWords.slice(0, numberOfQuestions);
        currentQuestionIndex = 0;
        score = 0;
        renderQuestion();
    }

    function renderQuestion() {
        if (currentQuestionIndex < questionsForThisRound.length) {
            const word = questionsForThisRound[currentQuestionIndex];
            gameContent.innerHTML = `
                <div class="mode-revision-game">
                    <p class="game-instructions">Écris le mot que tu vois ! (Question ${currentQuestionIndex + 1} / ${numberOfQuestions})</p>
                    <div class="word-to-type">${word}</div>
                    <input type="text" class="revision-input" placeholder="Tape le mot ici...">
                    <button class="btn-primary check-revision-btn">Vérifier</button>
                    <div class="feedback-message"></div>
                </div>
            `;

            const wordToTypeDiv = gameContent.querySelector('.word-to-type');
            const revisionInput = gameContent.querySelector('.revision-input');
            const checkBtn = gameContent.querySelector('.check-revision-btn');
            const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

            checkBtn.addEventListener('click', () => {
                const userAnswer = revisionInput.value.trim().toLowerCase();
                const correctAnswer = word.toLowerCase();
                const isCorrect = (userAnswer === correctAnswer);

                showFeedback(isCorrect, revisionInput);

                if (isCorrect) {
                    score++;
                    addStars(2); // Award 2 stars for each correct answer
                    audioManager.playSound('correct');
                    feedbackMessageDiv.textContent = "Bravo ! Correct !";
                    feedbackMessageDiv.style.color = 'var(--correct-color)';
                } else {
                    audioManager.playSound('incorrect');
                    feedbackMessageDiv.textContent = `Non, le mot correct était : ${word}`;
                    feedbackMessageDiv.style.color = 'var(--incorrect-color)';
                }

                // Disable input and check button after answer
                revisionInput.disabled = true;
                checkBtn.disabled = true;

                setTimeout(() => {
                    currentQuestionIndex++;
                    renderQuestion();
                }, 2000); // Short delay to show feedback
            });

            revisionInput.focus();
        } else {
            endGame();
        }
    }

    function endGame() {
        let completionMessage = `<h3>Examen terminé !</h3>
                                 <p>Ton score final : ${score} sur ${numberOfQuestions}</p>`;
        if (score === numberOfQuestions) {
            completionMessage += `<p>Félicitations ! Tu as gagné le badge "Maître des Mots" ! 🎓</p>`;
            addCoins(50); // Bonus coins for perfect score
        } else if (score >= numberOfQuestions / 2) {
            completionMessage += `<p>Bien joué ! Continue à t'entraîner !</p>`;
            addCoins(25);
        } else {
            completionMessage += `<p>Tu peux faire mieux ! N'hésite pas à rejouer !</p>`;
            addCoins(10);
        }

        gameContent.innerHTML = `
            <div class="game-completion">
                ${completionMessage}
                <button class="btn-primary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;
        setGameCompleted(gameId); // Mark this specific game as completed

        // Re-attach event listener for the back button if it's dynamically created
        gameContent.querySelector('.back-to-mini-games-menu').addEventListener('click', () => {
            document.getElementById('mini-games-menu-screen').classList.add('active');
            gameContainer.classList.remove('active');
        });
    }

    // Initial setup
    setupQuiz();
};

// Expose to global scope
window.initModeRevision = initModeRevision;
