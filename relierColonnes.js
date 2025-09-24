// relierColonnes.js - Logic for the "Relier les Colonnes" mini-game

const initRelierColonnes = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("relierColonnes.js: initRelierColonnes called.");
    let currentLevel = 0;
    let correctMatches = 0;
    const levels = gameData.relierColonnes; // Get specific game data

    let selectedItem = null;
    let lines = [];
    let svgCanvas;

    function renderLevel() {
        if (currentLevel < levels.length) {
            const level = levels[currentLevel];
            correctMatches = 0;
            lines = [];

            // Shuffle the right column to ensure it's not in order
            const shuffledCursiveWords = [...level.cursiveWords].sort(() => Math.random() - 0.5);

            gameContainer.innerHTML = `
                <div class="relier-colonnes-game">
                    <p class="instruction">Relie le mot en script avec le mot en cursive !</p>
                    <div class="columns-container">
                        <div id="script-column" class="column script-column"></div>
                        <div id="cursive-column" class="column cursive-column"></div>
                        <svg id="lines-svg"></svg>
                    </div>
                    <button id="check-matches-btn" class="btn-primary">Vérifier les paires</button>
                </div>
            `;

            const scriptColumn = gameContainer.querySelector('#script-column');
            const cursiveColumn = gameContainer.querySelector('#cursive-column');
            svgCanvas = gameContainer.querySelector('#lines-svg');
            const checkMatchesBtn = gameContainer.querySelector('#check-matches-btn');

            level.scriptWords.forEach((word, index) => {
                const div = document.createElement('div');
                div.classList.add('word-item', 'script');
                div.textContent = word;
                div.dataset.word = word;
                div.dataset.index = index;
                div.addEventListener('click', selectItem);
                scriptColumn.appendChild(div);
            });

            shuffledCursiveWords.forEach((word, index) => {
                const div = document.createElement('div');
                div.classList.add('word-item', 'cursive');
                div.textContent = word;
                div.dataset.word = word;
                div.dataset.index = level.cursiveWords.indexOf(word); // Store original index for matching
                div.addEventListener('click', selectItem);
                cursiveColumn.appendChild(div);
            });

            checkMatchesBtn.addEventListener('click', checkMatches);

        } else {
            gameContainer.innerHTML = `
                <h3>Félicitations ! Tu as terminé tous les jeux de Relier les Colonnes !</h3>
                <p>Tu as gagné 🪙 30 pièces !</p>
            `;
            addCoins(30);
            setGameCompleted('relierColonnes');
        }
    }

    function selectItem(event) {
        const clickedItem = event.target;

        if (clickedItem.classList.contains('matched')) return; // Cannot re-select matched items

        if (selectedItem === null) {
            // First item selected
            selectedItem = clickedItem;
            selectedItem.classList.add('selected');
        } else if (selectedItem === clickedItem) {
            // Deselect if clicked again
            selectedItem.classList.remove('selected');
            selectedItem = null;
        } else {
            // Second item selected, attempt to match
            if (selectedItem.classList.contains('script') && clickedItem.classList.contains('cursive')) {
                attemptMatch(selectedItem, clickedItem);
            } else if (selectedItem.classList.contains('cursive') && clickedItem.classList.contains('script')) {
                attemptMatch(clickedItem, selectedItem); // Ensure script is always first arg
            } else {
                // Both are same type, deselect first and select new one
                selectedItem.classList.remove('selected');
                selectedItem = clickedItem;
                selectedItem.classList.add('selected');
            }
        }
    }

    function attemptMatch(scriptItem, cursiveItem) {
        if (scriptItem.dataset.word.toLowerCase() === cursiveItem.dataset.word.toLowerCase()) {
            // Match found
            scriptItem.classList.add('matched');
            cursiveItem.classList.add('matched');
            scriptItem.classList.remove('selected');
            cursiveItem.classList.remove('selected');

            drawLine(scriptItem, cursiveItem, '#4CAF50'); // Green line for correct
            showFeedback(true, scriptItem);
            addStars(1);
            correctMatches++;
        } else {
            // Mismatch
            drawLine(scriptItem, cursiveItem, '#F44336'); // Red line for incorrect
            showFeedback(false, scriptItem);
            setTimeout(() => {
                // Remove incorrect line and deselect
                lines.pop().remove();
                scriptItem.classList.remove('selected');
                cursiveItem.classList.remove('selected');
            }, 1000);
        }
        selectedItem = null;
    }

    function drawLine(item1, item2, color) {
        const rect1 = item1.getBoundingClientRect();
        const rect2 = item2.getBoundingClientRect();
        const svgRect = svgCanvas.getBoundingClientRect();

        const x1 = rect1.right - svgRect.left;
        const y1 = rect1.top + rect1.height / 2 - svgRect.top;
        const x2 = rect2.left - svgRect.left;
        const y2 = rect2.top + rect2.height / 2 - svgRect.top;

        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', 3);
        svgCanvas.appendChild(line);
        lines.push(line);
    }

    function checkMatches() {
        const level = levels[currentLevel];
        if (correctMatches === level.scriptWords.length) {
            setTimeout(() => {
                currentLevel++;
                renderLevel();
            }, 1500);
        } else {
            alert("Il reste des paires à trouver !");
        }
    }

    // Initial render
    renderLevel();
};

// Expose to global scope
window.initRelierColonnes = initRelierColonnes;
