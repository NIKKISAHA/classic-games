// --- DOM Elements ---
const promptTextEl = document.getElementById('prompt-text');
const textInputEl = document.getElementById('text-input');
const startButton = document.getElementById('start-btn');
const timerEl = document.getElementById('timer');
const scoreEl = document.getElementById('score');
const messageEl = document.getElementById('message');

// --- NEW MODAL DOM Elements ---
const modalEl = document.getElementById('result-modal');
const modalTitleEl = document.getElementById('modal-title');
const modalWPMEl = document.getElementById('modal-wpm');
const modalTimeMsgEl = document.getElementById('modal-time-msg');
const modalPlayAgainBtn = document.getElementById('modal-play-again-btn');


// --- Game Variables and Configuration ---

const PARAGRAPH_OPTIONS = [
    "The quick brown fox jumps over the lazy dog. Programming a game is a fun way to learn JavaScript, especially by focusing on classic, simple mechanics that avoid copyright issues.",
    "Web development is an exciting field that merges creativity with logic. Mastering HTML, CSS, and JavaScript opens up a world of possibilities for building interactive experiences.",
    "A computer science concept known as the 'game loop' is fundamental to all real-time games. It continuously handles input, updates the game state, and redraws the display.",
    "Version control using Git is a crucial skill for any developer, allowing for collaborative work and the ability to track and revert changes in a project's history with ease.",
    "The secret to fast typing lies not just in speed, but in accuracy and rhythm. Regular practice on varied texts is the best way to improve your Words Per Minute score over time.",
    // Starting 100 new entries for PARAGRAPH_OPTIONS
    "The atmosphere of Mars is primarily composed of carbon dioxide, making it unsuitable for human respiration without external life support systems.",
    "During the Renaissance, a renewed interest in classical art and philosophy spurred innovation across Europe, laying the groundwork for the modern age.",
    "Recursion in programming is a method of solving problems where the solution depends on solutions to smaller instances of the same problem, often used in tree structures.",
    "The works of Jane Austen frequently explore themes of social class, marriage, and financial security among the English gentry of the early nineteenth century.",
    "The Amazon Rainforest is the world's largest tropical rainforest, playing a critical role in regulating the planet's oxygen and carbon cycles.",
    "Asynchronous functions in JavaScript allow operations to run independently of the main thread, preventing the browser from freezing while waiting for a task to complete.",
    "The Great Wall of China was constructed over centuries to protect various Chinese states and empires against the raids and invasions of nomadic groups.",
    "In object-oriented programming, encapsulation is the bundling of data with the methods that operate on that data, restricting direct access from outside.",
    "Philosophy, at its core, is the study of general and fundamental problems concerning matters such as existence, knowledge, values, reason, mind, and language.",
    "The concept of sustainable development aims to meet the needs of the present without compromising the ability of future generations to meet their own needs.",
    "CSS Flexbox is a one-dimensional layout method designed to help distribute space among items in a container, enabling complex and responsive design patterns easily.",
    "The discovery of penicillin by Alexander Fleming revolutionized medicine, ushering in the age of antibiotics and dramatically reducing deaths from bacterial infections.",
    "In networking, the term latency refers to the delay before a transfer of data begins following an instruction for its transfer, often measured in milliseconds.",
    "Surrealism was a cultural movement that began in the early 1920s, best known for its visual artworks and writings that expressed the irrational and subconscious mind.",
    "The study of oceanography involves exploring the physical, chemical, biological, and geological characteristics of the world's oceans and coastlines.",
    "A closure in JavaScript is the combination of a function and the lexical environment within which that function was declared, enabling powerful data privacy.",
    "The Magna Carta, sealed in 1215, is one of the most important documents in English history, limiting the power of the monarch and establishing fundamental rights.",
    "Binary search is an efficient algorithm for finding an item from a sorted list of items, working by repeatedly dividing in half the portion of the list that could contain the item.",
    "Stoicism is an ancient Greek philosophy that teaches the development of self-control and fortitude as a means of overcoming destructive emotions.",
    "The difference between HTTP and HTTPS lies in the S, which stands for Secure, indicating that communication is encrypted using Transport Layer Security or SSL.",
    "The period of the Cold War was defined by geopolitical tension between the United States and the Soviet Union and their respective allies, lasting from 1947 to 1991.",
    "A hash table is a data structure that implements an associative array abstract data type, a structure that can map keys to values efficiently.",
    "Fjord is a long, narrow, deep inlet of the sea between high cliffs, typically formed by submergence of a glaciated valley.",
    "Ethical hacking involves authorized attempts to gain unauthorized access to a computer system, application, or data to identify security vulnerabilities.",
    "The invention of the printing press by Johannes Gutenberg dramatically increased literacy rates and accelerated the spread of knowledge across the continent.",
    "Cascading Style Sheets, or CSS, describe how HTML elements are to be displayed on screen or other media, separating document content from presentation.",
    "Utilitarianism is an ethical theory that holds that the best action is the one that maximizes overall utility, usually defined as the sum of happiness.",
    "The Kuiper Belt is a doughnut-shaped region of icy bodies extending beyond the orbit of Neptune, home to several dwarf planets including Pluto.",
    "A promise in JavaScript is an object representing the eventual completion or failure of an asynchronous operation and its resulting value.",
    "The Silk Road was an ancient network of trade routes that connected the East and West, crucial for the transfer of goods, ideas, and diseases.",
    "The concept of 'Big O' notation in computer science describes the performance or complexity of an algorithm, focusing on its worst-case scenario.",
    "Realism in art aimed to represent subjects truthfully, without artificiality and avoiding artistic conventions, exotic or superficial subject matter.",
    "The troposphere is the lowest layer of Earth's atmosphere, and is also where nearly all weather phenomena occur.",
    "A variable scope in programming determines the accessibility of variables, with block scope being the most restrictive and safest for local data.",
    "The French Revolution was a period of fundamental political and societal change in France that began in 1789 and ended with Napoleon's rise to power.",
    "The Fibonacci sequence is a series of numbers where each number is the sum of the two preceding ones, starting from zero and one.",
    "Existentialism is a philosophy that emphasizes individual existence, freedom, and choice, asserting that human beings create the meaning of their lives.",
    "A packet is a small segment of a message that is transmitted over a network, containing the data and information about where the data is going.",
    "The Neolithic Revolution, or the first agricultural revolution, marked the transition in human history from a nomadic hunting-and-gathering lifestyle to farming.",
    "Event delegation in JavaScript is a technique where you attach a single event listener to a parent element, which then listens for events on its descendants.",
    "The Baroque period in music was characterized by highly ornamented and elaborate compositions, with composers like Bach and Handel dominating the era.",
    "The Coriolis effect describes the pattern of deflection taken by objects not firmly connected to the ground as they travel long distances around the Earth.",
    "Bootstrap is a popular free and open-source CSS framework directed at responsive, mobile-first front-end web development.",
    "The Renaissance polymath Leonardo da Vinci is revered for his paintings, such as the Mona Lisa, and his detailed scientific and anatomical notebooks.",
    "A stack overflow error occurs when a recursive function lacks a proper exit condition, causing the program to run out of memory for function calls.",
    "The Industrial Revolution's second phase, starting in the late 19th century, was characterized by the widespread use of electricity, steel, and petroleum.",
    "The concept of immutability states that an object cannot be modified after it is created, a practice encouraged in many modern programming paradigms.",
    "A sonnet is a fourteen-line poem, typically written in iambic pentameter, with a number of different rhyme schemes, originating in Italy.",
    "Biotechnology is the use of living systems and organisms to develop or make products, especially to benefit human health or the environment.",
    "The waterfall model is a traditional software development process where progress flows steadily downwards like a waterfall through sequential phases.",
    "The Enlightenment was an intellectual and philosophical movement that dominated the world of ideas in Europe during the 18th century, emphasizing reason.",
    "The process of hoisting in JavaScript moves variable and function declarations to the top of their current scope during the compilation phase.",
    "Plate tectonics not only explains earthquakes and volcanoes but also the formation of mountain ranges and the distribution of ancient fossils.",
    "Vulnerability in cybersecurity refers to a weakness that can be exploited by a threat actor to gain unauthorized access or perform malicious acts.",
    "Literary Modernism was a movement in the late nineteenth and early twentieth centuries that rejected traditional forms and conventions in literature and art.",
    "The Earth's magnetic field acts as a shield, protecting the planet from charged particles emitted by the Sun, a phenomenon known as the solar wind.",
    "Redux is a predictable state container for JavaScript apps, commonly used with React, to manage application state in a centralized store.",
    "The Battle of Thermopylae in 480 BC, though a military defeat for the Greeks, became a symbol of courage and self-sacrifice against a much larger force.",
    "A linked list is a linear collection of data elements whose order is not given by their physical placement in memory, but by pointers.",
    "Deontology is an ethical theory that judges the morality of an action based on adherence to rules, regardless of the outcome.",
    "Nuclear fusion, the process that powers the sun, involves combining two light atomic nuclei to form a heavier one, releasing massive amounts of energy.",
    "The concept of 'semantic HTML' encourages the use of tags that clearly describe the meaning and structure of the content, improving accessibility and SEO.",
    "The Renaissance figure Niccolò Machiavelli is best known for his political treatise, The Prince, which controversially details pragmatic statecraft.",
    "A buffer overflow attack is a common vulnerability where a program writes more data to a block of memory than it was originally allocated to hold.",
    "The Great Barrier Reef, off the coast of Australia, is the world's largest coral reef system, visible from outer space.",
    "The concept of closures is often utilized in JavaScript to create module patterns, effectively mimicking private methods and variables.",
    "The Cold War tension was exacerbated by the arms race, a competition between the two superpowers to achieve superiority in nuclear warfare capability.",
    "The 'DRY' principle, or 'Don't Repeat Yourself', is a fundamental concept in software development aimed at reducing redundancy of information.",
    "Cubism was a revolutionary art movement pioneered by Pablo Picasso and Georges Braque, characterized by abstracting objects into geometric shapes.",
    "The Ring of Fire is a major area in the basin of the Pacific Ocean where a large number of earthquakes and volcanic eruptions occur.",
    "The `async/await` syntax in JavaScript is syntactic sugar built on top of Promises, making asynchronous code look and behave more like synchronous code.",
    "The Battle of Gettysburg was a turning point in the American Civil War, halting the Confederate invasion of the North and inflicting a decisive loss.",
    "Quicksort is an efficient, comparison-based sorting algorithm that uses a divide-and-conquer strategy to recursively sort the elements.",
    "Nihilism is the philosophical idea that life is without objective meaning, purpose, or intrinsic value.",
    "Global warming refers to the long-term heating of Earth's climate system observed since the pre-industrial period due to human activities.",
    "Regular expressions, or regex, are a sequence of characters that define a search pattern, often used for input validation and text parsing.",
    "The Byzantine Empire was the continuation of the Roman Empire in its eastern provinces during Late Antiquity and the Middle Ages.",
    "The Model-View-Controller (MVC) architectural pattern separates an application into three interconnected parts, enhancing modularity and reusability.",
    "Existential dread is a feeling of anxiety or anguish over the ultimate meaninglessness of life and the inherent burden of personal freedom.",
    "El Niño is a climate pattern in the tropical Pacific Ocean that involves changes in the temperature of surface waters, significantly affecting global weather.",
    "The Document Object Model, or DOM, is a programming interface for web documents, representing the page so that programs can change the document structure, style, and content.",
    "The Enlightenment philosopher Immanuel Kant significantly contributed to metaphysics, ethics, and aesthetics, emphasizing the importance of rational autonomy.",
    "Cryptography is the practice and study of techniques for secure communication in the presence of adversarial behavior.",
    "Baroque architecture is characterized by elaborate, dramatic, and dynamic designs, often intended to evoke awe and a sense of grandeur.",
    "The water cycle describes the continuous movement of water on, above, and below the surface of the Earth, driven by solar energy and gravity.",
    "Dependency injection is a design pattern in software engineering where a component receives its required dependencies from an external source.",
    "The fall of the Berlin Wall in 1989 symbolized the end of the Iron Curtain and paved the way for German reunification and the collapse of Soviet influence.",
    "A trie, or prefix tree, is an ordered tree data structure used to store a dynamic set of strings, optimizing for quick retrieval based on prefixes.",
    "Agnosticism is the view that the existence of God, of the divine or the supernatural is unknown or unknowable.",
    "Photosynthesis primarily occurs in the chloroplasts of plant cells, utilizing chlorophyll to capture light energy.",
    "The concept of responsive web design advocates for creating pages that render well on a variety of devices and window or screen sizes.",
    "The American Declaration of Independence, adopted on July 4, 1776, announced that the thirteen American colonies were independent of Great Britain.",
    "Merge sort is a highly efficient, general-purpose, comparison-based sorting algorithm that uses the divide and conquer paradigm.",
    "The golden ratio, approximately 1.618, is often found in nature and art, appealing aesthetically due to its unique mathematical properties.",
    "A tsunami is a series of waves in a water body caused by the displacement of a large volume of water, typically by an underwater earthquake.",
    "The use of array methods like `map`, `filter`, and `reduce` in JavaScript promotes a more functional and expressive coding style than traditional loops.",
    "The concept of sovereignty refers to the supreme, ultimate, and indivisible power within a state, free from external control.",
    "A graph data structure consists of a finite set of vertices or nodes and a set of ordered or unordered pairs of these vertices, known as edges.",
    "Skepticism is an attitude of doubting knowledge claims set forth in various areas, emphasizing the need for evidence.",
    "The ozone layer, located in the stratosphere, absorbs most of the Sun's ultraviolet radiation, protecting life on Earth.",
    "Web accessibility, or A11y, ensures that people with disabilities can perceive, understand, navigate, and interact with the web.",
    "Feudalism was a combination of legal and military customs in medieval Europe that flourished between the 9th and 15th centuries.",
    "The concept of multithreading in computing allows a single process to execute multiple threads concurrently, improving application responsiveness.",
    "Existential risk is the hypothetical risk of human extinction or the permanent collapse of human civilization, often related to emerging technologies.",
    "The largest telescope in the world is currently the Five-hundred-meter Aperture Spherical Telescope, or FAST, located in China.",
    "The `localStorage` API allows web applications to store data persistently in the user's browser, accessible even after the browser window is closed.",
    "The Renaissance master Michelangelo is celebrated for his monumental work, the ceiling frescoes of the Sistine Chapel in the Vatican City.",
    "Denial-of-service, or DoS, attacks overwhelm a system's resources, rendering it incapable of fulfilling legitimate requests from users.",
    "The Great Migration was the movement of six million African Americans out of the rural Southern United States to the urban Northeast, Midwest, and West between 1916 and 1970.",
    "The binary system is the fundamental language of computers, using only two digits, 0 and 1, to represent all data and instructions.",
    // End of 100 new entries
];

