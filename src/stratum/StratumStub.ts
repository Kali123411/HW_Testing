// StratumStub.ts
import { EventEmitter } from 'events'

export default class StratumStub extends EventEmitter {
  // If your code references `this.stratum.server.socket.port`,
  // stub out a `.server.socket` property or use optional chaining in your code.
  server = {
    socket: { port: 12345 }
  }

  constructor() {
    super()
    // Possibly emit 'subscription' events if you want to simulate a miner connecting
    // setTimeout(() => this.emit('subscription', '127.0.0.1', 'minerAgent'), 2000)
  }

  dumpContributions() {
    // Return empty or fake contributions
    return []
  }
}
