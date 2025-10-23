// const words = ["APPLE", "TIGER", ... ]; // (Your expanded word list goes here)
const words = [
    // Initial 10 words (Keeping it short for code presentation)
    "APPLE", "TIGER", "HOUSE", "WATER", "CHAIR", "TABLE", "OCEAN", "GHOST", "PIANO", "FLOWER",
    // ... (Your 500+ word list continues here)
    "ABIDE", "ABOUT", "ABOVE", "ABUSE", "ACUTE", "ADOPT", "ADULT", "AGENT", "AGREE", "AHEAD",
    "ALARM", "ALIVE", "ALLOW", "ALONE", "ALONG", "ALTER", "AMAZED", "AMONG", "ANGER", "ANGRY",
    "ANKLE", "APART", "ARENA", "ARGUE", "AROMA", "ARRAY", "ASIDE", "ASSET", "AWAIT", "AWAKE",
    "AWARD", "AWARE", "AWFUL", "AZURE", "BABEL", "BACKYARD", "BADGE", "BAGEL", "BAKER", "BALD",
    "BALLAD", "BAMBOO", "BANANA", "BANKER", "BARBER", "BARREL", "BASIC", "BASKET", "BATTERY", "BEACH",
    "BEARD", "BEAST", "BEGAN", "BEHALF", "BEHIND", "BELIEF", "BELOW", "BENDY", "BIBLE", "BINGO",
    "BIRTH", "BLACK", "BLANK", "BLAZE", "BLESS", "BLIND", "BLINK", "BLITZ", "BLOOD", "BLOSSOM",
    "BLUES", "BLUFF", "BOARD", "BONUS", "BOOTH", "BOOTS", "BOUND", "BOWEL", "BRAIN", "BRAND",
    "BRASS", "BRAVE", "BREAD", "BREAK", "BRIEF", "BRIGHT", "BRING", "BROAD", "BROOM", "BROWN",
    "BRUSH", "BUDGET", "BUILD", "BULKY", "BUMPER", "BURST", "BUTTER", "CABLE", "CACHE", "CAKE",
    "CALM", "CAMEL", "CAMPUS", "CANAL", "CANDID", "CANDY", "CANVAS", "CAPITAL", "CAPSULE", "CARGO",
    "CARPET", "CARRY", "CARVE", "CASINO", "CASTLE", "CAVE", "CEASE", "CEILING", "CELLAR", "CEMENT",
    "CENTER", "CHAIN", "CHALK", "CHANCE", "CHARGE", "CHASE", "CHEAT", "CHECK", "CHEEK", "CHEST",
    "CHICK", "CHILD", "CHILL", "CHOICE", "CHOKE", "CHOPPER", "CHORD", "CHURCH", "CIRCUIT", "CIVIL",
    "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLERK", "CLIFF", "CLIMATE", "CLOCK", "CLOUD", "CLOWN",
    "CLUE", "COAST", "COBRA", "COFFEE", "COLD", "COLONY", "COMEDY", "COMFORT", "COMMA", "COMPACT",
    "CONDUCT", "CONFINE", "CONNECT", "CONSIST", "CONSOLE", "CONTACT", "CONVEY", "COOKER", "CORNER", "COSMIC",
    "COUGH", "COUNT", "COUNTRY", "COURT", "COVER", "CRACK", "CRANE", "CRASH", "CRAVE", "CRAZY",
    "CREAM", "CRISIS", "CRISP", "CRITICAL", "CROWD", "CROWN", "CRUDE", "CRUEL", "CRUMB", "CRUSH",
    "CRYSTAL", "CUBIC", "CUPID", "CURB", "CURE", "CURIOUS", "CURRENT", "CURVE", "CYCLE", "DAFFODIL",
    "DAILY", "DANCE", "DANGER", "DARING", "DARK", "DAUGHTER", "DAWN", "DEALER", "DEBATE", "DECADE",
    "DECAY", "DECENT", "DECIDE", "DECLINE", "DECREE", "DEEP", "DEFEND", "DEFINE", "DEGREE", "DELAY",
    "DELIGHT", "DENIAL", "DENSE", "DEPART", "DEPEND", "DEPUTY", "DERIVE", "DESERT", "DESIGN", "DESIRE",
    "DETAIL", "DETECT", "DEVISE", "DEVOTE", "DIAL", "DIARY", "DIET", "DIGEST", "DINNER", "DIRECT",
    "DISARM", "DISCOUNT", "DISPOSE", "DISTORT", "DIVIDE", "DOCTOR", "DONKEY", "DOUBLE", "DOZEN", "DRAIN",
    "DRAMA", "DREAM", "DRIFT", "DRIVE", "DROUGHT", "DROWN", "DUCHESS", "DUSTY", "DUTY", "EAGLE",
    "EARLY", "EARTH", "EASEL", "EAST", "ECHO", "ELBOW", "ELDER", "ELEGANT", "ELEMENT", "ELITE",
    "EMBARGO", "EMERALD", "EMPIRE", "ENERGY", "ENFORCE", "ENGINE", "ENOUGH", "ENTER", "ENTIRE", "ENVELOPE",
    "EQUIP", "ERASE", "ESCAPE", "ESSAY", "ESTATE", "ETHIC", "EVENT", "EXACT", "EXCEED", "EXERT",
    "EXIST", "EXPAND", "EXPECT", "EXPERT", "EXPLODE", "EXTEND", "EXTRACT", "FABLE", "FACET", "FACIAL",
    "FADING", "FAINT", "FAITH", "FAMILY", "FAMOUS", "FANCY", "FARMER", "FASHION", "FATAL", "FATHER",
    "FEAR", "FEAST", "FEMALE", "FERRY", "FICTION", "FIELD", "FIERCE", "FIFTY", "FIGHT", "FIGURE",
    "FILM", "FINAL", "FINGER", "FINISH", "FISCAL", "FISHING", "FITNESS", "FLAME", "FLASH", "FLAT",
    "FLAVOR", "FLEET", "FLEXIBLE", "FLIGHT", "FLING", "FLUID", "FOCUS", "FOLLOW", "FOOTBALL", "FOREST",
    "FORMAL", "FORMAT", "FORMER", "FORUM", "FOSTER", "FOUGHT", "FOUND", "FOURTH", "FREELY", "FRENCH",
    "FRESH", "FRIDGE", "FRIEND", "FROZEN", "FRUIT", "FUEL", "FULLY", "FUNCTION", "FUNNEL", "FUTURE",
    "GALLOP", "GARDEN", "GARISH", "GATHER", "GALAXY", "GAMES", "GARAGE", "GENIUS", "GENTLE", "GERMAN",
    "GIANT", "GIGGLE", "GLANCE", "GLASS", "GLIMPSE", "GLOBAL", "GLOOMY", "GLORY", "GLOVE", "GOLDEN",
    "GOODBYE", "GOSSIP", "GOVERN", "GRACE", "GRADE", "GRAND", "GRAPE", "GRASS", "GRAVITY", "GREAT",
    "GREEN", "GREET", "GRILLE", "GROUND", "GROUP", "GROWTH", "GUARD", "GUEST", "GUIDE", "GUILTY",
    "GUMMY", "HABIT", "HAMMER", "HANDLE", "HAPPEN", "HARBOR", "HARDLY", "HARMONY", "HAZARD", "HEADING",
    "HEALER", "HEALTH", "HEART", "HEATER", "HEAVEN", "HEIGHT", "HELPFUL", "HEROIC", "HIDDEN", "HIGHER",
    "HIJACK", "HIKING", "HIMSELF", "HISTORY", "HOLIDAY", "HONEST", "HONOR", "HORIZON", "HORSE", "HOSPITAL",
    "HOTEL", "HUMAN", "HUMBLE", "HUNDRED", "HUNGER", "HURRY", "HUSBAND", "HYMN", "IDEAL", "IGNORE",
    "ILLNESS", "IMAGE", "IMPACT", "IMPLY", "IMPORT", "IMPOSE", "IMPROVE", "INCOME", "INDEED", "INDEX",
    "INDIAN", "INDOOR", "INFANT", "INFORM", "INITIAL", "INJURY", "INNOCENT", "INSIDE", "INSIST", "INSULT",
    "INSURE", "INTAKE", "INTEND", "INVEST", "INVITE", "INVOLVE", "IRONIC", "ISLAND", "ISSUED", "ITALIAN",
    "JACKET", "JAGGED", "JAILOR", "JANUARY", "JAPANESE", "JEALOUS", "JELLY", "JOURNAL", "JOURNEY", "JUDGE",
    "JUGGLE", "JUMBLE", "JUMPING", "JUNGLE", "JUNIOR", "JUSTICE", "KARATE", "KETTLE", "KEYBOARD", "KINDLY",
    "KINGDOM", "KITCHEN", "KNIGHT", "KNOWLEDGE", "LADDER", "LAKE", "LANDLORD", "LANGUAGE", "LARGE", "LATER",
    "LAUNCH", "LAWFUL", "LEADER", "LEAGUE", "LEARN", "LEATHER", "LEAVE", "LECTURE", "LEGEND", "LEMON",
    "LENGTH", "LESSON", "LETTER", "LEVEL", "LIBRARY", "LIFETIME", "LIGHT", "LIMITED", "LIQUID", "LISTEN",
    "LITTLE", "LIVING", "LOAN", "LOCAL", "LOCKED", "LOGIC", "LONELY", "LOSING", "LOUNGE", "LOVELY",
    "LUCK", "LUGGAGE", "LUNCH", "LUXURY", "MACHINE", "MADNESS", "MAGIC", "MAGNET", "MAIDEN", "MAINSTREAM",
    "MAINTAIN", "MAJOR", "MAKER", "MANAGE", "MANDATE", "MANUAL", "MARGIN", "MARRIAGE", "MASTER", "MATCH",
    "MATTER", "MAXIMUM", "MEANING", "MEASURE", "MEDAL", "MEDIUM", "MEMBER", "MEMOIR", "MENTAL", "MERCY",
    "MERELY", "MESSENGER", "METAL", "METHOD", "MIDNIGHT", "MIGHTY", "MINIMAL", "MINUTE", "MIRROR", "MISERY",
    "MISSILE", "MISSION", "MISTAKE", "MOMENT", "MONEY", "MONITOR", "MORAL", "MORNING", "MOTHER", "MOTION",
    "MOUNTAIN", "MUMBLE", "MUSEUM", "MUSICAL", "MUSTARD", "MYSELF", "MYSTERY", "NAKED", "NARROW", "NATURE",
    "NEARBY", "NEARLY", "NEEDLE", "NEGLECT", "NEITHER", "NERVOUS", "NETWORK", "NEVER", "NEWSPAPER", "NIGHT",
    "NORMAL", "NOTICE", "NOVEL", "NUCLEAR", "NUMBER", "NURSING", "OBLIGE", "OBSCURE", "OBVIOUS", "OFFEND",
    "OFFER", "OFFICE", "OFFSET", "OLDLY", "ONION", "OPENLY", "OPERATE", "OPINION", "OPPOSE", "ORANGE",
    "ORDER", "ORGANIZE", "ORIGIN", "OUTLET", "OUTSIDE", "OXYGEN", "PACKAGE", "PAINTING", "PALE", "PANEL",
    "PANIC", "PAPA", "PARADE", "PARENT", "PARK", "PARTIAL", "PARTNER", "PASSAGE", "PATIENT", "PATROL",
    "PATTERN", "PAUSE", "PAYMENT", "PEACE", "PEANUT", "PEOPLE", "PERFECT", "PERFORM", "PERMIT", "PERSON",
    "PHRASE", "PHYSIC", "PICKUP", "PILLAR", "PILOT", "PIRATE", "PIZZA", "PLACE", "PLANET", "PLAYER",
    "PLEASE", "PLENTY", "POCKET", "POEM", "POETIC", "POINTER", "POLICE", "POLICY", "POLISH", "POPULAR",
    "PORTION", "PORTRAY", "POSSESS", "POSTAL", "POTATO", "POUND", "POWER", "PRAYER", "PREDICT", "PREFER",
    "PREMISE", "PREPARE", "PRESENT", "PRESUME", "PRETTY", "PREVIEW", "PRIEST", "PRIME", "PRINCE", "PRINTER",
    "PRIOR", "PRISON", "PRIVATE", "PROBLEM", "PROCEED", "PROCESS", "PRODUCE", "PROFESSOR", "PROFILE", "PROFIT",
    "PROGRAM", "PROJECT", "PROMPT", "PROPER", "PROPOSE", "PROTECT", "PROVE", "PROVIDE", "PUBLIC", "PULL",
    "PULSE", "PUMP", "PUNCH", "PUNISH", "PUPPY", "PURCHASE", "PURPLE", "PURPOSE", "QUALIFY", "QUALITY",
    "QUANTITY", "QUARTER", "QUEEN", "QUESTION", "QUICK", "QUIET", "QUITE", "RABBIT", "RADAR", "RADIO",
    "RAINBOW", "RAISE", "RANDOM", "RATHER", "RATING", "READER", "REALLY", "RECALL", "RECEIVE", "RECENT",
    "RECKON", "RECOVER", "REDUCE", "REFER", "REFLECT", "REFUND", "REGARD", "REGION", "REGRET", "REGULAR",
    "REJECT", "RELATE", "RELAX", "RELEVANT", "RELIEF", "REMAIN", "REMEMBER", "REMOVE", "RENDER", "RENTAL",
    "REPAIR", "REPEAT", "REPLACE", "REPORT", "RESCUE", "RESEARCH", "RESPECT", "RESPOND", "RESTORE", "RESULT",
    "RETAIN", "RETIRE", "REVEAL", "REVENUE", "REVERSE", "REVIEW", "REWARD", "RIFLE", "RIGHTLY", "RIPPLE",
    "RISK", "ROBOT", "ROCKET", "ROOSTER", "ROTATE", "ROUGHLY", "ROUND", "ROYAL", "RUBBER", "RULER",
    "RUNNER", "SACK", "SACRED", "SAFELY", "SAILOR", "SALARY", "SALMON", "SAMPLE", "SANDAL", "SATISFY",
    "SAVAGE", "SCALES", "SCARF", "SCENE", "SCHEDULE", "SCHEME", "SCHOOL", "SCIENCE", "SCORE", "SCREEN",
    "SCRIPT", "SEARCH", "SEASON", "SECOND", "SECRET", "SECTION", "SECURE", "SEEK", "SEEM", "SELECT",
    "SENIOR", "SENSE", "SERIES", "SERVER", "SERVICE", "SESSION", "SEVEN", "SEVERE", "SHADOW", "SHAKE",
    "SHALLOW", "SHARE", "SHARP", "SHEET", "SHELL", "SHIFT", "SHINE", "SHIVER", "SHOCK", "SHOOT",
    "SHOPPER", "SHORE", "SHORT", "SHOWER", "SHRINK", "SHUTTLE", "SIBLING", "SICKNESS", "SIGNAL", "SILENT",
    "SILVER", "SIMPLE", "SISTER", "SITUATION", "SIXTH", "SKETCH", "SLEEP", "SLIGHT", "SLIPPER", "SMALL",
    "SMART", "SMILE", "SMOKING", "SNAKE", "SNOW", "SOCCER", "SOCIAL", "SOCIETY", "SOLAR", "SOLDIER",
    "SOLVE", "SOMEHOW", "SOMETHING", "SOMETIME", "SOPRANO", "SORRY", "SOUND", "SOURCE", "SOUTHERN", "SOVEREIGN",
    "SPACE", "SPEAK", "SPECIAL", "SPEECH", "SPEED", "SPELL", "SPIRIT", "SPOKEN", "SQUARE", "STABLE",
    "STAFF", "STAGE", "STAIR", "STANDARD", "STANDBY", "START", "STATE", "STATION", "STATUE", "STEADY",
    "STEEL", "STILL", "STOCK", "STONE", "STORE", "STORM", "STORY", "STRAIGHT", "STRANGE", "STREET",
    "STRIKE", "STRONG", "STUDENT", "STUDY", "SUBMIT", "SUBTLE", "SUBURB", "SUCCEED", "SUGAR", "SUIT",
    "SUMMER", "SUMMIT", "SUPER", "SUPPLY", "SUPPORT", "SURFACE", "SURGERY", "SURPRISE", "SURVIVE", "SWEET",
    "SWIMMER", "SWITCH", "SWORD", "SYMBOL", "SYSTEM", "TAILOR", "TAKING", "TALENT", "TALK", "TALL",
    "TANGLE", "TARGET", "TASTE", "TEACHER", "TEACHING", "TEMPER", "TENNIS", "TENT", "TERM", "TERRIBLE",
    "THEORY", "THERAPY", "THICK", "THIN", "THINKING", "THIRD", "THIRSTY", "THOUGHT", "THREAT", "THREE",
    "THROW", "THUMB", "THUNDER", "TICKET", "TIGHT", "TIMBER", "TINY", "TIRED", "TITLE", "TOBACCO",
    "TODAY", "TOGETHER", "TOLERATE", "TOMORROW", "TONGUE", "TOTAL", "TOUCH", "TOURIST", "TOWARDS", "TOWER",
    "TOWN", "TOYOTA", "TRACER", "TRACK", "TRADE", "TRAFFIC", "TRAIN", "TRAVEL", "TREAT", "TREND",
    "TRIAL", "TRIBAL", "TRIUMPH", "TROPHY", "TROUBLE", "TRUCK", "TRULY", "TRUST", "TRUTH", "TULIP",
    "TUNNEL", "TWENTY", "TWIN", "TYPICAL", "UNCLE", "UNDER", "UNITE", "UNITY", "UNIVERSE", "UNLIKE",
    "UNTIL", "UPGRADE", "UPON", "UPSET", "URBAN", "URGENT", "USAGE", "USUAL", "UTTER", "VACANT",
    "VALLEY", "VALUE", "VANISH", "VAPOR", "VARIOUS", "VAST", "VECTOR", "VEHICLE", "VELVET", "VENDOR",
    "VENTURE", "VERDICT", "VERSION", "VERY", "VETERAN", "VICTIM", "VICTORY", "VIDEO", "VIEWER", "VILLAGE",
    "VIOLENT", "VIRGIN", "VIRTUE", "VISION", "VISITOR", "VISUAL", "VOICE", "VOLUME", "VOTE", "WAIST",
    "WAITER", "WANDER", "WANTED", "WARMTH", "WARNING", "WARRANT", "WASTE", "WATCH", "WATERMELON", "WAVE",
    "WEALTH", "WEAPON", "WEAR", "WEATHER", "WEEKEND", "WEIGH", "WELCOME", "WELFARE", "WESTERN", "WHEEL",
    "WHEREBY", "WHETHER", "WHICH", "WHILE", "WHITE", "WHOLE", "WIDELY", "WILDLY", "WINDOW", "WINNER",
    "WINTER", "WISH", "WITNESS", "WOMAN", "WONDER", "WOODEN", "WORKER", "WORLD", "WORRY", "WORTH",
    "WRITER", "WRONG", "YACHT", "YELLOW", "YOUNGER", "ZEBRA", "ZERO", "ZODIAC", "ZOMBIE", "ZONE"
];
const WIN_TARGET = 15; // The number of consecutive correct guesses required

