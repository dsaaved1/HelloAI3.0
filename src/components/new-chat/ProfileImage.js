import React, { useState } from  'react';
import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { FontAwesome } from '@expo/vector-icons';
import userImage from '../../assets/images/userImage.jpeg';
import colors from '../../assets/constants/colors';
import IconButton from '../IconButton'
import { SVGIcon } from '../SVGIcon';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const ProfileImage = props => {

    const source = props.uri ?  { uri: props.uri } : userImage;

    const [image, setImage] = useState(source);
    const [isLoading, setIsLoading] = useState(false);

    const showEditButton = props.showEditButton && props.showEditButton === true;
    const showRemoveButton = props.showRemoveButton && props.showRemoveButton === true;

    const Container = props.onPress || showEditButton ? TouchableOpacity : View;

    return (
        <Container style={props.style} onPress={props.onPress}>

            {
                isLoading ?
                <View height={props.size} width={props.size} style={styles.loadingContainer}>
                    <ActivityIndicator size={'small'} color={colors.primary} />
                </View> :
                <Image
                    style={{ ...styles.image, ...{ width: props.size, height: props.size } }}
                    source={image}/>
            }

            {
                showEditButton && !isLoading &&
                <View style={styles.editIconContainer}>
                    <FontAwesome name="pencil" size={15} color="black" />
                </View>
            }
            
            
            {
                showRemoveButton && !isLoading &&
                <View style={styles.removeIconContainer}>
                    <FontAwesome name="close" size={15} color="black" />
                </View>
            }

        </Container>
    )
};

const styles = StyleSheet.create({
    image: {
        borderRadius: 20,
        borderColor: '#979797',
        borderWidth: 1
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.lightGrey,
        borderRadius: 20,
        padding: 8
    },
    removeIconContainer: {
        position: 'absolute',
        bottom: -3,
        right: -3,
        backgroundColor: colors.lightGrey,
        borderRadius: 20,
        padding: 3
    },
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    IconButton: {
        //width: 10, 
        height: 0,
    }
})

export default ProfileImage;