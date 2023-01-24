import { useContext } from 'react';
import { DataGameContext } from '../contexts/DataGame';
import mp3 from '../media/allumette.mp3';

function useSocket(socket) {
    const {
        gameData,
        setPlayers,
        setCurrentPlayer,
        setChoosenMatches,
        setIndexPlayer,
        setAdv,
        setNbMatch,
        setboardHidden,
        setWaiting,
        resetGame,
        setMessage,
        setFinalChoice,
    } = useContext(DataGameContext);

    const listenDeco = () => {
        socket.on('deco_adv', (data) => {
            setChoosenMatches([]);
            setFinalChoice([]);
            setboardHidden(true);
            setAdv({});
            setNbMatch(0);
            setMessage('Cliquer sur Jouer pour recommencer une partie.');
            alert(data.msg);
        });
    };
    const listenDecoMatch = (setMustDisappearMatch, setIsActiveMatch) => {
        socket.on('deco_adv', () => {
            if (setMustDisappearMatch) setMustDisappearMatch(false);
            if (setIsActiveMatch) setIsActiveMatch(false);
        });
    };
    const listenInfoGame = () => {
        socket.on('info_game', (data) => { // info about the game (partie)
            setIndexPlayer(data.index);
            setPlayers(data.players);
            setCurrentPlayer(data.players[data.index]);
        });
    };
    const listenInfoTurn = () => {
        socket.on('info_turn', (data) => {
            setIndexPlayer((data.index));
            setCurrentPlayer(gameData.players[data.index]);
            setChoosenMatches([]);
        });
    };
    const listenWait = () => {
        socket.on('wait', (data) => {
            setWaiting(true);
            setMessage(data.msg);
        });
    };

    const listenPlay = () => {
        socket.on('play', (data) => {
            if (data.adv) {
                setAdv(data.adv);
                setboardHidden(false);
                setWaiting(false);
            }
        });
    };
    const listenUndisplayMatch = (ref, setMustDisappear) => {
        socket.on('undisplay', (data) => {
            if (ref.current.getAttribute('id') === data) { setMustDisappear(true); }
        });
    };
    const emitUpdateTurn = () => {
        socket.emit('reset_info_turn', {
            adv: gameData.adv,
            index: !gameData.indexPlayer,
        });
    };
    const emitSelectedMatch = (ref, isActive) => {
        socket.emit('selectedMatch', { match: ref.current.getAttribute('id'), adv: gameData.adv, active: isActive });
    };
    const emitIdToUndisplayMatch = (ref) => {
        if (gameData.finalChoice.includes(ref.current.getAttribute('id'))) {
            socket.emit('idToUndisplay', { id: ref.current.getAttribute('id'), adv: gameData.adv });
        }
    };
    const listenSelectedMatch = (ref, setIsActive) => {
        socket.on('actived', (data) => {
            if (ref.current.getAttribute('id') === data.match) setIsActive(data.active);
        });
    };
    const listenUpdateNbMatch = () => {
        socket.on('updateNbMatch', (data) => {
            setNbMatch(gameData.nbMatch + Number(data.nb));
            if (gameData.volume) {
                console.log(gameData.volume);
                const myAudio = document.createElement('audio');
                myAudio.src = mp3;
                myAudio.play();
            }
        });
    };
    const emitPlay = () => {
        socket.emit('play', { pseudo: gameData.pseudo });
    };
    const emitStopGame = () => {
        socket.emit('stop', { adv: gameData.adv });
    };
    const emitRestartGame = () => {
        socket.emit('restart', { adv: gameData.adv });
    };
    const listenStopGame = () => {
        socket.on('stopGame', (data) => {
            resetGame();
            setMessage(data.msg);
        });
        socket.on('restartGame', (data) => {
            resetGame();
            setMessage(data.msg);
        });
    };

    const listenStopGameMatch = (setMustDisappear, setIsActive) => {
        socket.on('stopGame', () => {
            setMustDisappear(false);
            setIsActive(false);
        });
        socket.on('restartGame', () => {
            setMustDisappear(false);
            setIsActive(false);
        });
    };

    const emitNbMatch = (n) => {
        socket.emit('nbMatch', { adv: gameData.adv, nb: n });
    };
    return {
        listenDeco,
        listenInfoGame,
        listenInfoTurn,
        emitUpdateTurn,
        listenWait,
        listenUpdateNbMatch,
        listenPlay,
        listenDecoMatch,
        emitPlay,
        emitRestartGame,
        emitSelectedMatch,
        listenStopGameMatch,
        emitIdToUndisplayMatch,
        listenSelectedMatch,
        listenUndisplayMatch,
        listenStopGame,
        emitStopGame,
        emitNbMatch,
    };
}

export default useSocket;
