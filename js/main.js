/* ============================================
   CodeCite Enhanced JavaScript - Complete
   ============================================ */

let currentScene = 0;
let narratingScene = -1;
let isPaused = false;
let narrationEnabled = true;
let speechRate = 1;
let speechSynth = window.speechSynthesis;
let selectedVoice = null;
let availableVoices = [];
let isNarrating = false;

// Simulator state
let simStep = 0;
let simPlaying = false;
let simInterval = null;
let simSpeed = 1;

// Graph animation state
let graphAnimating = false;
let graphStep = 0;

const scenes = document.querySelectorAll('.scene');
const totalScenes = scenes.length;

// 90 Questions Database
const questionDatabase = {
    routing: [
        { id: 'rq-routing-1', text: 'Where are HTTP method checks handled before routing?' },
        { id: 'rq-routing-2', text: 'Show the exact lines that construct a trailing-slash canonical redirect.' },
        { id: 'rq-routing-3', text: 'How does Flask match URL patterns to view functions?' },
        { id: 'rq-routing-4', text: 'Where is the URL rule compiled into a regex pattern?' },
        { id: 'rq-routing-5', text: 'How does Flask handle route parameters with converters?' },
        { id: 'rq-routing-6', text: 'Show where endpoint names are resolved to view functions.' },
        { id: 'rq-routing-7', text: 'How does Flask handle duplicate route registrations?' },
        { id: 'rq-routing-8', text: 'Where is the request dispatching logic implemented?' },
        { id: 'rq-routing-9', text: 'How does Flask build URLs with url_for()?' },
        { id: 'rq-routing-10', text: 'Show the code that handles HTTP method override.' },
        { id: 'rq-routing-11', text: 'Where does Flask store registered URL rules?' },
        { id: 'rq-routing-12', text: 'How does Flask handle subdomain routing?' },
        { id: 'rq-routing-13', text: 'Show the route decorator implementation.' },
        { id: 'rq-routing-14', text: 'How does Flask handle static file routing?' },
        { id: 'rq-routing-15', text: 'Show blueprint URL prefix handling code.' },
        { id: 'rq-routing-16', text: 'Where is the default route converter defined?' },
        { id: 'rq-routing-17', text: 'How does Flask handle route wildcards?' },
        { id: 'rq-routing-18', text: 'Show the code for route priority ordering.' }
    ],
    auth: [
        { id: 'rq-auth-1', text: 'Where is authentication enforced before request dispatch?' },
        { id: 'rq-auth-2', text: 'How does Flask create and sign session cookies?' },
        { id: 'rq-auth-3', text: 'Show the session interface implementation.' },
        { id: 'rq-auth-4', text: 'Where is the secret key used for signing?' },
        { id: 'rq-auth-5', text: 'How does Flask validate session cookies?' },
        { id: 'rq-auth-6', text: 'Show the secure cookie serialization code.' },
        { id: 'rq-auth-7', text: 'Where is session expiration handled?' },
        { id: 'rq-auth-8', text: 'How does Flask handle CSRF protection?' },
        { id: 'rq-auth-9', text: 'Show the code for session modification detection.' },
        { id: 'rq-auth-10', text: 'Where is the session cookie name configured?' },
        { id: 'rq-auth-11', text: 'How does Flask handle permanent sessions?' },
        { id: 'rq-auth-12', text: 'Show the before_request authentication hook.' },
        { id: 'rq-auth-13', text: 'Where is login_required typically implemented?' },
        { id: 'rq-auth-14', text: 'How does Flask handle session regeneration?' },
        { id: 'rq-auth-15', text: 'Show the code for HttpOnly cookie setting.' },
        { id: 'rq-auth-16', text: 'Where is secure cookie flag enforced?' }
    ],
    context: [
        { id: 'rq-ctx-1', text: 'How does Flask manage application context across requests?' },
        { id: 'rq-ctx-2', text: 'Show the exact lines where request context is created.' },
        { id: 'rq-ctx-3', text: 'Where is the g object initialized?' },
        { id: 'rq-ctx-4', text: 'How does Flask handle nested application contexts?' },
        { id: 'rq-ctx-5', text: 'Show the context local storage implementation.' },
        { id: 'rq-ctx-6', text: 'Where is current_app proxy resolved?' },
        { id: 'rq-ctx-7', text: 'How does Flask clean up context after request?' },
        { id: 'rq-ctx-8', text: 'Show the exact lines where app context is pushed.' },
        { id: 'rq-ctx-9', text: 'Where is the request context stack maintained?' },
        { id: 'rq-ctx-10', text: 'How does Flask handle context in background tasks?' },
        { id: 'rq-ctx-11', text: 'Show the teardown_appcontext implementation.' },
        { id: 'rq-ctx-12', text: 'Where is flask.request proxy defined?' },
        { id: 'rq-ctx-13', text: 'How does Flask copy request context?' },
        { id: 'rq-ctx-14', text: 'Show the LocalStack implementation.' },
        { id: 'rq-ctx-15', text: 'Where is context preserved for debugging?' },
        { id: 'rq-ctx-16', text: 'How does Flask handle app context in CLI?' },
        { id: 'rq-ctx-17', text: 'Show the with app.app_context() implementation.' },
        { id: 'rq-ctx-18', text: 'Where is test request context created?' },
        { id: 'rq-ctx-19', text: 'How does Flask handle multiple apps?' },
        { id: 'rq-ctx-20', text: 'Show the context variable binding code.' }
    ],
    templates: [
        { id: 'rq-tmpl-1', text: 'Where does Flask integrate with Jinja2 for template rendering?' },
        { id: 'rq-tmpl-2', text: 'Show the render_template implementation.' },
        { id: 'rq-tmpl-3', text: 'Where does Flask integrate with Jinja2 environment?' },
        { id: 'rq-tmpl-4', text: 'How does Flask configure template auto-escaping?' },
        { id: 'rq-tmpl-5', text: 'Show the template loader configuration.' },
        { id: 'rq-tmpl-6', text: 'Where are template globals defined?' },
        { id: 'rq-tmpl-7', text: 'How does Flask handle template inheritance?' },
        { id: 'rq-tmpl-8', text: 'Show the custom filter registration code.' },
        { id: 'rq-tmpl-9', text: 'Where is the template folder path resolved?' },
        { id: 'rq-tmpl-10', text: 'How does Flask handle template caching?' },
        { id: 'rq-tmpl-11', text: 'Show the render_template_string implementation.' },
        { id: 'rq-tmpl-12', text: 'Where are context processors applied?' },
        { id: 'rq-tmpl-13', text: 'How does Flask handle template not found errors?' },
        { id: 'rq-tmpl-14', text: 'Show the blueprint template folder handling.' },
        { id: 'rq-tmpl-15', text: 'Where is Markup class used for safe strings?' },
        { id: 'rq-tmpl-16', text: 'How does Flask inject request into templates?' }
    ],
    error: [
        { id: 'rq-err-1', text: 'Show the error handling mechanism in Flask dispatch.' },
        { id: 'rq-err-2', text: 'Where is the 500 error page rendered?' },
        { id: 'rq-err-3', text: 'How does Flask handle uncaught exceptions?' },
        { id: 'rq-err-4', text: 'Show the errorhandler decorator implementation.' },
        { id: 'rq-err-5', text: 'Where is HTTPException converted to response?' },
        { id: 'rq-err-6', text: 'How does Flask handle abort() function?' },
        { id: 'rq-err-7', text: 'Show the werkzeug exception integration.' },
        { id: 'rq-err-8', text: 'Where is error logging configured?' },
        { id: 'rq-err-9', text: 'How does Flask handle validation errors?' },
        { id: 'rq-err-10', text: 'Show the custom exception handler registration.' },
        { id: 'rq-err-11', text: 'Where is the debug error page generated?' },
        { id: 'rq-err-12', text: 'How are 404 errors converted to responses?' },
        { id: 'rq-err-13', text: 'Show the propagate_exceptions configuration.' },
        { id: 'rq-err-14', text: 'Where is TRAP_HTTP_EXCEPTIONS used?' },
        { id: 'rq-err-15', text: 'How does Flask handle JSON error responses?' },
        { id: 'rq-err-16', text: 'Show the app_errorhandler for blueprints.' },
        { id: 'rq-err-17', text: 'Where is exception info stored for debugging?' },
        { id: 'rq-err-18', text: 'How does Flask handle teardown on error?' },
        { id: 'rq-err-19', text: 'Show the make_response error handling.' },
        { id: 'rq-err-20', text: 'Where is the error response finalized?' }
    ]
};

