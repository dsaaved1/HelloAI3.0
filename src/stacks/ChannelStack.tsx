import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'
import {noHeaderOptions, useAppContext} from '../App'
import {ChannelScreen} from '../screens/Channel'
import CustomWallpaper from '../screens/wallpaper/CustomWallpaper'
import WallpaperTypesOverview from '../screens/wallpaper/WallpaperTypesOverview'
import WhatsAppChannelWrapper from '../utils/WhatsAppChannelWrapper'
import ImagePreview from '../screens/ImagePreview'
//import ThreadScreen  from '../screens/ThreadScreen'
import WallpaperTypeDetails from '../screens/wallpaper/WallpaperTypeDetails'
import ChannelHeader from '../components/channel/ChannelHeader'
import { ThreadsBaby } from '../screens/Thread';


const Stack = createStackNavigator()

export enum CHANNEL_STACK {
  CHANNEL_SCREEN = 'ChannelStackChannelScreen',
  IMAGE_PREVIEW = 'ChannelStackImagePreview',
  CUSTOM_WALLPAPER = 'ChannelStackCustomWallpaper',
  WALLPAPER_TYPES_OVERVIEW = 'ChannelStackWallpaperTypesOverview',
  WALLPAPER_TYPE_DETAILS = 'ChannelStackWallpaperTypeDetails',
  THREAD_SCREEN = 'ChannelStackThreadScreen',
  MESSAGE_EXPANDED = 'ChannelStackMessageExpanded',
}

export default () => {
  const {channel} = useAppContext()

  return (
    <WhatsAppChannelWrapper channel={channel}>
      <Stack.Navigator
        initialRouteName={CHANNEL_STACK.CHANNEL_SCREEN}
        screenOptions={{
          headerTitleStyle: {alignSelf: 'center', fontWeight: 'bold'},
        }}>
          <Stack.Group>
            <Stack.Screen
              component={ChannelScreen}
              name={CHANNEL_STACK.CHANNEL_SCREEN}
              options={{
                header: ChannelHeader,
              }}
            />
            <Stack.Screen
              component={ImagePreview}
              name={CHANNEL_STACK.IMAGE_PREVIEW}
              options={noHeaderOptions}
            />
            <Stack.Screen
              component={CustomWallpaper}
              name={CHANNEL_STACK.CUSTOM_WALLPAPER}
              options={noHeaderOptions}
            />
            <Stack.Screen
              component={WallpaperTypesOverview}
              name={CHANNEL_STACK.WALLPAPER_TYPES_OVERVIEW}
              options={noHeaderOptions}
            />
            <Stack.Screen
              component={WallpaperTypeDetails}
              name={CHANNEL_STACK.WALLPAPER_TYPE_DETAILS}
              options={noHeaderOptions}
            />
        </Stack.Group>
        
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
          <Stack.Screen
            component={ThreadsBaby}
            name={CHANNEL_STACK.THREAD_SCREEN}
            options={noHeaderOptions}
          />
        </Stack.Group>
      </Stack.Navigator>
    </WhatsAppChannelWrapper>
  )
}
