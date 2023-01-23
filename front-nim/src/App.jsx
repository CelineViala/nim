/* eslint-disable jsx-a11y/label-has-associated-control */
import {
    React, useContext, useRef,
} from 'react';
import style from './css/App.module.css';
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

        inputRef.current.value = '';
        emitPlay();
    };

    return (
        <div className="App">
            <h1 className={style.title}>Jeu de Nim</h1>

            <h2 className={`${style.title} ${style.titleh2} ${(!gameData.waiting && gameData.boardHidden) ? `${style.hidden}` : ''}`}>{`Bienvenue ${gameData.pseudo?.toUpperCase()}`}</h2>
            <p className={style.rule}>
                Regle: Retirer de une à 3 allumettes.
                Celui qui prend la dernière allumette disponible gagne.

            </p>
            <Game />
            <div className={`${!gameData.boardHidden && `${style.hidden}`}`}>
                <div className={style.form}>
                    <label className={`${style.labelPseudo} ${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`}>Pseudo :</label>
                    <input
                        className={`${style.inputPseudo}  ${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`}
                        ref={inputRef}
                        placeholder="Entre un pseudo"
                        onChange={(event) => {
                            setPseudo(event.target.value);
                        }}
                    />
                </div>
                <p className={style.message}>{gameData.message}</p>
                <button type="button" className={`${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`} onClick={handlePlay}>JOUER</button>
            </div>
        </div>
    );
}

export default App;
