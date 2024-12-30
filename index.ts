// index.ts (top-level entry point)

// --- 1) Import REAL classes ---
import { RpcClient, Encoding, Resolver } from "./wasm/kaspa";
import Treasury from "./src/treasury";
import Templates from "./src/stratum/templates";
import Stratum from "./src/stratum";
import Pool from "./src/pool";

// --- 2) Import STUB classes ---
import { RpcClientStub } from "./src/treasury/RpcClientStub";
import TreasuryStub from "./src/treasury/TreasuryStub";
import StratumStub from "./src/stratum/StratumStub";

// Config
import config from "./config.json";

// Decide if we want to use stubs
const USE_STUBS = true; // or check an env var: process.env.USE_STUBS === "true"

async function main() {
  // RPC
  let rpc: RpcClient | RpcClientStub;
  let serverInfo: { isSynced: boolean; hasUtxoIndex: boolean; networkId: string };

  if (!USE_STUBS) {
    // Use the real RpcClient
    rpc = new RpcClient({
      resolver: new Resolver(),
      encoding: Encoding.Borsh,
      networkId: "testnet-11",
    });
    await rpc.connect();
    serverInfo = await rpc.getServerInfo();
    if (!serverInfo.isSynced || !serverInfo.hasUtxoIndex) {
      throw new Error("Provided node is either not synchronized or lacks the UTXO index.");
    }
  } else {
    // Use the stub
    rpc = new RpcClientStub();
    await rpc.connect(); // no-op in the stub
    serverInfo = await rpc.getServerInfo(); // returns dummy data
  }

  // Treasury
  let treasury: Treasury | TreasuryStub;
  if (!USE_STUBS) {
    treasury = new Treasury(
      rpc as RpcClient, // cast if needed
      serverInfo.networkId,
      config.treasury.privateKey,
      config.treasury.fee
    );
  } else {
    treasury = new TreasuryStub();
  }

  // Templates (Optional):
  // You can keep the real "Templates" class even in stub mode if you want,
  // or create a TemplatesStub. We'll keep the real one for now:
  const templates = new Templates(rpc as any, 
                                  treasury.address ?? "stub-address", 
                                  config.stratum.templates.cacheSize);

  // Stratum
  let stratum: Stratum | StratumStub;
  if (!USE_STUBS) {
    stratum = new Stratum(templates, config.stratum.port, config.stratum.difficulty);
  } else {
    stratum = new StratumStub();
  }

  // Pool
  const pool = new Pool(treasury as any, stratum as any);

  // Just to prove it's running:
  console.log("Pool is initialized with stubs =", USE_STUBS);
}

main().catch((err) => console.error(err));
