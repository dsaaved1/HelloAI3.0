import {SafeAreaView, StatusBar, Text, View, TouchableOpacity} from 'react-native'
import {colors} from '../theme'
import {flex, sizes} from '../global'
import React from 'react'
import IconButton from './IconButton'
import {useNavigation} from '@react-navigation/native'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { SVGIcon } from './SVGIcon'

export default ({
  title,
  onEditPress, // Add the onEditPress prop here
}: {
  title: string;
  onEditPress?: () => void; // Make the prop optional using '?'
}) => {
  const {goBack} = useNavigation()

  return (
    <SafeAreaView
      style={{
        backgroundColor: colors.dark.secondary,
        ...flex.directionRowItemsCenter,
      }}>
      <StatusBar backgroundColor={colors.dark.secondary} />
      <TouchableOpacity
        onPress={goBack}
        style={{padding: 10, marginLeft: 5}}>
           <SVGIcon height={18} type={'back-button'} width={18}/>
        </TouchableOpacity>
      {/* <IconButton
        onPress={goBack}
        iconName={'ArrowLeft'}
        pathFill={colors.dark.text}
      /> */}
      <View style={{padding: sizes.m, flex: 1,  alignItems: onEditPress ? "center" : "flex-start"}}>
        <Text
          style={{
            color: colors.dark.text,
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          {title}
        </Text>
      </View>
      {onEditPress && ( // Conditionally render the edit icon based on the existence of the onEditPress prop
        <TouchableOpacity onPress={onEditPress} style={{padding:5, marginRight: 10}}>
          <Feather name="edit" size={20} color={colors.dark.text} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  )
}
