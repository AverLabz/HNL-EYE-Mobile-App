import React from 'react';
import {StatusBar} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import constants from '../../constants/constants';

function FocusAwareStatusBar(props){
  const isFocused = useIsFocused();
  return isFocused ? <StatusBar {...props} animated backgroundColor={constants.screenBackgroundWhite} barStyle={'dark-content'}/> : null;
}

export default FocusAwareStatusBar;
