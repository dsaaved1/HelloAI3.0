import React, {useState, useEffect, useCallback} from 'react';
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
import { useTheme } from '@react-navigation/native';
import { ScreenHeader } from '../components/ScreenHeader';
import {View, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { chatClient} from '../client'
import { SCText } from '../components/SCText';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import userImage from '../images/userImage.jpeg'
import { useFocusEffect } from '@react-navigation/native';





function Settings({ route }){
  const [paywallShown, setPaywallShown] = useState(false);
  const navigation = useNavigation();
  const source = chatClient.user.image? { uri: chatClient.user.image } : userImage
  const [image, setImage] = useState(source);


 useFocusEffect(
  useCallback(() => {
    const updateUserImage = () => {
      const source = chatClient.user.image ? { uri: chatClient.user.image } : userImage;
      setImage(source); // <-- Add state to manage image in the Settings component
    };

    updateUserImage();
    return () => {}; // Cleanup function
  }, [])
);
  
  return (
    <View style={{flex:1}}>
    <ScreenHeader title='Profile' />
    <Wrapper>
      <ScrollableView>
        <Spacer height={20} />
        <View style={styles.row}>
            <View>
              <Image
                source={image}
                style={styles.userImage}
              />
            </View>
            <View style={styles.userDetails}>
              <SCText style={styles.userName}>
                {chatClient.user.name} {chatClient.user.status}
              </SCText>
              <SCText style={styles.userID}>{chatClient.user.id}</SCText>
            </View>
        </View>
        {/* <Spacer height={20} /> */}
        {
          paywallShown ?
              <MenuWrapper wrapperStyle={{borderRadius: 0}}>
                <MenuItem
                  iconBackgroundColor='#FF6'
                  //iconBackgroundColor={colors.yellow}
                  icon={
                    <MaterialCommunityIcons
                      name="star"
                      size={18}
                      color='#859299'
                      //color={colors.white}
                    />
                  }
                  mainText="Premium"
                  onPress={()=>navigation.navigate('Subscription')}
                />
              </MenuWrapper>
        :
        <MenuWrapper wrapperStyle={{
          borderRadius: 0,
          backgroundColor: '#2e50',
          }}>
          <MenuItem
            //iconBackgroundColor={colors.yellow}
            
            iconBackgroundColor='#FFFF'
            icon={
              <IoniconsIcon name="lock-closed"
                size={18}
                color='#859299'
                //color={colors.white}
              />
            }
            mainText="Upgrade"
            onPress={()=>navigation.navigate('Subscription')}
          />
        </MenuWrapper>
      } 
        {/* <Spacer height={20} /> */}
        <MenuWrapper wrapperStyle={{borderRadius: 0}}>
            {/* <TouchableOpacity
              onPress={() => navigation.navigate('Account')}
            > */}
                <MenuItem
                iconBackgroundColor='#3F22EC'
                  //iconBackgroundColor='#6653FF'
                  icon={
                    <Entypo
                      name="key"
                      size={18}
                      color='#859299'
                      style={{transform: [{rotate: '324deg'}]}}
                    
                    />
                    
                  }
                  onPress={()=>navigation.navigate('Account')}
                  mainText="Account"
                />
          {/* </TouchableOpacity> */}

          <UIDivider forMenu={true} />

          {/* <MenuItem
          iconBackgroundColor='#3F22EC'
          //iconBackgroundColor='#33FFB3'
            icon={
              <IoniconsIcon name="lock-closed" size={18} color='#859299' />
            }
            rightIcon={false}
            mainText="Privacy"
            //blocked users
            //two factor authentication
            //encryption
          />
          <UIDivider forMenu={true} /> */}

          <MenuItem
          iconBackgroundColor='#FFA500'
            icon={<Entypo name="notification" size={18} color='#859299' />}
            //rightIcon={false}
            mainText="Notifications"
          />
          <UIDivider forMenu={true} />

          <MenuItem
             iconBackgroundColor='#53FF66'
            icon={
              <MaterialCommunityIcons
                name="star"
                size={18}
                color='#859299'
              />
            }
            //rightIcon={false}
            mainText="Language"
          />
        </MenuWrapper>
        {/* <Spacer height={20} /> */}

        <MenuWrapper wrapperStyle={{borderRadius: 0}}>
          <MenuItem
          iconBackgroundColor='#FF6EFF'
          //iconBackgroundColor='#9162FF'
            //iconBackgroundColor={colors.darkblue}
            icon={<AntDesignIcon name="info" size={18} color='#859299' />}
            mainText="About"
            onPress={()=>navigation.navigate('About')}
          />
          <UIDivider forMenu={true} />

          <MenuItem
            iconBackgroundColor={colors.red}
            icon={<AntDesignIcon name="heart" size={18} color='#859299' />}
            mainText="Support us"
            onPress={()=>navigation.navigate('Support')}
           
          />
        </MenuWrapper>
      </ScrollableView>
    </Wrapper>
    </View>
  );
}

export default Settings;

export const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${'#0E1528'};
  padding: 3% 0%;
`;

export const ScrollableView = styled.ScrollView`
  flex: 1;
`;

const styles = StyleSheet.create({
  actionItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  actionItemSection: {},
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    
  },
  userImage: {
    borderRadius: 10,
    height: 100,
    width: 90,
  },
  logout: {
    color: "white",
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
  },
});