let currentWord = "";
let missingLetterIndex = -1;
let score = 0; // This now tracks the CONSECUTIVE correct guesses

// --- DOM Elements (unchanged) ---
const wordDisplay = document.getElementById('word-display');
const guessInput = document.getElementById('guess-input');
const submitButton = document.getElementById('submit-button');
const messageText = document.getElementById('message-text');
const currentScoreSpan = document.getElementById('current-score');
const winTargetSpan = document.getElementById('win-target');
const modal = document.getElementById('game-over-modal');
const modalMessage = document.getElementById('modal-message');
const restartButton = document.getElementById('restart-button');

// Set the win target in the HTML
winTargetSpan.textContent = WIN_TARGET;

/**
 * Picks a random word and a random letter to hide. (unchanged)
 */
function setupNewWord() {
    // 1. Pick a random word
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];

    // 2. Pick a random letter index to hide
    missingLetterIndex = Math.floor(Math.random() * currentWord.length);

    // 3. Create the word display with an underscore
    let displayedWord = "";
    for (let i = 0; i < currentWord.length; i++) {
        if (i === missingLetterIndex) {
            displayedWord += "_";
        } else {
            displayedWord += currentWord[i];
        }
    }
    
    // 4. Update the display
    wordDisplay.textContent = displayedWord.split('').join(' '); // Add spaces for better visual

    // 5. Clear input and message
    guessInput.value = '';
    messageText.textContent = '';
    guessInput.focus();
}

