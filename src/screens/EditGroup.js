import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import userImage from '../images/userImage.jpeg'
import { launchImagePicker, uploadImageAsync} from '../utils/imagePickerHelper';
import {colors} from '../theme'

const EditGroup = props => {
    const channel =  props.route?.params?.channel || {};
    const source = channel?.data?.image? { uri: channel?.data?.image } : userImage
    const [image, setImage] = useState(source);
    const [isLoading, setIsLoading] = useState(false);
    const [groupName, setGroupName] = useState(channel.data.name);
    const [tempImageUri, setTempImageUri] = useState("");

    useEffect(() => {
        props.navigation.setOptions({
          headerStyle: {
            backgroundColor: '#0E1528',
          },
            headerTitle: () => (
                <View style={{ alignItems: 'center', margin: 5 }}>
                <Text style={{ 
                color: 'white',
                fontSize: 16, fontWeight: 'bold' }}>
                    Edit Group
                </Text>
                </View>
            ),
            headerTintColor: '#3777f0',
              headerRight: () => {
                return (
                  <HeaderButtons>
                    <Item
                      title={'Done'}
                      color= '#3777f0'
                      onPress={async () => {
                        //if tempImageUri is not empty, upload image
                        if (tempImageUri !== "") {
                          // Upload the image
                          await channel.updatePartial({ set: { name: groupName, image: tempImageUri } });
                        } else {
                          await channel.updatePartial({ set: { name: groupName } });
                        }
                        props.navigation.goBack();
                      }}
                    />
                  </HeaderButtons>
                );
            },
        })
    }, [groupName, tempImageUri]);

    const pickImage = useCallback(async () => {
      try {
        const tempUri = await launchImagePicker();

        if (!tempUri) return;
  
        // Upload the image
        setIsLoading(true);
        const uploadUrl = await uploadImageAsync(tempUri);
        

        setIsLoading(false);

        if (!uploadUrl) {
          throw new Error("Could not upload image");
        }
        setImage({ uri: uploadUrl });
        setTempImageUri(uploadUrl);
        
       
      } catch (error) {
        console.log(error);
      }
    }, [tempImageUri]);

    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
           {isLoading?
                    <ActivityIndicator size="small" color={colors.dark.secondaryLight} />
                  : 
                    <>
                      <Image
                      source={image}
                      style={styles.userImage}
                      />
                    </>
                  }
            <TouchableOpacity  onPress={pickImage}>
              <Text style={styles.updatePhotoText}>Update photo</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.groupNameInput}
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
            autoFocus={false}
          />
        </View>
      );
    };
    
    export default EditGroup;
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        alignItems: 'center',
      },
      imageContainer: {
        alignItems: 'center',
        marginTop: 20,
      },
      userImage: {
        borderRadius: 10,
        height: 110,
        width: 110,
      },
      updatePhotoText: {
        marginTop: 10,
        fontSize: 16,
        color: '#3777f0',
      },
      groupNameInput: {
        marginTop: 20,
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        color:'white'
      },
    });

