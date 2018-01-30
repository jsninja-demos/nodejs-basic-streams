const { Readable, Writable } = require('stream');

let count = 0;

class MyWritable extends Writable {
  _write(data, encode, cb) {
    console.log('_write', data);

    cb();
  }
}

class MyReadable extends Readable {
  _read() {
    console.log('_read');
    setTimeout(() => {
      if (count > 12) {
        this.push(null);
      } else {
        count++;
        const buf = Buffer.from('1');
        this.push(buf);
      }
    }, 1000);
  }
}
const writable = new MyWritable();
writable.write('some string');

const myReadable = new MyReadable();
let counter2 = 0;

myReadable.on('readable', () => {
  const a = myReadable.read(10);

  if (!a) {
    console.log(counter2);
    counter2++;
  } else {
    counter2 = 0;
    console.log('a comes', a);
  }
});

myReadable.on('end', () => {
  console.log('stream ended');
});

myReadable.on('error', error => {
  console.log(error);
});

myReadable.pipe(writable);

// myReadable.on('data', (data) => {
//   console.log('readed data', data);
// }) // -> flowing mode
