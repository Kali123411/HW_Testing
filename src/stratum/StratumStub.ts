export default class StratumStub {
  server: { socket: { port: number } }; // Add this property

  constructor(port: number) {
    this.server = {
      socket: {
        port, // Initialize the port when creating the stub
      },
    };
    console.log(`StratumStub initialized on port ${port}`);
  }

  start() {
    console.log(`StratumStub listening on port ${this.server.socket.port}`);
  }

  on(event: string, handler: Function) {
    console.log(`Handler registered for event: ${event}`);
  }
}
