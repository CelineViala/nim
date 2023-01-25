
const http = require('http');
require('dotenv').config();
const port = process.env.PORT ?? 3000;
const server = http.createServer();
server.on('request', (request, response) => {
    return response.end('ok'); 
})


const{Server}=require('socket.io');


server.listen(port, () => {
    console.log(`Listening on ${port}`);
});

const io=new Server(server, {
    cors:{
        origin :process.env.CORS_DOMAIN,
        methods: ["GET", "POST"],
    }
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
        
        let adv;
        if(free.length)
        {    
            adv= free.pop(0)
            advs[socket.id]=adv.id;
            advs[adv.id]=socket.id;
            io.to(socket.id).to(adv.id).emit("info_game",{ 
                players:[{pseudo:data.pseudo, id:socket.id},adv],
                index:getRandomInt(2)
            })
            io.to(socket.id).emit("play",{
                adv:adv
            });
            io.to(adv.id).emit("play",{
                adv:{pseudo:data.pseudo, id:socket.id}
            });
        }
        else
        {    
            free.push({pseudo:data.pseudo, id:socket.id});
            io.to(socket.id).emit("wait",{msg:`En attente, le jeu commencera dès l'arrivée d'un second joueur.`});
        }

    })
    socket.on("stop",(data)=>{
        delete advs[data.adv.id]
        delete advs[socket.id]
        io.to(data.adv.id).emit("stopGame",{msg:'Partie arrêtée par votre adversaire. Pour rejouer, veuillez entrer un pseudo puis cliquez sur Jouer'});
        io.to(data.adv.id).to(socket.id).emit("stopGameMatch");
        io.to(socket.id).emit("stopGame",{msg:'Vous avez arreté la partie. Pour rejouer, veuillez entrer un pseudo puis cliquez sur Jouer'});
    })
    socket.on("restart",(data)=>{
        delete advs[data.adv.id]
        delete advs[socket.id]
        io.to(data.adv.id).to(socket.id).emit("restartGame",{msg:'Pour rejouer, veuillez entrer un pseudo puis cliquez sur Jouer'});
        io.to(data.adv.id).to(socket.id).emit("restartGameMatch");
        
    })
    socket.on("nbMatch",(data)=>{
        io.to(data.adv.id).to(socket.id).emit("updateNbMatch",{nb:data.nb})
    })
    socket.on('reset_info_turn',(data)=>{
        io.to(data.adv.id).to(socket.id).emit("info_turn",{index:Number(data.index)})
    })
    socket.on('selectedMatch',(data)=>{
        io.to(socket.id).to(data.adv?.id).emit("actived",data)
    })
    socket.on('idToUndisplay',(data)=>{
        
        io.to(data.adv?.id).to(socket.id).emit("undisplay",data.id)
    })
    
    socket.on("disconnect",()=>{
        io.to(advs[socket.id]).emit("stopGame",{msg:'Partie arrêtée par votre adversaire'});
        io.to(advs[advs[socket.id]]).emit("stopGame",{msg:'Vous avez arreté la partie'});
        io.to(advs[socket.id]).to(advs[advs[socket.id]]).emit("stopGameMatch");
        delete advs[advs[socket.id]]
        delete advs[socket.id]
        free=free.filter(item=>item.id!==socket.id)
    })
})