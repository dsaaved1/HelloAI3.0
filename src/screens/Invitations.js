import { View, Text, StyleSheet } from 'react-native'
import { ScreenHeader } from '../components/ScreenHeader'
import {ChannelList} from 'stream-chat-react-native'
import InvitationPreview from '../components/channel-list/InvitationPreview'
//this and something else was causing all the errors!!
import {user, chatClient} from '../client'
import CustomEmpty from '../components/CustomEmpty';

const pendingInvitations = {
  members: { $in: [user.id] },
  frozen: true,
  // type: 'messaging',
  // invite: 'pending',
  // typeChat: { $eq: 'chat'},
};
const sort = { last_message_at: -1 };
const Invitations = () => {

  const customOnNewMessage = async (setChannels, event) => {
    const eventChannel = event.channel;

    // If the channel is frozen, then don't add it to the list.
    if (!eventChannel?.id || !eventChannel.frozen){
      console.log("here in new notification2")
      return;
    }
  
    try {
      const newChannel = client.channel(eventChannel.type, eventChannel.id);
      await newChannel.watch();
      setChannels(channels => [newChannel, ...channels]);
    } catch (error) {
      console.log(error);
    }
  };
  
  const customOnNewMessageNotification = async (setChannels, event) => {
    const eventChannel = event.channel;

    if (!eventChannel?.id || !eventChannel.frozen){
      console.log("here in new notification")
      return;
    }
  
    try {
      const newChannel = client.channel(eventChannel.type, eventChannel.id);
      await newChannel.watch();
      setChannels(channels => [newChannel, ...channels]);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <View style={{flex: 1}}>
        <ScreenHeader title='Invitations' />
 
        <ChannelList 
            Preview={InvitationPreview} 
            filters={pendingInvitations} 
            sort={sort}  
            EmptyStateIndicator={CustomEmpty}
            onNewMessage={customOnNewMessage}
            onNewMessageNotification={customOnNewMessageNotification}
        />

    </View>
  )
}

export default Invitations