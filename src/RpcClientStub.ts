import type { IBlock } from "kaspa-wasm32-sdk";

// Define a fixed difficulty constant
const FIXED_DIFFICULTY = "0000000ffffffffffffffffffffffffffffffffffffffffffffffffffff"; // Example difficulty

export class RpcClientStub {
  constructor() {
    console.log("[RpcClientStub] Initialized RpcClientStub instance.");
  }

  /**
   * Simulates connecting to the RPC server.
   */
  async connect(): Promise<void> {
    console.log("[RpcClientStub] Attempting to connect to RPC server...");
    // Simulate some connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("[RpcClientStub] Successfully connected to RPC server (stub).");
    return;
  }

  /**
   * Retrieves server information.
   */
  async getServerInfo(): Promise<{
    isSynced: boolean;
    hasUtxoIndex: boolean;
    networkId: string;
  }> {
    console.log("[RpcClientStub] Fetching server info...");
    const serverInfo = {
      isSynced: true,
      hasUtxoIndex: true,
      networkId: "testnet-11",
    };
    console.log(`[RpcClientStub] Server Info: ${JSON.stringify(serverInfo)}`);
    return serverInfo;
  }

  /**
   * Adds an event listener for specific events.
   * Currently handles 'newBlockTemplate' event.
   */
  addEventListener(
    eventName: string,
    listener: (...args: any[]) => void
  ): void {
    console.log(`[RpcClientStub] Adding event listener for event: ${eventName}`);

    if (eventName === "newBlockTemplate") {
      console.log("[RpcClientStub] Setting up interval to emit 'newBlockTemplate' events every 30 seconds.");

      // Simulate a new block template every 30 seconds
      setInterval(() => {
        const newBlockTemplate = {
          block: {
            header: {
              hash: `stubbedHash_${Date.now()}`,
              nonce: BigInt(0),
              timestamp: BigInt(Date.now()),
              difficulty: FIXED_DIFFICULTY,
              // Add other required fields here
            },
            // Add other required fields here
          },
        };

        console.log(`[RpcClientStub] Emitting 'newBlockTemplate' event with block hash: ${newBlockTemplate.block.header.hash}`);
        listener(newBlockTemplate);
      }, 30000); // 30,000 milliseconds = 30 seconds
    } else {
      console.warn(`[RpcClientStub] Event '${eventName}' is not handled by the stub.`);
    }
  }

  /**
   * Retrieves a block template with a fixed difficulty.
   */
  async getBlockTemplate(_args: {
    payAddress: string;
    extraData: string;
  }): Promise<{ block: IBlock }> {
    console.log("[RpcClientStub] Request received for block template.");

    const blockTemplate = {
      block: {
        header: {
          hash: "stubbedHash",
          nonce: BigInt(0),
          timestamp: BigInt(Date.now()),
          difficulty: FIXED_DIFFICULTY, // Set fixed difficulty
          // Add other required fields here
        },
        // Add other required fields here
      },
    };

    console.log(`[RpcClientStub] Returning block template with hash: ${blockTemplate.block.header.hash} and fixed difficulty: ${blockTemplate.block.header.difficulty}`);
    return blockTemplate;
  }

  /**
   * Submits a mined block.
   */
  async submitBlock(_args: {
    block: IBlock;
    allowNonDAABlocks: boolean;
  }): Promise<any> {
    console.log("[RpcClientStub] Received request to submit a block.");
    console.log(`[RpcClientStub] Block Hash: ${_args.block.header.hash}`);
    console.log(`[RpcClientStub] Allow Non-DAA Blocks: ${_args.allowNonDAABlocks}`);

    // Simulate block submission delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    console.log("[RpcClientStub] Block submitted successfully (stub).");

    // Return a dummy "report" or success indicator
    const submissionResult = { submitted: true };
    console.log(`[RpcClientStub] Submission Result: ${JSON.stringify(submissionResult)}`);
    return submissionResult;
  }

  /**
   * Subscribes to new block templates.
   * Currently a no-op as event listeners are handled via addEventListener.
   */
  async subscribeNewBlockTemplate(): Promise<void> {
    console.log("[RpcClientStub] subscribeNewBlockTemplate called (no-op).");
    // No-op or implement if needed
  }
}
