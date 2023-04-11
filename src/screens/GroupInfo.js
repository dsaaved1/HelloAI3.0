import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../common/colors/index';
import {T16, T24, T18} from '../common/Typography/index';
import Header from '../components/channel/Header';
import MenuWrapper from '../components/MenuWrapper';
import MenuItem from '../components/MenuItem';
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesoem5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Spacer from '../containers/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UIDivider from '../components/UIDivider';
import BottomAlert from '../components/BottomAlert';

import {View, StyleSheet, Text} from 'react-native';
import { chatClient, user} from '../client'
import { SCText } from '../components/SCText';
import userImage from '../images/userImage.jpeg'
import SuperAvatar from '../components/SuperAvatar';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconButton from '../components/IconButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

const GroupInfo = props =>  {
  const navigation = useNavigation();
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [showLeaveAlert, setShowLeaveAlert] = useState(false);
  const [showBlockAlert, setShowBlockAlert] = useState(false);
  const [showMuteAlert, setShowMuteAlert] = useState(false);
  const [showUnmuteAlert, setShowUnmuteAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);
  const [showMemberAlert, setShowMemberAlert] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [participants, setParticpants] = useState(0);
  const [memberAction, setMemberAction] = useState(null)
  const [channels, setChannels] = useState(null)
  
  const [isAnyModalVisible, setIsAnyModalVisible] = useState(false);
  const channel = props.route?.params?.channel || {};
  const source = channel.data.image ?  { uri: channel.data.image } : userImage;
  const [isModerator, setIsModerator] = useState(false)

  async function fetchMembers() {
    const objectMembers = await channel.queryMembers({})
    const participantsCount = objectMembers.members.length;
    const currentUser = objectMembers.members.find(member => member.user.id === user.id);
    const isModerator = currentUser.role === 'moderator' || currentUser.role === 'owner';
    const fetchedContacts = objectMembers.members.map((member, index) => {
      const role = (member.role === 'moderator' || member.role === 'owner')? '(admin)' : '';
      return {
        image: { uri: member.user.image }, // Assuming the user has an 'image' property
        name: `${member.user.name} ${role}`,
        about: member.user.id, // Assuming the user has an 'about' property
        id: index,
      };
    });

    setIsModerator(isModerator)
    setContacts(fetchedContacts);
    setParticpants(participantsCount)
  }

  async function fetchConvos(){
    let filters;
    if (channel.isGroupChat){
      filters = {
        members: { $in: [chatClient.user.id] },
        type: 'messaging',
        member_count: 2,
        //isGroupChat: { $eq: false },
        //typeChat: { $eq: 'chat'},
        temporary: { $exists: false }
      };
      
    } else {
      filters = {
        members: { $in: [chatClient.user.id] },
        type: 'messaging',
        member_count: { $gt: 2 },
        //isGroupChat: { $eq: true },
        //typeChat: { $eq: 'chat'}
      };
    }
    const channels = await chatClient.queryChannels(filters, {});
    setChannels(channels)
  }
  

  useEffect(() => {
    setIsAnyModalVisible(anyModalVisible());
  }, [
    showAddAlert,
    showRemoveAlert,
    showChatAlert,
    showMemberAlert,
    showLeaveAlert,
    showBlockAlert,
    showMuteAlert,
    showUnmuteAlert,
  ]);

  
  useEffect(() => {
    fetchMembers();
    fetchConvos();

  }, [])

  useEffect(() => {
    fetchMembers();
  }, [participants])

 
  useEffect(() => {
    props.navigation.setOptions({
      headerStyle: {
        backgroundColor: isAnyModalVisible ? 'rgba(0,0,0,0.7)' : '#0E1528',
      },
        headerTitle: () => (
            <View style={{ alignItems: 'center', margin: 5 }}>
            <Text style={{ 
            color: isAnyModalVisible ? 'rgba(255, 255, 255, 0.3)' : 'white',
            fontSize: 16, fontWeight: 'bold' }}>
                {channel.data.isGroupChat? "Group Info" : "Chat Info"}
            </Text>
            </View>
        ),
        headerTintColor: isAnyModalVisible ? 'rgba(55, 119, 240, 0.3)' : '#3777f0',
        headerRight: () => {
            return <HeaderButtons 
            >
               
                    <Item
                        title={"Edit"}
                        color={isAnyModalVisible ? 'rgba(55, 119, 240, 0.3)' : '#3777f0'}
                    />
            
            </HeaderButtons>
        },
    })
}, [isAnyModalVisible]);

  const chatOptions = [
    {
      text: 'Cancel',
      onPress: () => setShowChatAlert(false),
    },
    {
      text: 'Camera',
      icon: (
        <IoniconsIcon name="ios-camera-outline" color={colors.blue} size={25} />
      ),
      onPress: () => {},
    },
    {
      text: 'Photo & Video Library',
      icon: <FeatherIcons name="image" color={colors.blue} size={25} />,
      onPress: () => {},
    },
    {
      text: 'Document',
      icon: (
        <IoniconsIcon
          name="md-document-outline"
          color={colors.blue}
          size={25}
        />
      ),
      onPress: () => {},
    },
    {
      text: 'Location',
      icon: (
        <IoniconsIcon
          name="ios-location-outline"
          color={colors.blue}
          size={25}
        />
      ),
      onPress: () => {},
    },
    {
      text: 'Contact',
      icon: <EvilIconsIcons name="user" color={colors.blue} size={25} />,
      onPress: () => {},
    },
    {
      text: 'Poll',
      icon: <FontAwesoem5Icons name="poll-h" color={colors.blue} size={25} solid />,
      onPress: () => {},
    },
  ];


  const memberOptions = [
    {
      text: 'Cancel',
      onPress: () => setShowMemberAlert(false),
    },
    {
      text: 'Make Admin',
      icon: (
        <MaterialIcons name="admin-panel-settings" color={colors.blue} size={25} />
      ),
      onPress: async () => {
        //not ideal, let's change it later
        //doesn't work correctly
        await channel.removeMembers([memberAction?.about]);
        await channel.addMembers([{user_id:memberAction?.about, channel_role:"channel_moderator"}]);
        setShowRemoveAlert(false);
        setParticpants(participants)
      },
    },
    {
      text: 'Remove Member',
      icon: <MaterialCommunityIconsIcon name="account-remove" color={colors.blue} size={25} />,
      onPress: () => {
        setShowMemberAlert(false);
        setShowRemoveAlert(true);
      },
    },
  ];

  const anyModalVisible = () =>
  showAddAlert || showRemoveAlert || showChatAlert || showMemberAlert || 
  showLeaveAlert || showBlockAlert || showMuteAlert || showUnmuteAlert ;


  return (
   <Wrapper>
      <ScrollableView
  contentContainerStyle={{
    alignItems: 'center',
    flexGrow: 1,
   paddingHorizontal: 20, paddingVertical: 10, 
    backgroundColor: anyModalVisible() ? 'rgba(0,0,0,0.7)' : '#0E1528',
  }}
  showsVerticalScrollIndicator={false}
>

        {/* <Header
          headerTitle="Group Info"
          //onRightButtonPress={() => setShowRemoveAlert(true)}
          onLeftButtonPress={() => navigation.goBack()}
          //onLeftButtonPress={() => setShowChatAlert(true)}
          leftButtonText="Back"
          rightButtonText="Edit"
          showBackIcon={true}
          tiltLeft
        />
        <Spacer height={10} /> */}
      

        <View style={styles.column}>
            <View>
              <Image
                source={source}
                style={styles.userImage}
              />
            </View>
            <View style={styles.userDetails}>
              <SCText style={styles.userName}>
                {channel.data.name}
              </SCText>
              {channel.data.description && 
                  <SCText style={styles.userID}>
                 {channel.data.description}
                </SCText>
              }
              
            </View>
        </View>

        {/* <MenuWrapper>
          <MenuItem
            plainText={true}
            mainText="Add Group Description"
            onPlainTextPress={() => {
              setShowAddAlert(true);
            }}
          />
        </MenuWrapper> */}

        <MenuWrapper>
          
            <MenuItem
            iconBackgroundColor='#33FFB3'
              //iconBackgroundColor={colors.darkblue}
              icon={<FontAwesomeIcons name="image" size={18} color={colors.white} />}
              mainText="Media, Links, and Docs"
              rightIconText={721}
            />
            <UIDivider forMenu={true} />

            <TouchableOpacity
              onPress={() => navigation.navigate('Starred', { channels: channels})}
            >
                <MenuItem
                  iconBackgroundColor='#FFFF66'
                  icon={
                    <MaterialCommunityIconsIcon
                      name="star"
                      size={18}
                      color={colors.white}
                    />
                  }
                  mainText="Starred Messages"
                  rightIconText={'None'}
                />
            </TouchableOpacity>
        </MenuWrapper>

        <MenuWrapper>

            <MenuItem
              iconBackgroundColor='#3F22EC'
              icon={
                <IoniconsIcon name="lock-closed" size={18} color={colors.white} />
              }
              mainText="Encryption"
              subText="Message and calls are ene-to-end encrypted. Tap to learn more."
            />

            <UIDivider forMenu={true} />

              {channel.data.muteChannel? 
                    <TouchableOpacity
                    onPress={() => {
                      setShowUnmuteAlert(true);
                    }}
                    >
                      <MenuItem
                        iconBackgroundColor='#ED2939'
                        icon={
                          <Octicons name="unmute" size={18} color={colors.white} />
                        }
                        mainText="Unmute"
                      />
                    </TouchableOpacity>
              : 
                    <TouchableOpacity
                    onPress={() => {
                      setShowMuteAlert(true);
                    }}
                  >
                      <MenuItem
                        iconBackgroundColor='#FF6653'
                        icon={
                          <Octicons name="mute" size={18} color={colors.white} />
                        }
                        mainText="Mute"
                      />
                 </TouchableOpacity>
              }
            

         

        
        </MenuWrapper>

        {isModerator && 
          <View style={{ flexDirection: 'row', width: '100%', marginBottom:-24}}>
              <T18 style={{ marginTop: '9%', alignSelf: 'flex-start' }}>
                {participants} Participants
              </T18>
              <View style={{ marginTop: '5%', flex:1}}>
                <IconButton
                    style={{ alignSelf: 'flex-end' }}
                    onPress= {() => setShowRemoveAlert(true)}
                    iconName={'CirclePlus'}
                    //pathFill={'grey'}
                  />
              </View>
          </View>
       }

        <MenuWrapper >
            {isModerator && 
            <>
              {/* <TouchableOpacity
                 //onPress={handleAddModerator}
              >
                <MenuItem
                  mainText="Add Participants"
                  rightIcon={false}
                  plainText={true}
                  leftIcon={true}
                />
              </TouchableOpacity>
                <UIDivider forContacts={true} style={{marginTop: -5}} /> */}
                {/* <MenuItem
                  mainText="Invite to Group via Link"
                  rightIcon={false}
                  plainText={true}
                  leftIcon={true}
                  leftIconLink={true}
                />
                <UIDivider forContacts={true} style={{marginTop: -5}} /> */}
              </>
            }
          {contacts
            //.slice(0, Math.min(contacts.length, 8))
            .map((item, index) => (
              // <Fragment key={index}>
              <>
              <TouchableOpacity
                onPress={() => {
                  if (item?.about !== user.id && isModerator) {
                    setShowMemberAlert(true);
                    setMemberAction(item);
                  }
                }}
              >
                <MenuItem
                  isContact={true}
                  contactProfile={item.image}
                  mainText={item.name}
                  subText={item?.about}
                />
              </TouchableOpacity>
                {contacts.length - 1 > index && (
                  <UIDivider forContacts={true} />
                )}
                 </>
              // </Fragment>
            ))}
            

          {/* {contacts.length > 8 && (
            <>
            <TouchableOpacity
            onPress={() => navigation.navigate('AddParticipants', {contacts: contacts})}>
              <MenuItem
                plainText={true}
                mainText={'See All'}
                plaintextColor={colors.gray}
                plainTextWithNextIcon={true}
              />
            </TouchableOpacity>
            </>
          )} */}
        </MenuWrapper>

        {/* <MenuWrapper>
          <MenuItem plainText={true} mainText="Export Chat" />

          <UIDivider forPlaintext={true} />

          <MenuItem
            plainText={true}
            mainText="Clear Chat"
            plaintextColor={colors.redText}
          />
        </MenuWrapper> */}

        
        {channel.data.isGroupChat ?
            <MenuWrapper>
                {/* <TouchableOpacity
                    onPress={() => {
                        setShowLeaveAlert(true);
                      }}
                  >
                <MenuItem
                  plainText={true}
                  mainText="Mute Group"
                  plaintextColor={colors.redText}
                />
              </TouchableOpacity>

              <UIDivider forPlaintext={true} /> */}

              <TouchableOpacity
                    onPress={() => {
                        setShowLeaveAlert(true);
                      }}
                >
                  <MenuItem
                    plainText={true}
                    mainText="Exit Group"
                    plaintextColor={colors.redText}
                  />
              </TouchableOpacity>
            </MenuWrapper>
            :
            <MenuWrapper>
                {/* 
                <MenuItem
                  plainText={true}
                  mainText="Mute User"
                  plaintextColor={colors.redText}
                />

              <UIDivider forPlaintext={true} /> */}


              <TouchableOpacity
                   onPress={() => {
                      setShowBlockAlert(true);
                    }}
                >
                <MenuItem
                  plainText={true}
                  mainText={channel.data.blockedUser ? "Unblock User" : "Block User"}
                  plaintextColor={colors.redText}
                />
              </TouchableOpacity>
            </MenuWrapper>
        }


        <BottomAlert
          visible={showAddAlert}
          description="Add Hermana to 'Wills' Group?"
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowAddAlert(false),
            },
            {
              text: 'Add',
              onPress: () => {},
            },
          ]}
        />

        <BottomAlert
          visible={showLeaveAlert}
          destructiveButtonIndex={1}
          description={`Exit "${channel.data.name}" group?`}
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowLeaveAlert(false),
            },
            {
              text: 'Exit Group',
              onPress: async () => {
                setShowLeaveAlert(false)
                await channel.removeMembers([user.id]);
                navigation.navigate('tabs');
              },
            },
          ]}
        />

        <BottomAlert
          visible={showBlockAlert}
          destructiveButtonIndex={1}
          description={
            channel.data.blockedUser
              ? "Unblock contacts will be able to send you messages again."
              : "Blocked contacts won't be able to message you until you unblock them."
          }
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowBlockAlert(false),
            },
            {
              text: channel.data.blockedUser ? "Unblock" : "Block",
              onPress: async () => {
                const otherMembers = Object.values(channel.state.members).filter(
                  (member) => member.user.id !== user.id
                );
                const otherMemberUserId = otherMembers[0].user.id;
                if (channel.data.blockedUser) {
                  await Promise.all([
                    channel.unbanUser(otherMemberUserId),
                    channel.updatePartial({ set:{ blockedUser: false } }),
                  ]);
                } else {
                  await Promise.all([
                    channel.banUser(otherMemberUserId),
                    channel.updatePartial({ set:{ blockedUser: true } }),
                  ]);
                }
                setShowBlockAlert(false);
              },
            },
          ]}
        />

        <BottomAlert
          visible={showRemoveAlert}
          destructiveButtonIndex={1}
          description={`Remove ${memberAction?.name}from ${channel.data.name} group?`}
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowRemoveAlert(false),
            },
            {
              text: 'Remove',
              onPress: async () => {
                setShowRemoveAlert(false)
                await channel.removeMembers([memberAction?.about]);
                setParticpants(participants - 1)
              },
            },
          ]}
        />

        <BottomAlert
          visible={showMuteAlert}
          description={"Members of this channel won't know you muted this channel."}
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowMuteAlert(false),
            },
            {
              text: '1 day',
              onPress: async () => {
                const oneDayMilliseconds = 24 * 60 * 60 * 1000; // 1 day in milliseconds
                await Promise.all([
                  channels.map(channel => channel.mute({ expiration: oneDayMilliseconds })),
                  channel.updatePartial({ set:{ muteChannel: true } }),
                ]);
                setShowMuteAlert(false)
              },
            },
            {
              text: '1 week',
              onPress: async () => {
                const oneWeekMilliseconds = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
                await Promise.all([
                  channels.map(channel => channel.mute({ expiration: oneWeekMilliseconds })),
                  channel.updatePartial({ set:{ muteChannel: true } }),
                 ]);
                setShowMuteAlert(false)
              },
            },
            {
              text: 'Always',
              onPress: async () => {
                await Promise.all([
                  channels.map(channel => channel.mute()),
                  channel.updatePartial({ set:{ muteChannel: true } }),
                ]);
                setShowMuteAlert(false)
              },
            },
          ]}
        />

        <BottomAlert
          visible={showUnmuteAlert}
         //description={"Members of this channel won't know you muted this channel."}
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowUnmuteAlert(false),
            },
            {
              text: 'Unmute',
              onPress: async () => {
                await Promise.all(
                  [channels.map(channel => channel.unmute()),
                  channel.updatePartial({ set:{ muteChannel: false } })]);
                setShowUnmuteAlert(false)
              },
              
            },
          ]}
        />

        <BottomAlert
          visible={showChatAlert}
          actions={chatOptions}
          textColor={colors.white}
          withIcon={true}
        />

        <BottomAlert
          visible={showMemberAlert}
          actions={memberOptions}
          textColor={colors.white}
          withIcon={true}
        />
      </ScrollableView>
    
      </Wrapper>
  );
}

export default GroupInfo;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.background};
  
`;

export const ScrollableView = styled.ScrollView`
  flex: 1;
`;

const ProfileImageContainer = styled.View`
  height: 180px;
  width: 180px;
  border-radius: 90px;
  overflow: hidden;
  background-color: white;
  
`;

const Image = styled.Image`
  height: 100%;
  width: 100%;
`;

const GoToSettingsButton = styled.Pressable`
  padding: 6px 20px;
  align-items: center;
  justify-content: center;
  background-color: ${colors.darkblue};
  border-radius: 5px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;


const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: "8%"
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
  },
  userDetails: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    
  },
  userImage: {
    borderRadius: 10,
    height: 110,
    width: 110,
  },

});