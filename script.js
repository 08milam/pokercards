const { useState, useEffect } = React;

function App() {
  const [deckId, setDeckId] = useState(null);
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // Fetch a new deck of cards from the API
  useEffect(() => {
    async function fetchNewDeck() {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
      const data = await response.json();
      setDeckId(data.deck_id);
      setCardsRemaining(data.remaining);
    }
    fetchNewDeck();
  }, []);

  // Draw a card from the deck
  const drawCard = async () => {
    if (cardsRemaining === 0) {
      alert("Error: no cards remaining!");
      return;
    }

    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
    const data = await response.json();
    setCardsRemaining(data.remaining);
    setCurrentCard(data.cards[0]);
    setDrawnCards(prevDrawnCards => [data.cards[0], ...prevDrawnCards.slice(0, 4)]);
  };

  // Shuffle the deck
  const shuffleDeck = async () => {
    setIsShuffling(true);
    setDrawnCards([]);
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    const data = await response.json();
    setCardsRemaining(data.remaining);
    setIsShuffling(false);
  };

  return (
    <div className="App">
      <h1>Deck of Cards</h1>
      <button onClick={drawCard}>Draw a Card</button>
      <button onClick={shuffleDeck} disabled={isShuffling}>
        {isShuffling ? "Shuffling..." : "Shuffle Deck"}
      </button>
      {currentCard && (
        <div>
          <img src={currentCard.image} alt={currentCard.code} />
          <p>{currentCard.value} of {currentCard.suit}</p>
        </div>
      )}
      <div className="cardContainer">
        {drawnCards.map((card, index) => (
          <div className="card" key={index}>
            <img src={card.image} alt={card.code} />
            <p>{card.value} of {card.suit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));