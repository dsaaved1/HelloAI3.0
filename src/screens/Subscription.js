import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal
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
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UIDivider from '../components/UIDivider';
import {colors} from '../theme'
import { chatClient} from '../client'
import { SCText } from '../components/SCText';
import userImage from '../images/userImage.jpeg'
import BottomAlert from '../components/BottomAlert';
import PaywallScreen from '../components/Paywall';
import { useNavigation } from '@react-navigation/native';


const Subscription = props => {
    const navigation = useNavigation();
    const [paywallShown, setPaywallShown] = useState(true);
    const [showModal, setShowModal] = useState(false);

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
                    Subscription
                </Text>
                </View>
            ),
            headerTintColor: '#3777f0',
        })
    }, []); 


    return (
        <View style={{flex:1}}>
     
            
        {paywallShown ? 
     
                <MenuWrapper>
                    <MenuItem
                        icon={
                        <MaterialCommunityIcons
                            name="question"
                            size={22}
                            color="#3777f0"
                        />
                        }
                        rightIcon={false}
                        mainText={`Questions Left: ${chatClient?.user?.questionsLeft || 0}`}
                    />
                    <UIDivider forMenu={true} />
                    <MenuItem
                        icon={
                            <FontAwesoem5Icons
                            name="user-friends"
                            size={18}
                            color="#3777f0"
                        
                            />
                        }
                        rightIcon={false}
                        mainText={`Friends Invited: ${chatClient?.user?.friendsInvited || 0}`}
                        />

                    <UIDivider forMenu={true} />
                    
                    <MenuItem
                        icon={
                            <Ionicons
                            name="person-add"
                            size={20}
                            color="#3777f0"
                        
                            />
                        }
                       
                        onPress={()=>navigation.navigate('InviteFriends')}
                         mainText="Invite friends, Get Questions"
                        />

                
                   
                </MenuWrapper>

                :

                <MenuWrapper>
                    <MenuItem
                        icon={
                        <MaterialCommunityIcons
                            name="infinity"
                            size={22}
                            color="#3777f0"
                        />
                        }
                        mainText="Unlimited Questions"
                    />
                      <MenuItem
                        icon={
                            <Ionicons
                            name="person-add"
                            size={20}
                            color="#3777f0"
                        
                            />
                        }
                       
                        onPress={()=>navigation.navigate('InviteFriends')}
                         mainText={!paywallShown? "Invite Friends" : "Invite Friends, Get Questions"}
                        />

                </MenuWrapper>
            }

            {paywallShown ?

                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <FontAwesome name="user-circle" size={130} color={colors.dark.secondaryLight} />
                    <TouchableOpacity onPress={() => setShowModal(true)} style={{backgroundColor:colors.dark.secondaryLight, padding:10, borderRadius:10, margin:30}}>
                        <SCText style={{color:'white', fontSize:20, fontWeight:'bold'}}>Subscribe to Pro</SCText>
                    </TouchableOpacity>
                </View>
            :
                <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
                    <FontAwesome name="user-circle" size={130} color='#3777f0' />
                    <SCText style={{color:'white', fontSize:30, fontWeight:'bold', margin: 15}}>Pro</SCText>
                    
                </View>
            }

                
        <Modal
           visible={showModal}
           animationType="slide"
           transparent={true}
        >

           
                <PaywallScreen onAccept={() => setPaywallShown(false)} onClose={() => setShowModal(false)} />

        </Modal>

            </View>
  )
}

export default Subscription

const styles = StyleSheet.create({
    //... other styles remain the same ...
    modalContainer: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    },
    //... other styles remain the same ...
  });