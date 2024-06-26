import {Pressable, StyleSheet, Text, View,
  Modal, TextInput, TouchableOpacity} from 'react-native'
  import React, {useMemo, useState, useEffect} from 'react'
  import {
    ChannelPreviewMessage,
    ChannelPreviewMessengerProps,
    //ChannelPreviewTitle,
    ChannelAvatar,
    ChannelPreviewUnreadCount,
    CheckAll,
    LatestMessagePreview,
    useChannelPreviewDisplayName,
    useTheme,
  } from 'stream-chat-react-native'
  import {StreamChannel, useAppContext} from '../../App'
  import {useNavigation} from '@react-navigation/native'
  import {colors} from '../../theme'
  import {flex, sizes} from '../../global'
  import Muted from '../../icons/Muted'
  import Pinned from '../../icons/Pin'
  import SuperAvatar from '../SuperAvatar'
  import PeekabooView from '../PeekabooView'
  import Mic from '../../icons/Mic'
  import {get} from 'lodash'
  import moment from 'moment'
  import {parseDurationTextToMs} from '../../utils/conversion'
  import {ROOT_STACK} from '../../stacks/RootStack'
  import {StackNavigationProp} from '@react-navigation/stack'
  import {StackNavigatorParamList} from '../../types'
  import IconButton from '../IconButton'
  import { chatClient} from '../../client'
  import { SVGIcon } from '../SVGIcon';
  import { createDirectMessage } from '../../utils/actions/chatActions'
  import {Check} from 'stream-chat-react-native-core/src/icons/index'
  
  const formatDate = (date) => {
      const now = new Date();
      const inputDate = new Date(date);
      const isToday = now.toDateString() === inputDate.toDateString();
      const isYesterday =
        now.getDate() - 1 === inputDate.getDate() &&
        now.getMonth() === inputDate.getMonth() &&
        now.getFullYear() === inputDate.getFullYear();
    
      if (isToday) {
        return inputDate.toLocaleString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        });
      } else if (isYesterday) {
        return 'Yesterday';
      } else {
        return inputDate.toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
      }
    };

  export default InvitationPreview = (props) => {
    const {channel} = props
    const [channels, setChannels] = useState(null)
    const [members, setMembers] = useState(Object.values(channel.state.members))
    const inviter = channel.state.members[chatClient?.user?.id]?.user;
    //we will handle this later
    const status = 'pending';
    //if chat has no name then it takes the name of the other user if member count is 2
    const displayName = useChannelPreviewDisplayName(channel)
    const {
      theme: {
        channelPreview: {date},
        colors: {grey},
      },
    } = useTheme()
    const navigation = useNavigation()

    const isDirectMessage = async () => {
      if (!channel.data.isGroupChat){
          const channelMembers = channel.state.members;
          const userIds = Object.keys(channelMembers);
          await createDirectMessage(chatClient,userIds,displayName);
          
          const userName = chatClient.user.userChats;

          //for now you can have a lot of user direct messages
          console.log(userName, "user name in invitation preview")
          if (userName && userName.length > 0) { // check if userName field exists
            chatClient.updatePartialUser({
              id: chatClient?.user?.id,
              set: {
                userChats: {
                  $push: [userIds] // add only if not already present
                }
              }
            });
          } else {
            chatClient.updatePartialUser({
              id: chatClient?.user?.id,
              set: {
                userChats: [userIds] // create the field and add the first value
              }
            });
          }
   
          //there is a channel with each only one member
          //user chats doesn't work
          //it didn't work
          console.log(channel.cid, "channel cid")
          await channel.delete();
      }
    }

    useEffect(() => {
      fetchConvos();
    }, [])

    async function fetchConvos(){
      //different channel but somehow the length is always the same
      const filters = { 
        type: 'messaging', 
        members: { $in: [chatClient?.user?.id] }, 
        chatId: channel.id, 
        typeChat: { $eq: 'convo'}
      };
      const sort = [{ last_message_at: -1 }];
      const queriedChannels = await chatClient.queryChannels(filters, sort, {});
      const channelsWithCurrent = [...queriedChannels, channel];
      setChannels(channelsWithCurrent);
    }


    const acceptInvitation = async () => { 
      console.log("accept invitiations")
      const targetChannelId = channel?.id;
      
      for (let i = 0; i < channels.length; i++) {
        const channel = channels[i];
        let text;

        if (channel.id === targetChannelId) { 
          // add the member without sending a text
          await channel.acceptInvite()
        } else {
          if (channel.data.hideHistory) {
            //reject and then add member for future update
            console.log("about to remove invitation preview strategy")
            await channel.removeMembers([chatClient?.user?.id])
            console.log("about to add invitation preview strategy")
            await channel.addMembers([chatClient?.user?.id], undefined, {hide_history: true});
            text =  `${chatClient?.user?.id} joined this channel with past chat history hidden.`
          } else {
            console.log("don't accept history invitation preview")
            await channel.acceptInvite()
            text =  `${chatClient?.user?.id} joined this channel!`
          }
         
          const message = {
              text,
              type: 'system'
          };
          await channel.sendMessage(message);
        }
      }
    
      if (channel?.data.isGroupChat){
        navigation.navigate(ROOT_STACK.CONVOS, { channel:channel, channelId: channel.id});
      }
    }
    

    const rejectInvitation = async () => {
      console.log("reject invitiations")
      channel.rejectInvite();

      if (!channel.data.isGroupChat){

          const otherMember = channel?.state?.members
          ? Object.values(channel.state.members).find(
              member => member.user.id !== chatClient?.user?.id
            )
          : null;
          const otherMemberId = otherMember?.user?.id
          const myUserChatsWithoutDeletedMember = chatClient?.user?.userChats.filter(member => member !== otherMemberId);
          
          const response = await chatClient.queryUsers({ id: otherMemberId });
          const theirUserChats = response.users[0]?.userChats;

          const theirUserChatsWithoutDeletedMember = theirUserChats.filter(member => member !== chatClient?.user?.id);

          const updateMy = {
            id: chatClient?.user?.id,
            set: {
              userChats: myUserChatsWithoutDeletedMember,
            },
          };
          
          const updateOther = {
            id: otherMemberId,
            set: {
                userChats: theirUserChatsWithoutDeletedMember,
              
            },
          };
    
          await chatClient.partialUpdateUser(updateMy);
          await chatClient.partialUpdateUser(updateOther);
      }
   
      channels.map( async (channel) => {
        await channel.removeMembers([chatClient?.user?.id]);
      })
    }

    const ChannelPreviewTitleCustom = ({displayName, style }) => {
      return (
        <Text style={[styles.title, style]}>
          {displayName}
        </Text>
      );
    };
  
 
   
 
  
    const membersNames = () => {
      if (channel?.data.isGroupChat) {
        const names = members.map((member) => member.user.name).join(', ');
        const lineLength = 40; // Adjust this to fit the desired line length
        const twoLinesLength = lineLength * 2;
    
        if (names.length > twoLinesLength) {
          return names.slice(0, twoLinesLength) + '...';
        } else {
          return names;
        }
      } else {
        return 'Direct message';
      }
    };
  
    return (
      <View style={{
          ...styles.container,
          //backgroundColor: "#1C2340"
        }}>
       
         <SuperAvatar channel={channel} size={38}/>
          {/* <ChannelAvatar channel={channel} /> */}
          <View style={{flex: 1, marginHorizontal: sizes.l}}>
          <ChannelPreviewTitleCustom displayName={displayName} style={styles.previewTitle} />

            {/* <ChannelPreviewTitle channel={channel} displayName={displayName} /> */}
            {/* return members below too if group chat if not chat a message saying direct message*/}
            <Text style={[styles.date, {color: grey}]}>
              {membersNames()}
            </Text>
            <Text style={[styles.date, {color: grey}, date]}>
               {formatDate(inviter?.created_at)}
              </Text>
          </View>
         


  
          {(status === 'pending' || status === 'accepted') &&
              <TouchableOpacity
                  onPress={acceptInvitation}
              >
                   <View style={styles.checkWrap}>
                      <Check
                          pathFill={colors.dark.background}
                          width={sizes.l}
                          height={sizes.l}
                      />
                      
                  </View>
                  {/* <View style={[styles.circleButton, { backgroundColor: 'green' }]}>
                      <SVGIcon height={20} type={'check'} width={20} />
                  </View> */}
              </TouchableOpacity>
          }

          {(status === 'pending' || status === 'rejected') && 
              <TouchableOpacity
                  onPress={rejectInvitation}>
                      <View style={[styles.circleButton, 
                      { backgroundColor: '#3777f0' }
                        // { backgroundColor: '#D94444' }
                        ]}>
                          <SVGIcon height={7} fill={'black'} type={'close-button'} width={7} />
                      </View>
              </TouchableOpacity>
          }

        </View>
    
    )
  }
  
  
  const styles = StyleSheet.create({
    container: {
      ...flex.directionRow1,
      padding: sizes.l,
      backgroundColor: '#0E1528',
      margin: 0,
    },
    circleButton: {
      width: 23,
      height: 23,
      borderRadius: 25, // Half of the width and height to create a circle
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 12,
      marginTop: 11,
      borderColor: colors.dark.secondary,
      borderWidth: 1,
    },
    date: {
      fontSize: 10,
      marginLeft: 2,
      //textAlign: 'right',
    },
    previewTitle: {
      fontSize: 15, // Adjust this value to the desired font size
      fontWeight: 'bold',
      color: 'white',
    },
    checkWrap: {
      padding: 2,
      borderRadius: 16,
      borderWidth: 2,
      borderColor: colors.dark.highlighted,
      //backgroundColor: colors.dark.primaryLight,
      backgroundColor: '#3777f0',
      marginTop: 10
    },
  })