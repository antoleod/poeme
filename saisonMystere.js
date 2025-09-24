// saisonMystere.js - Logic for the "Saison Mystère" game

const initSaisonMystere = (gameCompletion, setGameCompleted) => {
    console.log("saisonMystere.js: initSaisonMystere called.");
    const gameContainer = document.getElementById('saison-mystere-content');
    if (!gameContainer) {
        console.error("saisonMystere.js: Game container #saison-mystere-content not found!");
        return;
    }
    console.log("saisonMystere.js: Game container found.", gameContainer);

    const poemVerses = [
  "🍁 Les feuilles craquent sous mes pas,",
  "👧🧒 Elles dansent partout, doucement, tout bas.",

  "🌬️ Le vent léger joue dans mes cheveux,",
  "☁️ Le ciel se couvre, devient nuageux.",

  "🧥❄️ Je mets mon pull, il fait plus frais,",
  "🌳➡️🍂 L’arbre se dénude, perd son manteau épais.",

  "🌑 D’un coup le ciel peut s’assombrir,",
  "🌧️☔ La pluie arrive parfois sans prévenir.",

  "🌞 Le soleil brille, mais moins longtemps,",
  "🌸➡️🍂 On sent déjà partir le printemps.",

  "🌄 Chaque jour la lumière s’éclaire moins,",
  "🤔❓ Devine, enfant, quelle saison vient ?"
    ];

    let currentLevel = 0;
    const maxLevels = 5; // Now 5 levels for this game

    const gameModes = [
        { name: "Affichage du Poème", setup: setupPoemDisplay },
        { name: "Puzzle du Poème", setup: setupPoemPuzzle },
        { name: "Quiz Vrai/Faux", setup: setupTrueFalseQuiz },
        { name: "Écoute & Trouve", setup: setupListenAndFind },
        { name: "Complète la Rime", setup: setupCompleteTheRhyme }
    ];

    function loadLevel() {
        console.log(`saisonMystere.js: Loading level ${currentLevel + 1}.`)
        if (currentLevel < gameModes.length) {
            gameContainer.innerHTML = ''; // Clear previous game content
            const mode = gameModes[currentLevel];
            const levelTitle = document.createElement('h3');
            levelTitle.textContent = `Niveau ${currentLevel + 1}: ${mode.name}`;
            levelTitle.style.color = 'var(--accent-color)';
            levelTitle.style.marginBottom = '20px';
            gameContainer.appendChild(levelTitle);
            mode.setup();
        } else {
            console.log("saisonMystere.js: All levels completed.");
            gameContainer.innerHTML = `<h3>Félicitations ! Tu as terminé tous les niveaux de Saison Mystère !</h3>
                                       <p>Tu as gagné 🪙 50 pièces !</p>`;
            window.addCoins(50);
            setGameCompleted('saisonMystere'); // Mark game as completed
            // Optionally, go back to home screen or show a completion message
        }
    }

    function giveFeedback(isCorrect) {
        console.log(`saisonMystere.js: Giving feedback. Correct: ${isCorrect}`);
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

    // --- Game Mode 1: Poem Display ---
    function setupPoemDisplay() {
        console.log("saisonMystere.js: Setting up Poem Display.");
        const poemDiv = document.createElement('div');
        poemDiv.className = 'poem-display';
        poemDiv.style.fontSize = '1.5em';
        poemDiv.style.lineHeight = '1.8em';
        poemDiv.style.textAlign = 'center';
        poemDiv.style.marginBottom = '30px';
        poemDiv.style.backgroundColor = '#FFF8E1';
        poemDiv.style.padding = '20px';
        poemDiv.style.borderRadius = 'var(--border-radius-md)';
        poemDiv.style.boxShadow = 'var(--box-shadow)';

        poemVerses.forEach(verse => {
            const p = document.createElement('p');
            p.textContent = verse;
            poemDiv.appendChild(p);
        });
        gameContainer.appendChild(poemDiv);

        const audioControls = document.createElement('div');
        audioControls.className = 'audio-controls';
        audioControls.style.marginTop = '20px';

        const playPoemBtn = document.createElement('button');
        playPoemBtn.className = 'btn-primary';
        playPoemBtn.textContent = '▶️ Écouter le poème';
        playPoemBtn.addEventListener('click', () => {
            console.log("saisonMystere.js: Playing full poem via TTS.");
            audioManager.speakText(poemVerses.join(' '));
        });
        audioControls.appendChild(playPoemBtn);

        const recordBtn = document.createElement('button');
        recordBtn.className = 'btn-primary';
        recordBtn.textContent = '🎙️ J\'enregistre';
        let isRecording = false;
        recordBtn.addEventListener('click', async () => {
            if (!isRecording) {
                console.log("saisonMystere.js: Starting recording.");
                const started = await audioManager.startRecording();
                if (started) {
                    isRecording = true;
                    recordBtn.textContent = '⏹️ Arrêter l\'enregistrement';
                    recordBtn.style.backgroundColor = 'var(--autumn-leaf)';
                }
            } else {
                console.log("saisonMystere.js: Stopping recording.");
                audioManager.stopRecording();
                isRecording = false;
                recordBtn.textContent = '🎙️ J\'enregistre';
                recordBtn.style.backgroundColor = 'var(--primary-color)';
                playRecordedBtn.style.display = 'inline-block';
            }
        });
        audioControls.appendChild(recordBtn);

        const playRecordedBtn = document.createElement('button');
        playRecordedBtn.className = 'btn-secondary';
        playRecordedBtn.textContent = '▶️ Écouter mon enregistrement';
        playRecordedBtn.style.display = 'none';
        playRecordedBtn.addEventListener('click', () => {
            console.log("saisonMystere.js: Playing recorded audio.");
            audioManager.playRecordedAudio();
        });
        audioControls.appendChild(playRecordedBtn);

        gameContainer.appendChild(audioControls);

        const nextButton = document.createElement('button');
        nextButton.className = 'btn-primary';
        nextButton.textContent = 'J\'ai compris, passons au jeu ! ✅';
        nextButton.style.marginTop = '30px';
        nextButton.addEventListener('click', () => {
            currentLevel++;
            loadLevel();
        });
        gameContainer.appendChild(nextButton);
    }

    // --- Game Mode 2: Poem Puzzle ---
    function setupPoemPuzzle() {
        console.log("saisonMystere.js: Setting up Poem Puzzle.");
        const instructions = document.createElement('p');
        instructions.textContent = "Remets les vers du poème dans le bon ordre !";
        instructions.style.fontSize = '1.3em';
        instructions.style.marginBottom = '20px';
        gameContainer.appendChild(instructions);

        const shuffledVerses = [...poemVerses].sort(() => Math.random() - 0.5);
        const dragContainer = document.createElement('div');
        dragContainer.className = 'drag-container';
        dragContainer.style.display = 'flex';
        dragContainer.style.flexDirection = 'column';
        dragContainer.style.gap = '10px';
        dragContainer.style.width = '100%';
        dragContainer.style.maxWidth = '600px';
        dragContainer.style.margin = '0 auto 30px auto';

        shuffledVerses.forEach((verse, index) => {
            const verseElement = document.createElement('div');
            verseElement.className = 'poem-verse-draggable';
            verseElement.textContent = verse;
            verseElement.setAttribute('draggable', true);
            verseElement.dataset.originalIndex = poemVerses.indexOf(verse);
            verseElement.style.backgroundColor = '#FFE0B2'; /* Light Orange */
            verseElement.style.padding = '15px';
            verseElement.style.borderRadius = 'var(--border-radius-md)';
            verseElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
            verseElement.style.cursor = 'grab';
            verseElement.style.fontSize = '1.1em';
            verseElement.style.textAlign = 'left';

            verseElement.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', e.target.dataset.originalIndex);
                e.target.classList.add('dragging');
            });

            verseElement.addEventListener('dragover', (e) => {
                e.preventDefault(); // Allow drop
                const draggingElement = document.querySelector('.dragging');
                if (draggingElement && draggingElement !== e.target) {
                    const bounding = e.target.getBoundingClientRect();
                    const offset = bounding.y + (bounding.height / 2);
                    if (e.clientY - offset > 0) {
                        e.target.parentNode.insertBefore(draggingElement, e.target.nextSibling);
                    } else {
                        e.target.parentNode.insertBefore(draggingElement, e.target);
                    }
                }
            });

            verseElement.addEventListener('dragend', (e) => {
                e.target.classList.remove('dragging');
            });

            dragContainer.appendChild(verseElement);
        });

        gameContainer.appendChild(dragContainer);

        const checkButton = document.createElement('button');
        checkButton.className = 'btn-primary';
        checkButton.textContent = 'Vérifier l\'ordre';
        checkButton.addEventListener('click', () => {
            const currentOrder = Array.from(dragContainer.children).map(el => parseInt(el.dataset.originalIndex));
            const correctOrder = Array.from({ length: poemVerses.length }, (_, i) => i);

            const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);
            giveFeedback(isCorrect);

            if (isCorrect) {
                setTimeout(() => {
                    currentLevel++;
                    loadLevel();
                }, 1500);
            }
        });
        gameContainer.appendChild(checkButton);
    }

    // --- Game Mode 3: True/False Quiz ---
    function setupTrueFalseQuiz() {
        console.log("saisonMystere.js: Setting up True/False Quiz.");
        const questions = [
            { question: "En automne, les feuilles craquent sous nos pas.", answer: true },
            { question: "Le vent souffle toujours doucement en automne.", answer: false },
            { question: "L'arbre met son manteau épais en automne.", answer: false },
            { question: "Le soleil brille plus longtemps en automne qu'au printemps.", answer: false },
            { question: "La pluie vient parfois sans prévenir en automne.", answer: true }
        ];

        let currentQuestionIndex = 0;
        let correctAnswersCount = 0;

        const quizDiv = document.createElement('div');
        quizDiv.className = 'quiz-container';
        quizDiv.style.width = '100%';
        quizDiv.style.maxWidth = '600px';
        quizDiv.style.margin = '0 auto 30px auto';
        quizDiv.style.backgroundColor = '#E8F5E9'; /* Light Green */
        quizDiv.style.padding = '30px';
        quizDiv.style.borderRadius = 'var(--border-radius-lg)';
        quizDiv.style.boxShadow = 'var(--box-shadow)';

        const questionText = document.createElement('p');
        questionText.style.fontSize = '1.5em';
        questionText.style.marginBottom = '30px';
        quizDiv.appendChild(questionText);

        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'center';
        buttonContainer.style.gap = '20px';

        const trueBtn = document.createElement('button');
        trueBtn.className = 'btn-primary';
        trueBtn.textContent = 'Vrai ✅';
        trueBtn.style.backgroundColor = '#4CAF50'; // Green
        trueBtn.addEventListener('click', () => checkAnswer(true));

        const falseBtn = document.createElement('button');
        falseBtn.className = 'btn-primary';
        falseBtn.textContent = 'Faux ❌';
        falseBtn.style.backgroundColor = '#F44336'; // Red
        falseBtn.addEventListener('click', () => checkAnswer(false));

        buttonContainer.appendChild(trueBtn);
        buttonContainer.appendChild(falseBtn);
        quizDiv.appendChild(buttonContainer);
        gameContainer.appendChild(quizDiv);

        function displayQuestion() {
            if (currentQuestionIndex < questions.length) {
                questionText.textContent = questions[currentQuestionIndex].question;
            } else {
                console.log("saisonMystere.js: True/False Quiz completed.");
                quizDiv.innerHTML = `<h3>Quiz terminé !</h3>
                                     <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>`;
                if (correctAnswersCount === questions.length) {
                    quizDiv.innerHTML += `<p>Super ! Tu as tout bon ! ✨</p>`;
                    window.addStars(5);
                }
                setTimeout(() => {
                    currentLevel++;
                    loadLevel();
                }, 2000);
            }
        }

        function checkAnswer(userAnswer) {
            console.log(`saisonMystere.js: Checking True/False answer: ${userAnswer}`);
            const correctAnswer = questions[currentQuestionIndex].answer;
            const isCorrect = (userAnswer === correctAnswer);
            giveFeedback(isCorrect);

            if (isCorrect) {
                correctAnswersCount++;
            }

            currentQuestionIndex++;
            setTimeout(displayQuestion, 1000);
        }

        displayQuestion();
    }

    // --- Game Mode 4: Listen & Find (Match Verse to Image) ---
    function setupListenAndFind() {
        console.log("saisonMystere.js: Setting up Listen & Find.");
        const questions = [
            { verse: poemVerses[0], imageKeyword: "feuilles" }, // Les feuilles craquent sous mes pas
            { verse: poemVerses[2], imageKeyword: "vent" },    // Le vent souffle dans mes cheveux
            { verse: poemVerses[7], imageKeyword: "pluie" },   // La pluie vient parfois sans prévenir
            { verse: poemVerses[8], imageKeyword: "soleil" }   // Le soleil brille mais moins longtemps
        ];

        let currentQuestionIndex = 0;
        let correctAnswersCount = 0;

        const listenFindDiv = document.createElement('div');
        listenFindDiv.className = 'listen-find-container';
        listenFindDiv.style.width = '100%';
        listenFindDiv.style.maxWidth = '700px';
        listenFindDiv.style.margin = '0 auto 30px auto';
        listenFindDiv.style.backgroundColor = '#E3F2FD'; /* Light Blue */
        listenFindDiv.style.padding = '30px';
        listenFindDiv.style.borderRadius = 'var(--border-radius-lg)';
        listenFindDiv.style.boxShadow = 'var(--box-shadow)';

        const instructions = document.createElement('p');
        instructions.textContent = "Écoute le vers et clique sur l'image qui correspond !";
        instructions.style.fontSize = '1.3em';
        instructions.style.marginBottom = '20px';
        listenFindDiv.appendChild(instructions);

        const playVerseBtn = document.createElement('button');
        playVerseBtn.className = 'btn-primary';
        playVerseBtn.textContent = '▶️ Écouter le vers';
        playVerseBtn.style.marginBottom = '30px';
        playVerseBtn.addEventListener('click', () => {
            console.log(`saisonMystere.js: Playing verse: ${questions[currentQuestionIndex].verse}`);
            audioManager.speakText(questions[currentQuestionIndex].verse);
        });
        listenFindDiv.appendChild(playVerseBtn);

        const imageOptionsDiv = document.createElement('div');
        imageOptionsDiv.className = 'image-options';
        imageOptionsDiv.style.display = 'flex';
        imageOptionsDiv.style.justifyContent = 'center';
        imageOptionsDiv.style.gap = '20px';
        imageOptionsDiv.style.flexWrap = 'wrap';
        listenFindDiv.appendChild(imageOptionsDiv);

        gameContainer.appendChild(listenFindDiv);

        const imageKeywords = ["feuilles", "vent", "pluie", "soleil"]; // All possible image options

        function displayQuestion() {
            console.log(`saisonMystere.js: Displaying Listen & Find question ${currentQuestionIndex + 1}.`);
            if (currentQuestionIndex < questions.length) {
                imageOptionsDiv.innerHTML = ''; // Clear previous options
                const currentQuestion = questions[currentQuestionIndex];

                // Shuffle image options to prevent memorization of position
                const shuffledImageKeywords = [...imageKeywords].sort(() => Math.random() - 0.5);

                shuffledImageKeywords.forEach(keyword => {
                    const imgBtn = document.createElement('button');
                    imgBtn.className = 'image-option-btn';
                    imgBtn.style.backgroundColor = '#BBDEFB'; /* Lighter Blue */
                    imgBtn.style.border = 'none';
                    imgBtn.style.borderRadius = 'var(--border-radius-md)';
                    imgBtn.style.padding = '20px';
                    imgBtn.style.fontSize = '1.5em';
                    imgBtn.style.cursor = 'pointer';
                    imgBtn.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                    imgBtn.style.transition = 'transform 0.2s';
                    imgBtn.textContent = getImageEmoji(keyword); // Helper to get emoji for keyword
                    imgBtn.dataset.keyword = keyword;
                    imgBtn.addEventListener('click', () => checkAnswer(keyword, currentQuestion.imageKeyword));
                    imageOptionsDiv.appendChild(imgBtn);
                });
            } else {
                console.log("saisonMystere.js: Listen & Find completed.");
                listenFindDiv.innerHTML = `<h3>Jeu terminé !</h3>
                                         <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>`;
                if (correctAnswersCount === questions.length) {
                    listenFindDiv.innerHTML += `<p>Excellent ! ✨</p>`;
                    window.addStars(5);
                }
                setTimeout(() => {
                    currentLevel++;
                    loadLevel();
                }, 2000);
            }
        }

        function getImageEmoji(keyword) {
            switch (keyword) {
                case "feuilles": return "🍂";
                case "vent": return "🌬️";
                case "pluie": return "🌧️";
                case "soleil": return "☀️";
                default: return "❓";
            }
        }

        function checkAnswer(selectedKeyword, correctKeyword) {
            console.log(`saisonMystere.js: Checking Listen & Find answer. Selected: ${selectedKeyword}, Correct: ${correctKeyword}`);
            const isCorrect = (selectedKeyword === correctKeyword);
            giveFeedback(isCorrect);

            if (isCorrect) {
                correctAnswersCount++;
            }

            currentQuestionIndex++;
            setTimeout(displayQuestion, 1000);
        }

        displayQuestion();
    }

    // --- Game Mode 5: Complete the Rhyme ---
    function setupCompleteTheRhyme() {
        console.log("saisonMystere.js: Setting up Complete the Rhyme.");
        const questions = [
            { partialVerse: "Les feuilles craquent sous mes...", correctAnswer: "pas" },
            { partialVerse: "Elles volent partout, doucement, tout...", correctAnswer: "bas" },
            { partialVerse: "Le vent souffle dans mes...", correctAnswer: "cheveux" },
            { partialVerse: "Le ciel est souvent...", correctAnswer: "nuageux" },
            { partialVerse: "Je mets mon pull, il fait plus...", correctAnswer: "frais" },
            { partialVerse: "L’arbre retire son manteau...", correctAnswer: "épais" }
        ];

        let currentQuestionIndex = 0;
        let correctAnswersCount = 0;

        const rhymeDiv = document.createElement('div');
        rhymeDiv.className = 'rhyme-container';
        rhymeDiv.style.width = '100%';
        rhymeDiv.style.maxWidth = '600px';
        rhymeDiv.style.margin = '0 auto 30px auto';
        rhymeDiv.style.backgroundColor = '#FBE9E7'; /* Light Red/Orange */
        rhymeDiv.style.padding = '30px';
        rhymeDiv.style.borderRadius = 'var(--border-radius-lg)';
        rhymeDiv.style.boxShadow = 'var(--box-shadow)';

        const instructions = document.createElement('p');
        instructions.textContent = "Complète la rime ! Quel est le mot manquant ?";
        instructions.style.fontSize = '1.3em';
        instructions.style.marginBottom = '20px';
        rhymeDiv.appendChild(instructions);

        const verseDisplay = document.createElement('p');
        verseDisplay.style.fontSize = '1.8em';
        verseDisplay.style.fontWeight = 'bold';
        verseDisplay.style.marginBottom = '30px';
        rhymeDiv.appendChild(verseDisplay);

        const answerInput = document.createElement('input');
        answerInput.type = 'text';
        answerInput.placeholder = 'Tape ta réponse ici...';
        answerInput.style.padding = '15px';
        answerInput.style.fontSize = '1.2em';
        answerInput.style.borderRadius = 'var(--border-radius-md)';
        answerInput.style.border = '2px solid var(--primary-color)';
        answerInput.style.width = '80%';
        answerInput.style.maxWidth = '300px';
        answerInput.style.marginBottom = '20px';
        rhymeDiv.appendChild(answerInput);

        const checkButton = document.createElement('button');
        checkButton.className = 'btn-primary';
        checkButton.textContent = 'Vérifier';
        checkButton.addEventListener('click', checkAnswer);
        rhymeDiv.appendChild(checkButton);

        gameContainer.appendChild(rhymeDiv);

        function displayQuestion() {
            console.log(`saisonMystere.js: Displaying Complete the Rhyme question ${currentQuestionIndex + 1}.`);
            if (currentQuestionIndex < questions.length) {
                const currentQuestion = questions[currentQuestionIndex];
                verseDisplay.textContent = currentQuestion.partialVerse;
                answerInput.value = '';
                answerInput.focus();
            } else {
                console.log("saisonMystere.js: Complete the Rhyme completed.");
                rhymeDiv.innerHTML = `<h3>Jeu terminé !</h3>
                                     <p>Tu as eu ${correctAnswersCount} bonnes réponses sur ${questions.length} !</p>`;
                if (correctAnswersCount === questions.length) {
                    rhymeDiv.innerHTML += `<p>Fantastique ! ✨</p>`;
                    window.addStars(5);
                }
                setTimeout(() => {
                    currentLevel++;
                    loadLevel();
                }, 2000);
            }
        }

        function checkAnswer() {
            console.log("saisonMystere.js: Checking Complete the Rhyme answer.");
            const userAnswer = answerInput.value.trim().toLowerCase();
            const correctAnswer = questions[currentQuestionIndex].correctAnswer.toLowerCase();
            const isCorrect = (userAnswer === correctAnswer);
            giveFeedback(isCorrect);

            if (isCorrect) {
                correctAnswersCount++;
            }

            currentQuestionIndex++;
            setTimeout(displayQuestion, 1000);
        }

        displayQuestion();
    }

    // --- Initialize the game ---
    loadLevel();
};

// Expose to global scope
window.initSaisonMystere = initSaisonMystere;
