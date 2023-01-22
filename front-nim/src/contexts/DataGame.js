import { createContext, useReducer } from "react";
import io from 'socket.io-client'

const DataGameContext=createContext({
    gameData:{
        players:[],
        socket:null,
        currentPlayer:null,
        indexPlayer:null,
        message:'',
        adv:null,
        pseudo:null,
        waiting:false,
        choosenMatches:[],
        finalChoice:[]
    },
    setPlayers:()=>{},
    setCurrentPlayer:()=>{},
    setChoosenMatches:()=>{},
    setIndexPlayer:()=>{},
    setSocket:()=>{},

})
export {DataGameContext};

const INITIAL_GAME={
    players:[],
    currentPlayer:null,
    socket:io.connect("http://localhost:5000"),
    indexPlayer:null,
    message:'',
    adv:null,
    pseudo:null,
    waiting:false,
    choosenMatches:[],
    finalChoice:[]
}

const gameReducer=(state,action)=>{
    const currentState=state?state:INITIAL_GAME;
    if(action.value===undefined)
        return currentState;

    switch (action.type) {
        case "SET_PLAYERS":
            return {...state,players:action.value}   
        case "SET_CURRENT_PLAYER":
            return {...state,currentPlayer:action.value}
        case "SET_CHOOSEN_MATCHES":       
            return {...state,choosenMatches:action.value}   
        case "SET_INDEX_PLAYER":
            return {...state,indexPlayer:action.value}    
        case "SET_SOCKET":    
            return {...state,socket:action.value}
        default:
            return currentState
            
    }
    
}

const DataGameContextProvider=({children})=>{

    const [gameData,dispatch]=useReducer(gameReducer,INITIAL_GAME);
    const setPlayers=(players)=>{
        dispatch({
            type:'SET_PLAYERS',
            value:players
        })
    }
    const setCurrentPlayer=(player)=>{
        dispatch({
            type:'SET_CURRENT_PLAYER',
            value:player
        })
    }
    const setChoosenMatches=(choosenMatches)=>{
        dispatch({
            type:'SET_CHOOSEN_MATCHES',
            value:choosenMatches
        })
    }
    const setIndexPlayer=(indexPlayer)=>{
        dispatch({
            type:'SET_INDEX_PLAYER',
            value:indexPlayer
        })
    }
    const setSocket=(socket)=>{
        dispatch({
            type:'SET_SOCKET',
            value:socket
        })
    }

    const value={
        gameData,
        setPlayers,
        setCurrentPlayer,
        setChoosenMatches,
        setIndexPlayer,
        setSocket
    }
    return (
        <DataGameContext.Provider value={value}>
            {children}
        </DataGameContext.Provider>
    );
};

export default DataGameContextProvider;