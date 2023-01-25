import { useContext } from 'react';
import { DataGameContext } from '../contexts/DataGame';
import useSocket from './useSocket';

function useGame() {
    const {
        gameData,
        setChoosenMatches,
        setFinalChoice,
        setMessage,
    } = useContext(DataGameContext);
    const {
        emitUpdateTurn,
        emitSelectedMatch,
        emitNbMatch,
    } = useSocket(gameData.socket);
    const handleSelectedMatches = (e) => {
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
        const ids = []; // id of matches that have to disappear
        gameData.choosenMatches.forEach((match) => {
            ids.push(match.getAttribute('id'));
        });

        setFinalChoice(ids);
        emitNbMatch(gameData.choosenMatches.length);
        emitUpdateTurn();
    };
    const handleClickMatch = (e, ref, isActive) => {
        if (!handleSelectedMatches(e)) return;
        if (gameData.socket.id !== gameData.currentPlayer.id) return;
        emitSelectedMatch(ref, isActive);
    };
    const setMessageTurn = () => {
        if (gameData.nbMatch === gameData.n) { // the one who take the last match wins
            if (gameData.currentPlayer.id !== gameData.socket.id) {
                setMessage(`Bravo ${gameData.pseudo?.toUpperCase()}, vous avez gagné !`);
            } else {
                setMessage(`${gameData.pseudo?.toUpperCase()}, vous avez perdu !`);
            }
        } else if (gameData.currentPlayer) {
            if (gameData.currentPlayer.id !== gameData.socket.id) {
                setMessage('C\'est au tour de votre adversaire de jouer.');
            } else {
                setMessage('A vous de jouer. Pensez à valider.');
            }
        }
    };
    return {
        handleSelectedMatches,
        handleValid,
        setMessageTurn,
        handleClickMatch,
    };
}

export default useGame;
