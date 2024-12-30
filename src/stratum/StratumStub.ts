export default class StratumStub {
  server: { socket: { port: number } }; // Simulates the server
  private miners: Map<string, any>; // Track connected miners
  private handlers: Map<string, Function>; // Track event handlers

  constructor(port: number) {
    this.server = {
      socket: {
        port, // Initialize the port
      },
    };
    this.miners = new Map();
    this.handlers = new Map();
    console.log(`StratumStub initialized on port ${port}`);
  }

  start() {
    console.log(`StratumStub listening on port ${this.server.socket.port}`);
  }

  // Store event handlers for later invocation
  on(event: string, handler: Function) {
    this.handlers.set(event, handler);
    console.log(`Handler registered for event: ${event}`);
  }

  // Simulate a miner connection
  connectMiner(minerId: string) {
    console.log(`Miner connected: ${minerId}`);
    this.miners.set(minerId, { status: "connected" });

    // Invoke the subscription handler if registered
    const subscriptionHandler = this.handlers.get("subscription");
    if (subscriptionHandler) {
      subscriptionHandler(minerId, "ASIC Miner");
    }
  }

  // Simulate sending a job to a miner
  sendJob(minerId: string, jobData: any) {
    if (this.miners.has(minerId)) {
      console.log(`Sending job to miner ${minerId}:`, jobData);
    } else {
      console.warn(`Miner ${minerId} is not connected. Job not sent.`);
    }
  }

  // Simulate receiving a share from a miner
  receiveShare(minerId: string, shareData: any) {
    if (this.miners.has(minerId)) {
      console.log(`Received share from miner ${minerId}:`, shareData);

      // Optionally validate the share (stub logic)
      const isValid = Math.random() > 0.1; // 90% chance of being valid
      console.log(`Share validation result for ${minerId}: ${isValid ? "Valid" : "Invalid"}`);
    } else {
      console.warn(`Miner ${minerId} is not connected. Share not accepted.`);
    }
  }

  // Simulate miner disconnection
  disconnectMiner(minerId: string) {
    if (this.miners.has(minerId)) {
      console.log(`Miner disconnected: ${minerId}`);
      this.miners.delete(minerId);
    } else {
      console.warn(`Miner ${minerId} is not connected.`);
    }
  }
}
