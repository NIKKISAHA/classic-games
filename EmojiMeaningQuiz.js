const quizData = [
    // --- Originals (Simplified and Flag-Free) ---
    { emoji: "🧑‍🚀🥔🔴", options: ["Interstellar", "Gravity", "The Martian", "Moon"], answer: "The Martian" },
    { emoji: "🦁👑🎶", options: ["The Lion King", "Jungle Book", "Zootopia", "Madagascar"], answer: "The Lion King" },
    { emoji: "⚡👓🦉", options: ["Harry Potter", "Lord of the Rings", "Doctor Strange", "Percy Jackson"], answer: "Harry Potter" },
    { emoji: "🕷️🕸️🗽", options: ["Ant-Man", "Spider-Man", "Venom", "Batman"], answer: "Spider-Man" },
    { emoji: "🚢🧊💔", options: ["Titanic", "Frozen", "Aquaman", "Moana"], answer: "Titanic" },
    { emoji: "☃️👸❄️", options: ["Frozen", "Inception", "Tenet", "Encanto"], answer: "Frozen" },
    { emoji: "🦖ゲート", options: ["Jurassic Park", "King Kong", "Ice Age", "Godzilla"], answer: "Jurassic Park" },
    { emoji: "🦇💰🌃", options: ["Batman", "The Dark Knight", "Venom", "Joker"], answer: "The Dark Knight" },
    { emoji: "🏎️💨🔟", options: ["Cars", "Fast & Furious", "Speed", "Transformers"], answer: "Fast & Furious" },
    { emoji: "👸🏻🍎🧙‍♀️", options: ["Frozen", "Brave", "Cinderella", "Snow White"], answer: "Snow White" },
    { emoji: "👽📞🚲", options: ["E.T.", "Men in Black", "Alien", "Avatar"], answer: "E.T." },
    { emoji: "🧞‍♂️ランプ🕌", options: ["Aladdin", "Arabian Nights", "Sinbad", "The Mummy"], answer: "Aladdin" },
    { emoji: "🏹🔥👧", options: ["Brave", "The Hunger Games", "Robin Hood", "Mulan"], answer: "The Hunger Games" },
    { emoji: "🐠🎈👨‍👦", options: ["Finding Nemo", "Moana", "Shark Tale", "The Little Mermaid"], answer: "Finding Nemo" },
    { emoji: "🚀🪐👨‍🌾", options: ["Interstellar", "Gravity", "The Martian", "Apollo 13"], answer: "Interstellar" },
    { emoji: "🧛‍♂️⚰️🦇", options: ["Dracula", "Twilight", "Hotel Transylvania", "Van Helsing"], answer: "Dracula" },
    { emoji: "🦸‍♂️🧤💎", options: ["Avengers", "Iron Man", "Doctor Strange", "Hulk"], answer: "Avengers" },
    { emoji: "🦍🏢🗽", options: ["King Kong", "Planet of the Apes", "Godzilla", "Rampage"], answer: "King Kong" },
    { emoji: "🤠🐍🗿", options: ["Indiana Jones", "The Mummy", "Harry Potter", "National Treasure"], answer: "Indiana Jones" },
    { emoji: "👻🚫🔦", options: ["Ghostbusters", "Conjuring", "Insidious", "Paranormal Activity"], answer: "Ghostbusters" },
    { emoji: "⚛️👨‍🔬💣", options: ["Oppenheimer", "Iron Man", "Breaking Bad", "The Prestige"], answer: "Oppenheimer" },
    { emoji: "💍🌋🧝", options: ["Lord of the Rings", "The Hobbit", "Narnia", "Willow"], answer: "Lord of the Rings" },
    { emoji: "🕶️💊🐇", options: ["The Matrix", "Inception", "Tenet", "Equilibrium"], answer: "The Matrix" },
    { emoji: "🎈🏠👴", options: ["Up", "Coco", "Inside Out", "Soul"], answer: "Up" },
    { emoji: "👩‍🚀🛰️繩", options: ["Gravity", "Interstellar", "Alien", "Ad Astra"], answer: "Gravity" },
    { emoji: "🐘👂🏼🎪", options: ["Dumbo", "Madagascar", "Bambi", "Tarzan"], answer: "Dumbo" },
    { emoji: "🧑‍🍳🐀 Paris", options: ["Ratatouille", "Chef", "Zootopia", "Bolt"], answer: "Ratatouille" },
    { emoji: "💚🐸👸", options: ["Shrek", "Sleeping Beauty", "Tangled", "Frozen"], answer: "Shrek" },
    { emoji: "🤡🎭🔥", options: ["Joker", "Batman Begins", "V for Vendetta", "Fight Club"], answer: "Joker" },
    { emoji: "💤🧠🏰", options: ["Inception", "Tenet", "The Matrix", "Looper"], answer: "Inception" },
    { emoji: "🦸‍♀️盾️⭐️", options: ["Wonder Woman", "Captain Marvel", "Black Widow", "Supergirl"], answer: "Wonder Woman" },
    { emoji: "🐧 tap🎵", options: ["Happy Feet", "Madagascar", "Frozen", "Penguins of Madagascar"], answer: "Happy Feet" },
    { emoji: "🧙‍♂️🔮👁️", options: ["Doctor Strange", "The Prestige", "Now You See Me", "Hugo"], answer: "Doctor Strange" },
    { emoji: "🦸‍♂️👨‍👩‍👧‍👦", options: ["Inside Out", "The Incredibles", "Toy Story", "Luca"], answer: "The Incredibles" },
    { emoji: "🐒🐍🐻", options: ["The Jungle Book", "Tarzan", "Prince of Egypt", "Noah"], answer: "The Jungle Book" },
    { emoji: "👧🌊🛶", options: ["Moana", "How to Train Your Dragon", "Avatar", "Atlantis"], answer: "Moana" },
    { emoji: "🦢🩰🖤", options: ["Black Swan", "Swan Lake", "Step Up", "La La Land"], answer: "Black Swan" },
    { emoji: "🎤👨‍🎤👑", options: ["Bohemian Rhapsody", "Rocketman", "Elvis", "Yesterday"], answer: "Bohemian Rhapsody" },
    { emoji: "🤠 Whip🏺", options: ["Indiana Jones", "The Mummy", "National Treasure", "Jumanji"], answer: "Indiana Jones" },
    { emoji: "🎮💻🕶️", options: ["Ready Player One", "Free Guy", "Tron", "Pixels"], answer: "Ready Player One" },
    { emoji: "🧟‍♂️🏃‍♂️🏙️", options: ["World War Z", "Resident Evil", "I Am Legend", "Zombieland"], answer: "World War Z" },
    { emoji: "👧📚📝", options: ["Harry Potter", "Matilda", "The Breakfast Club", "Mean Girls"], answer: "Matilda" },
    { emoji: "🦸‍♂️🕰️💥", options: ["Avengers: Endgame", "Iron Man", "Guardians of the Galaxy", "Eternals"], answer: "Avengers: Endgame" },
    { emoji: "🕵️‍♂️🎩🔎", options: ["Sherlock Holmes", "Knives Out", "Se7en", "The Batman"], answer: "Sherlock Holmes" },
    { emoji: "🐵👨‍🚀🔫", options: ["Planet of the Apes", "Ad Astra", "Gravity", "Interstellar"], answer: "Planet of the Apes" },
    { emoji: "🚲🌙👽", options: ["E.T.", "Looper", "La La Land", "Big Hero 6"], answer: "E.T." },
    { emoji: "👻📞🚫", options: ["Ghostbusters", "The Call", "Scream", "Paranormal Activity"], answer: "Ghostbusters" },
    { emoji: "💃🎶🌃", options: ["La La Land", "Grease", "Step Up", "Mamma Mia"], answer: "La La Land" },
    { emoji: "🕷️🧑‍⚕️💔", options: ["Spider-Man: No Way Home", "Venom", "Doctor Strange", "Black Panther"], answer: "Spider-Man: No Way Home" },
    { emoji: "👶🏠🔫", options: ["Home Alone", "Skyfall", "Die Hard", "Mission Impossible"], answer: "Home Alone" },

    // --- New & Simplified Questions (51-200) ---
    { emoji: "👩‍💼👠💋", options: ["Cinderella", "Pretty Woman", "My Fair Lady", "Breakfast at Tiffany's"], answer: "Pretty Woman" },
    { emoji: "🍎🔪👸", options: ["Snow White", "Maleficent", "Sleeping Beauty", "Enchanted"], answer: "Snow White" },
    { emoji: "🏴‍☠️🚢⚔️", options: ["Hook", "Pirates of the Caribbean", "Moby Dick", "Master and Commander"], answer: "Pirates of the Caribbean" },
    { emoji: "👦🤖🧸", options: ["A.I. Artificial Intelligence", "Bumblebee", "Robots", "Astro Boy"], answer: "A.I. Artificial Intelligence" },
    { emoji: "🔪📞😱", options: ["Scream", "A Quiet Place", "The Ring", "Halloween"], answer: "Scream" },
    { emoji: "🎤⭐💔", options: ["A Star Is Born", "School of Rock", "Purple Rain", "The Commitments"], answer: "A Star Is Born" },
    { emoji: "👨‍💼🐺💵", options: ["The Wolf of Wall Street", "Wall Street", "American Psycho", "Margin Call"], answer: "The Wolf of Wall Street" },
    { emoji: " DeLorean ⏰", options: ["The Time Traveler's Wife", "Groundhog Day", "Back to the Future", "A Christmas Carol"], answer: "Back to the Future" },
    { emoji: "🏝️🏐🗣️", options: ["Cast Away", "Blue Lagoon", "The Beach", "Life of Pi"], answer: "Cast Away" },
    { emoji: "👠👗🐭", options: ["A Little Princess", "Matilda", "Ella Enchanted", "Cinderella"], answer: "Cinderella" },
    { emoji: "👨‍ 전투🛡️", options: ["Gladiator", "Braveheart", "Kingdom of Heaven", "Troy"], answer: "Gladiator" },
    { emoji: "🐻🍯🎈", options: ["Winnie the Pooh", "Paddington", "Grizzly Man", "Brother Bear"], answer: "Winnie the Pooh" },
    { emoji: "👶🏻🏠🚨", options: ["Boss Baby", "Baby's Day Out", "Look Who's Talking", "Three Men and a Baby"], answer: "Baby's Day Out" },
    { emoji: "👧🧠😡", options: ["Inside Out", "Soul", "Coco", "A Wrinkle in Time"], answer: "Inside Out" },
    { emoji: "✈️🐍🐍", options: ["Snakes on a Plane", "Con Air", "Air Force One", "Flight"], answer: "Snakes on a Plane" },
    { emoji: "🧟‍♂️🍻 pub", options: ["Shaun of the Dead", "28 Days Later", "Warm Bodies", "Train to Busan"], answer: "Shaun of the Dead" },
    { emoji: "🕶️👽🔫", options: ["Men in Black", "District 9", "The Fifth Element", "Edge of Tomorrow"], answer: "Men in Black" },
    { emoji: "🚂💸🔪", options: ["Polar Express", "Unstoppable", "Source Code", "Murder on the Orient Express"], answer: "Murder on the Orient Express" },
    { emoji: "👦🔪🏡", options: ["Problem Child", "The Omen", "Bad Seed", "The Good Son"], answer: "The Good Son" },
    { emoji: "💍💰 Asia", options: ["Crazy Rich Asians", "My Big Fat Greek Wedding", "Wedding Crashers", "The Proposal"], answer: "Crazy Rich Asians" },
    { emoji: "👨‍🏫📚🎤", options: ["Dead Poets Society", "Good Will Hunting", "Whiplash", "Mona Lisa Smile"], answer: "Dead Poets Society" },
    { emoji: "🦍🗣️🏛️", options: ["Space Chimps", "Planet of the Apes", "Gravity", "2001: A Space Odyssey"], answer: "Planet of the Apes" },
    { emoji: "📝☔️❤️", options: ["The Notebook", "About Time", "P.S. I Love You", "When Harry Met Sally"], answer: "The Notebook" },
    { emoji: "👩‍🦱🏹🐻", options: ["Brave", "Brother Bear", "The Revenant", "Into the Wild"], answer: "Brave" },
    { emoji: "🔪👨‍🍳🍔", options: ["Chef", "Burnt", "No Reservations", "Pulp Fiction"], answer: "Pulp Fiction" },
    { emoji: "🕳️👧🐇", options: ["Alice in Wonderland", "Donnie Darko", "The Matrix", "Zootopia"], answer: "Alice in Wonderland" },
    { emoji: "👨‍🏫🎸🎶", options: ["School of Rock", "High School Musical", "Lemonade Mouth", "Sing"], answer: "School of Rock" },
    { emoji: "👦🏠🎄", options: ["Home Alone", "Elf", "The Polar Express", "A Christmas Story"], answer: "Home Alone" },
    { emoji: "👨‍🏫📈📉", options: ["The Big Short", "Moneyball", "The Social Network", "Wolf of Wall Street"], answer: "The Big Short" },
    { emoji: "👨‍🌾🐴🐺", options: ["War Horse", "Field of Dreams", "Dances with Wolves", "Brokeback Mountain"], answer: "Dances with Wolves" },
    { emoji: "👑🗣️ speech", options: ["The King's Speech", "The Queen", "Elizabeth", "A Royal Affair"], answer: "The King's Speech" },
    { emoji: "🤵‍♂️🔫🐶", options: ["John Wick", "Taken", "The Equalizer", "Taxi Driver"], answer: "John Wick" },
    { emoji: "🎤🚀 Elton", options: ["Rocketman", "Bohemian Rhapsody", "Walk the Line", "Elvis"], answer: "Rocketman" },
    { emoji: "🦸‍♂️🛡️ hero", options: ["Captain America", "Wonder Woman", "Superman", "Black Panther"], answer: "Captain America" },
    { emoji: "👸🐸💋", options: ["The Princess and the Frog", "Enchanted", "Shrek", "Rango"], answer: "The Princess and the Frog" },
    { emoji: "👨‍👩‍👧‍👦🏠🎈", options: ["Up", "The Incredibles", "Coco", "Toy Story"], answer: "Up" },
    { emoji: "👦🐉🔥", options: ["Moana", "How to Train Your Dragon", "Avatar", "Atlantis"], answer: "How to Train Your Dragon" },
    { emoji: "🐒🌴🎶", options: ["Jungle Book", "Tarzan", "Moana", "Sing"], answer: "Jungle Book" },
    { emoji: "👩‍🎤🎤 nuns", options: ["Sister Act", "Pitch Perfect", "The Sound of Music", "Footloose"], answer: "Sister Act" },
    { emoji: "💻👥 Mark", options: ["The Social Network", "Jobs", "Wreck-It Ralph", "Ready Player One"], answer: "The Social Network" },
    { emoji: "👩‍🦱💎💵", options: ["Gentlemen Prefer Blondes", "Breakfast at Tiffany's", "How to Marry a Millionaire", "Diamonds Are Forever"], answer: "Gentlemen Prefer Blondes" },
    { emoji: "👨‍🎨🚢💔", options: ["Titanic", "My Fair Lady", "The Great Gatsby", "Frida"], answer: "Titanic" },
    { emoji: "🪓❄️🏨", options: ["The Shining", "Misery", "Fargo", "No Country for Old Men"], answer: "The Shining" },
    { emoji: "👽🥚🚀", options: ["Alien", "E.T.", "Prometheus", "Close Encounters of the Third Kind"], answer: "Alien" },
    { emoji: "👧🏽🧭👑", options: ["Dora and the Lost City of Gold", "Tomb Raider", "National Treasure", "Indiana Jones"], answer: "Dora and the Lost City of Gold" },
    { emoji: "👦🏽💀🎶", options: ["Coco", "Encanto", "Soul", "The Book of Life"], answer: "Coco" },
    { emoji: "👵🏼👨‍💼🚗", options: ["Driving Miss Daisy", "Planes, Trains & Automobiles", "Thelma & Louise", "Little Miss Sunshine"], answer: "Driving Miss Daisy" },
    { emoji: "👦👻🧠", options: ["Silence of the Lambs", "Se7en", "The Sixth Sense", "Shutter Island"], answer: "The Sixth Sense" },
    { emoji: "🐰🦊👮‍♀️", options: ["Zootopia", "Sing", "Bolt", "The Secret Life of Pets"], answer: "Zootopia" },
    { emoji: "🤠🤖🌌", options: ["Toy Story", "Stand by Me", "The Goonies", "The Sandlot"], answer: "Toy Story" },

    // --- Newly Added for Clarity & Variety (101-200) ---
    { emoji: "🦖🌴🔥", options: ["Jurassic World", "King Kong", "Godzilla", "Ice Age"], answer: "Jurassic World" },
    { emoji: "🦸‍♂️🔨⚡", options: ["Thor", "Iron Man", "Captain America", "Hulk"], answer: "Thor" },
    { emoji: "🧙‍♀️💼⚡", options: ["Harry Potter", "Fantastic Beasts", "The Chronicles of Narnia", "Percy Jackson"], answer: "Fantastic Beasts" },
    { emoji: "🕷️🧑‍🏫", options: ["Spider-Man: Homecoming", "Venom", "Doctor Strange", "Ant-Man"], answer: "Spider-Man: Homecoming" },
    { emoji: "👨‍🚀🔭🌌", options: ["Interstellar", "Ad Astra", "Gravity", "The Martian"], answer: "Ad Astra" },
    { emoji: "🦖🌋💔", options: ["Jurassic World: Fallen Kingdom", "Godzilla", "King Kong", "Ice Age"], answer: "Jurassic World: Fallen Kingdom" },
    { emoji: "🐉👦🧊", options: ["How to Train Your Dragon", "Shrek", "Dragonheart", "Kung Fu Panda"], answer: "How to Train Your Dragon" },
    { emoji: "🕵️‍♂️🔪🧶", options: ["Knives Out", "Sherlock Holmes", "The Batman", "Zodiac"], answer: "Knives Out" },
    { emoji: "🐶🦴🚽", options: ["The Secret Life of Pets", "Bolt", "101 Dalmatians", "Lassie"], answer: "The Secret Life of Pets" },
    { emoji: "🤡🚓🌃", options: ["Joker", "The Dark Knight", "Venom", "Batman Begins"], answer: "Joker" },
    { emoji: "🦸‍♀️ lasso️⭐️", options: ["Wonder Woman 1984", "Captain Marvel", "Black Widow", "Supergirl"], answer: "Wonder Woman 1984" },
    { emoji: "🧟‍♂️🚇 subway", options: ["World War Z", "28 Days Later", "Zombieland", "Train to Busan"], answer: "28 Days Later" },
    { emoji: "👩‍🚀🛰️🔴", options: ["The Martian", "Gravity", "Ad Astra", "Interstellar"], answer: "The Martian" },
    { emoji: "🦁👑👶", options: ["The Lion King 2019", "The Lion King", "Madagascar", "Jungle Book"], answer: "The Lion King 2019" },
    { emoji: "🧝‍♂️🗡️🐉", options: ["The Hobbit: An Unexpected Journey", "The Lord of the Rings", "Narnia", "Willow"], answer: "The Hobbit: An Unexpected Journey" },
    { emoji: "🏹🔥 arena", options: ["The Hunger Games: Catching Fire", "The Hunger Games", "Brave", "Robin Hood"], answer: "The Hunger Games: Catching Fire" },
    { emoji: "🐠🐟💙", options: ["Finding Dory", "Finding Nemo", "Shark Tale", "The Little Mermaid"], answer: "Finding Dory" },
    { emoji: "🧛‍♀️🐺🏫", options: ["Twilight", "Dracula Untold", "Hotel Transylvania", "The Vampire Diaries"], answer: "Twilight" },
    { emoji: "🦍🏢💥", options: ["Rampage", "King Kong", "Godzilla", "Jurassic World"], answer: "Rampage" },
    { emoji: "🐵🧠💊", options: ["Rise of the Planet of the Apes", "Planet of the Apes", "War for the Planet of the Apes", "King Kong"], answer: "Rise of the Planet of the Apes" },
    { emoji: "🦹‍♂️🖤👅", options: ["Venom", "Joker", "The Batman", "Darkman"], answer: "Venom" },
    { emoji: "🧙‍♂️🧹⚡", options: ["The Sorcerer's Apprentice", "Harry Potter", "Doctor Strange", "The Prestige"], answer: "The Sorcerer's Apprentice" },
    { emoji: "🧝‍♂️🐉🏔️", options: ["The Hobbit: The Desolation of Smaug", "The Lord of the Rings", "Willow", "Eragon"], answer: "The Hobbit: The Desolation of Smaug" },
    { emoji: "🎮💻💵", options: ["Free Guy", "Ready Player One", "Tron", "Wreck-It Ralph"], answer: "Free Guy" },
    { emoji: "🚗💨🏁3", options: ["Cars 3", "Speed Racer", "Fast & Furious", "Turbo"], answer: "Cars 3" },
    { emoji: "🎤⭐Bradley", options: ["A Star is Born", "La La Land", "Rocketman", "Bohemian Rhapsody"], answer: "A Star is Born" },
    { emoji: "🦖🧑‍🚀🧊", options: ["Jurassic World: Dominion", "Jurassic Park", "King Kong", "Godzilla"], answer: "Jurassic World: Dominion" },
    { emoji: "👑🧙‍♂️👁️", options: ["The Lord of the Rings: The Two Towers", "The Hobbit", "The Chronicles of Narnia", "Willow"], answer: "The Lord of the Rings: The Two Towers" },
    { emoji: "🧞‍♂️🕌🎶", options: ["Aladdin 2019", "Aladdin", "Arabian Nights", "Sinbad"], answer: "Aladdin 2019" },
    { emoji: "🕷️🕸️🎨", options: ["Spider-Man: Into the Spider-Verse", "Spider-Man", "Venom", "Doctor Strange"], answer: "Spider-Man: Into the Spider-Verse" },
    { emoji: "🦸‍♂️💰💥", options: ["Iron Man 3", "Avengers: Infinity War", "Avengers: Endgame", "Hulk"], answer: "Iron Man 3" },
    { emoji: "👨‍🚀🔭💔", options: ["Ad Astra", "The Martian", "Gravity", "Interstellar"], answer: "Ad Astra" },
    { emoji: "🦸‍♀️💥⭐️", options: ["Captain Marvel", "Wonder Woman", "Black Widow", "Supergirl"], answer: "Captain Marvel" },
    { emoji: "🐧🎤🎶", options: ["Sing", "Happy Feet", "Madagascar", "Penguins of Madagascar"], answer: "Sing" },
    { emoji: "🧙‍♂️🌀👁️‍🗨️", options: ["Doctor Strange in the Multiverse of Madness", "The Prestige", "Now You See Me", "Hugo"], answer: "Doctor Strange in the Multiverse of Madness" },
    { emoji: "🛵🍋 Italy", options: ["Luca", "Inside Out", "The Incredibles", "Toy Story"], answer: "Luca" },
    { emoji: "🧟‍♀️💊🏙️", options: ["Resident Evil: Welcome to Raccoon City", "World War Z", "I Am Legend", "Zombieland"], answer: "Resident Evil: Welcome to Raccoon City" },
    { emoji: "🦄🌈🎤", options: ["My Little Pony", "Trolls", "Frozen", "Shrek"], answer: "Trolls" },
    { emoji: "🐺🌕🏀", options: ["The Wolf of Wall Street", "Twilight", "Teen Wolf", "Underworld"], answer: "Teen Wolf" },
    { emoji: "🧙‍♀️💼🦁", options: ["Harry Potter", "Fantastic Beasts", "Percy Jackson", "The Sorcerer's Apprentice"], answer: "Fantastic Beasts" },
    { emoji: "🧟‍♂️💰🎲", options: ["Army of the Dead", "Zombieland", "World War Z", "Resident Evil"], answer: "Army of the Dead" },
    { emoji: "👽🛸 hero", options: ["Men in Black", "E.T.", "Alien", "Independence Day"], answer: "Independence Day" },
    { emoji: "🦸‍♂️🛡️ ice", options: ["Captain America: The First Avenger", "Avengers", "Iron Man", "Hulk"], answer: "Captain America: The First Avenger" },
    { emoji: "🏎️💨🌍9", options: ["Fast & Furious 9", "Speed Racer", "Cars 2", "Turbo"], answer: "Fast & Furious 9" },
    { emoji: "👨‍🚀🚀 Buzz", options: ["Lightyear", "Ad Astra", "The Martian", "Interstellar"], answer: "Lightyear" },
    { emoji: "🧞‍♂️👑💍", options: ["Aladdin and the King of Thieves", "Aladdin 2019", "Arabian Nights", "Sinbad"], answer: "Aladdin and the King of Thieves" },
    { emoji: "🎤🚀 Bernie", options: ["Bohemian Rhapsody", "Rocketman", "A Star is Born", "Yesterday"], answer: "Rocketman" },
    { emoji: "🦖🚁🌋", options: ["Jurassic Park III", "King Kong", "Jurassic World", "Godzilla"], answer: "Jurassic Park III" },
    { emoji: "🧝‍♂️🗡️⚔️", options: ["The Hobbit: The Battle of the Five Armies", "The Lord of the Rings", "Willow", "Eragon"], answer: "The Hobbit: The Battle of the Five Armies" },
    { emoji: "🦸‍♀️⭐️ lasso", options: ["Wonder Woman 1984", "Captain Marvel", "Black Widow", "Supergirl"], answer: "Wonder Woman 1984" },
    { emoji: "🐉👦🏔️", options: ["How to Train Your Dragon 2", "Shrek", "Dragonheart", "Kung Fu Panda 2"], answer: "How to Train Your Dragon 2" },
    { emoji: "🦸‍♂️ Thanos 💥", options: ["Avengers: Infinity War", "Avengers: Endgame", "Iron Man 3", "Doctor Strange"], answer: "Avengers: Infinity War" },
    { emoji: "🦖⛵️🏝️", options: ["Jurassic World: Camp Cretaceous", "Ice Age", "King Kong", "Godzilla"], answer: "Jurassic World: Camp Cretaceous" },
    { emoji: "🕷️🧑‍🌍", options: ["Spider-Man: Far From Home", "Venom", "Spider-Man", "Doctor Strange"], answer: "Spider-Man: Far From Home" },
    { emoji: "🧝‍♂️🏔️💍", options: ["The Hobbit: An Unexpected Journey", "Willow", "Eragon", "The Chronicles of Narnia"], answer: "The Hobbit: An Unexpected Journey" },
    { emoji: "🦹‍♂️👊🏻🐲", options: ["Shang-Chi", "Black Panther", "Doctor Strange", "Iron Man 2"], answer: "Shang-Chi" },
    { emoji: "👩‍🚀🌑 space", options: ["Moon", "Ad Astra", "Interstellar", "Gravity"], answer: "Moon" },
    { emoji: "🐉👦💙", options: ["How to Train Your Dragon: The Hidden World", "Dragonheart", "Shrek 2", "Kung Fu Panda 3"], answer: "How to Train Your Dragon: The Hidden World" },
    { emoji: "🕵️‍♂️🔪🍷", options: ["Knives Out 2", "Se7en", "The Batman", "The Invisible Man"], answer: "Knives Out 2" },
    { emoji: "⚡👓🛡️", options: ["Harry Potter: The Order of the Phoenix", "Fantastic Beasts", "Percy Jackson", "The Sorcerer's Apprentice"], answer: "Harry Potter: The Order of the Phoenix" },
    { emoji: "🎤👨‍🎤 Elton", options: ["Bohemian Rhapsody 2", "Rocketman", "A Star is Born", "Yesterday"], answer: "Rocketman" },
    { emoji: "🧛‍♂️🩸🔬", options: ["Morbius", "Dracula Untold", "Hotel Transylvania", "Twilight"], answer: "Morbius" },
    { emoji: "🦍🏙️ atomic", options: ["Godzilla vs. Kong", "King Kong", "Rampage", "Jurassic World"], answer: "Godzilla vs. Kong" },
    { emoji: "🦸‍♀️💥⭐️", options: ["Captain Marvel", "Wonder Woman 1984", "Black Widow", "Supergirl"], answer: "Captain Marvel" },
    { emoji: "👽🛸 city", options: ["Independence Day: Resurgence", "Men in Black: International", "E.T.", "Alien"], answer: "Independence Day: Resurgence" },
    { emoji: "🧟‍♂️🔫🍔", options: ["Army of the Dead", "Zombieland: Double Tap", "World War Z", "Resident Evil"], answer: "Zombieland: Double Tap" },
    { emoji: "🏎️💨 Dwayne", options: ["Fast & Furious: Hobbs & Shaw", "Cars 2", "Speed Racer", "Turbo"], answer: "Fast & Furious: Hobbs & Shaw" },
    { emoji: "👨‍🚀🚀 Sox", options: ["Lightyear", "Ad Astra", "The Martian", "Interstellar"], answer: "Lightyear" },
    { emoji: "🦄🌈🎤2", options: ["Trolls World Tour", "My Little Pony", "Frozen 2", "Shrek Forever After"], answer: "Trolls World Tour" },
    { emoji: "🐺🌕🩸⚔️", options: ["Underworld: Blood Wars", "Twilight Saga", "Teen Wolf", "The Wolfman"], answer: "Underworld: Blood Wars" },
    { emoji: "🧞‍♂️🕌💙", options: ["Aladdin (Live Action)", "Aladdin and the King of Thieves", "Arabian Nights", "Sinbad"], answer: "Aladdin (Live Action)" },
    { emoji: "🎮💻💵", options: ["Free Guy", "Wreck-It Ralph", "Tron: Legacy", "Ready Player One"], answer: "Wreck-It Ralph" },
    { emoji: "🎩🐇⛓️", options: ["Doctor Strange", "The Prestige", "Now You See Me", "Hugo"], answer: "The Prestige" },
    { emoji: "🦸‍♂️👨‍👩‍👧‍👦2", options: ["Luca", "Inside Out", "The Incredibles 2", "Toy Story 4"], answer: "The Incredibles 2" },
    { emoji: "🐠🐟🦈", options: ["Finding Dory", "Finding Nemo", "Shark Tale", "The Little Mermaid"], answer: "Shark Tale" },
    { emoji: "🦢💃🏻✨", options: ["Black Swan", "Swan Lake", "Step Up 2", "La La Land"], answer: "Step Up 2" },
    { emoji: "🧟‍♀️💰🎰", options: ["Resident Evil: Welcome to Raccoon City", "World War Z", "I Am Legend", "Zombieland"], answer: "Army of the Dead" },
    { emoji: "🦖🦕🧊", options: ["Jurassic World: Dominion", "Jurassic World", "King Kong", "Godzilla"], answer: "Jurassic World: Dominion" },
    { emoji: "🕵️‍♂️👑👧", options: ["Enola Holmes", "Knives Out", "Sherlock Holmes", "The Batman"], answer: "Enola Holmes" },
    { emoji: "🦸‍♂️🛡️ vs", options: ["Captain America: Civil War", "Avengers: Infinity War", "Avengers: Endgame", "Iron Man 3"], answer: "Captain America: Civil War" },
    { emoji: "🧙‍♂️⚡🦌", options: ["Fantastic Beasts: The Secrets of Dumbledore", "Harry Potter", "The Sorcerer's Apprentice", "Percy Jackson"], answer: "Fantastic Beasts: The Secrets of Dumbledore" },
    { emoji: "🎤⭐Lady", options: ["Rocketman", "Bohemian Rhapsody", "A Star is Born", "Yesterday"], answer: "A Star is Born" },
    { emoji: "🧛‍♂️🏨4", options: ["Hotel Transylvania 4", "Twilight", "Morbius", "Dracula Untold"], answer: "Hotel Transylvania 4" },
    { emoji: "🦍🆚🦖", options: ["Godzilla vs. Kong", "Rampage", "King Kong", "Jurassic World"], answer: "Godzilla vs. Kong" },
    { emoji: "🦸‍♀️ Natalia", options: ["Wonder Woman 1984", "Captain Marvel", "Black Widow", "Supergirl"], answer: "Black Widow" },
    { emoji: "👽🛸🕶️", options: ["Men in Black: International", "Independence Day: Resurgence", "E.T.", "Alien"], answer: "Men in Black: International" },
    { emoji: "🧟‍♂️🏞️🔫2", options: ["Army of the Dead", "Zombieland: Double Tap", "World War Z", "Resident Evil"], answer: "Zombieland: Double Tap" },
    { emoji: "🏎️💨 Rome", options: ["Fast X", "Fast & Furious 9", "Speed Racer", "Cars 2"], answer: "Fast X" },
    { emoji: "🧞‍♂️🕌💙", options: ["Aladdin (Live Action)", "Aladdin and the King of Thieves", "Arabian Nights", "Sinbad"], answer: "Aladdin (Live Action)" },
    { emoji: "🧙‍♂️🌀 chaos", options: ["Doctor Strange in the Multiverse of Madness", "The Prestige", "Hugo", "Now You See Me"], answer: "Doctor Strange in the Multiverse of Madness" },
    { emoji: "🛵🍋🌊", options: ["Luca", "Inside Out", "The Incredibles 2", "Toy Story 4"], answer: "Luca" },
    { emoji: "🧑‍🚀🪐⭐️", options: ["Ad Astra", "Interstellar", "Gravity", "The Martian"], answer: "Ad Astra" },
    { emoji: "🦁🦓🌴", options: ["Madagascar", "The Lion King", "Zootopia", "Jungle Book"], answer: "Madagascar" },
    { emoji: "👧📚🧙‍♀️", options: ["Harry Potter", "Matilda", "The Sorcerer's Apprentice", "Fantastic Beasts"], answer: "Matilda" },
    { emoji: "🕷️🏙️ Andrew", options: ["Spider-Man", "Venom", "The Amazing Spider-Man", "Morbius"], answer: "The Amazing Spider-Man" },
    { emoji: "🚢🌊🌪️", options: ["Titanic", "The Poseidon Adventure", "Poseidon", "The Perfect Storm"], answer: "The Perfect Storm" },
    { emoji: "👧☀️🌺", options: ["Frozen", "Brave", "Moana", "Encanto"], answer: "Encanto" },
    { emoji: "🦖🌋👦", options: ["Jurassic World", "King Kong", "Ice Age", "Godzilla"], answer: "Jurassic World" },
    { emoji: "🦇🕶️🃏", options: ["The Batman", "Joker", "Batman Begins", "The Dark Knight"], answer: "The Batman" },
    { emoji: "🚗💨🐌", options: ["Cars", "Turbo", "Speed Racer", "Fast & Furious"], answer: "Turbo" },
    { emoji: "☃️👸❄️2", options: ["Frozen 2", "Frozen", "Brave", "Moana"], answer: "Frozen 2" },
    { emoji: "👽🛸👦🏻", options: ["E.T.", "Alien", "Men in Black", "The Iron Giant"], answer: "The Iron Giant" },
    { emoji: "🧞‍♂️💎Cave", options: ["Aladdin 2019", "Aladdin", "Arabian Nights", "Sinbad"], answer: "Aladdin 2019" },
    { emoji: "🏹🔥🎎", options: ["The Hunger Games", "Brave", "Robin Hood", "Mulan"], answer: "Mulan" },
    { emoji: "🐟👨‍👦Dory", options: ["Finding Nemo", "Finding Dory", "Shark Tale", "The Little Mermaid"], answer: "Finding Dory" },
    { emoji: "🚀🌕🧑‍🚀", options: ["Apollo 13", "Interstellar", "The Martian", "Gravity"], answer: "Apollo 13" },
    { emoji: "🧛‍♀️🧙‍♂️Hotel", options: ["Twilight", "Hotel Transylvania", "Morbius", "The Vampire Diaries"], answer: "Hotel Transylvania" },
    { emoji: "🦸‍♂️🔨⚡💥", options: ["Avengers", "Iron Man", "Thor", "Doctor Strange"], answer: "Thor" },
    { emoji: "🦍🌆🚁", options: ["King Kong", "Rampage", "Godzilla", "Jurassic World"], answer: "Rampage" },
    { emoji: "🐍🗿📜", options: ["Indiana Jones", "The Mummy", "National Treasure", "Tomb Raider"], answer: "Tomb Raider" },
    { emoji: "👻🏚️🕯️", options: ["Conjuring", "Ghostbusters", "Insidious", "Paranormal Activity"], answer: "Conjuring" },
    { emoji: "🧑‍🔬🧪💣", options: ["Oppenheimer", "Breaking Bad", "Iron Man", "The Prestige"], answer: "Oppenheimer" },
    { emoji: "💍🧙‍♂️🏔️", options: ["Lord of the Rings", "The Hobbit", "Narnia", "Willow"], answer: "The Hobbit" },
    { emoji: "💊🕶️🔄", options: ["The Matrix", "Inception", "Tenet", "Equilibrium"], answer: "Tenet" },
    { emoji: "🎈👴🏻🇲🇽", options: ["Up", "Coco", "Inside Out", "Soul"], answer: "Coco" },
    { emoji: "👩‍🚀🌌🔴", options: ["Gravity", "Ad Astra", "Interstellar", "The Martian"], answer: "The Martian" },
    { emoji: "🐘🎪🪄", options: ["Dumbo", "Madagascar", "Bambi", "Tarzan"], answer: "Dumbo" },
    { emoji: "🧑‍🍳🔪🇫🇷", options: ["Ratatouille", "Chef", "Zootopia", "Bolt"], answer: "Chef" },
    { emoji: "🏰👸🏻🍳", options: ["Shrek", "Tangled", "Sleeping Beauty", "Frozen"], answer: "Tangled" },
    { emoji: "🎭💣 Guy", options: ["Joker", "V for Vendetta", "Batman", "The Dark Knight"], answer: "V for Vendetta" },
    { emoji: "💤🕰️🔄", options: ["Inception", "Looper", "The Matrix", "Tenet"], answer: "Looper" },
    { emoji: "🦸‍♀️⚡️💥", options: ["Wonder Woman", "Captain Marvel", "Black Widow", "Supergirl"], answer: "Captain Marvel" },
    { emoji: "🐧🎤🎶🎤", options: ["Happy Feet", "Penguins of Madagascar", "Madagascar", "Sing"], answer: "Sing" },
    { emoji: "🧙‍♂️🕰️🚂", options: ["The Prestige", "Doctor Strange", "Now You See Me", "Hugo"], answer: "Hugo" },
    { emoji: "🎢🏠👧", options: ["Inside Out", "Toy Story 4", "Luca", "The Incredibles 2"], answer: "Inside Out" },
    { emoji: "🐍🌳🐒", options: ["The Jungle Book", "Prince of Egypt", "Tarzan", "Noah"], answer: "Tarzan" },
    { emoji: "🌋🏞️👤", options: ["Moana", "Avatar", "How to Train Your Dragon", "Atlantis"], answer: "Avatar" },
    { emoji: "🦢💃🏻🎶", options: ["Black Swan", "Swan Lake", "La La Land", "Step Up 2"], answer: "La La Land" },
    { emoji: "🎤👨‍🎤 Elvis", options: ["Rocketman", "A Star is Born", "Bohemian Rhapsody", "Elvis"], answer: "Elvis" },
    { emoji: "🤠🏺📜", options: ["Indiana Jones", "The Mummy", "National Treasure", "Tomb Raider"], answer: "National Treasure" },
    { emoji: "🎮👾🔦", options: ["Ready Player One", "Free Guy", "Wreck-It Ralph", "Tron"], answer: "Tron" },
    { emoji: "🧟‍♂️🏙️🐕", options: ["World War Z", "I Am Legend", "Zombieland", "Resident Evil"], answer: "I Am Legend" },
    { emoji: "🎓📚🌊", options: ["Matilda", "Harry Potter", "Percy Jackson", "The Sorcerer's Apprentice"], answer: "Percy Jackson" },
    { emoji: "🦸‍♂️🧤💎🌍", options: ["Avengers: Endgame", "Iron Man", "Guardians of the Galaxy", "Eternals"], answer: "Eternals" },
    { emoji: "🕵️‍♂️🔎📦", options: ["Sherlock Holmes", "Knives Out", "The Batman", "Se7en"], answer: "Se7en" },
    { emoji: "👩‍🚀🌕🚀 China", options: ["Moon", "Ad Astra", "Gravity", "Interstellar"], answer: "Moon" },
    { emoji: "🐉👦🐼", options: ["How to Train Your Dragon 2", "Shrek", "Dragonheart", "Kung Fu Panda 2"], answer: "Kung Fu Panda 2" },
    { emoji: "🦹‍♂️🐆🛡️", options: ["Shang-Chi", "Black Panther", "Doctor Strange", "Iron Man 2"], answer: "Black Panther" },
    { emoji: "🦸‍♂️🩸💊", options: ["Spider-Man: No Way Home", "Venom", "Doctor Strange", "Morbius"], answer: "Morbius" },
    { emoji: "🏎️💨🚘2", options: ["Fast X", "Fast & Furious 9", "Cars 2", "Speed Racer"], answer: "Cars 2" },
    { emoji: "🦄🌈🐴", options: ["Trolls", "Frozen", "Shrek Forever After", "My Little Pony"], answer: "My Little Pony" },
    { emoji: "🐺🌕🩸", options: ["Teen Wolf", "Twilight Saga", "The Wolfman", "Underworld"], answer: "The Wolfman" },
    { emoji: "🧞‍♂️💎Sinbad", options: ["Aladdin (Live Action)", "Aladdin and the King of Thieves", "Arabian Nights", "Sinbad"], answer: "Sinbad" },
    { emoji: "🎮🕹️💾", options: ["Free Guy", "Wreck-It Ralph", "Tron: Legacy", "Ready Player One"], answer: "Tron: Legacy" },
    { emoji: "🧙‍♂️🕰️🪄", options: ["Doctor Strange", "The Prestige", "Now You See Me", "Hugo"], answer: "Doctor Strange" },
    { emoji: "🎢🏡🎈🤠", options: ["Luca", "Toy Story 4", "The Incredibles 2", "Inside Out"], answer: "Toy Story 4" }
];


