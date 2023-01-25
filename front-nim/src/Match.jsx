/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    React, useEffect, useState, useContext, useRef,
} from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import style from './css/Match.module.css';
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

    const matchRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [mustDisappear, setMustDisappear] = useState(false);

    useEffect(() => {
        listenDecoMatch(setMustDisappear, setIsActive);
        listenStopGameMatch(setMustDisappear, setIsActive);
        listenSelectedMatch(matchRef, setIsActive);
        listenUndisplayMatch(matchRef, setMustDisappear);
        emitIdToUndisplayMatch(matchRef);
        return () => {
            gameData.socket.off('undisplay');
            gameData.socket.off('stopGameMatch');
            gameData.socket.off('actived');
        };
    }, [gameData.finalChoice]);
    return (
        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
        <div id={id} ref={matchRef} className={` ${isActive ? `${style['match-select']}` : ''} ${mustDisappear ? `${style.start}` : `${style.match}`}`} onClick={(e) => handleClickMatch(e, matchRef, !isActive)} />

    );
}
Match.propTypes = {
    id: PropTypes.string.isRequired,

};
export default Match;