// Speech Scripts for each scene
const speechScripts = {
    0: { text: "Welcome to CodeCite, a citation-grounded RAG system for verifiable code comprehension. As the AI representative speaking on behalf of author Jahidul Arafat, I present this research. Jahidul is a Presidential and Woltosz Graduate Research Fellow at Auburn University, formerly a Senior Cloud Architect at Oracle and Principal System Analyst at bKash. This work achieves 92% citation accuracy with zero hallucinations. Source code is available on GitHub.", terms: [] },
    1: { text: "Our research addresses LLM hallucinations through three consolidated research questions. RQ1 examines retrieval strategy. RQ2 investigates context selection. RQ3 evaluates 10 LLM models on citation-grounded tasks.", terms: [] },
    2: { text: "We present four key innovations: citation-grounded generation ensuring every claim cites source code, graph-augmented RAG for cross-file discovery, submodular packing for diversity-aware selection, and automated verification to eliminate hallucinations.", terms: [] },
    3: { text: "Let's review key terminologies. RAG means Retrieval-Augmented Generation. BM25 is probabilistic ranking for keyword search. Dense retrieval uses neural embeddings. Hybrid combines both approaches. RM3 expands queries using relevance feedback.", terms: [] },
    4: { text: "CodeCite combines citation, code, and RAG. Every response must include verifiable citations in the format file.py colon start-end. This 6-stage pipeline processes queries from input through retrieval, expansion, reranking, packing, and verified generation.", terms: [] },
    5: { text: "Core retrieval concepts include BM25 for lexical matching, CodeBERT for semantic similarity, FAISS for fast vector search, and hybrid fusion combining sparse and dense with tunable weights. Optimal weights are alpha 0.3 and beta 0.7.", terms: [] },
    6: { text: "Advanced techniques include RM3 query expansion which adds 18% recall by extracting terms from top results, and cross-encoder reranking which adds 12% precision but doubles latency.", terms: [] },
    7: { text: "The core problem: LLMs hallucinate file paths and line numbers. Without verification, 30% of bugs come from hallucinated code and 45% of developers lost trust. CodeCite achieves 92.4% accuracy with zero hallucinations.", terms: [] },
    8: { text: "The mathematical formulation includes three key equations. Hybrid score fusion combines sparse and dense. Graph-augmented scoring adds bonus for related files. Submodular packing maximizes relevance and coverage while minimizing redundancy.", terms: [] },
    9: { text: "Our search space reduction transforms 2.4 million chunks to just 8 optimal chunks. Hybrid removes 85%, graph expansion adds 31% relevant content, reranking selects top 100, and submodular packing fits within 12K characters.", terms: [] },
    10: { text: "The Neo4j code dependency graph enables cross-file reasoning with 24 nodes showing Flask's structure. Starting from routing.py as query seed, we walk 2 hops discovering app.py, wrappers, blueprints, and their dependencies.", terms: [] },
    11: { text: "The 6-stage architecture processes queries through hybrid retrieval adding 23%, graph expansion adding 31%, cross-encoder reranking adding 12%, submodular packing adding 15%, and finally LLM generation with verification achieving 92.4% accuracy.", terms: [] },
    12: { text: "Research Question 1 asks what retrieval configuration maximizes citation accuracy. Hybrid with alpha 0.3 outperforms sparse by 23%. RM3 adds 18% recall. Reranking adds 12% precision with 2x latency.", terms: [] },
    13: { text: "Here are the commands for RQ1 experiments. Use cc_cli.py for interactive queries and run_experiment.py for batch experiments across 500 repositories.", terms: [] },
    14: { text: "Research Question 2 examines graph expansion and packing impact. Results broken down by question category show Context questions benefit most with 24.3% improvement. Graph adds 31% coverage, submodular adds 15% over greedy.", terms: [] },
    15: { text: "Here are the commands for graph and packing experiments comparing with and without graph expansion, and greedy versus submodular packing.", terms: [] },
    16: { text: "Research Question 3 compares 10 LLMs across 5 question categories. Llama 3.1 8B achieves best overall at 94.2%. All models score highest on routing questions. 8B models achieve 85% quality at 5x speed.", terms: [] },
    17: { text: "Here are the commands for LLM evaluation including per-category analysis.", terms: [] },
    18: { text: "Our evaluation suite contains 90 questions across 5 categories: 18 routing, 16 authentication, 20 context, 16 templates, and 20 error handling. Click any category to view all questions.", terms: [] },
    19: { text: "Optimal hyperparameters from grid search: alpha 0.3, beta 0.7, 28 candidates, 2 hop depth, 0.6 decay, submodular packing, and 12K character budget.", terms: [] },
    20: { text: "The technology stack includes FAISS and BM25 for retrieval, Neo4j and tree-sitter for graphs, LM Studio for local LLM inference, and pandas for analysis.", terms: [] },
    21: { text: "Full pipeline results: 92.4% citation accuracy, 87.8% verification rate, zero hallucinations, 89.1% cross-file coverage, 4.2 seconds latency, tested on 500+ repositories with 10 LLMs.", terms: [] },
    22: { text: "CLI commands include index for parsing, embed for generating embeddings, faiss-build for indexing, graph-load for Neo4j import, and ask for querying with citations.", terms: [] },
    23: { text: "Try the interactive demo to see CodeCite in action processing a sample query about Flask routing.", terms: [] },
    24: { text: "Troubleshooting common issues: add verify-citations flag for missing citations, set graph timeout for hanging queries, increase LLM timeout or run Neo4j start.", terms: [] },
    25: { text: "Frequently asked questions 1 through 10 covering alpha optimization, verification process, Neo4j benefits, and graph hop optimization.", terms: [] },
    26: { text: "FAQ 11 through 20 covering embeddings, chunk size, private repos, API compatibility, and submodular benefits.", terms: [] },
    27: { text: "FAQ 21 through 30 covering limitations, multi-language support, documentation handling, code evolution, and licensing.", terms: [] },
    28: { text: "In conclusion, CodeCite achieves 92.4% citation accuracy with zero hallucinations. Grounded responses aren't just helpful, they're trustworthy. Thank you for your attention. Questions?", terms: [] }
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initSceneNav();
    initVoiceSelector();
    updateProgress();
    setTimeout(initCharts, 500);
    setTimeout(initMath, 300);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextScene(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevScene(); }
        else if (e.key === 'p' || e.key === 'P') { togglePause(); }
        else if (e.key === 'n' || e.key === 'N') { toggleNarration(); }
        else if (e.key === 'r' || e.key === 'R') { resyncNarration(); }
        else if (e.key === 'Escape') { closeSimulator(); closeQuestionModal(); }
    });
});

