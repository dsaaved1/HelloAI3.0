import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Animated
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../components/IconButton';
import { searchUsers } from '../utils/actions/chatActions'
import {chatClient} from '../client'
import colors from '../assets/constants/colors';
import DataItem from '../components/new-chat/DataItem';
import ProfileImage from '../components/new-chat/ProfileImage';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { createGroupChat, inviteDirectMessage } from '../utils/actions/chatActions'
import { useAuthContext } from '../contexts/AuthContext';
import { ROOT_STACK } from '../stacks/RootStack';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import BottomAlert from '../components/BottomAlert';


const NewChatScreen = props => {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [chatExists, setChatExists] = useState(false);
    const [users, setUsers] = useState();
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState({});
    const [text, setText] = useState("")
    const [fadeInAnimation] = useState(new Animated.Value(0));
    const [showAddAlert, setShowAddAlert] = useState(false);

    const selectedUsersFlatList = useRef();
    const isGroupChat = props.route.params && props.route.params.isGroupChat;
    const isGroupChatDisabled = Object.keys(selectedUsers).length === 0
    const isNewChat = props.route?.params?.isNewChat
    const channel = props.route?.params?.channel || {};


    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => (
                <View style={{ alignItems: 'center', margin: 5 }}>
                  <Text style={{ 
                    color: showAddAlert ? 'rgba(255, 255, 255, 0.3)' : 'white',
                    fontSize: 16, fontWeight: 'bold' }}>
                     {isGroupChat ? "Add participants" : "New chat"}
                  </Text>
                </View>
              ),
            headerStyle: {
                backgroundColor: showAddAlert ? 'rgba(0,0,0,0.7)' : '#0E1528', 
              },
            headerLeft: () => {
                return <HeaderButtons 
                //HeaderButtonComponent={CustomHeaderButton}
                >
                    <Item
                        title="Close"
                        color= {showAddAlert ? 'rgba(55, 119, 240, 0.3)' : '#3777f0'}
                        onPress={() => props.navigation.goBack()}/>
                </HeaderButtons>
            },
            headerRight: () => {
                return <HeaderButtons 
                //uses expo vector icons
                //HeaderButtonComponent={CustomHeaderButton}
                >
                    {
                        isGroupChat &&
                        <Item
                            title={isNewChat ? "Next" : "Add"}
                            disabled={isGroupChatDisabled}
                            color={isGroupChatDisabled ? colors.lightGrey : '#3777f0'}
                            onPress={async () => {
                                if (isNewChat) {
                                    navigation.navigate(ROOT_STACK.NEW_GROUP_NAME, { selectedUsers: selectedUsers});
                                } else {
                                   setShowAddAlert(true)
                                }
                                
                            }}/>
                    }
                </HeaderButtons>
            },
        })
    }, [showAddAlert, isGroupChatDisabled]);

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
          if (!searchTerm || searchTerm === "") {
            setUsers();
            setNoResultsFound(false);
            return;
          }
      
          setIsLoading(true);
      
          try {
            //take care if you are searching for your own user id
            const usersResult = (searchTerm === chatClient.user.id) ? [] : await searchUsers(chatClient, searchTerm);
            setUsers(usersResult);
      
            // Update noResultsFound based on search results
            if (usersResult.length === 0) {
              console.log("No results found");
              setNoResultsFound(true);
            } else {
              console.log("Results found");
              setNoResultsFound(false);
            }

          } catch (error) {
            console.error("Error in searchUsers:", error);
            setNoResultsFound(true);
          }
      
          setIsLoading(false);
        }, 500);
      
        return () => clearTimeout(delaySearch);
      }, [searchTerm]);


      const startFadeInAnimation = () => {
        Animated.timing(fadeInAnimation, {
          toValue: 1,
          duration: 350, // Adjust the duration as needed
          useNativeDriver: true,
        }).start();
      };

      const getSelectedUserIds = () => {
        const userIds = Object.keys(selectedUsers);
        return userIds.join(', ');
      };

    const userPressed  = (userId, userImage) => {

        if (isGroupChat) {
            // Create a new object from selectedUsers
            let newSelectedUsers = { ...selectedUsers };

            if (userId in newSelectedUsers) {
                // Remove the userImage if it's already in selectedUsers
                delete newSelectedUsers[userId];
            } else {
                // Add the userImage and userId to selectedUsers
                newSelectedUsers[userId] = userImage;
            }

            setSelectedUsers(newSelectedUsers);
            setText("")
            startFadeInAnimation();
            console.log(newSelectedUsers, 'newSelectedUsers after adding')
        }
        else {
            console.log("send invitation individual chat")

            const userChats = chatClient.user.userChats
            console.log(userChats, 'userChats in new chat screen')
            if (userChats && userChats.includes(userId)) {
                console.log("chat exists")
                setChatExists(true)
              } else {
                console.log("chat does not exist")
                inviteDirectMessage(chatClient.user.id, chatClient, userId, "Join my chat")
                navigation.navigate('Home');
              }
            

        }
    }
    
  return (
            <View 
                style={{...styles.container, 
                backgroundColor: showAddAlert ? 'rgba(0,0,0,0.7)' : '#0E1528',
                }}
            >

                {
                isGroupChat && Object.keys(selectedUsers).length > 0  &&
                    <Animated.View style={[styles.selectedUsersContainer, { opacity: fadeInAnimation }]}>
                        <FlatList
                            style={styles.selectedUsersList}
                            data={Object.entries(selectedUsers)}
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
                    </Animated.View>
                }


        <View style={styles.searchContainer}>
            <FontAwesome name="search" size={15} color={colors.lightGrey} />
            <TextInput
                placeholder='Search'
                placeholderTextColor='grey'
                autoCapitalize="none"
                style={styles.searchBox}
                onChangeText={(txt) => setText(txt)}
                value={text} 
            />
        </View>


        <TouchableOpacity style={styles.button} onPress={() => setSearchTerm(text)}>
            <Text style={styles.text}>Search username</Text>
        </TouchableOpacity>


        {
            isLoading && 
            <View style={styles.center}>
                <ActivityIndicator size={'large'} color={'grey'} />
            </View>
        }

        {
            !isLoading && !noResultsFound && users &&
            <FlatList
                data={users}
                renderItem={(itemData) => {
                    const userData = itemData.item;
                    const userImage = userData.image;
                    const userId = userData.id;


                    return <DataItem
                                title={userData.name}
                                subTitle={userId}
                                image={userImage}
                                onPress={() => userPressed(userId, userImage)}
                                type={isGroupChat ? "checkbox" : ""}
                                isChecked={userId in selectedUsers}
                            />
                }}
            />
        }


        {
            !isLoading && noResultsFound && (
                
                //this is not rendering

                <View style={styles.center}>
                    <FontAwesome
                        name="question"
                        size={55}
                        color={'grey'}
                        style={styles.noResultsIcon}/>
                    <Text style={styles.noResultsText}>No users found!</Text>
                </View>
            )
        }

        {
            !isLoading && !users && (
                <View style={styles.center}>
                    <FontAwesome
                        name="users"
                        size={55}
                        color={'grey'}
                        style={styles.noResultsIcon}/>
                    <Text style={styles.noResultsText}>Enter a username to find and invite a user!</Text>
                </View>
            )
        }

        {
            !isLoading && chatExists && (
                <View style={styles.center}>
                    <FontAwesome
                        name="exclamation"
                        size={55}
                        color={'grey'}
                        style={styles.noResultsIcon}/>
                    <Text style={styles.noResultsText}>You have already a chat with this user</Text>
                </View>
            )
        }

        {!isNewChat && 
            <BottomAlert
            visible={showAddAlert}
            description={`Add ${getSelectedUserIds()} to ${channel.data.name} group?`}
            actions={[
                {
                text: 'Cancel',
                onPress: () => setShowAddAlert(false),
                },
                {
                text: 'Add',
                onPress: async () => {
                    setShowAddAlert(false)
                    await channel.addMembers(Object.keys(selectedUsers));
                    navigation.navigate('Info', { channel: channel})
                },
                },
            ]}
            />
        }
        </View>
  )
}

