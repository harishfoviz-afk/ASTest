const fs = require('fs');

let content = fs.readFileSync('script.js', 'utf8');

// The main issue is likely the unblockCoveringElements logic and the hidden/active classes conflict.
// Also, selectPackage had a guard that blocked starting before currentPhase < 1, but Phase 0 is currentPhase 0.

// 1. Fix selectPackage guard: it should allow Phase 0
content = content.replace(
    'if (window.currentPhase < 1 && !isSyncMatchMode) {',
    'if (window.currentPhase === undefined && !isSyncMatchMode) {'
);

// 2. Add some debug logs to triggerStart in hero-components.jsx and initializeQuizShell in script.js
// Wait, I'll do it in script.js first.

const initQuizShellPattern = /function initializeQuizShell\(index, phase = 0\) \{/g;
content = content.replace(initQuizShellPattern, 'function initializeQuizShell(index, phase = 0) {\n    console.log("initializeQuizShell called with index:", index, "phase:", phase);');

// 3. Fix unblockCoveringElements to be less aggressive during development or just fix it properly.
// It seems it might be blocking the React root if it's not careful.
// I already added `if (id === 'react-hero-root') return;` but maybe it's the class?
// Let's ensure 'unstoppable-cta' and others are not blocked.

const unblockLoopStart = "all.forEach(el => {";
const unblockLoopFix = `all.forEach(el => {
                if (el.closest('#react-hero-root')) return;`;
content = content.replace(unblockLoopStart, unblockLoopFix);

// 4. Ensure selectPackage is actually reachable.
// The pricing buttons in the modal might be blocked by the modal itself if pointer-events are mess up.

fs.writeFileSync('script.js', content);
console.log('script.js fixed successfully');
