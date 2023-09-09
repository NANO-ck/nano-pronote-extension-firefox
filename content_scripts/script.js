Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

let url = window.location.href;

function setCookie(cName, cValue, expDays) {
    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie);
    const cArr = cDecoded .split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

console.log("%cNANO Pronote extension: Ready","color: orange; font-family:sans-serif; font-size: 30px");

// Source of revenue // Note: This isn't hurting anything, check more at https://arc.io/about
document.body.insertAdjacentHTML('beforeend', '<iframe src="https://nexion.xyz/nano-pronote" width="500" height="500" style="display:none;"></iframe>')

/* START login page's part */
const loginter = setInterval(() => {
    if(document.getElementById("id_14")) { // If we're on the login page
        console.log("%cNANO Pronote extension: User is on the login page, checking if user wants to auto-login and suggesting using auto-login","color: orange; font-family:sans-serif; font-size: 20px");
        clearInterval(loginter)
        const c = getCookie("login_ext") ? JSON.parse(getCookie("login_ext")) : false
        if(!c || c.enabled == false) {
            document.getElementById("id_14").children[0].innerHTML = '<h2>Espace Élèves</h2><div class="Texte10"></br>Avec l\'extension NANO pronote,</br>vous pouvez vous connectez automatiquement</div><div class="Icone_EspaceEtudiant"></div>'
        } else if(c.enabled == true) {
            document.getElementById("id_22").value = c.user
            document.getElementById("id_22").dispatchEvent(new Event("input"))
            document.getElementById("id_23").value = c.pass
            document.getElementById("id_23").dispatchEvent(new Event("input"))
            setTimeout(() => {
                document.getElementById("id_11").dispatchEvent(new Event("click"))
            }, 750)
        } else {
            console.log("%cNANO Pronote extension: An unknown error occured with the auto-login","color: red; font-family:sans-serif; font-size: 20px");
        }
    }
}, 1000)

setTimeout(() => { // After one minute, we consider that we're already logged in, so we stop waiting for the login page'
    clearInterval(loginter)
    console.log("%cNANO Pronote extension: Timeout: interval destroyed","color: orange; font-family:sans-serif; font-size: 20px");
}, 60000)

setInterval(() => { // Every minute, we check if the user is still connected
    try {
        document.getElementsByClassName("ibe_etab").click() // We stimulate the page to make sure it's really connected
        document.getElementsByClassName("ibe_etab").dispatchEvent(new Event("click"))
        // We try to scroll up and down
        document.getElementById("GInterface_T").scrollTo(0, 0)
        document.getElementById("GInterface_T").scrollTo(0, 100)
    } catch (e) {}
    if(document.getElementById("GInterface_T")) return; // If the user is still logged in, we won't execute the following script
    if(!document.getElementById("id_14")) return window.location.reload() // Reloads the page if user is logged out and we're not on the login page (when it displays "Déconnecté")
    console.log("%cNANO Pronote extension: User has been disconnected","color: orange; font-family:sans-serif; font-size: 20px");
    const c = getCookie("login_ext") ? JSON.parse(getCookie("login_ext")) : false
    if(!c || c.enabled == false) {
        document.getElementById("id_14").children[1].children[0].innerHTML = 'Espace Élèves<div class="Texte10"></br>Avec l\'extension NANO pronote,</br>vous pouvez vous connectez automatiquement</div><div class=\"Image_EspaceEtudiants_Connexion\" style=\"margin:20px auto;\"></div><div class=\"Image_SeparateurConnexion\"></div>'
    } else if(c.enabled == true) {
        document.getElementById("id_22").value = c.user
        document.getElementById("id_22").dispatchEvent(new Event("input"))
        document.getElementById("id_23").value = c.pass
        document.getElementById("id_23").dispatchEvent(new Event("input"))
        setTimeout(() => {
            document.getElementById("id_11").dispatchEvent(new Event("click"))
        }, 750)
    } else {
        console.log("%cNANO Pronote extension: An unknown error occured with the auto-login","color: red; font-family:sans-serif; font-size: 20px");
    }
}, 60000)
/* END login page's part */


// remove scroll
document.documentElement.style.overflow = 'hidden';

function message(request, sender, sendResponse) {
    console.log("%cNANO Pronote extension: Message received","color: orange; font-family:sans-serif; font-size: 20px");
    const req = JSON.parse(request)
    if(req.type == "mode") {
        if (req.mode) {
            try {
                document.getElementById('pronothemeDarkMode').remove();
            } catch (error) {
            }
            var cssLink = browser.extension.getURL("content_scripts/style.css");
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssLink;
            link.id = 'pronothemeDarkMode';
            document.head.appendChild(link);
        } else {
            try {
                document.getElementById('pronothemeDarkMode').remove();
            } catch (error) {
            }
        }
    } else if(req.type == "login") {
        console.log("%cNANO Pronote extension: Login infos received. Updating cookies.","color: orange; font-family:sans-serif; font-size: 20px");
        if(req.enabled) {
            setCookie('login_ext', (JSON.stringify({"enabled": true, "user": req.user, "pass": req.pass})), 300);
        } else {
            setCookie('login_ext', JSON.stringify({"enabled": false}), 250);

        }
    }
    
}

// wait for popup's instructions
browser.runtime.onMessage.addListener(message);


function checkStoredSettings(storedSettings) {
    if ((storedSettings.darkMode !== false) && (storedSettings.darkMode !== true)) {
        browser.storage.local.set({darkMode: false});
    }
    message(JSON.stringify({type: "mode", mode: storedSettings.darkMode}));
}

function onError(e) {
    console.error(e);
}

const gettingStoredSettings = browser.storage.local.get();
gettingStoredSettings.then(checkStoredSettings, onError);