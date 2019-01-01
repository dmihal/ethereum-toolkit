import ethereumUtils from 'ethereumjs-util';
import randomBytes from 'randombytes';

self.addEventListener('message', (e) => {
  if (e.data.command === 'start') {
    start();
  }
});

function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

let running = false;
async function start() {
  running = true;
  while (running) {
    let result = runSeries();
    if (result) {
      console.log('done', result);
      running = false;
      return;
    }
    await wait(1);
    console.log('Nothing yet...');
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
      console.log( `0x${contractaddr}`);
      console.log(`pk: ${privkey.toString('hex')}`);
      return { contractaddr, privkey, };
    }
  }
  return false
}
