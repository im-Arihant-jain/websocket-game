import {createServer} from 'http';
import {Server} from 'socket.io';
import express from 'express';
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});
const allusers = [];
io.on("connection",(socket)=>{   
    allusers.push({socket:socket,online:true,name:null});
    socket.on("request_to_join",(name)=>{ 
      for(let i = 0; i<allusers.length;i++){
        if(allusers[i].socket === socket){
            allusers[i].name = name;
        }
    } 
    let oppname = null;
    let oppsocket;
    for(let i = 0; i<allusers.length;i++){
        if(allusers[i].name !== name && allusers[i].online){
            oppsocket = allusers[i].socket;
            oppname = allusers[i].name;
            break;
        }  
    }
    if(oppname !== null){
        socket.emit("start_game",oppname);
        oppsocket.emit("start_game",name);  
        oppsocket.on("play_move",(data)=>{
            socket.emit("play_move",data);
        });    
        socket.on("play_move",(data)=>{
            oppsocket.emit("play_move",data);
        });                                 
    }else{          
      socket.emit("wait_for_opponent");
    }
    
    });
                            
    socket.on("disconnect",()=>{      
        for(let i = 0; i<allusers.length;i++){
            if(allusers[i].socket === socket){
                allusers[i].online = false;
            }
        }
    });
});
httpServer.listen(3000);
