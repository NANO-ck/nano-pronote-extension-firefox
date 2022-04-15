var actualMode = false;

function checkStoredSettings(storedSettings) {
    if ((storedSettings.darkMode !== false) && (storedSettings.darkMode !== true)) {
        browser.storage.local.set({darkMode: false});
    }
    actualMode = !storedSettings.darkMode;
    updateMode();
    actualMode = !actualMode;
}


document.addEventListener("click", (e) => {
    console.log(browser.storage.local.get(), 'hey');
    if (e.target.id === 'pronotheme') {
        updateMode();
        sendMessage("mode");
    } else if(e.target.id === 'save') {
        sendMessage("login");
        document.getElementById("user").value = ""
        document.getElementById("pass").value = ""
        e.target.style = 'background-color: #7dd975;'
        e.target.innerText = 'Saved'
        setTimeout(() => {
            e.target.style = 'background-color: #ddd;'
            e.target.innerText = 'Save'
        }, 3000)
    } else if (e.target.classList.contains("clear")) {
        browser.tabs.reload();
        window.close();
    }
})



function updateMode() {
    if (actualMode) {
        document.getElementById('pronotheme').className = 'pronotheme lightNano';
        document.body.className = 'lightMode';
    } else {
        document.getElementById('pronotheme').className = 'pronotheme darkNano';
        document.body.className = 'darkMode';
    }
}

function sendMessage(type) {
    const enabled = document.getElementById("keeploggedin").checked
    const user = document.getElementById("user").value
    const pass = document.getElementById("pass").value
    if(type == "mode") {
        const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, JSON.stringify({"type": "mode", "mode": actualMode}));
        });
        browser.storage.local.set({darkMode: !actualMode});
        actualMode = !actualMode;
    } else if(type == "login") {
        const gettingActiveTab = browser.tabs.query({active: true, currentWindow: true});
        gettingActiveTab.then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id, JSON.stringify({"type": "login", "enabled": enabled, "user": user, "pass": pass}));
        });
    }
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, console.error);