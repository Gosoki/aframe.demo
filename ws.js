const express = require('express');
const app = express();
const https = require('https');
const fs = require('fs');
const path = require('path');
const { disconnect } = require('process');
const options = {
    key: fs.readFileSync('ssl/privkey.pem'),
    cert: fs.readFileSync('ssl/fullchain.pem')
};
const server = https.createServer(options, app).listen(3001, () =>
    console.log('HTTPS listening on 3001...')
);

// 静的ファイルのルーティング
app.use(express.static(
    path.join(__dirname, 'public')
    )
);


const io = require('socket.io')(server);
io.sockets.on('connection',(socket) =>{
    console.log("id:["+socket.id+"]login!");
    socket.on("seed_my_info_to_server",(msg) =>{
        let user_id = socket.id;
        let user_color = msg[0];
        let user_position = msg[1];
        console.log(msg[0]);
        socket.broadcast.emit('broadcast_user_info',[user_id,user_color,user_position]);
    });
    socket.on("disconnect",() =>{
        console.log("id:["+socket.id+"]logout!")
        socket.broadcast.emit("del_logout_ball",socket.id)
    })
});