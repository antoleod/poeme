// phraseMagique.js - Logic for the "Phrase Magique Animée" game

const initPhraseMagique = (gameContainer, gameData, setGameCompleted, showFeedback, addStars, addCoins, audioManager) => {
    console.log("phraseMagique.js: initPhraseMagique called.");

    const gameContent = gameContainer; // The div where game content will be rendered
    const gameId = "phraseMagique";
    const { instructions, targetSound, examples } = gameData;

    function renderGame() {
        gameContent.innerHTML = `
            <div class="phrase-magique-game">
                <p class="game-instructions">${instructions}</p>
                <textarea class="phrase-input" placeholder="Écris ta phrase ici..."></textarea>
                <button class="btn-primary color-phrase-btn">✨ Colorier la phrase !</button>
                <div class="colored-phrase-display"></div>
                <div class="feedback-message"></div>
            </div>
        `;

        const phraseInput = gameContent.querySelector('.phrase-input');
        const colorPhraseBtn = gameContent.querySelector('.color-phrase-btn');
        const coloredPhraseDisplay = gameContent.querySelector('.colored-phrase-display');
        const feedbackMessageDiv = gameContent.querySelector('.feedback-message');

        colorPhraseBtn.addEventListener('click', () => {
            const phrase = phraseInput.value.trim();
            if (phrase === "") {
                feedbackMessageDiv.textContent = "Écris une phrase d'abord !";
                feedbackMessageDiv.style.color = 'var(--incorrect-color)';
                return;
            }

            coloredPhraseDisplay.innerHTML = '';
            let wordsColored = 0;

            phrase.split(/(\s+)/).forEach(part => {
                if (part.trim() === '') {
                    coloredPhraseDisplay.appendChild(document.createTextNode(part));
                    return;
                }

                const span = document.createElement('span');
                span.textContent = part;
                span.classList.add('phrase-word');

                // Simple check for words containing the target sound (case-insensitive)
                const hasTargetSound = wordsWithSound.some(word => part.toLowerCase().includes(word.toLowerCase()));

                if (hasTargetSound) {
                    span.style.color = 'var(--accent-color)'; // Example color
                    span.style.fontWeight = 'bold';
                    span.style.fontSize = '1.2em';
                    anime({
                        targets: span,
                        scale: [1, 1.1, 1],
                        duration: 500,
                        easing: 'easeInOutQuad',
                        direction: 'alternate',
                        loop: false
                    });
                    wordsColored++;
                }
                coloredPhraseDisplay.appendChild(span);
            });

            if (wordsColored > 0) {
                showFeedback(true, coloredPhraseDisplay);
                addStars(wordsColored); // Award stars based on words colored
                addCoins(wordsColored * 2); // Award coins
                audioManager.playSound('correct');
                feedbackMessageDiv.textContent = `Super ! Tu as colorié ${wordsColored} mot(s) avec le son ${targetSound} !`;
                feedbackMessageDiv.style.color = 'var(--correct-color)';
            } else {
                showFeedback(false, coloredPhraseDisplay);
                audioManager.playSound('incorrect');
                feedbackMessageDiv.textContent = `Aucun mot avec le son ${targetSound} trouvé. Essaie une autre phrase !`;
                feedbackMessageDiv.style.color = 'var(--incorrect-color)';
            }

            // For this game, we'll mark it completed after one successful coloring
            // or after a certain number of attempts/phrases.
            // For simplicity, let's mark it completed after the first attempt with colored words.
            if (wordsColored > 0) {
                setGameCompleted(gameId);
            }
        });
    }

    // Initial render
    renderGame();
};

// Expose to global scope
window.initPhraseMagique = initPhraseMagique;
