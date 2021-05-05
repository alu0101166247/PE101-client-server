/* eslint-disable max-len */
import * as net from 'net';
import {spawn} from 'child_process';

export type RequestType = {
    command: string;
    argv: string;
  }

export type ResponseType = {
    success: boolean;
    response: any;
  }

const server = net.createServer({allowHalfOpen: true}, (connection) => {
  console.log('A client has connected.');

  /* let wholeData = '';
  connection.on('data', (dataChunk) => {
    wholeData += dataChunk;
    let messageLimit = wholeData.indexOf('\n');
    while (messageLimit !== -1) {
      const message = wholeData.substring(0, messageLimit);
      wholeData = wholeData.substring(messageLimit + 1);
      connection.emit('request', JSON.stringify(message));
      messageLimit = wholeData.indexOf('\n');
    }
  });*/
  let Output = '';
  connection.on('data', (dataJson) => {
    const request = JSON.parse(dataJson.toString());
    console.log(request);
    console.log(`${request.command}`);
    const command = spawn(`${request.command}`, [`${request.argv}`]);
    command.stdout.on('data', (piece) => Output += piece);
    command.on('close', () => {
      const response: ResponseType = {
        success: true,
        response: Output,
      };
      console.log(Output);
      connection.write(JSON.stringify(response));
      connection.end();
    });
  });

  connection.on('close', () => {
    console.log('A client has disconnected');
  });
});

server.listen(60300, () => {
  console.log('Waiting for clients to connect.');
});
