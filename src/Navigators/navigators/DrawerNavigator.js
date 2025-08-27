import React, { } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawerContent from '../navigators/CustomDrawerContent';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Dashboard from '../../Screens/Dashboard/Dashboard';
import ToCheckScreen from '../../Screens/Home/ToCheckScreen';
import PMWOScreen from '../../Screens/WO/PMWOScreen';
import CMWOScreen from '../../Screens/WO/CMWOScreen';
import ManageInventoryParent from '../../Screens/ManageInventory/ManageInventoryParent';
import NonTelcoInventory from '../../Screens/ManageInventory/NonTelcoInventory';
import FilterWithSiteFilterOnly from '../../Screens/Filters/FilterWithSiteFilterOnly';
import ScanInventoryTabs from '../../Screens/ScanInventory/ScanInventoryTabs';
import constants from '../../constants/constants';
import { Image, StyleSheet } from 'react-native';
import HomeIcon from '../../ImageAssets/Svg/HomeIcon'
import AttendanceIcon from '../../ImageAssets/Svg/AttendanceIcon'
import WorkOrderIcon from '../../ImageAssets/Svg/WorkOrderIcon'
import Inventory from '../../ImageAssets/Svg/Inventory'
import AssetManagementIcon from '../../ImageAssets/Svg/AssetManagementIcon'

const DrawerNavigator = () => {

  const Drawer = createDrawerNavigator()
  return (
    <Drawer.Navigator
      initialRouteName='Dashboard'
      drawerPosition="left"
      screenOptions={{
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: constants.colorWhite,
          borderBottomWidth: 1,
          borderColor: constants.headerBorderColor
        },
        headerTintColor: constants.blackText,
        headerTitleAlign: 'left',
        headerTitleStyle: {
          fontSize: 17,
          fontFamily: constants.fontMedium,
          color: constants.blackText,
          lineHeight: 20.72
        },
        drawerActiveTintColor: constants.drawerActiveTextColor,
        drawerInactiveTintColor: constants.defaultTextBlack,
        drawerStatusBarAnimation: 'slide',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 16,
          fontFamily: constants.fontMedium,
          lineHeight: 19.5
        }
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />} >
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          title: 'Home', headerTitle: 'Dashboard',
          drawerIcon: ({ color }) => (
            <HomeIcon fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="ToCheckScreen"
        component={ToCheckScreen}
        options={{
          title: 'Attendance',
          drawerIcon: ({ color }) => (
            <AttendanceIcon fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="PMWOScreen"
        component={PMWOScreen}
        options={{
          title: 'PM (Work Orders)',
          drawerIcon: ({ color }) => (
            <WorkOrderIcon fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="CMWOScreen"
        component={CMWOScreen}
        options={{
          title: 'CM (Work Orders)',
          drawerIcon: ({ color }) => (
            <WorkOrderIcon fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="ManageInventoryParent"
        component={ManageInventoryParent}
        options={{
          title: 'Telco Inventory',
          drawerIcon: ({ color }) => (
            <Inventory fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="NonTelcoInventory"
        component={NonTelcoInventory}
        options={{
          title: 'NonTelco Inventory',
          drawerIcon: ({ color }) => (
            <Inventory fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="Filter"
        component={FilterWithSiteFilterOnly}
        options={{
          title: 'Asset Management',
          drawerIcon: ({ color }) => (
            <AssetManagementIcon fill={color} />
          )
        }}
      />
      <Drawer.Screen
        name="ScanInventoryTabs"
        component={ScanInventoryTabs}
        options={{
          title: 'Scan Inventory',
          drawerIcon: ({ color }) => (
            <FontAwesome name='barcode' size={25} color={color} />
          )
        }}
      />

    </Drawer.Navigator>
  )
}
export default DrawerNavigator;

const styles = StyleSheet.create({
  imageStyle: {
    height: 25,
    width: 25
  },
  imageStyleTelco: {
    height: 21.28,
    width: 25.82
  },
  drawerLabelStyle: {
    marginLeft: -20,
    fontSize: 16,
    fontFamily: constants.fontMedium,
    lineHeight: 19.5
  }
})


