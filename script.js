// --- CORE UTILITIES ---
function l(what) {
    if (what === 'money') return document.getElementsByTagName('CC')[0];
    if (what === 'cps') return document.getElementsByTagName('CPS')[0];
    if (what === 'cookie') return document.getElementById('big-cookie');
    var el = document.getElementById(what);
    if (!el) {
        var tags = document.getElementsByTagName(what);
        if (tags.length > 0) return tags[0];
    }
    return el;
}

function Beautify(what, decimals){
    var precision = (decimals !== undefined) ? decimals : 0;
    var fixed = parseFloat(what).toFixed(precision);
    var parts = fixed.split('.');
    var main = parts[0];
    var rest = parts[1];
    var str = '';
    main = main.split('').reverse();
    for (var i in main) {
        if (i % 3 == 0 && i > 0) str = ',' + str;
        str = main[i] + str;
    }
    return str + (rest ? '.' + rest : '');
}

// --- STATE ---
Version=0.1251; Loaded=0;
Cookies=0; T=0; SaveTimer=30*30;
Cursors=0; Grandmas=0; Ovens=0; Kitchens=0; Farms=0; Factories=0; Mines=0; Banks=0;

// Upgrade Ownership
UpgradesOwned = { 'Finger1': 0, 'Finger2': 0, 'Grandma1': 0 };

// --- SAVE SYSTEM ---
MakeSaveString=function(){
    return Version+'|'+parseInt(Cookies)+'|'+
    parseInt(Cursors)+'|'+parseInt(Buyables['Cursor'].price)+'|'+
    parseInt(Grandmas)+'|'+parseInt(Buyables['Grandma'].price)+'|'+
    parseInt(Ovens)+'|'+parseInt(Buyables['Oven'].price)+'|'+
    parseInt(Kitchens)+'|'+parseInt(Buyables['Kitchen'].price)+'|'+
    parseInt(Farms)+'|'+parseInt(Buyables['Farm'].price)+'|'+
    parseInt(Factories)+'|'+parseInt(Buyables['Factory'].price)+'|'+
    parseInt(Mines)+'|'+parseInt(Buyables['Mine'].price)+'|'+
    parseInt(Banks)+'|'+parseInt(Buyables['Bank'].price)+'|'+
    UpgradesOwned['Finger1']+'|'+UpgradesOwned['Finger2']+'|'+UpgradesOwned['Grandma1'];
}

Save=function(){
    var str=MakeSaveString();
    localStorage.setItem('CookieClickerSave', str);
    var now=new Date(); now.setFullYear(now.getFullYear()+5);
    document.cookie='CookieClickerSave='+escape(str)+'; expires='+now.toUTCString()+'; path=/;';
    SaveTimer=30*30;
}

exportSave=function(){ prompt('Exported Save:', MakeSaveString()); }
importSave=function(){ var save=prompt('Paste save string:',''); if (save) { LoadResponse(save); Save(); } }
ResetGame=function(){ if (confirm('Reset all progress?')) { localStorage.removeItem('CookieClickerSave'); location.reload(); } }

LoadResponse=function(str){
    var r=str.split('|');
    if(r.length >= 17) {
        Cookies=parseFloat(r[1]);
        Cursors=parseInt(r[2]); Buyables['Cursor'].price=parseInt(r[3]);
        Grandmas=parseInt(r[4]); Buyables['Grandma'].price=parseInt(r[5]);
        Ovens=parseInt(r[6]); Buyables['Oven'].price=parseInt(r[7]);
        Kitchens=parseInt(r[8]); Buyables['Kitchen'].price=parseInt(r[9]);
        Farms=parseInt(r[10]); Buyables['Farm'].price=parseInt(r[11]);
        Factories=parseInt(r[12]); Buyables['Factory'].price=parseInt(r[13]);
        Mines=parseInt(r[14]); Buyables['Mine'].price=parseInt(r[15]);
        Banks=parseInt(r[16]); Buyables['Bank'].price=parseInt(r[17]);
        if(r[18] !== undefined) UpgradesOwned['Finger1'] = parseInt(r[18]);
        if(r[19] !== undefined) UpgradesOwned['Finger2'] = parseInt(r[19]);
        if(r[20] !== undefined) UpgradesOwned['Grandma1'] = parseInt(r[20]);
        UpdateUI();
    }
}

