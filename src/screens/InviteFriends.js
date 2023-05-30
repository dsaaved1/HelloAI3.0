import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert} from 'react-native';
import {colors} from '../theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { chatClient } from '../client';
import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 7 });

const InviteFriends = props => {
    const [inputText, setInputText] = useState('');
    const [inviteUsed, setInviteUsed] = useState(chatClient?.user?.inviteUsed);

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
                    Invite Friends
                </Text>
                </View>
            ),
            headerTintColor: '#3777f0',
        })
    }, []); 

    async function updateOwnUserInvitation(){

    }

    async function updateOtherUserQuestions(code) {
        try {
         
          //const userResponse = await chatClient.queryUsers({ username:  { $eq: code } });
          const userResponse = await chatClient.queryUsers({ id: { $eq: code}  });
      
          console.log(userResponse, 'userResponse')
          if (userResponse.users.length > 0) {
            // Get the user object
            const user = userResponse.users[0];
      
            // Update the user object with the new property value
            const updateOtherUser = {
                id: user.id,
                set: {
                    questionsLeft: user.questionsLeft + 5,
                    friendsInvited: user.friendsInvited + 1,
                },
              };
             
            await chatClient.partialUpdateUser(updateOtherUser);

            console.log(`User wilis`);
            setInviteUsed(true)

            const updateOwnUser = {
                id: chatClient?.user?.id,
                set: {
                    inviteUsed: true,
                },
              };
             
            await chatClient.partialUpdateUser(updateOwnUser);

          } else {
            Alert.alert('Error: Code does not exist or has already been used.');
          }
        } catch (error) {
            Alert.alert('Code does not exist or has already been used.');
        }
      }

    return (
        <View style={styles.container}>

            {!inviteUsed &&
            <>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>Inviter's Code</Text>
                    <TouchableOpacity 
                        //onPress={updateOtherUserQuestions}
                        style={styles.icon}>
                        <Ionicons
                        name="information-circle-sharp"
                        size={22}
                        color={colors.dark.secondaryLight}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{...styles.box, marginBottom: 50}}>
                    <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => setInputText(text)}
                        value={inputText}
                        //placeholder="CODE (e.g. SfdZvF3)"
                        placeholder="CODE (e.g. johndoe123)"
                        placeholderTextColor={colors.dark.text}
                        onSubmitEditing={() => updateOtherUserQuestions(inputText)}
                        autoCapitalize="none" 
                    />
                </View>
             </>
            }               
    
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Your code</Text>
            <TouchableOpacity 
                //onPress={() => console.log(uid())}
                style={styles.icon}>
                <Ionicons
                
                name="information-circle-sharp"
                size={22}
                color={colors.dark.secondaryLight}
                />
            </TouchableOpacity>
          </View>
          <View style={styles.box}>
            <Text style={styles.textBoxContent}>{chatClient?.user?.id}</Text>
            {/* <Text style={styles.textBoxContent}>{chatClient?.user?.username}</Text> */}
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
      },
      titleContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#3777f0',
      },
      icon: {
        position: 'absolute',
        right: 0,
      },
      box: {
        backgroundColor: colors.dark.secondary,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 5,
        marginBottom: 40,
        alignItems: 'center',
      },
      textInput: {
        fontSize: 22,
        color: colors.dark.text,
        padding: 0,
        textAlign: 'center',
      },
      textBoxContent: {
        fontSize: 22,
        color: colors.dark.text,
      },
    });
    

export default InviteFriends;