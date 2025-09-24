// memory.js - Logic for the "Mémory" game

const initMemory = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("memory.js: initMemory called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "memory";
    const cardPairs = gameData[gameId];

    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let lockBoard = false; // To prevent clicking more than two cards

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function createBoard() {
        gameContent.innerHTML = `
            <div class="memory-game">
                <p class="game-instructions">Trouve les paires d'images et de mots !</p>
                <div class="memory-board"></div>
                <p>Tentatives : <span id="attempts-count">0</span></p>
            </div>
        `;
        const memoryBoard = gameContent.querySelector('.memory-board');
        const attemptsCountSpan = gameContent.querySelector('#attempts-count');

        // Duplicate cards to create pairs and add a type (image or word)
        const cards = [];
        cardPairs.forEach(pair => {
            cards.push({ id: pair.id, type: pair.type, content: pair.content, isFlipped: false, isMatched: false });
        });

        const shuffledCards = shuffle(cards);

        shuffledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.id = card.id;
            cardElement.dataset.type = card.type;
            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${card.content}</div>
                </div>
            `;
            cardElement.addEventListener('click', () => flipCard(cardElement, card));
            memoryBoard.appendChild(cardElement);
        });

        attemptsCountSpan.textContent = attempts;
    }

    function flipCard(cardElement, cardObject) {
        if (lockBoard || cardObject.isFlipped || cardObject.isMatched) return;

        cardObject.isFlipped = true;
        cardElement.classList.add('flipped');
        flippedCards.push({ element: cardElement, object: cardObject });

        if (flippedCards.length === 2) {
            attempts++;
            gameContent.querySelector('#attempts-count').textContent = attempts;
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = (card1.object.id === card2.object.id && card1.object.type !== card2.object.type);

        if (isMatch) {
            disableCards();
            showFeedback(true, card1.element); // Show feedback on one of the matched cards
            addStars(2); // Award 2 stars for a match
            audioManager.playSound('correct');
            matchedPairs++;
            if (matchedPairs === cardPairs.length / 2) { // Assuming cardPairs has image and word for each id
                setTimeout(endGame, 1000);
            }
        } else {
            unflipCards();
            showFeedback(false, card1.element); // Show feedback on one of the unmatched cards
            audioManager.playSound('incorrect');
        }
    }

    function disableCards() {
        flippedCards[0].object.isMatched = true;
        flippedCards[1].object.isMatched = true;
        resetBoard();
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].object.isFlipped = false;
            flippedCards[1].object.isFlipped = false;
            flippedCards[0].element.classList.remove('flipped');
            flippedCards[1].element.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        flippedCards = [];
        lockBoard = false;
    }

    function endGame() {
        gameContent.innerHTML = `
            <div class="game-completion">
                <h3>Jeu terminé !</h3>
                <p>Tu as trouvé toutes les paires en ${attempts} tentatives !</p>
                <p>Excellent travail de mémorisation !</p>
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
    createBoard();
};

// Expose to global scope
window.initMemory = initMemory;