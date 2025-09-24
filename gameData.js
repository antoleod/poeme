// gameData.js - Centralized data for mini-games

const gameData = {
    associeImageMot: [
        { image: "🐠", options: ["poisson", "voiture", "tiroir"], answer: "poisson" },
        { image: "🍎", options: ["pomme", "banane", "orange"], answer: "pomme" },
        { image: "🚗", options: ["voiture", "avion", "bateau"], answer: "voiture" },
        { image: "🏠", options: ["maison", "arbre", "fleur"], answer: "maison" },
        { image: "🌳", options: ["arbre", "fleur", "herbe"], answer: "arbre" },
    ],
    phraseATrous: [
        { sentence: "Papa utilise un ... pour arroser ses plantes.", options: ["arrosoir", "marteau", "livre"], answer: "arrosoir" },
        { sentence: "Le chat dort sur le ... douillet.", options: ["tapis", "mur", "plafond"], answer: "tapis" },
        { sentence: "Je mange une ... sucrée.", options: ["pomme", "chaise", "table"], answer: "pomme" },
        { sentence: "L'oiseau chante sur la ...", options: ["branche", "route", "maison"], answer: "branche" },
        { sentence: "Le soleil brille dans le ...", options: ["ciel", "sol", "eau"], answer: "ciel" },
    ],
    dicteeAudio: [
        { text: "oiseau" },
        { text: "poire" },
        { text: "voiture" },
        { text: "trois" },
        { text: "mouchoir" },
    ],
    memory: [
        { id: "poisson", word: "POISSON", image: "🐠" },
        { id: "pomme", word: "POMME", image: "🍎" },
        { id: "voiture", word: "VOITURE", image: "🚗" },
        { id: "maison", word: "MAISON", image: "🏠" },
    ],
    jeuDeCopie: [
        { word: "maison" },
        { word: "école" },
        { word: "ordinateur" },
        { word: "fleur" },
        { word: "soleil" },
    ],
    motsCaches: [
        {
            grid: [
                ['P', 'O', 'I', 'R', 'E', 'Z'],
                ['A', 'V', 'O', 'I', 'T', 'U'],
                ['S', 'O', 'I', 'S', 'O', 'N'],
                ['M', 'O', 'U', 'C', 'H', 'O'],
                ['T', 'R', 'O', 'I', 'S', 'R'],
                ['E', 'C', 'O', 'L', 'E', 'A'],
            ],
            wordsToFind: ["POIRE", "OISEAU", "VOITURE", "TROIS", "MOUCHOIR", "ECOLE"],
        },
        // Add more levels here
    ],
    relierColonnes: [
        {
            scriptWords: ["maison", "arbre", "fleur", "soleil"],
            cursiveWords: ["maison", "arbre", "fleur", "soleil"], // These will be shuffled
        },
        // Add more levels here
    ],
    puzzleLettres: [
        { word: "QUAND" },
        { word: "MAIS" },
        { word: "AVEC" },
        { word: "POUR" },
        { word: "DANS" },
    ],
    calendrierInteractif: [
        { question: "Combien de jours y a-t-il en septembre ?", options: ["30", "31", "28"], answer: "30" },
        { question: "Quelle est la saison après l'été ?", options: ["automne", "hiver", "printemps"], answer: "automne" },
        { question: "Combien de jours y a-t-il dans une semaine ?", options: ["5", "7", "10"], answer: "7" },
        { question: "Quel est le premier mois de l'année ?", options: ["janvier", "décembre", "juillet"], answer: "janvier" },
    ],
    // Add data for other games here
};