function initMath() {
    if (typeof katex !== 'undefined') {
        try {
            katex.render("S(q,d) = \\alpha \\cdot BM25(q,d) + \\beta \\cdot Dense(q,d)", document.getElementById('math1'));
            katex.render("S_g(d) = S(q,d) + \\gamma \\cdot decay^h", document.getElementById('math2'));
            katex.render("F(S) = \\sum rel_i + \\lambda \\cdot cov(S) - \\mu \\cdot red(S)", document.getElementById('math3'));
        } catch(e) { console.log('KaTeX not loaded'); }
    }
}

function initVoiceSelector() {
    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
}

function loadVoices() {
    availableVoices = speechSynth.getVoices().filter(v => v.lang.startsWith('en'));
    const selector = document.getElementById('voiceSelector');
    if (!selector || availableVoices.length === 0) return;
    selector.innerHTML = availableVoices.map((v, i) => 
        `<option value="${v.name}" ${v.name.includes('Daniel') || v.name.includes('Google') || i === 0 ? 'selected' : ''}>${v.name.substring(0, 18)}</option>`
    ).join('');
    selectedVoice = availableVoices.find(v => v.name === selector.value) || availableVoices[0];
}

function selectVoice(voiceName) {
    selectedVoice = availableVoices.find(v => v.name === voiceName);
    if (isNarrating) resyncNarration();
}

function initSceneNav() {
    const nav = document.getElementById('sceneNav');
    nav.innerHTML = '';
    for (let i = 0; i < totalScenes; i++) {
        const dot = document.createElement('div');
        dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToScene(i);
        dot.title = scenes[i].dataset.title || `Scene ${i}`;
        nav.appendChild(dot);
    }
}

function goToScene(index) {
    if (index < 0 || index >= totalScenes) return;
    stopNarration();
    scenes[currentScene].classList.remove('active');
    currentScene = index;
    scenes[currentScene].classList.add('active');
    updateProgress();
    updateNavDots();
    if (narrationEnabled && !isPaused) setTimeout(() => narrateScene(currentScene), 500);
}

function nextScene() {
    if (currentScene < totalScenes - 1) goToScene(currentScene + 1);
}

function prevScene() {
    if (currentScene > 0) goToScene(currentScene - 1);
}

function updateProgress() {
    const progress = ((currentScene + 1) / totalScenes) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
}

function updateNavDots() {
    document.querySelectorAll('.nav-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentScene);
    });
}

// Narration
function narrateScene(sceneIndex) {
    if (!narrationEnabled || isPaused) return;
    const script = speechScripts[sceneIndex];
    if (!script) return;
    
    stopNarration();
    narratingScene = sceneIndex;
    isNarrating = true;
    
    const utterance = new SpeechSynthesisUtterance(script.text);
    utterance.voice = selectedVoice;
    utterance.rate = speechRate;
    utterance.onend = () => { isNarrating = false; updateNarrationIndicator(); };
    utterance.onerror = () => { isNarrating = false; };
    
    speechSynth.speak(utterance);
    updateNarrationIndicator();
}

function stopNarration() {
    speechSynth.cancel();
    isNarrating = false;
    updateNarrationIndicator();
}

function toggleNarration() {
    narrationEnabled = !narrationEnabled;
    const btn = document.getElementById('toggleNarration');
    btn.textContent = narrationEnabled ? '🔊' : '🔇';
    if (!narrationEnabled) stopNarration();
    else if (!isPaused) narrateScene(currentScene);
}

function togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('pauseBtn');
    btn.textContent = isPaused ? '▶ Resume' : '⏸ Pause';
    if (isPaused) stopNarration();
    else if (narrationEnabled) narrateScene(currentScene);
}

function resyncNarration() {
    stopNarration();
    if (narrationEnabled && !isPaused) narrateScene(currentScene);
}

function updateSpeechRate() {
    speechRate = parseFloat(document.getElementById('speechRate').value);
    document.getElementById('rateValue').textContent = speechRate + '×';
}

function updateNarrationIndicator() {
    const sceneNum = document.getElementById('narratingSceneNum');
    const sceneTitle = document.getElementById('narratingSceneTitle');
    if (isNarrating && narratingScene >= 0) {
        sceneNum.textContent = narratingScene;
        sceneTitle.textContent = scenes[narratingScene]?.dataset.title || 'Speaking';
    } else {
        sceneNum.textContent = '--';
        sceneTitle.textContent = 'Ready';
    }
}

// Panel Controls
function togglePanelSettings() {
    document.getElementById('panelSettingsDropdown').classList.toggle('hidden');
}

function toggleGlobalNotes() {
    const panel = document.getElementById('handwrittenPanel');
    const toggle = document.getElementById('globalNotesToggle');
    const status = document.getElementById('notesStatus');
    panel.classList.toggle('hidden', !toggle.checked);
    status.textContent = toggle.checked ? 'ON' : 'OFF';
    status.className = 'setting-status ' + (toggle.checked ? 'on' : 'off');
}

function toggleGlobalInsights() {
    const panel = document.getElementById('insightsPanel');
    const toggle = document.getElementById('globalInsightsToggle');
    const status = document.getElementById('insightsStatus');
    panel.classList.toggle('hidden', !toggle.checked);
    status.textContent = toggle.checked ? 'ON' : 'OFF';
    status.className = 'setting-status ' + (toggle.checked ? 'on' : 'off');
}

