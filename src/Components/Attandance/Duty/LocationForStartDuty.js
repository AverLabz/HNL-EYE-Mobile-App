import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Alert, FlatList, Linking, PermissionsAndroid,
  Platform, Text, TextInput,
  TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../../Api/api/JsonServer';
import constants from '../../../constants/constants';
import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';
import CustomLoader from '../../CustomLoader/CustomLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
const LocationForStartDuty = ({ navigation, route }) => {

  const { getAPICall, getCurretLocation, userCredential, postRequest, checkDistance } = useContext(DataContext)
  const [text, setText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [sitesData, setSitesData] = useState([])
  const [responseText, setResponseText] = useState('')
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [departmentInfo, setDepartmentInfo] = useState(route.params.departmentInfo)
  const [loading, setLoading] = useState(true)

  let dropDownAlertRef = useRef(null);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        <Text style={[styles.headerRightTextStyle, { marginRight: 10 }]}>{JSON.parse(userCredential).userNameOrEmailAddress}</Text>
    })
    requestLocationPermission()

  }, [])

  useFocusEffect(
    React.useCallback(() => {
      getAllSites()
    }, [])
  )

  const getAllSites = () => {
    var url = JsonServer.baseURL + "services/app/Suggestions/GetSites?MaxResultCount=10000&OnlyAllocated=true"
    getAPICall(url, (success, result, error) => {

      if (success) {
        setFilteredData(result.items)
        setSitesData(result.items)
        setLoading(false)
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const handleMarkAttendance = (siteCode, lat, long, siteLat, siteLong, deptInfo) => {

    var distance = checkDistance(parseFloat(siteLat), parseFloat(siteLong), lat, long, "M");

    if (deptInfo?.geofencing == true) {

      if (distance < deptInfo?.radiusField) {
        var url = JsonServer.baseURL + 'services/app/Attendance/CheckIn'
        let dataToInsert = {
          location: siteCode,
          latitude: lat,
          longitude: long
        }
        postRequest(dataToInsert, url, (success, result, error) => {
          if (result) {
            dropDownAlertRef.alertWithType('success', 'Success', result)
            setFilteredData([])
            setLoading(false)
            setTimeout(() => {
              navigation.goBack()
            }, 1200);
          } else {
            setLoading(false)
            dropDownAlertRef.alertWithType('error', 'Alert', error.message)
          }
        });
      } else {
        setLoading(false)
        let str_distance = "";
        if (distance > deptInfo?.radiusField) {
          str_distance = "(" + (distance / 1000).toFixed() + " km)"
        }
        else {
          str_distance = "(" + distance.toFixed() + " m)"
        }
        dropDownAlertRef.alertWithType('error', 'Alert', "You're not near to " + siteCode + " " + str_distance)
      }
    } else {

      var url = JsonServer.baseURL + 'services/app/Attendance/CheckIn'
      let dataToInsert = {
        location: siteCode,
        latitude: lat,
        longitude: long
      }
      postRequest(dataToInsert, url, (success, result, error) => {
        if (result) {
          dropDownAlertRef.alertWithType('success', 'Success', result)
          setFilteredData([])
          setLoading(false)
          setTimeout(() => {
            navigation.goBack()
          }, 1200);
        } else {
          setLoading(false)
          dropDownAlertRef.alertWithType('error', 'Alert', error.message)
        }
      });

    }

  }

  const requestLocationPermission = async () => {

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
              setCurrentLatitude(location.coords.latitude);
              setCurrentLongitude(location.coords.longitude);
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
          setCurrentLatitude(location.coords.latitude);
          setCurrentLongitude(location.coords.longitude);
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


  const handleFilteredData = (text) => {

    var filter = text // based on text, filter data and use filtered data
      ? sitesData.filter(item => {
        const itemData = item.siteCode.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      : sitesData; // on on text, u can return all data
    setFilteredData(filter);
  }

  return (

    <SafeAreaView edges={['top']} style={{ flex: 1,backgroundColor:constants.screenBackgroundWhite }}>
      {loading ?
        <CustomLoader medium/>
        : <View style={styles.pageContainer}>
          <View style={[styles.searchInputs, { alignItems: "center", borderBottomWidth: 3 }]}>
            <TextInput
              style={[styles.search, { marginBottom: 0, borderBottomWidth: 0 }]}
              placeholder={
                'Search Site'
              }
              onChangeText={text => {
                setText(text)
                handleFilteredData(text)
              }}
              value={text}
            />
          </View>

          {filteredData ?
            <FlatList
              style={styles.list}
              data={filteredData}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (

                <TouchableOpacity
                  style={{
                    padding: 11,
                    borderColor: constants.red,
                    borderBottomWidth: 0.5,
                    margin: 2,
                    marginTop: 2,
                    backgroundColor:constants.siteValueBackground
                  }}
                  onPress={() => {
                    setLoading(true)
                    handleMarkAttendance(item.siteCode, currentLatitude, currentLongitude, item.latitude, item.longitude, departmentInfo)
                  }}
                >
                  <Text style={{ fontFamily: constants.fontMedium, fontSize: 14, color: constants.defaultTextBlack }} >{index + 1}.{"  "}{item.siteCode}</Text>
                </TouchableOpacity>
              )}
            /> :
            <View style={{ flexGrow: 1, backgroundColor: "red", padding: 10, }}>
              <Text>{responseText}</Text>
            </View>}

        </View>}

      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        showCancel={true}
      />

    </SafeAreaView>
  );
}
export default LocationForStartDuty;
