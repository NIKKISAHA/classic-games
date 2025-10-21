
const clues = [
    // --- Originals from your prompt ---
    { clue: "I speak without a mouth and hear without ears. What am I?", answer: "echo" },
    { clue: "I’m tall when I’m young, and short when I’m old. What am I?", answer: "candle" },
    { clue: "The more you take, the more you leave behind. What am I?", answer: "footsteps" },

    // --- Time, Age, and Abstract Concepts (12) ---
    { clue: "What goes up but never comes down?", answer: "age" },
    { clue: "What is always coming, but never arrives?", answer: "tomorrow" },
    { clue: "What can be broken, but never held?", answer: "promise" },
    { clue: "What is always in front of you but can’t be seen?", answer: "future" },
    { clue: "What disappears the moment you say its name?", answer: "silence" },
    { clue: "What is yours, but others use it more than you do?", answer: "name" },
    { clue: "What can you catch, but never throw?", answer: "cold" },
    { clue: "Until I am measured, I am not known. Yet how you miss me when I have flown. What am I?", answer: "time" },
    { clue: "I am a five-letter word. Take away one letter, and I am the same. What am I?", answer: "alone" },
    { clue: "What word is spelled incorrectly in every dictionary?", answer: "incorrectly" },
    { clue: "What is full of holes but still holds water?", answer: "sponge" },
    { clue: "What comes once in a minute, twice in a moment, but never in a thousand years?", answer: "M" },
    
    // --- Common Objects (18) ---
    { clue: "I have hands, but cannot clap. What am I?", answer: "clock" },
    { clue: "I have a head and a tail, but no body. What am I?", answer: "coin" },
    { clue: "I have keys, but open no locks. I have a space, but no room. You can enter, but can't go outside. What am I?", answer: "keyboard" },
    { clue: "I have many teeth, but cannot bite. What am I?", answer: "comb" },
    { clue: "What has an eye but cannot see?", answer: "needle" },
    { clue: "What gets wet while drying?", answer: "towel" },
    { clue: "I have a neck but no head. What am I?", answer: "bottle" },
    { clue: "What can be cracked, made, told, and played?", answer: "joke" },
    { clue: "What kind of room has no doors, walls, or windows?", answer: "mushroom" },
    { clue: "I have an outside and an inside. You throw away the outside and cook the inside. Then you eat the outside and throw away the inside. What am I?", answer: "corn" },
    { clue: "What is black when it's clean and white when it's dirty?", answer: "chalkboard" },
    { clue: "What building has the most stories?", answer: "library" },
    { clue: "I have branches, but no fruit, trunk, or leaves. What am I?", answer: "bank" },
    { clue: "What is cut on a table, but is never eaten?", answer: "cards" },
    { clue: "I follow you all the time, but you can’t touch me. What am I?", answer: "shadow" },
    { clue: "What has a bark but no bite?", answer: "tree" },
    { clue: "What has a bottom at the top?", answer: "legs" },
    { clue: "What can travel all around the world without leaving its corner?", answer: "stamp" },

    // --- Nature and Elements (13) ---
    { clue: "What runs but never walks, often murmurs but never talks, has a bed but never sleeps, and has a mouth but never eats?", answer: "river" },
    { clue: "What has cities but no houses, mountains but no trees, and water but no fish?", answer: "map" },
    { clue: "What is light as a feather, but even the strongest person can't hold it for five minutes?", answer: "breath" },
    { clue: "I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?", answer: "fire" },
    { clue: "The more of me there is, the less you see. What am I?", answer: "darkness" },
    { clue: "I am made of water, but if you put me into water, I will die. What am I?", answer: "ice" },
    { clue: "I can fall from a great height and survive, but a fast wind can kill me. What am I?", answer: "rain" },
    { clue: "I have an orange head and wear a green hat. What am I?", answer: "carrot" },
    { clue: "I am light, but often mistreated. I am heavy when saturated. What am I?", answer: "cloud" },
    { clue: "What is always fed, but stays hungry and thirsty?", answer: "fire" },
    { clue: "I have no voice, but I tell you the whole world. What am I?", answer: "book" },
    { clue: "What has roots, but doesn't need water to grow?", answer: "family" },
    { clue: "What is seen in the middle of March and April, but not at the beginning or end of either month?", answer: "R" },

    // --- Math and Wordplay (7) ---
    { clue: "I am an odd number. Take away a letter and I become even. What am I?", answer: "seven" },
    { clue: "What word becomes shorter when you add two letters to it?", answer: "short" },
    { clue: "What is greater than God, more evil than the devil, poor people have it, rich people need it, and if you eat it you will die?", answer: "nothing" },
    { clue: "If you have me, you want to share me. If you share me, you haven't kept me. What am I?", answer: "secret" },
    { clue: "What word is pronounced as one letter, but written with three?", answer: "eye" },
    { clue: "What do you bury when it's alive, and dig up when it's dead?", answer: "plant" },
    { clue: "I have four fingers and a thumb, but I’m not alive. What am I?", answer: "glove" },

    // --- Bonus Riddles (10) ---
    { clue: "What has to be broken before you can use it?", answer: "egg" },
    { clue: "What kind of band never plays music?", answer: "rubberband" },
    { clue: "Where does today come before yesterday?", answer: "dictionary" },
    { clue: "I can fill a room, but I take up no space. What am I?", answer: "light" },
    { clue: "I am a two-story home, but I have no roof, walls, or doors. What am I?", answer: "staircase" },
    { clue: "What kind of coat can only be put on when wet?", answer: "paint" },
    { clue: "I shave every day, but my beard stays the same. What am I?", answer: "barber" },
    { clue: "What has a ring but no finger?", answer: "phone" },
    { clue: "What is harder to catch the faster you run?", answer: "breath" },
    { clue: "What do you hold in your right hand but not your left?", answer: "leftelbow" },
    { clue: "I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?", answer: "globe" },
    { clue: "What has an iron tongue, and constantly wears a coat of mail?", answer: "bell" },
    { clue: "What has a voice but no body, and comes to life with the wind?", answer: "kite" },
    { clue: "I am always hungry, I must always be fed. I live on land and sea, in wood and lead. What am I?", answer: "mold" },
    { clue: "I appear in the water, but I am in the sky. What am I?", answer: "reflection" },
    { clue: "I have no voice, yet I announce the passing of time. What am I?", answer: "sundial" },
    { clue: "I am often talked about, but rarely seen. I have no life, yet I am feared. What am I?", answer: "death" },
    { clue: "What flies without wings?", answer: "time" },
    { clue: "What has a bark, but is not a dog?", answer: "seal" },
    { clue: "I am lighter than air, but a hundred people cannot lift me. What am I?", answer: "bubble" },
    { clue: "What is white when dirty, and black when clean?", answer: "blackboard" },
    { clue: "I am a silent watcher, I have a mouth, but never speak. What am I?", answer: "door" },
    { clue: "I have many needles but do not sew. What am I?", answer: "pine" },
    { clue: "What wears a coat all winter but removes it when the sun shines?", answer: "snowman" },
    { clue: "What is seen in the middle of April and June, but not in any other month?", answer: "L" },
    { clue: "What is the capital of France, but has no people?", answer: "F" },
    { clue: "I fall, but never break. What am I?", answer: "night" },
    { clue: "What is always coming, but never arrives?", answer: "day" },
    { clue: "I can be sweet and I can be sour. What am I?", answer: "grape" },
    { clue: "I have no beginning, end, or middle. What am I?", answer: "doughnut" },

    // --- People and Roles (15) ---
    { clue: "I have hair, but am not a person. What am I?", answer: "wig" },
    { clue: "I can be short or tall, fat or thin. I have no legs but can walk. What am I?", answer: "pants" },
    { clue: "I have a spine but no body. What am I?", answer: "book" },
    { clue: "The man who makes me doesn't need me. The man who buys me doesn't use me. The man who uses me doesn't know it. What am I?", answer: "coffin" },
    { clue: "I can be written, but not read. What am I?", answer: "music" },
    { clue: "I have no voice, but I tell of great journeys. What am I?", answer: "novel" },
    { clue: "I am taken from a mine and shut up in a wooden case. What am I?", answer: "pencil" },
    { clue: "I have no bones, but I hold a man to the ground. What am I?", answer: "gravity" },
    { clue: "What has two heads, four eyes, and six legs, but only walks on two feet?", answer: "man" }, // man carrying two buckets
    { clue: "I have a head and a foot, but no body. What am I?", answer: "bed" },
    { clue: "I am always moving, but never go anywhere. What am I?", answer: "escalator" },
    { clue: "I wear a leather coat all year round. What am I?", answer: "soccerball" },
    { clue: "I speak every language, but I have no mouth. What am I?", answer: "radio" },
    { clue: "What is served and eaten, but not found on a menu?", answer: "tennis" },
    { clue: "I have no legs, but I travel all day long. What am I?", answer: "money" },

    // --- Wordplay and Logic (35) ---
    { clue: "What begins with T, ends with T, and has T in it?", answer: "teapot" },
    { clue: "What has three letters, but starts with 'G'?", answer: "gem" },
    { clue: "What word is spelled the same backward and forward?", answer: "level" },
    { clue: "What five-letter word becomes shorter when you add two letters to it?", answer: "short" },
    { clue: "If you have me, you want to share me. If you share me, you lose me. What am I?", answer: "secret" },
    { clue: "I am taken before you can get it. What am I?", answer: "photograph" },
    { clue: "What can you put in a bucket to make it lighter?", answer: "hole" },
    { clue: "What is the answer to the first question?", answer: "what" },
    { clue: "What has an ocean but no water?", answer: "bucket" },
    { clue: "I get bigger the more you take away. What am I?", answer: "hole" },
    { clue: "I am an eight-letter word. Take away my 'S', and I am still the same. What am I?", answer: "island" },
    { clue: "I have no life, but I can kill. What am I?", answer: "poison" },
    { clue: "What has no voice, but can tell you a lot?", answer: "picture" },
    { clue: "What is found in the middle of 'nowhere'?", answer: "H" },
    { clue: "I have no body, but I can steal your breath. What am I?", answer: "silence" },
    { clue: "What is the only place in the world where today comes before yesterday?", answer: "dictionary" },
    { clue: "What has a tongue, but can't taste?", answer: "shoe" },
    { clue: "What has no bones, but can be a trap?", answer: "web" },
    { clue: "I have no lungs, but I need air. What am I?", answer: "bicycle" },
    { clue: "I have no legs, but I dance. What am I?", answer: "smoke" },
    { clue: "I have two sisters. The first is called Snap, the second is called Crackle. What is the third sister called?", answer: "pop" },
    { clue: "I get stronger the more I am shared. What am I?", answer: "knowledge" },
    { clue: "What has a voice, but never speaks?", answer: "radio" },
    { clue: "What can you put in a bucket to make it lighter?", answer: "fire" },
    { clue: "I have no voice, but I tell of great journeys. What am I?", answer: "atlas" },
    { clue: "What has many rings but no fingers?", answer: "tree" },
    { clue: "What has no legs, but runs all over the world?", answer: "internet" },
    { clue: "What has a head and a foot, but no body?", answer: "lettuce" },
    { clue: "What has four wheels and flies?", answer: "garbage" },
    { clue: "I get dressed in the morning, but I stay in bed all day. What am I?", answer: "mattress" },
    { clue: "What question can you never answer yes to?", answer: "asleep" },
    { clue: "What is always running but never goes anywhere?", answer: "nose" },
    { clue: "What has many hearts but no other organs?", answer: "cards" },
    { clue: "I am not alive, but I grow and die. What am I?", answer: "battery" },
    { clue: "What can fill a room but takes up no space?", answer: "air" },

    // --- Household and Food (30) ---
    { clue: "What is put on the table and cut, but never eaten?", answer: "cards" },
    { clue: "I have a spine, but no bones. What am I?", answer: "book" },
    { clue: "I have a mouth but never speak, and a bed but never sleep. What am I?", answer: "river" },
    { clue: "What kind of ship has two mates but no captain?", answer: "relationship" },
    { clue: "What is made out of sand, but melts in water?", answer: "glass" },
    { clue: "I have a bottom at the top. What am I?", answer: "pants" },
    { clue: "What can you hold in your left hand but not your right?", answer: "righthand" },
    { clue: "I have a big mouth and I'm always ready to talk, but I can't say a single word. What am I?", answer: "shoe" },
    { clue: "I wear a coat all winter but remove it when the sun shines. What am I?", answer: "tree" },
    { clue: "I am a silent messenger, I come in pairs. What am I?", answer: "socks" },
    { clue: "I have a shell, but I am not an animal. What am I?", answer: "nut" },
    { clue: "What has many rings but no fingers?", answer: "tree" },
    { clue: "I have four legs and one foot, but I cannot run. What am I?", answer: "bed" },
    { clue: "What is always hungry, must always be fed, but stays thirsty?", answer: "fire" },
    { clue: "I have no voice, but I tell you the whole world. What am I?", answer: "atlas" },
    { clue: "What has many keys but can't open a single door?", answer: "piano" },
    { clue: "What is always on your body, but you can't touch it?", answer: "skin" },
    { clue: "What has four legs, and a bottom, but cannot walk?", answer: "chair" },
    { clue: "I am light, but often mistreated. I am heavy when saturated. What am I?", answer: "cloud" },
    { clue: "What is orange and sounds like a parrot?", answer: "carrot" },
    { clue: "What has an eye but cannot see?", answer: "storm" },
    { clue: "I have no voice, but I tell you the whole world. What am I?", answer: "magazine" },
    { clue: "What do you catch but never throw?", answer: "cold" },
    { clue: "What has to be broken before you can use it?", answer: "egg" },
    { clue: "What has a ring but no finger?", answer: "telephone" },
    { clue: "What has many teeth but cannot bite?", answer: "zipper" },
    { clue: "What is black when you buy it, red when you use it, and gray when you throw it away?", answer: "coal" },
    { clue: "I can be smaller than you but weigh nothing at all. What am I?", answer: "shadow" },
    { clue: "What do you hold in your left hand but not your right?", answer: "righthand" },
    { clue: "I can be sweet and I can be sour. What am I?", answer: "lemon" }
];


