import WebSocket from "./index.js";

const ws = new WebSocket("wss://echo.websocket.org", {
  reconnect: true,
  reconnectInterval: 1000,
  reconnectMaxAttempts: 5,
});

ws.on("open", () => {
  console.log("Connected to the server");
  ws.send("Hello, server!");
});

ws.on("message", (message) => {
  console.log("Received message:", message.toString());
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

setInterval(() => {
  ws.ws.close();
}, 3000);
