// Import packages
const express = require("express");
const socketIO = require("socket.io");
const path = require("path");

// Configuration
const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

// Start server
const server = express()
  .use((req, res) => res.sendFile(INDEX) )
 .listen(PORT, () => console.log("Listening on localhost:" + PORT));

// Initiatlize SocketIO
const io = socketIO(server);

var numClients = {};
var clients = ["Host","-","-","-","-","-"];

// Register "connection" events to the WebSocket
io.on("connection", function(socket) {
  // Register "join" events, requested by a connected client
  socket.on("join", function (room) {
    // join channel provided by client
    socket.join(room)
	  
	socket.room = room; 
	  
	if (numClients[room] == undefined) {
        numClients[room] = 1;
    } else {
        numClients[room]++;
    } 
	
	socket.emit("updateplayers", numClients[room]);
	socket.broadcast.to(room).emit("updateplayers", numClients[room]);
	  
	socket.on("writemessage", function(msg) {
      socket.broadcast.to(room).emit("writemessage", msg);
    });
	  
	socket.on("gounactive", function(msg) {
	  //socket.broadcast.to(room).emit("writemessage", msg+" went unactive");
    });
	  
	socket.on("goactive", function(msg) {
	  //socket.broadcast.to(room).emit("writemessage", msg+" went active");
    });
	  
  })
});