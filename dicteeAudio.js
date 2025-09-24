// dicteeAudio.js - Logic for the "Dictée Audio" mini-game

const initDicteeAudio = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("dicteeAudio.js: initDicteeAudio called.");
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    const questions = gameData.dicteeAudio; // Get specific game data

    function renderQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            gameContainer.innerHTML = `
                <div class="dictee-audio-question">
                    <p>Écoute le mot ou la phrase et écris-le(la) :</p>
                    <button id="play-audio-btn" class="btn-primary">▶️ Écouter</button>
                    <input type="text" id="dictee-input" placeholder="Écris ici..." autocomplete="off">
                    <button id="check-dictee-btn" class="btn-primary">Vérifier</button>
                </div>
            `;

            const playAudioBtn = gameContainer.querySelector('#play-audio-btn');
            const dicteeInput = gameContainer.querySelector('#dictee-input');
            const checkDicteeBtn = gameContainer.querySelector('#check-dictee-btn');

            playAudioBtn.addEventListener('click', () => {
                audioManager.speakText(question.text);
            });

            checkDicteeBtn.addEventListener('click', () => {
                const userAnswer = dicteeInput.value.trim();
                checkAnswer(userAnswer, question.text, dicteeInput);
            });

            dicteeInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    checkDicteeBtn.click();
                }
            });

            dicteeInput.focus(); // Focus on the input field

        } else {
            gameContainer.innerHTML = `
                <h3>Félicitations ! Tu as terminé le jeu !</h3>
                <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>
                <p>Tu as gagné 🪙 20 pièces !</p>
            `;
            addCoins(20);
            setGameCompleted('dicteeAudio'); // Mark this specific game as completed
        }
    }

    function checkAnswer(userAnswer, correctAnswer, targetElement) {
        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        showFeedback(isCorrect, targetElement);

        if (isCorrect) {
            addStars(1);
            correctAnswersCount++;
        }

        // Provide visual feedback on the input
        targetElement.style.borderColor = isCorrect ? '#4CAF50' : '#F44336';
        targetElement.style.borderWidth = '3px';

        // Disable buttons and input
        gameContainer.querySelector('#play-audio-btn').disabled = true;
        gameContainer.querySelector('#dictee-input').disabled = true;
        gameContainer.querySelector('#check-dictee-btn').disabled = true;

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 2000);
    }

    // Initial render
    renderQuestion();
};

// Expose to global scope
window.initDicteeAudio = initDicteeAudio;
