// motsCaches.js - Logic for the "Mots Cachés" (Wordsearch) game

const initMotsCaches = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("motsCaches.js: initMotsCaches called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "motsCaches";
    const { grid, words } = gameData;

    let foundWords = [];
    let selectedLetters = [];
    let isDragging = false;

    function renderGame() {
        gameContent.innerHTML = `
            <div class="mots-caches-game">
                <p class="game-instructions">Trouve tous les mots cachés dans la grille !</p>
                <div class="wordsearch-grid"></div>
                <div class="words-to-find">
                    <h3>Mots à trouver :</h3>
                    <ul id="word-list"></ul>
                </div>
            </div>
        `;

        const wordsearchGrid = gameContent.querySelector('.wordsearch-grid');
        const wordList = gameContent.querySelector('#word-list');

        // Render grid
        grid.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.classList.add('grid-row');
            row.forEach((letter, colIndex) => {
                const letterElement = document.createElement('span');
                letterElement.classList.add('grid-letter');
                letterElement.textContent = letter;
                letterElement.dataset.row = rowIndex;
                letterElement.dataset.col = colIndex;
                rowElement.appendChild(letterElement);
            });
            wordsearchGrid.appendChild(rowElement);
        });

        // Render words to find
        words.forEach(word => {
            const listItem = document.createElement('li');
            listItem.textContent = word;
            listItem.dataset.word = word.toLowerCase();
            wordList.appendChild(listItem);
        });

        // Add event listeners for selection
        wordsearchGrid.addEventListener('mousedown', startSelection);
        wordsearchGrid.addEventListener('mouseup', endSelection);
        wordsearchGrid.addEventListener('mouseover', duringSelection);

        // Handle touch events for mobile
        wordsearchGrid.addEventListener('touchstart', (e) => {
            e.preventDefault(); // Prevent scrolling
            startSelection(e.touches[0]);
        });
        wordsearchGrid.addEventListener('touchend', endSelection);
        wordsearchGrid.addEventListener('touchmove', (e) => {
            e.preventDefault(); // Prevent scrolling
            duringSelection(e.touches[0]);
        });
    }

    function startSelection(e) {
        isDragging = true;
        selectedLetters = [];
        clearSelection();
        addLetterToSelection(e);
    }

    function duringSelection(e) {
        if (!isDragging) return;
        addLetterToSelection(e);
    }

    function endSelection() {
        isDragging = false;
        checkSelectedWord();
    }

    function addLetterToSelection(e) {
        const target = document.elementFromPoint(e.clientX, e.clientY);
        if (target && target.classList.contains('grid-letter')) {
            const row = parseInt(target.dataset.row);
            const col = parseInt(target.dataset.col);
            const letterObj = { element: target, letter: target.textContent, row, col };

            // Only add if not already in selection and is adjacent to the last selected letter
            if (selectedLetters.length === 0 || !selectedLetters.some(l => l.element === target)) {
                if (selectedLetters.length > 0) {
                    const lastLetter = selectedLetters[selectedLetters.length - 1];
                    const isAdjacent = (Math.abs(lastLetter.row - row) <= 1 && Math.abs(lastLetter.col - col) <= 1);
                    if (!isAdjacent) return; // Must be adjacent
                }
                selectedLetters.push(letterObj);
                target.classList.add('selected');
            }
        }
    }

    function clearSelection() {
        gameContent.querySelectorAll('.grid-letter.selected').forEach(el => {
            el.classList.remove('selected');
        });
        selectedLetters = [];
    }

    function checkSelectedWord() {
        if (selectedLetters.length === 0) return;

        const formedWord = selectedLetters.map(l => l.letter).join('').toLowerCase();
        const reversedWord = selectedLetters.map(l => l.letter).reverse().join('').toLowerCase();

        let found = false;
        let correctWord = "";

        for (const word of words) {
            if (word.toLowerCase() === formedWord || word.toLowerCase() === reversedWord) {
                if (!foundWords.includes(word.toLowerCase())) {
                    found = true;
                    correctWord = word;
                    break;
                }
            }
        }

        if (found) {
            foundWords.push(correctWord.toLowerCase());
            selectedLetters.forEach(l => l.element.classList.add('found'));
            const listItem = gameContent.querySelector(`li[data-word="${correctWord.toLowerCase()}"]`);
            if (listItem) listItem.classList.add('found');

            showFeedback(true, selectedLetters[0].element); // Feedback on first letter
            addStars(5); // Award stars for finding a word
            audioManager.playSound('correct');

            if (foundWords.length === words.length) {
                setTimeout(endGame, 1500);
            }
        } else {
            showFeedback(false, selectedLetters[0].element); // Feedback on first letter
            audioManager.playSound('incorrect');
            clearSelection(); // Clear selection if incorrect
        }
        selectedLetters = []; // Clear selection after checking
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Tu as trouvé tous les mots cachés !</p>
                <p>Félicitations, détective des mots !</p>
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

    // Initial setup
    renderGame();
};

// Expose to global scope
window.initMotsCaches = initMotsCaches;