/**
 * Checks the player's guess against the actual missing letter. (MODIFIED)
 */
function checkGuess() {
    const guess = guessInput.value.toUpperCase();
    
    // Simple validation
    if (guess.length !== 1 || !/^[A-Z]$/.test(guess)) {
        messageText.style.color = 'var(--error-color)';
        messageText.textContent = "Please enter a single letter (A-Z).";
        return;
    }

    const correctLetter = currentWord[missingLetterIndex];

    if (guess === correctLetter) {
        // --- Correct Guess (Streak continues) ---
        score++;
        currentScoreSpan.textContent = score;
        
        // Use CSS variables for dark theme colors
        messageText.style.color = 'var(--success-color)';
        messageText.textContent = `✅ Correct! You are on a ${score} streak.`;
        
        if (score >= WIN_TARGET) {
            endGame(true); // Player Wins!
        } else {
            // New word immediately to keep the momentum/streak pressure up
            setTimeout(setupNewWord, 1000); 
        }
    } else {
        // --- Wrong Guess (Streak breaks and resets) ---
        
        // Capture the score before reset for the message
        const failedStreak = score; 
        
        // *** CORE CHANGE: RESET SCORE TO 0 ***
        score = 0;
        currentScoreSpan.textContent = score;

        // Use CSS variables for dark theme colors
        messageText.style.color = 'var(--error-color)';
        
        // Updated message to reflect the streak reset
        let failMessage = `❌ Wrong! The correct letter was '${correctLetter}'. The word was ${currentWord}.`;
        if (failedStreak > 0) {
            failMessage += ` Streak broken! (You were at ${failedStreak})`;
        } else {
             failMessage += ` Try again!`;
        }
        messageText.textContent = failMessage;
        
        // Player gets a wrong guess, a new word appears
        setTimeout(setupNewWord, 3000); // Wait longer to show the answer and reset
    }
}

/**
 * Handles the end of the game (win condition met). (unchanged)
 * @param {boolean} won - True if the player won.
 */
function endGame(won) {
    if (won) {
        modalMessage.textContent = `🏆 CONGRATULATIONS! You achieved a ${WIN_TARGET} word streak!`;
    }
    modal.style.display = "block"; // Show the popup
}

/**
 * Resets the game state and starts a new game. (unchanged)
 */
function restartGame() {
    score = 0;
    currentScoreSpan.textContent = score;
    modal.style.display = "none"; // Hide the popup
    setupNewWord();
}

// --- Event Listeners (unchanged) ---
submitButton.addEventListener('click', checkGuess);
guessInput.addEventListener('keypress', function(event) {
    // Check guess on Enter key press
    if (event.key === 'Enter') {
        checkGuess();
    }
});
restartButton.addEventListener('click', restartGame);


// Start the game for the first time
setupNewWord();