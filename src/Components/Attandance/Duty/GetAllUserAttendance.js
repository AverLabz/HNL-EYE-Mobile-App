import React, { useEffect, useContext } from 'react';
import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { DataContext } from '../../../Context/context-provider';
import JsonServer from '../../../Api/api/JsonServer';
import constants from '../../../constants/constants';
import styles from '../../../Styles/Style';
import { FlatList } from 'react-native';
import { Dimensions } from 'react-native';
import moment from 'moment';

const GetAllUserAttendance = ({ navigation }) => {
  const { getAPICall, getAllAttendance, setGetAllAttendance } = useContext(
    DataContext,
  );
  //   This UseState Is used For Loader
  const [loading, setLoading] = useState(false);
  //   For Search Bar
  const [userId, setUserId] = useState('');
  const [state, setState] = useState({ data: [] });
  const { data } = state;
  const [filterdData, setFilterdData] = useState([]);

  useEffect(() => {
    setLoading(true);
    var url =
      JsonServer.baseURL +
      'services/app/Attendance/GetAllUserAttendancewithstartOrEndDate?StartDate=' + moment(new Date()).format("YYYY-MM-DD") + '&EndDate=' + moment(new Date()).format("YYYY-MM-DD") + '&MaxResultCount=10000';
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        setLoading(false);
        var data = result.items;
        setState({ data });
        // setFilterdData(data);
        var allusers = [];
        result.items.forEach((element) => {
          allusers.push(element);
        });
        setGetAllAttendance(allusers);
      } else {
        setLoading(false);
        dropDownAlertRef.alertWithType('error', 'Alert', error.message);
      }
    });
  }, []);

  const handleViewTeamTrips = (item) => {
    navigation.navigate("AllTripsScreen", { erpId: item.userName, date: moment(new Date()).format("YYYY-MM-DD") })
  }
  const renderData = (item) => {
    return (
      <View
        onPress={() => handleDetailPress(item)}
        style={{
          padding: 10,
          borderColor: constants.colorPrimary,
          borderWidth: 1,
          borderRadius: 10,
          margin: 2,
        }}>
        <View style={{
          flexDirection: 'row',
        }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.flatlistItemTextBoldRed}>{item.userName}</Text>
            <Text style={styles.flatlistItemTextBoldRed}>
              {moment(item.checkInTime).format('HH:MM')}
            </Text>
            <Text style={styles.flatlistItemTextBoldRed}>
              {moment(item.checkOutTime).format('HH:MM')}
            </Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.flatlistItemTextBoldRed}>
              {moment(item.date).format('DD-MM-YYYY ')}
            </Text>
            <Text style={styles.flatlistItemTextBoldRed}>
              {item.checkInFrom}
            </Text>
            <Text style={styles.flatlistItemTextBoldRed}>{item.checkOutFrom}</Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => handleViewTeamTrips(item)}
          block
          style={[{
            borderRadius: 7,
            backgroundColor: constants.colorRed9d0000,
            height: 40,
            marginTop: 5,
            marginRight: 20,
            marginLeft: 20,
            alignContent: 'center',
            justifyContent: 'center',
            alignItems: 'center'
          }]}
        >
          <Text style={[styles.buttonTextSmall, { textAlign: 'center' }]}>View Team Trips</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const setFilteredData = (text) => {
    var filter = text // based on text, filter data and use filtered data
      ? data.filter((item) => {
        const itemData = item.userName;
        const textData = text.valueOf();
        return itemData.indexOf(textData) > -1;
      })
      : data; // on on text, u can return all data
    setGetAllAttendance(filter);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        padding: 5,
        paddingBottom: 0
      }}>
      <View style={styles.searchInputs}>
        <TextInput
          style={styles.search, { flex: 1, borderColor: '#D44744' }}
          maxLength={7}
          keyboardType='numeric'
          placeholder={'Search User Name'}
          onChangeText={(text) => {
            setUserId(text);
            setFilteredData(text);
          }}
          value={userId}
        />
      </View>
      <View
        style={{ flex: 1, position: 'absolute', top: '40%', right: 0, left: 0 }}>
        <ActivityIndicator
          size="large"
          animating={loading}
          color="#9d0000"
          style={{}}
        />
      </View>

      <FlatList
        style={{ flex: 1, flexDirection: 'column', marginBottom: 5 }}
        data={getAllAttendance}
        renderItem={({ item }) => renderData(item)}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.id}
        howsVerticalScrollIndicator={false}
        snapTosAlignment={'start'}
        decelerationRate={'fast'}
        snapToInterval={Dimensions.get('window').height}
      />
    </View>
  );
};

export default GetAllUserAttendance;
