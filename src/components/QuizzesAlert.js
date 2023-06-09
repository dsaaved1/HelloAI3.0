import React, { useState, useEffect } from 'react';
import { Modal, StyleSheet, View, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { KeyboardAvoidingView, Platform } from 'react-native';
import {dw} from '../utils/dimension';
import {useNavigation} from '@react-navigation/native'
import { CHANNEL_STACK } from '../stacks/ChannelStack';
import FeatherIcons from 'react-native-vector-icons/Feather';

const QuizzesAlert = 
(props ) => {
  const { route } = props;
  const { onSubmit } = route.params;

//({ visible, onPress, onSubmit})  => {
  const [activePrompt, setActivePrompt] = useState('Prompt');
  const [activeQuestion, setActiveQuestion] = useState('Question');
  const [activeOptions, setActiveOptions] = useState('Options');
  const [options, setOptions] = useState(['']);
  const [Prompt, setPrompt] = useState('');
  const [question, setQuestion] = useState('');
  const [optionValues, setOptionValues] = useState(['']);
  const navigation = useNavigation()
  
  useEffect(() => {
    if (activePrompt === 'AI Generate') {
      setPrompt('AI Generate');
    } else if (activePrompt === 'Prompt') {
      setPrompt('');
    }
    
  }, [activePrompt]);

  useEffect(() => {
   
    if (activeQuestion === 'AI Generate') {
      setQuestion('AI Generate');
    } else if (activeQuestion === 'Question') {
      setQuestion('');
    }
  
  }, [activeQuestion]);

  useEffect(() => {
  
    if (activeOptions === 'AI Generate') {
      setOptionValues(['AI Generate']);
    } else if (activeOptions === 'Options') {
      setOptionValues(['']);
    }
  }, [activeOptions]);


  const isSubmitActive = () => {
    if (
      (activePrompt === 'Prompt' && Prompt === '') ||
      (activeQuestion === 'Question' && question === '') ||
      (activeOptions === 'Options' && optionValues.some(v => v === '')) || 
      (optionValues[0] !== 'AI Generate' && Prompt === 'AI Generate' && question === 'AI Generate') ||
      (optionValues[0] === 'AI Generate' && Prompt === 'AI Generate' && question === 'AI Generate') ||
      (optionValues[0] !== 'AI Generate' && Prompt !== 'AI Generate' && question === 'AI Generate') 
    ) {
      return false;
    }
    return true;
  };

  const addOption = () => {
    if (options.length < 8) {
      setOptions([...options, '']);
      setOptionValues([...optionValues, '']);
    }
  };

  const removeOption = () => {
    if (options.length > 1) {
      const newOptions = [...options];
      newOptions.pop();
      setOptions(newOptions);

      const newOptionValues = [...optionValues];
      newOptionValues.pop();
      setOptionValues(newOptionValues);
    }
  };

  const handleChange = (text, index) => {
    const newOptionValues = [...optionValues];
    newOptionValues[index] = text;
    setOptionValues(newOptionValues);
  };

  const handleSubmit =  () => {
    if (isSubmitActive()) {
        onSubmit(Prompt, question, optionValues);
        navigation.navigate(CHANNEL_STACK.CHANNEL_SCREEN)
    }
  };



  return (
    
    // <KeyboardAvoidingView 
    //   behavior={Platform.OS === "ios" ? "padding" : "height"} 
    //   style={{ flex: 1 }}
    // >
    // <View style={{...styles.contentWrapper, backgroundColor: 'rgba(0,0,0,0.7)', display: visible ? 'flex' : 'none'}}>
      
    //   <Modal visible={visible} transparent={true} animationType="slide">
      
        <View style={styles.contentWrapper}>
      
     
          <TouchableOpacity 
            style={{ alignSelf: 'flex-start', marginLeft: 15, marginVertical: 5 }} 
            onPress={() => navigation.goBack()}
          >
            <FeatherIcons name="chevron-down" size={25} color="#859299" />
          </TouchableOpacity>

          
          <View style={styles.actionsWrapper}>
         
           
          <View style={{marginTop: 40, marginBottom: 7}}>
             {/* <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}> */}
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                <TouchableOpacity style={{marginRight: 10}} onPress={() => { setActivePrompt('Prompt'); }}>
                  <Text style={[styles.centeredText, activePrompt === 'Prompt' ? styles.activeText : styles.inactiveText]}>Prompt</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setActivePrompt('AI Generate'); }}>
                  <Text style={[styles.centeredText, activePrompt === 'AI Generate' ? styles.activeText : styles.inactiveText]}>AI Generate</Text>
                </TouchableOpacity>
              </View>
             
                {activePrompt === 'Prompt' && <TextInput style={styles.inputBox} placeholder="Enter Prompt" onChangeText={text => setPrompt(text)} placeholderTextColor="grey"/>}

            </View>
            
            <View style={{marginTop: 10, marginBottom: 7}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                <TouchableOpacity style={{marginRight: 10}} onPress={() => { setActiveQuestion('Question'); }}>
                  <Text style={[styles.centeredText, activeQuestion === 'Question' ? styles.activeText : styles.inactiveText]}>Question</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveQuestion('AI Generate'); }}>
                  <Text style={[styles.centeredText, activeQuestion === 'AI Generate' ? styles.activeText : styles.inactiveText]}>AI Generate</Text>
                </TouchableOpacity>
              </View>

              {activeQuestion === 'Question' && <TextInput style={styles.inputBox} placeholder="Enter Question" onChangeText={text => setQuestion(text)} placeholderTextColor="grey"/>}
     
            </View>

            <View style={{marginTop: 10, marginBottom: 7}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10}}>
                <TouchableOpacity style={{marginRight: 10}} onPress={() => { setActiveOptions('Options'); }}>
                  <Text style={[styles.centeredText, activeOptions === 'Options' ? styles.activeText : styles.inactiveText]}>Options</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setActiveOptions('AI Generate'); }}>
                  <Text style={[styles.centeredText, activeOptions === 'AI Generate' ? styles.activeText : styles.inactiveText]}>AI Generate</Text>
                </TouchableOpacity>
              </View>
             
                {activeOptions === 'Options' && options.map((option, index) => (
                  <TextInput key={index} style={styles.inputBox} placeholder={`Option ${index + 1}`} onChangeText={text => handleChange(text, index)} placeholderTextColor="grey"/>
                ))}
            
              {activeOptions === 'Options' && 
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                  <TouchableOpacity onPress={addOption}>
                    <Text style={styles.centeredText}>+</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={removeOption}>
                    <Text style={styles.centeredText}>-</Text>
                  </TouchableOpacity>
                </View>
              }
            
            </View>

            <TouchableOpacity 
                onPress={handleSubmit} 
                style={isSubmitActive() ? styles.submitButtonActive : styles.submitButtonInactive}
            >
               <Text style={isSubmitActive() ? styles.submitButtonTextActive : styles.submitButtonTextInactive}>SUBMIT</Text>
            </TouchableOpacity>

  
          </View>
       

          {/* <TouchableOpacity onPress={onPress} style={{...styles. cancelButton, borderRadius: 12}}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity> */}
 
        </View>
      
    //   </Modal>
      
    // </View>
    // </KeyboardAvoidingView>

  );
};

