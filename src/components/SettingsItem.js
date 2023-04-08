import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SVGIcon } from './SVGIcon';
import logo from '../images/logo.png'

const SettingsItem = ({ title, onPress, isLast }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
      <Image source={logo} style={styles.itemIcon} />
      <View style={styles.textContainer}>
        <View style={!isLast ? styles.rowWithBorder : {}}>
          <Text style={styles.itemText}>{title}</Text>
          <SVGIcon height={12} type='edit-text' width={12} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      //paddingHorizontal: 16,
      paddingVertical: 12,
    },
    itemIcon: {
      width: 24,
      height: 24,
      marginRight: 16,
      marginLeft: 20
    },
    textContainer: {
      flex: 1,
      paddingHorizontal: 16,
    },
    itemText: {
      fontSize: 16,
      color: '#4d4d4d',
    },
    rowWithBorder: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderColor: 'rgba(128, 128, 128, 0.3)',
      },
    arrowIcon: {
      width: 12,
      height: 12,
      tintColor: '#8e8e8e',
    },
  });
  
  export default SettingsItem;