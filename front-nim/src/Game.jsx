import React, {
    useEffect, useContext,
} from 'react';
import style from './css/Game.module.css';
import Match from './Match';
import { DataGameContext } from './contexts/DataGame';
import useSocket from './hooks/useSocket';
import useGame from './hooks/useGame';
import volumePict from './media/volume.png';

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
        listenStopGame,
        emitStopGame,
        emitRestartGame,
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
        listenStopGame();
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
            <h2 className={style.adv}>
                {`Votre adversaire : ${(gameData.adv?.pseudo?.toUpperCase())}`}
            </h2>
            <h3 className={style.message}>{gameData.message}</h3>
            <img src={volumePict} alt="volume" width={30} />
            <button className={`${gameData.nbMatch === 10 && `${style.hidden}`}`} onClick={handleValid} type="button">VALIDER</button>

            <button className={`${gameData.nbMatch < 10 && `${style.hidden}`}`} onClick={emitRestartGame} type="button">RETOUR</button>

            <div className={style['matches-box']}>
                {Array.from(Array(10).keys(), (x) => (
                    <Match
                        key={x}
                        id={`${x}`}
                    />
                ))}
            </div>
            <button className={`${style.stopGame} ${gameData.nbMatch === 10 && `${style.hidden}`}`} onClick={emitStopGame} type="button">ARRETER LA PARTIE</button>

        </div>

    );
}

export default Game;
