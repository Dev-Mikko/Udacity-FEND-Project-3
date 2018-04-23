/*
 * Gaming variables & constants
 */

let cards = document.querySelectorAll('.deck .card');

let unmatchedCards, moves, lifes, t, scoreUp;

const starsArea = document.querySelector('.stars');

let star = starsArea.firstElementChild.outerHTML;

const lifesArea = document.querySelector('.lifes');

let life = lifesArea.firstElementChild.outerHTML;

let movesNumberTxt = document.querySelector('.moves');

let openedCards = [];

const restartBtn = document.querySelector('.restart');

let minutes = document.getElementById("minutes");

let seconds = document.getElementById("seconds");

let totalSeconds = 0;

let modal = document.querySelector('.modal');

let closeBtn = document.querySelector('.close');

let tryAgainBtn = document.getElementById('tryAgain');

let points = document.querySelector('#points');

/*
 * restartGame(): restarts the game and reset all gaming variables
 */

function restartGame() {
	let starsNumber = starsArea.childElementCount;
	let lifesNumber = lifesArea.childElementCount;

	hideModal();
	unmatchedCards = 16;
	lifes = 10;
	moves = 0;
	movesNumberTxt.innerText = moves;

	timerReset();
	clearInterval(scoreUp);
	
	if(openedCards.length > 0) {
		openedCards.pop();
	}

	cardShuffling();

	for(let i = starsNumber; i < 3; i++) {
		if(starsNumber < 3) {
			let li = document.createElement('li');
			starsArea.insertAdjacentHTML('afterbegin', star);
		}
	}

	for(let i = lifesNumber; i < 10; i++) {
		if(lifesNumber < 10) {
			let li = document.createElement('li');
			lifesArea.insertAdjacentHTML('afterbegin', life);
		}
	}

	for(let i = 0; i < cards.length; i++) {
		cards[i].className = 'card';
	}
}

/*
 * Enables the game reset throught the circular arrow button
 */

restartBtn.addEventListener('click', function() {
	restartGame();
});

/*
 * Shuffle(): shuffles an array or a list
 * Shuffle function from http://stackoverflow.com/a/2450976
 */

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

/*
 * cardShuffling(): using the shuffle() function, shuffles all the gaming card on the grid
 */

function cardShuffling() {
	let cardClass = [];
	let shuffledCard;

	for(let i = 0; i < cards.length; i++) {
		cardClass[i] = cards[i].firstElementChild.className;
	}

	shuffledCard = shuffle(cardClass);

	for(let i = 0; i < cards.length; i++) {
		cards[i].firstElementChild.className = shuffledCard[i];
	}
}

/*
 * When all elements are loaded, starts the gaming functions 
 */

document.addEventListener('DOMContentLoaded', function() {
	restartGame();
	scoreUp = setInterval(scoreUpdate, 1000);

	for(let card of cards) {
		card.addEventListener('click', function() {
			if(card.className === 'card') {
				showCard(card);
				addCardToList(card);
				matchingControl();
				timerStart();
			}
		});
	}
});

/*
 * Timer functions
 * 	- timerUpdate(): updates the timer
 *	- clock(val): converts the totalSeconds variable in a mm:ss timer
 *	- timerStart(): stars the timer
 *	- timerStop(): stops the timer
 *	- timerreset(): resets the timer
 */

function timerUpdate() {
	++totalSeconds;
	seconds.innerHTML = clock(totalSeconds % 60);
	minutes.innerHTML = clock(parseInt(totalSeconds / 60));
}

function clock(val) {
	var valStr = val + "";
	if (valStr.length < 2) {
		return "0" + valStr;
	} else {
		return valStr;
	}
}

function timerStart() {
	if(moves === 0) {
		t = setInterval(timerUpdate, 1000);
	}
}

function timerStop() {
	clearInterval(t);
}

function timerReset() {
	timerStop();
	totalSeconds = 0;
	seconds.innerHTML = "00";
	minutes.innerHTML = "00";
}

