import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,} from 'react-native';
import UserImage from '../images/userImage.jpeg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import {colors} from '../theme'

const FeatureItem = ({ icon, title }) => {
    return (
      <View style={styles.featureItem}>
        <FontAwesome style={styles.featureIcon} color={'#3777f0'} name={icon} size={24} />
        {/* <Image style={styles.featureIcon} source={require('./path/to/feature-icon.png')} /> */}
        <Text style={styles.featureText}>{title}</Text>
      </View>
    );
  };

  const SubscriptionButton = ({ onAccept, title, subtitle, discount }) => {
    return (
      <View style={styles.subscriptionButton}>
        <TouchableOpacity onPress={onAccept} style={[styles.button, discount ? styles.buttonWithBorder : styles.buttonFilled]}>
          {discount && <Text style={styles.discountText}>{discount}</Text>}
          <Text style={styles.buttonTitle}>{title}</Text>
          <Text style={styles.buttonSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

const PaywallScreen = ({ onClose, onAccept }) => {
    const features = [
        'Unlimited questions',
        'Unlock all AI models',
        // 'Unlock AI-Powered Voice Recognition',
        // 'Unlock AI-Powered Image Recognition',
        'Higher word limit',
      ];

  return (
    // <View style={styles.modalBackGround}>
    //     <View style={styles.modalContainer}>
    <SafeAreaView style={{ flex: 1}}>
    <ScrollView style={styles.container}>
         <View style={styles.closeButton}>
        <TouchableOpacity style={{borderRadius: 50}}onPress={onClose}>
          <FontAwesome name="times" color={colors.dark.secondaryLight} size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>HelloAI</Text>
        <View style={styles.proContainer}>
          <MaterialCommunityIcons name="shield-star" size={24} color={'#3777f0'} />
          <Text style={styles.proText}>Pro</Text>
        </View>
      </View>
      
      <View style={styles.brainIconContainer}>
        <Text style={styles.subtitle}>Unlock unlimited access</Text>
        <FontAwesome5 name="brain" size={100} color={'#3777f0'} />
      </View>
      <View style={styles.features}>
        {features.map((feature, index) => (
          <FeatureItem key={index} icon="check" title={feature} />
        ))}
      </View>
      <SubscriptionButton onAccept={onAccept} title="Weekly" subtitle="$3.99/week"/>
      <SubscriptionButton onAccept={onAccept} title="Yearly" subtitle="$39.99/year" discount="Save 80%" />
    </ScrollView>
    </SafeAreaView>
    // </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    padding: 20,
    backgroundColor: colors.dark.background,
    paddingTop: 50,
  },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     left: 10,
//     zIndex: 10,
//   },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    //justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.dark.text,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 50,
    color: colors.dark.text,
  },
  proContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15
  },
  proIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  proText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3777f0',
  },
  brainIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  
  features: {
    marginTop: 20,
    marginBottom: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  featureText: {
    fontSize: 18,
    color: colors.dark.text,
  },
  subscriptionButton: {
    marginBottom: 10,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#3777f0',
  },
  buttonWithBorder: {
    backgroundColor: 'transparent',
  },
  buttonFilled: {
    backgroundColor: '#3777f0',
  },
  discountText: {
    position: 'absolute',
    top: 5,
    right: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3777f0',
  },
  buttonTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonSubtitle: {
    color: '#ffffff',
    fontSize: 14,
  },
});

export default PaywallScreen;