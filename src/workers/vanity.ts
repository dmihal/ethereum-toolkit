import ethereumUtils from 'ethereumjs-util';
import randomBytes from 'randombytes';
import { SearchParams, StatusUpdate, AddressResult } from './vanity.types';

const ITERATION_SIZE = 1000;

const ctx: Worker = self as any;
const performance = self.performance as Performance;

ctx.addEventListener('message', (e) => {
  if (e.data.command === 'start') {
    start(e.data.params as SearchParams);
  } else if (e.data.command === 'timeTrial') {
    runTimeTrial(e.data.params as SearchParams);
  }
});

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTimeTrial(params: SearchParams) {
  params.search = 'z'; // z isn't hexadecimal, so it will search forever

  const start = performance.now();

  runSeries(params);
  wait(1);
  runSeries(params);

  const stop = performance.now();

  const time = stop - start;
  ctx.postMessage({ type: 'timeTrialResult', time, iterations: ITERATION_SIZE * 2 });
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
    const accountAddress = ethereumUtils.privateToAddress(privkey);

    let address: string;
    if (params.addressType === 'Account') {
      address = accountAddress.toString('hex');
    } else {
      const nonce = ethereumUtils.toBuffer(0);
      address = ethereumUtils.generateAddress(accountAddress, nonce).toString('hex');
    }

    if (address.indexOf(params.search) == 0) {
      iterations += i;

      const result: AddressResult = {
        address,
        privkey: privkey.toString('hex'),
        accountAddress: accountAddress.toString('hex'),
        iterations,
      };
      return result;
    }
  }
  iterations += ITERATION_SIZE;
  return false;
}
