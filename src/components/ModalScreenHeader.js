import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, View, TouchableOpacity } from 'react-native';

import { HEADER_HEIGHT } from '../utils';
import { CloseModalButton } from './CloseModalButton';
import { SCText } from './SCText';
import { Spacer } from './Spacer';
import {colors} from '../theme'
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

export const styles = StyleSheet.create({
  centerContent: {
    flex: 4,
    justifyContent: 'center',
    paddingBottom: 15,
  },
  channelSubTitle: {
    alignContent: 'center',
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 10,
    textAlign: 'center',
    marginRight: 5
  },
  channelTitle: {
    alignContent: 'center',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 10,
    textAlign: 'center',
    //marginTop: 10
  },
  container: {
    alignItems: 'center',
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    height: HEADER_HEIGHT,
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  leftContent: {
    flex: 1,
    paddingBottom: 15,
  },
  rightContent: {
    flex: 1,
    paddingBottom: 15,
  },
});

export const ModalScreenHeader = (props) => {
  const {
    goBack,
    LeftContent = CloseModalButton,
    RightContent = () => <Spacer width={50} />,
    subTitle,
    title,
  } = props;
  //const { colors } = useTheme();

  const colorTitle = title === 'solved' ? '#8E8E' : '#D86F6F' 
  const icon = title === 'solved' ? "checkcircle" : "checkcircleo"
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.dark.secondary,
          
          borderBottomColor: colors.dark.secondary,
        },
      ]}>
      <TouchableOpacity onPress={goBack} style={{padding: 10,}}>
        <Icon name="close" size={25} color='white' />
      </TouchableOpacity>
      <View style={styles.centerContent}>
        <SCText style={[styles.channelTitle, { color: 'white' }]}>
         Thread
        </SCText>
        {!!subTitle && (
          <View style={{ flexDirection: 'row', justifyContent: 'center',}}>
              <SCText style={[styles.channelSubTitle, { color:  colorTitle }]}>
                {subTitle}
              </SCText>
              <AntDesign name={icon} size={15} color={colorTitle} />
          </View>
        )}
      </View>
      <View style={styles.rightContent}>
        {!!RightContent && <RightContent />}
      </View>
    </View>
  );
};