let currentIndex = null;
let score = 0;
let consecutiveCorrect = 0;
let timer = null;
let timeLeft = 20; // 20 seconds per clue

const clueEl = document.getElementById('clue');
const answerEl = document.getElementById('answer');
const feedbackEl = document.getElementById('feedback');
const scoreEl = document.getElementById('score');
const submitBtn = document.getElementById('submitBtn');
const nextBtn = document.getElementById('nextBtn');
const timerEl = document.getElementById('timer'); // You need to add a <span id="timer"></span> in HTML

// Function to normalize strings
function normalize(str) {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Pick a random clue index
function getRandomIndex() {
    return Math.floor(Math.random() * clues.length);
}

// Load a random clue
function loadClue() {
    currentIndex = getRandomIndex();
    clueEl.textContent = clues[currentIndex].clue;
    answerEl.value = '';
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';
    submitBtn.disabled = false;

    // Start timer
    timeLeft = 20;
    timerEl.textContent = `Time Left: ${timeLeft}s`;
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerEl.textContent = `Time Left: ${timeLeft}s`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            feedbackEl.textContent = "Time's up! ❌";
            submitBtn.disabled = true;
            consecutiveCorrect = 0; // reset streak
            nextBtn.style.display = 'inline-block';
        }
    }, 1000);
}

