import {launchImageLibrary} from 'react-native-image-picker';
import { Platform } from 'react-native';
import { getFirebaseApp } from './firebaseHelper';
import uuid from 'react-native-uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export const launchImagePicker = () => {
    return new Promise(async (resolve, reject) => {
      await checkMediaPermissions();
  
      const options = {
        mediaType: 'photo',
        allowsEditing: true,
        quality: 1,
      };
  
      launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          reject('User cancelled image picker');
        } else if (response.error) {
          reject(`ImagePicker Error: ${response.error}`);
        } else {
          resolve(response.uri);
        }
      });
    });
  };



export const uploadImageAsync = async (uri, isChatImage = false) => {
    const app = getFirebaseApp();

    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };

        xhr.onerror = function(e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };

        xhr.responseType = "blob";
        xhr.open("GET", uri, true);
        xhr.send();
    });

    const pathFolder = isChatImage ? 'chatImages' : 'profilePics';
    const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

    await uploadBytesResumable(storageRef, blob);

    blob.close();

    return await getDownloadURL(storageRef);
}

const checkMediaPermissions = async () => {
    if (Platform.OS !== 'web') {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            return Promise.reject("We need permission to access your photos");
        }
    }

    return Promise.resolve();
}