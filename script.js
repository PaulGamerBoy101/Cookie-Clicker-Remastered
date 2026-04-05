const l = (id) => document.getElementById(id);

// --- REAL GAME STATE (v.0.126) ---
let Version = 0.126;
let Cookies = 0;
let CookiesDisplay = 0;
let T = 0;
let Loaded = 0;
let NumbersOn = 1;
let StoreToRebuild = 1;

// Actual 2013 Building Stats
let Counts = {
    'Cursor': 0, 'Grandma': 0, 'Factory': 0, 'Mine': 0, 
    'Shipment': 0, 'Alchemy lab': 0, 'Portal': 0, 'Time machine': 0
};

// --- CORE UTILITIES ---
function Beautify(what) {
    let str = ''; what = Math.floor(what);
    let parts = (what + '').split('').reverse();
    for (let i in parts) {
        if (i % 3 == 0 && i > 0) str = ',' + str;
        str = parts[i] + str;
    }
    return str;
}

// --- BUYABLES SYSTEM ---
const Buyables = [];
function Buyable(name, desc, pic, price, cps, func) {
    this.name = name; this.desc = desc; this.pic = pic;
    this.basePrice = price; this.price = price;
    this.cps = cps; this.func = func;
    Buyables.push(this);

    this.Buy = () => {
        if (Cookies >= this.price) {
            Cookies -= this.price;
            Counts[this.name]++;
            this.price = Math.ceil(this.basePrice * Math.pow(1.15, Counts[this.name]));
            if (this.func) this.func();
            StoreToRebuild = 1;
        }
    };
}

// Define Buildings with Original CPS rates
new Buyable('Cursor', 'Autoclicks every 5s', 'cursoricon', 15, 0.2);
new Buyable('Grandma', 'A nice grandma', 'grandmaicon', 100, 0.8, () => updateVisuals('grandmas', 'grandma'));
new Buyable('Factory', 'Mass production', 'factoryicon', 500, 4, () => updateVisuals('factories', 'factory'));
new Buyable('Mine', 'Mines cookies', 'mineicon', 2000, 10, () => updateVisuals('mines', 'mine'));
new Buyable('Alchemy lab', 'Turns gold into cookies', 'labicon', 10000, 40, () => updateVisuals('labs', 'lab'));
new Buyable('Portal', 'Opens a door to the Cookieverse', 'portalicon', 100000, 100, () => updateVisuals('portals', 'portal'));
new Buyable('Time machine', 'Brings cookies from the past', 'timeicon', 1000000, 400, () => updateVisuals('times', 'time'));

function updateVisuals(id, className) {
    let container = l(id);
    let count = Counts[Buyables.find(b => b.pic.includes(className)).name];
    let str = '';
    for (let i = 0; i < Math.min(count, 50); i++) { // Limit visuals to 50 for performance
        str += `<div class="${className}" style="left:${Math.random()*90}%; top:${Math.random()*80}%;"></div>`;
    }
    container.innerHTML = str;
}

// --- INTERACTION ---
function ClickCookie() {
    Cookies++;
    if (NumbersOn) new Pop('cookie', '+1');
}

let Pops = [];
function Pop(elId, str) {
    let rect = l(elId).getBoundingClientRect();
    Pops.push({
        x: rect.left + (rect.width / 2) + (Math.random() * 40 - 20),
        y: rect.top + (rect.height / 2),
        str: str, life: 0
    });
}

// --- THE REAL GAME LOOP ---
function Main() {
    // 1. Calculate Cookies Per Second (CPS)
    let totalCps = 0;
    Buyables.forEach(b => {
        totalCps += Counts[b.name] * b.cps;
    });

    // Cursor specific logic (clicks every 150 frames / 5 seconds)
    if (T % 150 === 0 && Counts['Cursor'] > 0) {
        Cookies += Counts['Cursor'];
    }

    // Passive production (every frame)
    Cookies += (totalCps / 30);

    // 2. Build Store UI
    if (StoreToRebuild || T % 30 === 0) {
        let str = '';
        Buyables.forEach(b => {
            let canAfford = Cookies >= b.price ? '' : 'grayed';
            str += `<div class="${canAfford}" onclick="Buyables.find(x=>x.name=='${b.name}').Buy()">
                <b>${b.name} - ${Beautify(b.price)}</b><br><small>${b.desc}</small>
                <div class="amount">${Counts[b.name] || ''}</div>
            </div>`;
        });
        l('store').innerHTML = str;
        StoreToRebuild = 0;
    }

    // 3. Update Text and Comments
    CookiesDisplay += (Cookies - CookiesDisplay) * 0.3;
    l('money').innerHTML = Beautify(Math.round(CookiesDisplay));
    l('cps').innerHTML = 'cookies/second: ' + totalCps.toFixed(1);
    
    if (T % 300 === 0) {
        let comm = "You feel like making cookies.";
        if (Cookies > 100) comm = "Your cookies are popular.";
        if (Cookies > 10000) comm = "Your cookies are world-renowned.";
        l('comment').innerHTML = comm;
    }

    // 4. Popups
    let popStr = '';
    for (let i = Pops.length - 1; i >= 0; i--) {
        let p = Pops[i];
        p.y -= 1; p.life++;
        popStr += `<div class="pop" style="left:${p.x}px; top:${p.y}px; opacity:${1-(p.life/30)}">${p.str}</div>`;
        if (p.life > 30) Pops.splice(i, 1);
    }
    l('pops').innerHTML = popStr;

    T++;
    setTimeout(Main, 1000 / 30);
}

// --- SAVE / RESET ---
function Reset() { if(confirm("Wipe all progress?")) { Cookies = 0; Object.keys(Counts).forEach(k=>Counts[k]=0); location.reload(); } }
function ExportSave() { prompt("Your Save Code:", btoa(JSON.stringify({c:Cookies, n:Counts}))); }
function ImportSave() { 
    let s = prompt("Paste Save Code:"); 
    if(s) { 
        let data = JSON.parse(atob(s)); 
        Cookies = data.c; Counts = data.n; 
        StoreToRebuild = 1; 
    } 
}

window.onload = () => { l('version').innerHTML = 'v.'+Version; Loaded = 1; Main(); };