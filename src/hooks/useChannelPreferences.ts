import {get} from 'lodash'
import {useMMKVObject} from 'react-native-mmkv'

type ChannelPreferences = {
  imageUri: string
  backgroundColor: number[] | undefined
  dimValue: number
}

type ReturnValue = {
  channelPreferences: ChannelPreferences
  setPreferences(value: Partial<ChannelPreferences>): void
  clearPreferences(): void
  getProperty(
    propertyName: keyof ChannelPreferences,
    defaultValue?: any,
  ): ChannelPreferences
  setProperty(propertyName: string, propertyValue: any): void
}

export const DEFAULT_CHANNEL_PREFERENCES = {
  imageUri: 'https://images.unsplash.com/photo-1638489440786-0ab170d0ae9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
  backgroundColor: undefined,
  dimValue: 0.25,
}

export default (channelId: string): ReturnValue => {
  const [
    channelPreferences = DEFAULT_CHANNEL_PREFERENCES,
    setChannelPreferences,
  ] = useMMKVObject<ChannelPreferences>(channelId)

  const setProperty = (propertyName: string, propertyValue: any) =>
    setChannelPreferences({
      ...channelPreferences,
      [propertyName]: propertyValue,
    })

  const setPreferences = (value: Partial<ChannelPreferences>) => {
    setChannelPreferences({...channelPreferences, ...(value as Object)})
  }

  const clearPreferences = () => {
    setChannelPreferences(undefined)
  }

  const getProperty = (
    propertyName: keyof ChannelPreferences,
    defaultValue?: any,
  ): any => get(channelPreferences, propertyName, defaultValue)

  return {
    channelPreferences,
    setPreferences,
    clearPreferences,
    setProperty,
    getProperty,
  }
}
