const cryptoM = require('crypto');
const fs = require('fs');
const util = require('util');
const fileType = require('file-type');
const exifr = require('exifr');
const ThumbnailGenerator = require('fs-thumbnail');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);

const thumbGen = new ThumbnailGenerator({ verbose: false, size: [100, 100], quality: 50 });

process.on('message', async (data) => {
  let files = [];
  const { directory, file_path, app_data_path } = data;
  if (directory) {
    const dir = await readdir(directory);
    for (const fileName of dir) {
      if (fileName.startsWith('.')) continue;
      const file = await analyzeFile(app_data_path, `${directory}/${fileName}`, fileName);
      files.push(file);
    }
    process.send({ type: 'ingest-scanned-directory', files });
  } else if (file_path) {
    const file = await analyzeFile(app_data_path, file_path);
    process.send({ type: 'ingest-scanned-file', file });
  }
});

async function analyzeFile(app_data_path, file_path, file_name) {
  try {
    process.send({ type: 'status-event', data: { type: 'scan-file', file: { uri: file_path } } });

    if (!file_name) file_name = file_path.split('/').pop();

    const stats = await stat(file_path);

    // for directories
    if (!stats.isFile()) {
      return {
        integrity_hash: cryptoM.createHash('sha256').update(stats.uid.toString()).digest('hex'),
        file_name,
        uri: file_path,
        mime: 'directory',
        size: stats?.size,
        date_created: stats.ctime,
        date_modified: stats.mtime
      };
    }

    // read the first 10,000 bytes to create hash and get file type
    let fileBuffer;
    const stream = fs.createReadStream(file_path, {
      start: 0,
      end: 1000
    });
    await new Promise((resolve, reject) => {
      stream.on('data', async (data) => {
        fileBuffer = data;
        resolve();
      });
      stream.on('error', async (data) => {
        reject();
      });
    });
    // const fileBuffer = await readFile(file_path);

    const file_type = await fileType.fromBuffer(fileBuffer);

    const integrity_hash = cryptoM.createHash('sha256').update(fileBuffer).digest('hex');

    let exif = null;
    let thumbnail = false;
    const thumbURI = `${app_data_path}/data/thumbnails/${integrity_hash}.jpg`;

    if (file_type?.mime?.startsWith('image')) {
      console.log({ file_type });
      try {
        exif = await exifr.parse(fileBuffer, true);
      } catch (e) {}
      try {
        if (!file_name.includes('HEIC') && !file_name.includes('ico')) {
          // const existingThumb = await fs.existsSync(thumbURI);
          thumbnail = true;

          thumbGen.getThumbnail({
            path: file_path,
            output: thumbURI
          });
        }
      } catch (e) {}
    }

    return {
      // id: integrity_hash || '' + file_name,
      file_name,
      thumbnail,
      uri: file_path,
      integrity_hash,
      size: stats?.size,
      extension: file_type?.ext || file_path?.split('.').pop(),
      mime: file_type?.mime || 'unknown',
      date_created: stats?.ctime,
      date_modified: stats?.mtime,
      extra_data: { stats, exif }
    };
  } catch (e) {
    return e;
  }
}
