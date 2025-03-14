const ws = new WebSocket("ws://34.173.175.205:3000");

ws.onopen = () => {
  console.log("Conectado al servidor WebSocket");
  ws.send("Hola servidor desde el cliente!");
};

ws.onmessage = (event) => {
  console.log("Mensaje recibido del servidor:", event.data);
};

ws.onclose = () => console.log("Conexión cerrada");
