// GameStateContext.js

import React, { createContext, useReducer, useContext } from "react";

const cards = require('./cards.json');

const getNewDecks = (players) => {
  const numberOfSets = players.length;

  const selectedIndexes = new Set();
  const selectedSets = [];

  for (let i = 0; i < numberOfSets; i++) {
    const selectedCards = [];
    while (selectedCards.length < 1) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      if (!selectedIndexes.has(randomIndex)) {
        selectedIndexes.add(randomIndex);
        selectedCards.push(randomIndex);
      }
    }
    players[i].cards = selectedCards
    selectedSets.push(selectedCards);
  }
  return { players, selectedIndexes }
}

const getDeck = (selectedIndexes) => {

  if (selectedIndexes) {
    const selectedCards = [];
    while (selectedCards.length < 1) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      if (!selectedIndexes?.has(randomIndex)) {
        selectedIndexes?.add(randomIndex);
        selectedCards.push(randomIndex);
      }
    }

    return { selectedCards, selectedIndexes }
  }

}

const getRandomCards = (selectedIndexes, cardsCount) => {
  if (selectedIndexes) {
    const selectedCards = [];
    while (selectedCards.length < cardsCount) {
      const randomIndex = Math.floor(Math.random() * cards.length);
      if (!selectedIndexes?.has(randomIndex)) {
        selectedIndexes?.add(randomIndex);
        selectedCards.push(randomIndex);
      }
    }

    return { selectedCards, selectedIndexes }
  }
}

const getNextTurn = (players, dir, current_turn) => {
  let newCurrentTurn
  if (!dir) {
    newCurrentTurn = current_turn + 1;
    if (newCurrentTurn >= players.length) {
      newCurrentTurn = 0;
    }

  } else {

    newCurrentTurn = current_turn - 1;
    if (newCurrentTurn < 0) {
      newCurrentTurn = players.length - 1;
    }
  }

  return newCurrentTurn

}

const initialState = {
  roomNo: 0,
  isHost: 0,

  players: [],

  userDetails: {},
  presentCard: 0,
  selectedIndexes: new Set(),
  started: 0,

  current_turn: 0,
  direction: 0,
  winners: []
};

