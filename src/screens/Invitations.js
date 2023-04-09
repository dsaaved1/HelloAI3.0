import { View, Text, StyleSheet } from 'react-native'
import { ScreenHeader } from '../components/ScreenHeader'
import {ChannelList} from 'stream-chat-react-native'
import InvitationPreview from '../components/channel-list/InvitationPreview'
import {colors} from '../theme'
import { useAuthContext } from '../contexts/AuthContext'
//this and something else was causing all the errors!!
import {user, chatClient} from '../client'
import CustomEmpty from '../components/CustomEmpty';
import { useState, useCallback, useEffect, useMemo } from 'react';


const pendingInvitations = {
  members: { $in: [user.id] },
  type: 'messaging',
  invite: 'pending',
  typeChat: { $eq: 'chat'}
};


const sort = { last_message_at: -1 };

const Invitations = () => {
  // const [refreshList, setRefreshList] = useState(false);

  // const handleChannelUpdate = useCallback((e) => {
  //   // Check if the updated channel has typeChat == 'pending'
  //   if (e.channel.data.invite === 'pending') {
  //     setRefreshList((prev) => !prev);
  //   }
  // }, []);
  
  // useEffect(() => {
  //   chatClient.on('channel.updated', handleChannelUpdate);
  //   return () => {
  //     chatClient.off('channel.updated', handleChannelUpdate);
  //   };
  // }, [handleChannelUpdate]);
  

  return (
    <View style={{flex: 1}}>
        <ScreenHeader title='Invitations' />
      
        {/* <View style={{alignItems:'center'}}>
          <Text style={styles.title}>Pending</Text>
        </View> */}
        <ChannelList 
            //key={refreshList}
            Preview={InvitationPreview} 
            filters={pendingInvitations} 
            sort={sort}  
            EmptyStateIndicator={CustomEmpty}
        />

    </View>
  )
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: colors.dark.secondaryLight,
  },
});

export default Invitations