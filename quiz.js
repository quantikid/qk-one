let questions = [];
let currentQuestionIndex = 0;
let userAnswers = {};

// Load questions from JSON file
fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data;
        displayQuestion();
    })
    .catch(error => console.error('Error loading questions:', error));

// Display the current question
function displayQuestion() {
    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = '';

    const questionObj = questions[currentQuestionIndex];
    const questionEl = document.createElement('div');
    questionEl.classList.add('question');
    questionEl.textContent = questionObj.question;

    const optionsEl = document.createElement('ul');
    optionsEl.classList.add('options');
    questionObj.options.forEach(option => {
        const li = document.createElement('li');
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'option';
        radio.value = option;
        if (userAnswers[currentQuestionIndex] === option) {
            radio.checked = true;
        }
        li.appendChild(radio);
        li.appendChild(document.createTextNode(option));
        optionsEl.appendChild(li);
    });

    quizDiv.appendChild(questionEl);
    quizDiv.appendChild(optionsEl);
    updateControls();
}

// Update controls based on the current question
function updateControls() {
    document.getElementById('prev').disabled = currentQuestionIndex === 0;
    document.getElementById('next').style.display =
        currentQuestionIndex === questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submit').style.display =
        currentQuestionIndex === questions.length - 1 ? 'inline-block' : 'none';
}

// Save the user's selected answer
function saveAnswer() {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        userAnswers[currentQuestionIndex] = selectedOption.value;
    }
}

// Navigate to the next question
document.getElementById('next').addEventListener('click', () => {
    saveAnswer();
    currentQuestionIndex++;
    displayQuestion();
});

// Navigate to the previous question
document.getElementById('prev').addEventListener('click', () => {
    saveAnswer();
    currentQuestionIndex--;
    displayQuestion();
});

// Submit the quiz
document.getElementById('submit').addEventListener('click', () => {
    saveAnswer();
    calculateScore();
});

// Calculate and display the score
function calculateScore() {
    let score = 0;
    questions.forEach((q, index) => {
        if (userAnswers[index] === q.answer) {
            score++;
        }
    });

    const quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = `<h2>Your Score: ${score} / ${questions.length}</h2>`;
    document.querySelector('.controls').style.display = 'none';
}
