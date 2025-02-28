# RecoWebSocket

WebSocket with automatic reconnection. Just a wrapper around `ws` Client with a bunch of new options.

## Installation

```bash
npm install recowebsocket
```

## Usage

Everything is the same as in `ws` Client, but with `reconnect`, `reconnectInterval`, `reconnectMaxAttempts` options. All events you attached will be automatically attached to the underlying `ws` Client, even on reconnect. Set `reconnectMaxAttempts` to `-1` to reconnect indefinitely.

```js
import WebSocket from "recowebsocket";

const ws = new WebSocket("wss://echo.websocket.org", {
  // these are the default values
  reconnect: true,
  reconnectInterval: 1000,
  reconnectMaxAttempts: -1,
});

ws.on("open", () => {
  console.log("Connected to the server");
  ws.send("Hello, server!");
});
```

Calling `ws.close()` or `ws.terminate()` will close the underlying `ws` Client and stop reconnecting.

There's also additional nice method `ws.json(data, options)`, which will stringify data and send it as a JSON.

## Caveats

- Not all event emitter methods are supported. Only `on`, `once` and `off` are supported. `once` will be called once on each reconnect. So it's not actually once I guess.
- Some obscure ws client stuff might not work.

## License

MIT
