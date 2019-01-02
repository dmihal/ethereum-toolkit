import VanityWorker, { WebpackWorker } from './vanity.worker';

interface StatusUpdate {
  iterations: number,
}

interface AddressResult {
  address: string,
  privkey: string,
  iterations: number,
}

export default class VanityControl {
  worker: WebpackWorker;

  constructor() {
    this.worker = new VanityWorker();
  }

  onStatus(listener: (status: StatusUpdate) => any) {
    this.worker.addEventListener('message', (e: MessageEvent) => {
      if (e.data.type === 'status') {
        listener(e.data.status as StatusUpdate);
      }
    });
  }

  getResult() {
    return new Promise((resolve, reject) => {
      const resultListener = (e: MessageEvent) => {
        if (e.data.type === 'result') {
          removeListeners();
          resolve(e.data.result as AddressResult);
        }
      };
      const errorListener = (e: ErrorEvent) => {
        removeListeners();
        reject(e);
      };
      const removeListeners = () => {
        this.worker.removeEventListener('message', resultListener);
        this.worker.removeEventListener('error', errorListener);
      }
      this.worker.addEventListener('message', resultListener);
      this.worker.addEventListener('error', errorListener);
    });
  }

  async generateAddress() {
    this.worker.postMessage({ command: 'start' });
    const result = await this.getResult();
    this.worker.terminate();
    return result as AddressResult;
  }

  abort() {
    this.worker.terminate();
  }
}