function enableAllPanels() {
    document.getElementById('globalNotesToggle').checked = true;
    document.getElementById('globalInsightsToggle').checked = true;
    toggleGlobalNotes();
    toggleGlobalInsights();
}

function disableAllPanels() {
    document.getElementById('globalNotesToggle').checked = false;
    document.getElementById('globalInsightsToggle').checked = false;
    toggleGlobalNotes();
    toggleGlobalInsights();
}

function clearNotes() {
    document.getElementById('notesContent').innerHTML = '';
}

// Simulator
function openSimulator() {
    document.getElementById('simulatorFullscreen').classList.add('active');
    resetSimulation();
}

function closeSimulator() {
    document.getElementById('simulatorFullscreen').classList.remove('active');
    if (simInterval) clearInterval(simInterval);
    simPlaying = false;
}

const simSteps = [
    { name: 'Start', desc: 'Full corpus ready', size: '2.4M', reduction: '0%', accuracy: '+0%', eliminated: '0' },
    { name: 'Hybrid Retrieval', desc: 'BM25 + Dense fusion (α=0.3)', size: '360K', reduction: '85%', accuracy: '+23%', eliminated: '2,040,000' },
    { name: 'Graph Expansion', desc: '2-hop Neo4j walks', size: '470K', reduction: '80%', accuracy: '+31%', eliminated: '1,930,000' },
    { name: 'Reranking', desc: 'Cross-encoder top-100', size: '100', reduction: '99.99%', accuracy: '+12%', eliminated: '2,399,900' },
    { name: 'Submodular Pack', desc: 'Diversity-aware selection', size: '8', reduction: '99.9997%', accuracy: '+15%', eliminated: '2,399,992' }
];

function updateSimDisplay() {
    const step = simSteps[simStep];
    document.getElementById('currentStepNum').textContent = simStep;
    document.getElementById('currentStepName').textContent = step.name;
    document.getElementById('currentStepDesc').textContent = step.desc;
    document.getElementById('metricSize').textContent = step.size;
    document.getElementById('metricReduction').textContent = step.reduction;
    document.getElementById('metricAccuracy').textContent = step.accuracy;
    document.getElementById('metricEliminated').textContent = step.eliminated;
    document.getElementById('statValid').textContent = step.size;
    document.getElementById('statEliminated').textContent = step.eliminated;
    
    const accuracies = ['71.2%', '84.3%', '89.1%', '90.2%', '92.4%'];
    document.getElementById('statAccuracy').textContent = accuracies[simStep];
    document.getElementById('simFinalStat').textContent = simStep === 4 ? '8' : '--';
    
    for (let i = 0; i <= 4; i++) {
        const pipe = document.getElementById('pipe' + i);
        pipe.classList.remove('active', 'done');
        if (i < simStep) pipe.classList.add('done');
        else if (i === simStep) pipe.classList.add('active');
    }
    
    // Animate SVG circles
    const elements = ['circHybrid', 'circGraph', 'circRerank', 'circValid', 'resultArrow'];
    const labels = ['labelHybrid', 'labelGraph', 'labelRerank', 'labelValid'];
    elements.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = simStep > i ? '1' : '0';
    });
    labels.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = simStep > i ? '1' : '0';
    });
}

function stepSimulation() {
    if (simStep < 4) {
        simStep++;
        updateSimDisplay();
    }
}

function playSimulation() {
    if (simPlaying) {
        clearInterval(simInterval);
        simPlaying = false;
        document.getElementById('simPlayBtn').textContent = '▶ Play';
        return;
    }
    simPlaying = true;
    document.getElementById('simPlayBtn').textContent = '⏸ Pause';
    simInterval = setInterval(() => {
        if (simStep < 4) {
            simStep++;
            updateSimDisplay();
        } else {
            clearInterval(simInterval);
            simPlaying = false;
            document.getElementById('simPlayBtn').textContent = '▶ Play';
        }
    }, 1500 / simSpeed);
}

function resetSimulation() {
    if (simInterval) clearInterval(simInterval);
    simPlaying = false;
    simStep = 0;
    document.getElementById('simPlayBtn').textContent = '▶ Play';
    updateSimDisplay();
}

function updateSimSpeed() {
    simSpeed = parseFloat(document.getElementById('simSpeedSlider').value);
    document.getElementById('simSpeedValue').textContent = simSpeed + '×';
}

// Graph Animation
function animateGraphWalk() {
    if (graphAnimating) return;
    graphAnimating = true;
    graphStep = 0;
    resetGraph();
    
    const steps = [
        { desc: 'Query seed: routing.py', nodes: 1, edges: 0, coverage: '0%' },
        { desc: 'Hop 0: Discovering direct imports...', nodes: 4, edges: 3, coverage: '12%' },
        { desc: 'Hop 1: Expanding to dependencies...', nodes: 12, edges: 11, coverage: '24%' },
        { desc: 'Hop 2: Final expansion complete!', nodes: 24, edges: 20, coverage: '31%' }
    ];
    
    let step = 0;
    const interval = setInterval(() => {
        if (step >= steps.length) {
            clearInterval(interval);
            graphAnimating = false;
            return;
        }
        
        const s = steps[step];
        document.getElementById('graphStep').textContent = step === 0 ? 'Start' : `Hop ${step - 1} Complete`;
        document.getElementById('graphDesc').textContent = s.desc;
        document.getElementById('nodesDiscovered').textContent = s.nodes;
        document.getElementById('edgesTraversed').textContent = s.edges;
        document.getElementById('coverageGain').textContent = s.coverage;
        
        // Animate nodes by hop level
        if (step === 1) {
            document.querySelectorAll('.hop0-node').forEach(n => n.style.opacity = '1');
            document.querySelectorAll('.edge-group').forEach((e, i) => { if (i < 3) e.classList.add('active'); });
        } else if (step === 2) {
            document.querySelectorAll('.hop1-node').forEach(n => n.style.opacity = '1');
            document.querySelectorAll('.edge-group').forEach((e, i) => { if (i < 11) e.classList.add('active'); });
        } else if (step === 3) {
            document.querySelectorAll('.hop2-node').forEach(n => n.style.opacity = '1');
            document.querySelectorAll('.edge-group').forEach(e => e.classList.add('active'));
        }
        
        step++;
    }, 1200);
}

function resetGraph() {
    document.querySelectorAll('.hop0-node, .hop1-node, .hop2-node').forEach(n => n.style.opacity = '0.3');
    document.querySelectorAll('.seed-node').forEach(n => n.style.opacity = '1');
    document.querySelectorAll('.edge-group').forEach(e => e.classList.remove('active'));
    document.querySelectorAll('.graph-edge').forEach(e => e.classList.remove('active'));
    document.getElementById('graphStep').textContent = 'Ready';
    document.getElementById('graphDesc').textContent = 'Click "Animate 2-Hop Walk" to see graph expansion';
    document.getElementById('nodesDiscovered').textContent = '1';
    document.getElementById('edgesTraversed').textContent = '0';
    document.getElementById('coverageGain').textContent = '0%';
}

