import { useState, useCallback, useEffect, useMemo, useRef} from 'react';
import {View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Pressable, SafeAreaView, TextInput, FlatList} from 'react-native';
import {ChannelList} from 'stream-chat-react-native';
import {chatClient} from '../client'
import ConvoPreview from '../components/channel-list/ConvoPreview';
import ChannelListHeader from '../components/channel-list/ChannelListHeader';
import CustomEmpty from '../components/CustomEmpty';
import {colors} from '../theme'
import { ScreenHeader } from '../components/ScreenHeader';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { useAppContext} from '../App'
import { useFocusEffect } from '@react-navigation/native';
import ChannelPreview from '../components/channel-list/ChannelPreview'



const Convos = ({route}) => {
  const {setChannel} = useAppContext()
  const { channelId: routeChannelId } = route?.params ||  chatClient.user.ownChatId || {};
  const [channelId, setChannelId] = useState(routeChannelId);
  const {channel: routeChannel } = route?.params || {};
  const [channel, setChannelConvo] = useState(routeChannel);
  const [isLoading, setIsLoading] = useState(true);

 //const navigation = useNavigation();

  // const [channels, setChannels] = useState([]);


  // const channelsRef = useRef(channels);
  // useEffect(() => {
  //   channelsRef.current = channels;
  // }, [channels]);


  const createPersonalChannel = async () => {
    try {
      setIsLoading(true); 
      console.log( "chat client user")
      const user = chatClient.user;
      const newChannel = chatClient.channel('messaging',uuid.v4(), {
        members: [user.id],
        name: 'Me, myself, and AI',
      });
  
      await newChannel.create();
      await newChannel.watch();

      setChannel(newChannel)
      setChannelConvo(newChannel)

      const update = {
        id: user.id,
        set: {
            ownChatId: newChannel.id,
          
        },
    };
    // response will contain user object with updated users info
    await chatClient.partialUpdateUser(update);
  
      setChannelId(newChannel.id);
      setIsLoading(false); 
    } catch (error) {
      console.error('Error creating personal channel:', error);
    }
  };

  const getChannelById = async (id) => {
    try {
      console.log("inside get channel by id")
      setIsLoading(true); 
      const channel = chatClient.channel('messaging', id);
      await channel.watch();
      setChannel(channel);
      setChannelConvo(channel);
      setIsLoading(false); 
    } catch (error) {
      console.error('Error getting channel by id:', error);
    }
  };

  // const fetchChannels = async () => {
  //   try {
  //     const channels = await chatClient.queryChannels(filters, sort, {
  //       watch: true,
  //       state: true,
  //     });
  //     setChannels(channels);
     
  
  //     const updateChannels = () => {
  //       fetchChannels();
  //     };

  //     channels.forEach(channel => {
  //       channel.on('message.new', updateChannels);
  //       channel.on('message.read', updateChannels);
  //       channel.on('message.updated', updateChannels);
  //       channel.on('member.removed', updateChannels);
  //       channel.on('member.updated', updateChannels);
  //       channel.on('message.deleted', updateChannels);
  //       channel.on('member.added', updateChannels);
  //       channel.on('channel.updated', updateChannels);
  //       channel.on('channel.deleted', updateChannels);
  //       channel.on('notification.added_to_channel', updateChannels);
  //       channel.on('notification.channel_deleted', updateChannels);
  //       channel.on('notification.channel_mutes_updated', updateChannels);
  //       channel.on('notification.channel_truncated', updateChannels);
  //       channel.on('notification.mark_read', updateChannels);
  //       channel.on('notification.message_new', updateChannels);
  //       channel.on('notification.mutes_updated', updateChannels);
  //       channel.on('notification.removed_from_channel', updateChannels);
  //     });

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    console.log("before if statement in use effect")
    if (!channelId &&  chatClient.user.ownChatId === undefined) {
      console.log("before create personal channel")
      createPersonalChannel();
    } 
    if (!channel && chatClient.user.ownChatId) {
      console.log("before get channel by id")
      setChannelId(chatClient.user.ownChatId)
      getChannelById(chatClient.user.ownChatId);
    }
  }, []);


  useEffect(() => {
   console.log("before if statement in use effect 2")
    const { channelId: newChannelId, channel: newChannel } = route?.params || {};
    if (newChannelId && newChannelId !== channelId) {
     console.log("before set channel id in use effect 2")
      setChannelId(newChannelId);
    }
    if (newChannel && newChannel !== channel) {
   console.log("before set channel convo in use effect 2")
      setChannelConvo(newChannel);
    }else if (!newChannel && newChannelId && channelId !== newChannelId) {
      console.log("before get channel by id in use effect 2")
      getChannelById(newChannelId);
    }

    //fetchChannels();
    
  }, [route?.params]);

  // useEffect(() => {
  
  // // Clean up event listeners on unmount
  // return () => {
  //   channelsRef.current.forEach(channel => {
  //     const eventTypes = [
  //       'message.new',
  //       'message.read',
  //       'message.updated',
  //       'member.removed',
  //       'member.updated',
  //       'message.deleted',
  //       'member.added',
  //       'channel.updated',
  //       'channel.deleted',
  //       'notification.added_to_channel',
  //       'notification.channel_deleted',
  //       'notification.channel_mutes_updated',
  //       'notification.channel_truncated',
  //       'notification.mark_read',
  //       'notification.message_new',
  //       'notification.mutes_updated',
  //       'notification.removed_from_channel',
  //     ];

  //     eventTypes.forEach(eventType => {
  //       channel.off(eventType);
  //     });
  //   });
  // };
  // }, []);





  // useFocusEffect(
  //   useCallback(() => {
  //     console.log("here in focus effect of convos");
  //     fetchChannels();
  //     console.log(channels.length, "channels length")
      
  //     // Clean up event listeners on unmount
  //   return () => {
  //     channelsRef.current.forEach(channel => {
  //       const eventTypes = [
  //         'message.new',
  //         'message.read',
  //         'message.updated',
  //         'member.removed',
  //         'member.updated',
  //         'message.deleted',
  //         'member.added',
  //         'channel.updated',
  //         'channel.deleted',
  //         'notification.added_to_channel',
  //         'notification.channel_deleted',
  //         'notification.channel_mutes_updated',
  //         'notification.channel_truncated',
  //         'notification.mark_read',
  //         'notification.message_new',
  //         'notification.mutes_updated',
  //         'notification.removed_from_channel',
  //         'typing.start',
  //         'typing.stop',
  //         'user.deleted',
  //         'user.presence.changed',
  //         'user.watching.start',
  //         'user.watching.stop',
  //       ];

  //       eventTypes.forEach(eventType => {
  //         channel.off(eventType);
  //       });
  //     });
  //   };
  //   }, [navigation, channelId])
  // );



  // const getLatestMessagePreview = (channel) => {
  //   const latestMessage = channel.state.messages[channel.state.messages.length - 1];
  //   return latestMessage
  //   ? {
  //       created_at: latestMessage.created_at,
  //       deleted_at: "", // You can adjust this as needed
  //       userId: latestMessage.user.id,
  //       messageObject: latestMessage,
  //       previews: [
  //         { bold: false, text: "You: " },
  //         { bold: false, text: latestMessage.text },
  //       ],
  //       status: latestMessage.status  === "received" ? 2: 1,
  //     }
  //   : null;
  // };
  
  const filters = { 
    type: 'messaging', 
    members: { $in: [chatClient?.user?.id] }, 
    chatId: channelId, 
    typeChat: { $eq: 'convo'}
  };
  const sort = { last_message_at: -1 };

  const customEventChannel = async (setChannels, event) => {
    const eventChannel = event.channel;
    // Check if the current user is a member of the channel
    const isCurrentUserMember = eventChannel?.state?.members?.[chatClient?.user?.id];
    console.log((!isCurrentUserMember), "isCurrentUserMember")
    console.log((eventChannel.typeChat !== 'convo'), "eventChannel.typeChat")
    console.log((eventChannel.chatId !== channelId), "eventChannel.chatId")
    console.log(!eventChannel?.id, "eventChannel?.id")
    //they all should be false so that they are true to filters so that it adds to channels
    if (!eventChannel?.id || (eventChannel.chatId !== channelId || eventChannel.typeChat !== 'convo' 
    //if we don't use then for some reason why have duplicated channels
    || !isCurrentUserMember
    )){
      console.log("returning")
      return;
    }
  
    console.log(chatClient?.user?.id, "chatClient.user?.id")
  
    try {
      console.log("before new channel")
      const newChannel = chatClient.channel(eventChannel.type, eventChannel.id);
      console.log("after new channel")
      await newChannel.watch();
      setChannels(channels => [newChannel, ...channels]);
      console.log("after set channels")
    } catch (error) {
      console.log(error);
    }
  };
 
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.dark.secondary}}>
      {isLoading ? (
         <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size="large" color={colors.dark.secondaryLight} />
          </View>
      ) : (
        <>
          <ChannelListHeader channel={channel} channelId={channelId} />
       
       {/* <FlatList
          data={channels}
          keyExtractor={(item) => item.cid}
          renderItem={({ item }) => (
            <ConvoPreview channel={item} getLatestMessagePreview={getLatestMessagePreview}/>
          )}
        /> */}
        <ChannelList
            //key={refreshList}
            Preview={ConvoPreview}
            filters={filters}
            sort={sort}
            EmptyStateIndicator={CustomEmpty}

            //in order to show the channel plus instantly requires more work as the listener
            //is update instantly and I'm not a member yet on the new channel
            //same happens when we leave a channel. it triggers the listener but we are still a member
            onAddedToChannel={customEventChannel}

            //this takes care of updating name channel correctly
            onChannelUpdated={customEventChannel}

            //these ones are not triggered for some reason
            onRemovedFromChannel={customEventChannel}
            onNewMessageNotification={customEventChannel}

            //onChannelVisible={customEventChannel}
            //delete channel not leave channel
            //onChannelDeleted={customEventChannel}
            //onChannelTruncated={customEventChannel}
            //onChannelHidden={customEventChannel}
            //onNewMessage={customEventChannel}
        />
         </>
        )}
    </SafeAreaView>
  );
};

export default Convos;

const styles = StyleSheet.create({
 
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
})