// puzzleLettres.js - Logic for the "Puzzle de Lettres" game

const initPuzzleLettres = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("puzzleLettres.js: initPuzzleLettres called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "puzzleLettres";
    const questions = gameData;

    let currentQuestionIndex = 0;
    let score = 0;
    let currentSlots = []; // To keep track of letters in slots

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
            const scrambledLetters = shuffleArray(question.scrambled.split(' '));
            const correctWordLength = question.correct.length;

            gameContent.innerHTML = `
                <div class="puzzle-lettres-game">
                    <p class="game-instructions">Remets les lettres dans le bon ordre pour former le mot !</p>
                    <div class="letter-pool"></div>
                    <div class="word-slots"></div>
                    <button class="btn-primary check-puzzle-btn">Vérifier</button>
                    <div class="feedback-message"></div>
                </div>
            `;

            const letterPool = gameContent.querySelector('.letter-pool');
            const wordSlots = gameContent.querySelector('.word-slots');
            const checkBtn = gameContent.querySelector('.check-puzzle-btn');
            const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

            currentSlots = Array(correctWordLength).fill(null); // Initialize slots

            // Create draggable letters
            scrambledLetters.forEach(letter => {
                const letterElement = document.createElement('span');
                letterElement.classList.add('draggable-letter');
                letterElement.textContent = letter;
                letterElement.setAttribute('draggable', true);
                letterElement.dataset.letter = letter;
                letterPool.appendChild(letterElement);
            });

            // Create word slots
            for (let i = 0; i < correctWordLength; i++) {
                const slotElement = document.createElement('span');
                slotElement.classList.add('letter-slot');
                slotElement.dataset.index = i;
                wordSlots.appendChild(slotElement);
            }

            // Drag and Drop functionality
            let draggedElement = null;

            gameContent.querySelectorAll('.draggable-letter').forEach(letter => {
                letter.addEventListener('dragstart', (e) => {
                    draggedElement = e.target;
                    e.dataTransfer.setData('text/plain', e.target.dataset.letter);
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                letter.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    draggedElement = null;
                });
            });

            gameContent.querySelectorAll('.letter-slot').forEach(slot => {
                slot.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Allow drop
                    const dragging = document.querySelector('.dragging');
                    if (dragging && !slot.hasChildNodes()) {
                        slot.classList.add('drag-over');
                    }
                });

                slot.addEventListener('dragleave', () => {
                    slot.classList.remove('drag-over');
                });

                slot.addEventListener('drop', (e) => {
                    e.preventDefault();
                    slot.classList.remove('drag-over');
                    if (draggedElement && !slot.hasChildNodes()) {
                        slot.appendChild(draggedElement);
                        currentSlots[parseInt(slot.dataset.index)] = draggedElement.dataset.letter;
                    }
                });
            });

            checkBtn.addEventListener('click', () => {
                const userAnswer = currentSlots.join('').toUpperCase();
                const correctAnswer = question.correct.toUpperCase();
                const isCorrect = (userAnswer === correctAnswer);

                showFeedback(isCorrect, wordSlots);

                if (isCorrect) {
                    score++;
                    addStars(1); // Award 1 star for each correct answer
                    audioManager.playSound('correct');
                    feedbackMessageDiv.textContent = question.feedback;
                    feedbackMessageDiv.style.color = 'var(--correct-color)';
                } else {
                    audioManager.playSound('incorrect');
                    feedbackMessageDiv.textContent = `${question.incorrectFeedback} Le mot correct était : ${question.correct}`;
                    feedbackMessageDiv.style.color = 'var(--incorrect-color)';
                }

                // Disable further interaction
                gameContent.querySelectorAll('.draggable-letter').forEach(letter => letter.setAttribute('draggable', false));
                checkBtn.disabled = true;

                setTimeout(() => {
                    currentQuestionIndex++;
                    renderQuestion();
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
                <p>Ton score : ${score} sur ${questions.length}</p>
                <p>Tu es un maître des lettres !</p>
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
window.initPuzzleLettres = initPuzzleLettres;