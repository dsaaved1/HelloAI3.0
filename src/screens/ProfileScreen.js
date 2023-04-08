import { useTheme } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SCText } from '../components/SCText';
import { SVGIcon } from '../components/SVGIcon';
import { notImplemented } from '../utils';
import { chatClient} from '../client'
import { ScreenHeader } from '../components/ScreenHeader';


const styles = StyleSheet.create({
  actionItemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 50,
  },
  actionItemSection: {},
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
  },
  status: {
    fontSize: 12,
    fontWeight: '400',
  },
  userDetails: {
    flex: 1,
    flexDirection: 'column',
    flexGrow: 1,
    padding: 8,
    paddingLeft: 20,
  },
  userImage: {
    borderRadius: 7,
    height: 70,
    width: 70,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logout: {
    color: "white",
    fontWeight: "bold",
    margin: 10,
    textAlign: "center",
  },
});



/** @todo: Cleanup styling */
export const ProfileScreen = () => {
  const { colors } = useTheme();

  const logout = () => {
    chatClient.disconnectUser();
   //Auth.signOut();
  };

  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
      }}>
      <View style={{ flex: 1 }}>
        <ScreenHeader title='Profile' />
        <View style={styles.container}>
          <View style={styles.row}>
            <View>
              <Image
                source={{
                  uri: chatClient.user.image,
                }}
                style={styles.userImage}
              />
            </View>
            <View style={styles.userDetails}>
              <SCText style={styles.userName}>
                {chatClient.user.name} {chatClient.user.status}
              </SCText>
              <SCText style={styles.status}>{chatClient.user.id}</SCText>
            </View>
          </View>
          <TouchableOpacity
            onPress={notImplemented}
            style={[
              {
                borderRadius: 10,
                borderWidth: 1,
                marginTop: 20,
                padding: 13,
                paddingLeft: 20,
              },
              {
                borderColor: '#dce7eb'
                //borderColor: colors.border,
              },
            ]}>
            <SCText style={{ fontSize: 14 }}>Whats your status</SCText>
            {/* <Icon name="md-checkmark-circle" size={32} color="green" /> */}

          </TouchableOpacity>
          <View
            style={{
              marginTop: 30,
            }}>
            <View
              style={[
                styles.actionItemSection,
                {
                  borderTopColor: '#dce7eb',
                  //borderTopColor: colors.border,
                  borderTopWidth: 0.5,
                },
              ]}>
              <TouchableOpacity
                onPress={notImplemented}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'dnd'} width='23' />
                <SCText style={{ paddingLeft: 20 }}>{'Do not disturb'}</SCText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={notImplemented}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'away'} width='23' />
                <SCText style={{ paddingLeft: 20 }}>
                  {'Set yourself away'}
                </SCText>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.actionItemSection,
                {
                  borderTopColor: '#dce7eb',
                  //borderTopColor: colors.border,
                  borderTopWidth: 0.5,
                },
              ]}>
              <TouchableOpacity
                onPress={notImplemented}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'notifications'} width='23' />
                <SCText style={{ paddingLeft: 20 }}>{'Notifications'}</SCText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={notImplemented}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'preferences'} width='23' />
                <SCText style={{ paddingLeft: 20 }}>{'Preferences'}</SCText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={notImplemented}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'saved-items'} width='23' />
                <SCText style={{ paddingLeft: 20 }}>{'Saved items'}</SCText>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={notImplemented}
                style={styles.actionItemContainer}>
                <SVGIcon height='23' type={'view-profile'} width='23' />
                <SCText style={{ paddingLeft: 20 }}>{'View profile'}</SCText>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.logout} onPress={logout}>
              Logout
           </Text>
          </View>
        </View>
        {/* <View>
          <SettingsItem title="Participant 1" onPress={() => {}} />
          <SettingsItem title="Participant 2" onPress={() => {}} />
          <SettingsItem title="Participant 3" onPress={() => {}} isLast={true} />
        </View> */}
      </View>
    </View>
  );
};
