
document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('content');
    const startAnalysisBtn = document.getElementById('start-analysis-btn');
    const unlockReportBtn = document.getElementById('unlock-report-btn');
    const quizSection = document.getElementById('quiz');
    const ahaAlertSection = document.getElementById('aha-alert');
    const pricingSection = document.getElementById('pricing');
    const mainContent = document.querySelector('main > section');

    const quizQuestions = [
        {
            question: "How does your child process complex new data?",
            options: ["Visual (Charts)", "Auditory (Discussion)", "Kinesthetic (Build)"]
        },
        {
            question: "Under high-stakes evaluation, what is the default response?",
            options: ["The Thriver (Speed)", "The Deep Thinker (Precision)", "The Collaborative"]
        },
        {
            question: "What is the ultimate End-State for the child's career?",
            options: ["Global Explorer (Ivy)", "Competitive Edge (National)", "The Innovator"]
        },
        {
            question: "Which KPI matters most?",
            options: ["Academic Mastery (Grades)", "Holistic Confidence", "Critical Thinking (Logic)"]
        }
    ];

    let currentQuestion = 0;

    function showSection(sectionId) {
        document.querySelectorAll('main > section').forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById(sectionId).classList.remove('hidden');
    }

    function renderQuestion() {
        const quizContainer = document.getElementById('quiz-questions');
        if (currentQuestion < quizQuestions.length) {
            const questionData = quizQuestions[currentQuestion];
            quizContainer.innerHTML = `
                <p class="text-xl text-center mb-8">${questionData.question}</p>
                <div class="max-w-md mx-auto">
                    ${questionData.options.map((option, index) => `
                        <button class="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 mb-4" data-index="${index}">${option}</button>
                    `).join('')}
                    <button class="text-gray-500 mt-4" id="prev-btn">← Previous</button>
                </div>
            `;

            document.querySelectorAll('#quiz-questions button[data-index]').forEach(button => {
                button.addEventListener('click', () => {
                    currentQuestion++;
                    renderQuestion();
                });
            });

            const prevBtn = document.getElementById('prev-btn');
            if (currentQuestion > 0) {
                prevBtn.addEventListener('click', () => {
                    currentQuestion--;
                    renderQuestion();
                });
                prevBtn.classList.remove('hidden');

            } else {
                prevBtn.classList.add('hidden');
            }


        } else {
            showSection('aha-alert');
        }
    }

    startAnalysisBtn.addEventListener('click', () => {
        showSection('quiz');
        renderQuestion();
    });

    unlockReportBtn.addEventListener('click', () => {
        showSection('pricing');
    });

    // Simple router
    function router() {
        const path = window.location.hash.slice(1) || '/';
        showSection(path.slice(1) || mainContent.id);
    }

    window.addEventListener('hashchange', router);
    router();
});