const styles = StyleSheet.create({
  contentWrapper: {
    //position: 'absolute',
    //height: '100%',
    width: '100%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 10,
    
  },
  actionsWrapper: {
    backgroundColor: '#1C2337',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: dw - 40,
    //height: 280
  },
   cancelButton: {
    width: dw - 40,
    minHeight: 56,
    justifyContent:  'center',
    alignItems: 'center',
    backgroundColor: '#1C2337',
    borderRadius: 0,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  submitButtonActive:{
    backgroundColor: 'rgba(149, 149, 149, 1)',
    justifyContent:  'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 55,
    marginTop: 30
  },
  submitButtonInactive:{
    backgroundColor: 'rgba(149, 149, 149, 0.3)',
    justifyContent:  'center',
    alignItems: 'center',
    borderRadius: 15,
    paddingVertical: 12,
    paddingHorizontal: 28,
    marginBottom: 55,
    marginTop: 30
  },
  submitButtonTextActive: {
    color: 'rgba(255, 255, 255, 1)', // white
    fontSize: 16,
    fontWeight: 'bold'
  },
  submitButtonTextInactive: {
    color: 'rgba(255, 255, 255, 0.3)', // semi-transparent white
    fontSize: 16,
    fontWeight: 'bold'
  },
  cancelText: {
    fontSize: 20,
    fontWeight: '600',
    color: 'white'
  },
  messageText: {
    fontSize: 13,
    color: 'gray',
    fontWeight: '400',
    lineHeight: 18,
  },
  centeredText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 12,
    fontWeight: '600'
  },
  activeText: {
      color: 'white',
    },
    inactiveText: {
      color: 'gray',
    },
  inputBox: {
    //height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: dw - 110,
    marginBottom: 10,
    borderRadius: 7,
    color: 'white',
    fontSize: 11,
    paddingHorizontal: 7,
    paddingVertical: 7
  },
  
});

export default QuizzesAlert;


