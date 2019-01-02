import ethereumUtils from 'ethereumjs-util';
import randomBytes from 'randombytes';

const ctx: Worker = self as any;

ctx.addEventListener('message', (e) => {
  if (e.data.command === 'start') {
    start();
  }
});

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let running = false;
let iterations = 0;
async function start() {
  running = true;
  while (running) {
    let result = runSeries();
    if (result) {
      console.log('done', result);
      ctx.postMessage({ type: 'result', result });
      running = false;
      return;
    }
    ctx.postMessage({ type: 'status', status: { iterations }});
    await wait(1);
  }
}

function runSeries() {
  for (let i = 0; i < 1000; i++) {
    const privkey = randomBytes(32);
    const addr = ethereumUtils.privateToAddress(privkey);
    const nonce = ethereumUtils.toBuffer(0);
    const contractaddr = ethereumUtils.generateAddress(addr, nonce).toString('hex');
    const numZeros = contractaddr.search(/[1-9a-f]/);
    if (contractaddr.indexOf('0000') == 0) {
      iterations += i;
      console.log( `0x${contractaddr}`);
      console.log(`pk: ${privkey.toString('hex')}`);
      return {
        address: contractaddr,
        privkey: privkey.toString('hex'),
        iterations,
      };
    }
  }
  iterations += 1000;
  return false;
}