// --- Level Configuration ---
const LEVEL_CONFIG = [
    { level: 1, duration: 60, title: "Beginner Level" }, // Adjusted duration back to 60s for standard test length
    { level: 2, duration: 45, title: "Intermediate Challenge" },
    { level: 3, duration: 30, title: "Advanced Pace" },
    { level: 4, duration: 20, title: "Expert Sprint" },
    { level: 5, duration: 15, title: "Master Class" }
];

let currentLevel = 1; // Tracks the player's current level
let currentParagraph = ""; // The text for the current test
let currentDuration = LEVEL_CONFIG[0].duration; // Time limit for the current level
let timeLeft = currentDuration;
let timerInterval;
let gameStarted = false;
let charactersTyped = 0;


// --- Utility Functions ---

// Selects a random paragraph from the options array.
function selectRandomParagraph() {
    const randomIndex = Math.floor(Math.random() * PARAGRAPH_OPTIONS.length);
    currentParagraph = PARAGRAPH_OPTIONS[randomIndex];
    return currentParagraph;
}

// 1. Setup the prompt text with span wrappers for styling
function setupPromptText() {
    // Select a new random paragraph every time the test is set up
    const textToUse = selectRandomParagraph();

    promptTextEl.innerHTML = ''; // Clear previous content
    
    textToUse.split('').forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.dataset.index = index;
        promptTextEl.appendChild(span);
    });
    // Highlight the first character
    if (promptTextEl.firstChild) {
        promptTextEl.firstChild.classList.add('current');
    }
}

