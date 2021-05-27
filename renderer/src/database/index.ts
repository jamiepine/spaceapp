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
    logging: false,
    synchronize: true
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
  // const connection = false;

  const drives = await getDrives();

  // const readPath = '/Users/jamie/Downloads';
  async function Refresh() {
    const files = await connection.createQueryBuilder().select().from(File, 'file').execute();
    FileCollection.collect(files);
  }

  Refresh();

  ipcRenderer.on('ingest-file', async (e, files) => {
    console.log({ files });
    await connection
      .createQueryBuilder()
      .insert()
      .into(File)
      .values(files)
      .onConflict(`("uri") DO NOTHING`)
      .execute();
    Refresh();
  });
  ipcRenderer.on('load-file', (e, fileURI) => {
    console.log(fileURI);
  });

  // console.log(result.raw);

  // console.log(fileList);

  // analyzeFile('/Users/jamie/Desktop/haha.png');
}

main().catch(console.error);
