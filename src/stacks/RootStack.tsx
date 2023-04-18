import ChannelScreen from './ChannelStack'
import React from 'react'
import {noHeaderOptions} from '../App'
import {createStackNavigator} from '@react-navigation/stack'
import { createDrawerNavigator } from "@react-navigation/drawer";
import { View, Text, TextInput, StyleSheet, SafeAreaView, TouchableOpacity, Pressable } from 'react-native';
import { useState } from 'react';
import { List } from '../screens/ChannelList'
import Convos from '../screens/Convos'
import IconButton from '../components/IconButton'
import {useNavigation} from '@react-navigation/native';
import NewChatScreen from '../screens/NewChatScreen';
import NewGroupName from '../screens/NewGroupName';
import { colors } from '../theme';
import { SVGIcon } from '../components/SVGIcon';
import { sizes } from '../global';
import {ProfileScreen } from '../screens/ProfileScreen';
import Invitations from '../screens/Invitations';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { BottomTabs } from '../components/BottomTabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import GroupInfo from '../screens/GroupInfo';
import Settings from '../screens/Settings';
import AddParticipants from '../screens/AddParticipants';
import StarredMessages from '../screens/StarredMessages';
import Account from '../screens/Account';
import EditGroup from '../screens/EditGroup';
import Support from '../screens/Support';
import About from '../screens/About';

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator()
const SettingsStack = createStackNavigator()

export enum ROOT_STACK {
  CHANNEL_LIST = 'RootStackChannelList',
  CHANNEL_SCREEN = 'RootStackChannelScreen',
  HOME = 'home',
  CONVOS = 'RootStackConvos',
  NEW_SCREEN = 'RootStackNewScreen',
  NEW_GROUP_NAME = 'RootStackNewGroupName',
  PROFILE = 'RootStackSettings',
  INVITATIONS = 'invitations',
  TABS = 'Main',
}


const DrawerNavigator = () => {

  return (
    <Drawer.Navigator drawerContent={CustomDrawerContent}>
      <Drawer.Group>
      <Drawer.Screen
        component={TabNavigation}
        name={ROOT_STACK.TABS}
        options={noHeaderOptions}
      />
      </Drawer.Group>
    </Drawer.Navigator>
      
  );
};

const CustomDrawerContent = () => {
  const [tab, setTab] = useState("private");
  const navigation = useNavigation();
 

  return (
      <View  style={{ flex: 1 , 
      //backgroundColor: '#3777f0'
      backgroundColor: colors.dark.background,
      }}>

          <View style={styles.tabs}>

            
          {tab === "public" ? 
              <Text
              style={styles.tabTitle}
              >
                  Groups
              </Text>
            : 
            <Text
              style={styles.tabTitle}
              >
                  Direct messages
              </Text>
            }

               <View style={{flexDirection:'row'}}>
               {tab === "public" ? 
                  <TouchableOpacity onPress={() => setTab("private")} style={ styles.tabIcons}>
                      <SVGIcon height={30} fill={'grey'} type={'groups'} width={30} />
                  </TouchableOpacity>
                 : <TouchableOpacity onPress={() => setTab("public")} style={ styles.tabIcons}>
                      <SVGIcon height={30} fill={'grey'} type={'direct3'} width={30} />
                  </TouchableOpacity> 
                }
               </View>
              
           
          </View>

          {/* <View style={styles.searchWrapper}>
              <View style={styles.searchContainer}>
                  <TextInput
                    placeholder="Search"
                    placeholderTextColor='#7A7A7A'
                    autoCapitalize="none"
                    style={styles.searchBox}
                  />
                </View>
          </View> */}

          {tab === "public" ? (
          <>
              <List showGroups={true} navigation={navigation}/>

          </>
          ) : (
          <>
              <List showGroups={false} navigation={navigation}/>
          </>
          )}

    </View>)
}



const HomeStackNavigator = () => (
  //we need home stack navigator to navigate through tab and mainting convos
    <HomeStack.Navigator
      initialRouteName={ROOT_STACK.CONVOS}
      screenOptions={{
        headerTitleStyle: {alignSelf: 'center', fontWeight: 'bold'},
      }}>
         <HomeStack.Group>
            <HomeStack.Screen
              component={Convos}
              name={ROOT_STACK.CONVOS}
              options={noHeaderOptions}
            />
           
      </HomeStack.Group>
      
    </HomeStack.Navigator>
)

