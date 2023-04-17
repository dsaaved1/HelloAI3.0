import { View, Text, StyleSheet,  FlatList } from 'react-native'
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ScreenHeader } from '../components/ScreenHeader'
import {ChannelList} from 'stream-chat-react-native'
import InvitationPreview from '../components/channel-list/InvitationPreview'
//this and something else was causing all the errors!!
import {chatClient} from '../client'
import CustomEmpty from '../components/CustomEmpty';
import { useFocusEffect } from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native'
import { useRef } from 'react'; 

// const pendingInvitations = {
//   members: { $in: [chatClient?.user?.id] },
//   type: 'messaging',
//  invite: 'pending',
// };
const sort = { last_message_at: -1 };
const Invitations = () => {
  const navigation = useNavigation();

  // const customOnNewMessage = async (setChannels, event) => {
  //   const eventChannel = event.channel;

  //   // If the channel is frozen, then don't add it to the list.
  //   if (!eventChannel?.id || !eventChannel.frozen){
  //     console.log("here in new notification2")
  //     return;
  //   }
  
  //   try {
  //     const newChannel = client.channel(eventChannel.type, eventChannel.id);
  //     await newChannel.watch();
  //     setChannels(channels => [newChannel, ...channels]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  // const customOnNewMessageNotification = async (setChannels, event) => {
  //   const eventChannel = event.channel;

  //   if (!eventChannel?.id || !eventChannel.frozen){
  //     console.log("here in new notification")
  //     return;
  //   }
  
  //   try {
  //     const newChannel = client.channel(eventChannel.type, eventChannel.id);
  //     await newChannel.watch();
  //     setChannels(channels => [newChannel, ...channels]);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const userId = chatClient?.user?.id;

  const pendingInvitations = useMemo(() => ({
    members: { $in: userId ? [userId] : [] },
    type: 'messaging',
    invite: 'pending',
  }), [userId]);

  const [channels, setChannels] = useState([]);

  const fetchChannels = async () => {
    try {
      const channels = await chatClient.queryChannels(pendingInvitations, sort, {
        watch: true,
        state: true,
      });
      setChannels(channels);
      // Subscribe to channel events to update the list of channels when a new channel is added or removed
    channels.forEach(channel => {
      channel.on('notification.invite_accepted', () => fetchChannels());
      channel.on('notification.invite_rejected', () => fetchChannels());
      channel.on('notification.invited', () => fetchChannels());
    });
    } catch (error) {
      console.log(error);
    }
  };
  
  const channelsRef = useRef(channels);
  useEffect(() => {
    channelsRef.current = channels;
  }, [channels]);

  useFocusEffect(
    useCallback(() => {
      console.log("here in use effect of invitations");
      fetchChannels();

      // Clean up event listeners on unmount
      return () => {
        channelsRef.current.forEach(channel => {
          channel.off('notification.invite_accepted');
          channel.off('notification.invite_rejected');
          channel.off('notification.invited');
        });
      };
    }, [navigation])
  );

  return (
    <View style={{flex: 1}}>
        <ScreenHeader title='Invitations' />

        <FlatList
          data={channels}
          keyExtractor={(item) => item.cid}
          renderItem={({ item }) => (
            <InvitationPreview channel={item} />
          )}
        />

 
        {/* <ChannelList 
            Preview={InvitationPreview} 
            filters={pendingInvitations} 
            sort={sort}  
            EmptyStateIndicator={CustomEmpty}
            //OnNewMessage={customOnNewMessage}
            // onNewMessageNotification={customOnNewMessageNotification}
        /> */}

    </View>
  )
}

export default Invitations