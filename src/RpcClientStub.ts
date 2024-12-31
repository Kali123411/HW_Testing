import type { IBlock } from "kaspa-wasm32-sdk";
import { v4 as uuidv4 } from 'uuid'; // Ensure uuid is installed via npm

interface IJob {
  jobId: string;
  block: IBlock;
  difficulty: string;
}

const FIXED_DIFFICULTY = "0000000ffffffffffffffffffffffffffffffffffffffffffffffffffff"; // Example difficulty

export class RpcClientStub {
  private activeJobs: Map<string, IJob> = new Map();

  constructor() {
    console.log("[RpcClientStub] Initialized RpcClientStub instance.");
  }

  /**
   * Simulates connecting to the RPC server and assigns an initial job.
   */
  async connect(): Promise<void> {
    console.log("[RpcClientStub] Attempting to connect to RPC server...");
    // Simulate some connection delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("[RpcClientStub] Successfully connected to RPC server (stub).");

    // Assign an initial job upon connection
    const initialJob = await this.getBlockTemplate({
      payAddress: "stubPayAddress",
      extraData: "stubExtraData",
    });

    console.log(`[RpcClientStub] Assigned Initial Job ID: ${initialJob.job.jobId}`);
    // Here you might emit an event or notify the ASIC to start mining with this job
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
      setInterval(async () => {
        const jobResponse = await this.getBlockTemplate({
          payAddress: "stubPayAddress",
          extraData: "stubExtraData",
        });

        console.log(`[RpcClientStub] Emitting 'newBlockTemplate' event with Job ID: ${jobResponse.job.jobId}`);
        listener(jobResponse.job);
      }, 30000); // 30,000 milliseconds = 30 seconds
    } else {
      console.warn(`[RpcClientStub] Event '${eventName}' is not handled by the stub.`);
    }
  }

  /**
   * Retrieves a block template with a fixed difficulty and assigns a unique job ID.
   */
  async getBlockTemplate(_args: {
    payAddress: string;
    extraData: string;
  }): Promise<{ job: IJob }> {
    console.log("[RpcClientStub] Request received for block template.");

    const jobId = uuidv4(); // Generate a unique job ID
    const blockTemplate: IBlock = {
      header: {
        hash: `stubbedHash_${Date.now()}`,
        nonce: BigInt(0),
        timestamp: BigInt(Date.now()),
        difficulty: FIXED_DIFFICULTY, // Set fixed difficulty
        // Add other required fields here based on IBlock definition
      },
      // Add other required fields here based on IBlock definition
    };

    const job: IJob = {
      jobId,
      block: blockTemplate,
      difficulty: FIXED_DIFFICULTY,
    };

    this.activeJobs.set(jobId, job); // Store the job

    console.log(`[RpcClientStub] Assigned Job ID: ${jobId} with block hash: ${blockTemplate.header.hash}`);
    return { job };
  }

  /**
   * Handles share submissions from the ASIC miner.
   */
  async submitShare(_args: {
    jobId: string;
    nonce: bigint;
    hash: string;
  }): Promise<{ accepted: boolean; reason?: string }> {
    console.log("[RpcClientStub] Received share submission.");
    console.log(`Job ID: ${_args.jobId}`);
    console.log(`Nonce: ${_args.nonce}`);
    console.log(`Hash: ${_args.hash}`);

    const job = this.activeJobs.get(_args.jobId);

    if (!job) {
      console.warn(`[RpcClientStub] Invalid Job ID: ${_args.jobId}`);
      return { accepted: false, reason: "Invalid Job ID" };
    }

    // Simulate hash validation (always accept for stub)
    // In a real scenario, you'd validate the hash against the difficulty target
    console.log("[RpcClientStub] Share accepted (stub).");

    // Optionally, remove the job if it's completed
    // this.activeJobs.delete(_args.jobId);

    return { accepted: true };
  }

  /**
   * Handles block submissions from the ASIC miner.
   */
  async submitBlock(_args: {
    block: IBlock;
    allowNonDAABlocks: boolean;
  }): Promise<any> {
    console.log("[RpcClientStub] Received block submission.");
    console.log(`[RpcClientStub] Block Hash: ${_args.block.header.hash}`);
    console.log(`[RpcClientStub] Allow Non-DAA Blocks: ${_args.allowNonDAABlocks}`);

    // Simulate block validation (always accept for stub)
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
