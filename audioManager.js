// audioManager.js - Handles all audio functionalities using Howler.js and MediaRecorder API

const audioManager = (() => {
    let mediaRecorder;
    let audioChunks = [];
    let recordedAudioBlob;
    let recordedAudioHowl;
    let voices = [];

    // Load voices when available
    if ('speechSynthesis' in window) {
        speechSynthesis.onvoiceschanged = () => {
            voices = speechSynthesis.getVoices();
            console.log("TTS voices loaded:", voices.map(voice => voice.name));
        };
    }

    // Function to play a sound (e.g., a poem verse)
    const playSound = (src) => {
        const sound = new Howl({
            src: [src],
            html5: true // Use HTML5 Audio to avoid decoding delays for short sounds
        });
        sound.play();
    };

    // Function to speak text using Web Speech API (TTS)
    const speakText = (text, lang = 'fr-FR') => {
        if (!('speechSynthesis' in window)) {
            console.warn("Web Speech API (TTS) not supported in this browser.");
            alert("La synthèse vocale n'est pas supportée par votre navigateur.");
            return;
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Try to find a French voice, otherwise use default
        const frenchVoice = voices.find(voice => voice.lang === lang);
        if (frenchVoice) {
            utterance.voice = frenchVoice;
        } else {
            console.warn("French voice not found, using default.");
        }

        speechSynthesis.speak(utterance);
    };

    // Function to start recording user's voice
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                recordedAudioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const audioUrl = URL.createObjectURL(recordedAudioBlob);
                recordedAudioHowl = new Howl({
                    src: [audioUrl],
                    html5: true
                });
                // Clean up stream tracks
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            console.log("Recording started...");
            return true;
        } catch (error) {
            console.error("Error starting recording:", error);
            alert("Impossible de démarrer l'enregistrement. Assurez-vous d'avoir autorisé l'accès au microphone.");
            return false;
        }
    };

    // Function to stop recording
    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            console.log("Recording stopped.");
            return true;
        }
        return false;
    };

    // Function to play back the recorded audio
    const playRecordedAudio = () => {
        if (recordedAudioHowl) {
            recordedAudioHowl.play();
            console.log("Playing recorded audio...");
            return true;
        }
        console.log("No recorded audio to play.");
        return false;
    };

    // Function to get the recorded audio blob (if needed for upload/storage)
    const getRecordedAudioBlob = () => {
        return recordedAudioBlob;
    };

    return {
        playSound,
        speakText,
        startRecording,
        stopRecording,
        playRecordedAudio,
        getRecordedAudioBlob
    };
})();

// Expose to global scope if needed by other modules
window.audioManager = audioManager;