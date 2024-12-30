import net from "net";

export default class StratumStub {
  server: net.Server;
  port: number;
  private miners: Map<string, net.Socket>; // Map to store connected miners
  private handlers: Map<string, Function>; // Event handlers for subscriptions, shares, etc.

  constructor(port: number) {
    this.port = port;
    this.miners = new Map();
    this.handlers = new Map();
    this.server = net.createServer((socket) => this.handleConnection(socket));
    console.log(`StratumStub initialized on port ${port}`);
  }

  start() {
    this.server.listen(this.port, () => {
      console.log(`StratumStub listening on port ${this.port}`);
    });
  }

  on(event: string, handler: Function) {
    this.handlers.set(event, handler);
    console.log(`Handler registered for event: ${event}`);
  }

  private handleConnection(socket: net.Socket) {
    const minerId = `${socket.remoteAddress}:${socket.remotePort}`;
    console.log(`Miner connected: ${minerId}`);

    this.miners.set(minerId, socket);

    // Trigger subscription event
    const subscriptionHandler = this.handlers.get("subscription");
    if (subscriptionHandler) {
      subscriptionHandler(minerId, "ASIC Miner");
    }

    // Handle incoming data
    socket.on("data", (data) => this.handleMinerMessage(minerId, data));

    // Handle disconnection
    socket.on("close", () => {
      console.log(`Miner disconnected: ${minerId}`);
      this.miners.delete(minerId);
    });

    socket.on("error", (err) => {
      console.error(`Error with miner ${minerId}:`, err.message);
      this.miners.delete(minerId);
    });
  }

  private handleMinerMessage(minerId: string, data: Buffer) {
    console.log(`Message from miner ${minerId}:`, data.toString());
    // Parse the Stratum JSON-RPC message here
    try {
      const message = JSON.parse(data.toString());

      if (message.method === "mining.subscribe") {
        console.log(`Miner ${minerId} subscribed`);
        this.sendResponse(minerId, {
          id: message.id,
          result: [[["mining.set_difficulty", "1"], ["mining.notify", "1"]], "123"],
          error: null,
        });
      } else if (message.method === "mining.authorize") {
        console.log(`Miner ${minerId} authorized`);
        this.sendResponse(minerId, {
          id: message.id,
          result: true,
          error: null,
        });
      } else if (message.method === "mining.submit") {
        console.log(`Miner ${minerId} submitted a share:`, message.params);
        this.sendResponse(minerId, {
          id: message.id,
          result: true,
          error: null,
        });
      } else {
        console.log(`Unknown message from miner ${minerId}:`, message);
      }
    } catch (err) {
      console.error(`Failed to parse message from miner ${minerId}:`, err.message);
    }
  }

  private sendResponse(minerId: string, response: any) {
    const socket = this.miners.get(minerId);
    if (socket) {
      const responseString = JSON.stringify(response) + "\n";
      socket.write(responseString);
      console.log(`Sent response to miner ${minerId}:`, responseString);
    }
  }

  sendJob(minerId: string, jobData: any) {
    const socket = this.miners.get(minerId);
    if (socket) {
      const jobMessage = {
        id: null,
        method: "mining.notify",
        params: jobData,
      };
      const jobString = JSON.stringify(jobMessage) + "\n";
      socket.write(jobString);
      console.log(`Sent job to miner ${minerId}:`, jobString);
    }
  }
}
