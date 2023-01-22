import React, {
    useEffect, useContext,
} from 'react';
import style from './Game.module.css';
import Match from './Match';
import { DataGameContext } from './contexts/DataGame';
import useSocket from './hooks/useSocket';
import useGame from './hooks/useGame';

function Game() {
    const {
        gameData,
    } = useContext(DataGameContext);

    const {
        listenDeco,
        listenInfoGame,
        listenInfoTurn,
        listenWait,
        listenUpdateNbMatch,
        listenPlay,
    } = useSocket(gameData.socket);

    const {
        handleValid,
        setMessageTurn,
    } = useGame();
    // const refs = [];
    // const getRef = () => {
    //   const ref = createRef(null);
    //   refs.push(ref);
    //   return ref;
    // };

    useEffect(() => {
        listenDeco();
        listenWait();
        listenPlay();
        listenInfoGame();
        listenInfoTurn();
        listenUpdateNbMatch();
        setMessageTurn();
    }, [gameData.socket, gameData.currentPlayer]);
    return (
        <div className={`${style.game} ${gameData.boardHidden && `${style.hidden}`}`}>
            <h2>
                Adversaire :
                {gameData.adv?.pseudo}
            </h2>
            <h3>{gameData.message}</h3>
            <button onClick={handleValid} type="button">VALIDER</button>
            <div className={style['matches-box']}>
                {Array.from(Array(10).keys(), (x) => (
                    <Match
                        key={x}
                        id={`${x}`}
                    />
                ))}
            </div>

        </div>

    );
}

export default Game;
