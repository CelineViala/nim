import React, {
    useEffect, useContext,
} from 'react';
import style from './Game.module.css';
import Match from './Match';
import { DataGameContext } from './contexts/DataGame';

function Game() {
    const {
        gameData,
        setPlayers,
        setCurrentPlayer,
        setChoosenMatches,
        setIndexPlayer,
        setMessage,
        setFinalChoice,
    } = useContext(DataGameContext);

    // const refs = [];
    // const getRef = () => {
    //   const ref = createRef(null);
    //   refs.push(ref);
    //   return ref;
    // };

    const handleClickMatch = (e) => {
        let copy = [...gameData.choosenMatches];
        if (!copy.includes(e.target)) {
            if (gameData.currentPlayer.id !== gameData.socket.id) return false;
            if (copy.length === 3) {
                const messageText = gameData.message;
                setMessage('Vous ne pouvez pas choisir plus de 3 allumettes.');
                setTimeout(() => {
                    setMessage(messageText);
                }, 2000);
                return false;
            }
            copy.push(e.target);
        } else {
            // unselect
            copy = copy.filter((item) => item !== e.target);
        }
        setChoosenMatches(copy);
        return true;
    };
    const handleValid = () => {
        if (!gameData.choosenMatches.length) return; // zero match selected
        const ids = [...gameData.finalChoice]; // id of matches that have to disappear
        gameData.choosenMatches.forEach((match) => {
            ids.push(match.getAttribute('id'));
        });
        setFinalChoice(ids);
        gameData.socket.emit('reset_info_turn', {
            adv: gameData.adv,
            index: !gameData.indexPlayer,
        });
    };
    useEffect(() => {
        gameData.socket.on('deco_adv', () => {
            setChoosenMatches([]);
            setFinalChoice([]);
        });
        gameData.socket.on('info_game', (data) => { // info about the game (partie)
            setIndexPlayer(data.index);
            setPlayers(data.players);
            setCurrentPlayer(data.players[data.index]);
        });
        gameData.socket.on('info_turn', (data) => {
            setIndexPlayer((data.index));
            setCurrentPlayer(gameData.players[data.index]);
            setChoosenMatches([]);
        });
        if (gameData.currentPlayer) {
            if (gameData.currentPlayer.id !== gameData.socket.id) {
                setMessage('C\'est au tour de votre adversaire de jouer.');
            } else {
                setMessage('A vous de jouer. Pensez à valider.');
            }
        }
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
                        onClicKMatch={handleClickMatch}

                    />
                ))}
            </div>

        </div>

    );
}

export default Game;