// --- Theme Toggle Logic (New) ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Function to set the theme
function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        themeToggle.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-theme');
        themeToggle.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// Check for saved theme preference on load
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

// Toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
});

// --- Existing Quiz Logic (Assumed to be here) ---
// (Your existing quiz logic goes below this line, starting with quizData...)

// Example placeholder for your quiz logic, assuming it will be added here:
/*
const quizData = [ ... ];
let currentQuestionIndex = 0;
let score = 0;
... (etc)
*/
let currentQuestion = 0;
let score = 0;
let streak = 0; // counter for consecutive correct answers

const emojiDisplay = document.getElementById("emoji-display");
const optionsContainer = document.getElementById("options-container");
const resultEl = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const scoreEl = document.getElementById("score");


// ----- Shuffle utility -----
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ----- Shuffle questions on start -----
function shuffleQuestions() {
  shuffleArray(quizData);
}

// ----- Create streak popup -----
const streakPopup = document.createElement("div");
streakPopup.id = "streak-popup";
// Only keep functional/animation styles (position and initial state) in JS
streakPopup.style.position = "fixed";
streakPopup.style.top = "50%";
streakPopup.style.left = "50%";
streakPopup.style.transform = "translate(-50%, -50%) scale(0)";
streakPopup.style.opacity = "0";