// Question Modal
function showQuestionCategory(category) {
    const questions = questionDatabase[category];
    if (!questions) return;
    
    const titles = {
        routing: '🔀 Routing Questions (18)',
        auth: '🔐 Authentication Questions (16)',
        context: '📦 Context Questions (20)',
        templates: '🎨 Template Questions (16)',
        error: '⚠️ Error Handling Questions (20)'
    };
    
    document.getElementById('modalTitle').textContent = titles[category];
    document.getElementById('modalQuestions').innerHTML = questions.map(q => 
        `<div class="modal-question"><span class="q-id">${q.id}</span><span class="q-text">${q.text}</span></div>`
    ).join('');
    document.getElementById('questionModal').classList.remove('hidden');
}

function closeQuestionModal() {
    document.getElementById('questionModal').classList.add('hidden');
}

// Demo
function runDemo() {
    const output = document.getElementById('demoOutput');
    output.innerHTML = '<p style="color:var(--rq3);">⏳ Processing query...</p>';
    
    setTimeout(() => {
        output.innerHTML = `
            <p style="color:var(--primary-light);margin-bottom:10px;"><strong>Stage 1-5:</strong> Retrieving and ranking...</p>
            <div style="width:60%;height:4px;background:var(--primary);border-radius:2px;margin-bottom:15px;"></div>
        `;
    }, 500);
    
    setTimeout(() => {
        output.innerHTML = `
            <p style="color:#6ee7b7;margin-bottom:15px;"><strong>✓ Response Generated</strong></p>
            <p style="margin-bottom:15px;">Flask handles HTTP routing through the <code>dispatch_request()</code> method which matches incoming URLs to registered view functions using Werkzeug's URL map.</p>
            <div style="background:rgba(16,185,129,0.1);padding:15px;border-radius:10px;border-left:3px solid #10b981;">
                <strong style="color:#6ee7b7;">CITATION:</strong> <code>[flask/app.py:829-862]</code>
                <p style="font-size:0.85rem;color:var(--text-muted);margin-top:8px;">✓ File exists ✓ Lines valid ✓ Content relevant</p>
            </div>
        `;
    }, 2000);
}

// BibTeX Copy
function copyBibtex() {
    const bibtex = document.getElementById('bibtexContent').textContent;
    navigator.clipboard.writeText(bibtex).then(() => {
        const btn = document.querySelector('.copy-btn');
        btn.textContent = '✓ Copied!';
        setTimeout(() => btn.textContent = '📋 Copy BibTeX', 2000);
    });
}

