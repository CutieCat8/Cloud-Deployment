import { Utils } from './Utils';

const unit_test = () => {
  const first = Utils.add(2, 2);
  if (first === 4) {
    console.log('Unit test 1: add(2, 2) = 4');
  } else {
    console.error(`Unit test 1: expected 4, got ${first}`);
    process.exitCode = 1;
  }

  const second = Utils.add(3, 3);
  if (second === 6) {
    console.log('Unit test 2: add(3, 3) = 6');
  } else {
    console.error(`Unit test 2: expected 6, got ${second}`);
    process.exitCode = 1;
  }
};

unit_test();
