// motsCaches.js - Logic for the "Mots Cachés" mini-game

const initMotsCaches = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("motsCaches.js: initMotsCaches called.");
    let currentLevel = 0;
    let wordsFound = 0;
    const levels = gameData.motsCaches; // Get specific game data

    let selectedCells = [];
    let foundWords = [];

    function renderLevel() {
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            const gridSize = level.grid.length;
            foundWords = []; // Reset found words for new level
            wordsFound = 0;

            gameContainer.innerHTML = `
                <div class="mots-caches-game">
                    <p class="instruction">Trouve les mots cachés : ${level.wordsToFind.join(', ')}</p>
                    <div id="wordsearch-grid" class="wordsearch-grid"></div>
                    <div id="found-words-display" class="found-words-display"></div>
                </div>
            `;

            const gridElement = gameContainer.querySelector('#wordsearch-grid');
            gridElement.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

            level.grid.forEach((row, rowIndex) => {
                row.forEach((letter, colIndex) => {
                    const cell = document.createElement('div');
                    cell.classList.add('grid-cell');
                    cell.textContent = letter;
                    cell.dataset.row = rowIndex;
                    cell.dataset.col = colIndex;
                    cell.addEventListener('mousedown', startSelection);
                    cell.addEventListener('mouseenter', continueSelection);
                    cell.addEventListener('mouseup', endSelection);
                    gridElement.appendChild(cell);
                });
            });

            renderFoundWordsDisplay();

        } else {
            gameContainer.innerHTML = `
                <h3>Félicitations ! Tu as terminé tous les Mots Cachés !</h3>
                <p>Tu as gagné 🪙 30 pièces !</p>
            `;
            addCoins(30);
            setGameCompleted('motsCaches');
        }
    }

    function renderFoundWordsDisplay() {
        const display = gameContainer.querySelector('#found-words-display');
        display.innerHTML = 'Mots trouvés : ';
        if (foundWords.length > 0) {
            display.innerHTML += foundWords.map(word => `<span class="found-word">${word}</span>`).join(', ');
        } else {
            display.innerHTML += 'Aucun';
        }
    }

    function startSelection(event) {
        if (event.button !== 0) return; // Only left click
        selectedCells = [event.target];
        event.target.classList.add('selected');
        gameContainer.addEventListener('mousemove', continueSelection);
        gameContainer.addEventListener('mouseup', endSelection);
    }

    function continueSelection(event) {
        if (event.buttons === 1 && event.target.classList.contains('grid-cell')) {
            const lastCell = selectedCells[selectedCells.length - 1];
            if (event.target !== lastCell) {
                // Basic logic to add cells in a straight line (horizontal, vertical, diagonal)
                const newCell = event.target;
                const newRow = parseInt(newCell.dataset.row);
                const newCol = parseInt(newCell.dataset.col);
                const lastRow = parseInt(lastCell.dataset.row);
                const lastCol = parseInt(lastCell.dataset.col);

                const dRow = Math.abs(newRow - lastRow);
                const dCol = Math.abs(newCol - lastCol);

                // Only allow straight lines or diagonals
                if (dRow === 0 || dCol === 0 || dRow === dCol) {
                    // Clear previous selection if not contiguous
                    if (selectedCells.length > 1 && !isContiguous(lastCell, newCell)) {
                        selectedCells.forEach(cell => cell.classList.remove('selected'));
                        selectedCells = [lastCell];
                    }
                    selectedCells.push(newCell);
                    newCell.classList.add('selected');
                }
            }
        }
    }

    function isContiguous(cell1, cell2) {
        const r1 = parseInt(cell1.dataset.row);
        const c1 = parseInt(cell1.dataset.col);
        const r2 = parseInt(cell2.dataset.row);
        const c2 = parseInt(cell2.dataset.col);
        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1;
    }

    function endSelection() {
        gameContainer.removeEventListener('mousemove', continueSelection);
        gameContainer.removeEventListener('mouseup', endSelection);

        const selectedWord = selectedCells.map(cell => cell.textContent).join('').toUpperCase();
        const reversedSelectedWord = selectedCells.map(cell => cell.textContent).reverse().join('').toUpperCase();

        const level = levels[currentLevel];
        let found = false;

        // Check if the selected word (or its reverse) is in the list of words to find
        for (let i = 0; i < level.wordsToFind.length; i++) {
            const wordToFind = level.wordsToFind[i].toUpperCase();
            if (selectedWord === wordToFind || reversedSelectedWord === wordToFind) {
                if (!foundWords.includes(wordToFind)) {
                    foundWords.push(wordToFind);
                    selectedCells.forEach(cell => cell.classList.add('found'));
                    showFeedback(true, selectedCells[0]);
                    addStars(1);
                    wordsFound++;
                    renderFoundWordsDisplay();
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            showFeedback(false, selectedCells[0]);
        }

        // Clear selection styles
        selectedCells.forEach(cell => cell.classList.remove('selected'));
        selectedCells = [];

        if (wordsFound === level.wordsToFind.length) {
            setTimeout(() => {
                currentLevel++;
                renderLevel();
            }, 2000);
        }
    }

    // Initial render
    renderLevel();
};

// Expose to global scope
window.initMotsCaches = initMotsCaches;
