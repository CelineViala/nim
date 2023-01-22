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
import useGame from './hooks/useGame';

function Match({ id }) {
    const {
        gameData,
    } = useContext(DataGameContext);

    const {
        listenDeco,
        listenSelectedMatch,
        listenUndisplayMatch,
        emitIdToUndisplayMatch,
    } = useSocket(gameData.socket);

    const { handleClickMatch } = useGame();

    const textRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [mustDisappear, setMustDisappear] = useState(false);

    // const handleClick = (e) => {
    //     if (!onClicKMatch(e)) return;
    //     if (gameData.socket.id !== gameData.currentPlayer.id) return;
    //     emitSelectedMatch(textRef, !isActive);
    // };

    useEffect(() => {
        listenDeco(setMustDisappear, setIsActive);
        listenSelectedMatch(textRef, setIsActive);
        listenUndisplayMatch(textRef, setMustDisappear);
        emitIdToUndisplayMatch(textRef);
    }, [gameData.socket, isActive, gameData.finalChoice]);
    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <img id={id} ref={textRef} className={`${style.match} ${isActive ? `${style['match-select']}` : ''} ${mustDisappear ? `${style.hidden}` : ''}`} src={matchPicture} alt="allumette" onClick={(e) => handleClickMatch(e, textRef, !isActive)} />

    );
}
Match.propTypes = {
    id: PropTypes.string.isRequired,

};
export default Match;
