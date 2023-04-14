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
import MenuItem from '../components/MenuItem';
import MenuWrapper from '../components/MenuWrapper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesoem5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UIDivider from '../components/UIDivider';
import {colors} from '../theme'
import { chatClient, user} from '../client'
import { SCText } from '../components/SCText';
import userImage from '../images/userImage.jpeg'
import BottomAlert from '../components/BottomAlert';
import { Auth } from "aws-amplify";


const Account = props => {
    const [name, setName] = useState(chatClient.user.name);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);
    const source = chatClient.user.image? { uri: chatClient.user.image } : userImage

    const logout = () => {
        chatClient.disconnectUser();
        Auth.signOut();
      };

    const updateName = async (newName) => {
        try {
            console.log("here account")
          await chatClient.updateUser(
            {
              set: {
                id: chatClient.user.id,
                name: newName,
              },
            },
            chatClient.user.id
          );
          setName(newName);
        } catch (error) {
          console.error('Error updating user name:', error);
        }
      };
    

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
                    Account
                </Text>
                </View>
            ),
            headerTintColor: '#3777f0',
        })
    }, []); 


    return (
        <View style={{flex:1}}>
     
            <View style={styles.row}>
                <TouchableOpacity style={styles.imageContainer}>
                    <Image
                    source={source}
                    style={styles.userImage}
                    />
                    <MaterialIcons
                    name="edit"
                    size={20}
                    color={colors.dark.secondary}
                    style={styles.editIconInImage}
                    />
                </TouchableOpacity>
                
                <View style={styles.userDetails}>
                    <View style={styles.userNameContainer}>
                    <TextInput
                        style={styles.userName}
                        value={name}
                        onChangeText={(text) => setName(text)}
                        onSubmitEditing={() => updateName(name)}
                        />
                    <MaterialIcons
                        name="edit"
                        size={20}
                        color="#FFF"
                        style={styles.editIcon}
                    />
                    </View>
                    <SCText style={styles.userID}>{chatClient.user.id}</SCText>
                </View>
             </View>
     
             <MenuWrapper>
  <MenuItem
    icon={
      <MaterialCommunityIcons
        name="logout"
        size={18}
        color="#3777f0" 
        onPress={logout}
      />
    }
    mainText="Log Out"
  />
  <UIDivider forMenu={true} />

  <MenuItem
    icon={
      <FontAwesome
        name="trash-o"
        size={18}
        color="#D94444" // Choose a color for delete account
      />
    }
    color='#D94444'
    mainText="Delete Account"
    onPress={() => {
      setShowDeleteAccount(true);
    }}
  />
</MenuWrapper>

             <BottomAlert
                visible={showDeleteAccount}
                destructiveButtonIndex={1}
                description={`Are you sure you want to delete your account? This action will permanently delete your user profile, remove you from all channels, and delete all messages you have sent. This action cannot be undone.`}
                actions={[
                    {
                    text: 'Cancel',
                    onPress: () => setShowDeleteAccount(false),
                    },
                    {
                    text: 'Delete User',
                    onPress: () => {
                        setShowDeleteAccount(false);
                        setShowDeleteUser(true);
                    },
                    },
                ]}
                />

                <BottomAlert
                visible={showDeleteUser}
                destructiveButtonIndex={1}
                description={`This is your last chance to cancel the account deletion process. Once your account is deleted, all your data will be lost, and this action cannot be undone. Are you sure you want to proceed?`}
                actions={[
                    {
                    text: 'Cancel',
                    onPress: () => setShowDeleteUser(false),
                    },
                    {
                    text: 'Delete',
                    onPress: async () => {
                        // code to delete the user account
                    },
                    },
                ]}
                />

            </View>
  )
}

export default Account

const styles = StyleSheet.create({
    actionItemContainer: {
      alignItems: 'center',
      flexDirection: 'row',
      height: 50,
    },
    actionItemSection: {},
    container: {
      flex: 1,
      padding: 20,
    },
    row: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30
    },
    userID: {
      fontSize: 16,
      fontWeight: '400',
      alignItems: 'center',
    },
    userName: {
      alignItems: 'center',
      fontSize: 26,
      fontWeight: 'bold',
      color: 'white'
    },
    userDetails: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%'
    },
    userImage: {
      borderRadius: 10,
      height: 100,
      width: 90,
    },
    logout: {
      color: "white",
      fontWeight: "bold",
      margin: 10,
      textAlign: "center",
    },
    imageContainer: {
        position: 'relative',
      },
      editIconInImage: {
        position: 'absolute',
        bottom: 0,
        right: 0,
      },
      userNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        margin: 8,
        //backgroundColor: 'grey',
      },
      editIcon: {
        marginLeft: 8,
      },
  });

  