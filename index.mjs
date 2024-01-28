import cors from "cors";
import express from "express";
import "express-async-errors";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import "./loadEnvironment.mjs";
import Chat from "./models/chat.mjs";
import Chats from "./routes/chats.mjs";
import items from "./routes/items.mjs";
import restaurantReviews from "./routes/restaurantReviews.mjs";
import restaurants from "./routes/restaurants.mjs";
import users from "./routes/users.mjs";
import { instrument } from "@socket.io/admin-ui";
import Notifications from "./routes/notifications.mjs";

const PORT = process.env.PORT || 5050;
const URL = process.env.DB_URL
const app = express();

const corsOptions = {
  origin:["https://admin.socket.io"]
}

app.use(cors());
app.use(express.json());




// Load the /posts routes
app.use("/users", users);
app.use("/restaurants", restaurants);
app.use("/items", items);
app.use("/restaurantReviews", restaurantReviews)
app.use("/chats", Chats)
app.use("/notifications", Notifications);




// Global error handling
app.use((err, _req, res, next) => {
  res.status(500).send("Uh oh! An unexpected error occured.")
})

app.use("/",async(req, res)=>{
  res.send("Server is running")
})

// start the Express server
const server = app.listen(PORT, async() => {
  try{
    await mongoose.connect(URL, { dbName:"foodslice", useNewUrlParser: true })
    console.log(`Server is running on port: ${PORT}`);
  }
  catch(e){
    console.error(e)
    process.exit(1)
  }
});

const io = new Server(server);

const activeConnections = {};




io.on('connection', async (socket) => {
  console.log('A  user connected');

  socket.on('joinChat', ({ senderId }) => {
    console.log("index > joinChat > socketId > ",  activeConnections[senderId]);
    // const roomId = `${restaurantId}-${customerId}`
    if(!activeConnections[senderId])
      activeConnections[senderId] = socket.id
    // socket.join(roomId);
  });

  socket.on('chatMessage', async ({ restaurantId, customerId, sender, content, receiverId, senderId }) => {
    const roomId = `${restaurantId}-${customerId}`;

    console.log(senderId, content)

    io.to(activeConnections[receiverId]).emit('getMessage', {
      senderId: senderId,
      sender,
      content,
      timestamp: new Date(),
    });

    // Save the message to the database
    try {
      await Chat.findOneAndUpdate(
        { restaurant: restaurantId, customer: customerId },
        {
          $push: {
            messages: {
              $each: [
                {
                  sender,
                  content,
                  timestamp: new Date(),
                },
              ],
              $position: 0,
            },
          },
        },
        { upsert: true }
      );
    } catch (error) {
      console.error('Error saving chat message to the database:', error.message);

    }
  });

  socket.on('disconnect', () => {
    const disconnectedSocket = Object.entries(activeConnections).find(([key, value]) => value === socket.id);
    if (disconnectedSocket) {
      const [userId] = disconnectedSocket;
      delete activeConnections[userId];
      console.log(`User ${userId} disconnected`);
    }
  });
});

instrument(io, {
  auth: false,
  mode: "development",
});