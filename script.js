// script.js - Main application logic

document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded event fired.");

    const appContainer = document.getElementById('app-container');
    const homeScreen = document.getElementById('home-screen');
    const avatarSelectionScreen = document.getElementById('avatar-selection-screen');
    const saisonMystereGame = document.getElementById('saison-mystere-game');
    const sonsMagiquesGame = document.getElementById('sons-magiques-game');
    const meteoNatureGame = document.getElementById('meteo-nature-game');
    const boutiqueScreen = document.getElementById('boutique-screen');
    const miniGamesMenuScreen = document.getElementById('mini-games-menu-screen');

    // Mini-game screens
    const associeImageMotGame = document.getElementById('associeImageMot-game');
    const phraseATrousGame = document.getElementById('phraseATrous-game');
    const dicteeAudioGame = document.getElementById('dicteeAudio-game');
    const memoryGame = document.getElementById('memory-game');
    const jeuDeCopieGame = document.getElementById('jeuDeCopie-game');
    const motsCachesGame = document.getElementById('motsCaches-game');
    const relierColonnesGame = document.getElementById('relierColonnes-game');
    const puzzleLettresGame = document.getElementById('puzzleLettres-game');
    const calendrierInteractifGame = document.getElementById('calendrierInteractif-game');
    const jeuDesIntrusGame = document.getElementById('jeuDesIntrus-game');
    const courseAuxEtoilesGame = document.getElementById('courseAuxEtoiles-game');
    const miniHistoireGame = document.getElementById('miniHistoire-game');
    const dicteeVocaleGame = document.getElementById('dicteeVocale-game');
    const phraseMagiqueGame = document.getElementById('phraseMagique-game');
    const modeRevisionGame = document.getElementById('modeRevision-game');

    const avatarDisplay = document.getElementById('current-avatar');
    const starsCount = document.getElementById('stars-count');
    const coinsCount = document.getElementById('coins-count');
    const boutiqueItemsContainer = document.getElementById('boutique-items');
    const specialTitleDisplay = document.getElementById('special-title-display');

    let currentAvatar = localStorage.getItem('avatar') || '😊';
    let currentClothingColor = localStorage.getItem('clothingColor') || '#FFD700';
    let userStars = parseInt(localStorage.getItem('userStars')) || 0;
    let userCoins = parseInt(localStorage.getItem('userCoins')) || 0;
    let unlockedItems = JSON.parse(localStorage.getItem('unlockedItems')) || {};
    let equippedItems = JSON.parse(localStorage.getItem('equippedItems')) || {};
    let gameCompletion = JSON.parse(localStorage.getItem('gameCompletion')) || { saisonMystere: false, sonsMagiques: false, meteoNature: false };
    let specialTitleUnlocked = localStorage.getItem('specialTitleUnlocked') === 'true';

    const boutiqueItems = [
        { id: 'hat1', name: 'Chapeau de magicien', emoji: '🧙‍♂️', cost: 50, type: 'hat' },
        { id: 'glasses1', name: 'Lunettes de soleil', emoji: '🕶️', cost: 30, type: 'glasses' },
        { id: 'backpack1', name: 'Sac à dos d\'explorateur', emoji: '🎒', cost: 70, type: 'backpack' },
        { id: 'pet1', name: 'Petit chat', emoji: '🐱', cost: 100, type: 'pet' },
        { id: 'hat2', name: 'Casquette cool', emoji: '🧢', cost: 40, type: 'hat' },
        { id: 'glasses2', name: 'Monocle', emoji: '🧐', cost: 60, type: 'glasses' },
    ];

    // --- Utility Functions ---
    function showScreen(screenToShow) {
        console.log(`script.js: Showing screen: ${screenToShow.id}`);
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');
    }

    function updateSidebar() {
        console.log("script.js: Updating sidebar.");
        avatarDisplay.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <span role="img" aria-label="avatar" style="font-size: 80px; background-color: ${currentClothingColor}; border-radius: 50%; padding: 5px;">${currentAvatar}</span>
                ${equippedItems.hat ? `<span style="position: absolute; top: -10px; left: 50%; transform: translateX(-50%); font-size: 40px;">${boutiqueItems.find(item => item.id === equippedItems.hat).emoji}</span>` : ''}
                ${equippedItems.glasses ? `<span style="position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-size: 30px;">${boutiqueItems.find(item => item.id === equippedItems.glasses).emoji}</span>` : ''}
                ${equippedItems.backpack ? `<span style="position: absolute; bottom: 0; right: 0; font-size: 30px;">${boutiqueItems.find(item => item.id === equippedItems.backpack).emoji}</span>` : ''}
                ${equippedItems.pet ? `<span style="position: absolute; bottom: -10px; left: 0; font-size: 30px;">${boutiqueItems.find(item => item.id === equippedItems.pet).emoji}</span>` : ''}
            </div>
        `;
        starsCount.textContent = userStars;
        coinsCount.textContent = userCoins;

        if (specialTitleUnlocked) {
            specialTitleDisplay.classList.remove('hidden');
        } else {
            specialTitleDisplay.classList.add('hidden');
        }
    }

    function saveUserData() {
        console.log("script.js: Saving user data.");
        localStorage.setItem('avatar', currentAvatar);
        localStorage.setItem('clothingColor', currentClothingColor);
        localStorage.setItem('userStars', userStars);
        localStorage.setItem('userCoins', userCoins);
        localStorage.setItem('unlockedItems', JSON.stringify(unlockedItems));
        localStorage.setItem('equippedItems', JSON.stringify(equippedItems));
        localStorage.setItem('gameCompletion', JSON.stringify(gameCompletion));
        localStorage.setItem('specialTitleUnlocked', specialTitleUnlocked);
    }

    function checkGlobalCompletion() {
        console.log("script.js: Checking global completion.");
        const allGamesCompleted = Object.values(gameCompletion).every(status => status === true);
        if (allGamesCompleted && !specialTitleUnlocked) {
            specialTitleUnlocked = true;
            saveUserData();
            updateSidebar();
            alert("Félicitations ! Tu as débloqué le titre spécial : Explorateur des Saisons !");
        }
    }

    // --- Reward System ---
    window.addStars = (amount) => {
        console.log(`script.js: Adding ${amount} stars.`);
        userStars += amount;
        saveUserData();
        updateSidebar();
        // Add animation for stars
        anime({
            targets: '#stars-count',
            scale: [1, 1.3, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    };

    window.addCoins = (amount) => {
        console.log(`script.js: Adding ${amount} coins.`);
        userCoins += amount;
        saveUserData();
        updateSidebar();
        // Add animation for coins
        anime({
            targets: '#coins-count',
            scale: [1, 1.3, 1],
            duration: 300,
            easing: 'easeInOutQuad'
        });
    };

    // --- Global Completion Setter ---
    function setGameCompleted(gameName) {
        console.log(`script.js: Game ${gameName} completed.`);
        if (gameCompletion[gameName] !== undefined) {
            gameCompletion[gameName] = true;
            saveUserData();
            checkGlobalCompletion();
        }
    }
    window.setGameCompleted = setGameCompleted;

    // --- Feedback Function ---
    function showFeedback(isCorrect, targetElement) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.style.position = 'absolute';
        feedbackDiv.style.fontSize = '5em';
        feedbackDiv.style.opacity = '0';
        feedbackDiv.style.pointerEvents = 'none';
        feedbackDiv.style.zIndex = '1000';

        if (isCorrect) {
            feedbackDiv.textContent = '✨';
            anime({
                targets: feedbackDiv,
                translateY: [-50, -150],
                opacity: [1, 0],
                scale: [0.5, 1.5],
                duration: 1000,
                easing: 'easeOutExpo',
                complete: () => feedbackDiv.remove()
            });
        } else {
            feedbackDiv.textContent = '❌';
            anime({
                targets: feedbackDiv,
                scale: [1, 1.5, 1],
                opacity: [1, 0],
                duration: 500,
                easing: 'easeOutElastic',
                complete: () => feedbackDiv.remove()
            });
        }
        // Position feedback relative to the target element or center of screen
        if (targetElement) {
            const rect = targetElement.getBoundingClientRect();
            feedbackDiv.style.top = `${rect.top + rect.height / 2 - 50}px`;
            feedbackDiv.style.left = `${rect.left + rect.width / 2 - 50}px`;
        } else {
            feedbackDiv.style.top = '50%';
            feedbackDiv.style.left = '50%';
            feedbackDiv.style.transform = 'translate(-50%, -50%)';
        }
        document.body.appendChild(feedbackDiv);

        // Play sound feedback
        if (isCorrect) {
            // audioManager.playSound('correct'); // Assuming audioManager has this
        } else {
            // audioManager.playSound('incorrect'); // Assuming audioManager has this
        }
    }
    window.showFeedback = showFeedback; // Make it globally accessible

    // --- Initial Setup ---
    console.log("script.js: Initial setup.");
    updateSidebar();
    showScreen(homeScreen); // Start at home screen

    // --- Boutique Functions ---
    function renderBoutiqueItems() {
        console.log("script.js: Rendering boutique items.");
        boutiqueItemsContainer.innerHTML = '';
        boutiqueItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'boutique-item';
            const isUnlocked = unlockedItems[item.id];
            const isEquipped = equippedItems[item.type] === item.id;

            itemDiv.innerHTML = `
                <span role="img" aria-label="${item.name}" style="font-size: 50px;">${item.emoji}</span>
                <p>${item.name}</p>
                <p>${item.cost} 🪙</p>
                <button class="buy-equip-btn" data-item-id="${item.id}" data-item-type="${item.type}">
                    ${isUnlocked ? (isEquipped ? 'Équipé ✅' : 'Équiper') : 'Acheter'}
                </button>
            `;
            boutiqueItemsContainer.appendChild(itemDiv);
        });

        document.querySelectorAll('.buy-equip-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                console.log("script.js: Buy/Equip button clicked.");
                const itemId = event.target.dataset.itemId;
                const itemType = event.target.dataset.itemType;
                const item = boutiqueItems.find(i => i.id === itemId);

                if (!unlockedItems[itemId]) {
                    // Try to buy
                    if (userCoins >= item.cost) {
                        userCoins -= item.cost;
                        unlockedItems[itemId] = true;
                        equippedItems[itemType] = itemId; // Equip immediately after buying
                        saveUserData();
                        updateSidebar();
                        renderBoutiqueItems();
                        alert(`Tu as acheté et équipé le ${item.name} !`);
                    } else {
                        alert(`Tu n'as pas assez de pièces pour acheter le ${item.name}. Il te manque ${item.cost - userCoins} pièces.`);
                    }
                } else {
                    // Item is unlocked, equip/unequip
                    if (equippedItems[itemType] === itemId) {
                        delete equippedItems[itemType]; // Unequip
                        alert(`Tu as déséquipé le ${item.name}.`);
                    } else {
                        equippedItems[itemType] = itemId; // Equip
                        alert(`Tu as équipé le ${item.name} !`);
                    }
                    saveUserData();
                    updateSidebar();
                    renderBoutiqueItems();
                }
            });
        });
    }

    // --- Event Listeners ---

    // Home Screen Buttons
    document.getElementById('avatar-selection-btn').addEventListener('click', () => {
        console.log("script.js: Avatar Selection button clicked.");
        showScreen(avatarSelectionScreen);
        // Pre-select current avatar and color
        document.querySelectorAll('.avatar-option').forEach(option => {
            option.classList.remove('selected');
            if (option.dataset.avatar === currentAvatar) {
                option.classList.add('selected');
            }
        });
        document.getElementById('clothing-color').value = currentClothingColor;
    });

    document.getElementById('mini-games-btn').addEventListener('click', () => {
        console.log("script.js: Mini-Games button clicked.");
        showScreen(miniGamesMenuScreen);
    });

    document.querySelectorAll('.game-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log(`script.js: Game button clicked: ${event.target.dataset.game}`);
            const game = event.target.dataset.game;
            if (game === 'saisonMystere') {
                showScreen(saisonMystereGame);
                if (typeof initSaisonMystere === 'function') {
                    console.log("script.js: Calling initSaisonMystere.");
                    initSaisonMystere(gameCompletion, setGameCompleted, showFeedback, addStars, addCoins); // Pass utility functions
                } else {
                    console.error('script.js: initSaisonMystere function not found.');
                }
            } else if (game === 'sonsMagiques') {
                showScreen(sonsMagiquesGame);
                if (typeof initSonsMagiques === 'function') {
                    console.log("script.js: Calling initSonsMagiques.");
                    initSonsMagiques(gameCompletion, setGameCompleted, showFeedback, addStars, addCoins);
                } else {
                    console.error('script.js: initSonsMagiques function not found.');
                }
            } else if (game === 'meteoNature') {
                showScreen(meteoNatureGame);
                if (typeof initMeteoNature === 'function') {
                    console.log("script.js: Calling initMeteoNature.");
                    initMeteoNature(gameCompletion, setGameCompleted, showFeedback, addStars, addCoins);
                } else {
                    console.error('script.js: initMeteoNature function not found.');
                }
            }
        });
    });

    // Mini-Game Buttons
    document.querySelectorAll('.mini-game-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const gameId = event.target.dataset.gameId;
            console.log(`script.js: Mini-Game button clicked: ${gameId}`);
            const gameScreen = document.getElementById(`${gameId}-game`);
            if (gameScreen) {
                showScreen(gameScreen);
                // Dynamically call the init function for the specific game
                const initFunctionName = `init${gameId.charAt(0).toUpperCase() + gameId.slice(1)}`;
                if (typeof window[initFunctionName] === 'function') {
                    console.log(`script.js: Calling ${initFunctionName}.`);
                    window[initFunctionName](document.getElementById(`${gameId}-content`), gameData[gameId], setGameCompleted, showFeedback, addStars, addCoins, audioManager);
                } else {
                    console.error(`script.js: ${initFunctionName} function not found.`);
                }
            } else {
                console.error(`script.js: Game screen for ${gameId} not found.`);
            }
        });
    });

    // Sidebar Buttons
    document.getElementById('change-avatar-btn').addEventListener('click', () => {
        console.log("script.js: Change Avatar button clicked.");
        showScreen(avatarSelectionScreen);
    });

    document.getElementById('boutique-btn').addEventListener('click', () => {
        console.log("script.js: Boutique button clicked.");
        showScreen(boutiqueScreen);
        renderBoutiqueItems();
    });

    // Avatar Selection Screen
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', (event) => {
            console.log("script.js: Avatar option selected.");
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            event.target.classList.add('selected');
            currentAvatar = event.target.dataset.avatar;
            // Update avatar in sidebar immediately for preview
            updateSidebar();
        });
    });

    document.getElementById('clothing-color').addEventListener('input', (event) => {
        console.log("script.js: Clothing color changed.");
        currentClothingColor = event.target.value;
        // Update avatar in sidebar immediately for preview
        updateSidebar();
    });

    document.getElementById('save-avatar-btn').addEventListener('click', () => {
        console.log("script.js: Save Avatar button clicked.");
        saveUserData();
        updateSidebar();
        showScreen(homeScreen);
    });

    // Back to Home/Games Buttons
    document.querySelectorAll('.back-to-home').forEach(button => {
        button.addEventListener('click', () => {
            console.log("script.js: Back to Home/Games button clicked.");
            showScreen(homeScreen);
        });
    });

    // Back to Mini-Games Menu Buttons
    document.querySelectorAll('.back-to-mini-games-menu').forEach(button => {
        button.addEventListener('click', () => {
            console.log("script.js: Back to Mini-Games Menu button clicked.");
            showScreen(miniGamesMenuScreen);
        });
    });

});
