import 'reflect-metadata';

import { createConnection, ConnectionOptions } from 'typeorm';
import { getDrives } from '../core/drives';
import { FileCollection } from '../core/state';
import { File } from './models/File';
import { File as IFile } from '../types';

const electron = window.require('electron');
const fs = window.require('fs');
const util = window.require('util');
const { ipcRenderer } = window.require('electron');

const appDataPath = electron.remote.app.getAppPath();

function options(dbName: string): ConnectionOptions {
  return {
    type: 'sqlite',
    database: `${appDataPath}/data/${dbName}.sqlite`,
    entities: [File],
    logging: false
    // synchronize: true
  };
}

async function initDataFolder() {
  try {
    await fs.mkdirSync(`${appDataPath}/data`);
    await fs.mkdirSync(`${appDataPath}/data/thumbnails`);
  } catch (e) {
    console.error(e);
  }
}

async function main() {
  console.log('App Data Path:', appDataPath);
  let exists = await fs.existsSync(`${appDataPath}/data`);
  if (!exists) await initDataFolder();

  const connection = await createConnection(options('app_data'));

  connection.synchronize();

  const drives = await getDrives();

  console.log({ drives });

  // const readPath = '/Users/jamie/Downloads';
  async function Refresh() {
    const files = await connection.createQueryBuilder().select().from(File, 'file').execute();
    FileCollection.collect(files);
  }

  Refresh();

  ipcRenderer.on('ingest-scanned-directory', async (e, data) => {
    ingestFiles(data.files);
  });

  ipcRenderer.on('update-file', async (e, data) => {
    if (data.file?.id) {
      console.log('UPDATING FILE', data.file);

      await connection
        .createQueryBuilder()
        .update(File)
        .set({
          extension: data.file.extension,
          uri: data.file.uri,
          encryption_method: data.file.encryption_method || null
        })
        .where('id = :id', { id: data.file.id })
        .execute();

      FileCollection.update(data.file.id, data);
    }
  });

  ipcRenderer.on('replace-file', async (e, data) => {
    if (data.file?.id) {
      console.log('REPLACING FILE', data.file);

      const nullified_file: Partial<IFile> = {};

      Object.keys(new File()).forEach((key) => (nullified_file[key] = null));

      const file = {
        ...nullified_file,
        ...data.file,
        date_created: new Date(),
        date_modified: new Date(),
        date_indexed: new Date()
      };

      await connection
        .createQueryBuilder()
        .update(File)
        .set(file)
        .where('id = :id', { id: data.file.id })
        .execute();

      FileCollection.collect(file);
    }
  });

  ipcRenderer.on('status-event', (e, data) => {
    console.log(data);
  });

  async function ingestFiles(files: File[]) {
    let batchedFiles: File[] = [];

    if (!Array.isArray(files)) return;

    if (files.length >= 500) batchedFiles = files.splice(0, 500);
    else {
      batchedFiles = files;
      files = [];
    }
    console.log({ batchedFiles });

    await connection.createQueryBuilder().insert().into(File).values(batchedFiles).execute();
    Refresh();
    // ingest remaining files
    if (files.length > 0) ingestFiles(files);
  }
}

// main().catch(console.error);
