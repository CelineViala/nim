/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, {
    useEffect, useContext,
} from 'react';
import style from './css/Game.module.css';
import Match from './Match';
import { DataGameContext } from './contexts/DataGame';
import useSocket from './hooks/useSocket';
import useGame from './hooks/useGame';
import volumePict from './media/volume2.png';
import mutePict from './media/volume.png';

function Game() {
    const {
        gameData,
        setVolume,
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
    const handleVolume = () => {
        setVolume(!gameData.volume);
    };
    useEffect(() => {
        listenStopGame();
        listenDeco();
        listenWait();
        listenPlay();
        listenInfoGame();
        listenInfoTurn();
        listenUpdateNbMatch();
        setMessageTurn();
        return () => {
            gameData.socket.off('stopGame');
            gameData.socket.off('deco_adv');
            gameData.socket.off('info_turn');
            gameData.socket.off('updateNbMatch');
            gameData.socket.off('info_game');
            gameData.socket.off('play');
            gameData.socket.off('wait');
        };
    }, [gameData.indexPlayer, gameData.volume]);
    return (
        <div className={`${style.game} ${gameData.boardHidden && `${style.hidden}`}`}>
            <h2 className={style.adv}>
                {`Votre adversaire : ${(gameData.adv?.pseudo?.toUpperCase())}`}
            </h2>
            <h3 className={style.message}>{gameData.message}</h3>
            <div className={style.volumeContainer}>
                <span className={style.volumeText}>{`Volume ${gameData.volume ? 'on' : 'off'}`}</span>
                <img src={gameData.volume ? volumePict : mutePict} alt="volume" width={30} onClick={handleVolume} />
            </div>
            <button className={`${gameData.nbMatch === gameData.n && `${style.hidden}`}`} onClick={handleValid} type="button">VALIDER</button>

            <button className={`${gameData.nbMatch < gameData.n && `${style.hidden}`}`} onClick={emitRestartGame} type="button">RETOUR</button>

            <div className={style['matches-box']}>
                {Array.from(Array(gameData.n).keys(), (x) => (
                    <Match
                        key={x}
                        id={`${x}`}
                    />
                ))}
            </div>
            <button className={`${style.stopGame} ${gameData.nbMatch === gameData.n && `${style.hidden}`}`} onClick={emitStopGame} type="button">ARRETER LA PARTIE</button>
        </div>
    );
}

export default Game;
