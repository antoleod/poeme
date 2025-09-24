// associeImageMot.js - Logic for the "Associe Image ↔ Mot" mini-game

const initAssocieImageMot = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("associeImageMot.js: initAssocieImageMot called.");
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    const questions = gameData.associeImageMot; // Get specific game data

    function renderQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            gameContainer.innerHTML = `
                <div class="associe-image-mot-question">
                    <span class="question-image" style="font-size: 8em;">${question.image}</span>
                    <div class="options-container">
                        ${question.options.map(option => `<button class="option-btn btn-primary" data-answer="${option}">${option}</button>`).join('')}
                    </div>
                </div>
            `;

            // Add event listeners to option buttons
            gameContainer.querySelectorAll('.option-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const selectedAnswer = event.target.dataset.answer;
                    checkAnswer(selectedAnswer, question.answer, event.target);
                });
            });
        } else {
            gameContainer.innerHTML = `
                <h3>Félicitations ! Tu as terminé le jeu !</h3>
                <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>
                <p>Tu as gagné 🪙 20 pièces !</p>
            `;
            addCoins(20);
            setGameCompleted('associeImageMot'); // Mark this specific game as completed
        }
    }

    function checkAnswer(selected, correct, targetButton) {
        const isCorrect = (selected === correct);
        showFeedback(isCorrect, targetButton);

        if (isCorrect) {
            addStars(1);
            correctAnswersCount++;
        }

        // Disable buttons after answer
        gameContainer.querySelectorAll('.option-btn').forEach(button => {
            button.disabled = true;
            if (button.dataset.answer === correct) {
                button.style.backgroundColor = '#4CAF50'; // Green for correct
            } else if (button.dataset.answer === selected) {
                button.style.backgroundColor = '#F44336'; // Red for incorrect
            }
        });

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 1500);
    }

    // Initial render
    renderQuestion();
};

// Expose to global scope
window.initAssocieImageMot = initAssocieImageMot;
