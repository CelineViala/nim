import {
    React, useEffect, useContext,
} from 'react';
import style from './App.module.css';
import Game from './Game';
import { DataGameContext } from './contexts/DataGame';

function App() {
    const {
        gameData,
        setMessage,
        setAdv,
        setPseudo,
        setWaiting,
        setboardHidden,
    } = useContext(DataGameContext);
    // setSocket(socket);
    // const [message, setMessage]=useState("");
    // const [adv, setAdv]=useState({});
    // const [boardHidden, setboardHidden] = useState(true);
    // const [pseudo, setPseudo] = useState("");
    // const [waiting, setWaiting] = useState(false);

    const handlePlay = () => {
        if (gameData.pseudo === '') {
            setMessage('Veuillez entrez un pseudo');
            return;
        }
        gameData.socket.emit('play', { pseudo: gameData.pseudo });
    };
    useEffect(() => {
        gameData.socket.on('wait', (data) => {
            setWaiting(true);
            setMessage(data.msg);
        });
        gameData.socket.on('play', (data) => {
            if (data.adv) {
                setAdv(data.adv);
                setboardHidden(false);
                setWaiting(false);
            }
        });
        //  gameData.socket.on("id",(data)=>{
        //   setMessage(data.msg);
        //  })
        gameData.socket.on('deco_adv', (data) => {
            setboardHidden(true);
            setAdv({});
            setMessage('Cliquer sur Jouer pour recommencer une partie.');
            alert(data.msg);
        });
    }, [gameData.socket]);
    return (
        <div className="App">
            <h1>Jeu de Nim</h1>

            <Game />
            <div className={`${!gameData.boardHidden && `${style.hidden}`}`}>

                <label>Pseudo : </label>
                <input
                    placeholder="Entre un pseudo"
                    onChange={(event) => {
                        setPseudo(event.target.value);
                    }}
                />
                <p>{gameData.message}</p>
                <button type="button" className={`${(!gameData.boardHidden || gameData.waiting) && `${style.hidden}`}`} onClick={handlePlay}>JOUER</button>
            </div>

        </div>
    );
}

export default App;
