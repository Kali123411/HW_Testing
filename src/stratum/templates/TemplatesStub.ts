// src/stratum/templates/TemplatesStub.ts

import { IBlock } from "kaspa-wasm";
import { Header, PoW } from "kaspa-wasm";
import Jobs from "./jobs";

/**
 * Stub version of Templates that doesn't call a real RpcClient
 * but still exposes the same public methods.
 */
export default class TemplatesStub {
  private address: string;
  private cacheSize: number;

  private templates: Map<string, [IBlock, PoW]> = new Map();
  private jobs: Jobs = new Jobs();

  constructor(address: string, cacheSize: number) {
    this.address = address;
    this.cacheSize = cacheSize;
  }

  getHash(id: string) {
    return this.jobs.getHash(id);
  }

  getPoW(hash: string) {
    return this.templates.get(hash)?.[1];
  }

  async submit(hash: string, nonce: bigint) {
    console.log(`[TemplatesStub] Pretending to submit block with hash=${hash}, nonce=${nonce}`);
    this.templates.delete(hash);
    // Return a dummy response or nothing
    return { submitted: true };
  }

  async register(
    callback: (id: string, hash: string, timestamp: bigint) => void
  ) {
    console.log("[TemplatesStub] register called, simulating a new block template after 3s");
    
    // (Optional) simulate a new block template arriving after 3 seconds:
    setTimeout(() => {
      const block = {
        header: {
          hash: "stubbedHash",
          nonce: BigInt(0),
          timestamp: BigInt(Date.now()),
        },
      } as unknown as IBlock;

      const pow = new PoW(block.header);
      this.templates.set(block.header.hash, [block, pow]);

      const id = this.jobs.deriveId(block.header.hash);
      callback(id, pow.prePoWHash, block.header.timestamp);
    }, 3000);
  }
}
