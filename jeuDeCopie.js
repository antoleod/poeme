// jeuDeCopie.js - Logic for the "Jeu de Copie → Mémoire" mini-game

const initJeuDeCopie = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("jeuDeCopie.js: initJeuDeCopie called.");
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    const questions = gameData.jeuDeCopie; // Get specific game data

    let currentWord = '';
    let step = 1; // 1: copy, 2: memory

    function renderQuestion() {
        if (currentQuestionIndex < questions.length) {
            currentWord = questions[currentQuestionIndex].word;
            step = 1; // Reset to copy step
            gameContainer.innerHTML = `
                <div class="jeu-de-copie-question">
                    <p class="instruction">Étape 1: Copie le mot ci-dessous.</p>
                    <p id="word-to-copy" class="word-display">${currentWord}</p>
                    <input type="text" id="copy-input" placeholder="Copie le mot ici..." autocomplete="off">
                    <button id="next-step-btn" class="btn-primary">Suivant</button>
                </div>
            `;

            const copyInput = gameContainer.querySelector('#copy-input');
            const nextStepBtn = gameContainer.querySelector('#next-step-btn');

            nextStepBtn.addEventListener('click', () => {
                if (step === 1) {
                    // Check copy
                    if (copyInput.value.trim().toLowerCase() === currentWord.toLowerCase()) {
                        showFeedback(true, copyInput);
                        step = 2;
                        renderMemoryStep();
                    } else {
                        showFeedback(false, copyInput);
                        // Allow retry or show correct answer
                        copyInput.style.borderColor = '#F44336';
                    }
                }
            });

            copyInput.addEventListener('keypress', (event) => {
                if (event.key === 'Enter') {
                    nextStepBtn.click();
                }
            });

            copyInput.focus();

        } else {
            gameContainer.innerHTML = `
                <h3>Félicitations ! Tu as terminé le Jeu de Copie !</h3>
                <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>
                <p>Tu as gagné 🪙 20 pièces !</p>
            `;
            addCoins(20);
            setGameCompleted('jeuDeCopie');
        }
    }

    function renderMemoryStep() {
        gameContainer.innerHTML = `
            <div class="jeu-de-copie-question">
                <p class="instruction">Étape 2: Écris le mot de mémoire.</p>
                <p id="word-to-copy" class="word-display hidden"></p> <!-- Word is hidden -->
                <input type="text" id="memory-input" placeholder="Écris le mot de mémoire ici..." autocomplete="off">
                <button id="check-memory-btn" class="btn-primary">Vérifier</button>
            </div>
        `;

        const memoryInput = gameContainer.querySelector('#memory-input');
        const checkMemoryBtn = gameContainer.querySelector('#check-memory-btn');

        checkMemoryBtn.addEventListener('click', () => {
            const userAnswer = memoryInput.value.trim();
            checkAnswer(userAnswer, currentWord, memoryInput);
        });

        memoryInput.addEventListener('keypress', (event) => {
            if (event.key === 'Enter') {
                checkMemoryBtn.click();
            }
        });

        memoryInput.focus();
    }

    function checkAnswer(userAnswer, correctAnswer, targetElement) {
        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        showFeedback(isCorrect, targetElement);

        if (isCorrect) {
            addStars(1);
            correctAnswersCount++;
        }

        targetElement.style.borderColor = isCorrect ? '#4CAF50' : '#F44336';
        targetElement.style.borderWidth = '3px';

        // Disable input and button
        targetElement.disabled = true;
        gameContainer.querySelector('.btn-primary').disabled = true;

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 2000);
    }

    // Initial render
    renderQuestion();
};

// Expose to global scope
window.initJeuDeCopie = initJeuDeCopie;
