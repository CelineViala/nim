import { useContext } from 'react';
import { DataGameContext } from '../contexts/DataGame';

function useSocket(socket) {
    const {
        gameData,
        setPlayers,
        setCurrentPlayer,
        setChoosenMatches,
        setIndexPlayer,
        setAdv,
        setboardHidden,
        setWaiting,
        setMessage,
        setFinalChoice,
    } = useContext(DataGameContext);

    const listenDeco = (setMustDisappearMatch, setIsActiveMatch) => {
        socket.on('deco_adv', (data) => {
            setChoosenMatches([]);
            setFinalChoice([]);
            setboardHidden(true);
            setAdv({});
            setMessage('Cliquer sur Jouer pour recommencer une partie.');
            alert(data.msg);
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
    const emitPlay = () => {
        socket.emit('play', { pseudo: gameData.pseudo });
    };
    return {
        listenDeco,
        listenInfoGame,
        listenInfoTurn,
        emitUpdateTurn,
        listenWait,
        listenPlay,
        emitPlay,
        emitSelectedMatch,
        emitIdToUndisplayMatch,
        listenSelectedMatch,
        listenUndisplayMatch,
    };
}

export default useSocket;
