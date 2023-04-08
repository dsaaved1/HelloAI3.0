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


const NewChatScreen = props => {
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(false);
    const [chatExists, setChatExists] = useState(false);
    const [users, setUsers] = useState();
    const [noResultsFound, setNoResultsFound] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUsers, setSelectedUsers] = useState({});
    const [text, setText] = useState("")

    const selectedUsersFlatList = useRef();

    const existingUsers = props.route.params && props.route.params.existingUsers;
    const isGroupChat = props.route.params && props.route.params.isGroupChat;

    const isGroupChatDisabled = Object.keys(selectedUsers).length === 0
    const isNewChat = true
   
    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: () => (
                <View style={{ alignItems: 'center', margin: 5 }}>
                  <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
                     {isGroupChat ? "Add participants" : "New chat"}
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
                        title="Close"
                        color='#3777f0'
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
                                navigation.navigate(ROOT_STACK.NEW_GROUP_NAME, { selectedUsers: selectedUsers});
                            }}/>
                    }
                </HeaderButtons>
            },
        })
    }, [selectedUsers]);

    useEffect(() => {
        const delaySearch = setTimeout(async () => {
          if (!searchTerm || searchTerm === "") {
            setUsers();
            setNoResultsFound(false);
            return;
          }
      
          setIsLoading(true);
      
          try {
            const usersResult = await searchUsers(chatClient, searchTerm);
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


    const userPressed  = (userId, userImage) => {

        if (isGroupChat) {
            // Create a new object from selectedUsers
            let newSelectedUsers = { ...selectedUsers };

            if (userImage in newSelectedUsers) {
                // Remove the userImage if it's already in selectedUsers
                delete newSelectedUsers[userImage];
            } else {
                // Add the userImage and userId to selectedUsers
                newSelectedUsers[userImage] = userId;
            }

            setSelectedUsers(newSelectedUsers);
            setText("")

            console.log(newSelectedUsers, 'newSelectedUsers after adding')
        }
        else {
            console.log("send invitation individual chat")

            const userChats = chatClient.user.userChats
            if (userChats && userChats.includes(userId)) {
                setChatExists(true)
              } else {
                inviteDirectMessage(chatClient.user.id, chatClient, userId, "Join my chat")
                navigation.navigate('invitations');
              }
            

        }
    }
    
  return (
            <View style={styles.container}>

                    
                {
                isGroupChat &&
                <View style={styles.selectedUsersContainer}>
                    <FlatList
                        style={styles.selectedUsersList}
                        data={Object.keys(selectedUsers)}
                        horizontal={true}
                        keyExtractor={item => item}
                        contentContainerStyle={{ alignItems: 'center' }}
                        ref={ref => selectedUsersFlatList.current = ref}
                        onContentSizeChange={() => selectedUsersFlatList.current.scrollToEnd()}
                        renderItem={itemData => {
                            const userImage = itemData.item;
                            const userId = selectedUsers[userImage];
                            //get also connect user image
                            return <ProfileImage
                                        style={styles.selectedUserStyle}
                                        size={40}
                                        uri={userImage}
                                        onPress={() => userPressed(userId, userImage)}
                                        showRemoveButton={true}
                                    />
                        }}
                    />
                </View>
            }


        <View style={styles.searchContainer}>
            {/* <FontAwesome name="search" size={15} color={'grey'} /> */}
            <IconButton
        width={15}
          iconName={'MagnifyingGlass'}
          //pathFill={colors.dark.secondaryLight}
        /> 
            <TextInput
                placeholder='Search'
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

                    if (existingUsers && existingUsers.includes(userImage)) {
                        return;
                    }

                    return <DataItem
                                title={userData.name}
                                //subTitle={`${userData.firstName} ${userData.lastName}`}
                                image={userImage}
                                onPress={() => userPressed(userId, userImage)}
                                type={isGroupChat ? "checkbox" : ""}
                                isChecked={userImage in selectedUsers}
                            />
                }}
            />
        }


        {
            !isLoading && noResultsFound && (
                
                //this is not rendering

                <View style={styles.center}>
                    {/* <FontAwesome
                        name="question"
                        size={55}
                        color={'grey'}
                        style={styles.noResultsIcon}/> */}
                    <Text style={styles.noResultsText}>No users found!</Text>
                </View>
            )
        }

        {
            !isLoading && !users && (
                <View style={styles.center}>
                    {/* <FontAwesome
                        name="users"
                        size={55}
                        color={'grey'}
                        style={styles.noResultsIcon}/> */}
                    <Text style={styles.noResultsText}>Enter a name to search for a user!</Text>
                </View>
            )
        }

        {
            !isLoading && chatExists && (
                <View style={styles.center}>
                    {/* <FontAwesome
                        name="users"
                        size={55}
                        color={'grey'}
                        style={styles.noResultsIcon}/> */}
                    <Text style={styles.noResultsText}>You have already a chat with this user</Text>
                </View>
            )
        }

        </View>
  )
}

export default NewChatScreen

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        flex: 1,
        backgroundColor: '#0E1528',
        paddingTop: 10
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.extraLightGrey,
        height: 30,
        marginVertical: 8,
        paddingHorizontal: 8,
        paddingVertical: 5,
        borderRadius: 5
    },
    searchBox: {
        marginLeft: 8,
        fontSize: 15,
        width: '100%'
    },
    button: {
        backgroundColor: '#3777f0',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: 10
      },
      text: {
        color: '#FFFFFF',
        fontSize: 18,
        //fontWeight: 'bold',
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
        height: 50,
        justifyContent: 'center'
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