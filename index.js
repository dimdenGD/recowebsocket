import WebSocket from "ws";
import { EventEmitter } from "events";

export default class WebSocketClient extends EventEmitter {
	static CONNECTING = 0;
	static OPEN = 1;
	static CLOSING = 2;
	static CLOSED = 3;

	constructor(url, options) {
		super();
		this.events = {};
		this.eventsOnce = {};
		this.reconnect = true;
		this.reconnectInterval = options.reconnectInterval || 1000;
		this.reconnectMaxAttempts = options.reconnectMaxAttempts || -1;
		this.reconnectAttempts = 0;
		this.url = url;
		this.options = options;
		this.connect();
	}

	send(data, options) {
		this.ws.send(data, options);
	}

	json(data, options) {
		this.ws.send(JSON.stringify(data), options);
	}

	on(event, callback) {
		if (!this.events[event]) {
			this.events[event] = [];
		}
		this.events[event].push(callback);
		this.ws.on(event, callback);
	}

	once(event, callback) {
		if (!this.eventsOnce[event]) {
			this.eventsOnce[event] = [];
		}
		this.eventsOnce[event].push(callback);
		this.ws.once(event, callback);
	}

	off(event, callback) {
		this.events[event] = this.events[event].filter((cb) => cb.toString() !== callback.toString());
		this.eventsOnce[event] = this.eventsOnce[event].filter((cb) => cb.toString() !== callback.toString());
		this.ws.off(event, callback);
	}

	emit(event, ...args) {
		this.ws.emit(event, ...args);
	}

	connect() {
		this.ws = new WebSocket(this.url, this.options);
		if (this._binaryType) {
			this.ws.binaryType = this._binaryType;
		}
		for (const event in this.events) {
			for (const callback of this.events[event]) {
				this.ws.on(event, callback);
			}
		}
		for (const event in this.eventsOnce) {
			for (const callback of this.eventsOnce[event]) {
				this.ws.once(event, callback);
			}
		}

		this.ws.on("open", () => {
			this.emit("open");
		});
		this.ws.on("message", (message) => {
			this.emit("message", message);
		});
		this.ws.on("error", (error) => {
			this.emit("error", error);
		});
		this.ws.on("close", (code, reason) => {
			this.emit("close", code, reason);
			if (this.reconnect && (this.reconnectAttempts === -1 || ++this.reconnectAttempts < this.reconnectMaxAttempts)) {
				setTimeout(() => this.connect(), this.reconnectInterval);
			}
		});
		this.ws.on("ping", () => {
			this.emit("ping");
		});
		this.ws.on("pong", () => {
			this.emit("pong");
		});
		this.ws.on("redirect", (url) => {
			this.emit("redirect", url);
		});
		this.ws.on("upgrade", (response) => {
			this.emit("upgrade", response);
		});
	}

	close() {
		this.reconnect = false;
		this.ws.close();
	}

	terminate() {
		this.reconnect = false;
		this.ws.terminate();
	}

	ping(...args) {
		this.ws.ping(...args);
	}

	pong(...args) {
		this.ws.pong(...args);
	}

	get readyState() {
		return this.ws.readyState;
	}

	get binaryType() {
		return this.ws.binaryType;
	}

	set binaryType(binaryType) {
		this._binaryType = binaryType;
		this.ws.binaryType = binaryType;
	}

	get bufferedAmount() {
		return this.ws.bufferedAmount;
	}
}
