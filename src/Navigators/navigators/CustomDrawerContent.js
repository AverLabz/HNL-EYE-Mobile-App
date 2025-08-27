import AsyncStorage from '@react-native-async-storage/async-storage';
import { DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import React, { useRef } from "react";
import { StyleSheet, Text, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import constants from "../../constants/constants";
import JsonServer from '../../Api/api/JsonServer';
import LogoutIcon from '../../ImageAssets/Svg/LogoutIcon';
import PlayIcon from '../../ImageAssets/Svg/PlayIcon';
import VersionIcon from '../../ImageAssets/Svg/VersionIcon.svg'
import DrawerLogo from '../../ImageAssets/Svg/DrawerLogo.svg'

const CustomDrawerContent = (props) => {
  let dropDownAlertRef = useRef(null);

  const _onClose = () => {
    props.navigation.navigate("Login")
  };

  const selectionOnPress = async () => {
    dropDownAlertRef.alertWithType('info', 'Alert', 'You are Successfully Logout',)
    setTimeout(() => {
      props.navigation.reset({
        index: 0,
        routes: [
          {
            name: 'Login'
          }
        ]
      });
    }, 1000);
    await AsyncStorage.removeItem("userCredential");
    await AsyncStorage.removeItem("userInfo");
    await AsyncStorage.removeItem("userTenantId");
    await AsyncStorage.removeItem("PMWOQuestionsData");
    await AsyncStorage.removeItem("CMWOQuestionsData");
    await AsyncStorage.removeItem("UserCheckIn");
    await AsyncStorage.removeItem("userCompany");

  }

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}>
      <View style={style.logoContainer}>
        <DrawerLogo />
      </View>
      <DrawerItemList {...props} />
      <View style={style.headerWrapper} />
      <DrawerItem
        label={'Logout'}
        inactiveBackgroundColor={constants.colorTransparent}
        labelStyle={style.labelStyle}
        onPress={() => selectionOnPress()}
        icon={() => (
          <LogoutIcon fill={constants.red} />
        )}>

      </DrawerItem>
      <DrawerItem
        label={'Watch Tutorial'}
        inactiveBackgroundColor='rgba(255, 234, 208, 1)'
        labelStyle={{
          marginLeft: -24,
          fontSize: 16,
          fontFamily: constants.fontMedium,
          color: constants.defaultTextBlack,
          lineHeight: 19.5
        }}
        icon={() => (
          <PlayIcon fill={constants.textWhite} />
        )}>

      </DrawerItem>

      <View style={style.versionLogoContainer}>
        <VersionIcon />
        <Text style={style.versionText}>Version {JsonServer.appVersion}</Text>
      </View>
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        onClose={_onClose}
        showCancel={true}
      />

    </DrawerContentScrollView>
  );
}

export default CustomDrawerContent;
const style = StyleSheet.create({
  header: {

  },
  headerContent: {
    height: 200,

    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end"
  },
  headerText: {
    color: "white",
    fontSize: 16
  },
  headerWrapper: {
    flex: 1,
    minHeight: 55
  },
  drawerItem: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
  },
  drawerIcon: {
    fontSize: 18,
    marginRight: 20,
    color: "#D70F64",
  },
  logoContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 18,
    borderBottomWidth: 1,
    margin: 8,
    borderColor: constants.headerBorderColor
  },
  versionLogoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 15,
    borderTopWidth: 1,
    margin: 8,
    borderColor: constants.headerBorderColor
  },
  imageStyle: {
    height: 40,
    width: 106,
    resizeMode: 'contain'
  },
  versionLogoStyle: {
    height: 33.5,
    width: 33.5,
    marginRight: 15,
    resizeMode: 'contain'
  },
  playLogoStyle: {
    height: 29,
    width: 29,
    resizeMode: 'contain'
  },
  versionText: {
    fontSize: 18,
    fontFamily: constants.fontMedium,
    color: constants.defaultTextBlack,
    lineHeight: 21.94,
    marginLeft: 10
  },
  labelStyle: {
    marginLeft: -20,
    fontSize: 16,
    fontFamily: constants.fontMedium,
    color: constants.red,
    lineHeight: 19.5
  }
})
