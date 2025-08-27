import React, { Component, useState, useContext, useEffect, useLayoutEffect } from 'react'
import {
  View,
  StatusBar,
  Text,
  Alert,
  ImageBackground,
  BackHandler, TouchableOpacity, ActivityIndicator, Linking
} from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons"
import styles from "../../../Styles/Style";
import constants from '../../../constants/constants';
import { DataContext } from '../../../Context/context-provider';
import moment from 'moment';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Success = ({ navigation }) => {
  const { getCheckOutData, setDepartmentInfo, UserCheckIn, getCurretLocation, startDutyTime, getUserHomeData, departmentInfo } = useContext(DataContext)
  const [userCheckinData, setUserCheckInData] = useState(UserCheckIn);
  const [loading, setLoading] = useState(false)
  const [isHomeView, setIsHomeView] = useState(false)

  const checkoutFromHome = () => {

    var userCheckin = JSON.parse(userCheckinData);
    getCurretLocation((location, success) => {
      setLoading(true)
      if (success) {
        var dataToInsert = {
          userId: userCheckin.userId,
          userName: userCheckin.userName,
          startlong: userCheckin.startlong,
          endlong: location.coords.longitude,
          startLat: userCheckin.startLat,
          endLat: location.coords.latitude,
          checkInFrom: userCheckin.checkInFrom,
          checkOutFrom: "Home",
          id: userCheckin.id,
          comments: userCheckin.comments,
          status: userCheckin.status,
        };

        getCheckOutData(dataToInsert, (success, result, error) => {

          if (success == true) {
            setTimeout(() => setLoading(false), 100)
            navigation.navigate("Home");
          }
          else {

            setLoading(false)
            Alert.alert(error.message)

          }
        })
      }
      else {
        Alert.alert(
          "Please turn on your location",
          "Allow HNL to access Your current location",
          [
            {
              text: "Cancel",
              onPress: () => navigation.goBack(),
              style: "cancel"
            },
            { text: "OK", onPress: () => Linking.openSettings() }
          ]
        );
      }
    })
  }

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Dashboard")
      return true
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

  }, [])


  useEffect(() => {
    // const backAction = () => {
    //   Alert.alert("Hold on!", "Want to exit App?", [
    //     {
    //       text: "Cancel",
    //       onPress: () => null,
    //       style: "cancel"
    //     },
    //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //   ]);
    //   return true;
    // };
    // const backHandler = BackHandler.addEventListener(
    //   "hardwareBackPress",
    //   backAction
    // );
    var tenantId = "";
    AsyncStorage.getItem('userTenantId').then((value) => {
      if (value === null || value == "") {
        navigation.navigate("Login");
      } else {
        tenantId = JSON.parse(value).tenantId;
        AsyncStorage.getItem('userCredential').then((value) => {
          if (value === null || value == "") {
            navigation.navigate("Login");
          } else {
            navigation.setOptions({
              headerRight: () =>
                <Text style={{ ...styles.headerRightTextStyle, marginRight: 10 }}>{JSON.parse(value).userNameOrEmailAddress}</Text>
            })
            // setUserCredential(value);
            // saveToAsyncStorageCredentials(JSON.parse(value));
            var paramToUser = { value, tenantId }
            getDepartmentDetails(paramToUser)
            getEmployeeHomeDetails(paramToUser, value)
          }
        });

      }
    });
  }, [])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate("Dashboard")}
          style={{ width: 35, height: 30, marginLeft: 10 }}>
          <Ionicons name="arrow-back" size={25} color="white" />
        </TouchableOpacity>
      ),
    })
  }, [])

  const getEmployeeHomeDetails = (paramToUser, valueToUser) => {
    getUserHomeData(paramToUser, valueToUser, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setIsHomeView(result.items[0].userHomeCheckIn);
        }
      }
      else {
        Alert.alert(error.message)
      }
    })
  }

  const getDepartmentDetails = (value) => {
    var url = JsonServer.baseURL + "services/app/Department/GetUserDepartmentDetails"
    getAPICallByUserDetails(value, url, (success, result, error) => {

      if (success == true) {
        if (result.items.length > 0) {
          setDepartmentInfo(result.items[0])
        }
      }
      else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
    })
  }

  const onLocation = (location) => {

    console.log('[event] location: ', location);
    this.addEvent('location', new Date(location.timestamp), location);
  }

  const goToManageTeam = () => {
    navigation.navigate('ManageTeam');
  }
  const endDutyButton = () => {
    navigation.navigate('LocationForEndDuty');
  }
  const handleGoToSite = () => {
    navigation.navigate('GoToSiteScreen');
  }
  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" hidden={false} backgroundColor={constants.colorPrimary} translucent={false} />
      <ImageBackground source={require('../../../ImageAssets/background.png')}
        style={[styles.mainImageBackground, { justifyContent: 'center' }]}>
        {departmentInfo?.home == true && <View
          style={styles.SuccessMain}>
          <TouchableOpacity
            onPress={() =>
              checkoutFromHome()
            }
            style={styles.SuccessButtonEndFrom}>
            <Text style={styles.buttonTextSmall}>End Duty from Home</Text>
          </TouchableOpacity>
        </View>}
        {/* {isHomeView == true ?
          <View
            style={styles.SuccessMain}>
            <TouchableOpacity
              onPress={() =>
                checkoutFromHome()
              }
              style={styles.SuccessButtonEndFrom}>
              <Text style={styles.buttonTextSmall}>End Duty from Home</Text>
            </TouchableOpacity>
          </View> :
          <View
            style={styles.SuccessMain}>
          </View>} */}

        <View style={{ position: 'absolute', top: "30%", right: 0, left: 0 }}>
          <ActivityIndicator size="large" animating={loading} color={constants.colorPrimary} style={{}} />
        </View>
        <View style={styles.SuccessContainer}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.SuccessStrtRecordText}>Duty Started : {moment(startDutyTime).format("YYYY-MM-DD HH:mm	")}
            </Text>
          </View>
          {/* <Button
            onPress={() => endDutyButton()}
            block
            style={[styles.StartDutyButton, { marginTop: 20 }]}>
            <Text style={styles.buttonTextSmall}>End Duty</Text>
          </Button>
          <Button
            onPress={() => handleGoToSite()}
            block
            style={[styles.StartDutyButton, { marginTop: 10 }]}>
            <Text style={styles.buttonTextSmall}>Go To Site</Text>
          </Button> */}
        </View>
        <View
          style={{
            flex: 0.2,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            bottom: 10,
          }}>

        </View>
        {/* <View style={styles.homeupperside}>
          <TouchableOpacity
            onPress={() => goToManageTeam()}
            style={styles.homeStartdutyFromBtn}
          >
            <Text style={styles.buttonTextSmall}>Manage Team</Text>
          </TouchableOpacity>
        </View> */}
      </ImageBackground>
    </View>
  )
}

export default Success;
