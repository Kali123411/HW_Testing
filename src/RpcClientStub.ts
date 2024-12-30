// RpcClientStub.ts

export class RpcClientStub {
  // Instead of actually connecting anywhere,
  // this just returns immediately.
  async connect() {
    // no-op
    return;
  }

  // Return fake server info so the code doesn’t crash.
  async getServerInfo() {
    return {
      isSynced: true,
      hasUtxoIndex: true,
      networkId: "testnet-11",
    };
  }

  // If there are other methods the real RpcClient calls,
  // just stub them out as well, e.g.:
  async getBlockTemplate() {
    // Return some dummy data
    return {};
  }
}
