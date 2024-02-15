// Importing necessary React hooks
const { useState, useEffect } = React;

// Main component App
function App() {
  // State variables for deck ID, cards remaining, current card, drawn cards, and shuffling state
  const [deckId, setDeckId] = useState(null);
  const [cardsRemaining, setCardsRemaining] = useState(0);
  const [currentCard, setCurrentCard] = useState(null);
  const [drawnCards, setDrawnCards] = useState([]);
  const [isShuffling, setIsShuffling] = useState(false);

  // useEffect hook to fetch a new deck of cards from the API
  useEffect(() => {
    // Async function to fetch new deck
    async function fetchNewDeck() {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/');
      const data = await response.json();
      setDeckId(data.deck_id);
      setCardsRemaining(data.remaining);
    }
    fetchNewDeck(); // Invoke fetchNewDeck function on mount ([]) to fetch new deck
  }, []);

  // Function to draw a card from the deck
  const drawCard = async () => {
    if (cardsRemaining === 0) { // Check if no cards remaining
      alert("Error: no cards remaining!");
      return;
    }

    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/`);
    const data = await response.json();
    setCardsRemaining(data.remaining);
    setCurrentCard(data.cards[0]);
    // Limiting drawn cards to the latest 5, adding the latest card to the beginning of the list
    setDrawnCards(prevDrawnCards => [data.cards[0], ...prevDrawnCards.slice(0, 4)]);
  };

  // Function to shuffle the deck
  const shuffleDeck = async () => {
    setIsShuffling(true);
    setDrawnCards([]); // Clear drawn cards when shuffling
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    const data = await response.json();
    setCardsRemaining(data.remaining);
    setIsShuffling(false);
  };

  // JSX rendering
  return (
    <div className="App">
      <h1>Deck of Cards</h1>
      {/* Button to draw a card */}
      <button onClick={drawCard}>Draw a Card</button>
      {/* Button to shuffle the deck, disabled when shuffling */}
      <button onClick={shuffleDeck} disabled={isShuffling}>
        {isShuffling ? "Shuffling..." : "Shuffle Deck"}
      </button>
      {/* Displaying the current drawn card */}
      {currentCard && (
        <div>
          <img src={currentCard.image} alt={currentCard.code} />
          <p>{currentCard.value} of {currentCard.suit}</p>
        </div>
      )}
      {/* Container for previously drawn cards */}
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

// Rendering the App component to the HTML element with id 'root'
ReactDOM.render(<App />, document.getElementById('root'));
