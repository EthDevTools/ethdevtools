// Moved this into one file so that we can easily swap between storing data local or in sync storage

import chromep from 'chrome-promise';

// select if you want to store data locally or in synced storage
// SEE https://developer.chrome.com/extensions/storage
// you can change this setting in config/env.js
const useSyncStorage = process.env.CHROME_STORAGE_ENGINE === 'sync';
const chromeStorage = useSyncStorage ? chromep.storage.sync : chromep.storage.local;

// keys can be a single string or array of strings
// returns an object with those keys and the values from chrome storage
export async function getSettings(keys) {
  return chromeStorage.get(keys);
}

// takes a single key and returns the value from storage
export async function getSetting(key) {
  const settings = await getSettings(key);
  return settings[key];
}

// takes a an object of key/values to save in storage
export async function setSettings(settingsToSave) {
  return chromeStorage.set(settingsToSave);
}
