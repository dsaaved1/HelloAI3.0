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
import Ionicons from 'react-native-vector-icons/Ionicons';
import FeatherIcons from 'react-native-vector-icons/Feather';
import EvilIconsIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesoem5Icons from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIconsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import UIDivider from '../components/UIDivider';
import {colors} from '../theme'
import { chatClient} from '../client'
import { SCText } from '../components/SCText';
import userImage from '../images/userImage.jpeg'
import BottomAlert from '../components/BottomAlert';


const Support = props => {
   
    

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
                    Support
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
                    name="instagram"
                    size={18}
                    color="#C13584"
                    //color="#3777f0"
                />
                }
                mainText="Follow us on Instagram"
            />
            <UIDivider forMenu={true} />
            <MenuItem
                icon={
                    <FontAwesome
                    name="twitter"
                    size={18}
                    color="#1DA1F2" // Twitter's color
                    //color="#3777f0"
                    />
                }
                mainText="Follow us on Twitter"
                />
            <UIDivider forMenu={true} />

            <MenuItem
                icon={
                <MaterialIcons
                    name="star-rate"
                    size={18}
                    color="#FFC107" // Star color
                    //color="#3777f0"
                />
                }
                mainText="Rate Us"
            />
            <UIDivider forMenu={true} />

            <MenuItem
                icon={
                <Ionicons
                    name="md-chatbox-ellipses"
                    size={18}
                    color="#3777f0" // Choose a color for feedback
                />
                }
                mainText="Give Feedback"
            />
            </MenuWrapper>


            </View>
  )
}

export default Support