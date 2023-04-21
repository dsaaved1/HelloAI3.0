import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import {TextInput, LogBox, View, ActivityIndicator } from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import {Chat, OverlayProvider, ThemeProvider} from 'stream-chat-react-native'
//import {user, userToken} from './client'
import {colors, theme} from './theme'
import 'moment/min/moment-with-locales'
import 'moment/min/locales'
import {ChannelPreviewMessengerProps} from 'stream-chat-react-native-core/src/components/ChannelPreview/ChannelPreviewMessenger'
import { MessageProps } from 'stream-chat-react-native-core';
import RootStack from './stacks/RootStack'
import {GestureHandlerRootView} from 'react-native-gesture-handler'

import { Amplify, Auth, Hub } from 'aws-amplify'
import awsconfig from './aws-exports'
import {createStackNavigator} from '@react-navigation/stack'
import {  API, graphqlOperation } from "aws-amplify";
import { getStreamToken } from "./graphql/queries";
import { Alert } from "react-native";
// import {withAuthenticator} from 'aws-amplify-react-native'
// import AuthContext from './contexts/AuthContext'

import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import NewPasswordScreen from './screens/NewPasswordScreen';
import SignInScreen from './screens/SignInScreen';
import SignUpScreen from './screens/SignUpScreen';
import ConfirmEmailScreen from './screens/ConfirmEmailScreen';
import RegisterScreen from './screens/RegisterScreen/RegisterScreen'
import {StreamChat} from 'stream-chat'
import Purchase from 'react-native-purchases';

Amplify.configure(awsconfig)
Auth.configure(awsconfig);
LogBox.ignoreAllLogs();

export type StreamChannel = ChannelPreviewMessengerProps['channel'] | undefined
export type StreamMessageId = string | undefined
export type StreamMessage = MessageProps['message'] | undefined;



type AppContextType = {
  messageInputRef: RefObject<TextInput> | null
  channel: StreamChannel
  setChannel: Dispatch<SetStateAction<StreamChannel>>
  selectedChannelsForEditing: StreamChannel[]
  setSelectedChannelsForEditing: Dispatch<SetStateAction<StreamChannel[]>>
  selectedMessageIdsEditing: StreamMessageId[]
  setSelectedMessageIdsEditing: Dispatch<SetStateAction<StreamMessageId[]>>
  activeMessage: StreamMessage
  setActiveMessage: Dispatch<SetStateAction<StreamMessage>>
  openUserPicker: () => void;

}

export const AppContext = React.createContext<AppContextType>(
  {} as AppContextType,
)
export const useAppContext = () => React.useContext(AppContext)

const chatClient = StreamChat.getInstance('xnspp5s5ggeu')
//   STREAM_API_KEY,
// ) as unknown as ChatContextValue['client']

const App = (
  //{ clientReady }
  ) => {
  const messageInputRef = useRef<TextInput>(null)
  const [channel, setChannel] = useState<StreamChannel>()
  const [clientReady, setClientReady] = useState<boolean>(true)
  const [selectedChannelsForEditing, setSelectedChannelsForEditing] = useState<StreamChannel[]>([])
  const [selectedMessageIdsEditing, setSelectedMessageIdsEditing] = useState<StreamMessageId[]>([])
  const {bottom} = useSafeAreaInsets()

  const [activeMessage, setActiveMessage] = useState<StreamMessage>(undefined);
  const [userPickerVisible, setUserPickerVisible] = useState(false);
  const openUserPicker = () => setUserPickerVisible(true);
  const closeUserPicker = () => setUserPickerVisible(false);


  useEffect(() => {
  
    //this makes sure that the user is logged in before connecting to stream chat
    //and not cause that strange channel list bug
    // const setupClient = async () => {
    //   const connectPromise = chatClient.connectUser({"id": "steve"}, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoic3RldmUifQ.kKzGDfH7yf8a9TWqmibwsdwvNcPmgG9-ug78uPQfPuc')
    //   setClientReady(true)
    //   await connectPromise
    // }

    // setupClient()
  }, [])

  return (
        <NavigationContainer theme={{colors: {background: colors.dark.background}}}>
          <AppContext.Provider
            value={{
              messageInputRef,
              channel,
              setChannel,
              selectedChannelsForEditing,
              setSelectedChannelsForEditing,
              selectedMessageIdsEditing,
              setSelectedMessageIdsEditing,
              activeMessage,
              openUserPicker,
              setActiveMessage,
            }}>
            <GestureHandlerRootView style={{flex: 1}}>
              <OverlayProvider bottomInset={bottom} value={{style: theme}}>
                <ThemeProvider style={theme}>
                  <Chat client={chatClient} enableOfflineSupport>
                    <RootStack clientReady={clientReady} />
                  </Chat>
                </ThemeProvider>
              </OverlayProvider>
            </GestureHandlerRootView>
          </AppContext.Provider>
        </NavigationContainer>
  )
}

export const noHeaderOptions = {
  headerShown: false,
}


// export default () => {
//   return (
//     <SafeAreaProvider>
//       <App />
//     </SafeAreaProvider>
//   )
// }


const Stack = createStackNavigator()

export default () => {

  const [user, setUser] = useState(undefined);
 const [clientReady, setClientReady] = useState<boolean>(false);

  const checkUser = async () => {
    console.log('checkUser')
    try {
      console.log("ssssss")
      const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
  
      console.log("rehrejrh")
      const {name, preferred_username, email} = authUser.attributes;

      const tokenResponse = await API.graphql(graphqlOperation(getStreamToken));
      console.log("tokenResponse", tokenResponse)
      const token = tokenResponse?.data?.getStreamToken;

      console.log("token", token)

      if (!token) {
        Alert.alert("Failed to fetch the token");
        return;
      }

      console.log("before connect")
      await chatClient.connectUser(
        {
          id: preferred_username,
          name: name,
        },
        token
      );
  
      console.log("Connected to Stream Chat");

      setClientReady(true)
      setUser(authUser);
    } catch (e) {
      console.log(e, "this is the error")
      setUser(null);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    const listener = data => {
      if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
        checkUser();
      }
    };

    Hub.listen('auth', listener);
    return () => {
      Hub.remove('auth', listener);
      chatClient.disconnectUser();
    };
  }, []);

  if (user === undefined) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <SafeAreaProvider > 
        {user ? (
            <App clientReady={clientReady}/>
        ) : (
          <NavigationContainer theme={{colors: {background: colors.dark.background}}}>
            <Stack.Navigator screenOptions={{headerShown: false}}>
              <>
                <Stack.Screen name="SignIn" component={SignInScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
                <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
              </>
              </Stack.Navigator>
          </NavigationContainer>
        )}
    </SafeAreaProvider>
  )
}


 