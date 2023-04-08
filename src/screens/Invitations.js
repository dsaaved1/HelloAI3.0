import { View, Text, StyleSheet } from 'react-native'
import { ScreenHeader } from '../components/ScreenHeader'
import {ChannelList} from 'stream-chat-react-native'
import InvitationPreview from '../components/channel-list/InvitationPreview'
import {colors} from '../theme'
import { useAuthContext } from '../contexts/AuthContext'
//this and something else was causing all the errors!!
import {user} from '../client'
import CustomEmpty from '../components/CustomEmpty';
import React, { useEffect, useState, useCallback} from 'react';


const pendingInvitations = {
  members: { $in: [user.id] },
  type: 'messaging',
  invite: 'pending',
  typeChat: { $eq: 'chat'}
};

const acceptedInvitations = {
  members: { $in: [user.id] },
  type: 'messaging',
  invite: 'accepted',
  typeChat: { $eq: 'chat'}
};

const rejectedInvitations = {
  members: { $in: [user.id] },
  type: 'messaging',
  invite: 'rejected',
  typeChat: { $eq: 'chat'}
};

const sort = { last_message_at: -1 };

const Invitations = () => {

  return (
    <View style={{flex: 1}}>
        <ScreenHeader title='Invitations' />
      
        {/* <View style={{alignItems:'center'}}>
          <Text style={styles.title}>Pending</Text>
        </View> */}
        <ChannelList Preview={InvitationPreview} filters={pendingInvitations} sort={sort}  EmptyStateIndicator={CustomEmpty}/>

        {/* <Text style={styles.title}>Accepted Invitations</Text>
        <ChannelList Preview={InvitationPreview} filters={acceptedInvitations} sort={sort} EmptyStateIndicator={CustomEmpty}/>

        <Text style={styles.title}>Rejected Invitations</Text>
        <ChannelList Preview={InvitationPreview} filters={rejectedInvitations} sort={sort} EmptyStateIndicator={CustomEmpty}/> */}
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