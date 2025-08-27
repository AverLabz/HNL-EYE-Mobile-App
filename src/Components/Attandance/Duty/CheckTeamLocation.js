import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { DataContext } from '../../../Context/context-provider';
import JsonServer from '../../../Api/api/JsonServer';
import constants from '../../../constants/constants';
import styles from '../../../Styles/Style';

const CheckTeamLocation = ({ navigation }) => {
  const { getAPICall, teamAttendance, setTeamAttendance, removeDuplicationRows } = useContext(
    DataContext,
  );
  //    For Loader
  const [loading, setLoading] = useState(false);
  //   For Search Bar
  const [userId, setUserId] = useState('');
  const [state, setState] = useState({ data: [] });
  const { data } = state;

  useEffect(() => {
    setLoading(true);
    var url =
      JsonServer.baseURL +
      'services/app/User/GetAllUsersbyusers';
    getAPICall(url, (success, result, error) => {
      ;

      if (success == true) {
        setLoading(false);
        var data = result.items;
        let getUniqueDataRows = removeDuplicationRows(data);

        setState({ data: getUniqueDataRows });
        // setFilterdData(data);
        var allusers = [];
        result.items.forEach((element) => {
          allusers.push(element);
        });
        setTeamAttendance(allusers);
      } else {
        setLoading(false);
        dropDownAlertRef.alertWithType('error', 'Alert', error.message);
      }
    });
  }, []);

  const renderData = (item) => {
    return (
      <TouchableOpacity
        onPress={() => { navigation.navigate("ManagerMapsScreen", { item: item }) }}
        style={{
          padding: 10,
          borderColor: constants.colorPrimary,
          borderWidth: 1,
          borderRadius: 10,
          margin: 2,
        }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.flatlistItemTextBoldRed}>{item.userName}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.flatlistItemTextBoldRed}>{item.name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const setFilteredData = (text) => {

    var filter = text // based on text, filter data and use filtered data
      ? data.filter((item) => {
        const itemData = item.userName.valueOf();
        const textData = text.valueOf();
        return itemData.indexOf(textData) > -1;
      })
      : data; // on on text, u can return all data
    setTeamAttendance(filter);
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        padding: 5,
        paddingBottom: 0,
      }}>
      <View style={styles.searchInputs}>
        <TextInput
          style={(styles.search, { borderColor: '#D44744' })}
          maxLength={7}
          keyboardType="numeric"
          placeholder={'Search User Name'}
          clearButtonMode="always"
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
        data={teamAttendance}
        renderItem={({ item }) => renderData(item)}
        onEndReachedThreshold={0.5}
        keyExtractor={(item) => item.userName}
        howsVerticalScrollIndicator={false}
        snapTosAlignment={'start'}
        decelerationRate={'fast'}
        snapToInterval={Dimensions.get('window').height}
      />
    </View>
  );
};

export default CheckTeamLocation;
