const express = require('express');
const http = require('http');
const app = express();
const cors=require('cors');


require('dotenv').config();

const port = process.env.PORT ?? 3000;

const server = http.createServer(app);
app.use(express.static('./public'));
const{Server}=require('socket.io');
app.use(cors());

/**
 * @type {Socket}
 */
const io=new Server(server, {
    cors:{
        origin :'*',
        methods: ["GET", "POST"],
      
    }
});
app.get('/',(req,res)=> res.send('ok'));

server.listen(port, () => {
    console.log(`Listening on ${port}`);
});

const advs={

}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

let free=[]; 
io.on('connection',(socket)=>{
    console.log("connection",socket.id, free);
    io.to(socket.id).emit("id",{
        id:socket.id
    });
    
    
    socket.on('play',(data)=>{
        console.log(socket.id," veut jouer")
        let adv;
        if(free.length)
        {    
            console.log("nfsdknf",free)
            adv= free.pop(0)
            console.log("nfsdknf",free)
            advs[socket.id]=adv.id;
            advs[adv.id]=socket.id;
            
            io.to(socket.id).to(adv.id).emit("info_turn",{ 
                players:[{pseudo:data.pseudo, id:socket.id},adv],
                index:getRandomInt(2)
            })
            io.to(socket.id).emit("wait",{
                msg:"Vous jouez contre "+adv.pseudo,
                adv:adv

            });
            io.to(adv.id).emit("wait",{
                msg:"Vous jouez contre "+data.pseudo,
                adv:{pseudo:data.pseudo, id:socket.id}
            });

        }
        else
        {    
            free.push({pseudo:data.pseudo, id:socket.id});
            console.log("wait", free)
            io.to(socket.id).emit("wait",{msg:`En attente, le jeu commencera dès l'arrivée d'un second joueur.
            Pour inviter une de vos connaissances, envoyez-lui le lien suivant : http:www.test.fr`});
            
        
        }

    })
    socket.on('reset_info_turn',(data)=>{
        io.to(data.adv.id).to(socket.id).emit("info_turn",{players:data.players,index:data.index})
    })
    socket.on('selectedMatch',(data)=>{
        console.log("Allumette sélectionnée",data)
        socket.to(data.adv.id).emit("actived",data)
    })
    socket.on('idToUndisplay',(data)=>{
        
        socket.to(data.adv.id).emit("undisplay",data.id)
    })
    socket.on("disconnect",()=>{
        
        console.log("prevenir adv",advs[socket.id])
        socket.to(advs[socket.id]).emit("deco_adv",{msg:'Désolé votre adversaire a quitté la partie.'})
        delete advs[advs[socket.id]]
        delete advs[socket.id]
        free=free.filter(item=>item.id!==socket.id)
    })
})