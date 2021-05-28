const cryptoM = require('crypto');
const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const rm = util.promisify(fs.unlink);

const encryptionMethods = {
  'aes-256-ctr': { key: 'sha256', algorithm: 'aes-256-ctr' }
};

process.on('message', async (data) => {
  let {
    type,
    file,
    algorithm,
    password,
    temp_directory,
    preserve_filename = true,
    preserve_meta = false
  } = data;

  const encryption = encryptionMethods[algorithm || 'aes-256-ctr'];

  const directory = file.uri.substring(0, file.uri.lastIndexOf('/') + 1);
  const file_name = (preserve_filename ? file.file_name : file.integrity_hash) + '.encrypted';
  const encrypted_location = directory + file_name;

  const key = locksmith(password, encryption);
  let buffer;
  try {
    // divert to the correct function
    if (type === 'encrypt') {
      buffer = await encryptFile(file.uri, encrypted_location, encryption.algorithm, key);
    } else if (type === 'decrypt')
      buffer = await decryptFile(encrypted_location, encryption.algorithm, key, temp_directory);
    else return process.send(false);
  } catch (e) {
    throw e;
  }

  if (!buffer) return;

  // generate an up-to-date integrity hash for this file
  const integrity_hash = cryptoM.createHash('sha256').update(buffer).digest('hex');

  const encrypted = type === 'encrypt';

  if (preserve_meta) {
    process.send({
      type: 'update-file',
      file: {
        id: file.id,
        file_name,
        uri: encrypted_location,
        encryption_method: encrypted ? encryption.algorithm : null,
        integrity_hash
      }
    });
  } else {
    process.send({
      type: 'replace-file',
      file: {
        id: file.id,
        file_name,
        uri: encrypted_location,
        encryption_method: encrypted ? encryption.algorithm : null,
        extension: 'encrypted',
        size: file.size,
        integrity_hash
      }
    });
  }
});

function locksmith(key, encryption) {
  return cryptoM.createHash(encryption.key).update(String(key)).digest('base64').substr(0, 32);
}

async function encryptFile(file_uri, encrypted_location, algorithm, key) {
  process.send({
    type: 'status-event',
    data: { type: 'encrypting-file', file: { uri: file_uri } }
  });
  const file_buffer = await readFile(file_uri);
  // Create an initialization vector
  const iv = cryptoM.randomBytes(16);
  // Create a new cipher using the algorithm, key, and iv
  const cipher = cryptoM.createCipheriv(algorithm, key, iv);
  // Create the new (encrypted) buffer
  const encrypted_buffer = Buffer.concat([iv, cipher.update(file_buffer), cipher.final()]);

  // write nonsense as a file at the encrypted location
  await writeFile(encrypted_location, encrypted_buffer);

  // remove original
  await rm(file_uri);

  return encrypted_buffer;
}

async function decryptFile(encrypted_location, algorithm, key, temp_directory) {
  process.send({
    type: 'status-event',
    data: { type: 'decrypting-file', file: { uri: encrypted_location } }
  });
  let encrypted_buffer = await readFile(encrypted_location);
  // Get the iv: the first 16 bytes
  const iv = encrypted_buffer.slice(0, 16);
  // Get the rest
  encrypted_buffer = encrypted_buffer.slice(16);
  // Create a decipher
  const decipher = cryptoM.createDecipheriv(algorithm, key, iv);
  // Actually decrypt it
  const decrypted_buffer = Buffer.concat([decipher.update(encrypted_buffer), decipher.final()]);

  // write file
  if (temp_directory) await writeFile(encrypted_location, decrypted_buffer);
  else {
    // send file to be re-scanned
  }
  return decrypted_buffer;
}
