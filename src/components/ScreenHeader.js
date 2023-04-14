import { useTheme } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SCText } from './SCText';
import { SlackAppContext } from '../contexts/SlackAppContext';
import { HEADER_HEIGHT } from '../utils';
import {colors} from '../theme'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingLeft: 20,
    paddingRight: 20,
  },
  logo: {
    borderRadius: 5,
    height: 35,
    marginRight: 20,
    width: 35,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export const ScreenHeader = ({ showLogo = false, title }) => {
  const insets = useSafeAreaInsets();
  //const { colors } = useTheme();
  const navigation = useNavigation();
  



  return (
    <>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.dark.secondary,
            //backgroundColor: colors.primary,
            height: HEADER_HEIGHT + insets.top,
            paddingTop: insets.top,
          },
        ]}>
        {showLogo && (
          <TouchableOpacity >
            <Image
              source={{
                uri: 'https://avatars.githubusercontent.com/u/8597527?s=200&v=4',
              }}
              style={styles.logo}
            />
          </TouchableOpacity>
        )}
       {
          title === 'Home' &&
            (Platform.OS === 'android' ? (
              <TouchableOpacity style={{marginLeft:7}} onPress={() => navigation.openDrawer()}>
                <Ionicons name="md-menu" size={30} color={colors.dark.secondaryLight} />
              </TouchableOpacity>
            ) : null)
        }
        <SCText
          style={[
            styles.title,
            {
              color: colors.dark.secondaryLight,
              //color: colors.textInverted,
            },
          ]}>
          {title}
        </SCText>
      </View>
    </>
  );
};
