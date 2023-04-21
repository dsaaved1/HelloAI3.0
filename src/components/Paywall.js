import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,} from 'react-native';
import UserImage from '../images/userImage.jpeg';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';

const FeatureItem = ({ icon, title }) => {
    return (
      <View style={styles.featureItem}>
        <FontAwesome style={styles.featureIcon} name={icon} size={24} />
        {/* <Image style={styles.featureIcon} source={require('./path/to/feature-icon.png')} /> */}
        <Text style={styles.featureText}>{title}</Text>
      </View>
    );
  };

  const SubscriptionButton = ({onAccept, title, discount }) => {
    return (
      <View style={styles.subscriptionButton}>
        {discount && <Text style={styles.discountText}>{discount}</Text>}
        <TouchableOpacity onPress={onAccept} style={styles.button}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
      </View>
    );
  };
  

const PaywallScreen = ({ onClose, onAccept }) => {
    const features = [
        'Unlimited questions',
        'Unlock all AI models',
        'Unlock AI-Powered Voice Recognition',
        'Unlock AI-Powered Image Recognition',
        'Higher word limit',
      ];

  return (
    // <View style={styles.modalBackGround}>
    //     <View style={styles.modalContainer}>
    <SafeAreaView style={{ flex: 1}}>
    <ScrollView style={styles.container}>
         <View style={styles.closeButton}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesome name="times" size={24} />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={styles.title}>HelloAI</Text>
        <View style={styles.proContainer}>
          <Image style={styles.proIcon} source={UserImage} />
          <Text style={styles.proText}>Pro</Text>
        </View>
      </View>
      <Text style={styles.subtitle}>Unlock unlimited access</Text>
      <View style={styles.features}>
        {features.map((feature, index) => (
          <FeatureItem key={index} icon="check" title={feature} />
        ))}
      </View>
      <SubscriptionButton onAccept={onAccept} title="Weekly" />
      <SubscriptionButton onAccept={onAccept} title="Yearly" discount="Save 80%" />
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
    backgroundColor: '#ffffff',
    paddingTop: 50
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
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  proContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  proIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  proText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  features: {
    marginBottom: 20,
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
    fontSize: 16,
  },
  subscriptionButton: {
    position: 'relative',
    marginBottom: 10,
  },
  discountText: {
    position: 'absolute',
    top: -10,
    right: 10,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#3777f0',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3777f0',
    borderRadius: 5,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: 30,
    flexDirection: 'column',
  },
  modalContainer: {
    //width: '80%',
    //position: 'absolute',
    flex: 1,
   
    backgroundColor: "#1C2333",
    //paddingHorizontal: 20,
    //paddingVertical: 30,
    borderRadius: 20,
    
  },
});

export default PaywallScreen;