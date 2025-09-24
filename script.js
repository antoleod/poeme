// script.js - Main application logic

document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded event fired.");

    const appContainer = document.getElementById('app-container');
    const homeScreen = document.getElementById('home-screen');
    const avatarSelectionScreen = document.getElementById('avatar-selection-screen');
    const boutiqueScreen = document.getElementById('boutique-screen');
    const miniGamesMenuScreen = document.getElementById('mini-games-menu-screen');
    const dynamicGameScreen = document.getElementById('dynamic-game-screen'); // New dynamic game screen

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
    let gameCompletion = JSON.parse(localStorage.getItem('gameCompletion')) || {};
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
    // --- Utility Functions (now part of gameManager or global) ---
    function showScreen(screenToShow) { // This global function will now just call gameManager.showScreen
        gameManager.showScreen(screenToShow.id);
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
        // This logic needs to be updated to check for completion of all levels across all games
        // For now, it will remain as a placeholder or check a simplified condition.
        // Example: if all games have at least one level completed.
        const allGamesHaveAtLeastOneLevelCompleted = Object.keys(gameManager.registeredGames).every(gameId => {
            // Check if any level for this game is marked as completed
            return Object.keys(gameCompletion).some(key => key.startsWith(`${gameId}-level-`));
        });

        if (allGamesHaveAtLeastOneLevelCompleted && !specialTitleUnlocked) {
            specialTitleUnlocked = true;
            saveUserData();
            updateSidebar();
            alert("Félicitations ! Tu as débloqué le titre especial : Explorateur des Saisons !");
        }
    }

    // --- GameManager Object ---
    const gameManager = {
        registeredGames: {}, // Stores game classes
        activeGameInstance: null,
        audioManager: window.audioManager, // Assuming audioManager.js exists and is loaded

        registerGame: function(gameId, gameClass) {
            this.registeredGames[gameId] = gameClass;
            console.log(`Game registered: ${gameId}`);
        },

        showScreen: function(screenId) {
            console.log(`script.js: Showing screen: ${screenId}`);
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        },

        startGame: function(gameId, level = 1) {
            const GameClass = this.registeredGames[gameId];
            if (GameClass) {
                this.showScreen('dynamic-game-screen');
                dynamicGameScreen.innerHTML = '';

                this.activeGameInstance = new GameClass(
                    dynamicGameScreen,
                    this.gameData[gameId],
                    this
                );
                this.activeGameInstance.initLevel(level);
                console.log(`Game ${gameId} started at level ${level}.`);
            } else {
                console.error(`Game ${gameId} not found in registered games.`);
            }
        },

        // --- Reward System (delegated from global scope) ---
        addStars: function(amount) {
            console.log(`script.js: Adding ${amount} stars.`);
            userStars += amount;
            saveUserData();
            updateSidebar();
            anime({
                targets: '#stars-count',
                scale: [1, 1.3, 1],
                duration: 300,
                easing: 'easeInOutQuad'
            });
        },

        addCoins: function(amount) {
            console.log(`script.js: Adding ${amount} coins.`);
            userCoins += amount;
            saveUserData();
            updateSidebar();
            anime({
                targets: '#coins-count',
                scale: [1, 1.3, 1],
                duration: 300,
                easing: 'easeInOutQuad'
            });
        },

        setGameCompleted: function(completionId) { // completionId could be 'gameId-level-X'
            console.log(`script.js: Completion ID ${completionId} marked as completed.`);
            gameCompletion[completionId] = true;
            saveUserData();
            checkGlobalCompletion();
        },

        showFeedback: function(isCorrect, targetElement) {
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
        },

        playSound: function(soundName) {
            if (this.audioManager && typeof this.audioManager.playSound === 'function') {
                this.audioManager.playSound(soundName);
            } else {
                console.warn(`Audio manager not available or playSound method missing for sound: ${soundName}`);
            }
        }
    };
    window.gameManager = gameManager; // Make gameManager globally accessible
    gameManager.gameData = window.gameData || {}; // Ensure gameData is available

    // --- Utility Functions (now part of gameManager or global) ---
    function showScreen(screenToShow) { // This global function will now just call gameManager.showScreen
        gameManager.showScreen(screenToShow.id);
    }

    // --- Initial Setup ---
    console.log("script.js: Initial setup.");
    console.log("window.gameData:", window.gameData);
    console.log("gameManager.gameData:", gameManager.gameData);
    console.log("window.gameData:", window.gameData);
    console.log("gameManager.gameData:", gameManager.gameData);
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
        gameManager.showScreen('avatar-selection-screen');
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
        gameManager.showScreen('mini-games-menu-screen');
    });

    document.querySelectorAll('.game-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            console.log(`script.js: Game button clicked: ${event.target.dataset.game}`);
            const gameId = event.target.dataset.game; // Use gameId for consistency
            gameManager.startGame(gameId);
        });
    });

    // Mini-Game Buttons - NOW USE gameManager.startGame
    document.querySelectorAll('.mini-game-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const gameId = event.target.dataset.gameId;
            console.log(`script.js: Mini-Game button clicked: ${gameId}`);
            gameManager.startGame(gameId); // Start the game via gameManager
        });
    });

    // Sidebar Buttons
    document.getElementById('change-avatar-btn').addEventListener('click', () => {
        console.log("script.js: Change Avatar button clicked.");
        gameManager.showScreen('avatar-selection-screen');
    });

    document.getElementById('boutique-btn').addEventListener('click', () => {
        console.log("script.js: Boutique button clicked.");
        gameManager.showScreen('boutique-screen');
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
        gameManager.showScreen('home-screen');
    });

    // Back to Home/Games Buttons
    document.querySelectorAll('.back-to-home').forEach(button => {
        button.addEventListener('click', () => {
            console.log("script.js: Back to Home/Games button clicked.");
            gameManager.showScreen('home-screen');
        });
    });

    // Back to Mini-Games Menu Buttons
    document.querySelectorAll('.back-to-mini-games-menu').forEach(button => {
        button.addEventListener('click', () => {
            console.log("script.js: Back to Mini-Games Menu button clicked.");
            showScreen(miniGamesMenuScreen);
        });
    });

    // Register games
    gameManager.registerGame('associeImageMot', AssocieImageMotGame);
    gameManager.registerGame('phraseATrous', PhraseATrousGame);
    gameManager.registerGame('dicteeAudio', DicteeAudioGame);

});
