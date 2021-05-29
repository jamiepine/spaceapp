const handbreak = require('handbrake-js');
const fs = require('fs');
const util = require('util');

const name = 'IMG_6130.MOV';
const file = `../../Movies/${name}`;
const out = `../../Movies/${name}_converted.mp4`;

const stat = util.promisify(fs.stat);

const options = {
  input: file,
  output: out,
  format: 'av_mp4',
  rate: 24,
  encoder: 'x264',
  quality: 32,
  optimize: true,
  arate: 16,
  width: 426,
  height: 240
};

let seconds = 0;

async function convert() {
  setInterval(() => seconds++, 1000);
  console.log('converting...', file);

  await new Promise((resolve) => {
    handbreak
      .spawn(options)
      .on('error', (err) => resolve)
      .on('progress', async (progress) => {
        console.log('Percent complete: %s, ETA: %s', progress.percentComplete, progress.eta);
        if (progress.percentComplete == 100) {
          const originalFile = await stat(file);
          const compressedFile = await stat(out);
          const original_size_mb = originalFile.size / 1000000;
          const compressed_size_mb = compressedFile.size / 1000000;
          const megabytes_per_second = Number((originalFile.size / seconds / 1000000).toFixed(2));
          const seconds_per_megabyte = Number(seconds / (originalFile.size / 1000000).toFixed(2));
          const percent_size_compressed = (compressedFile.size * 100) / originalFile.size;
          console.log({
            seconds,
            minutes: Number((seconds / 60).toFixed(2)),
            original_size_mb: bytesToSize(originalFile.size),
            compressed_size_mb: bytesToSize(compressedFile.size),
            percent_size_compressed: percent_size_compressed.toFixed(1) + '%',
            bytes_per_second: Number((originalFile.size / seconds).toFixed()),
            megabytes_per_second: megabytes_per_second + 'MB',
            seconds_per_megabyte,
            hours_per_100GB: Number(((seconds_per_megabyte * 100000) / 60 / 60).toFixed(1)) + ' HR',
            hours_per_terabyte:
              Number(((seconds_per_megabyte * 1000000) / 60 / 60).toFixed(1)) + ' HR',
            compressed_size_per_terabyte:
              (((1000000 / original_size_mb) * compressed_size_mb) / 1000).toFixed(1) + ' GB'
          });
        }
      });
  });
}

convert();

function bytesToSize(bytes) {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes == 0) return '0 Byte';
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
