import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import {useRoute} from '@react-navigation/native';
import {Auth} from 'aws-amplify';
import {colors} from '../../theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';


const RegisterScreen = () => {
    const route = useRoute();
    const {control, handleSubmit, watch} = useForm({
      defaultValues: { email: route?.params?.email},
    });
    const pwd = watch('password');
    const navigation = useNavigation();

    const goBack = () => {
        navigation.goBack();
      };

    const onRegisterPressed = async data => {
        const {password, name, username, email} = data;
       
        try {

            await Auth.signUp({
                username,
                password,
                attributes: {email, name, preferred_username: username},
              });
        
            navigation.navigate('ConfirmEmail', {username});
        } catch (e) {
          Alert.alert('Oops', e.message);
        }
      };
  

  const onTermsOfUsePressed = () => {
    console.warn('onTermsOfUsePressed');
  };

  const onPrivacyPressed = () => {
    console.warn('onPrivacyPressed');
  };

  return (
    <SafeAreaView>
    
      <View style={styles.root}>
      <Ionicons
          name="arrow-back"
          size={24}
          color={colors.dark.secondaryLight}
          style={styles.backIcon}
          onPress={goBack}
        />
      <Text style={styles.title}>Register</Text>
       

      <Text style={styles.subTitle}>Pick a username</Text>
      <CustomInput
          name="username"
          control={control}
          placeholder="Username (e.g. johndoe123)"
          rules={{
            required: 'Username is required',
            minLength: {
              value: 3,
              message: 'Username should be at least 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Username should be max 24 characters long',
            },
          }}
        />
        <Text style={styles.info}>You won't be able to change this later!</Text>

        <Text style={styles.subTitle}>Pick a name</Text>
        <CustomInput
          name="name"
          control={control}
          autoCapitalize="none"
          placeholder="Display Name (e.g. John Doe)"
          rules={{
            required: 'Name is required',
            minLength: {
              value: 3,
              message: 'Name should be at least 3 characters long',
            },
            maxLength: {
              value: 24,
              message: 'Name should be max 24 characters long',
            },
          }}
        />
        <Text style={{...styles.info}}>You can always change this later!</Text>

       
       
        <CustomInput
          name="password"
          autoCapitalize="none"
          control={control}
          placeholder="Password"
          secureTextEntry
          rules={{
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password should be at least 8 characters long',
            },
          }}
        />
        <Text style={styles.info}>Passwords must be at least 8 characters long!</Text>
        <CustomInput
          name="password-repeat"
          autoCapitalize="none"
          control={control}
          placeholder="Repeat Password"
          secureTextEntry
          rules={{
            validate: value => value === pwd || 'Password do not match',
          }}
        />
        <Text style={{...styles.info,marginBottom: 20}}>Passwords must be at least 8 characters long!</Text>

        <CustomButton
          text="Register"
          onPress={handleSubmit(onRegisterPressed)}
        />

        <Text style={styles.text}>
          By registering, you confirm that you accept our{' '}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{' '}
          and{' '}
          <Text style={styles.link} onPress={onPrivacyPressed}>
            Privacy Policy
          </Text>
        </Text>


      </View>
    
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    root: {
        padding: 20,
       // marginTop: Platform.OS === 'android' ? 20 : 100,
      },
      backIcon: {
        alignSelf: 'flex-start',
        marginBottom: 10,
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#3B71F3',
        marginBottom: 25,
        marginTop: -8,
        alignSelf: 'center',
      },
      subTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.dark.secondaryLight,
        alignSelf: 'flex-start',
        //marginTop: 10,
        marginBottom: 5,
      },
      info: {
        color: 'gray',
        alignSelf: 'flex-start',
        marginBottom: 15,
        fontSize: 10
      },
      text: {
        color: 'gray',
        marginVertical: 10,
      },
      link: {
        color: '#FDB075',
      },
});

export default RegisterScreen;