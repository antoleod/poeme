// dicteeVocale.js - Logic for the "Dictée Vocale Personnalisée" game

const initDicteeVocale = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("dicteeVocale.js: initDicteeVocale called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "dicteeVocale";
    const { instructions, example, correctAnswer } = gameData;

    let isRecording = false;

    function renderGame() {
        gameContent.innerHTML = `
            <div class="dictee-vocale-game">
                <p class="game-instructions">${instructions}</p>
                <div class="recording-controls">
                    <button class="btn-primary record-btn">🎙️ Enregistrer</button>
                    <button class="btn-secondary stop-record-btn" style="display:none;">⏹️ Arrêter</button>
                    <button class="btn-secondary play-record-btn" style="display:none;">▶️ Écouter l'enregistrement</button>
                </div>
                <div class="player-section">
                    <p>Écris ce que tu as entendu :</p>
                    <input type="text" class="dictation-input" placeholder="Tape ici...">
                    <button class="btn-primary check-dictation-btn">Vérifier</button>
                    <div class="feedback-message"></div>
                </div>
            </div>
        `;

        const recordBtn = gameContent.querySelector('.record-btn');
        const stopRecordBtn = gameContent.querySelector('.stop-record-btn');
        const playRecordBtn = gameContent.querySelector('.play-record-btn');
        const dictationInput = gameContent.querySelector('.dictation-input');
        const checkDictationBtn = gameContent.querySelector('.check-dictation-btn');
        const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

        recordBtn.addEventListener('click', async () => {
            if (!isRecording) {
                console.log("dicteeVocale.js: Starting recording.");
                const started = await audioManager.startRecording();
                if (started) {
                    isRecording = true;
                    recordBtn.style.display = 'none';
                    stopRecordBtn.style.display = 'inline-block';
                    playRecordBtn.style.display = 'none';
                    feedbackMessageDiv.textContent = "Enregistrement en cours...";
                    feedbackMessageDiv.style.color = 'var(--primary-color)';
                }
            }
        });

        stopRecordBtn.addEventListener('click', () => {
            if (isRecording) {
                console.log("dicteeVocale.js: Stopping recording.");
                audioManager.stopRecording();
                isRecording = false;
                recordBtn.style.display = 'inline-block';
                stopRecordBtn.style.display = 'none';
                playRecordBtn.style.display = 'inline-block';
                feedbackMessageDiv.textContent = "Enregistrement terminé. Écoute-le et écris ce que tu as entendu.";
                feedbackMessageDiv.style.color = 'var(--text-color)';
            }
        });

        playRecordBtn.addEventListener('click', () => {
            console.log("dicteeVocale.js: Playing recorded audio.");
            audioManager.playRecordedAudio();
        });

        checkDictationBtn.addEventListener('click', () => {
            const userAnswer = dictationInput.value.trim().toLowerCase();
            // For now, we compare against the predefined correctAnswer from gameData
            // In a real scenario, this would involve speech-to-text or manual verification by a parent.
            const isCorrect = (userAnswer === correctAnswer.toLowerCase());

            showFeedback(isCorrect, dictationInput);

            if (isCorrect) {
                addStars(2); // Award stars for correct dictation
                addCoins(10); // Award coins
                audioManager.playSound('correct');
                feedbackMessageDiv.textContent = "Bravo ! C'est exactement ça !";
                feedbackMessageDiv.style.color = 'var(--correct-color)';
            } else {
                audioManager.playSound('incorrect');
                feedbackMessageDiv.textContent = `Non, ce n'est pas tout à fait ça. La phrase était : "${correctAnswer}"`;
                feedbackMessageDiv.style.color = 'var(--incorrect-color)';
            }

            // Disable input and check button after answer
            dictationInput.disabled = true;
            checkDictationBtn.disabled = true;

            // Mark game as completed after one attempt for now, or could be after a few questions
            setTimeout(endGame, 3000);
        });
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Tu as pratiqué ta dictée vocale !</p>
                <p>Continue à t'entraîner pour devenir un expert !</p>
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

    // Initial render
    renderGame();
};

// Expose to global scope
window.initDicteeVocale = initDicteeVocale;
