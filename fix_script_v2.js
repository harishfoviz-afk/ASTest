const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

// Fix the broken initializeQuizShell function
const startSearch = 'function initializeQuizShell(index, phase = 0) {';
const endSearch = 'function renderQuestionContent(index) {';

const startIndex = content.indexOf(startSearch);
const endIndex = content.indexOf(endSearch);

if (startIndex !== -1 && endIndex !== -1) {
    const newInitializeQuizShell = `function initializeQuizShell(index, phase = 0) {
    window.currentPhase = phase;
    const questionPages = document.getElementById('questionPages');
    if (!questionPages) return;
    
    // Hide landing elements and flow containers
    const landing = document.getElementById('landingPage');
    if (landing) {
        landing.classList.remove('active');
        landing.classList.add('hidden');
    }
    
    const elementsToHide = [
        'pricingModal', 'testimonials', 'educatorPartner', 
        'contact-and-policies', 'mainFooter'
    ];
    elementsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.remove('active');
    });

    const containers = document.querySelectorAll('.flow-container');
    containers.forEach(c => c.classList.remove('active'));
    
    const shellHtml = \`
        <div id="questionPageApp" class="question-page active">
            \${getIntermediateHeaderHtml()}
            <div class="question-content-wrapper"><div id="dynamicQuizContent" class="question-container"></div></div>
            \${getIntermediateFooterHtml()}
        </div>\`;
    questionPages.innerHTML = shellHtml;
    renderQuestionContent(index);
}

`;
    content = content.substring(0, startIndex) + newInitializeQuizShell + content.substring(endIndex);
}

// Ensure goToLandingPage correctly resets everything
const goToLandingPattern = /function goToLandingPage\(\) \{[\s\S]*?window\.scrollTo\( \{ top: 0, behavior: 'smooth' \} \);/g;
const newGoToLandingPage = `function goToLandingPage() {
    currentQuestion = 0;
    answers = {};
    const form = document.getElementById('customerForm');
    if(form) form.reset();
    
    // Show landing elements
    const landing = document.getElementById('landingPage');
    if (landing) {
        landing.classList.remove('hidden');
        landing.classList.add('active');
    }
    
    const elementsToShow = [
        'testimonials', 'educatorPartner', 'contact-and-policies', 'mainFooter'
    ];
    elementsToShow.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('hidden');
            el.classList.add('active');
        }
    });

    // Hide app pages
    const idsToHide = [
        'detailsPage', 'paymentPageContainer', 'successPage', 
        'syncMatchGate', 'syncMatchTransition', 'pricingModal',
        'questionPageApp', 'psychometricHistogram', 'dynamicRiskCard', 'dnaFinalization'
    ];
    idsToHide.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.classList.remove('active');
            el.classList.add('hidden');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });`;
// Wait, I missed the closing brace in the replacement string
content = content.replace(goToLandingPattern, newGoToLandingPage + "\n}");

fs.writeFileSync('script.js', content);
console.log('script.js fixed successfully');
