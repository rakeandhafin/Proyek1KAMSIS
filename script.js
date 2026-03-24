function xorSim(text, key, invert = false) {
    let result = "";
    for (let i = 0; i < text.length; i++) {
        let t = text.charCodeAt(i) - 65;
        let k = key.charCodeAt(i % key.length) - 65;
        let val = !invert ? (t + k) % 26 : (t - k + 26) % 26;
        result += String.fromCharCode(val + 65);
    }
    return result;
}

function vigenere(text, key, encrypt = true) {
    let result = "";
    let j = 0;
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char >= 'A' && char <= 'Z') {
            let t = char.charCodeAt(0) - 65;
            let k = key[j % key.length].charCodeAt(0) - 65;
            let val = encrypt ? (t + k) % 26 : (t - k + 26) % 26;
            result += String.fromCharCode(val + 65);
            j++;
        } else {
            result += char;
        }
    }
    return result;
}

function encrypt() {
    let textElement = document.getElementById("text");
    let keyElement = document.getElementById("key");
    let modeElement = document.getElementById("mode");
    let resultElement = document.getElementById("result");

    if (!textElement || !keyElement) return;

    let text = textElement.value.toUpperCase().replace(/[^A-Z]/g, "");
    let key = keyElement.value.toUpperCase().replace(/[^A-Z]/g, "");
    let mode = modeElement.value;

    if (text === "" || key === "") {
        alert("Isi teks dan key terlebih dahulu!");
        return;
    }

    while (text.length % 3 !== 0) { text += "X"; }

    let result = "";
    let prev = "AAA";

    for (let i = 0; i < text.length; i += 3) {
        let b = text.substr(i, 3);
        let temp = "";

        if (mode === "CBC") {
            temp = xorSim(b, prev);
            temp = vigenere(temp, key, true);
            prev = temp;
        } else if (mode === "CFB") {
            let encPrev = vigenere(prev, key, true);
            temp = xorSim(b, encPrev);
            prev = temp;
        } else { 
            temp = vigenere(b, key, true);
        }
        result += temp;
    }
    resultElement.innerText = result;
}

function decrypt() {
    let text = document.getElementById("text").value.toUpperCase().replace(/[^A-Z]/g, "");
    let key = document.getElementById("key").value.toUpperCase().replace(/[^A-Z]/g, "");
    let mode = document.getElementById("mode").value;
    let resultElement = document.getElementById("result");

    if (text === "" || key === "") return;

    let result = "";
    let prev = "AAA";

    for (let i = 0; i < text.length; i += 3) {
        let b = text.substr(i, 3);
        let temp = "";

        if (mode === "CBC") {
            let decVig = vigenere(b, key, false);
            temp = xorSim(decVig, prev, true);
            prev = b;
        } else if (mode === "CFB") {
            let encPrev = vigenere(prev, key, true);
            temp = xorSim(b, encPrev, true);
            prev = b;
        } else {
            temp = vigenere(b, key, false);
        }
        result += temp;
    }
    
    resultElement.innerText = result.replace(/X+$/, "");
}
