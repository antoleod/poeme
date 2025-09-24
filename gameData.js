// gameData.js - Centralized data for all mini-games

const gameData = {
    // Data for "Associe Image ↔ Mot" (10 exercises)
    associeImageMot: {
        levels: [
            { image: "🐠", options: ["poisson", "voiture", "tiroir"], correct: "poisson", feedback: "Bravo ! C'est un poisson !", incorrectFeedback: "Non, ce n'est pas ça. Essaie encore !" },
            { image: "🚗", options: ["avion", "voiture", "bateau"], correct: "voiture", feedback: "Super ! C'est une voiture !", incorrectFeedback: "Non, ce n'est pas ça. Regarde bien l'image." },
            { image: "🍎", options: ["banane", "pomme", "orange"], correct: "pomme", feedback: "Excellent ! C'est une pomme !", incorrectFeedback: "Non, ce n'est pas ça. Quel est ce fruit ?" },
            { image: "🐱", options: ["chat", "cheval", "vache"], correct: "chat", feedback: "Bien vu ! C'est un chat.", incorrectFeedback: "Non, regarde encore l'image." },
            { image: "🐶", options: ["chien", "oiseau", "lapin"], correct: "chien", feedback: "Exact ! C'est un chien.", incorrectFeedback: "Non, ce n'est pas ça. Essaie encore !" },
            { image: "🌻", options: ["fleur", "arbre", "herbe"], correct: "fleur", feedback: "Magnifique ! C'est une fleur !", incorrectFeedback: "Non, ce n'est pas ça. Observe bien la nature." },
            { image: "📚", options: ["livre", "cahier", "stylo"], correct: "livre", feedback: "Parfait ! C'est un livre !", incorrectFeedback: "Non, ce n'est pas ça. Qu'est-ce qu'on lit ?" },
            { image: "🎈", options: ["ballon", "nuage", "oiseau"], correct: "ballon", feedback: "Génial ! C'est un ballon !", incorrectFeedback: "Non, ce n'est pas ça. Qu'est-ce qui flotte dans l'air ?" },
            { image: "🏠", options: ["maison", "école", "hôpital"], correct: "maison", feedback: "Très bien ! C'est une maison !", incorrectFeedback: "Non, ce n'est pas ça. Où habite-t-on ?" },
            { image: "🌳", options: ["arbre", "buisson", "fleur"], correct: "arbre", feedback: "Excellent ! C'est un arbre !", incorrectFeedback: "Non, ce n'est pas ça. Qu'est-ce qui a un tronc et des feuilles ?" }
        ]
    },

    // Data for "Phrase à trous" (10 exercises)
    phraseATrous: {
        levels: [
            { sentence: "Papa utilise un ... pour arroser ses plantes.", options: ["arrosoir", "marteau", "livre"], correct: "arrosoir", feedback: "Bien joué ! Un arrosoir sert à arroser.", incorrectFeedback: "Non, ce n'est pas le bon mot. Que faut-il pour arroser ?" },
            { sentence: "Le chat dort sur le ... douillet.", options: ["mur", "tapis", "arbre"], correct: "tapis", feedback: "Exact ! Le chat aime les tapis douillets.", incorrectFeedback: "Non, ce n'est pas ça. Où le chat aime-t-il dormir ?" },
            { sentence: "Je mange une ... tous les matins.", options: ["pomme", "chaise", "lampe"], correct: "pomme", feedback: "Bravo ! Une pomme au petit-déjeuner.", incorrectFeedback: "Non, réfléchis à un fruit à manger." },
            { sentence: "Nous allons à l'... pour apprendre.", options: ["école", "pont", "forêt"], correct: "école", feedback: "Oui ! On va à l'école pour apprendre.", incorrectFeedback: "Non, ce n'est pas ça. Où apprenons-nous habituellement ?" },
            { sentence: "Maman met le pain dans le ... pour le cuire.", options: ["four", "plafond", "chaise"], correct: "four", feedback: "Bravo, le four cuit le pain.", incorrectFeedback: "Non, essaie de penser à ce qui cuit le pain." },
            { sentence: "Le soleil brille dans le ... bleu.", options: ["ciel", "terre", "mer"], correct: "ciel", feedback: "Oui ! Le soleil est dans le ciel.", incorrectFeedback: "Non, où brille le soleil ?" },
            { sentence: "L'oiseau construit son ... dans l'arbre.", options: ["nid", "maison", "lit"], correct: "nid", feedback: "Exact ! L'oiseau construit un nid.", incorrectFeedback: "Non, que construit l'oiseau ?" },
            { sentence: "Le bébé boit du ... dans son biberon.", options: ["lait", "eau", "jus"], correct: "lait", feedback: "Bravo ! Le bébé boit du lait.", incorrectFeedback: "Non, que boit un bébé ?" },
            { sentence: "Je mets mes chaussures à mes ... .", options: ["pieds", "mains", "tête"], correct: "pieds", feedback: "Super ! Les chaussures vont aux pieds.", incorrectFeedback: "Non, où met-on les chaussures ?" },
            { sentence: "Le clown fait rire les enfants avec ses ... .", options: ["blagues", "chansons", "danses"], correct: "blagues", feedback: "Excellent ! Les blagues font rire.", incorrectFeedback: "Non, qu'est-ce qui fait rire avec un clown ?" }
        ]
    },

    // Data for "Dictée audio" (5 exercises)
    dicteeAudio: {
        levels: [
            { word: "oiseau", sentence: "Un oiseau chante dans le jardin.", feedback: "Parfait ! C'est bien 'oiseau'.", incorrectFeedback: "Non, réécoute et essaie d'écrire 'oiseau'." },
            { word: "voiture", sentence: "La voiture roule vite.", feedback: "Très bien ! 'voiture' est correct.", incorrectFeedback: "Non, réécoute et essaie d'écrire 'voiture'." },
            { word: "poisson", sentence: "Le poisson nage dans l'eau.", feedback: "Bravo ! 'poisson' est bien écrit.", incorrectFeedback: "Non, essaie encore d'écrire 'poisson'." },
            { word: "maison", sentence: "La maison est grande.", feedback: "Excellent ! 'maison' est correct.", incorrectFeedback: "Non, réessaie d'écrire 'maison'." },
            { word: "tapis", sentence: "Le chat dort sur le tapis.", feedback: "Super ! 'tapis' est correct.", incorrectFeedback: "Non, essaie d'écrire 'tapis' correctement." }
        ]
    },

    // Data for "Mémory" (5 pairs => 10 cards)
    memory: [
        { id: 1, type: "image", content: "🐶" }, { id: 1, type: "word", content: "chien" },
        { id: 2, type: "image", content: "🐱" }, { id: 2, type: "word", content: "chat" },
        { id: 3, type: "image", content: "🍎" }, { id: 3, type: "word", content: "pomme" },
        { id: 4, type: "image", content: "🍌" }, { id: 4, type: "word", content: "banane" },
        { id: 5, type: "image", content: "🐠" }, { id: 5, type: "word", content: "poisson" }
    ],

    // Data for "Jeu de copie" (5 words)
    jeuDeCopie: [
        { word: "maison", feedback: "Super ! Tu as bien copié 'maison'.", incorrectFeedback: "Non, regarde bien et copie 'maison'." },
        { word: "école", feedback: "Excellent ! 'école' est parfait.", incorrectFeedback: "Non, il y a une erreur. Copie 'école' attentivement." },
        { word: "poisson", feedback: "Bravo ! 'poisson' est bien écrit.", incorrectFeedback: "Non, essaie encore de copier 'poisson'." },
        { word: "arrosoir", feedback: "Bien joué ! 'arrosoir' est correct.", incorrectFeedback: "Non, regarde bien les lettres d' 'arrosoir'." },
        { word: "pomme", feedback: "Super ! 'pomme' est parfait.", incorrectFeedback: "Non, essaie de nouveau de copier 'pomme'." }
    ],

    // Data for "Mots cachés" (grid + words, 10 words)
    motsCaches: {
        grid: [
            ['M', 'O', 'T', 'S', 'O', 'U', 'T', 'I', 'L', 'S'],
            ['A', 'V', 'E', 'C', 'L', 'E', 'S', 'T', 'U', 'Y'],
            ['I', 'L', 'E', 'S', 'T', 'D', 'A', 'N', 'S', 'A'],
            ['S', 'U', 'R', 'P', 'O', 'U', 'R', 'E', 'T', 'R'],
            ['C', 'H', 'E', 'Z', 'D', 'E', 'S', 'U', 'N', 'E'],
            ['Q', 'U', 'A', 'N', 'D', 'C', 'O', 'M', 'M', 'E']
        ],
        words: ["MOTS", "AVEC", "LES", "DANS", "SUR", "POUR", "CHEZ", "DES", "UNE", "QUAND"]
    },

    // Data for "Relier les colonnes" (5 associations)
    relierColonnes: [
        { script: "maison", cursive: "maison" },
        { script: "école", cursive: "école" },
        { script: "livre", cursive: "livre" },
        { script: "pomme", cursive: "pomme" },
        { script: "poisson", cursive: "poisson" }
    ],

    // Data for "Puzzle de lettres" (5 scrambled words)
    puzzleLettres: [
        { scrambled: "Q U A N D", correct: "QUAND", feedback: "Bravo ! C'est 'QUAND'.", incorrectFeedback: "Non, essaie de reformer 'QUAND'." },
        { scrambled: "M A I S O N", correct: "MAISON", feedback: "Super ! C'est 'MAISON'.", incorrectFeedback: "Non, essaie de reformer 'MAISON'." },
        { scrambled: "P O I S S O N", correct: "POISSON", feedback: "Bravo ! C'est 'POISSON'.", incorrectFeedback: "Non, essaie de reformer 'POISSON'." },
        { scrambled: "A R R O S O I R", correct: "ARROSOIR", feedback: "Bien joué ! 'ARROSOIR'.", incorrectFeedback: "Non, essaie de reformer 'ARROSOIR'." },
        { scrambled: "P O M M E", correct: "POMME", feedback: "Excellent ! 'POMME'.", incorrectFeedback: "Non, essaie de reformer 'POMME'." }
    ],

    // Data for "Calendrier interactif" (5 questions)
    calendrierInteractif: [
        { question: "Combien de jours y a-t-il en septembre ?", options: ["28", "30", "31"], correct: "30", feedback: "Oui, septembre a 30 jours !", incorrectFeedback: "Non, essaie encore." },
        { question: "Quelle est la saison où les feuilles tombent ?", options: ["printemps", "été", "automne", "hiver"], correct: "automne", feedback: "Exact ! C'est l'automne.", incorrectFeedback: "Non, quelle saison est celle des feuilles qui tombent ?" },
        { question: "Combien de semaines y a-t-il environ dans un mois ?", options: ["2", "4", "6"], correct: "4", feedback: "Oui, environ 4 semaines.", incorrectFeedback: "Non, réfléchis au nombre de semaines dans un mois." },
        { question: "Quel jour vient après mardi ?", options: ["lundi", "mercredi", "jeudi"], correct: "mercredi", feedback: "Bravo ! Mercredi vient après mardi.", incorrectFeedback: "Non, essaie encore." },
        { question: "Quelle saison est la plus chaude ?", options: ["printemps", "été", "automne", "hiver"], correct: "été", feedback: "Exact, l'été est la saison la plus chaude.", incorrectFeedback: "Non, quelle saison est chaude ?" }
    ],

    // Data for "Jeu des intrus" (5 sets)
    jeuDesIntrus: [
        { sound: "/oi/", words: ["poire", "voiture", "roi", "table"], intruder: "table", feedback: "Oui, 'table' n'a pas le son /oi/.", incorrectFeedback: "Non, trouve le mot qui n'a pas le son /oi/." },
        { sound: "/an/", words: ["maman", "enfant", "chanson", "soleil"], intruder: "soleil", feedback: "Oui, 'soleil' n'a pas le son /an/.", incorrectFeedback: "Non, trouve le mot qui n'a pas le son /an/." },
        { sound: "/ɔ̃/", words: ["nom", "nombre", "mon", "lune"], intruder: "lune", feedback: "Oui, 'lune' n'a pas le son /ɔ̃/.", incorrectFeedback: "Non, cherche le mot intrus." },
        { sound: "/e/", words: ["mère", "père", "frère", "banc"], intruder: "banc", feedback: "Oui, 'banc' n'a pas le son /e/.", incorrectFeedback: "Non, cherche le mot intrus." },
        { sound: "/wa/", words: ["oisillon", "poire", "roi", "lune"], intruder: "lune", feedback: "Oui, 'lune' n'a pas le son /wa/.", incorrectFeedback: "Non, cherche le mot intrus." }
    ],

    // Data for "Course aux étoiles" (pool)
    courseAuxEtoiles: [
        { word: "poire", hasSound: true },
        { word: "maison", hasSound: false },
        { word: "roi", hasSound: true },
        { word: "table", hasSound: false },
        { word: "voiture", hasSound: true },
        { word: "poisson", hasSound: true },
        { word: "tapis", hasSound: false }
    ],

    // Data for "Mini-histoire à compléter" (5 short texts)
    miniHistoire: [
        { story: "Le petit chat joue avec une ... de laine.", blanks: ["pelote"], options: ["pelote", "souris", "balle", "ficelle"], feedback: "Bravo ! L'histoire est complète.", incorrectFeedback: "Non, les mots ne sont pas corrects. Essaie encore." },
        { story: "Le roi a perdu sa ... dans le jardin.", blanks: ["couronne"], options: ["couronne", "chaise", "table", "lampe"], feedback: "Bravo ! 'couronne' complète bien la phrase.", incorrectFeedback: "Non, essaie un autre mot." },
        { story: "La petite fille mange une ... après l'école.", blanks: ["pomme"], options: ["pomme", "voiture", "soleil", "nuage"], feedback: "Super ! 'pomme' est parfait.", incorrectFeedback: "Non, ce n'est pas le bon choix." },
        { story: "Le bateau navigue sur la ... bleue.", blanks: ["mer"], options: ["mer", "montagne", "route", "forêt"], feedback: "Bien joué ! 'mer' complète la phrase.", incorrectFeedback: "Non, essaie encore." },
        { story: "Il y a une ... qui chante sur la branche.", blanks: ["oiseau"], options: ["oiseau", "chaise", "voiture", "lampe"], feedback: "Bravo ! 'oiseau' est correct.", incorrectFeedback: "Non, ce mot ne convient pas." }
    ],

    // Data for "Dictée vocale personnalisée"
    dicteeVocale: { instructions: "Demande à un adulte d'enregistrer une phrase pour toi. Ensuite, écris ce que tu entends !", example: "Le chat dort sur le tapis.", correctAnswer: "Le chat dort sur le tapis." },

    // Data for "Phrase magique animée" (5 example phrases)
    phraseMagique: {
        instructions: "Écris une phrase et regarde les mots se colorier selon les sons travaillés !",
        targetSound: "/oi/",
        examples: [
            "Le roi mange une poire.",
            "La voiture fait un bruit bizarre.",
            "Il voit un oiseau dans le ciel.",
            "Mon poisson nage dans l'eau.",
            "Quand est la sortie ?"
        ]
    },

    // Data for "Mode révision / examen" (pool of words)
    modeRevision: { quizWords: ["poisson", "voiture", "maison", "école", "oiseau", "pomme", "banane", "tapis", "arrosoir", "QUAND", "roi", "poire"] }
};

// Expose gameData to the global scope
window.gameData = gameData;