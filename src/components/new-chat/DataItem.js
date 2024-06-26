import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import colors from '../../assets/constants/colors';
import ProfileImage from './ProfileImage';
// import { Ionicons, AntDesign } from '@expo/vector-icons';
import IconButton from '../IconButton'
import { SVGIcon } from '../SVGIcon';

const imageSize = 50;

const DataItem = props => {

    const { title, subTitle, image, type, isChecked, icon } = props;

    const hideImage = props.hideImage && props.hideImage === true;

    return (
        <TouchableWithoutFeedback onPress={props.onPress}>
            <View style={styles.container}>

                {
                    !icon && !hideImage &&
                    <ProfileImage 
                        uri={image}
                        size={imageSize}
                    />
                }

                {
                    icon &&
                    <View style={styles.leftIconContainer}>
                        <IconButton
                    usePressable={false}
                    iconName={'Pause'}
                    pathFill={colors.blue}
                    style={styles.IconButton}
                      />
                        {/* <AntDesign name={icon} size={20} color={colors.blue} /> */}
                    </View>
                }


                <View style={styles.textContainer}>

                    <Text
                        numberOfLines={1}
                        style={{ ...styles.title, ...{ color: type === "button" ? colors.blue : 'white' } }}>
                        {title}
                    </Text>

                    {
                        subTitle &&
                        <Text
                            numberOfLines={1}
                            style={styles.subTitle}>
                            {subTitle}
                        </Text>
                    }

                </View>


                {
                    type === "checkbox" &&
                    <View style={{ ...styles.iconContainer, ...isChecked && styles.checkedStyle }}>
                        {/* <IconButton
                    usePressable={false}
                    iconName={'Play'}
                    pathFill={'white'}
                    style={styles.IconButton}
                      /> */}
                       <SVGIcon height={18} type='check' width={18} />
                        {/* <Ionicons name="checkmark" size={18} color="white" /> */}
                    </View>
                }

                {
                    type === "link" &&
                    <View>
                        <IconButton
                    usePressable={false}
                    iconName={'Play'}
                    pathFill={colors.grey}
                    style={styles.IconButton}
                      />
                        {/* <Ionicons name="chevron-forward-outline" size={18} color={colors.grey} /> */}
                    </View>
                }

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingVertical: 7,
        //borderBottomColor: colors.extraLightGrey,
        borderBottomWidth: 0.2,
        alignItems: 'center',
        minHeight: 70,
        marginVertical:2
    },
    textContainer: {
        marginLeft: 14,
        flex: 1
    },
    title: {
        //fontFamily: 'medium',
        fontSize: 16,
        letterSpacing: 0.3,
        
    },
    subTitle: {
        //fontFamily: 'regular',
        color: colors.lightGrey,
        letterSpacing: 0.3,
        fontSize: 13,
        marginTop:5
    },
    iconContainer: {
        borderWidth: 1,
        borderRadius: 50,
        borderColor: colors.lightGrey,
        backgroundColor: 'white'
    },
    checkedStyle: {
        backgroundColor: '#3777f0',
        //backgroundColor: '#12a383',
        borderColor: 'transparent'
    },
    leftIconContainer: {
        backgroundColor: colors.extraLightGrey,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        width: imageSize,
        height: imageSize
    }
});

export default DataItem;