// **Removed all aesthetic inline styles and moved to CSS**
streakPopup.innerHTML = `
  <h2>🎉 You Win! 🎉</h2>
  <p>10 correct answers in a row!</p>
  <button id="streak-restart-btn">Restart</button>
`;
document.body.appendChild(streakPopup);

// ----- Popup functions -----
function showStreakPopup() {
  streakPopup.style.display = "flex";
  setTimeout(() => {
    streakPopup.style.transform = "translate(-50%, -50%) scale(1)";
    streakPopup.style.opacity = "1";
  }, 50);
}

function hideStreakPopup() {
  streakPopup.style.transform = "translate(-50%, -50%) scale(0)";
  streakPopup.style.opacity = "0";
  setTimeout(() => streakPopup.style.display = "none", 300);
}

document.getElementById("streak-restart-btn").addEventListener("click", () => {
  hideStreakPopup();
  restartGame();
});

// ----- Load a question -----
function loadQuestion() {
  const q = quizData[currentQuestion];
  emojiDisplay.textContent = q.emoji;
  optionsContainer.innerHTML = "";

  // Shuffle options for variety (optional)
  const shuffledOptions = [...q.options];
  shuffleArray(shuffledOptions);

  shuffledOptions.forEach(option => {
    const btn = document.createElement("button");
    btn.textContent = option;
    btn.classList.add("option-btn");
    btn.addEventListener("click", () => selectAnswer(btn, q.answer));
    optionsContainer.appendChild(btn);
  });

  resultEl.textContent = "";
  nextBtn.style.display = "none";
}

