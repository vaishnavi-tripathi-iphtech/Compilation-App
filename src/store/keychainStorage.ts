import * as keychain from 'react-native-keychain';

const KEYCHAIN_SERVICE = 'com.whatsappclone.auth';

const keychainStorage = {
  setItem: async (key: string, value: string): Promise<void> => {
    await keychain.setGenericPassword(key, value, { service: KEYCHAIN_SERVICE });
  },
  getItem: async (key: string): Promise<string | null> => {
    const credentials = await keychain.getGenericPassword({ service: KEYCHAIN_SERVICE });
    if (credentials && credentials.username === key) {
      return credentials.password;
    }
    return null;
  },
  removeItem: async (_key: string): Promise<void> => {
    
    await keychain.resetGenericPassword({ service: KEYCHAIN_SERVICE });
  },
};

export default keychainStorage;