// Default Metro config — the SDK is installed from npm (@applaudiq/embed-react-native), so no
// local-source watchFolders / peer-dep dedup is needed.
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

/** @type {import('metro-config').MetroConfig} */
const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
