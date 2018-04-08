/*
 * Create a list that holds all of your cards
 */

const deckArea = document.querySelector('.deck');

let cards = deckArea.querySelectorAll('.card');

/*
 * Gaming variables
 */

let unmatchedCards, moves, lifes;

const starsArea = document.querySelector('.stars');

let star = starsArea.firstElementChild.outerHTML;

let movesNumberTxt = document.querySelector('.moves');

let openedCards = [];

/*
 * Restart game function
 */

const restartBtn = document.querySelector('.restart');

function restartGame() {
	let numberStars = starsArea.childElementCount;

	unmatchedCards = 16;
	lifes = 3;
	moves = 0;
	movesNumberTxt.innerText = moves;

	cardShuffling();

	for(let i = numberStars; i < 3; i++) {
		if(numberStars < 3) {
			let li = document.createElement('li');
			starsArea.insertAdjacentHTML('afterbegin', star);
		}
	}

	for(let i = 0; i < cards.length; i++) {
		cards[i].className = 'card';
	}
}

restartBtn.addEventListener('click', function() {
	restartGame();
});

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976

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
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

document.addEventListener('DOMContentLoaded', function() {
	restartGame();
	
	for(let card of cards) {
		card.addEventListener('click', function() {
			if(card.className === 'card') {
				showCard(card);
				addCardToList(card);
				matchingControl();
			}
		});
	}
});

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
		alert(`Congratulations! You have completed the game!\n\nFinal score: ${moves} moves`);
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
		alert(`GAME OVER\n\nFinal score: ${moves}`);
	}
}

function movesUpdate() {
	moves++;
	movesNumberTxt.innerText = moves;
}

function lifesUpdate() {
	starsArea.firstElementChild.remove();
	lifes--;
}