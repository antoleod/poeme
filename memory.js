// memory.js - Logic for the "Mémory" mini-game

const initMemory = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("memory.js: initMemory called.");
    let cards = [];
    let flippedCards = [];
    let matchesFound = 0;
    const memoryPairs = gameData.memory; // Get specific game data

    function initializeGame() {
        gameContainer.innerHTML = '';
        cards = [];
        flippedCards = [];
        matchesFound = 0;

        // Create pairs of cards (word and image)
        let gameItems = [];
        memoryPairs.forEach(pair => {
            gameItems.push({ type: 'word', content: pair.word, matchId: pair.id });
            gameItems.push({ type: 'image', content: pair.image, matchId: pair.id });
        });

        // Shuffle cards
        gameItems.sort(() => Math.random() - 0.5);

        const memoryGrid = document.createElement('div');
        memoryGrid.className = 'memory-grid';
        gameContainer.appendChild(memoryGrid);

        gameItems.forEach((item, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.index = index;
            cardElement.dataset.matchId = item.matchId;
            cardElement.dataset.type = item.type;

            const cardInner = document.createElement('div');
            cardInner.classList.add('memory-card-inner');

            const cardFront = document.createElement('div');
            cardFront.classList.add('memory-card-front');
            cardFront.textContent = '?'; // Or a generic icon

            const cardBack = document.createElement('div');
            cardBack.classList.add('memory-card-back');
            cardBack.textContent = item.content;

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardElement.appendChild(cardInner);
            memoryGrid.appendChild(cardElement);

            cardElement.addEventListener('click', () => flipCard(cardElement));
            cards.push(cardElement);
        });
    }

    function flipCard(cardElement) {
        if (flippedCards.length < 2 && !cardElement.classList.contains('flipped') && !cardElement.classList.contains('matched')) {
            cardElement.classList.add('flipped');
            flippedCards.push(cardElement);

            if (flippedCards.length === 2) {
                setTimeout(checkForMatch, 1000);
            }
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.matchId === card2.dataset.matchId;

        if (isMatch) {
            handleMatch(card1, card2);
        } else {
            handleMismatch(card1, card2);
        }

        flippedCards = [];
        checkGameEnd();
    }

    function handleMatch(card1, card2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        showFeedback(true, card1); // Show feedback on one of the cards
        addStars(1);
        matchesFound++;
    }

    function handleMismatch(card1, card2) {
        showFeedback(false, card1); // Show feedback on one of the cards
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }, 500);
    }

    function checkGameEnd() {
        if (matchesFound === memoryPairs.length) {
            gameContainer.innerHTML += `
                <h3>Félicitations ! Tu as terminé le Mémory !</h3>
                <p>Tu as gagné 🪙 30 pièces !</p>
            `;
            addCoins(30);
            setGameCompleted('memory'); // Mark this specific game as completed
        }
    }

    initializeGame();
};

// Expose to global scope
window.initMemory = initMemory;
