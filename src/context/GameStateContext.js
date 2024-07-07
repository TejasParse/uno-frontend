// GameStateContext.js

import React, { createContext, useReducer, useContext } from "react";

const cards = require('./cards.json');

const initialState = {
	isHost: 0,

	roomNo: -1,
	host: "",
	players: [],
	presentCard: 0,
	started: 0,
	current_turn: 0,
	direction: 0,
	winners: [],
	messages: [],

	userDetails: {},
};

const gameReducer = (state, action) => {
	switch (action.type) {

		case "create_room_success":

			let newState1 = {
				...action.payload.game,
				isHost: 1,
				userDetails: action.payload.userDetails
			};
			// console.log(newState1, "This is new State");

			return newState1;

		case "join_room_success":

			let newState2 = {
				...action.payload.game,
				userDetails: action.payload.userDetails
			};
			// console.log(newState2, "This is new State");

			return newState2;

		case "UPDATE":

			let newState3 = {
				...action.payload.game,
				userDetails: action.payload.userDetails,
				isHost: state.isHost,
			};
			// console.log(newState3, "This is new State");

			return newState3;

		case "SET_HOST":

			let newState4 = {
				...state,
				isHost: 1
			};
			// console.log(newState3, "This is new State");

			return newState4;

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
