// StratumStub.ts
export default class StratumStub {
  private connections: any[] = []; // Keep track of miners

  start(port: number) {
    console.log(`StratumStub listening on port ${port}`);
  }

  on(event: string, handler: Function) {
    if (event === "subscription") {
      console.log("New subscription handler registered.");
      // Capture incoming subscriptions
      this.connections.push(handler);
    }
  }

  sendJob(minerId: string, jobData: any) {
    console.log(`Sending job to miner ${minerId}:`, jobData);
  }

  receiveShare(minerId: string, shareData: any) {
    console.log(`Received share from miner ${minerId}:`, shareData);
    // Optionally simulate success/failure:
    return { valid: true, details: "Stubbed share accepted." };
  }
}
