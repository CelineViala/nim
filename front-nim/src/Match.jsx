/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    React, useEffect, useState, useContext, useRef,
} from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import style from './Match.module.css';
import { DataGameContext } from './contexts/DataGame';
import matchPicture from './match.png';
import useSocket from './hooks/useSocket';

function Match({ onClicKMatch, id }) {
    const {
        gameData,
    } = useContext(DataGameContext);

    const {
        listenDeco,
        emitSelectedMatch,
        listenSelectedMatch,
        listenUndisplayMatch,
        emitIdToUndisplayMatch,
    } = useSocket(gameData.socket);

    const textRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [mustDisappear, setMustDisappear] = useState(false);

    const handleClick = (e) => {
        if (!onClicKMatch(e)) return;
        if (gameData.socket.id !== gameData.currentPlayer.id) return;
        emitSelectedMatch(textRef, !isActive);
    };

    useEffect(() => {
        listenDeco(setMustDisappear, setIsActive);
        listenSelectedMatch(textRef, setIsActive);
        listenUndisplayMatch(textRef, setMustDisappear);
        emitIdToUndisplayMatch(textRef);
    }, [gameData.socket, isActive, gameData.finalChoice]);
    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img id={id} ref={textRef} className={`${style.match} ${isActive ? `${style['match-select']}` : ''} ${mustDisappear ? `${style.hidden}` : ''}`} src={matchPicture} alt="allumette" onClick={handleClick} />

    );
}
Match.propTypes = {
    id: PropTypes.string.isRequired,
    onClicKMatch: PropTypes.func.isRequired,

};
export default Match;
