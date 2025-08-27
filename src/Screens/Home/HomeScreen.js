import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import DropdownAlert from 'react-native-dropdownalert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {
  Alert,
  ImageBackground,
  Linking,
  PermissionsAndroid,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  date,
  ActivityIndicator
} from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { DataContext } from "../../Context/context-provider";
import styles from "../../Styles/Style";
import constants from "../../constants/constants";


const HomeScreen = ({ navigation }) => {

  const { saveToAsyncStorageCredentials, setUserCredential,
    getStartTimeByUser, getCurretLocation, userCredential, getCheckInData, setUserCheckIn, getUserData, getUserHomeData,
    setStartDutyTime, startDutyTime, getAPICallByUserDetails, getAPICall, setUserTenantId, departmentInfo } = useContext(DataContext)
  var todayDate = moment().format('YYYY-MM-DD');
  const [todaysDate, setTodaysDate] = useState(todayDate)
  const [endDutyTime, setEndDutyTime] = useState('')
  const [isHomeView, setIsHomeView] = useState(false)
  const [loading, setLoading] = useState(false)
  let dropDownAlertRef = useRef(null);


  const getStartTime = async (tenantId, value) => {
    var paramToDate = { todaysDate, value, tenantId }
    getStartTimeByUser(paramToDate, (success, result, error) => {
      setTimeout(() => setLoading(true),)
      if (success == true) {
        setTimeout(() => setLoading(false),)
        if (result.items.length > 0) {
          if (result.items[0].endLat == "") {
            setUserCheckIn(JSON.stringify(result.items[0]));
            setStartDutyTime(result.items[0].checkInTime)
            setEndDutyTime(result.items[0].checkoutTime)
            // navigation.navigate('Success')
          }
          else {
            if (result.items[0].overTimeStart != "0001-01-01T00:00:00" && result.items[0].overTimeEnd == "0001-01-01T00:00:00") {
              setUserCheckIn(JSON.stringify(result.items[0]));
              setStartDutyTime(result.items[0].checkInTime)
              setEndDutyTime(result.items[0].checkoutTime)
              navigation.navigate('OverTimeCheckoutScreen')
            }
            else {
              setUserCheckIn(JSON.stringify(result.items[0]));
              setStartDutyTime(result.items[0].checkInTime)
              setEndDutyTime(result.items[0].checkoutTime)
            }

          }

        }
        else {
          // Alert.alert("Pls mark the Attanadance")
        }
      }
      else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
    })
  }

  useEffect(() => {
    departmentInfo
    //
    //   // const backAction = () => {
    //   //   Alert.alert("Hold on!", "Want to exit App?", [
    //   //     {
    //   //       text: "Cancel",
    //   //       onPress: () => null,
    //   //       style: "cancel"
    //   //     },
    //   //     { text: "YES", onPress: () => BackHandler.exitApp() }
    //   //   ]);
    //   //   return true;
    //   // };

    //   // const backHandler = BackHandler.addEventListener(
    //   //   "hardwareBackPress",
    //   //   backAction
    //   // );
    const unsubscribe = navigation.addListener('focus', () => {
      var tenantId = "";
      AsyncStorage.getItem('userTenantId').then((value) => {
        if (value === null || value == "") {
          navigation.navigate("Login");
        } else {
          tenantId = JSON.parse(value).tenantId;
          setUserTenantId(JSON.parse(value));
          AsyncStorage.getItem('userCredential').then((value) => {
            if (value === null || value == "") {
              navigation.navigate("Login");
            } else {
              navigation.setOptions({
                headerRight: () =>
                  <Text style={{ ...styles.headerRightTextStyle, marginRight: 10 }}>{JSON.parse(value).userNameOrEmailAddress}</Text>,

              })
              // setUserCredential(value);
              // saveToAsyncStorageCredentials(JSON.parse(value));
              getStartTime(tenantId, value);
              var paramToUser = { value, tenantId }
              getUserData(paramToUser, value);
              getEmployeeHomeDetails(paramToUser, value)
            }
          });

        }
      });
    }
      , [])
    return unsubscribe;
  }, [navigation]);

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
  const startDuty = () => {
    navigation.navigate('LocationForStartDuty');
  }
  const handleGoToSite = () => {
    navigation.navigate('GoToSiteScreen');
  }
  const goToManageTeam = () => {
    navigation.navigate('ManageTeam');
  }
  const checkinFromHome = async () => {


    if (Platform.OS == "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'HNL Eye',
            'message': 'HNL Eye wants to access your location '
          }
        )

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          getCurretLocation((location, success) => {
            if (success) {

              AsyncStorage.getItem('userInfo').then((value) => {
                if (value === null) {
                } else {
                  var userName = JSON.parse(userCredential).userNameOrEmailAddress;
                  var dataToInsert = {
                    userId: JSON.parse(value).id,
                    userName: userName,
                    startlong: location.coords.longitude,
                    endlong: "",
                    startLat: location.coords.latitude,
                    endLat: "",
                    checkInTime: new Date(),
                    checkInFrom: "Home",
                    checkOutFrom: "",
                    id: 0,
                    comments: "",
                    status: "Approved",
                  };
                  getCheckInData(dataToInsert, (success, result, error) => {
                    if (success == true) {
                      setUserCheckIn(JSON.stringify(result));
                      setStartDutyTime(result.checkInTime)
                      navigation.navigate('Success')
                      setTimeout(() => setLoading(false), 300)
                    }
                    else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
                  })
                }
              });
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
          });
        } else {
          console.log("location permission denied")
          alert("Location permission denied");
        }
      } catch (err) {
        console.warn(err)
      }

    }
    else {

      getCurretLocation((location, success) => {
        if (success) {
          AsyncStorage.getItem('userInfo').then((value) => {
            if (value === null) {
            } else {
              var userName = JSON.parse(userCredential).userNameOrEmailAddress;
              var dataToInsert = {
                userId: JSON.parse(value).id,
                userName: userName,
                startlong: location.coords.longitude,
                endlong: "",
                startLat: location.coords.latitude,
                endLat: "",
                checkInTime: new Date(),
                checkInFrom: "Home",
                checkOutFrom: "",
                id: 0,
                comments: "",
                status: "Approved",
              };
              getCheckInData(dataToInsert, (success, result, error) => {
                if (success == true) {
                  setUserCheckIn(JSON.stringify(result));
                  setStartDutyTime(result.checkInTime)
                  navigation.navigate('Success')
                  setTimeout(() => setLoading(false), 300)
                }
                else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
              })
            }
          });


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
      });
    }


  }


  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={constants.colorPrimary}
        translucent={false}
      />

      <ImageBackground
        source={require("../../ImageAssets/background.png")}
        style={[styles.mainImageBackground, { justifyContent: "center" }]}
      >
        {departmentInfo?.home == true ? <View
          style={styles.homeupperside}
        >
          <TouchableOpacity
            onPress={() => checkinFromHome()}
            style={styles.homeStartdutyFromBtn}
          >
            <Text style={styles.buttonTextSmall}>Start Duty from Home</Text>
          </TouchableOpacity>
        </View> :
          <View style={styles.homeupperside}></View>}
        {/* {isHomeView == true ?
          <View
            style={styles.homeupperside}
          >
            <TouchableOpacity
              onPress={() => checkinFromHome()}
              style={styles.homeStartdutyFromBtn}
            >
              <Text style={styles.buttonTextSmall}>Start Duty from Home</Text>
            </TouchableOpacity>
          </View> :
          <View
            style={styles.homeupperside}
          ></View>} */}

        <Text style={styles.homeLastAttendance}>
          Your Last Attendance :
        </Text>
        <View
          style={[
            styles.transparentInputBox, styles.homeStartEndDutyBox
          ]}
        >
          <View style={styles.homeStartEndInsideMargin}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.homeStartDutyText}>
                Start duty : </Text>
              <Text style={styles.homeStartDutyText}>
                {startDutyTime !== '' && moment(startDutyTime).format("YYYY-MM-DD HH:mm ")}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 15 }}>
              <Text style={styles.homeStartDutyText}>
                End duty : </Text>
              <Text style={styles.homeStartDutyText}>
                {endDutyTime !== '' && moment(endDutyTime).format("YYYY-MM-DD HH:mm ")}
              </Text>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, position: 'absolute', top: "40%", right: 0, left: 0 }}>
          <ActivityIndicator size="large" animating={loading} color={constants.colorPrimary} style={{}} />
        </View>
        <View style={styles.DashboardMainView}>
          <View style={styles.transparentInputBox}>
            {/* <DateTimePicker
            /> */}
            <TouchableOpacity style={styles.DateTextInput}>
              <TextInput
                style={[styles.input, { height: 40 }]}
                pointerEvents="none"
                editable={false}
                placeholder={date}
                value={todaysDate}
                underlineColorAndroid="transparent"
              />
            </TouchableOpacity>
          </View>
          {/* <Button
            onPress={() => startDuty()}
            block
            style={[styles.StartDutyButton, { marginTop: 20 }]}
          >
            <Text style={styles.buttonTextSmall}>Start Duty</Text>
          </Button>
          <Button
            onPress={() => handleGoToSite()}
            block
            style={[styles.StartDutyButton, { marginTop: 10 }]}
          >
            <Text style={styles.buttonTextSmall}>Go To Site</Text>
          </Button> */}
        </View>

        {/* <View
          style={styles.homeupperside}
        >
          <TouchableOpacity
            onPress={() => goToManageTeam()}
            style={styles.homeStartdutyFromBtn}
          >
            <Text style={styles.buttonTextSmall}>Manage Team</Text>
          </TouchableOpacity>
        </View> */}
        <View
          style={{
            flex: 0.2,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            bottom: 10,
          }}>

        </View>
      </ImageBackground>
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}

        showCancel={true}
      />
    </View>
  );
};

export default HomeScreen;