Load=function(){
    var save = localStorage.getItem('CookieClickerSave') || (document.cookie.indexOf('CookieClickerSave')>=0 ? unescape(document.cookie.split('CookieClickerSave=')[1].split(';')[0]) : '');
    if (save != '') LoadResponse(save);
    Loaded=1; InitializeListeners(); UpdateUI(); Main();
}

// --- BUILDINGS ---
Buyables=[];
Buyable=function(name, price, index, varName){
    this.name=name; this.price=price; this.index=index; this.varName=varName;
    Buyables[name]=this;
    this.Buy=function(){
        if (Cookies>=this.price && Loaded){
            Cookies-=this.price;
            window[this.varName]++;
            this.price=Math.ceil(this.price*1.1);
            UpdateUI();
        }
    }
}

new Buyable('Cursor', 15, 0, 'Cursors');
new Buyable('Grandma', 100, 1, 'Grandmas');
new Buyable('Oven', 500, 2, 'Ovens');
new Buyable('Kitchen', 2000, 3, 'Kitchens');
new Buyable('Farm', 7000, 4, 'Farms');
new Buyable('Factory', 50000, 5, 'Factories');
new Buyable('Mine', 1000000, 6, 'Mines');
new Buyable('Bank', 123456789, 7, 'Banks');

// --- UPGRADES ---
UpgradeList=[];
Upgrade=function(name, price, id){
    this.name=name; this.price=price; this.id=id;
    UpgradeList.push(this);
    this.Buy=function(){
        if (Cookies >= this.price && !UpgradesOwned[this.id]){
            Cookies -= this.price;
            UpgradesOwned[this.id] = 1;
            UpdateUI();
        }
    }
}

new Upgrade('Reinforced Index Finger', 100, 'Finger1');
new Upgrade('Carpal Tunnel Prevention Cream', 500, 'Finger2');
new Upgrade('Forwards From Grandma', 1000, 'Grandma1');

function UpdateUI() {
    var bbtns = document.getElementsByTagName('button2');
    var names = ['Cursor','Grandma','Oven','Kitchen','Farm','Factory','Mine','Bank'];
    var counts = [Cursors, Grandmas, Ovens, Kitchens, Farms, Factories, Mines, Banks];

    for(var i=0; i<names.length; i++) {
        var buyable = Buyables[names[i]];
        var btn = bbtns[i];
        if(btn && buyable) {
            // Update Count
            if(btn.getElementsByTagName('BC')[0]) btn.getElementsByTagName('BC')[0].innerHTML = counts[i];
            // Update Price
            if(btn.getElementsByTagName('Price')[0]) btn.getElementsByTagName('Price')[0].innerHTML = Beautify(buyable.price);

            // Affordability Styling
            btn.style.opacity = (Cookies >= buyable.price) ? "1" : "0.5";
            btn.style.filter = (Cookies >= buyable.price) ? "none" : "grayscale(1)";
        }
    }

    // Update Upgrades
    var ubtns = document.getElementsByTagName('button3');
    for(var i=0; i<ubtns.length; i++){
        var up = UpgradeList[i];
        if(ubtns[i] && up){
            ubtns[i].style.display = UpgradesOwned[up.id] ? 'none' : 'inline-block';
            if(ubtns[i].getElementsByTagName('Price')[0]) ubtns[i].getElementsByTagName('Price')[0].innerHTML = Beautify(up.price);
            ubtns[i].style.opacity = (Cookies >= up.price) ? "1" : "0.5";
        }
    }
}

