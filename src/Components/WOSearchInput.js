import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Search from '../ImageAssets/Svg/Search.svg';
import constants from '../constants/constants';

const WOSearchInput = ({ value, onChangeText, onSubmitEditing,IsTelco, onTelcoPress,onNonTelcoPress }) => {
    
    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <Search style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    placeholderTextColor={constants.inActiveTabColor}
                    onChangeText={onChangeText}
                    value={value}
                    onSubmitEditing={onSubmitEditing}
                />
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, IsTelco && styles.selectedButton]}
                    onPress={onTelcoPress}>
                    <Text style={[styles.buttonText, IsTelco && styles.selectedButtonText]}>
                        Telco (WO)
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.8}
                    style={[styles.button, IsTelco === false && styles.selectedButton]}
                    onPress={onNonTelcoPress}>
                    <Text style={[styles.buttonText, IsTelco === false && styles.selectedButtonText]}>
                        Non-Telco (WO)
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default WOSearchInput;

const styles = StyleSheet.create({
    container: {
        padding: 14,
        borderBottomWidth: 0.5,
        borderColor: constants.lightGrayBorder,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: constants.lightGrayBorder,
        marginBottom: 10,
        marginTop: 15,
        borderRadius: 10,
    },
    searchIcon: {
        marginRight: 10,
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontFamily: constants.fontMedium,
        color: constants.defaultTextBlack,
        fontSize: 14,
        lineHeight: 17.7
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 20,
        justifyContent: 'space-between',
        marginTop: 10,
    },
    button: {
        flex: 1,
        borderRadius: 25,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: constants.nonActiveButton,
    },
    selectedButton: {
        backgroundColor: constants.red,
    },
    buttonText: {
        fontFamily: constants.fontMedium,
        fontSize: 13,
        color: constants.inActiveTabColor,
        lineHeight: 15.85,
    },
    selectedButtonText: {
        color: constants.textWhite,
    },
});