// relierColonnes.js - Logic for the "Relier les Colonnes" game

const initRelierColonnes = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("relierColonnes.js: initRelierColonnes called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "relierColonnes";
    const pairs = gameData;

    let selectedElements = [];
    let matchedPairsCount = 0;

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function renderGame() {
        gameContent.innerHTML = `
            <div class="relier-colonnes-game">
                <p class="game-instructions">Relie le mot en script avec le mot en cursive !</p>
                <div class="columns-container">
                    <div class="column script-column"></div>
                    <div class="column cursive-column"></div>
                </div>
            </div>
        `;

        const scriptColumn = gameContent.querySelector('.script-column');
        const cursiveColumn = gameContent.querySelector('.cursive-column');

        const scriptWords = shuffle(pairs.map(p => ({ type: 'script', value: p.script, match: p.cursive })));
        const cursiveWords = shuffle(pairs.map(p => ({ type: 'cursive', value: p.cursive, match: p.script })));

        scriptWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('column-item', 'script-item');
            wordElement.textContent = word.value;
            wordElement.dataset.type = word.type;
            wordElement.dataset.match = word.match;
            wordElement.addEventListener('click', () => selectItem(wordElement));
            scriptColumn.appendChild(wordElement);
        });

        cursiveWords.forEach(word => {
            const wordElement = document.createElement('div');
            wordElement.classList.add('column-item', 'cursive-item');
            wordElement.textContent = word.value;
            wordElement.dataset.type = word.type;
            wordElement.dataset.match = word.match;
            wordElement.addEventListener('click', () => selectItem(wordElement));
            cursiveColumn.appendChild(wordElement);
        });
    }

    function selectItem(element) {
        if (element.classList.contains('matched')) return; // Already matched

        element.classList.toggle('selected');

        if (element.classList.contains('selected')) {
            selectedElements.push(element);
        } else {
            selectedElements = selectedElements.filter(el => el !== element);
        }

        if (selectedElements.length === 2) {
            checkMatch();
        } else if (selectedElements.length > 2) {
            // If more than two are selected, deselect the oldest one
            selectedElements[0].classList.remove('selected');
            selectedElements.shift();
        }
    }

    function checkMatch() {
        const [el1, el2] = selectedElements;

        // Ensure one is script and one is cursive
        const isCorrectTypePair = (el1.dataset.type !== el2.dataset.type);

        // Check if they are matching pairs
        const isMatch = (el1.dataset.match === el2.textContent && el2.dataset.match === el1.textContent);

        if (isCorrectTypePair && isMatch) {
            el1.classList.add('matched');
            el2.classList.add('matched');
            showFeedback(true, el1); // Show feedback on one of the matched elements
            addStars(3); // Award stars for a match
            audioManager.playSound('correct');
            matchedPairsCount++;

            if (matchedPairsCount === pairs.length) {
                setTimeout(endGame, 1000);
            }
        } else {
            showFeedback(false, el1); // Show feedback on one of the unmatched elements
            audioManager.playSound('incorrect');
        }

        // Clear selection after checking
        setTimeout(() => {
            selectedElements.forEach(el => el.classList.remove('selected'));
            selectedElements = [];
        }, 500);
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Tu as relié toutes les colonnes !</p>
                <p>Félicitations pour ta maîtrise des écritures !</p>
                <button class="btn-primary back-to-mini-games-menu">Retour aux Mini-Jeux</button>
            </div>
        `;
        addCoins(30); // Award coins for completing the game
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
window.initRelierColonnes = initRelierColonnes;