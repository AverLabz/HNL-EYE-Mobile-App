import React, { useContext, useEffect, useState } from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  ActivityIndicator
} from 'react-native';
import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManagerLocationForEndDuty = ({ navigation }) => {

  const { getSiteData, checkDistance, getCheckOutData, getCurretLocation, departmentInfo } = useContext(DataContext)
  const [text, setText] = useState('');
  const [state, setState] = useState({ data: [], loading: false });
  const { data, loading } = state;
  const [filterdData, setFilterdData] = useState([]);

  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [isloading, setIsLoading] = useState(true)

  useEffect(() => {
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
    getSiteData((success, result, error) => {
      if (success == true) {
        var data = result.items;
        setState({ data, loading: false });
        setFilterdData(data)
        setTimeout(() => setIsLoading(false), 500)
      }
      else { Alert.alert(error.message) }
    })
  }, [])

  const MarkAttandance = (siteCode) => {
    markLocationsWithOutGeoFencing(siteCode);
  }

  const markLocationsWithGeoFencing = (lat1, lon1, siteCode, userCheckin) => {
    var distance = checkDistance(lat1, lon1, currentLatitude, currentLongitude, "M");
    if (distance <= departmentInfo.radius) {
      AsyncStorage.getItem('userInfo').then((value) => {

        if (value === null) {
        } else {
          var dataToInsert = {
            userId: userCheckin.userId,
            userName: userCheckin.userName,
            startlong: userCheckin.startlong,
            endlong: currentLongitude,
            startLat: userCheckin.startLat,
            endLat: currentLatitude,
            checkInFrom: userCheckin.checkInFrom,
            checkOutFrom: siteCode,
            comments: userCheckin.comments,
            status: userCheckin.status,
            id: userCheckin.id
          };

          getCheckOutData(dataToInsert, (success, result, error) => {

            if (success == true) {
              navigation.popToTop();
            }
            else {
              Alert.alert(error.message)

            }
          })
        }
      });
    }
    else {
      AsyncStorage.getItem('userInfo').then((value) => {

        if (value === null) {
        } else {
          var dataToInsert = {
            userId: userCheckin.userId,
            userName: userCheckin.userName,
            startlong: userCheckin.startlong,
            endlong: currentLongitude,
            startLat: userCheckin.startLat,
            endLat: currentLatitude,
            checkInFrom: userCheckin.checkInFrom,
            checkOutFrom: siteCode,
            comments: userCheckin.comments,
            status: userCheckin.status,
            id: userCheckin.id
          };
          getCheckOutData(dataToInsert, (success, result, error) => {

            if (success == true) {
              navigation.popToTop();
            }
            else {
              Alert.alert(error.message)

            }
          })
        }
      });
    }
  }
  const markLocationsWithOutGeoFencing = (siteCode, userCheckin) => {
    AsyncStorage.getItem('userInfo').then((value) => {

      if (value === null) {
      } else {
        var dataToInsert = {
          userId: userCheckin.userId,
          userName: userCheckin.userName,
          startlong: userCheckin.startlong,
          endlong: currentLongitude,
          startLat: userCheckin.startLat,
          endLat: currentLatitude,
          checkInFrom: userCheckin.checkInFrom,
          checkOutFrom: siteCode,
          comments: userCheckin.comments,
          status: userCheckin.status,
          id: userCheckin.id
        };
        getCheckOutData(dataToInsert, (success, result, error) => {

          if (success == true) {
            navigation.popToTop();
          }
          else {
            Alert.alert(error.message)

          }
        })
      }
    });
  }


  const setFilteredData = (text) => {
    var filter = text // based on text, filter data and use filtered data
      ? data.filter(item => {
        const itemData = item.siteName.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      : data; // on on text, u can return all data
    setFilterdData(filter);
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.pageContainer}>
        <View style={styles.searchInputs}>
          <TextInput
            style={styles.search}
            placeholder={
              'Search Sites'
            }
            onChangeText={text => {
              setText(text)
              setFilteredData(text)
            }}
            value={text}
          />
        </View>
        <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
          <ActivityIndicator size="large" animating={isloading} color="#511BC5" style={{}} />
        </View>
        <FlatList
          style={styles.list}
          data={filterdData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => MarkAttandance(item.latitude, item.longitude, "M", item.siteCode)}
            >
              <Text >{item.siteName}</Text>
            </TouchableOpacity>
          )}
        />

      </View>
    </View>
  );
}
export default ManagerLocationForEndDuty;
