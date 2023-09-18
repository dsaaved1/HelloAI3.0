import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
//import { useKeyboard } from '../hooks/useKeaboard';
import { SCText } from './SCText';
import { SVGIcon } from './SVGIcon';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ROOT_STACK } from '../stacks/RootStack'


const styles = StyleSheet.create({
  tabContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  tabListContainer: {
    //borderTopWidth: 0.5,
    flexDirection: 'row',
  },
  tabTitle: {
    fontSize: 12,
    color: '#bdc3c7'
  },
});

export const BottomTabs = ({ navigation, state }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  //const { isOpen } = useKeyboard();
  const getTitle = (key) => {
    // eslint-disable-next-line default-case
    //doesn't work even for root stack
    switch (key) {
      case 'home':
        return {
          icon: <SVGIcon height={25} type='home-tab' width={25} />,
          iconActive: <SVGIcon height={25} type='home-tab-active' width={25} />,
          title: 'Home',
        };
      case 'invitations':
        return {
          icon: <SVGIcon height={25} type='dm-tab' width={25} />,
          iconActive: (
            <SVGIcon height={25} type='dm-tab-active' width={25} />
          ),
          title: 'Invitations',
        };
        case 'profile':
        return {
          icon: <MaterialCommunityIcons name="account-outline" size={25} color="#dce7eb" />,
          iconActive: <MaterialCommunityIcons name="account" size={25} color="#fff" />,
          title: 'Profile',
        };
    }
  };

  /**
   * TODO: For some reason bottom tabs show above the keyboard
   */
  if (Platform.OS === 'android' 
  //&& isOpen
  ) {
    return null;
  }

  return (
    <View
      style={[
        {
          backgroundColor:  '#1C2337',
          borderTopColor: colors.border,
          paddingBottom: insets.bottom,
        },
        styles.tabListContainer,
      ]}>
      {state.routes.map((route, index) => {
        const tab = getTitle(route.name);

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            target: route.key,
            type: 'tabPress',
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.name}
            onPress={onPress}
            style={styles.tabContainer}>
            {isFocused ? tab.iconActive : tab.icon}
            <SCText style={styles.tabTitle}>{tab.title}</SCText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
