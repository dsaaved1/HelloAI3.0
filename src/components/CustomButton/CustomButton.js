import React from 'react';
import {View, Text, StyleSheet, Pressable, Image} from 'react-native';
import { SVGIcon } from '../SVGIcon';

const CustomButton = ({onPress, text, icon, type = 'PRIMARY', bgColor, fgColor}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        styles[`container_${type}`],
        bgColor ? {backgroundColor: bgColor} : {},
      ]}>
        {icon && 
        
          <View style={{justifyContent:'center', marginRight:10}}>
         
            <SVGIcon height={18} type={icon} width={18} />
          
        </View>
        }
      <Text
        style={[
          styles.text,
          styles[`text_${type}`],
          fgColor ? {color: fgColor} : {},
        ]}>
        {text}
      </Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',

    padding: 15,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },

  container_PRIMARY: {
    backgroundColor: '#3B71F3',
  },

  container_SECONDARY: {
    borderColor: '#3B71F3',
    borderWidth: 2,
  },

  container_TERTIARY: {},

  text: {
    fontWeight: 'bold',
    color: 'white',
  },

  text_SECONDARY: {
    color: '#3B71F3',
  },

  text_TERTIARY: {
    color: 'gray',
  },
});

export default CustomButton;
