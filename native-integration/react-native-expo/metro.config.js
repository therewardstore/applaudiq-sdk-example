// Default Expo Metro config — the SDK is installed from npm (@applaudiq/embed-react-native), so no
// local-source watchFolders / peer-dep dedup is needed.
const { getDefaultConfig } = require('expo/metro-config');

module.exports = getDefaultConfig(__dirname);
