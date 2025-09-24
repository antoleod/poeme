// meteoNature.js - Logic for "Météo & Nature" game

const initMeteoNature = (gameCompletion, setGameCompleted) => {
    console.log("meteoNature.js: initMeteoNature called.");
    const gameContainer = document.getElementById('meteo-nature-content');
    if (!gameContainer) {
        console.error("meteoNature.js: Game container #meteo-nature-content not found!");
        return;
    }
    console.log("meteoNature.js: Game container found.", gameContainer);

    const questions = [
        // Drag and Drop (Image to Phrase)
        { type: "drag_drop", image: "🍂", phrase: "Les feuilles tombent des arbres.", correctAnswer: "feuilles" },
        { type: "drag_drop", image: "🌬️", phrase: "Le vent souffle fort.", correctAnswer: "vent" },
        { type: "drag_drop", image: "🌧️", phrase: "La pluie tombe du ciel.", correctAnswer: "pluie" },
        { type: "drag_drop", image: "☀️", phrase: "Le soleil brille moins longtemps.", correctAnswer: "soleil" },
        // Multiple Choice
        { type: "multiple_choice", question: "En automne, que fait l'arbre ?", options: ["Il met ses feuilles", "Il retire ses feuilles", "Il fleurit"], correctAnswer: "Il retire ses feuilles" },
        { type: "multiple_choice", question: "Quel temps fait-il souvent en automne ?", options: ["Très chaud", "Très froid", "Frais et nuageux"], correctAnswer: "Frais et nuageux" },
        { type: "multiple_choice", question: "Que peut-on entendre sous nos pas en automne ?", options: ["Des fleurs", "Des feuilles craquantes", "De la neige"], correctAnswer: "Des feuilles craquantes" }
    ];

    let currentQuestionIndex = 0;
    let correctAnswersInLevel = 0;
    const questionsPerLevel = 2; // 2 questions per level for this game
    let currentLevel = 1;
    const maxLevels = 5;

    const gameDiv = document.createElement('div');
    gameDiv.className = 'meteo-nature-game-content';
    gameDiv.style.width = '100%';
    gameDiv.style.maxWidth = '800px';
    gameDiv.style.margin = '0 auto 30px auto';
    gameDiv.style.backgroundColor = '#E0F2F7'; /* Light Blue */
    gameDiv.style.padding = '30px';
    gameDiv.style.borderRadius = 'var(--border-radius-lg)';
    gameDiv.style.boxShadow = 'var(--box-shadow)';
    gameContainer.appendChild(gameDiv);
    console.log("meteoNature.js: Appended gameDiv to gameContainer.", gameDiv);

    const levelTitle = document.createElement('h3');
    levelTitle.style.color = 'var(--accent-color)';
    levelTitle.style.marginBottom = '20px';
    gameDiv.appendChild(levelTitle);

    const instructions = document.createElement('p');
    instructions.style.fontSize = '1.3em';
    instructions.style.marginBottom = '20px';
    gameDiv.appendChild(instructions);

    function giveFeedback(isCorrect) {
        console.log(`meteoNature.js: Giving feedback. Correct: ${isCorrect}`);
        const feedbackDiv = document.createElement('div');
        feedbackDiv.style.position = 'absolute';
        feedbackDiv.style.fontSize = '5em';
        feedbackDiv.style.opacity = '0';
        feedbackDiv.style.pointerEvents = 'none';
        feedbackDiv.style.zIndex = '1000';

        if (isCorrect) {
            feedbackDiv.textContent = '✨';
            window.addStars(1);
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
        gameContainer.appendChild(feedbackDiv);
    }

    function loadQuestion() {
        console.log(`meteoNature.js: Loading question ${currentQuestionIndex + 1}.`);
        if (currentQuestionIndex < questions.length) {
            const q = questions[currentQuestionIndex];
            gameDiv.innerHTML = ''; // Clear previous question content
            gameDiv.appendChild(levelTitle);
            gameDiv.appendChild(instructions);

            levelTitle.textContent = `Niveau ${currentLevel} - ${q.type === "drag_drop" ? "Glisse l'image" : "Choisis la bonne réponse"}`;

            if (q.type === "drag_drop") {
                instructions.textContent = "Glisse l'image vers la phrase qui la décrit !";

                const dragDropArea = document.createElement('div');
                dragDropArea.style.display = 'flex';
                dragDropArea.style.flexDirection = 'column';
                dragDropArea.style.alignItems = 'center';
                dragDropArea.style.gap = '20px';
                dragDropArea.style.marginTop = '30px';

                const draggableImage = document.createElement('div');
                draggableImage.textContent = q.image;
                draggableImage.style.fontSize = '5em';
                draggableImage.style.cursor = 'grab';
                draggableImage.setAttribute('draggable', true);
                draggableImage.dataset.answer = q.correctAnswer;
                draggableImage.className = 'draggable-item';
                dragDropArea.appendChild(draggableImage);

                const dropTarget = document.createElement('div');
                dropTarget.textContent = q.phrase;
                dropTarget.style.fontSize = '1.5em';
                dropTarget.style.padding = '20px';
                dropTarget.style.border = '2px dashed var(--primary-color)';
                dropTarget.style.borderRadius = 'var(--border-radius-md)';
                dropTarget.style.minHeight = '100px';
                dropTarget.style.display = 'flex';
                dropTarget.style.alignItems = 'center';
                dropTarget.style.justifyContent = 'center';
                dropTarget.style.width = '90%';
                dropTarget.style.backgroundColor = '#FFFFFF';
                dropTarget.className = 'drop-target';
                dropTarget.dataset.expectedAnswer = q.correctAnswer;
                dragDropArea.appendChild(dropTarget);

                gameDiv.appendChild(dragDropArea);

                draggableImage.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', e.target.dataset.answer);
                    e.target.classList.add('dragging');
                });

                dropTarget.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    dropTarget.style.borderColor = 'var(--secondary-color)';
                });

                dropTarget.addEventListener('dragleave', () => {
                    dropTarget.style.borderColor = 'var(--primary-color)';
                });

                dropTarget.addEventListener('drop', (e) => {
                    e.preventDefault();
                    dropTarget.style.borderColor = 'var(--primary-color)';
                    const droppedAnswer = e.dataTransfer.getData('text/plain');
                    const isCorrect = (droppedAnswer === dropTarget.dataset.expectedAnswer);
                    giveFeedback(isCorrect);

                    if (isCorrect) {
                        correctAnswersInLevel++;
                        draggableImage.remove(); // Remove image after correct drop
                        dropTarget.style.backgroundColor = '#DCE775'; // Light green
                    }
                    setTimeout(nextQuestion, 1000);
                });

            } else if (q.type === "multiple_choice") {
                instructions.textContent = q.question;

                const optionsDiv = document.createElement('div');
                optionsDiv.style.display = 'flex';
                optionsDiv.style.flexDirection = 'column';
                optionsDiv.style.gap = '15px';
                optionsDiv.style.marginTop = '30px';
                gameDiv.appendChild(optionsDiv);

                q.options.forEach(option => {
                    const optionBtn = document.createElement('button');
                    optionBtn.className = 'btn-primary';
                    optionBtn.textContent = option;
                    optionBtn.style.backgroundColor = '#BBDEFB'; // Lighter Blue
                    optionBtn.style.color = 'var(--text-color)';
                    optionBtn.style.fontSize = '1.2em';
                    optionBtn.addEventListener('click', () => {
                        const isCorrect = (option === q.correctAnswer);
                        giveFeedback(isCorrect);
                        if (isCorrect) {
                            correctAnswersInLevel++;
                        }
                        setTimeout(nextQuestion, 1000);
                    });
                    optionsDiv.appendChild(optionBtn);
                });
            }
        } else {
            console.log("meteoNature.js: All questions answered.");
            gameDiv.innerHTML = `<h3>Félicitations ! Tu as terminé tous les niveaux de Météo & Nature !</h3>
                                 <p>Tu es un expert de l'automne !</p>`;
            setGameCompleted('meteoNature'); // Mark game as completed
            // Optionally, go back to home screen
        }
    }

    function nextQuestion() {
        currentQuestionIndex++;
        if (currentQuestionIndex % questionsPerLevel === 0) {
            // Level completed
            console.log(`meteoNature.js: Level ${currentLevel} completed.`);
            if (correctAnswersInLevel >= questionsPerLevel / 2) { // Pass if at least half correct
                gameDiv.innerHTML = `<h3>Niveau ${currentLevel} terminé !</h3>
                                     <p>Tu as gagné 🪙 20 pièces !</p>`;
                window.addCoins(20);
            } else {
                gameDiv.innerHTML = `<h3>Niveau ${currentLevel} terminé !</h3>
                                     <p>Essaie encore pour gagner des pièces !</p>`;
            }
            correctAnswersInLevel = 0;
            currentLevel++;
            setTimeout(() => {
                if (currentLevel <= maxLevels) {
                    loadQuestion(); // Load next level's first question
                } else {
                    console.log("meteoNature.js: All levels completed.");
                    gameDiv.innerHTML = `<h3>Félicitations ! Tu as terminé tous les niveaux de Météo & Nature !</h3>
                                         <p>Tu es un expert de l'automne !</p>`;
                    setGameCompleted('meteoNature'); // Mark game as completed
                    // Optionally, go back to home screen
                }
            }, 2000);
        } else {
            loadQuestion(); // Load next question in current level
        }
    }

    // Shuffle questions to ensure variety across levels
    questions.sort(() => Math.random() - 0.5);

    loadQuestion();
};

window.initMeteoNature = initMeteoNature;