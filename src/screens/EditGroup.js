import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import userImage from '../images/userImage.jpeg'

const EditGroup = props => {
    const channel =  props.route?.params?.channel || {};
    const [source, setSource] = useState(channel.data.image ? { uri: channel.data.image } : userImage)
    const [groupName, setGroupName] = useState(channel.data.name);

    console.log(source, groupName, "source, groupName")

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
                        await channel.updatePartial({ set: { name: groupName } });
                        props.navigation.goBack();
                      }}
                    />
                  </HeaderButtons>
                );
            },
        })
    }, [groupName]);

    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <Image source={source} style={styles.userImage} />
            <TouchableOpacity onPress={() => console.log('Update photo')}>
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

