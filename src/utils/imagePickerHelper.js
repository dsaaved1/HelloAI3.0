import {launchImageLibrary} from 'react-native-image-picker';
import { Platform } from 'react-native';
//import { PERMISSIONS, request } from '@react-native-community/permissions';
import { getFirebaseApp } from './firebaseHelper';
import uuid from 'react-native-uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

export const launchImagePicker = () => {
  console.log('launchImagePicker')
    return new Promise(async (resolve, reject) => {
     //await checkMediaPermissions();
  
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
          console.log(response.assets[0].uri, "response.uri")
          resolve(response.assets[0].uri);
        }
      });
    });
  };



export const uploadImageAsync = async (uri, isChatImage = false) => {
  console.log("uploadImageAsync")
    const app = getFirebaseApp();
console.log("app", app)
// Remove the "file://" prefix from the URI
const fileUri = uri.replace("file://", "");
console.log("fileUri", fileUri)

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
        xhr.open("GET", fileUri, true);
        xhr.send();
    });


    console.log("blob", blob)
    const pathFolder = isChatImage ? 'chatImages' : 'profilePics';
    const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);

    console.log("storageRef", storageRef)
    await uploadBytesResumable(storageRef, blob);

    console.log("uploadBytesResumable")
    blob.close();

    return await getDownloadURL(storageRef);
}

// const checkMediaPermissions = async () => {
//   if (Platform.OS === 'android') {
//     const status = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//     if (status !== 'granted') {
//       return Promise.reject('We need permission to access your photos.');
//     }
//   } else if (Platform.OS === 'ios') {
//     const status = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
//     if (status !== 'granted') {
//       return Promise.reject('We need permission to access your photos.');
//     }
//   }

//   return Promise.resolve();
// };