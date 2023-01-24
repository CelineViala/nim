/* eslint-disable react/prop-types */
import { React, createContext, useReducer } from 'react';
import io from 'socket.io-client';

const DataGameContext = createContext({
    gameData: {
        n: 16,
        players: [],
        socket: null,
        currentPlayer: null,
        indexPlayer: null,
        message: '',
        volume: false,
        nbMatch: 0,
        adv: {},
        pseudo: '',
        waiting: false,
        choosenMatches: [],
        boardHidden: true,
        finalChoice: [],
    },
    setPlayers: () => {},
    setCurrentPlayer: () => {},
    setChoosenMatches: () => {},
    setIndexPlayer: () => {},
    setSocket: () => {},
    setMessage: () => {},
    setFinalChoice: () => {},
    setAdv: () => {},
    setPseudo: () => {},
    setWaiting: () => {},
    setboardHidden: () => {},
    setNbMatch: () => {},
    resetGame: () => {},
    setVolume: () => {},

});
export { DataGameContext };

const INITIAL_GAME = {
    n: 16,
    players: [],
    currentPlayer: null,
    socket: io.connect(process.env.REACT_APP_BACK_URL),
    indexPlayer: null,
    message: '',
    nbMatch: 0,
    volume: false,
    boardHidden: true,
    adv: {},
    pseudo: '',
    waiting: false,
    choosenMatches: [],
    finalChoice: [],
};

const gameReducer = (state, action) => {
    const currentState = state || INITIAL_GAME;
    if (action.value === undefined) { return currentState; }

    switch (action.type) {
    case 'RESET':
        return INITIAL_GAME;
    case 'SET_PLAYERS':
        return { ...state, players: action.value };
    case 'SET_NBMATCH':
        return { ...state, nbMatch: action.value };
    case 'SET_PSEUDO':
        return { ...state, pseudo: action.value };
    case 'SET_ADV':
        return { ...state, adv: action.value };
    case 'SET_CURRENT_PLAYER':
        return { ...state, currentPlayer: action.value };
    case 'SET_CHOOSEN_MATCHES':
        return { ...state, choosenMatches: action.value };
    case 'SET_INDEX_PLAYER':
        return { ...state, indexPlayer: Number(action.value) };
    case 'SET_SOCKET':
        return { ...state, socket: action.value };
    case 'SET_MESSAGE':
        return { ...state, message: action.value };
    case 'SET_FINAL_CHOICE':
        return { ...state, finalChoice: action.value };
    case 'SET_WAITING':
        return { ...state, waiting: action.value };
    case 'SET_BOARD_HIDDEN':
        return { ...state, boardHidden: action.value };
    case 'SET_VOLUME':
        return { ...state, volume: action.value };
    default:
        return currentState;
    }
};

function DataGameContextProvider({ children }) {
    const [gameData, dispatch] = useReducer(gameReducer, INITIAL_GAME);
    const setPlayers = (players) => {
        dispatch({
            type: 'SET_PLAYERS',
            value: players,
        });
    };
    const setPseudo = (pseudo) => {
        dispatch({
            type: 'SET_PSEUDO',
            value: pseudo,
        });
    };
    const setCurrentPlayer = (player) => {
        dispatch({
            type: 'SET_CURRENT_PLAYER',
            value: player,
        });
    };
    const setChoosenMatches = (choosenMatches) => {
        dispatch({
            type: 'SET_CHOOSEN_MATCHES',
            value: choosenMatches,
        });
    };
    const setIndexPlayer = (indexPlayer) => {
        dispatch({
            type: 'SET_INDEX_PLAYER',
            value: indexPlayer,
        });
    };
    const setSocket = (socket) => {
        dispatch({
            type: 'SET_SOCKET',
            value: socket,
        });
    };
    const setMessage = (message) => {
        dispatch({
            type: 'SET_MESSAGE',
            value: message,
        });
    };
    const setFinalChoice = (finalChoice) => {
        dispatch({
            type: 'SET_FINAL_CHOICE',
            value: finalChoice,
        });
    };
    const setAdv = (adv) => {
        dispatch({
            type: 'SET_ADV',
            value: adv,
        });
    };
    const setWaiting = (waiting) => {
        dispatch({
            type: 'SET_WAITING',
            value: waiting,
        });
    };
    const setboardHidden = (boardHidden) => {
        dispatch({
            type: 'SET_BOARD_HIDDEN',
            value: boardHidden,
        });
    };
    const setNbMatch = (nbMatch) => {
        dispatch({
            type: 'SET_NBMATCH',
            value: nbMatch,
        });
    };
    const resetGame = () => {
        dispatch({
            type: 'RESET',
            value: null,
        });
    };
    const setVolume = (volume) => {
        dispatch({
            type: 'SET_VOLUME',
            value: volume,
        });
    };

    // eslint-disable-next-line react/jsx-no-constructed-context-values
    const value = {
        gameData,
        setPlayers,
        setCurrentPlayer,
        setChoosenMatches,
        setIndexPlayer,
        setVolume,
        setSocket,
        setMessage,
        setNbMatch,
        setFinalChoice,
        setAdv,
        setPseudo,
        setWaiting,
        setboardHidden,
        resetGame,
    };
    return (
        <DataGameContext.Provider value={value}>
            {children}
        </DataGameContext.Provider>
    );
}

export default DataGameContextProvider;
