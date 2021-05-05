/* eslint-disable max-len */
import * as net from 'net';
import * as yargs from 'yargs';

const client = net.connect({port: 60300});

let wholeData = '';
client.on('data', (dataChunk) => {
  wholeData += dataChunk;
});

client.on('end', () => {
  console.log(wholeData);
});

yargs.command({
  command: 'command',
  describe: 'command',
  builder: {
    command: {
      describe: 'command',
      demandOption: true,
      type: 'string',
    },
    argv: {
      describe: 'argv',
      demandOption: true,
      type: 'string',
    },
  },
  handler(argv) {
    if ((typeof argv.command === 'string') && (typeof argv.argv === 'string')) {
      client.write(JSON.stringify({'command': argv.command, 'argv': argv.argv}) + '\n');
    }
  },
});

yargs.parse();