// ----- Handle answer selection -----
function selectAnswer(button, correctAnswer) {
  const selected = button.textContent;
  const buttons = document.querySelectorAll(".option-btn");
  buttons.forEach(btn => btn.disabled = true);

  if (selected === correctAnswer) {
    button.classList.add("correct");
    resultEl.textContent = "✅ Correct!";
    score++;
    streak++;
    scoreEl.textContent = score;

    if (streak === 10) {
      showStreakPopup();
      return;
    }
  } else {
    button.classList.add("wrong");
    resultEl.textContent = `❌ Wrong! The correct answer was ${correctAnswer}`;
    streak = 0;
  }

  nextBtn.style.display = "inline-block";
}

// ----- Next button -----
nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < quizData.length) {
    loadQuestion();
  } else {
    showFinalResult();
  }
});

// ----- Final result -----
function showFinalResult() {
  emojiDisplay.textContent = "🏆";
  optionsContainer.innerHTML = "";
  resultEl.textContent = `You scored ${score} / ${quizData.length}!`;
  nextBtn.style.display = "none";
  restartBtn.style.display = "inline-block";
}

// ----- Restart game -----
restartBtn.addEventListener("click", restartGame);

function restartGame() {
  currentQuestion = 0;
  score = 0;
  streak = 0;
  scoreEl.textContent = score;
  restartBtn.style.display = "none";
  hideStreakPopup();

  shuffleQuestions(); // shuffle questions on restart
  loadQuestion();
}

// ----- Initialize -----
shuffleQuestions();
loadQuestion();
