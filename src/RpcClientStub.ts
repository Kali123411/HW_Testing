import type { IBlock } from "kaspa-wasm32-sdk";

export class RpcClientStub {
  // Added a no-op async connect() method
  async connect(): Promise<void> {
    // no operation in the stub
    return;
  }

  // Added a getServerInfo() method returning dummy data
  async getServerInfo(): Promise<{
    isSynced: boolean;
    hasUtxoIndex: boolean;
    networkId: string;
  }> {
    return {
      isSynced: true,
      hasUtxoIndex: true,
      networkId: "testnet-11",
    };
  }

  addEventListener(
    eventName: string,
    listener: (...args: any[]) => void
  ): void {
    // You could either do nothing:
    // (no-op)
    // Or simulate calling the listener after some delay to mimic events:
    // setTimeout(() => {
    //   listener(/* dummy args here */);
    // }, 1000);
  }

  async getBlockTemplate(_args: {
    payAddress: string;
    extraData: string;
  }): Promise<{ block: IBlock }> {
    // Return a fake IBlock structure
    return {
      block: {
        header: {
          // Minimal required fields your code references:
          hash: "stubbedHash",
          nonce: BigInt(0),
          timestamp: BigInt(Date.now()),
          // etc.
        },
        // If your code references other fields, add them here
      },
    };
  }

  async submitBlock(_args: {
    block: IBlock;
    allowNonDAABlocks: boolean;
  }): Promise<any> {
    // Return a dummy "report" or success indicator
    return { submitted: true };
  }

  async subscribeNewBlockTemplate(): Promise<void> {
    // No-op
  }
}
