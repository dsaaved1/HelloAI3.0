import React from 'react';
import styled from 'styled-components/native';
import {T32} from '../common/Typography/index';
import MenuWrapper from '../components/MenuWrapper';
import Spacer from '../containers/Spacer/Spacer';
import {colors} from '../common/colors/index';
import MenuItem from '../components/MenuItem';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import IoniconsIcon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import UIDivider from '../components/UIDivider';



type Props = {};

function Settings({}: Props) {
  return (
    <Wrapper>
      <ScrollableView>
        <T32 weight={'bold'} style={{marginLeft: '3%'}}>
          Settings
        </T32>
        <Spacer height={10} />
        <MenuWrapper wrapperStyle={{borderRadius: 0}}>
          <MenuItem
            isContact={true}
            contactProfile={require('../assets/images/profile.jpg')}
            mainText={'Diego Savarda'}
            subText={';'}
            fromSettings={true}
          />
        </MenuWrapper>
        <Spacer height={20} />
        <MenuWrapper wrapperStyle={{borderRadius: 0}}>
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
          />
        </MenuWrapper>
        <Spacer height={20} />
        <MenuWrapper wrapperStyle={{borderRadius: 0}}>
          <MenuItem
            iconBackgroundColor={colors.darkblue}
            icon={
              <Entypo
                name="key"
                size={18}
                color={colors.white}
                style={{transform: [{rotate: '324deg'}]}}
              />
            }
            mainText="Account"
          />
          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.blueP}
            icon={
              <IoniconsIcon name="lock-closed" size={18} color={colors.white} />
            }
            mainText="Privacy"
          />
          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.red}
            icon={<Entypo name="notification" size={18} color={colors.white} />}
            mainText="Notifications"
          />
          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.green}
            icon={
              <MaterialCommunityIcons
                name="star"
                size={18}
                color={colors.white}
              />
            }
            mainText="Storage and Data"
          />
        </MenuWrapper>
        <Spacer height={20} />

        <MenuWrapper wrapperStyle={{borderRadius: 0}}>
          <MenuItem
            iconBackgroundColor={colors.darkblue}
            icon={<AntDesignIcon name="info" size={18} color={colors.white} />}
            mainText="Help"
          />
          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.red}
            icon={<AntDesignIcon name="heart" size={18} color={colors.white} />}
            mainText="Tell a Friend"
          />
        </MenuWrapper>
      </ScrollableView>
    </Wrapper>
  );
}

export default Settings;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.background};
  padding: 3% 0%;
`;

export const ScrollableView = styled.ScrollView`
  flex: 1;
`;
