import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';
import constants from '../../constants/constants';
import Accepted from '../Tab/Accepted';
import Pending from '../Tab/Pending';

const NonTelcoInventory = () => {
    const Tab = createMaterialTopTabNavigator();
  return (
  
          <Tab.Navigator
              screenOptions={{
                  tabBarScrollEnabled: false,
              }}
              tabBarOptions={{
                  activeTintColor: constants.colorPrimary,
                  inactiveTintColor: constants.colorPrimary,
                  scrollEnabled: true,
                  indicatorStyle: {
                      backgroundColor: constants.colorPrimary,
                  },
              }}
          >
          <Tab.Screen name="Pending" component={Pending} options={{ tabBarLabel: 'Pending' }} />
          <Tab.Screen name="Accepted" component={Accepted} options={{ tabBarLabel: 'accepted' }} />
            

          </Tab.Navigator>
  
  )
}

export default NonTelcoInventory

const styles = StyleSheet.create({})