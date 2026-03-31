import { exec } from 'child_process';

// for ping...
export const execAsyncPing = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
      //console.log('stdout:', stdout);
      //console.log('stderr:', stderr);
      if (error) {
        return reject(error);
      }
      if (stderr) {
        return reject(new Error(stderr));
      }
      const outputSPS = stdout.toString('utf8');
      //console.log('outputSPS: ' + outputSPS);
      resolve(outputSPS);
    });
  });
};