// 2. Start the countdown timer (UPDATED for levels)
function startTimer() {
    const config = LEVEL_CONFIG[currentLevel - 1];
    currentDuration = config.duration;
    
    gameStarted = true;
    timeLeft = currentDuration;
    timerEl.textContent = `Time: ${timeLeft}s | Level ${currentLevel}: ${config.title}`; // Display level info
    textInputEl.disabled = false;
    textInputEl.value = '';
    textInputEl.focus();
    startButton.disabled = true;
    startButton.style.display = 'none'; // Hide main button during test
    messageEl.textContent = `Level ${currentLevel}: Start typing! (${currentDuration}s limit)`;
    charactersTyped = 0;

    timerInterval = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time: ${timeLeft}s | Level ${currentLevel}: ${config.title}`;

        if (timeLeft <= 0) {
            endGame('Time is up!');
        }
    }, 1000);
}

// 3. End the game, calculate WPM, and handle level progression (UPDATED for Modal)
function endGame(finalMessage) {
    clearInterval(timerInterval);
    gameStarted = false;
    textInputEl.disabled = true;
    
    // Calculate WPM based on the time elapsed
    const timeTaken = currentDuration - timeLeft;
    const minutes = Math.max(timeTaken / 60, 0.01); 
    const wordsTyped = charactersTyped / 5;
    const wpm = Math.round(wordsTyped / minutes);

    scoreEl.textContent = `WPM: ${wpm}`; // Update score in the main view
    
    const isComplete = charactersTyped === currentParagraph.length;
    
    // --- Modal Content and Level Progression Logic ---
    modalWPMEl.textContent = `Final WPM: ${wpm}`;
    messageEl.textContent = ''; // Clear main message

    if (isComplete) {
        if (currentLevel < LEVEL_CONFIG.length) {
            // Level Cleared
            currentLevel++;
            modalTitleEl.textContent = `✅ Level Cleared!`;
            modalTimeMsgEl.textContent = `You finished in ${timeTaken} seconds. Get ready for Level ${currentLevel}!`;
            modalPlayAgainBtn.textContent = `Start Level ${currentLevel}`;
            setupPromptText(); 
        } else {
            // Game Won (Final Level Cleared)
            modalTitleEl.textContent = `🏆 GRAND CHAMPION!`;
            modalTimeMsgEl.textContent = `You mastered all ${LEVEL_CONFIG.length} levels! What an incredible performance.`;
            modalPlayAgainBtn.textContent = 'Play Again? (Start Level 1)';
            currentLevel = 1; // Reset to level 1 for replay
            setupPromptText(); 
        }
    } else {
        // Game Over (Time Up/Failure)
        modalTitleEl.textContent = `☠️ Test Failed`;
        modalTimeMsgEl.textContent = `${finalMessage} You failed Level ${currentLevel}. Resetting to Level 1.`;
        modalPlayAgainBtn.textContent = 'Try Again (Start Level 1)';
        currentLevel = 1; // Reset to level 1
        setupPromptText(); 
    }
    
    // Display the modal
    modalEl.style.display = 'flex';
}


// --- Event Handlers ---

// Handle user typing input
textInputEl.addEventListener('input', () => {
    if (!gameStarted) return;

    const typedText = textInputEl.value;
    const typedLength = typedText.length;
    const promptSpans = promptTextEl.querySelectorAll('span');
    let correctCount = 0;

    // Reset all prompt styles
    promptSpans.forEach(span => {
        span.classList.remove('correct', 'incorrect', 'current');
    });

    // Loop through the characters to apply styles
    for (let i = 0; i < currentParagraph.length; i++) {
        const promptChar = currentParagraph[i];
        const typedChar = typedText[i];
        const span = promptSpans[i];

        if (i < typedLength) {
            if (typedChar === promptChar) {
                span.classList.add('correct');
                correctCount++;
            } else {
                span.classList.add('incorrect');
            }
        } else if (i === typedLength) {
            // Highlight the next character to be typed
            span.classList.add('current');
        }
    }
    
    charactersTyped = correctCount; // Only count correctly typed characters for WPM

    // Check for Win Condition (Completed the entire current paragraph)
    if (typedLength === currentParagraph.length) {
        endGame('You completed the level!');
        return;
    }

    // Update WPM in real-time
    const timeElapsed = currentDuration - timeLeft;
    if (timeElapsed > 0) {
        const wordsTyped = correctCount / 5;
        const minutes = timeElapsed / 60;
        const wpm = Math.round(wordsTyped / minutes);
        scoreEl.textContent = `WPM: ${wpm}`;
    }
});

// Disable Copy and Paste
textInputEl.addEventListener('paste', e => {
    e.preventDefault();
    messageEl.textContent = '❌ Copying and pasting is not allowed during the test!';
    setTimeout(() => { 
        if (!gameStarted) messageEl.textContent = 'Click "Start Test" to begin.';
    }, 2000);
});

// Disable Drag and Drop
textInputEl.addEventListener('drop', e => {
    e.preventDefault();
});


// Start button functionality (Used only for initial start)
startButton.addEventListener('click', () => {
    if (!gameStarted) {
        startTimer();
    }
});

// New Event Handler for the modal's button to restart/continue the game
modalPlayAgainBtn.addEventListener('click', () => {
    modalEl.style.display = 'none'; // Hide the modal
    
    // Since startButton is hidden during the test, we'll manually initiate the next round.
    startTimer(); 
});


// --- Initialization ---
setupPromptText(); // Set the initial random paragraph
scoreEl.textContent = 'WPM: 0';
timerEl.textContent = `Time: ${LEVEL_CONFIG[0].duration}s | Level 1: Beginner Level`;
messageEl.textContent = `Click "Start Test" to begin Level ${currentLevel}.`;