// Define the reducer function to handle state updates
const gameReducer = (state, action) => {
  switch (action.type) {
    case "opponent_joined":
      // console.log(action.payload, "Payload Her");


      let new_state;

      if (state.started && state.isHost) {
        let { selectedCards, selectedIndexes: newIndexs } = getDeck(state.selectedIndexes)
        new_state = {
          ...state,
          players: [...state.players,
          { username: action.payload.username, cards: selectedCards }
          ],
          selectedIndexes: newIndexs
        };

      } else {
        new_state = {
          ...state,
          players: [...state.players,
          { username: action.payload.username }
          ],
        };

      }


      action.callback(new_state);

      return new_state;
    case "player_joined":

      return {
        ...state,
        userDetails: {
          username: action.payload.username,
        },
        players: [{
          username: action.payload.username,
        }],
        roomNo: action.payload.roomNo,
      };
    case "set_host":
      return {
        ...state,
        isHost: 1,
      };
    case "host_update":
      return {
        ...state,
        ...action.payload,
        selectedIndexes: new Set(action.payload.selectedIndexes)
      };
    case "player_update":
      return {
        ...state,
        ...action.payload,
        selectedIndexes: new Set(action.payload.selectedIndexes)
      };
    case "start_game":

      const { players, selectedIndexes } = getNewDecks(state.players)

      // console.log(selectedIndexes, "What is happenig");

      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * cards.length);
      } while (state.selectedIndexes.has(randomIndex));


      state.selectedIndexes.add(randomIndex);

      // Retrieve the card at the selected index
      const selectedCard = cards[randomIndex];

      let new_state1 = {
        ...state,
        players,
        presentCard: randomIndex,
        selectedIndexes,
        started: 1,
        current_turn: 0,
        direction: 0
      };

      action.callback(new_state1);

      return new_state1
    case "play_card":

      const newPlayedCard = cards[action.payload.cardNo]

      const
        playerIndex = state.players.findIndex(player => player.username === state.userDetails.username);

      if (playerIndex === -1) {
        return state;
      }

      const player = state.players[playerIndex];

      const newSelectedIndexes = state.selectedIndexes;
      newSelectedIndexes.delete(action.payload.cardNo);

      const newPlayerCards = player.cards.filter(card => card !== action.payload.cardNo);

      let dir = state.direction
      let oldDir = dir;
      if (newPlayedCard.display_text === "Reverse") {
        dir ^= 1
        console.log("Reversing the order", dir);
      }

      let newCurrentTurn = getNextTurn(state.players, dir, state.current_turn)
      let nextTurn = newCurrentTurn
      

      let newState = {
        ...state,
        presentCard: action.payload.cardNo,
        selectedIndexes: newSelectedIndexes,
        players: [
          ...state.players.slice(0, playerIndex),
          {
            ...player,
            cards: newPlayerCards
          },
          ...state.players.slice(playerIndex + 1)
        ],
        current_turn: newCurrentTurn,
        direction: dir
      };




      if (newPlayedCard.display_text === "+2") {
        let { selectedCards, selectedIndexes: newIndexs } = getRandomCards(state.selectedIndexes, 2)
        console.log(selectedCards, "Draw Two Cards", nextTurn);

        newState = {
          ...newState,
          selectedIndexes: newIndexs,
          players: [
            ...newState.players.slice(0, nextTurn),
            {
              ...newState.players[nextTurn],
              cards: [
                ...newState.players[nextTurn].cards,
                ...selectedCards
              ]
            },
            ...newState.players.slice(nextTurn + 1)
          ]
        };
        console.log(newState, "New State?", newState?.players[nextTurn], "New PLayer", nextTurn);
      } 

      if (newPlayerCards.length === 0) {
        console.log("Game Over");
        newState = {
          ...state,
          presentCard: action.payload.cardNo,
          selectedIndexes: newSelectedIndexes,
          players: [
            ...state.players.slice(0, playerIndex),
            ...state.players.slice(playerIndex + 1)
          ],
          current_turn: newState.current_turn, 
          direction: dir,
          winners: [
            ...state.winners,
            {
              ...player,
              cards: newPlayerCards
            },
          ]
        };
        console.log(newState, "Player Won. Changing State");
        if (oldDir === 0) {

          if (newCurrentTurn !== 0) {
            newState.current_turn = newCurrentTurn - 1;
          }

        } else if (oldDir === 1) {

          if (newCurrentTurn !== (newState.players.length - 1)) {
            newState.current_turn = newCurrentTurn + 1;
          }

        }
      }

      if(newPlayedCard.display_text === "Skip") {
        newState.current_turn = getNextTurn(newState.players, newState.direction, newState.current_turn);
      }

      // if(newState.players.length <= 1) {

      //   newState = {
      //     ...newState,
      //     players: [],
      //     winners: [
      //       ...newState.winners,
      //       ...newState.players
      //     ]
      //   }

      // }

      action.callback(newState);

      return newState

    case "random_card":

      // console.log("Picking a random card");

      const playerIndex1 = state.players.findIndex(player => player.username === state.userDetails.username);

      if (playerIndex1 === -1) {
        return state;
      }

      const player1 = state.players[playerIndex1];

      let randomIndex1;
      do {
        randomIndex1 = Math.floor(Math.random() * cards.length);
      } while (state.selectedIndexes.has(randomIndex1));

      const newSelectedIndexes1 = state.selectedIndexes;
      newSelectedIndexes1.add(randomIndex1);

      // console.log(player1.cards, "Cards Before");
      const newPlayerCards1 = [...player1.cards]; // Create a copy of the array
      newPlayerCards1.push(randomIndex1);
      // console.log(newPlayerCards1, "Cards After");

      let dir1 = state.direction

      let newCurrentTurn1
      if (!dir1) {
        newCurrentTurn1 = state.current_turn + 1;
        if (newCurrentTurn1 >= state.players.length) {
          newCurrentTurn1 = 0;
        }

      } else {

        newCurrentTurn1 = state.current_turn - 1;
        if (newCurrentTurn1 < 0) {
          newCurrentTurn1 = state.players.length - 1;
        }

      }

      let newState1 = {
        ...state,
        selectedIndexes: newSelectedIndexes1,
        players: [
          ...state.players.slice(0, playerIndex1),
          {
            ...player1,
            cards: newPlayerCards1
          },
          ...state.players.slice(playerIndex1 + 1)
        ],
        current_turn: newCurrentTurn1,
        direction: dir1
      };

      action.callback(newState1);

      return newState1


    case "reset_game":

      let newPlayers = [
        ...state.players,
        ...state.winners
      ]
      const { players: players1, selectedIndexes: newIndexes } = getNewDecks(newPlayers)

      // console.log(selectedIndexes, "What is happenig");

      let randomIndex12;
      do {
        randomIndex12 = Math.floor(Math.random() * cards.length);
      } while (newIndexes.has(randomIndex12));


      newIndexes.add(randomIndex12);

      // Retrieve the card at the selected index
      const selectedCard1 = cards[randomIndex12];

      let new_state123 = {
        ...state,
        players: players1,
        presentCard: randomIndex12,
        selectedIndexes: newIndexes,
        started: 1,
        current_turn: 0,
        direction: 0,
        winners: []
      };

      action.callback(new_state123);

      return new_state123

    default:
      return state;
  }
};

// Create the context
const GameStateContext = createContext();

// Create the context provider component
export const GameStateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GameStateContext.Provider>
  );
};

// Custom hook to access the game state and dispatch actions
export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
