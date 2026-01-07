
document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    let currentQuestion = 0;
    let userAnswers = [];
    let currentOrder = null;

    const quizData = [
        {
            id: 'q1',
            text: "How does your child process complex new data?",
            options: ["Visual (Charts)", "Auditory (Discussion)", "Kinesthetic (Build)"]
        },
        {
            id: 'q2',
            text: "Under high-stakes evaluation, what is the default response?",
            options: ["The Thriver (Speed)", "The Deep Thinker (Precision)", "The Collaborative"]
        },
        {
            id: 'q3',
            text: "What is the ultimate End-State for the child's career?",
            options: ["Global Explorer (Ivy)", "Competitive Edge (National)", "The Innovator"]
        },
        {
            id: 'q4',
            text: "Which KPI matters most?",
            options: ["Academic Mastery (Grades)", "Holistic Confidence", "Critical Thinking (Logic)"]
        }
    ];

    // --- DOM ELEMENTS ---
    const sections = {
        funnel: document.getElementById('funnel'),
        hero: document.getElementById('hero'),
        quiz: document.getElementById('quiz'),
        scanning: document.getElementById('scanning'),
        aha: document.getElementById('aha-alert'),
        pricing: document.getElementById('pricing'),
        access: document.getElementById('access'),
        dashboard: document.getElementById('dashboard'),
        xray: document.getElementById('xray')
    };

    const quizContainer = {
        text: document.getElementById('question-text'),
        grid: document.getElementById('options-grid'),
        prev: document.getElementById('prev-btn'),
        next: document.getElementById('next-btn')
    };

    // --- ROUTER ---
    function router() {
        const hash = window.location.hash || '#/';
        
        // Reset view
        Object.values(sections).forEach(s => s?.classList.add('hidden'));

        if (hash === '#/' || hash === '#') {
            sections.funnel.classList.remove('hidden');
            sections.hero.classList.remove('hidden');
            sections.quiz.classList.add('hidden');
            sections.scanning.classList.add('hidden');
            sections.aha.classList.add('hidden');
            sections.pricing.classList.add('hidden');
        } else if (hash === '#/access') {
            sections.access.classList.remove('hidden');
        } else if (hash === '#/dashboard') {
            if (currentOrder) {
                sections.dashboard.classList.remove('hidden');
                updateDashboardAccess();
            } else {
                location.hash = '/access';
            }
        } else if (hash === '#/xray') {
            if (currentOrder) {
                sections.xray.classList.remove('hidden');
                updateXrayAccess();
            } else {
                location.hash = '/access';
            }
        }
        window.scrollTo(0, 0);
    }

    // --- QUIZ LOGIC ---
    window.startQuiz = () => {
        sections.hero.classList.add('hidden');
        sections.quiz.classList.remove('hidden');
        currentQuestion = 0;
        userAnswers = [];
        renderQuestion();
    };

    function renderQuestion() {
        const q = quizData[currentQuestion];
        quizContainer.text.innerText = q.text;
        quizContainer.grid.innerHTML = '';

        q.options.forEach((opt, idx) => {
            const btn = document.createElement('div');
            btn.className = `quiz-option border-2 border-gray-800 rounded-2xl p-6 text-lg font-semibold ${userAnswers[currentQuestion] === idx ? 'selected' : ''}`;
            btn.innerText = opt;
            btn.onclick = () => selectOption(idx);
            quizContainer.grid.appendChild(btn);
        });

        quizContainer.prev.classList.toggle('hidden', currentQuestion === 0);
        quizContainer.next.innerText = currentQuestion === quizData.length - 1 ? 'Finish →' : 'Next →';
    }

    function selectOption(idx) {
        userAnswers[currentQuestion] = idx;
        renderQuestion();
        // Auto-advance
        if (currentQuestion < quizData.length - 1) {
            setTimeout(() => {
                currentQuestion++;
                renderQuestion();
            }, 300);
        }
    }

    quizContainer.next.onclick = () => {
        if (userAnswers[currentQuestion] === undefined) {
            alert("Please select an option to proceed.");
            return;
        }
        
        if (currentQuestion < quizData.length - 1) {
            currentQuestion++;
            renderQuestion();
        } else {
            finishQuiz();
        }
    };

    quizContainer.prev.onclick = () => {
        if (currentQuestion > 0) {
            currentQuestion--;
            renderQuestion();
        }
    };

    function finishQuiz() {
        sections.quiz.classList.add('hidden');
        sections.scanning.classList.remove('hidden');

        setTimeout(() => {
            sections.scanning.classList.add('hidden');
            sections.aha.classList.remove('hidden');
        }, 3000);
    }

    window.scrollToPricing = () => {
        sections.aha.classList.add('hidden');
        sections.pricing.classList.remove('hidden');
        document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
    };

    // --- ACCESS LOGIC ---
    window.validateAccess = () => {
        const code = document.getElementById('access-code').value.toUpperCase().trim();
        if (!code) return alert("Please enter your Order ID.");

        // Stateless logic based on prefix
        let tier = null;
        if (code.startsWith('AS5-')) tier = 'starter';
        if (code.startsWith('AS9-')) tier = 'strategic';
        if (code.startsWith('AS1-')) tier = 'elite';

        if (tier) {
            currentOrder = { id: code, tier: tier };
            localStorage.setItem('apt_skola_auth', JSON.stringify(currentOrder));
            location.hash = '/dashboard';
        } else {
            alert("Invalid Access Code. Please check your email for the correct Order ID.");
        }
    };

    function updateDashboardAccess() {
        const { tier } = currentOrder;
        const syncCard = document.getElementById('card-sync');
        const xrayCard = document.getElementById('card-xray');

        // Reset
        syncCard.className = "bg-gray-900/50 border border-gray-800 rounded-3xl p-8 opacity-50 cursor-not-allowed";
        xrayCard.className = "bg-gray-900/50 border border-gray-800 rounded-3xl p-8 opacity-50 cursor-not-allowed";
        
        if (tier === 'starter') {
            // Starter only has Phase 1
        } else if (tier === 'strategic') {
            syncCard.className = "bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-sunrise-orange/50 transition cursor-pointer";
            syncCard.querySelector('span').innerText = "Unlocked";
            syncCard.querySelector('span').className = "text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded";
            syncCard.querySelector('button').disabled = false;
            syncCard.querySelector('button').innerText = "Run Sync Check →";
            syncCard.querySelector('button').className = "text-sunrise-orange font-bold hover:underline";
        } else if (tier === 'elite') {
            // Unlock everything
            [syncCard, xrayCard].forEach((card, i) => {
                card.className = "bg-gray-900/50 border border-gray-800 rounded-3xl p-8 hover:border-sunrise-orange/50 transition cursor-pointer";
                card.querySelector('span').innerText = "Unlocked";
                card.querySelector('span').className = "text-xs bg-green-900/20 text-green-400 px-2 py-1 rounded";
                card.querySelector('button').disabled = false;
                card.querySelector('button').className = "text-sunrise-orange font-bold hover:underline";
                card.querySelector('button').innerText = i === 0 ? "Run Sync Check →" : "Open Forensic Engine →";
            });
            xrayCard.querySelector('button').onclick = () => location.hash = '/xray';
        }
    }

    function updateXrayAccess() {
        const { tier } = currentOrder;
        const paywall = document.getElementById('xray-paywall');
        const content = document.getElementById('xray-content');
        const credits = document.getElementById('xray-credits');

        if (tier === 'elite') {
            paywall.classList.add('hidden');
            content.classList.remove('hidden');
            credits.classList.remove('hidden');
            document.getElementById('credit-count').innerText = "Unlimited";
        } else {
            paywall.classList.remove('hidden');
            content.classList.add('hidden');
            credits.classList.add('hidden');
        }
    }

    // --- INIT ---
    const savedAuth = localStorage.getItem('apt_skola_auth');
    if (savedAuth) currentOrder = JSON.parse(savedAuth);

    window.addEventListener('hashchange', router);
    router();
});
