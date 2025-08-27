
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import constants from '../../constants/constants';

const Loader = ({ animating }) => {


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ borderRadius: 10, backgroundColor: 'white', padding: 25 }}>
        {/* <Text style={{ fontSize: 16, fontWeight: '200' }}>Loading</Text> */}
        <ActivityIndicator animating={animating} size="large" color={constants.colorPrimary} />
      </View>
    </View>
  );
}


export default Loader;