export default NewChatScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        paddingTop: 10
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.extraLightGrey,
        height: 35,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5
    },
    searchBox: {
        fontSize: 15,
        marginLeft: 5,
        width: '100%',
        height: 45, 
    },
    button: {
        backgroundColor: '#3777f0',
        paddingVertical: 5,
        borderRadius: 5,
        marginVertical: 10,
        height: 35,
        justifyContent: 'center'
      },
      text: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
      },
    noResultsIcon: {
        marginBottom: 20
    },
    noResultsText: {
        color: colors.textColor,
        //fontFamily: 'regular',
        letterSpacing: 0.3
    },
    chatNameContainer: {
        paddingVertical: 10
    },
    inputContainer: {
        width: '100%',
        paddingHorizontal: 10,
        paddingVertical: 15,
        backgroundColor: colors.nearlyWhite,
        flexDirection: 'row',
        borderRadius: 2
    },
    textbox: {
        color: colors.textColor,
        width: '100%',
        //fontFamily: 'regular',
        letterSpacing: 0.3
    },
    selectedUsersContainer: {
        height: 70,
        justifyContent: 'center',
    },
    selectedUsersList: {
        height: '100%',
        paddingTop: 10
    },
    selectedUserStyle: {
        marginRight: 10,
        marginBottom: 10
    }
})