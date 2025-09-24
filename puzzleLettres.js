// puzzleLettres.js - Logic for the "Puzzle de Lettres" mini-game

const initPuzzleLettres = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("puzzleLettres.js: initPuzzleLettres called.");
    let currentQuestionIndex = 0;
    let correctAnswersCount = 0;
    const questions = gameData.puzzleLettres; // Get specific game data

    let draggableLetters = [];
    let dropTarget = null;

    function renderQuestion() {
        if (currentQuestionIndex < questions.length) {
            const question = questions[currentQuestionIndex];
            const scrambledLetters = shuffleArray(question.word.split(''));

            gameContainer.innerHTML = `
                <div class="puzzle-lettres-question">
                    <p class="instruction">Remets les lettres dans le bon ordre pour former le mot !</p>
                    <div id="drop-zone" class="drop-zone"></div>
                    <div id="letters-container" class="letters-container"></div>
                    <button id="check-word-btn" class="btn-primary">Vérifier le mot</button>
                </div>
            `;

            dropTarget = gameContainer.querySelector('#drop-zone');
            const lettersContainer = gameContainer.querySelector('#letters-container');
            const checkWordBtn = gameContainer.querySelector('#check-word-btn');

            // Create draggable letters
            draggableLetters = [];
            scrambledLetters.forEach((letter, index) => {
                const letterDiv = document.createElement('div');
                letterDiv.classList.add('draggable-letter');
                letterDiv.textContent = letter.toUpperCase();
                letterDiv.setAttribute('draggable', true);
                letterDiv.dataset.letter = letter.toUpperCase();
                letterDiv.id = `letter-${index}`;
                lettersContainer.appendChild(letterDiv);
                draggableLetters.push(letterDiv);
            });

            // Drag and Drop functionality
            let draggedItem = null;

            draggableLetters.forEach(item => {
                item.addEventListener('dragstart', (e) => {
                    draggedItem = e.target;
                    setTimeout(() => {
                        e.target.classList.add('hide');
                    }, 0);
                });

                item.addEventListener('dragend', (e) => {
                    e.target.classList.remove('hide');
                    draggedItem = null;
                });
            });

            dropTarget.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            dropTarget.addEventListener('dragenter', (e) => {
                e.preventDefault();
                dropTarget.classList.add('drag-over');
            });

            dropTarget.addEventListener('dragleave', () => {
                dropTarget.classList.remove('drag-over');
            });

            dropTarget.addEventListener('drop', (e) => {
                e.preventDefault();
                dropTarget.classList.remove('drag-over');
                if (draggedItem) {
                    dropTarget.appendChild(draggedItem);
                }
            });

            checkWordBtn.addEventListener('click', () => {
                const formedWord = Array.from(dropTarget.children).map(el => el.dataset.letter).join('');
                checkAnswer(formedWord, question.word, dropTarget);
            });

        } else {
            gameContainer.innerHTML = `
                <h3>Félicitations ! Tu as terminé tous les Puzzles de Lettres !</h3>
                <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>
                <p>Tu as gagné 🪙 20 pièces !</p>
            `;
            addCoins(20);
            setGameCompleted('puzzleLettres');
        }
    }

    function checkAnswer(userAnswer, correctAnswer, targetElement) {
        const isCorrect = (userAnswer.toLowerCase() === correctAnswer.toLowerCase());
        showFeedback(isCorrect, targetElement);

        if (isCorrect) {
            addStars(1);
            correctAnswersCount++;
            // Visually confirm the correct word
            Array.from(dropTarget.children).forEach(letterDiv => {
                letterDiv.style.backgroundColor = '#D4EDDA'; // Light green
            });
        } else {
            // Optionally show the correct word or allow retry
            targetElement.style.border = '2px solid #F44336';
        }

        // Disable further interaction
        draggableLetters.forEach(item => item.setAttribute('draggable', false));
        gameContainer.querySelector('#check-word-btn').disabled = true;

        setTimeout(() => {
            currentQuestionIndex++;
            renderQuestion();
        }, 2000);
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Initial render
    renderQuestion();
};

// Expose to global scope
window.initPuzzleLettres = initPuzzleLettres;
