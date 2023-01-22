/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
    React, useEffect, useState, useContext, useRef,
} from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import style from './Match.module.css';
import { DataGameContext } from './contexts/DataGame';
import matchPicture from './match.png';

function Match({ onClicKMatch, id }) {
    const {
        gameData,

    } = useContext(DataGameContext);
    const textRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [mustDisappear, setMustDisappear] = useState(false);
    const handleClick = (e) => {
        if (!onClicKMatch(e)) return;
        if (gameData.socket.id !== gameData.currentPlayer.id) return;
        setIsActive(!isActive);
    };

    useEffect(() => {
        gameData.socket.on('deco_adv', () => {
            setMustDisappear(false);
        });
        gameData.socket.on('actived', (data) => {
            if (textRef.current.getAttribute('id') === data.match) setIsActive(data.active);
        });
        gameData.socket.emit('selectedMatch', { match: textRef.current.getAttribute('id'), adv: gameData.adv, active: isActive });
        gameData.socket.on('deco_adv', () => {
            setIsActive(false);
        });
        gameData.socket.on('undisplay', (data) => {
            if (textRef.current.getAttribute('id') === data) { setMustDisappear(true); }
        });
        if (gameData.finalChoice.includes(textRef.current.getAttribute('id'))) {
            gameData.socket.emit('idToUndisplay', { id: textRef.current.getAttribute('id'), adv: gameData.adv });
        }
    //  if(props.choosen.find(textRef.current.getAttribute("id")!==-1)){
    //   console.log("a virer")
    //  }
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