function InitializeListeners() {
    var bbtns = document.getElementsByTagName('button2');
    var names = ['Cursor','Grandma','Oven','Kitchen','Farm','Factory','Mine','Bank'];
    for(let i=0; i<bbtns.length; i++) {
        bbtns[i].onclick = function() { Buyables[names[i]].Buy(); };
    }

    var ubtns = document.getElementsByTagName('button3');
    for(let i=0; i<ubtns.length; i++) {
        ubtns[i].onclick = function() { UpgradeList[i].Buy(); };
    }

    if(l('SAVE')) l('SAVE').onclick = Save;
    if(l('EXPORT')) l('EXPORT').onclick = exportSave;
    if(l('IMPORT')) l('IMPORT').onclick = importSave;
    if(l('RESET')) l('RESET').onclick = ResetGame;
}

Pops=[]; Pop=function(str){
    this.str=str; this.life=0;
    this.offx=Math.floor(Math.random()*40-20); this.offy=Math.floor(Math.random()*40-20);
    Pops.push(this);
}

l('cookie').onclick = function() {
    var clickPower = 1;
    if(UpgradesOwned['Finger1']) clickPower *= 2;
    if(UpgradesOwned['Finger2']) clickPower *= 2;
    Cookies += clickPower;
    new Pop('+' + clickPower);
};

// --- MAIN LOOP ---
Main=function(){
    var mouseMult = 1;
    if(UpgradesOwned['Finger1']) mouseMult *= 2;
    if(UpgradesOwned['Finger2']) mouseMult *= 2;
    var gMult = UpgradesOwned['Grandma1'] ? 2 : 1;

    var grandmaGain = (4+(Ovens?1:0)+(Kitchens?2:0)+(Farms?3:0)+(Factories?4:0)+(Mines?5:0)+(Banks?6:0)) * gMult;
    var totalCps = 0;
    totalCps += (Cursors * 0.2 * mouseMult);
    totalCps += (Grandmas * (grandmaGain / 5));
    totalCps += (Ovens * (20 / 5));
    totalCps += (Kitchens * (50 / 5));
    totalCps += (Farms * (100 / 5));
    totalCps += (Factories * (500 / 5));
    totalCps += (Mines * (6666 / 5));
    totalCps += (Banks * (123456 / 5));

    Cookies += (totalCps / 30);

    if(l('money')) l('money').innerHTML = Beautify(Math.floor(Cookies));
    if(l('cps')) l('cps').innerHTML = Beautify(totalCps, 1);

    // Handle Pops
    var popStr = '';
    for (var i in Pops){
        var rect=l('cookie').getBoundingClientRect();
        var x=Math.floor((rect.left+rect.right)/2+Pops[i].offx)-100;
        var y=Math.floor((rect.top+rect.bottom)/2-Math.pow(Pops[i].life/100,0.5)*100+Pops[i].offy)-10;
        var opacity=1-(Math.max(Pops[i].life,80)-80)/20;
        popStr+='<div style="position:fixed;left:'+x+'px;top:'+y+'px;opacity:'+opacity+';pointer-events:none;color:white;font-weight:bold;text-shadow:1px 1px #000;z-index:999;">'+Pops[i].str+'</div>';
        Pops[i].life+=2; if (Pops[i].life>=100) Pops.splice(i,1);
    }
    var pDiv = document.getElementById('pop-layer');
    if(!pDiv){ pDiv=document.createElement('div'); pDiv.id='pop-layer'; document.body.appendChild(pDiv); }
    pDiv.innerHTML = popStr;

    // Refresh store visibility every frame
    UpdateUI();

    if (T%30==0) document.title = Beautify(Cookies) + " cookies";
    SaveTimer--; if (SaveTimer <= 0) Save();
    T++; setTimeout(Main, 1000/30);
}

Load();
