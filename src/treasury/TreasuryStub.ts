// TreasuryStub.ts
import { EventEmitter } from 'events'
import type { IPaymentOutput } from 'kaspa-wasm32-sdk'

// Make sure it has the same interface as the real Treasury
export default class TreasuryStub extends EventEmitter {
  // The real treasury might have a property like `processor.networkId`.
  // Provide a dummy:
  processor = { networkId: 'testnet-11' }

  constructor() {
    super()
    // You could fire fake events if you want to simulate coinbase:
    // setTimeout(() => this.emit('coinbase', BigInt(1000000)), 5000)
    // setTimeout(() => this.emit('revenue', BigInt(50000)), 7000)
  }

  // The real treasury might have a `send(...)` method
  async send(_payments: IPaymentOutput[]): Promise<string> {
    // Return a fake transaction hash or do nothing
    return 'dummyTxHash'
  }
}