submitBtn.addEventListener('click', () => {
    const userAnswer = normalize(answerEl.value.trim());
    const correctAnswer = normalize(clues[currentIndex].answer);

    if (userAnswer === correctAnswer) {
        feedbackEl.textContent = "Correct! 🎉";
        score++;
        scoreEl.textContent = `Score: ${score}`;
        submitBtn.disabled = true;
        nextBtn.style.display = 'inline-block';
        consecutiveCorrect++;

        // Stop timer
        clearInterval(timer);

        // Check for 5 consecutive wins
        // if (consecutiveCorrect >= 1) {
        //     clueEl.textContent = "🏆 You won! 5 correct answers in a row!";
        //     submitBtn.style.display = 'none';
        //     nextBtn.style.display = 'none';
        //     answerEl.style.display = 'none';
        //     timerEl.style.display = 'none';
        // }
        if (consecutiveCorrect >= 10) { // change to 5, if that’s your target streak
    clueEl.innerHTML = "🏆 You won! 5 correct answers in a row!<br>Congratulations 🎉";
    scoreEl.textContent = `Score: ${score}`;

    // Hide input and submit/next buttons
    answerEl.style.display = 'none';
    submitBtn.style.display = 'none';
    nextBtn.style.display = 'none';
    timerEl.style.display = 'none';
    feedbackEl.textContent = '';

    // Create restart button
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart Game';
    restartBtn.addEventListener('click', () => {
        // Reset everything
        score = 0;
        consecutiveCorrect = 0;
        scoreEl.textContent = `Score: ${score}`;
        answerEl.style.display = 'inline-block';
        submitBtn.style.display = 'inline-block';
        timerEl.style.display = 'inline-block';
        restartBtn.remove(); // remove button after click
        loadClue();
    });
    document.querySelector('.container').appendChild(restartBtn);
}

    } else {
        feedbackEl.textContent = "Try Again ❌";
        consecutiveCorrect = 0; // reset streak
    }
});

nextBtn.addEventListener('click', () => {
    loadClue();
});

// Initialize first clue
loadClue();
