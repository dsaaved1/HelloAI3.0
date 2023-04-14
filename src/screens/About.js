import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import MenuItem from '../components/MenuItem';
import MenuWrapper from '../components/MenuWrapper';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesoem5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Foundation from 'react-native-vector-icons/Foundation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UIDivider from '../components/UIDivider';
import {colors} from '../theme'
import { chatClient, user} from '../client'
import { SCText } from '../components/SCText';
import userImage from '../images/userImage.jpeg'
import BottomAlert from '../components/BottomAlert';


const About = props => {
   
    

    useEffect(() => {
        props.navigation.setOptions({
          headerStyle: {
            backgroundColor: '#0E1528',
          },
            headerTitle: () => (
                <View style={{ alignItems: 'center', margin: 5 }}>
                <Text style={{ 
                color: 'white',
                fontSize: 16, fontWeight: 'bold' }}>
                    About
                </Text>
                </View>
            ),
            headerTintColor: '#3777f0',
        })
    }, []); 


    return (
        <View style={{flex:1}}>
     
            
     
     <MenuWrapper>
  <MenuItem
    icon={
      <FontAwesome
        name="file-text-o"
        size={18}
        color="#3777f0" // Choose a color for terms and conditions
      />
    }
    mainText="Terms and conditions"
  />
  <UIDivider forMenu={true} />

  <MenuItem
    icon={
      <MaterialIcons
        name="privacy-tip"
        size={18}
        color="#3777f0" // Choose a color for privacy policy
      />
    }
    mainText="Privacy policy"
  />
  <UIDivider forMenu={true} />

  <MenuItem
    icon={
      <Entypo
        name="mail"
        size={18}
        color="#3777f0" // Choose a color for contact us
      />
    }
    mainText="Contact Us"
  />
  <UIDivider forMenu={true} />

  <MenuItem
    icon={
      <Foundation
        name="lightbulb"
        size={18}
        color="#3777f0" // Choose a color for features
      />
    }
    mainText="Features"
  />
</MenuWrapper>


            </View>
  )
}

export default About


