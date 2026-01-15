const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

// The issue is likely that window.currentPhase is initialized to 0, 
// and selectPackage checks for window.currentPhase === undefined.
// But window.currentPhase IS 0, so it's NOT undefined.
// However, the guard logic was: "check if (window.currentPhase < 1 && !isSyncMatchMode) then alert the user to finish the assessment first."
// This means if it's Phase 0 (currentPhase === 0), it should BLOCKED.
// BUT, the user wants to start the assessment FROM THE HERO.
// The Hero calls initializeQuizShell(0), which sets currentPhase to 0.

// Let's re-read the requirement:
// "Update selectPackage to check if (window.currentPhase < 1 && !isSyncMatchMode) then alert the user to finish the assessment first."
// This implies selectPackage (which is for the Pricing Modal) should ONLY work if Phase 1 is done.
// But Phase 1 ends with showDetailsPage(), which then leads to showDnaFinalization(), which then leads to Pricing Modal.
// At that point, Phase 1 is done.

// So, window.currentPhase should be updated to 2 (or something else) when Phase 1 is finished.
// Currently:
/*
function renderQuestionContent(index) {
    ...
    if (index >= totalQ) {
        if (window.currentPhase === 0) {
            showPsychometricHistogram();
        } else if (window.currentPhase === 1) {
            showDetailsPage();
        } ...
    }
}
*/

// When showDetailsPage is called, currentPhase is still 1.
// When the form is submitted, showDnaFinalization is called.
// When showDnaFinalization finishes, it shows pricingModal.

// If I want selectPackage to work, I should make sure currentPhase >= 1.
// If Phase 0 is active, currentPhase is 0. 0 < 1 is TRUE. So it alerts. Correct.

// The REAL issue might be that the buttons are not responding at all (no alert, no modal).
// This usually means an event listener issue or a blocking element.

// Let's check the unblockCoveringElements again.
// It searches for elements that cover > 90% of screen with z-index >= 50.
// If it finds one, it sets pointer-events to 'none' UNLESS it's an active modal.

// Let's disable unblockCoveringElements for a moment to see if it fixes things,
// or better, make it logged more clearly.

content = content.replace('if (window.currentPhase === undefined && !isSyncMatchMode) {', 'if (window.currentPhase < 1 && !isSyncMatchMode) {');

// Fix unblockCoveringElements to NOT block anything by default if it's not sure.
// Actually, let's just make it NOT run for now or be extremely conservative.

const unblockAll = `            if (candidates.length > 0) {
                console.warn('Blocking elements detected:', candidates.map(c => ({id: c.id, class: c.className, z: c.z})));
                candidates.forEach(c => {`;
const unblockAllFix = `            if (candidates.length > 0) {
                console.warn('Blocking elements detected:', candidates.map(c => ({id: c.id, class: c.className, z: c.z})));
                // Only block if it is NOT one of our known interactive containers
                candidates.forEach(c => {
                    if (c.id === 'react-hero-root' || c.id === 'landingPage' || c.id === 'questionPages') return;`;
content = content.replace(unblockAll, unblockAllFix);

// Also, let's make sure the CTA in the hero works.
// The hero-components.jsx uses:
/*
  useEffect(() => {
    const handleGlobalClick = (e) => {
      const target = e.target;
      if (!target) return;
      const isCtaClick = target.closest('.unstoppable-cta');
      if (isCtaClick) {
        console.log("Global Unstoppable Catch: Targeted CTA Clicked");
        triggerStart(0);
      }
    };
    window.addEventListener('click', handleGlobalClick, true);
    return () => window.removeEventListener('click', handleGlobalClick, true);
  }, []);
*/
// It uses capture phase (true).

fs.writeFileSync('script.js', content);
console.log('script.js fixed successfully');
