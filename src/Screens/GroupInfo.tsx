import React, {Fragment, useState} from 'react';
import styled from 'styled-components/native';
import {colors} from '../common/colors/index';
import {T16, T24} from '../common/Typography/index';
import Header from '../components/Header';
import MenuWrapper from '../components/MenuWrapper';
import MenuItem from '../components/MenuItem';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesoem5 from 'react-native-vector-icons/FontAwesome5';
import Spacer from '../containers/Spacer/Spacer';
import {useNavigation} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';

import UIDivider from '../components/UIDivider';
import BottomAlert from '../components/BottomAlert';

type Props = {};

function GroupInfo({}: Props) {
  const {navigate} = useNavigation();
  const [showAddAlert, setShowAddAlert] = useState(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);
  const [showChatAlert, setShowChatAlert] = useState(false);

  const [contacts, setContacts] = useState([
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Leo Primo',
      about: '🦋',
      id: 1,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Theo Primo',
      about: 'Disponible',
      id: 2,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Ali Primo',
      about: 'Disponible',
      id: 3,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Zaid Munir',
      about: 'Disponible',
      id: 4,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Abraham',
      about: 'Disponible',
      id: 5,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Adri',
      about: 'Disponible',
      id: 6,
    },

    {
      image: require('../assets/images/profile.jpg'),
      name: 'Miqui',
      about: 'Disponible',
      id: 7,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Mateo Primo',
      about: 'Disponible',
      id: 8,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Nico',
      about: 'Disponible',
      id: 9,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Hermana',
      about: 'Disponible',
      id: 10,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Iris',
      about: 'Disponible',
      id: 11,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Natty',
      about: 'Disponible',
      id: 12,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Juanca',
      about: 'Disponible',
      id: 13,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Usman',
      about: 'Disponible',
      id: 14,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Saqib',
      about: 'Disponible',
      id: 15,
    },
    {
      image: require('../assets/images/profile.jpg'),
      name: 'Usama',
      about: 'Disponible',
      id: 16,
    },
  ]);

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
      icon: <Feather name="image" color={colors.blue} size={25} />,
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
      icon: <EvilIcons name="user" color={colors.blue} size={25} />,
      onPress: () => {},
    },
    {
      text: 'Poll',
      icon: <FontAwesoem5 name="poll-h" color={colors.blue} size={25} solid />,
      onPress: () => {},
    },
  ];
  return (
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
          onLeftButtonPress={() => setShowChatAlert(true)}
          leftButtonText="Back"
          rightButtonText="Edit"
          showBackIcon={true}
          tiltLeft
        />
        <Spacer height={10} />
        <ButtonsContainer>
          <GoToSettingsButton onPress={() => navigate('Settings')}>
            <T16>Settings</T16>
          </GoToSettingsButton>
          <GoToSettingsButton
            onPress={() => navigate('AddParticipants', {contacts: contacts})}>
            <T16>Add Participant</T16>
          </GoToSettingsButton>
        </ButtonsContainer>
        <ProfileImageContainer>
          
          <Image
            source={require('../assets/images/profile.jpg')}
            resizeMode="cover"
          />
        </ProfileImageContainer>
        <MenuWrapper>
          <MenuItem
            plainText={true}
            mainText="Add Group Description"
            onPlainTextPress={() => {
              setShowAddAlert(true);
            }}
          />
        </MenuWrapper>
        <MenuWrapper>
          
          <MenuItem
            iconBackgroundColor={colors.darkblue}
            icon={<FontAwesome name="image" size={18} color={colors.white} />}
            mainText="Media, Links, and Docs"
            rightIconText={721}
          />
          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.yellow}
            icon={
              <MaterialCommunityIcons
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
            iconBackgroundColor={colors.darkblue}
            icon={
              <IoniconsIcon name="lock-closed" size={18} color={colors.white} />
            }
            mainText="Encryption"
            subText="Message and calls are ene-to-end encrypted. Tap to learn more."
          />

          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.darkblue}
            icon={
              <IoniconsIcon name="settings" size={18} color={colors.white} />
            }
            mainText="Group Settings"
          />
        </MenuWrapper>
        <T24 style={{marginTop: '6%', alignSelf: 'flex-start'}}>
          {contacts.length} Participants
        </T24>
        <MenuWrapper>
          <MenuItem
            mainText="Add Participants"
            rightIcon={false}
            plainText={true}
            leftIcon={true}
          />
          <UIDivider forContacts={true} style={{marginTop: -5}} />
          <MenuItem
            mainText="Invite to Group via Link"
            rightIcon={false}
            plainText={true}
            leftIcon={true}
            leftIconLink={true}
          />
          <UIDivider forContacts={true} style={{marginTop: -5}} />

          {contacts
            .slice(0, Math.min(contacts.length, 10))
            .map((item, index) => (
              <Fragment key={index}>
                <MenuItem
                  isContact={true}
                  contactProfile={item.image}
                  mainText={item.name}
                  subText={item?.about}
                />
                {contacts.length - 1 > index && (
                  <UIDivider forContacts={true} />
                )}
              </Fragment>
            ))}
          {contacts.length > 10 && (
            <>
              <UIDivider forContacts={true} />
              <Spacer height={10} />

              <MenuItem
                plainText={true}
                mainText={'See All'}
                plaintextColor={colors.gray}
                plainTextWithNextIcon={true}
              />
              <Spacer height={10} />
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
