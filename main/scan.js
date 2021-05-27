const cryptoM = require('crypto');
const fs = require('fs');
const util = require('util');
const fileType = require('file-type');
const exifr = require('exifr');
const ThumbnailGenerator = require('fs-thumbnail');

const stat = util.promisify(fs.stat);
const readdir = util.promisify(fs.readdir);

const thumbGen = new ThumbnailGenerator({ verbose: false, size: [100, 100], quality: 50 });

process.on('message', async (data) => {
  const { readPath, app_data_path } = data;
  let files = [];
  const dir = await readdir(readPath);
  for (const fileName of dir) {
    const file = await analyzeFile(app_data_path, `${readPath}/${fileName}`, fileName);
    files.push(file);
  }
  process.send(files);
});

async function analyzeFile(app_data_path, uri, file_name) {
  try {
    process.send(uri);
    const stats = await stat(uri);

    // for directories
    if (!stats.isFile()) {
      return {
        integrity_hash: cryptoM.createHash('sha256').update(stats.uid.toString()).digest('hex'),
        file_name,
        uri,
        mime: 'directory',
        size: stats?.size,
        date_created: stats.ctime,
        date_modified: stats.mtime
      };
    }

    const fileBuffer = await fs.readFileSync(uri);

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
            path: uri,
            output: thumbURI
          });
        }
      } catch (e) {}
    }

    return {
      // id: integrity_hash || '' + file_name,
      file_name,
      thumbnail,
      uri,
      integrity_hash,
      size: stats?.size,
      extension: file_type?.ext,
      mime: file_type?.mime || 'unknown',
      date_created: stats?.ctime,
      date_modified: stats?.mtime,
      extra_data: { stats, exif }
    };
  } catch (e) {
    return e;
  }
}