const SettingsNavigator = ({navigation}) => (
  //we need home stack navigator to navigate through tab and mainting convos
    <SettingsStack.Navigator
      initialRouteName={'profile'}
      screenOptions={{
        headerTitleStyle: {alignSelf: 'center', fontWeight: 'bold'},
      }}>
         <SettingsStack.Group>
            <SettingsStack.Screen
              component={Settings}
              name={'profile'}
              options={noHeaderOptions}
              initialParams={{ parentNavigation: navigation }}
            />
            <SettingsStack.Screen
              component={Account}
              name={'Account'}
            />

            <SettingsStack.Screen
              component={About}
              name={'About'}
            />
            <SettingsStack.Screen
              component={Support}
              name={'Support'}
            />
           
      </SettingsStack.Group>
      
    </SettingsStack.Navigator>
)

const TabNavigation = () => (
  <BottomSheetModalProvider>
    <Tab.Navigator tabBar={(props) => <BottomTabs {...props} />}>
      <Tab.Screen component={HomeStackNavigator} name='home'  options={noHeaderOptions} />
      <Tab.Screen component={Invitations} name={'invitations'}  options={noHeaderOptions}/>
      <Tab.Screen component={SettingsNavigator} name={'profile'} options={noHeaderOptions}/>
    </Tab.Navigator>
  </BottomSheetModalProvider>
);

export default ({clientReady}: {clientReady: boolean}) => {
  if (!clientReady) return null
  return (  <Stack.Navigator
    initialRouteName={'Main'}
    screenOptions={{
      headerTitleStyle: {alignSelf: 'center', fontWeight: 'bold'},
    }}>
      <Stack.Screen
        component={DrawerNavigator}
        name={'Main'}
        options={noHeaderOptions}
      />
      <Stack.Screen
          component={ChannelScreen}
          name={ROOT_STACK.CHANNEL_SCREEN}
          options={noHeaderOptions}
        />
      <Stack.Screen
          component={GroupInfo}
          name={'Info'}
      />

      <Stack.Screen
          component={StarredMessages}
          name={'Starred'}
      />


      <Stack.Screen
          component={EditGroup}
          name={'EditGroup'}
      />

      


      <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen
                component={NewChatScreen}
                name={ROOT_STACK.NEW_SCREEN}
    
              />
              <Stack.Screen
                component={NewGroupName}
                name={ROOT_STACK.NEW_GROUP_NAME}
    
              />
               <Stack.Screen
                component={AddParticipants}
                name={"AddParticipants"}
    
              />
      </Stack.Group>

    </Stack.Navigator>
  )
}


const styles = StyleSheet.create({

  buttonTitle: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    width: '60%',
    alignSelf: 'center',
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    fontSize: 30,
    marginBottom: 35,
  },
  tabTitle: {
    margin: 10,
    fontWeight: "bold",
    justifyContent: 'flex-start',
    color: colors.dark.secondaryLight,
    fontSize: sizes.lxl,
  },
  tabIcons:{
    margin: 10,
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: 'flex-end'
  },
  tabs: {
    flexDirection: "row",
    //justifyContent: "space-evenly",
    justifyContent: "space-between",
    paddingTop: 10,
    marginTop: 40,
    //backgroundColor: colors.dark.secondary
  },
  icon: {
    marginRight: 10,
  },
  infoWrapper: {
      backgroundColor: '#1C2337',
      paddingBottom: 20,
      borderTopColor: "#2E365A",
      borderTopWidth: 0.5,
  },
  infoContainer: {
      widht: '100%',
      height: 40,
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 10
  },
  infoText: {
      color: colors.dark.text,
      fontWeight: "bold",
      margin: 10,
      textAlign: "center",
      fontSize: 12
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.dark.secondary,
      height: 30,
      marginVertical: 8,
      paddingHorizontal: 8,
      paddingVertical: 5,
      borderRadius: 5,
      width: '95%'
  },
  searchBox: {
      marginLeft: 8,
      fontSize: 12,
      width: '100%',
      color: '#dadada'
  },
  searchWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});