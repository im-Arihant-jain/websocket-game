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