/*
 * Gaming functions:
 *	- showCard(card): shows the selected card
 *	- addCardToList(card): adds the selected card to a stack of opened cards
 *	- matchingControl(): verifies that the two previous selected cards are equal. At the end of this verify, empties the openedCards stack
 *	- correctMatch(): holds the correct cards on the grid
 *	- wrongMatch(): flips the wrong match and remove a life
 *	- movesUpdate(), lifesUpdate(): updates the moves and lifes counter
 *	- scoreUpdate(): updates the score using a time criteria
 */

function showCard(card) {
	card.className = 'card open show animated bounceIn';
}

function addCardToList(card) {
	openedCards.push(card);
}

function matchingControl() {
	let n = openedCards.length;
	
	if(n === 2) {
		movesUpdate();
		if(openedCards[0].firstElementChild.className === openedCards[1].firstElementChild.className) {
			correctMatch();
		} else {
			wrongMatch();
		}
		for(let i = n; i > 0; i--) {
			openedCards.pop();
		}
	}
}

function correctMatch() {
	for(let card of openedCards) {
		card.className = 'card match animated pulse';
		setTimeout(function() {
			card.classList.remove('animated');
			card.classList.remove('pulse');
		}, 500);
	}
	
	unmatchedCards -= 2;
	
	if(unmatchedCards === 0) {
		timerStop();
		showModal();
	}
}

function wrongMatch() {
	lifesUpdate();

	if(lifes !== 0) {
		for(let card of openedCards) {
			card.className = 'card wrong animated shake';
			setTimeout(function() {
				card.className = 'animated flipInY card';
			}, 750);
			setTimeout(function() {
				card.classList.remove('animated');
				card.classList.remove('flipInY');
			}, 1250);
		}
	} else {
		for(let card of cards) {
			if(card.className !== 'card match') {
				card.className = 'card wrong animated flipInY';
			}
		}
		timerStop();
		let starsNumber = starsArea.childElementCount;
		for(let i = 0; i < starsNumber; i++) {
			starsArea.firstElementChild.remove();
		}
		showModal();
	}
}

function movesUpdate() {
	moves++;
	movesNumberTxt.innerText = moves;
}

function lifesUpdate() {
	lifesArea.firstElementChild.remove();
	lifes--;
}

function scoreUpdate() {
	if(totalSeconds === 60 || totalSeconds === 90 || totalSeconds === 105) {
		starsArea.firstElementChild.remove();
	}
}

/*
 * Modal functions
 *	- showModal(): shows the modal when the game ends
 *	- hideModal(): hides the modal when a player click on the screen or click on the "X" button
 */

function showModal() {
	let starsNumber = starsArea.childElementCount;
	let modalTitle = document.querySelector('.modal-title');
	let modalText = document.querySelector('.modal-text');

	modal.style.display = 'block';

	if(lifes !== 0) {
		modalTitle.innerText = 'Congratulations!';
		modalText.innerText = `You won! Try to improve your score!\n\nMoves: ${moves} - Lifes: ${lifes}\nGame time: ${clock(parseInt(totalSeconds / 60))}:${clock(totalSeconds % 60)}`;
		for(let i = 0; i < starsNumber; i++) {
			points.insertAdjacentHTML('beforeend', star);
		}
	} else {
		modalTitle.innerText = 'You lose...';
		modalText.innerText = `You lose... But don't give up! You'll be more lucky next time!\n\nMoves: ${moves}\nGame time: ${clock(parseInt(totalSeconds / 60))}:${clock(totalSeconds % 60)}`;
	}
}

function hideModal() {
	let starsNumber = points.childElementCount;

	for(let i = 0; i < starsNumber; i++) {
		points.firstElementChild.remove();
	}

	modal.style.display = 'none';
}

window.addEventListener('click', function(event) {
    if(event.target === modal) {
		hideModal();
    }
});

closeBtn.addEventListener('click', function() {
	hideModal();
});

/*
 * Try again button function for the modal
 */

tryAgainBtn.addEventListener('click', function() {
	restartGame();
});