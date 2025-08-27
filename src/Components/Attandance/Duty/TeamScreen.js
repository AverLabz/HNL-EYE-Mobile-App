import React, { useRef, useContext, useEffect, useState } from 'react';
import DropdownAlert from 'react-native-dropdownalert';

import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from 'react-native';
import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';
import JsonServer from '../../../Api/api/JsonServer';

const TeamScreen = ({ route, navigation }) => {

  const { getTeamAPICall, postRequest, getAPICall, userCredential, setPendinfWOs } = useContext(DataContext)
  const [text, setText] = useState('');
  const [state, setState] = useState({ data: [], });
  const { data, } = state;
  const [filterdData, setFilterdData] = useState([]);

  const [uniqueEmployees, setuniqueEmployees] = useState([]);
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [loading, setLoading] = useState(false)

  let dropDownAlertRef = useRef(null);

  useEffect(() => {
    var url = JsonServer.baseURL + "services/app/Team/GetAllUserTeamUsers?MaxResultCount=1000";
    var uniqueEmployeesList = [];
    getTeamAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          result.items.forEach(function (item) {
            var i = uniqueEmployeesList.findIndex(x => x.userName == item.userName);
            if (i <= -1) {
              uniqueEmployeesList.push(item);
            }
          });
        }
        setuniqueEmployees(uniqueEmployeesList);
        setFilterdData(uniqueEmployeesList);
        var data = uniqueEmployeesList;
        setState({ data });
      }
      else { dropDownAlertRef.alertWithType('error', 'Alert', error.message) }
    })
  }, [])



  const setFilteredData = (text) => {
    var filter = text // based on text, filter data and use filtered data
      ? data.filter(item => {
        const itemData = item.userName.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      })
      : data; // on on text, u can return all data
    setFilterdData(filter);
  }

  const assignToTeamMember = (item) => {

    var dataToInsert = {
      userId: item.id,
      id: route.params.WOId
    }
    postRequest(dataToInsert, JsonServer.baseURL + "services/app/WorkOrder/ReassignWorkOrderToUserByUserId", () => {
      Alert.alert("Work Order is successfully assigned to " + item.userName)
      var userName = JSON.parse(userCredential).userNameOrEmailAddress;
      var url = JsonServer.baseURL + "services/app/WorkOrder/GetAllWorkOrderByUserNameAndStatus?UserName=" + userName + "&Status=dispatched";
      getAPICall(url, (success, result, error) => {
        setPendinfWOs(result.items.filter(x => x.workOrderTypeName == "PM"));
        navigation.pop(2);

      })
    })
  }
  return (

    <View style={{ flex: 1 }}>
      <View style={styles.pageContainer}>
        <View style={styles.searchInputs}>
          <TextInput
            style={styles.search}
            placeholder={
              'Search Team'
            }
            onChangeText={text => {
              setText(text)
              setFilteredData(text)
            }}
            value={text}
          />
        </View>
        <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
          <ActivityIndicator size="large" animating={loading} color="#511BC5" style={{}} />
        </View>
        <FlatList
          style={styles.list}
          data={filterdData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => assignToTeamMember(item)}
            >
              <Text >{item.userName}</Text>
              <Text >{item.name}</Text>
            </TouchableOpacity>
          )}
        />

      </View>

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
}
export default TeamScreen;
