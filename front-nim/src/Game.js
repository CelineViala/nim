
import style from './Game.module.css';
import Match from './Match';
import {useEffect,useState,createRef,useContext} from "react"
import matchPicture from './match.png'
import {DataGameContext} from './contexts/DataGame';

function Game(props,ref) {
    const { gameData,setPlayers,setCurrentPlayer,setChoosenMatches,setIndexPlayer } = useContext(DataGameContext);
    console.log(gameData)
    // const [choosenMatches,setChoosenMatches]=useState([]);
    //const [players,setPlayers]=useState([]);
    //const [indexPlayer,setIndexPlayer]=useState(0);
    // const [currentPlayer,setCurrentPlayer]=useState(null);
    const [message,setMessage]=useState('');
    const [finalChoice,setFinalChoice]=useState([])
    const refs=[]
    const getRef= ()=> {
        const ref=createRef(null);
        refs.push(ref)
        return ref;
    };
       
    const handleClickMatch=(e)=>{
        
        let copy=[...gameData.choosenMatches]
        
        if(!copy.find(element=> element===e.target))
        {    
            if(gameData.currentPlayer.id!==props.socket.id) return
            if (copy.length===3){ 
                alert("stop");
                return false;
            }
            copy.push(e.target)
                
        }
        else 
        {    
            copy=copy.filter((item)=> item !==e.target)   
        }
        setChoosenMatches(copy);
        return true; 
    
    }
    const handleValid=(e)=>{
        const ids=[...finalChoice]
        
        gameData.choosenMatches.forEach(match=>{
            ids.push(match.getAttribute("id"))
           
        })
        setFinalChoice(ids);
        console.log(ids)
        setCurrentPlayer(gameData.players[Number(!gameData.indexPlayer)]);
        setIndexPlayer(Number(!gameData.indexPlayer));
        setChoosenMatches([]);
        props.socket.emit("reset_info_turn",{
            players:gameData.players,
            adv:props.adv,
            index:Number(!gameData.indexPlayer)
        })
        

    }
    useEffect(()=>{
        props.socket.on("deco_adv",(data)=>{
            setChoosenMatches([])
            setFinalChoice([])
        })
        props.socket.on("info_turn",(data)=>{
            setPlayers(data.players);
            
            setIndexPlayer(Number(data.index));
            setCurrentPlayer(data.players[Number(data.index)]);
            
        })
        if(gameData.currentPlayer)
        {
                console.log(gameData.currentPlayer,props.adv)
                if(gameData.currentPlayer.id!==props.socket.id) 
                    setMessage(`C'est au tour de votre adversaire, ${gameData.currentPlayer.pseudo}, de jouer`)
            
            else{
                setMessage(`A vous de jouer !`)
            }
 
        }
    },[props.socket, gameData.currentPlayer])
  return (
    
    <div className={`${style.game} ${props.isHidden?`${style.hidden}`:''}`} >
        <div className={style['matches-box']}>
            {Array.from(Array(10).keys(),(x)=>{
             return <Match  id={`${x}`}socket={props.socket} key={x} onClicKMatch={handleClickMatch} adv={props.adv} currentPlayer={gameData.currentPlayer} choosen={finalChoice} ></Match>
            })}
            
        </div>
        <button  onClick={handleValid}>VALIDER</button>
        <p>{message}</p>
    </div>
      
    
  );
}

export default Game;
