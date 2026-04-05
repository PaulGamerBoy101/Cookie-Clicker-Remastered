:root {
    --panel-bg: rgba(255, 255, 255, 0.8);
    --border-color: #444;
}

body, html {
    padding: 0; margin: 0; height: 100%;
    font-family: 'Courier New', monospace;
    background: #ccc; overflow: hidden; user-select: none;
}

#game-container {
    display: flex; height: calc(100vh - 25px); width: 100vw;
}

.panel { height: 100%; position: relative; overflow-y: auto; }

#left-panel {
    flex: 1; display: flex; flex-direction: column; align-items: center;
    border-right: 2px solid var(--border-color);
    background: radial-gradient(circle, #ddd 0%, #bbb 100%);
}

#middle-panel {
    flex: 1.5; background: #999; border-right: 2px solid var(--border-color);
}

#right-panel { flex: 1; background: #888; min-width: 300px; }

#cookie-wrapper { margin-top: 50px; position: relative; width: 128px; height: 128px; }
#cookie {
    width: 128px; height: 128px;
    background: url('cookie.png'); cursor: pointer;
}
#cookie:active { transform: scale(0.95); }

#store > div {
    background-color: #eee; min-height: 64px; padding: 10px 10px 10px 80px;
    cursor: pointer; border-bottom: 1px solid #666; position: relative;
    background-repeat: no-repeat; background-position: 8px center;
}
#store > div.grayed { opacity: 0.5; filter: grayscale(1); cursor: not-allowed; }

.amount {
    position: absolute; right: 10px; top: 10px;
    font-size: 32px; font-weight: bold; opacity: 0.2;
}

#money-container {
    background: var(--panel-bg); padding: 15px; width: 100%; text-align: center;
}

.pop {
    position: absolute; font-weight: bold; color: #fff;
    text-shadow: 1px 1px #000; pointer-events: none; z-index: 100;
}

/* Building Sprites */
.grandma, .factory, .mine, .shipment, .lab, .portal, .time { position: absolute; }
.grandma { background: url('grandma.png'); width: 24px; height: 48px; }
.factory { background: url('factory.png'); width: 32px; height: 48px; }
/* Add mine, shipment, etc. backgrounds as needed */