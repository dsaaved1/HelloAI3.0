import React, {useState, useRef} from 'react';
import {
  View,
  TextInput,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageSourcePropType,
  Pressable,
} from 'react-native';
import styled from 'styled-components/native';
import {colors} from '../common/colors/index';
import Header from '../components/Header';
import Spacer from '../containers/Spacer/Spacer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import MenuItem from '../components/MenuItem';
import {useRoute} from '@react-navigation/native';
import {T14} from '../common/Typography/index';
import BottomAlert from '../components/BottomAlert';

interface Contact {
  name: string;
  image: ImageSourcePropType;
  about: string;
  id: number;
}

function AddParticipants() {
  const {params} = useRoute();
  const [contacts, setContacts] = useState<Contact[]>(params?.contacts);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [showAddAlert, setShowAddAlert] = useState<boolean>(false);
  const [showRemoveAlert, setShowRemoveAlert] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  function handleSearch(text: string) {
    setSearchTerm(text);
  }

  function filterContacts(): Contact[] {
    const clonedContacts = [...contacts];
    clonedContacts.sort((a, b) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return clonedContacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  function groupContacts(): {[key: string]: Contact[]} {
    return filterContacts().reduce((groupedContacts, contact) => {
      const firstLetter = contact.name.charAt(0).toUpperCase();
      if (!groupedContacts[firstLetter]) {
        groupedContacts[firstLetter] = [];
      }
      groupedContacts[firstLetter].push(contact);
      return groupedContacts;
    }, {});
  }

  function scrollToLetter(letter: string) {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: 0, x: 0, animated: true});
      setTimeout(() => {
        scrollViewRef.current.scrollTo({
          y: refs[letter].y,
          x: 0,
          animated: true,
        });
      }, 200);
    }
  }

  const onContactPress = (contact: Contact) => {
    if (selectedContacts.findIndex(obj => obj.id === contact.id) === -1) {
      setSelectedContacts(prev => [...prev, contact]);
    }
  };

  const removeSelectedContact = (objectToRemoveId: number) => {
    setSelectedContacts(prevState =>
      prevState.filter(item => item.id !== objectToRemoveId),
    );
  };

  const displayNames = (contacts: Contact[]) => {
    if (contacts.length === 0) {
      return 'No contacts';
    } else if (contacts.length === 1) {
      return `${contacts[0].name}`;
    } else if (contacts.length === 2) {
      return `${contacts[0].name}, ${contacts[1].name}`;
    } else {
      return `${contacts[0].name}, ${contacts[1].name}, and ${
        contacts.length - 2
      } others`;
    }
  };

  const groups = groupContacts();
  const refs: {[key: string]: {y: number}} = {};

  return (
    <Wrapper style={{flex: 1}}>
      <Header
        headerTitle="Add Participants"
        onRightButtonPress={() => setShowAddAlert(true)}
        leftButtonText="Cancel"
        rightButtonText="Add"
        subText={`${selectedContacts.length}/${contacts.length}`}
      />
      <Spacer height={20} />
      <InputWrapper>
        <AntDesign name="search1" color={colors.lightGray} size={20} />
        <Spacer width={8} />

        <TextInput
          placeholder="Search"
          value={searchTerm}
          onChangeText={handleSearch}
          placeholderTextColor={colors.lightGray}
          style={{
            fontSize: 18,
            color: colors.lightGray,
            flex: 1,
          }}
        />
      </InputWrapper>
      {selectedContacts.length > 0 && <Spacer height={20} />}
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedContacts.length > 0 &&
            selectedContacts.map((item, index) => (
              <Fragment key={index}>
                <MainSelectedContactWrap
                  style={{marginLeft: index > 0 ? 20 : 0}}>
                  <SelectedContactWrap>
                    <Image
                      source={item.image}
                      style={{height: '100%', width: '100%'}}
                      resizeMode="cover"
                    />
                  </SelectedContactWrap>
                  <T14 color={colors.white}>{item.name}</T14>
                  <Pressable
                    style={{position: 'absolute', right: 0}}
                    onPress={() => removeSelectedContact(item.id)}>
                    <Entypo
                      name="circle-with-cross"
                      size={20}
                      color={colors.gray}
                    />
                  </Pressable>
                </MainSelectedContactWrap>
              </Fragment>
            ))}
        </ScrollView>
      </View>
      <Spacer height={20} />
      <MenuItem
        mainText="Invite to Group via link"
        rightIcon={false}
        plainText={true}
        plainTextWithLeftLinkIcon
      />
      <Spacer height={20} />
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', flex: 1, paddingHorizontal: '3%'}}>
          <View style={{flex: 8}}>
            <ScrollView
              ref={scrollViewRef}
              showsVerticalScrollIndicator={false}>
              {Object.keys(groups).map(letter => (
                <View
                  key={letter}
                  onLayout={event => (refs[letter] = event.nativeEvent.layout)}>
                  <Text style={{color: colors.white}}>{letter}</Text>
                  {groups[letter].map((contact: any, index: number) => (
                    <MenuItem
                      isContact={true}
                      contactProfile={contact?.image}
                      mainText={contact?.name}
                      subText={contact?.about}
                      key={index}
                      rightIcon={false}
                      onPress={() => onContactPress(contact)}
                    />
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
          <View style={{flex: 1, paddingTop: '10%'}}>
            <ScrollView>
              {Object.keys(groups).map(letter => (
                <TouchableOpacity
                  key={letter}
                  onPress={() => scrollToLetter(letter)}
                  style={{marginLeft: 'auto'}}>
                  <Text style={{color: colors.blue}}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </View>
      <BottomAlert
        visible={showAddAlert}
        description={`Add ${displayNames(selectedContacts)} to 'Wills' Group?`}
        actions={[
          {
            text: 'Cancel',
            onPress: () => setShowAddAlert(false),
          },
          {
            text: 'Add',
            onPress: () => {},
          },
        ]}
      />
    </Wrapper>
  );
}

export default AddParticipants;

const Wrapper = styled.SafeAreaView`
  flex: 1;
  background-color: ${colors.background};
  padding: 3% 3%;
`;

const InputWrapper = styled.View`
  width: 100%;
  border-radius: 10px;
  background-color: ${colors.gray};
  flex-direction: row;
  align-items: center;
  padding: 0% 3%;
  height: 6%;
`;

const SelectedContactWrap = styled.View`
  height: 70px;
  width: 70px;
  border-radius: 50px;
  overflow: hidden;
`;

const MainSelectedContactWrap = styled.View`
  align-items: center;
`;
