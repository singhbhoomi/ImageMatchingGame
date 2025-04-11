let cardElements = document.getElementsByClassName('game-card');
let cardElementsArray = [...cardElements];
let imgElements = document.getElementsByClassName('game-card-img');
let imgElementsArray = [...imgElements];
let counter = document.getElementById('moveCounter');
let timerDisplay = document.getElementById('timer');

let openedCards = [];
let matchedCards = [];
let moves = 0;
let second = 0, minute = 0, interval;
let timerStarted = false;
let gameEnded = false;

function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

function startGame() {
    let shuffledImages = shuffle(imgElementsArray);
    for (let i = 0; i < shuffledImages.length; i++) {
        cardElements[i].innerHTML = "";
        cardElements[i].appendChild(shuffledImages[i]);
        cardElements[i].type = `${shuffledImages[i].alt}`;
        cardElements[i].classList.remove("show", "open", "match", "disabled");
        cardElements[i].children[0].classList.remove("show-img");
    }

    for (let i = 0; i < cardElementsArray.length; i++) {
        cardElementsArray[i].addEventListener("click", displayCard);
    }

    moves = 0;
    second = 0;
    minute = 0;
    timerStarted = false;
    gameEnded = false;
    clearInterval(interval);
    updateTimerDisplay();
    updateMoveCounter();
}

function displayCard() {
    if (gameEnded || this.classList.contains("match") || this.classList.contains("open")) return;

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    this.children[0].classList.add('show-img');
    this.classList.add("open", "show", "disabled");
    cardOpen(this);
}

function cardOpen(card) {
    openedCards.push(card);
    if (openedCards.length === 2) {
        moveCounter();
        if (openedCards[0].type === openedCards[1].type) {
            matched();
        } else {
            unmatched();
        }
    }
}

function matched() {
    openedCards[0].classList.add("match");
    openedCards[1].classList.add("match");
    openedCards[0].classList.remove("show", "open");
    openedCards[1].classList.remove("show", "open");
    matchedCards.push(openedCards[0], openedCards[1]);
    openedCards = [];

    if (matchedCards.length === 16 && moves <= 10) {
        gameEnded = true;
        clearInterval(interval);
        setTimeout(() => {
            alert(`🎉 Congratulations! You won in ${moves} moves and ${minute}m ${second}s`);
            location.reload();
        }, 300);
    }
}

function unmatched() {
    openedCards[0].classList.add("unmatched");
    openedCards[1].classList.add("unmatched");
    disableCards();
    setTimeout(() => {
        openedCards[0].classList.remove("show", "open", "unmatched");
        openedCards[1].classList.remove("show", "open", "unmatched");
        openedCards[0].children[0].classList.remove("show-img");
        openedCards[1].children[0].classList.remove("show-img");
        enableCards();
        openedCards = [];
    }, 1100);
}

function disableCards() {
    cardElementsArray.forEach(card => card.classList.add('disabled'));
}

function enableCards() {
    cardElementsArray.forEach(card => {
        card.classList.remove('disabled');
    });
    matchedCards.forEach(card => card.classList.add('disabled'));
}

function moveCounter() {
    moves++;
    updateMoveCounter();

    if (moves >= 10 && matchedCards.length < 16) {
        gameEnded = true;
        clearInterval(interval);
        setTimeout(() => {
            alert("❌ Game Over! You ran out of moves.");
            location.reload();
        }, 300);
    }
}

function updateMoveCounter() {
    if (counter) {
        counter.innerText = `Moves: ${moves}`;
    }
}

function startTimer() {
    interval = setInterval(() => {
        second++;
        if (second === 60) {
            minute++;
            second = 0;
        }
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    if (timerDisplay) {
        timerDisplay.innerText = `Time: ${minute}m ${second}s`;
    }
}

window.onload = () => {
    setTimeout(() => {
        startGame();
    }, 1200);
};
