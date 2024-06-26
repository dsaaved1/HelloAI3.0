import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Image
} from 'react-native';
import {chatClient} from '../client'
import colors from '../assets/constants/colors';
import ProfileImage from '../components/new-chat/ProfileImage';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { createGroupChat, inviteDirectMessage } from '../utils/actions/chatActions'
import { SVGIcon } from '../components/SVGIcon';
import { ROOT_STACK } from '../stacks/RootStack';
import { useNavigation } from '@react-navigation/native';
import { launchImagePicker, uploadImageAsync} from '../utils/imagePickerHelper';


const NewGroupName = (props) => {
    const navigation = useNavigation();

    const { route } = props;
    const {selectedUsers} = route?.params || {};
    const [selectedUsersName, setSelectedUsersName] = useState(selectedUsers);
    const [image, setImage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [tempImageUri, setTempImageUri] = useState("");
    const [chatName, setChatName] = useState("");
    const isGroupChatDisabled = Object.keys(selectedUsersName).length === 0   || chatName.length === 0;

    const selectedUsersFlatList = useRef();
    

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => (
                <View style={{ alignItems: 'center', margin: 5 }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                     New Group
                  </Text>
                </View>
              ),
            headerStyle: {
                backgroundColor: '#0E1528', 
              },
            headerLeft: () => {
                return <HeaderButtons 
                //HeaderButtonComponent={CustomHeaderButton}
                >
                    <Item
                        title="Back"
                        color='#3777f0'
                        onPress={() => props.navigation.goBack()}/>
                </HeaderButtons>
            },
            headerRight: () => {
                return <HeaderButtons 
                //uses expo vector icons
                //HeaderButtonComponent={CustomHeaderButton}
                >
                        <Item
                            title={"Create"}
                            disabled={isGroupChatDisabled}
                            color={isGroupChatDisabled ? colors.lightGrey : '#3777f0'}
                            onPress={async () => {

                                const userIds = Object.keys(selectedUsersName); // Get an array of user ids from selectedUsers
                                await createGroupChat(chatClient?.user?.id, chatClient, chatName, userIds, true, tempImageUri);
                                console.log('send invitation to users to create a group chat')
                                //navigation.navigate(ROOT_STACK.CONVOS, { channelId: channelInfo.id, channelName: channelInfo.name, channelUsers: channelInfo.members});
                                navigation.navigate('Main');
                            }}/>
                </HeaderButtons>
            },
        })
    }, [chatName, selectedUsersName, isGroupChatDisabled]);




    const userPressed  = (userId, userImage) => {

            let newSelectedUsers = { ...selectedUsersName };

            if (userId in newSelectedUsers) {
                delete newSelectedUsers[userId];
            } else {
                newSelectedUsers[userId] = userImage;
            }

            setSelectedUsersName(newSelectedUsers);

            console.log(newSelectedUsers, 'newSelectedUsers after adding')
        
    }

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

                <View style={styles.centeredContainer}>
                <View style={styles.chatNameContainer}>

                <TouchableOpacity onPress={pickImage} style={styles.iconWrapper}>
                {isLoading ? (
                    <ActivityIndicator size="small" color={'#859299'} />
                ) : image === "" ? (
                    <SVGIcon height={28} type="image-attachment" width={28} />
                ) : (
                    <Image source={image} style={styles.userImage} />
                )}
                </TouchableOpacity>
                                        
                            <TextInput 
                                style={styles.textbox}
                                placeholder="Group Name"
                                placeholderTextColor="grey"
                                autoCorrect={false}
                                autoFocus={true}
                                onChangeText={text => setChatName(text)}
                            />
                      
                </View>
                </View>
        
                
       
                <View style={styles.selectedUsersContainer}>
                     <FlatList
                            style={styles.selectedUsersList}
                            data={Object.entries(selectedUsersName)}
                            horizontal={true}
                            keyExtractor={item => item}
                            contentContainerStyle={{ alignItems: 'center' }}
                            ref={ref => selectedUsersFlatList.current = ref}
                            onContentSizeChange={() => selectedUsersFlatList.current.scrollToEnd()}
                            renderItem={itemData => {
                                const userId = itemData.item[0];
                                const userImage = itemData.item[1];
                                return <ProfileImage
                                    style={styles.selectedUserStyle}
                                    size={50}
                                    uri={userImage}
                                    onPress={() => userPressed(userId, userImage)}
                                    showRemoveButton={true}
                                />
                            }}
                        />
                </View>
        


        </View>
  )
}

export default NewGroupName

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#0E1528',
        paddingTop: 10,
    },
    chatNameContainer: {
        paddingVertical: 20,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    centeredContainer: {
        alignItems: "center",
      },
    iconWrapper: {
        width: 70,
        height: 70,
        borderRadius: 50, // Half of the width and height to create a circle
        backgroundColor: '#1C2337', // Set the background color of the circle
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15, // Add some space between the icon and the text input
      },
      textbox: {
        color: colors.textColor,
        flex: 1, // Make the text input take up the remaining space
        // fontFamily: 'regular',
        letterSpacing: 0.3,
        fontSize: 18,
        
      },
    selectedUsersContainer: {
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedUsersList: {
        height: '100%',
        paddingTop: 10
    },
    selectedUserStyle: {
        marginRight: 10,
        marginBottom: 10
    },
    userImage: {
        borderRadius: 35, // Half of the width and height to create a circle
        width: '100%',
        height: '100%',
      },
})