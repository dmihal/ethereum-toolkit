import VanityWorker, { WebpackWorker } from './vanity.worker';
import { SearchParams, StatusUpdate, AddressResult, AddressType } from './vanity.types';

export type SearchParams = SearchParams;
export type AddressType = AddressType;

export default class VanityControl {
  worker: WebpackWorker;
  params: SearchParams;

  private static timingResults: { [key: string]: number } = {};

  constructor(params: SearchParams) {
    this.worker = new VanityWorker();
    this.params = params;
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
    this.worker.postMessage({ command: 'start', params: this.params });
    const result = await this.getResult();
    this.worker.terminate();
    return result as AddressResult;
  }

  runTimeTrial(): Promise<number> {
    const key = `${this.params.addressType}-${this.params.search.length}`;
    if (VanityControl.timingResults[key]) {
      return Promise.resolve(VanityControl.timingResults[key]);
    }

    const promise = new Promise<number>((resolve) => {
      this.worker.addEventListener('message', (e: MessageEvent) => {
        if (e.data.type === 'timeTrialResult') {
          const estimatedMS = (16 ** this.params.search.length) * e.data.time / e.data.iterations;
          VanityControl.timingResults[key] = estimatedMS;
          this.worker.terminate();
          resolve(estimatedMS);
        }
      });
    });
    this.worker.postMessage({ command: 'timeTrial', params: this.params });
    return promise;
  }

  abort() {
    this.worker.terminate();
  }
}
