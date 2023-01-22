import {
    React, useContext,
} from 'react';
import style from './App.module.css';
import Game from './Game';
import { DataGameContext } from './contexts/DataGame';
import useSocket from './hooks/useSocket';

function App() {
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
        emitPlay();
    };

    return (
        <div className="App">
            <h1>Jeu de Nim</h1>
            <Game />
            <div className={`${!gameData.boardHidden && `${style.hidden}`}`}>
                <label>Pseudo : </label>
                <input
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
