console.log("loaded script");

let isPlay = false;

function onload() {
    console.log("loaded");

    initSoundBoxes();
}

function initSoundBoxes() {
    const soundsDiv = document.getElementById("sounds");

    for (let i = 0; i < 5; i++) {
        const soundBox = createSoundBox();
        soundsDiv.appendChild(soundBox);
    }
}

function clickPlay() {
    console.log("clicked play");
    isPlay = true;
}

function clickStop() {
    console.log("clicked stop");
    isPlay = false;
}

function clickAddSound() {
    const soundsDiv = document.getElementById("sounds");

    const soundBox = createSoundBox();
    soundsDiv.appendChild(soundBox);
}

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

/**
 * create a sound box and assigns a sound.
 * @returns 
 */
function createSoundBox() {
    const timerSeconds = getRandomInt(10) + 1;
    const hitChance = getRandomInt(100) + 1;

    const soundBox = document.createElement("div");
    soundBox.classList.add("soundbox")
    soundBox.innerHTML = "🔊 slack message";
    soundBox.innerHTML += `<br>⏱️ timer: ${timerSeconds} seconds`;
    soundBox.innerHTML += `<br>🎲 hit chance : ${hitChance}%`;

    const audio = new Audio('/audio/slack-message.wav');

    audio.onended = function () {
        soundBox.classList.remove("playing");
    };

    const intervalId = setInterval(() => {
        if (!isPlay)
            return;

        const diceRoll = getRandomInt(100);

        if (diceRoll > hitChance)
            return;

        audio.play();
        soundBox.classList.add("playing");

    }, timerSeconds * 1000);

    console.log("interval added:" + intervalId)
    soundBox.id = `soundBox-${intervalId}`;

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
