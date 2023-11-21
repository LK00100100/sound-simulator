console.log("loaded script");

let isPlay = false;

function onload() {
    console.log("page loaded");

    initSoundBoxes();
}

function initSoundBoxes() {
    const soundsDiv = document.getElementById("sounds");

    //slack sounds
    for (let i = 0; i < 5; i++) {
        const soundBox = createSoundBox("slack message");
        soundsDiv.appendChild(soundBox);
    }

    //skype sounds
    for (let i = 0; i < 2; i++) {
        const soundBox = createSoundBox("skype call");
        soundsDiv.appendChild(soundBox);
    }

    //ios sounds
    soundsDiv.appendChild(createSoundBox("ios alarm"));

    //car horn sounds
    soundsDiv.appendChild(createSoundBox("car horn"));
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

    const soundBox = createSoundBox(audioName);
    soundsDiv.appendChild(soundBox);
}

/**
 * removes a sound box.
 */
function clickRemoveSound() {
    const soundsDiv = document.getElementById("sounds");

    if (soundsDiv.children.length == 0)
        return;

    const lastChild = soundsDiv.lastChild;
    const lastChildId = lastChild.id;
    const intervalId = Number.parseInt(lastChildId.substring(lastChildId.indexOf("-") + 1));

    clearInterval(intervalId);

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
        case "slack message":
            return "/audio/slack-message.wav";
        case "skype call":
            return "/audio/skype-incoming.mp3";
        case "ios alarm":
            return "/audio/iphone-alarm-sound.mp3";
        case "car horn":
            return "/audio/car-horn-6408.mp3";
        default:
            throw new Error("huh?");
    }
}

/**
 * Create a sound box and assigns a sound.
 * @param {string} audioName path of audio file
 * @returns 
 */
function createSoundBox(audioName) {
    const timerSeconds = getRandomInt(10) + 1;
    const hitChance = getRandomInt(100) + 1;

    const soundBox = document.createElement("div");
    soundBox.classList.add("soundbox")

    soundBox.innerHTML = `🔊 <b>${audioName}</b>`;
    soundBox.innerHTML += `<br>⏱️ timer: ${timerSeconds} seconds`;
    soundBox.innerHTML += `<br>🎲 hit chance : ${hitChance}%`;
    soundBox.innerHTML += `<br><br>`;

    const audioNameCss = audioName.replace(" ", "-");
    soundBox.classList.add(audioNameCss);

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
    xButton.innerHTML = "❌";
    xButton.onclick = () => {
        clearInterval(intervalId);
        audioElem.pause();

        soundBox.parentElement.removeChild(soundBox);
    };
    soundBox.appendChild(xButton);

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
