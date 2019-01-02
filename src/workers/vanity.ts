import ethereumUtils from 'ethereumjs-util';
import randomBytes from 'randombytes';
import { SearchParams, StatusUpdate, AddressResult } from './vanity.types';

const ITERATION_SIZE = 1000;

const ctx: Worker = self as any;

ctx.addEventListener('message', (e) => {
  if (e.data.command === 'start') {
    start(e.data.params as SearchParams);
  }
});

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let running = false;
let iterations = 0;
async function start(params: SearchParams) {
  running = true;
  while (running) {
    let result = runSeries(params);
    if (result) {
      ctx.postMessage({ type: 'result', result });
      running = false;
      return;
    }
    const status: StatusUpdate = { iterations };
    ctx.postMessage({ type: 'status', status });
    await wait(1);
  }
}

function runSeries(params: SearchParams) {
  for (let i = 0; i < ITERATION_SIZE; i++) {
    const privkey = randomBytes(32);
    const addr = ethereumUtils.privateToAddress(privkey);
    const nonce = ethereumUtils.toBuffer(0);
    const contractaddr = ethereumUtils.generateAddress(addr, nonce).toString('hex');
    const numZeros = contractaddr.search(/[1-9a-f]/);
    if (contractaddr.indexOf(params.search) == 0) {
      iterations += i;

      const result: AddressResult = {
        address: contractaddr,
        privkey: privkey.toString('hex'),
        iterations,
      };
      return result;
    }
  }
  iterations += ITERATION_SIZE;
  return false;
}
