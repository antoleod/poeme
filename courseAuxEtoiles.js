// courseAuxEtoiles.js - Logic for the "Course aux Étoiles" game

const initCourseAuxEtoiles = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("courseAuxEtoiles.js: initCourseAuxEtoiles called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "courseAuxEtoiles";
    const questions = gameData;

    let currentQuestionIndex = 0;
    let score = 0;
    let timer = null;
    const timeLimit = 3; // seconds to read each word

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
                <div class="course-aux-etoiles-game">
                    <p class="game-instructions">Lis le mot rapidement et clique si il contient le son /oi/ !</p>
                    <div class="word-display">${question.word}</div>
                    <div class="timer-bar"></div>
                    <div class="options-container">
                        <button class="btn-option btn-yes">Oui</button>
                        <button class="btn-option btn-no">Non</button>
                    </div>
                    <div class="feedback-message"></div>
                </div>
            `;

            const wordDisplay = gameContent.querySelector('.word-display');
            const timerBar = gameContent.querySelector('.timer-bar');
            const btnYes = gameContent.querySelector('.btn-yes');
            const btnNo = gameContent.querySelector('.btn-no');
            const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

            // Reset timer bar animation
            timerBar.style.width = '100%';
            timerBar.style.backgroundColor = 'var(--primary-color)';

            // Start timer animation
            anime({
                targets: timerBar,
                width: '0%',
                duration: timeLimit * 1000,
                easing: 'linear',
                complete: () => {
                    if (currentQuestionIndex < questions.length) {
                        // If timer runs out, it's an incorrect answer
                        checkAnswer(false, question.hasSound, null, feedbackMessageDiv);
                    }
                }
            });

            btnYes.addEventListener('click', () => checkAnswer(true, question.hasSound, btnYes, feedbackMessageDiv));
            btnNo.addEventListener('click', () => checkAnswer(false, question.hasSound, btnNo, feedbackMessageDiv));

        } else {
            endGame();
        }
    }

    function checkAnswer(userAnswer, correctAnswer, buttonElement, feedbackMessageDiv) {
        // Stop timer animation
        anime.remove(gameContent.querySelector('.timer-bar'));

        const isCorrect = (userAnswer === correctAnswer);
        showFeedback(isCorrect, buttonElement || gameContent.querySelector('.word-display'));

        if (isCorrect) {
            score++;
            addStars(2); // Award 2 stars for each correct answer in time
            audioManager.playSound('correct');
            feedbackMessageDiv.textContent = "Bravo !";
            feedbackMessageDiv.style.color = 'var(--correct-color)';
        } else {
            audioManager.playSound('incorrect');
            feedbackMessageDiv.textContent = `Non, le son /oi/ ${correctAnswer ? 'est' : 'n\'est pas'} présent.`;
            feedbackMessageDiv.style.color = 'var(--incorrect-color)';
        }

        // Disable buttons after answer
        gameContent.querySelectorAll('.btn-option').forEach(btn => btn.disabled = true);

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 1500); // Short delay to show feedback
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Ton score : ${score} sur ${questions.length}</p>
                <p>Tu es rapide comme l'éclair !</p>
                <button class="btn-primary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;
        addCoins(30); // Award coins for completing the game
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
window.initCourseAuxEtoiles = initCourseAuxEtoiles;
