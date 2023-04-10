//CAUSE PROBLEMS  Fragment
import React, {Fragment, useEffect, useState} from 'react';
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
import Spacer from '../containers/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UIDivider from '../components/UIDivider';
import BottomAlert from '../components/BottomAlert';

import {View, StyleSheet} from 'react-native';
import { chatClient} from '../client'
import { SCText } from '../components/SCText';
import userImage from '../images/userImage.jpeg'
import SuperAvatar from '../components/SuperAvatar';
import { TouchableOpacity } from 'react-native-gesture-handler';


const GroupInfo = ({route}) =>  {
  const navigation = useNavigation();
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [participants, setParticpants] = useState(0);
  
  const {channel} = route.params || {};
  const source = channel.data.image ?  { uri: channel.data.image } : userImage;
  const [isGroupChat, setIsGroupChat] = useState(channel.data.isGroupChat)

  async function fetchMembers() {
    const sort = [{ user: { name: 1 } }];
    const objectMembers = await channel.queryMembers({})
    // Do something with objectMembers here
    console.log(objectMembers, "object")
    const participantsCount = objectMembers.members.length;
    console.log(participantsCount, "participants count")
    // Transform the membersArray to the required format for contacts
    const fetchedContacts = objectMembers.members.map((member, index) => {
      return {
        image: { uri: member.user.image }, // Assuming the user has an 'image' property
        name: member.user.name,
        about: member.user.id, // Assuming the user has an 'about' property
        id: index,
      };
    });
    console.log(fetchedContacts, "fetched")
    
    // Update the contacts state
    setContacts(fetchedContacts);
    setParticpants(participantsCount)
  }
  
  useEffect(() => {
    fetchMembers();
  }, [])

  const handleAddModerator = async () => {
    try {
        await channel.addModerators(['steve']);
    } catch (error) {
      console.error('Error adding moderator:', error);
    }
  };

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


  return (
    <View style={{flex: 1, paddingHorizontal: 20}} >
    <Wrapper>
      <ScrollableView
        contentContainerStyle={{
          alignItems: 'center',
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Header
          headerTitle="Group Info"
          onRightButtonPress={() => setShowRemoveAlert(true)}
          onLeftButtonPress={() => navigation.goBack()}
          //onLeftButtonPress={() => setShowChatAlert(true)}
          leftButtonText="Back"
          rightButtonText="Edit"
          showBackIcon={true}
          tiltLeft
        />
        <Spacer height={10} />
      

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

          <MenuItem
            iconBackgroundColor='#FF6653'
            icon={
              <IoniconsIcon name="settings" size={18} color={colors.white} />
            }
            mainText="Group Settings"
          />
        </MenuWrapper>

        <T18 style={{marginTop: '6%', alignSelf: 'flex-start'}}>
           {participants} Participants
        </T18>

        <MenuWrapper>
            {isGroupChat && 
            <>
              <TouchableOpacity
                 onPress={handleAddModerator}
              >
                <MenuItem
                  mainText="Add Participants"
                  rightIcon={false}
                  plainText={true}
                  leftIcon={true}
                />
              </TouchableOpacity>
              <UIDivider forContacts={true} style={{marginTop: -5}} />
              <MenuItem
                mainText="Invite to Group via Link"
                rightIcon={false}
                plainText={true}
                leftIcon={true}
                leftIconLink={true}
              />
              <UIDivider forContacts={true} style={{marginTop: -5}} />
              </>
            }
          {contacts
            .slice(0, Math.min(contacts.length, 10))
            .map((item, index) => (
              // <Fragment key={index}>
              <>
                <MenuItem
                  isContact={true}
                  contactProfile={item.image}
                  mainText={item.name}
                  subText={item?.about}
                />
                {contacts.length - 1 > index && (
                  <UIDivider forContacts={true} />
                )}
                 </>
              // </Fragment>
            ))}
            

          {contacts.length > 10 && (
            <>
              <MenuItem
                plainText={true}
                mainText={'See All'}
                plaintextColor={colors.gray}
                plainTextWithNextIcon={true}
              />
             
            </>
          )}
        </MenuWrapper>

        <MenuWrapper>
          <MenuItem plainText={true} mainText="Export Chat" />

          <UIDivider forPlaintext={true} />

          <MenuItem
            plainText={true}
            mainText="Clear Chat"
            plaintextColor={colors.redText}
          />
        </MenuWrapper>

        <MenuWrapper>
          <MenuItem
            plainText={true}
            mainText="Exit Group"
            plaintextColor={colors.redText}
          />

          <UIDivider forPlaintext={true} />

          <MenuItem
            plainText={true}
            mainText="Report Group"
            plaintextColor={colors.redText}
          />
        </MenuWrapper>
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
          visible={showRemoveAlert}
          destructiveButtonIndex={1}
          description="Remove Hermana from 'Wills' Group?"
          actions={[
            {
              text: 'Cancel',
              onPress: () => setShowRemoveAlert(false),
            },
            {
              text: 'Remove',
              onPress: () => {},
            },
          ]}
        />

        <BottomAlert
          visible={showChatAlert}
          actions={chatOptions}
          textColor={colors.white}
          withIcon={true}
        />
      </ScrollableView>
    </Wrapper>
    </View>
  );
}

export default GroupInfo;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.background};
  padding: 3% 3%;
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
  margin-top: 10%;
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
    marginTop: '10%',
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