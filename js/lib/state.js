/*
  Base initial state
 */
export const userInput = {
  numberOfQuestions: 10,
  errors: [],
  numberOfPlayers: 1,
  players: [
    {
      id: 1,
      name: 'Player',
      answers: []
    }
  ]
};

export const loading = { state: true };
