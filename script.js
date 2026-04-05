// Utility functions
const l = (id) => document.getElementById(id);

function Beautify(what) {
    let str = '';
    what = Math.floor(what);
    let parts = (what + '').split('').reverse();
    for (let i in parts) {
        if (i % 3 == 0 && i > 0) str = ',' + str;
        str = parts[i] + str;
    }
    return str;
}

// Game State
let Version = 0.126;
let Cookies = 0;
let CookiesDisplay = 0;
let T = 0;
let Loaded = 0;
let NumbersOn = 1;
let StoreToRebuild = 1;

let Counts = {
    'Cursor': 0, 'Grandma': 0, 'Factory': 0, 'Mine': 0, 
    'Shipment': 0, 'Alchemy lab': 0, 'Portal': 0, 'Time machine': 0
};

// Initialization
l('version').innerHTML = 'v.' + Version;

// Buyables Logic
const Buyables = [];
function Buyable(name, desc, pic, price, func) {
    this.name = name;
    this.desc = desc;
    this.pic = pic;
    this.price = price;
    this.func = func;
    Buyables[name] = this;

    this.Buy = () => {
        if (Cookies >= this.price && Loaded) {
            Cookies -= this.price;
            this.price = Math.ceil(this.price * 1.1);
            this.func(true);
            StoreToRebuild = 1;
        }
    };
}

// Define Buildings
new Buyable('Cursor', 'Autoclicks every 5s', 'cursoricon', 15, (buy) => { if(buy) Counts['Cursor']++; });
new Buyable('Grandma', 'Bakes cookies', 'grandmaicon', 100, (buy) => { if(buy) Counts['Grandma']++; updateVisuals('grandmas', Counts['Grandma'], 'grandma'); });
new Buyable('Factory', 'Mass production', 'factoryicon', 500, (buy) => { if(buy) Counts['Factory']++; updateVisuals('factories', Counts['Factory'], 'factory'); });
// ... (Repeat for other buildings similar to above)

function updateVisuals(containerId, count, className) {
    let str = '';
    for (let i = 0; i < count; i++) {
        let x = Math.floor(Math.random() * 80);
        let y = Math.floor(Math.random() * 80);
        str += `<div class="${className}" style="position:absolute; left:${x}%; top:${y}%;"></div>`;
    }
    l(containerId).innerHTML = str;
}

function ClickCookie() {
    Cookies++;
    if (NumbersOn) new Pop('cookie', '+1');
}

// Popup System
let Pops = [];
function Pop(elId, str) {
    this.el = elId;
    this.str = str;
    this.life = 0;
    let rect = l(elId).getBoundingClientRect();
    this.x = rect.left + (rect.width / 2) + (Math.random() * 40 - 20);
    this.y = rect.top + (rect.height / 2);
    Pops.push(this);
}

// Main Game Loop
function Main() {
    // 1. Build Store
    if (StoreToRebuild) {
        let str = '';
        for (let i in Buyables) {
            let b = Buyables[i];
            let canAfford = Cookies >= b.price ? '' : 'grayed';
            str += `<div class="${canAfford}" onclick="Buyables['${b.name}'].Buy()">
                        <b>${b.name} - ${Beautify(b.price)}</b>
                        <small>${b.desc}</small>
                        <div class="amount">${Counts[b.name] || ''}</div>
                    </div>`;
        }
        l('store').innerHTML = str;
        StoreToRebuild = 0;
    }

    // 2. Handle Popups
    let popStr = '';
    for (let i = Pops.length - 1; i >= 0; i--) {
        let p = Pops[i];
        p.y -= 2;
        p.life += 2;
        let opacity = 1 - (p.life / 100);
        popStr += `<div class="pop" style="left:${p.x}px; top:${p.y}px; opacity:${opacity}">${p.str}</div>`;
        if (p.life >= 100) Pops.splice(i, 1);
    }
    l('pops').innerHTML = popStr;

    // 3. Update Display
    CookiesDisplay += (Cookies - CookiesDisplay) * 0.3;
    l('money').innerHTML = Beautify(Math.round(CookiesDisplay));
    
    // 4. Game Logic (Autoclickers)
    if (T % 150 === 0 && Counts['Cursor'] > 0) {
        Cookies += Counts['Cursor'];
        new Pop('cookie', '+' + Counts['Cursor']);
    }

    T++;
    requestAnimationFrame(Main);
}

// Start Game
window.onload = () => {
    Loaded = 1;
    Main();
};

// Simple Save/Reset
function Reset() { if(confirm("Reset?")) { Cookies = 0; location.reload(); } }
function exportSave() { prompt("Copy your save:", Cookies); }
function importSave() { let s = prompt("Paste save:"); if(s) Cookies = parseInt(s); }