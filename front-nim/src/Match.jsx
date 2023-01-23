/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    React, useEffect, useState, useContext, useRef,
} from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import style from './Match.module.css';
import { DataGameContext } from './contexts/DataGame';

import useSocket from './hooks/useSocket';
import useGame from './hooks/useGame';

function Match({ id }) {
    const {
        gameData,
    } = useContext(DataGameContext);

    const {
        listenDecoMatch,
        listenSelectedMatch,
        listenUndisplayMatch,
        listenStopGameMatch,
        emitIdToUndisplayMatch,
    } = useSocket(gameData.socket);

    const { handleClickMatch } = useGame();

    const textRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [mustDisappear, setMustDisappear] = useState(false);

    useEffect(() => {
        listenDecoMatch(setMustDisappear, setIsActive);
        listenStopGameMatch(setMustDisappear, setIsActive);
        listenSelectedMatch(textRef, setIsActive);
        listenUndisplayMatch(textRef, setMustDisappear);
        emitIdToUndisplayMatch(textRef);
    }, [gameData.socket, isActive, gameData.finalChoice]);
    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div id={id} ref={textRef} className={` ${isActive ? `${style['match-select']}` : ''} ${mustDisappear ? `${style.start}` : `${style.match}`}`} onClick={(e) => handleClickMatch(e, textRef, !isActive)} />

    );
}
Match.propTypes = {
    id: PropTypes.string.isRequired,

};
export default Match;
