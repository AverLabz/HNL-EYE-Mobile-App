import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import constants from '../constants/constants';

const CmToggleButton = () => {
  const [isVisited, setIsVisited] = useState(true);
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, isVisited && styles.selectedButton]}
        onPress={() => setIsVisited(true)}
        disabled={isVisited}>
        <Text style={[styles.buttonText, isVisited && styles.selectedButtonText]}>
          Telco (WO)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.8}
        style={[styles.button, !isVisited && styles.selectedButton]}
        onPress={() => setIsVisited(false)}
        disabled={!isVisited}>
        <Text style={[styles.buttonText, !isVisited && styles.selectedButtonText]}>
          Non-Telco (WO)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CmToggleButton;

const styles = StyleSheet.create({
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
    color:constants.textWhite,
  },


});