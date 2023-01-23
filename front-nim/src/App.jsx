/* eslint-disable jsx-a11y/label-has-associated-control */
import {
    React, useContext, useRef,
} from 'react';
import style from './App.module.css';
import Game from './Game';
import { DataGameContext } from './contexts/DataGame';
import useSocket from './hooks/useSocket';

function App() {
    const inputRef = useRef(null);
    const {
        gameData,
        setMessage,
        setPseudo,
    } = useContext(DataGameContext);

    const {
        emitPlay,
    } = useSocket(gameData.socket);

    const handlePlay = () => {
        if (gameData.pseudo === '') {
            setMessage('Veuillez entrez un pseudo');
            return;
        }
        console.log(inputRef);
        inputRef.current.value = '';
        emitPlay();
    };

    return (
        <div className="App">
            <h1>Jeu de Nim</h1>
            <h2 className={`${(!gameData.waiting && gameData.boardHidden) && `${style.hidden}`}`}>{`Bienvenue ${gameData.pseudo?.toUpperCase()}`}</h2>
            <Game />
            <div className={`${!gameData.boardHidden && `${style.hidden}`}`}>
                <label className={`${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`}>Pseudo :</label>
                <input
                    className={`${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`}
                    ref={inputRef}
                    placeholder="Entre un pseudo"
                    onChange={(event) => {
                        setPseudo(event.target.value);
                    }}
                />
                <p>{gameData.message}</p>
                <button type="button" className={`${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`} onClick={handlePlay}>JOUER</button>
            </div>
        </div>
    );
}

export default App;
