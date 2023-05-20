//COMPONENTS PROGRESSION

/*
    Prototyped:
        -Calendar/season/time counter
        -Main game UI layout
        -Encapsulate code into game object

    Implemented:
        -HTML tag for room's complex
        -Move function to update room's complex

    Fixes:
        -Scoping of setInterval(update_time)

    In progress:
        -Actions(move, attack, explore, etc)
        -Menus(character, inventory, journal)
        -Event messages formatting

    In queue:
        -Combat system
        -Talk/Dialogue
        -Merchant selling/buying
        -Weather
        -Random encounters
*/

const game = {
    //Update time properties
    span_counter: document.getElementById("span-counter"),
    span_time: document.getElementById("span-time"),
    span_season: document.getElementById("span-season"),
    list_times: ["Morning", "Mid-day", "Night"],
    list_seasons: ["Spring", "Summer", "Fall", "Winter"],
    counter: 0,
    counter_time: 0,
    counter_season: 0,
    index_time: 0,
    index_season: 0,

    //Event log/room info properties
    div_event_log: document.getElementById("div-event-log"),
    div_objects: document.getElementById("div-objects"),
    div_npcs: document.getElementById("div-npcs"),
    div_enemies: document.getElementById("div-enemies"),
    div_rooms: document.getElementById("div-rooms"),
    span_complex: document.getElementById("span-complex"),
    span_room: document.getElementById("span-room"),
    div_move_menu1: document.getElementById("div-move-menu1"),
    div_move_menu2: document.getElementById("div-move-menu2"),

    //Toggle div display properties
    list_queue_previous_div: [document.getElementById("div-main")],

    //Player
    player: {
        name: "player",
        race: "human",
        level: 1,
        experience: 0,
        health: 10,
        mana: 0,
        room: "room_adventurers_hold_sanctum"
    },

    keys_of_rooms: {

        room_adventurers_hold: {
            name: "Adventurer's Hold",
            description: `There are a few statues here and a circular pit 
                        in the middle layered with stone steps used for sitting.`,
            forward: "room_adventurers_hold_sanctum"
        },

        room_adventurers_hold_sanctum: {
            complex: "Adventurer's Hold",
            name: "Sanctum",
            description: `There are a few statues here and a circular pit 
                        in the middle layered with stone steps used for sitting.`,
            npcs: [],
            enemies: [],
            objects: [],
            connections: ["room_adventurers_hold_library", "room_adventurers_hold_lounge"]
        },
    
        room_adventurers_hold_library: {
            complex: "Adventurer's Hold",
            name: "Library",
            description: `The shelves are made of stone rather than wood.
                        There are a few single books placed on podiums.`,
            npcs: [],
            enemies: [],
            objects: [],
            connections: ["room_adventurers_hold_sanctum", "room_adventurers_hold_lounge"]
        },
    
        room_adventurers_hold_lounge: {
            complex: "Adventurer's Hold",
            name: "Lounge",
            description: "There are some tables and chairs here. A bar is to the side.",
            npcs: [],
            enemies: [],
            objects: [],
            connections: ["room_adventurers_hold_sanctum", "room_adventurers_hold_library"]
        }
    },

    //Show/hide divs
    hide_div: function (div) {
        document.getElementById(div).style.display = 'none'

        if (this.list_queue_previous_div.length === 2) {
            this.list_queue_previous_div[0].classList.remove('locked')
            this.list_queue_previous_div[1].classList.remove('locked')
            this.list_queue_previous_div.pop()
        } else {
            this.list_queue_previous_div[this.list_queue_previous_div.length - 2].classList.remove('locked')
            this.list_queue_previous_div.pop() 
        }
    },

    show_div_flex: function (div) {
        document.getElementById(div).style.display = 'flex' 
        this.list_queue_previous_div[this.list_queue_previous_div.length - 1].classList.add('locked')
        this.list_queue_previous_div.push(document.getElementById(div))
    },

    show_div_block: function (div) {
        document.getElementById(div).style.display = 'block'
        this.list_queue_previous_div[this.list_queue_previous_div.length - 1].classList.add('locked')
        this.list_queue_previous_div.push(document.getElementById(div))
    },

    //Counter and time/season cycle
    update_time: function () {
        this.counter++
        this.counter_time++
        this.counter_season++
        this.span_counter.innerHTML = this.counter
        

        if (this.counter_time === 300) {
            this.counter_time = 0;

            if (this.index_time !== 2) {
                this.index_time++;
            } else {
                this.index_time = 0;
            }

            this.span_time.innerHTML = this.list_times[this.index_time];
        }

        if (this.counter_season === 3600) {
            this.counter_season = 0;

            if (this.index_season !== 3) {
                this.index_season++;
            } else {
                this.index_season = 0;
            }

            this.span_season.innerHTML = this.list_seasons[this.index_season];
        }
    },

    //Build event log and room info
    build_event_log_room_info: function () {
        this.div_event_log.innerHTML += "Welcome to my game.<br><br>";
        this.div_event_log.innerHTML += "I am proud to present this to you.<br><br>";
        this.div_event_log.innerHTML += "May you have many adventures and enjoy this mobile game!<br><br>";
        
        for (let i = 1; i <= 10; i++) {
            this.div_objects.innerHTML += "Object " + i + "<br>";
        }

        for (let i = 1; i <= 10; i++) {
            this.div_npcs.innerHTML += "NPC " + i + "<br>";
        }

        for (let i = 1; i <= 10; i++) {
            this.div_enemies.innerHTML += "Enemy " + i + "<br>";
        }
    },

    //Build rooms list
    build_list_rooms: function () {
        const connections = this.keys_of_rooms[this.player.room].connections;
        for (let i = 0; i < connections.length; i++) {
            const span = document.createElement("span");
            span.innerHTML = this.keys_of_rooms[connections[i]].name;
            this.div_rooms.appendChild(span);
        }
    },

    //Build move menu & move action
    build_move_menu: function () {
        const connections = this.keys_of_rooms[this.player.room].connections;
        for (let i = 0; i < connections.length; i++) {
            const button = document.createElement("button");

            button.onclick = (event) => {
                if (this.keys_of_rooms[event.target.getAttribute("data-info")].complex) {
                    this.span_complex.innerHTML = this.keys_of_rooms[event.target.getAttribute("data-info")].complex
                }

                this.span_room.innerHTML = this.keys_of_rooms[event.target.getAttribute("data-info")].name;
                this.player.room = event.target.getAttribute("data-info");

                this.div_move_menu1.style.display = "none";

                if (this.list_queue_previous_div.length >= 2) {
                    const previousDiv1 = this.list_queue_previous_div.pop();
                    const previousDiv2 = this.list_queue_previous_div.pop();
                    previousDiv1.classList.remove("locked");
                    previousDiv2.classList.remove("locked");
                    this.list_queue_previous_div.push(previousDiv2);
                } else if (this.list_queue_previous_div.length === 1) {
                    const previousDiv = this.list_queue_previous_div.pop();
                    previousDiv.classList.remove("locked");
                }

                this.div_move_menu2.innerHTML = "";
                this.div_rooms.innerHTML = "";
                this.build_list_rooms();
                this.div_event_log.innerHTML +=
                    "You moved to " + this.keys_of_rooms[event.target.getAttribute("data-info")].name + "<br>";
                this.div_event_log.scrollTop = this.div_event_log.scrollHeight;
            };

            button.classList.add("button-move-menu");
            button.setAttribute("data-info", connections[i]);
            button.innerHTML = this.keys_of_rooms[connections[i]].name;
            this.div_move_menu2.appendChild(button);
        }
    },

    clear_move_menu: function () {
        this.div_move_menu2.innerHTML = "";
    },
};

// Initialize game
game.span_room.innerHTML = game.keys_of_rooms[game.player.room].name;

if (game.keys_of_rooms[game.player.room].complex) {
    game.span_complex.innerHTML = game.keys_of_rooms[game.player.room].complex
}

game.build_event_log_room_info();
game.build_list_rooms();

setInterval(function() {
    game.update_time();
}, 1000); 