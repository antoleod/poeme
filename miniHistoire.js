// miniHistoire.js - Logic for the "Mini-histoire à compléter" game

const initMiniHistoire = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("miniHistoire.js: initMiniHistoire called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "miniHistoire";
    const stories = gameData;

    let currentStoryIndex = 0;
    let score = 0;
    let filledBlanks = [];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderStory() {
        if (currentStoryIndex < stories.length) {
            const story = stories[currentStoryIndex];
            const blankPlaceholder = "...";
            const storyParts = story.story.split(blankPlaceholder);

            gameContent.innerHTML = `
                <div class="mini-histoire-game">
                    <p class="game-instructions">Complète l'histoire en glissant les mots dans les trous !</p>
                    <div class="story-display"></div>
                    <div class="word-options"></div>
                    <button class="btn-primary check-story-btn">Vérifier l'histoire</button>
                    <div class="feedback-message"></div>
                </div>
            `;

            const storyDisplay = gameContent.querySelector('.story-display');
            const wordOptionsContainer = gameContent.querySelector('.word-options');
            const checkBtn = gameContent.querySelector('.check-story-btn');
            const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

            filledBlanks = Array(story.blanks.length).fill(null); // Initialize filled blanks

            // Render story with drop zones
            storyParts.forEach((part, index) => {
                const span = document.createElement('span');
                span.textContent = part;
                storyDisplay.appendChild(span);

                if (index < story.blanks.length) {
                    const dropZone = document.createElement('span');
                    dropZone.classList.add('drop-zone');
                    dropZone.dataset.blankIndex = index;
                    storyDisplay.appendChild(dropZone);
                }
            });

            // Render draggable word options
            const shuffledOptions = shuffleArray([...story.options]);
            shuffledOptions.forEach(option => {
                const wordElement = document.createElement('span');
                wordElement.classList.add('draggable-word');
                wordElement.textContent = option;
                wordElement.setAttribute('draggable', true);
                wordElement.dataset.word = option;
                wordOptionsContainer.appendChild(wordElement);
            });

            // Drag and Drop functionality
            let draggedElement = null;

            gameContent.querySelectorAll('.draggable-word').forEach(word => {
                word.addEventListener('dragstart', (e) => {
                    draggedElement = e.target;
                    e.dataTransfer.setData('text/plain', e.target.dataset.word);
                    setTimeout(() => e.target.classList.add('dragging'), 0);
                });
                word.addEventListener('dragend', (e) => {
                    e.target.classList.remove('dragging');
                    draggedElement = null;
                });
            });

            gameContent.querySelectorAll('.drop-zone').forEach(dropZone => {
                dropZone.addEventListener('dragover', (e) => {
                    e.preventDefault(); // Allow drop
                    if (!dropZone.hasChildNodes()) {
                        dropZone.classList.add('drag-over');
                    }
                });

                dropZone.addEventListener('dragleave', () => {
                    dropZone.classList.remove('drag-over');
                });

                dropZone.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropZone.classList.remove('drag-over');
                    if (draggedElement && !dropZone.hasChildNodes()) {
                        dropZone.appendChild(draggedElement);
                        filledBlanks[parseInt(dropZone.dataset.blankIndex)] = draggedElement.dataset.word;
                    }
                });
            });

            checkBtn.addEventListener('click', () => {
                const isCorrect = filledBlanks.every((blank, index) => blank === story.blanks[index]);

                showFeedback(isCorrect, storyDisplay);

                if (isCorrect) {
                    score++;
                    addStars(3); // Award stars for correct story
                    audioManager.playSound('correct');
                    feedbackMessageDiv.textContent = story.feedback;
                    feedbackMessageDiv.style.color = 'var(--correct-color)';
                } else {
                    audioManager.playSound('incorrect');
                    feedbackMessageDiv.textContent = story.incorrectFeedback;
                    feedbackMessageDiv.style.color = 'var(--incorrect-color)';
                }

                // Disable further interaction
                gameContent.querySelectorAll('.draggable-word').forEach(word => word.setAttribute('draggable', false));
                checkBtn.disabled = true;

                setTimeout(() => {
                    currentStoryIndex++;
                    renderStory();
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
                <p>Ton score : ${score} sur ${stories.length}</p>
                <p>Tu es un excellent conteur !</p>
                <button class="btn-primary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;
        addCoins(40); // Award coins for completing the game
        setGameCompleted(gameId); // Mark this specific game as completed

        // Re-attach event listener for the back button if it's dynamically created
        gameContent.querySelector('.back-to-mini-games-menu').addEventListener('click', () => {
            document.getElementById('mini-games-menu-screen').classList.add('active');
            gameContainer.classList.remove('active');
        });
    }

    // Initial render
    renderStory();
};

// Expose to global scope
window.initMiniHistoire = initMiniHistoire;
