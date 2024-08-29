// main.js

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// Initialize Authentication
function initializeAuth() {
    document.getElementById('login-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('google-login-btn').addEventListener('click', () => socialLogin(new firebase.auth.GoogleAuthProvider()));
    document.getElementById('microsoft-login-btn').addEventListener('click', () => socialLogin(new firebase.auth.OAuthProvider('microsoft.com')));
    document.getElementById('apple-login-btn').addEventListener('click', () => socialLogin(new firebase.auth.OAuthProvider('apple.com')));
}

// Handle Form Submission
async function handleFormSubmit(event) {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
        const userCredential = await firebase.auth().signInWithEmailAndPassword(username, password);
        toggleSections();
    } catch (error) {
        handleAuthError(error);
    }
}

// Social Login
async function socialLogin(provider) {
    try {
        const result = await firebase.auth().signInWithPopup(provider);
        toggleSections();
    } catch (error) {
        handleAuthError(error);
    }
}

// Toggle Section Display
function toggleSections() {
    document.getElementById('login-section').classList.add('d-none');
    document.getElementById('flashcard-section').classList.remove('d-none');
}

// Handle Authentication Errors
function handleAuthError(error) {
    console.error('Authentication Error:', error);
    alert('Authentication failed. Please try again.');
}

// Flashcard Generation
function setupFlashcardGenerator() {
    document.getElementById('fileInput').addEventListener('change', handleFileInput);
}

function handleFileInput(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => document.getElementById('textInput').value = e.target.result;
        reader.readAsText(file);
    }
}

function generateFlashcards() {
    const textInput = document.getElementById('textInput').value;
    const flashcardDisplay = document.getElementById('flashcardDisplay');

    flashcardDisplay.innerHTML = '';
    flashcards = [];

    const lines = textInput.split('.').map(line => line.trim()).filter(line => line.length > 0);
    flashcards = lines.map((line, index) => ({
        question: `Question ${index + 1}: ${line.split(' ').slice(0, 5).join(' ')}...?`,
        answer: `Answer: ${line}`
    }));

    if (flashcards.length > 0) {
        document.getElementById('navigation').classList.remove('d-none');
        currentIndex = 0;
        displayFlashcard(currentIndex);
    } else {
        document.getElementById('navigation').classList.add('d-none');
    }
}

function displayFlashcard(index) {
    const flashcardDisplay = document.getElementById('flashcardDisplay');
    const card = flashcards[index];

    flashcardDisplay.innerHTML = `
        <div class="flashcard">
            <div class="flashcard-inner">
                <div class="flashcard-front">${card.question}</div>
                <div class="flashcard-back">${card.answer}</div>
            </div>
        </div>
    `;

    const flashcardElement = flashcardDisplay.querySelector('.flashcard');
    flashcardElement.addEventListener('click', () => {
        flashcardElement.classList.toggle('flipped');
    });

    document.getElementById('prevButton').disabled = index === 0;
    document.getElementById('nextButton').disabled = index === flashcards.length - 1;
}

function prevFlashcard() {
    if (currentIndex > 0) {
        currentIndex--;
        displayFlashcard(currentIndex);
    }
}

function nextFlashcard() {
    if (currentIndex < flashcards.length - 1) {
        currentIndex++;
        displayFlashcard(currentIndex);
    }
}

function enhanceNotes() {
    const aiTextInput = document.getElementById('aiTextInput').value;
    const aiOutput = document.getElementById('aiOutput');
    
    const enhancedText = `${aiTextInput}\n\nAI Suggestion: Don't forget to study the key concepts mentioned above!`;
    aiOutput.innerText = enhancedText;
}

// Initialize Everything on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initializeAuth();
    setupFlashcardGenerator();
});
