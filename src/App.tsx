import React, {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react'
import {TextInput, LogBox} from 'react-native'
import {NavigationContainer} from '@react-navigation/native'
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context'
import {Chat, OverlayProvider, ThemeProvider} from 'stream-chat-react-native'
import {chatClient, user, userToken} from './client'
import {colors, theme} from './theme'
import 'moment/min/moment-with-locales'
import 'moment/min/locales'
import {ChannelPreviewMessengerProps} from 'stream-chat-react-native-core/src/components/ChannelPreview/ChannelPreviewMessenger'
import { MessageProps } from 'stream-chat-react-native-core';
import RootStack from './stacks/RootStack'
import {GestureHandlerRootView} from 'react-native-gesture-handler'
// import { Amplify, Auth } from 'aws-amplify'
// import awsconfig from './aws-exports'
// import {withAuthenticator} from 'aws-amplify-react-native'
// import AuthContext from './contexts/AuthContext'

// import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
// import NewPasswordScreen from './screens/NewPasswordScreen';
// import SignInScreen from './screens/SignInScreen';
// import SignUpScreen from './screens/SignUpScreen';
// import ConfirmEmailScreen from './screens/ConfirmEmailScreen';

// Amplify.configure(awsconfig)
// Auth.configure(awsconfig);
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

const App = () => {
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
    const setupClient = async () => {
      const connectPromise = chatClient.connectUser(user, userToken)
      setClientReady(true)
      await connectPromise
    }

    setupClient()
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


export default () => {
  return (
    <SafeAreaProvider>
      <App />
    </SafeAreaProvider>
  )
}


// const Stack = createStackNavigator()

// export default () => {

//   const [user, setUser] = useState(undefined);

//   const checkUser = async () => {
//     console.log('checkUser')
//     try {
//       const authUser = await Auth.currentAuthenticatedUser({bypassCache: true});
//       const {name, preferred_username, email} = authUser.attributes;

//       const tokenResponse = await API.graphql(graphqlOperation(getStreamToken));
//       const token = tokenResponse?.data?.getStreamToken;

//       if (!token) {
//         Alert.alert("Failed to fetch the token");
//         return;
//       }

//       await chatClient.connectUser(
//         {
//           id: preferred_username,
//           name: name,
//           image:
//             "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png",
//         },
//         token
//       );
  
//       console.log("Connected to Stream Chat");

//       console.log("name", name)
//       console.log("preferred_username", preferred_username)
//       console.log("email", email)
//       setUser(authUser);
//     } catch (e) {
//       console.log(e, "this is the error")
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     checkUser();
//   }, []);

//   useEffect(() => {
//     const listener = data => {
//       if (data.payload.event === 'signIn' || data.payload.event === 'signOut') {
//         checkUser();
//       }
//     };

//     Hub.listen('auth', listener);
//     return () => {
//       Hub.remove('auth', listener);
//       chatClient.disconnectUser();
//     };
//   }, []);

//   if (user === undefined) {
//     return (
//       <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
//         <ActivityIndicator />
//       </View>
//     );
//   }
//   return (
//     <SafeAreaProvider > 
//         {user ? (
//             <App/>
//         ) : (
//           <NavigationContainer>
//             <Stack.Navigator screenOptions={{headerShown: false}}>
//               <>
//                 <Stack.Screen name="SignIn" component={SignInScreen} />
//                 <Stack.Screen name="SignUp" component={SignUpScreen} />
//                 <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
//                 <Stack.Screen
//                   name="ForgotPassword"
//                   component={ForgotPasswordScreen}
//                 />
//                 <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
//               </>
//               </Stack.Navigator>
//           </NavigationContainer>
//         )}
//     </SafeAreaProvider>
//   )
// }


 