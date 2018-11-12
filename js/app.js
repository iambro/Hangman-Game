// API PASSWORD //
function getWord() {
    let url = 'https://randomuser.me/api/';
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', url, false); 
    xmlhttp.send();

    if (xmlhttp.status === 200) {
        let json = xmlhttp.responseText;
        let name = JSON.parse(json);
        let code = name.results[0].nat;
        getCountry(code);
    } else {
        password = backupPass[Math.floor(Math.random() * 20)].toUpperCase();
    };
}

function getCountry(code) {
    let countryUrl = 'https://restcountries.eu/rest/v2/alpha/' + code;
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', countryUrl, false); 
    xmlhttp.send();

    if (xmlhttp.status === 200) {
        let json = xmlhttp.responseText;
        let name = JSON.parse(json);
        country = name.name;
        password = country.toUpperCase();
    } else {
        password = backupPass[Math.floor(Math.random() * 20)].toUpperCase();
    };
}

// BACKUP PASSWORD //
var backupPass = ['Chongqing', 'Shanghai', 'Delhi', 'Beijing', 'Dhaka', 'Mumbai', 'Lagos', 'Chengdu', 'Karachi', 'Guangzhou', 'Istanbul', 'Tokyo', 'Tianjin', 'Moscow', 'Sao Paulo', 'Kinshasa', 'Baoding', 'Lahore', 'Cairo', 'Seoul'];

// GAME FUNCTIONALITY //
let letterArr, country, password, cipher, passwordArr, roundNb;

let btn = document.querySelector('.btn');
btn.addEventListener('click', start);
let active = document.querySelectorAll('.active');

function start() {
    letterArr = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    roundNb = 0;
    getWord();
    restart();
    passwordArr = [];
    encryptPassword();
    addListeners();
}

function encryptPassword() {
    cipher = '';
    let length = password.length;
    for (i = 0; i < password.length; i++) {
        if (letterArr.some(x => x === password[i]) === true) {
            cipher = cipher.concat('_');
            passwordArr.push(password[i]);
        } else {
            cipher = cipher.concat(password[i]);
        }
    }
    document.querySelector('.password').innerHTML = cipher;
}

function checkLetter() {
    if (passwordArr.some(x => x === this.id) === true) {
        removeLetter(this.id);
        encryptPassword();
        checkWin(); 
    } else {
        roundNb++;
        if (password.length > 14) {
            document.querySelector('.picture-box').innerHTML = `<img src="pic/long/p${roundNb}.png" alt="Hangman.pic"></img>`;
        } else {
            document.querySelector('.picture-box').innerHTML = `<img src="pic/short/p${roundNb}.png" alt="Hangman.pic"></img>`;
        }
        checkLose();   
    } 
    removeListener(this.id);
    document.getElementById(this.id).classList.add('inactive');
    document.getElementById(this.id).classList.remove('active');
}

function removeListener(x) {
    document.getElementById(x).removeEventListener('click', checkLetter);
}

function addListeners() {
    for (let i = 0; i < active.length; i++) {
        active[i].addEventListener('click', checkLetter);
    }
}

function removeLetter(x) {
    let index = letterArr.indexOf(x);
         if (index !== -1) {
             letterArr.splice(index, 1)
         }
}

function restart() {
    for (i = 0; i < letterArr.length; i++) {
        document.getElementById(letterArr[i]).classList.add('active');
        document.getElementById(letterArr[i]).classList.remove('inactive');
    }          
    document.querySelector('.picture-box').innerHTML = '';
    addListeners();
}

function checkWin() {
    if (password === cipher) {
        block();
        document.querySelector('.picture-box').innerHTML = `<img src="pic/win.png" alt="Hangman.pic"></img>`;
    }
}

function checkLose() {
    if (password.length > 14) {
        if (roundNb === 18) {
            block();
        }
    } else {
        if (roundNb === 10) {
            block();
        }
    }
}

function block() {
    for (i = 0; i < letterArr.length; i++) {
        document.getElementById(letterArr[i]).classList.add('inactive');
    }
    for (let i = 0; i < active.length; i++) {
        active[i].removeEventListener('click', checkLetter);
    }
}