// Charts
function initCharts() {
    // RQ1 Chart
    const rq1Ctx = document.getElementById('rq1Chart');
    if (rq1Ctx) {
        new Chart(rq1Ctx, {
            type: 'bar',
            data: {
                labels: ['Sparse', 'Dense', 'Hybrid', '+RM3', '+Rerank'],
                datasets: [{
                    label: 'Citation Accuracy %',
                    data: [71.2, 76.5, 84.3, 88.1, 90.2],
                    backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(99,102,241,0.7)', 'rgba(16,185,129,0.7)', 'rgba(139,92,246,0.7)'],
                    borderColor: ['#ef4444', '#f59e0b', '#6366f1', '#10b981', '#8b5cf6'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: false, min: 65, max: 95, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
    
    // RQ2 Chart
    const rq2Ctx = document.getElementById('rq2Chart');
    if (rq2Ctx) {
        new Chart(rq2Ctx, {
            type: 'bar',
            data: {
                labels: ['No Graph', '1-Hop', '2-Hop', '2-Hop+Submod'],
                datasets: [{
                    label: 'Cross-File Coverage %',
                    data: [58.2, 71.4, 76.3, 89.1],
                    backgroundColor: ['rgba(239,68,68,0.7)', 'rgba(245,158,11,0.7)', 'rgba(99,102,241,0.7)', 'rgba(16,185,129,0.7)'],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: false, min: 50, max: 95, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
    
    // RQ2 Category Chart
    const rq2CatCtx = document.getElementById('rq2CategoryChart');
    if (rq2CatCtx) {
        new Chart(rq2CatCtx, {
            type: 'bar',
            data: {
                labels: ['Routing', 'Auth', 'Context', 'Templates', 'Error'],
                datasets: [
                    { label: 'No Graph', data: [78.3, 72.5, 68.9, 81.2, 75.6], backgroundColor: 'rgba(239,68,68,0.6)' },
                    { label: '+Graph', data: [89.2, 86.4, 88.7, 90.5, 87.3], backgroundColor: 'rgba(99,102,241,0.6)' },
                    { label: '+Submod', data: [94.1, 91.8, 93.2, 92.8, 91.4], backgroundColor: 'rgba(16,185,129,0.6)' }
                ]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8', boxWidth: 12 } } },
                scales: {
                    y: { beginAtZero: false, min: 60, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
                    x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                }
            }
        });
    }
    
    // LLM Chart
    const llmCtx = document.getElementById('llmChart');
    if (llmCtx) {
        new Chart(llmCtx, {
            type: 'bar',
            data: {
                labels: ['llama-3.1-8b', 'qwen2.5-7b', 'mistral-7b', 'gemma-2-9b', 'phi-3-medium', 'groq-llama-70b', 'yi-1.5-9b', 'mixtral-8x7b', 'hermes2', 'openhermes'],
                datasets: [{
                    label: 'Citation Accuracy %',
                    data: [94.2, 92.8, 91.5, 90.3, 89.7, 88.9, 88.1, 87.4, 86.2, 85.5],
                    backgroundColor: [
                        'rgba(16,185,129,0.8)', 'rgba(99,102,241,0.7)', 'rgba(99,102,241,0.7)', 'rgba(99,102,241,0.7)', 'rgba(99,102,241,0.7)',
                        'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.6)', 'rgba(245,158,11,0.6)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { beginAtZero: false, min: 80, max: 100, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#94a3b8' } },
                    y: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } }
                }
            }
        });
    }
}
/* ============================================
   Additional JavaScript for Enhanced Demo, Eval, FAQ
   ============================================ */

// Demo Questions Data
const demoQuestions = [
    {
        id: 'rq-routing-1',
        question: 'Where are HTTP method checks handled before routing?',
        result: 'pass',
        bm25Time: '97.3 ms',
        denseTime: '475.7 ms',
        packChunks: 7,
        llmTime: '19.40 s',
        answer: 'The logic for handling HTTP exceptions and method checks resides in the `handle_http_exception` function within the `flask/app.py` file. This function is responsible for invoking registered error handlers and returning the exception as a response if no handler is found.',
        citation: '[flask/src/flask/app.py:829-862]',
        verified: true
    },
    {
        id: 'rq-routing-3',
        question: 'In Werkzeug\'s MapAdapter.match, pinpoint where canonical redirect is produced.',
        result: 'fail',
        bm25Time: '39.0 ms',
        denseTime: '82.4 ms',
        packChunks: 6,
        llmTime: '10.33 s',
        answer: 'The canonical redirect is produced in the `MapAdapter.match` function. This function creates a URL adapter for the given request and checks if there\'s a trusted host set.',
        citation: null,
        verified: false,
        error: 'No citation provided in response'
    },
    {
        id: 'rq-auth-1',
        question: 'Where is authentication enforced before request dispatch?',
        result: 'fail',
        bm25Time: '39.3 ms',
        denseTime: '78.3 ms',
        packChunks: 6,
        llmTime: '11.55 s',
        answer: 'Authentication is enforced before request dispatch through various mechanisms. Flask provides a way to register functions to run before each request using `@app.before_request`.',
        citation: null,
        verified: false,
        error: 'No citation provided in response'
    },
    {
        id: 'rq-ctx-1',
        question: 'How does Flask manage application context across requests?',
        result: 'pass',
        bm25Time: '42.1 ms',
        denseTime: '89.2 ms',
        packChunks: 8,
        llmTime: '15.23 s',
        answer: 'Flask manages application context using a stack-based approach in `ctx.py`. The `AppContext` class pushes itself onto the app context stack when entering and pops when exiting.',
        citation: '[flask/src/flask/ctx.py:225-280]',
        verified: true
    },
    {
        id: 'rq-err-1',
        question: 'Show the error handling mechanism in Flask\'s dispatch.',
        result: 'pass',
        bm25Time: '35.7 ms',
        denseTime: '72.8 ms',
        packChunks: 5,
        llmTime: '12.87 s',
        answer: 'Error handling in Flask dispatch uses `handle_exception` method which catches exceptions during request processing and invokes registered error handlers.',
        citation: '[flask/src/flask/app.py:1150-1195]',
        verified: true
    }
];

let currentDemoIndex = 0;

function selectDemoQuestion(index) {
    currentDemoIndex = index;
    const q = demoQuestions[index];
    
    // Update tabs
    document.querySelectorAll('.demo-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });
    
    // Update question display
    document.getElementById('demoQId').textContent = q.id;
    document.getElementById('demoQText').textContent = q.question;
    
    // Reset terminal
    document.getElementById('demoTerminal').innerHTML = '<p class="terminal-prompt">Click "Run Query" to simulate...</p>';
    document.getElementById('demoVerification').innerHTML = '';
    document.getElementById('demoVerification').className = 'demo-verification';
}

function runDemoAnimation() {
    const q = demoQuestions[currentDemoIndex];
    const terminal = document.getElementById('demoTerminal');
    const verification = document.getElementById('demoVerification');
    
    terminal.innerHTML = '';
    verification.innerHTML = '';
    
    const steps = [
        { delay: 0, html: `<div class="terminal-step bm25">[bm25] took ${q.bm25Time}  candidates=28</div>` },
        { delay: 400, html: `<div class="terminal-step dense">[dense] encode+search took ${q.denseTime}  candidates=28</div>` },
        { delay: 800, html: `<div class="terminal-step rank">[rank] mode=hybrid alpha=0.3 beta=0.7</div>` },
        { delay: 1200, html: `<div class="terminal-step pack">[pack] took 1.5 ms  packed=${q.packChunks}  packer=submodular</div>` },
        { delay: 1600, html: `<div class="terminal-step llm">[llm] call took ${q.llmTime}</div>` },
        { delay: 2000, html: `<div class="terminal-answer">
            <div style="color:#6ee7b7;margin-bottom:10px;font-weight:600;">═══ Grounded Answer ═══</div>
            <p>${q.answer}</p>
            ${q.citation ? `<div class="terminal-citation"><strong>CITATION:</strong> ${q.citation}</div>` : '<div style="color:#fca5a5;margin-top:10px;">⚠️ No citation provided</div>'}
        </div>` }
    ];
    
    steps.forEach(step => {
        setTimeout(() => {
            terminal.innerHTML += step.html;
            terminal.scrollTop = terminal.scrollHeight;
        }, step.delay);
    });
    
    setTimeout(() => {
        if (q.verified) {
            verification.className = 'demo-verification pass';
            verification.innerHTML = `
                <div class="verify-header">
                    <span class="verify-icon">✓</span>
                    <span class="verify-title pass">Citation Verification: PASSED</span>
                </div>
                <div class="verify-detail">
                    ✓ File exists &nbsp;|&nbsp; ✓ Lines valid &nbsp;|&nbsp; ✓ Content relevant<br>
                    Cited: ${q.citation}
                </div>
            `;
        } else {
            verification.className = 'demo-verification fail';
            verification.innerHTML = `
                <div class="verify-header">
                    <span class="verify-icon">✗</span>
                    <span class="verify-title fail">Citation Verification: FAILED</span>
                </div>
                <div class="verify-detail">
                    ${q.error || 'Citation could not be verified'}
                </div>
            `;
        }
    }, 2500);
}

// FAQ Tab Functionality
function selectFaqTab(tab) {
    // Update tabs
    document.querySelectorAll('.faq-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show corresponding panel
    document.querySelectorAll('.faq-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('faq-' + tab).classList.add('active');
    
    // Collapse all items
    document.querySelectorAll('.faq-item-new').forEach(item => item.classList.remove('expanded'));
}

function toggleFaqItem(element) {
    // Toggle current item
    element.classList.toggle('expanded');
    
    // Optionally collapse others (accordion behavior)
    // document.querySelectorAll('.faq-item-new').forEach(item => {
    //     if (item !== element) item.classList.remove('expanded');
    // });
}

// Update speech scripts for new scene order
const updatedSpeechScripts = {
    23: { text: "Try CodeCite with multiple query simulations. We show 5 sample questions: some pass citation verification while others fail. This demonstrates real-world behavior where complex queries may not always produce valid citations.", terms: [] },
    24: { text: "The comprehensive evaluation suite tests 90 questions across 5 categories with 3 variants. The animated dashboard shows real-time evaluation simulation. Charts display variant comparison and per-category accuracy. The full pipeline achieves 92.4% citation accuracy with zero hallucinations.", terms: [] },
    25: { text: "Common troubleshooting issues include: no citations requiring verify-citations flag, graph timeouts, LLM timeouts, and Neo4j connection failures.", terms: [] },
    26: { text: "Frequently asked questions are organized by category: Retrieval covers hybrid optimization, Graph covers Neo4j and hop depth, Packing covers submodular selection, LLMs covers model comparison, Verification covers citation checking, and Limitations covers constraints and future work.", terms: [] }
};

// Merge updated scripts
Object.assign(speechScripts, updatedSpeechScripts);

/* ============================================
   Enhanced Evaluation Dashboard JavaScript
   ============================================ */

// Evaluation Data based on paper results
const evalData = {
    categories: {
        routing: { name: 'Routing', questions: 18, score: 94.1 },
        auth: { name: 'Auth', questions: 16, score: 91.8 },
        context: { name: 'Context', questions: 20, score: 93.2 },
        templates: { name: 'Templates', questions: 16, score: 92.8 },
        error: { name: 'Error', questions: 20, score: 91.4 }
    },
    variants: {
        baseline: { citation: 71.2, verify: 65.8, coverage: 58.2, latency: 2.1 },
        hybrid: { citation: 84.3, verify: 79.6, coverage: 71.4, latency: 2.8 },
        graph: { citation: 87.6, verify: 82.9, coverage: 82.7, latency: 3.2 },
        submod: { citation: 89.1, verify: 84.3, coverage: 85.9, latency: 3.5 },
        full: { citation: 92.4, verify: 87.8, coverage: 89.1, latency: 4.2 }
    },
    categoryByVariant: {
        baseline: { routing: 78.3, auth: 72.5, context: 68.9, templates: 81.2, error: 75.6 },
        submod: { routing: 89.2, auth: 86.4, context: 88.7, templates: 90.5, error: 87.3 },
        full: { routing: 94.1, auth: 91.8, context: 93.2, templates: 92.8, error: 91.4 }
    }
};

let evalVariantChart = null;
let evalCategoryRadar = null;
let evalRunning = false;

// Initialize evaluation charts
function initEvalCharts() {
    initEvalVariantChart();
    initEvalCategoryRadar();
    initProgressBars();
}

function initProgressBars() {
    // Set initial progress bar states
    const scores = { routing: 94.1, auth: 91.8, context: 93.2, templates: 92.8, error: 91.4 };
    Object.keys(scores).forEach(cat => {
        const fill = document.getElementById('progFill-' + cat);
        if (fill) {
            fill.style.width = scores[cat] + '%';
        }
    });
}

function initEvalVariantChart() {
    const ctx = document.getElementById('evalVariantChart');
    if (!ctx) return;
    
    if (evalVariantChart) evalVariantChart.destroy();
    
    evalVariantChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Citation Accuracy', 'Verification Rate', 'Cross-File Coverage'],
            datasets: [
                {
                    label: 'Baseline',
                    data: [71.2, 65.8, 58.2],
                    backgroundColor: 'rgba(100,116,139,0.7)',
                    borderColor: '#64748b',
                    borderWidth: 1
                },
                {
                    label: '+Submodular',
                    data: [89.1, 84.3, 85.9],
                    backgroundColor: 'rgba(139,92,246,0.7)',
                    borderColor: '#8b5cf6',
                    borderWidth: 1
                },
                {
                    label: 'Full Pipeline',
                    data: [92.4, 87.8, 89.1],
                    backgroundColor: 'rgba(16,185,129,0.7)',
                    borderColor: '#10b981',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 50,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94a3b8', callback: v => v + '%', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 9 } }
                }
            }
        }
    });
}

function initEvalCategoryRadar() {
    const ctx = document.getElementById('evalCategoryRadar');
    if (!ctx) return;
    
    if (evalCategoryRadar) evalCategoryRadar.destroy();
    
    const variant = document.getElementById('categoryVariantSelect')?.value || 'full';
    const data = evalData.categoryByVariant[variant];
    
    evalCategoryRadar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['🔀 Routing', '🔐 Auth', '📦 Context', '🎨 Templates', '⚠️ Error'],
            datasets: [{
                label: 'Accuracy %',
                data: [data.routing, data.auth, data.context, data.templates, data.error],
                backgroundColor: 'rgba(16,185,129,0.2)',
                borderColor: '#10b981',
                borderWidth: 2,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                r: {
                    beginAtZero: false,
                    min: 60,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    angleLines: { color: 'rgba(255,255,255,0.1)' },
                    pointLabels: { color: '#e2e8f0', font: { size: 10 } },
                    ticks: { display: false }
                }
            }
        }
    });
}

function updateEvalCategoryChart() {
    const variant = document.getElementById('categoryVariantSelect').value;
    const data = evalData.categoryByVariant[variant];
    
    if (evalCategoryRadar) {
        evalCategoryRadar.data.datasets[0].data = [data.routing, data.auth, data.context, data.templates, data.error];
        
        const colors = {
            baseline: { bg: 'rgba(100,116,139,0.2)', border: '#64748b' },
            submod: { bg: 'rgba(139,92,246,0.2)', border: '#8b5cf6' },
            full: { bg: 'rgba(16,185,129,0.2)', border: '#10b981' }
        };
        
        evalCategoryRadar.data.datasets[0].backgroundColor = colors[variant].bg;
        evalCategoryRadar.data.datasets[0].borderColor = colors[variant].border;
        evalCategoryRadar.data.datasets[0].pointBackgroundColor = colors[variant].border;
        evalCategoryRadar.update();
    }
}

// Animated Evaluation Run
function runEvalAnimation() {
    if (evalRunning) return;
    evalRunning = true;
    
    const btn = document.getElementById('evalRunBtn');
    btn.classList.add('running');
    btn.innerHTML = '<span class="btn-icon">⟳</span> Running...';
    
    // Reset progress bars
    ['routing', 'auth', 'context', 'templates', 'error'].forEach(cat => {
        const fill = document.getElementById('progFill-' + cat);
        const score = document.getElementById('progScore-' + cat);
        const prog = document.getElementById('prog-' + cat);
        if (fill) fill.style.width = '0%';
        if (score) { score.textContent = '--'; score.className = 'prog-score'; }
        if (prog) prog.className = 'progress-category';
    });
    
    // Clear log
    const log = document.getElementById('evalLog');
    if (log) log.innerHTML = '';
    
    const categories = ['routing', 'auth', 'context', 'templates', 'error'];
    const categoryData = evalData.categories;
    
    addEvalLogEntry('info', 'Initializing evaluation suite...');
    
    setTimeout(() => addEvalLogEntry('info', 'Loading 90 questions across 5 categories'), 400);
    setTimeout(() => addEvalLogEntry('info', 'Testing variants: baseline → hybrid → graph → submod → full'), 800);
    setTimeout(() => addEvalLogEntry('running', 'Starting comprehensive evaluation...'), 1200);
    
    let delay = 1600;
    let completedQuestions = 0;
    const totalQuestions = 90;
    
    categories.forEach((cat, index) => {
        setTimeout(() => {
            const prog = document.getElementById('prog-' + cat);
            if (prog) prog.classList.add('active');
            addEvalLogEntry('running', `[${index + 1}/5] Evaluating ${categoryData[cat].name} (${categoryData[cat].questions} questions)...`);
            
            // Animate progress bar
            const fill = document.getElementById('progFill-' + cat);
            if (fill) {
                fill.style.transition = 'width 1.2s ease-out';
                fill.style.width = categoryData[cat].score + '%';
            }
            
            setTimeout(() => {
                if (prog) {
                    prog.classList.remove('active');
                    prog.classList.add('complete');
                }
                const score = document.getElementById('progScore-' + cat);
                if (score) {
                    score.textContent = categoryData[cat].score.toFixed(1) + '%';
                    score.classList.add('pass');
                }
                
                completedQuestions += categoryData[cat].questions;
                addEvalLogEntry('success', `✓ ${categoryData[cat].name}: ${categoryData[cat].score}% (${categoryData[cat].questions}/${categoryData[cat].questions} verified)`);
            }, 1200);
        }, delay);
        
        delay += 1600;
    });
    
    // Final results
    setTimeout(() => {
        addEvalLogEntry('success', '═══════════════════════════════════════');
        addEvalLogEntry('success', '✓ Evaluation Complete!');
        addEvalLogEntry('success', '  Citation Accuracy: 92.4%');
        addEvalLogEntry('success', '  Verification Rate: 87.8%');
        addEvalLogEntry('success', '  Hallucinations: 0');
        addEvalLogEntry('info', '✓ Results exported to evaluation_results.csv');
        
        btn.classList.remove('running');
        btn.innerHTML = '<span class="btn-icon">✓</span> Complete';
        
        setTimeout(() => {
            btn.innerHTML = '<span class="btn-icon">▶</span> Run Again';
            evalRunning = false;
        }, 2500);
    }, delay + 400);
}

function addEvalLogEntry(type, message) {
    const log = document.getElementById('evalLog');
    if (!log) return;
    
    const entry = document.createElement('div');
    entry.className = 'log-entry ' + type;
    
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    entry.innerHTML = `<span class="timestamp">[${time}]</span> ${message}`;
    
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

// Initialize charts when navigating to eval scene
const originalGoToSceneEval = window.goToScene;
window.goToScene = function(index) {
    if (originalGoToSceneEval) originalGoToSceneEval(index);
    if (index === 24) {
        setTimeout(initEvalCharts, 300);
    }
    // Initialize reviewer query charts
    if (index === 27) {
        setTimeout(initHopComparisonChart, 300);
    }
    if (index === 28) {
        setTimeout(initContributionChart, 300);
    }
};

// Also init on page load if starting on scene 24
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (currentScene === 24) initEvalCharts();
        if (currentScene === 27) initHopComparisonChart();
        if (currentScene === 28) initContributionChart();
    }, 500);
});

/* ============================================
   Reviewer Query Charts JavaScript
   ============================================ */

let hopComparisonChart = null;
let contributionChart = null;

// Hop Comparison Chart (Reviewer Query 1)
function initHopComparisonChart() {
    const ctx = document.getElementById('hopComparisonChart');
    if (!ctx) return;
    
    if (hopComparisonChart) hopComparisonChart.destroy();
    
    hopComparisonChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1-Hop', '2-Hop', '3-Hop', '4-Hop'],
            datasets: [
                {
                    label: 'Citation Accuracy',
                    data: [84.3, 92.4, 87.8, 81.2],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99,102,241,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 6,
                    pointBackgroundColor: ['#64748b', '#10b981', '#f59e0b', '#ef4444']
                },
                {
                    label: 'Coverage',
                    data: [67.2, 89.1, 91.2, 92.8],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16,185,129,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 6,
                    pointBackgroundColor: '#10b981'
                },
                {
                    label: 'Noise Ratio',
                    data: [12.1, 18.3, 34.7, 52.3],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239,68,68,0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.3,
                    pointRadius: 6,
                    pointBackgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { color: '#94a3b8', font: { size: 11 }, usePointStyle: true }
                },
                annotation: {
                    annotations: {
                        optimalLine: {
                            type: 'line',
                            xMin: 1,
                            xMax: 1,
                            borderColor: '#10b981',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                display: true,
                                content: 'Optimal',
                                position: 'start'
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 0,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94a3b8', callback: v => v + '%', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 11 } }
                }
            }
        }
    });
}

// Contribution Chart (Reviewer Query 2)
function initContributionChart() {
    const ctx = document.getElementById('contributionChart');
    if (!ctx) return;
    
    if (contributionChart) contributionChart.destroy();
    
    contributionChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Baseline', '+Hybrid', '+Graph', '+Submod', 'Full'],
            datasets: [{
                label: 'Citation Accuracy',
                data: [71.2, 84.3, 87.6, 89.1, 92.4],
                backgroundColor: [
                    'rgba(100,116,139,0.7)',
                    'rgba(99,102,241,0.7)',
                    'rgba(236,72,153,0.7)',
                    'rgba(139,92,246,0.7)',
                    'rgba(16,185,129,0.7)'
                ],
                borderColor: [
                    '#64748b',
                    '#6366f1',
                    '#ec4899',
                    '#8b5cf6',
                    '#10b981'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterLabel: function(context) {
                            const deltas = ['—', '+13.1%', '+3.3%', '+1.5%', '+3.3%'];
                            return 'Δ: ' + deltas[context.dataIndex];
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 65,
                    max: 100,
                    grid: { color: 'rgba(255,255,255,0.1)' },
                    ticks: { color: '#94a3b8', callback: v => v + '%', font: { size: 10 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#94a3b8', font: { size: 10 } }
                }
            }
        }
    });
}

// Update speech scripts for new scenes (27, 28, 29)
const reviewerSpeechScripts = {
    27: { 
        text: "Reviewer Query 1: Why 2-hop graph expansion? Our empirical analysis shows 2-hop achieves the optimal balance. 1-hop misses transitive dependencies with only 67% coverage. 2-hop reaches 92.4% accuracy with 89% coverage. 3+ hops introduce excessive noise, dropping accuracy to 87.8% despite higher coverage. The decay factor of 0.6 means contributions diminish rapidly beyond 2 hops.", 
        terms: ['2-hop', 'coverage', 'noise', 'decay'] 
    },
    28: { 
        text: "Reviewer Query 2: Why these variants? Our ablation study follows standard practice: each variant adds exactly one component. This isolates individual contributions. Hybrid retrieval provides the largest gain at +13.1%. Graph expansion adds +3.3%, submodular packing +1.5%, and final reranking another +3.3%. All transitions are statistically significant with p-values below 0.05.", 
        terms: ['ablation', 'variants', 'p-value', 'significant'] 
    },
    29: { 
        text: "In conclusion, CodeCite achieves 92.4% citation accuracy with zero hallucinations. Source code is available at github.com/jahidul-arafat/codecite. Speaking as AI representative on behalf of author Jahidul Arafat, thank you for your attention. Grounded responses aren't just helpful, they're trustworthy. Questions?", 
        terms: [] 
    }
};

// Merge reviewer speech scripts
Object.assign(speechScripts, reviewerSpeechScripts);
