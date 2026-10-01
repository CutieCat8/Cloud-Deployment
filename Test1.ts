import { Utils } from './Utils';

// Prints a GitHub Actions annotation so the failure shows up on the run summary
const fail = (title: string, message: string) => {
  console.error(`::error file=Test1.ts,title=${title}::${message}`);
  process.exitCode = 1;
};

const unit_test = () => {
  const first = Utils.add(2, 2);
  if (first === 4) {
    console.log('Unit test 1: add(2, 2) = 4');
  } else {
    fail('Unit test 1 failed', `add(2, 2): expected 4, got ${first}`);
  }

  const second = Utils.add(3, 3);
  if (second === 6) {
    console.log('Unit test 2: add(3, 3) = 6');
  } else {
    fail('Unit test 2 failed', `add(3, 3): expected 6, got ${second}`);
  }
};

unit_test();
