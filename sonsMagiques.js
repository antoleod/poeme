// sonsMagiques.js - Logic for "Les Sons Magiques" game

const initSonsMagiques = (gameCompletion, setGameCompleted) => {
    console.log("sonsMagiques.js: initSonsMagiques called.");
    const gameContainer = document.getElementById('sons-magiques-content');
    if (!gameContainer) {
        console.error("sonsMagiques.js: Game container #sons-magiques-content not found!");
        return;
    }
    console.log("sonsMagiques.js: Game container found.", gameContainer);

    const questions = [
        // OU sound
        { sound: "OU", image: "🦉", partialWord: "ch_ette", correctAnswer: "chouette", audioSrc: "path/to/chouette.mp3" },
        { sound: "OU", image: "🐻", partialWord: "_rs", correctAnswer: "ours", audioSrc: "path/to/ours.mp3" },
        { sound: "OU", image: "🐺", partialWord: "l_p", correctAnswer: "loup", audioSrc: "path/to/loup.mp3" },
        // ON sound
        { sound: "ON", image: "🍄", partialWord: "champign_", correctAnswer: "champignon", audioSrc: "path/to/champignon.mp3" },
        { sound: "ON", image: "🎈", partialWord: "ball_", correctAnswer: "ballon", audioSrc: "path/to/ballon.mp3" },
        { sound: "ON", image: "🦁", partialWord: "li_", correctAnswer: "lion", audioSrc: "path/to/lion.mp3" },
        // IN sound
        { sound: "IN", image: "🐰", partialWord: "lap_", correctAnswer: "lapin", audioSrc: "path/to/lapin.mp3" },
        { sound: "IN", image: "🖐️", partialWord: "ma_", correctAnswer: "main", audioSrc: "path/to/main.mp3" },
        { sound: "IN", image: "🖌️", partialWord: "pe_", correctAnswer: "peinture", audioSrc: "path/to/peinture.mp3" },
        // GN sound
        { sound: "GN", image: "🐑", partialWord: "a_eau", correctAnswer: "agneau", audioSrc: "path/to/agneau.mp3" },
        { sound: "GN", image: "⛰️", partialWord: "monta_e", correctAnswer: "montagne", audioSrc: "path/to/montagne.mp3" },
        { sound: "GN", image: "🕷️", partialWord: "ara_ée", correctAnswer: "araignée", audioSrc: "path/to/araignee.mp3" },
        // EU sound
        { sound: "EU", image: "🌸", partialWord: "fl_r", correctAnswer: "fleur", audioSrc: "path/to/fleur.mp3" },
        { sound: "EU", image: "🔵", partialWord: "bl_", correctAnswer: "bleu", audioSrc: "path/to/bleu.mp3" },
        { sound: "EU", image: "🍳", partialWord: "_f", correctAnswer: "oeuf", audioSrc: "path/to/oeuf.mp3" }
    ];

    let currentQuestionIndex = 0;
    let correctAnswersInLevel = 0;
    const questionsPerLevel = 3;
    let currentLevel = 1;
    // Expand question bank so there are more levels; compute maxLevels dynamically
    // Add a few extra example questions
    questions.push(
        { sound: "OU", image: "🍽️", partialWord: "ass_ette", correctAnswer: "assiette", audioSrc: "path/to/assiette.mp3" },
        { sound: "ON", image: "🌳", partialWord: "arb_", correctAnswer: "arbre", audioSrc: "path/to/arbre.mp3" },
        { sound: "IN", image: "☕", partialWord: "t_s", correctAnswer: "tasse", audioSrc: "path/to/tasse.mp3" }
    );
    const maxLevels = Math.ceil(questions.length / questionsPerLevel);

    const gameDiv = document.createElement('div');
    gameDiv.className = 'sons-magiques-game-content';
    gameDiv.style.width = '100%';
    gameDiv.style.maxWidth = '700px';
    gameDiv.style.margin = '0 auto 30px auto';
    gameDiv.style.backgroundColor = '#E8F5E9'; /* Light Green */
    gameDiv.style.padding = '30px';
    gameDiv.style.borderRadius = 'var(--border-radius-lg)';
    gameDiv.style.boxShadow = 'var(--box-shadow)';
    gameContainer.appendChild(gameDiv);
    console.log("sonsMagiques.js: Appended gameDiv to gameContainer.", gameDiv);

    const levelTitle = document.createElement('h3');
    levelTitle.style.color = 'var(--accent-color)';
    levelTitle.style.marginBottom = '20px';
    gameDiv.appendChild(levelTitle);

    const instructions = document.createElement('p');
    instructions.textContent = "Écoute le mot, regarde l'image et complète le mot avec le bon son !";
    instructions.style.fontSize = '1.3em';
    instructions.style.marginBottom = '20px';
    gameDiv.appendChild(instructions);

    const imageDisplay = document.createElement('div');
    imageDisplay.style.fontSize = '6em';
    imageDisplay.style.marginBottom = '20px';
    gameDiv.appendChild(imageDisplay);

    const partialWordDisplay = document.createElement('p');
    partialWordDisplay.style.fontSize = '2em';
    partialWordDisplay.style.fontWeight = 'bold';
    partialWordDisplay.style.marginBottom = '20px';
    gameDiv.appendChild(partialWordDisplay);

    const answerInput = document.createElement('input');
    answerInput.type = 'text';
    answerInput.placeholder = 'Tape le son ici...';
    answerInput.style.padding = '15px';
    answerInput.style.fontSize = '1.2em';
    answerInput.style.borderRadius = 'var(--border-radius-md)';
    answerInput.style.border = '2px solid var(--primary-color)';
    answerInput.style.width = '80%';
    answerInput.style.maxWidth = '300px';
    answerInput.style.marginBottom = '20px';
    gameDiv.appendChild(answerInput);

    const audioControls = document.createElement('div');
    audioControls.className = 'audio-controls';
    audioControls.style.marginTop = '20px';
    audioControls.style.display = 'flex';
    audioControls.style.justifyContent = 'center';
    audioControls.style.gap = '15px';
    gameDiv.appendChild(audioControls);

    const playWordBtn = document.createElement('button');
    playWordBtn.className = 'btn-primary';
    playWordBtn.textContent = '▶️ Écouter le mot';
    audioControls.appendChild(playWordBtn);

    const recordBtn = document.createElement('button');
    recordBtn.className = 'btn-primary';
    recordBtn.textContent = '🎙️ J\'enregistre';
    let isRecording = false;
    audioControls.appendChild(recordBtn);

    const playRecordedBtn = document.createElement('button');
    playRecordedBtn.className = 'btn-secondary';
    playRecordedBtn.textContent = '▶️ Écouter mon enregistrement';
    playRecordedBtn.style.display = 'none';
    audioControls.appendChild(playRecordedBtn);

    const checkButton = document.createElement('button');
    checkButton.className = 'btn-primary';
    checkButton.textContent = 'Vérifier';
    checkButton.style.marginTop = '30px';
    gameDiv.appendChild(checkButton);

    function giveFeedback(isCorrect) {
        console.log(`sonsMagiques.js: Giving feedback. Correct: ${isCorrect}`);
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
        console.log(`sonsMagiques.js: Loading question ${currentQuestionIndex + 1}.`);
        if (currentQuestionIndex < questions.length) {
            const q = questions[currentQuestionIndex];
            levelTitle.textContent = `Niveau ${currentLevel} - Son: ${q.sound}`;
            imageDisplay.textContent = q.image;
            partialWordDisplay.textContent = q.partialWord.replace('_', '...'); // Visual cue for missing part
            answerInput.value = '';
            answerInput.focus();
            playRecordedBtn.style.display = 'none'; // Hide recorded audio button for new question

            playWordBtn.onclick = () => {
                console.log(`sonsMagiques.js: Playing word: ${q.correctAnswer}`);
                audioManager.speakText(q.correctAnswer);
            };

            recordBtn.onclick = async () => {
                if (!isRecording) {
                    console.log("sonsMagiques.js: Starting recording.");
                    const started = await audioManager.startRecording();
                    if (started) {
                        isRecording = true;
                        recordBtn.textContent = '⏹️ Arrêter l\'enregistrement';
                        recordBtn.style.backgroundColor = 'var(--autumn-leaf)';
                    }
                } else {
                    console.log("sonsMagiques.js: Stopping recording.");
                    audioManager.stopRecording();
                    isRecording = false;
                    recordBtn.textContent = '🎙️ J\'enregistre';
                    recordBtn.style.backgroundColor = 'var(--primary-color)';
                    playRecordedBtn.style.display = 'inline-block';
                }
            };

            playRecordedBtn.onclick = () => {
                console.log("sonsMagiques.js: Playing recorded audio.");
                audioManager.playRecordedAudio();
            };

            checkButton.onclick = () => {
                console.log("sonsMagiques.js: Checking answer.");
                const userAnswer = answerInput.value.trim().toLowerCase();
                const isCorrect = userAnswer === q.correctAnswer.toLowerCase().replace(q.partialWord.replace('_', ''), '');
                giveFeedback(isCorrect);

                if (isCorrect) {
                    correctAnswersInLevel++;
                }

                currentQuestionIndex++;
                if (currentQuestionIndex % questionsPerLevel === 0) {
                    // Level completed
                    console.log(`sonsMagiques.js: Level ${currentLevel} completed.`);
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
                            console.log("sonsMagiques.js: All levels completed.");
                            gameDiv.innerHTML = `<h3>Félicitations ! Tu as terminé tous les niveaux des Sons Magiques !</h3>
                                                 <p>Tu es un vrai magicien des mots !</p>`;
                            setGameCompleted('sonsMagiques'); // Mark game as completed
                            // Optionally, go back to home screen
                        }
                    }, 2000);
                } else {
                    setTimeout(loadQuestion, 1000); // Load next question in current level
                }
            };

        } else {
            console.log("sonsMagiques.js: All questions answered.");
            gameDiv.innerHTML = `<h3>Félicitations ! Tu as terminé tous les niveaux des Sons Magiques !</h3>
                                 <p>Tu es un vrai magicien des mots !</p>`;
            setGameCompleted('sonsMagiques'); // Mark game as completed
            // Optionally, go back to home screen
        }
    }

    // Shuffle questions to ensure variety across levels
    questions.sort(() => Math.random() - 0.5);

    loadQuestion();
};

window.initSonsMagiques = initSonsMagiques;
