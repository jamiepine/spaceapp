import { collection, state } from '@pulsejs/core';
import { Directory, File } from '../types';

export const AppState = {
  CURRENT_TAB: state('spaces'),
  SELECTED_FILE: state<number | null>(null)
};

export const FileCollection = collection<File | Directory>({ defaultGroup: true });
