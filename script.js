console.log("loaded script");

let isPlay = false;

function onload() {
    console.log("page loaded");

    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.size == 0) {
        initSoundBoxes();
        return;
    }

    //init sound boxes with query string
    const soundsDiv = document.getElementById("sounds");
    for (let [audioName, count] of searchParams) {
        for (let i = 0; i < count; i++) {
            createAndAppendSoundToSoundbox(audioName);
        }
    }

}

const soundboxCounts = new Map();   //sound-name (such as "slack-noise"), count (int)

function initSoundBoxes() {
    //slack sounds
    for (let i = 0; i < 5; i++) {
        createAndAppendSoundToSoundbox("slack-message");
    }

    //skype sounds
    for (let i = 0; i < 2; i++) {
        createAndAppendSoundToSoundbox("skype-call");
    }

    //ios sounds
    createAndAppendSoundToSoundbox("ios-alarm");

    //car horn sounds
    createAndAppendSoundToSoundbox("car-horn");
}

function clickPlay() {
    console.log("clicked play");
    isPlay = true;
}

function clickStop() {
    console.log("clicked stop");
    isPlay = false;

    setAudioMute();
}

/**
 * sets the mute on all audio elements
 */
function setAudioMute() {
    const audioList = document.getElementsByTagName("audio")
    for (let audioElem of audioList) {
        audioElem.pause();
        audioElem.currentTime = 0;
        audioElem.parentElement.classList.remove("playing");
    }
}

/**
 * add a sound box and play it.
 */
function clickAddSound() {
    const soundsDiv = document.getElementById("sounds");

    const audioName = getSelectedAudioValue();

    createAndAppendSoundToSoundbox(audioName);
}

/**
 * removes a sound box. and stops the sound. and adjusts sound counts.
 */
function clickRemoveSound() {
    const soundsDiv = document.getElementById("sounds");

    if (soundsDiv.children.length == 0)
        return;

    const lastChild = soundsDiv.lastChild;
    const lastChildId = lastChild.id;
    const intervalId = Number.parseInt(lastChildId.substring(lastChildId.indexOf("-") + 1));

    clearInterval(intervalId);

    //adjust soundbox counts
    const lastChildElement = document.getElementById(lastChildId);
    const audioName = lastChildElement.classList[1];    //not robust :-/

    const oldCount = soundboxCounts.get(audioName);
    soundboxCounts.set(audioName, oldCount - 1);

    soundsDiv.removeChild(lastChild);
    console.log("interval removed:" + intervalId)
}

function getSelectedAudioValue() {
    return document.getElementById("sound-choice").value;
}

/**
 * Get the file path of the audioName
 * @param {string} audioName 
 * @returns 
 */
function getAudioPath(audioName) {
    switch (audioName) {
        case "slack-message":
            return "audio/slack-message.wav";
        case "skype-call":
            return "audio/skype-incoming.mp3";
        case "ios-alarm":
            return "audio/iphone-alarm-sound.mp3";
        case "car-horn":
            return "audio/car-horn-6408.mp3";
        default:
            throw new Error("huh?");
    }
}

/**
 * Create a sound box and assigns a sound. Don't forget to append the returned box.
 * @param {string} audioName path of audio file
 * @returns 
 */
function createSoundBox(audioName) {
    const timerSeconds = (getRandomInt(150) + 1) / 10; //up to 15 seconds (.1 second intervals)
    const hitChance = getRandomInt(100) + 1;

    const soundBox = document.createElement("div");
    soundBox.classList.add("soundbox")

    soundBox.innerHTML = `🔊 <b>${audioName}</b>`;
    soundBox.innerHTML += `<br>⏱️ timer: ${timerSeconds} seconds`;
    soundBox.innerHTML += `<br>🎲 hit chance : ${hitChance}%`;
    soundBox.innerHTML += `<br><br>`;

    soundBox.classList.add(audioName);

    //set audio
    const audioElem = new Audio(getAudioPath(audioName));
    audioElem.onended = function () {
        soundBox.classList.remove("playing");
    };

    soundBox.appendChild(audioElem);

    const intervalId = setInterval(() => {
        if (!isPlay)
            return;

        const diceRoll = getRandomInt(100);

        if (diceRoll > hitChance)
            return;

        audioElem.play();
        soundBox.classList.add("playing");

    }, timerSeconds * 1000);

    console.log("interval added:" + intervalId)
    soundBox.id = `soundBox-${intervalId}`;

    //add x-close button
    const xButton = document.createElement("button");
    xButton.className = "xbtn";
    xButton.innerHTML = "❌";
    xButton.onclick = () => {
        clearInterval(intervalId);
        audioElem.pause();

        soundBox.parentElement.removeChild(soundBox);

        //adjust sounds count
        const oldCount = soundboxCounts.get(audioName);
        soundboxCounts.set(audioName, oldCount - 1);
    };
    soundBox.prepend(xButton);

    //adjust sounds count
    if (!soundboxCounts.has(audioName)) {
        soundboxCounts.set(audioName, 0);
    }
    soundboxCounts.set(audioName, soundboxCounts.get(audioName) + 1);

    return soundBox;
}

/**
 * from 0 (inclusive) to max (exclusive).
 * If max is 2, then 0 or 1.
 * @param {number} max 
 * @returns 
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Copy to clipboard.
 * @param {*} event 
 */
function copyURI(event) {
    event.preventDefault();

    const targetUrlRaw = window.location.href;
    let targetUrl = targetUrlRaw.replace(/\/+$/, '');   //remove all trailing slashes

    let soundCounts = [];
    for (let [soundName, count] of soundboxCounts) {
        soundCounts.push(soundName + "=" + count);
    }

    targetUrl += "?" + soundCounts.join("&")
    //such as noisy.com?slack-noise=3&other-noise=2

    navigator.clipboard.writeText(targetUrl).then(() => {
        //success
        const shareLinkDiv = document.getElementById("share-link");
        shareLinkDiv.innerText = `Copied: ${targetUrl}`;
    }, () => {
        //failed
    });
}

function clickLoadPreset() {
    clearAllSounds();

    const presetValue = document.getElementById("sound-preset").value;

    //load preset sounds
    switch (presetValue) {
        case "college-finals":
            for (let i = 0; i < 12; i++) {
                createAndAppendSoundToSoundbox("ios-alarm");
            }
            break;
        case "work-problem":
            for (let i = 0; i < 12; i++) {
                createAndAppendSoundToSoundbox("slack-message");
            }
            for (let i = 0; i < 3; i++) {
                createAndAppendSoundToSoundbox("skype-call");
            }
            break;
        case "nyc-gridlock":
            for (let i = 0; i < 20; i++) {
                createAndAppendSoundToSoundbox("car-horn");
            }
            break;
    }
}

/**
 * Remove all sound boxes and stops the sounds.
 */
function clearAllSounds() {
    //clear current sound boxes
    const soundsDiv = document.getElementById("sounds");
    let numSounds = soundsDiv.children.length;
    for (let i = 0; i < numSounds; i++) {
        clickRemoveSound();
    }
}

/**
 * create a soundbox and append to the div "sounds".
 * @param {string} audioName such as 'slack-message'
 */
function createAndAppendSoundToSoundbox(audioName) {
    const soundsDiv = document.getElementById("sounds");

    const soundBox = createSoundBox(audioName);
    soundsDiv.appendChild(soundBox);
}
