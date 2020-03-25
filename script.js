const playerBoard = document.querySelector(".player-cards");
// const card = document.createElement("img");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");
const dealBtn = document.getElementById("dealBtn");

const resultsTable = document.querySelectorAll("td");

hitBtn.style.display = 'none';
standBtn.style.display = 'none';

const handFinish = document.createElement("div");

const cardBack = document.createElement("img");
cardBack.src = './images/back.png'
cardBack.classList.add('card', 'card-back');

handFinish.classList.add("hand-finish");

function deck(){
	let names = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
	let suits = ['H','D','S','C'];
	let cards = [];
    
    for( let s = 0; s < suits.length; s++ ) {
        for( let n = 0; n < names.length; n++ ) {
            cards.push( [names[n],suits[s]] );
        }
    }

    cards = shuffle(cards)
    return cards;
}

const shuffle = (deck) => {
    // for 1000 turns
    // switch the values of two random cards
    for (let i = 0; i < 100; i++)
    {
        let location1 = Math.floor((Math.random() * deck.length));
        let location2 = Math.floor((Math.random() * deck.length));
        let tmp = deck[location1];

        deck[location1] = deck[location2];
        deck[location2] = tmp;
    }
    return deck;
}

const blackjackGame = {
    you: {div: ".player-cards", scoreSpan: "#player-score", board: '.player', hand: [], score: 0},
    dealer: {div: ".dealer-cards", scoreSpan: "#dealer-score", board: '.dealer', hand: [], score: 0},
    cardsDeck: deck(),
    cardsMap: {'2': 2, '3': 3, '4':4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 10, 'Q': 10, 'K': 10, 'A': 11},
    player: this.you,
}

const YOU = blackjackGame.you;
const DEALER = blackjackGame.dealer;

const manageHit = (activePlayer) => {
    let card = randomCard();
    activePlayer.hand.push(blackjackGame.cardsMap[card[0]]);
    calcScore(activePlayer);
    if(activePlayer.score < 21){
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
    }else if(activePlayer.score === 21){
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score + ' (Blackjack!)';
    }else{
        document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score + ' (Bust!)';
    }
    showCard(card[0]+card[1], activePlayer);
}

const manageStand = () => {
    cardBack.classList.remove("card-show");
    cardBack.classList.add("card-hide");
    // cardBack.classList.display = "none";
    manageHit(DEALER)
    setTimeout(() => {
        let interval = setInterval(() => {
            if(DEALER.score < 17){
                manageHit(DEALER); 
            }else{
                clearInterval(interval);
                gameResults();
            }
        }, 500);
        
    }, 500);
}

const randomCard = () => {
    let randCard = Math.floor(Math.random() * blackjackGame.cardsDeck.length);
    let card = blackjackGame.cardsDeck[randCard];
    blackjackGame.cardsDeck.splice(blackjackGame.cardsDeck.indexOf(card), 1);
    return card;
}

const calcScore = (activePlayer) => {
    activePlayer.score = activePlayer.hand.reduce((a, b) => {
        return a+b;
    }, 0);

    if(activePlayer.score > 21){
        if(activePlayer.hand.indexOf(11) !== -1){
            activePlayer.hand[activePlayer.hand.indexOf(11)] = 1;
            calcScore(activePlayer);
        }
    } 
}

const manageDeal = (wait) => {
    let playerCards = document.querySelector(YOU.div).querySelectorAll('img');
    let dealerCards = document.querySelector(DEALER.div).querySelectorAll('img');
    resetGame(YOU, playerCards);
    resetGame(DEALER, dealerCards);
    
    //start new game
    blackjackGame.cardsDeck = deck();

    setTimeout(() => {
        manageHit(YOU); 
        setTimeout(() => {
            manageHit(DEALER);   
            setTimeout(() => {
                manageHit(YOU);
                setTimeout(() => {
                    document.querySelector(DEALER.div).appendChild(cardBack);
                    cardBack.classList.remove("card-hide")
                    cardBack.classList.add("card-show")
                    cardBack.style = "";
                    hitBtn.style = '';
                    standBtn.style = '';
                    dealBtn.style.display = 'none';
                }, 500);
            }, 500);
        }, 500);
        
    }, wait);
}

const showCard = (card, activePlayer) => {
    let playerDiv = document.querySelector(activePlayer.div);
    let newCard = document.createElement("img");
    newCard.src = `./images/${card}.png`;
    newCard.classList.add("card", "card-show");
    playerDiv.appendChild(newCard);
    if(activePlayer.score > 21) {
        activePlayer.score = 30;
        hitBtn.setAttribute("disabled", true);
        hitBtn.classList.remove(hitBtn.classList[1]);
        activePlayer === YOU ? gameWinner(1, "Dealer win!") : gameWinner(0, "You win!")
    
    }else if (activePlayer.score === 21){
        hitBtn.setAttribute("disabled", true);
        hitBtn.classList.remove(hitBtn.classList[1]);
        if(activePlayer === YOU){
            setTimeout(() => {
                manageStand();
                cardBack.style.display = "none";
            }, 700);
        }
    }
}

const resetGame = (activePlayer, cards) => {
    handFinish.style.display = 'none';
    activePlayer.hand = [];
    activePlayer.score = 0;
    document.querySelector(activePlayer.scoreSpan).textContent = activePlayer.score;
    // console.log( activePlayer );
    cards.forEach(card => {
        card.remove();
    });    
}

const gameResults = () => {
    console.log('your score: ' + blackjackGame.you.score + ' Dealer score: ' + blackjackGame.dealer.score)
    let yourScore = Math.abs(21 - blackjackGame.you.score);
    let dealerScore = Math.abs(21 - blackjackGame.dealer.score);
    let message = '';
    let winner = 0;

    if(yourScore < dealerScore){
        winner = 0;
        message = 'You win!';
    }else if(yourScore > dealerScore){
        winner = 1;
        message = 'Dealer win!';
    }else{
        winner = 2;
        message = "It's a draw!";
    }
    gameWinner(winner, message);
}

const gameWinner = (winner, message) => {

    let res = parseInt(resultsTable[winner].innerHTML);
    res++
    resultsTable[winner].innerHTML = res;

    hitBtn.style.display = 'none';
    hitBtn.removeAttribute("disabled");
    hitBtn.classList.add('btn-calc');
    standBtn.style.display = 'none';
    dealBtn.style = '';

    handFinish.style = '';
    handFinish.innerHTML = `<span>${message}</span>`
    document.querySelector(".blackjackBoard").appendChild(handFinish);

}