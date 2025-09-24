// phraseATrous.js - Logic for the "Phrase à Trous" mini-game

const initPhraseATrous = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("phraseATrous.js: initPhraseATrous called.");
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    const questions = gameData.phraseATrous; // Get specific game data

    function renderQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            const sentenceParts = question.sentence.split('...');

            gameContainer.innerHTML = `
                <div class="phrase-a-trous-question">
                    <p class="sentence-display">${sentenceParts[0]} <span class="blank-space">_______</span> ${sentenceParts[1]}</p>
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
            setGameCompleted('phraseATrous'); // Mark this specific game as completed
        }
    }

    function checkAnswer(selected, correct, targetButton) {
        const isCorrect = (selected.toLowerCase() === correct.toLowerCase());
        showFeedback(isCorrect, targetButton);

        if (isCorrect) {
            addStars(1);
            correctAnswersCount++;
            // Update the blank space with the correct word
            const blankSpace = gameContainer.querySelector('.blank-space');
            if (blankSpace) {
                blankSpace.textContent = correct;
                blankSpace.style.color = 'var(--primary-color)';
                blankSpace.style.fontWeight = 'bold';
            }
        }

        // Disable buttons after answer
        gameContainer.querySelectorAll('.option-btn').forEach(button => {
            button.disabled = true;
            if (button.dataset.answer.toLowerCase() === correct.toLowerCase()) {
                button.style.backgroundColor = '#4CAF50'; // Green for correct
            } else if (button.dataset.answer.toLowerCase() === selected.toLowerCase()) {
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
window.initPhraseATrous = initPhraseATrous;
