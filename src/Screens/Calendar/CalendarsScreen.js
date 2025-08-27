import moment from 'moment';
import React, { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
// import { Agenda } from 'react-native-calendars';
import JsonServer from "../../Api/api/JsonServer";
import { DataContext } from "../../Context/context-provider";
import constants from "../../constants/constants";

const CalendarsScreen = ({ navigation }) => {
  const {getAPICall} = useContext(DataContext);
  const [items, setItems] = useState({});
  const [isloading, setIsLoading] = useState(true)

  useEffect(() => {
    const backAction = () => {
      navigation.goBack()
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction, 
    );
    return () => backHandler.remove();
  }, [])

  const loadItems = (day) => {
    var upperLimitDays = 85;
    var lowerLimitDays = 15;
    var addedUpperLimitDays=moment(day).add(upperLimitDays,'days').toISOString()
    var addedLowerLimitDays=moment(day.date).subtract(10,'days');
    var url= JsonServer.baseURL+"services/app/Attendance/GetUserReportWithStartEndDate?startDate="+moment(addedLowerLimitDays).format("yyyy-MM-DD")+"&endDate="+moment(addedUpperLimitDays).format("yyyy-MM-DD");
    getAPICall(url, (success, result, error) => {  
      
      if (success == true) {  
        setTimeout(() => setIsLoading(false), )
       if(result.items.length>0){
        for (let j = 0; j < result.items.length; j++) {
          items[moment(result.items[j].date).format('YYYY-MM-DD')] = [];
          items[moment(result.items[j].date).format('YYYY-MM-DD')].push({
            userName:result.items[j].userName,
            startlong:result.items[j].startlong,
            endlong:result.items[j].endlong,
            startLat:result.items[j].startLat,
            endLat:result.items[j].endLat,
            checkInFrom:result.items[j].checkInFrom,
            checkOutFrom:result.items[j].checkOutFrom,
            checkinTime: moment(result.items[j].checkInTime).format('YYYY-MM-DD hh:mm'),
            checkoutTime: result.items[j].endLat!=""?moment(result.items[j].checkoutTime).format('YYYY-MM-DD hh:mm'):"",
            startOvertime:moment(result.items[j].overTimeStart).format('YYYY-MM-DD hh:mm'),
            endOvertime:moment(result.items[j].overTimeEnd).format('YYYY-MM-DD hh:mm'),
            height: 50
          })
        }
        const newItems = {};
      Object.keys(items).forEach(key => {
        newItems[key] = items[key];
      });
      setItems(newItems);
       }
      }
      else { Alert.alert(error.message) 
      }
    })
  }

  const renderItem = (item) => {
    return (
      <TouchableOpacity
        testID="item"
        style={[styles.item, { height: item.height }]}
        onPress={() => navigation.navigate("AttendanceDetailScreen",{item:item})}
      >
        <View style={{ flexDirection: 'row' }}>
          <Text>Checkin Time   : </Text>
          <Text>{item.checkinTime}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text>Checkout Time : </Text>
          <Text>{item.checkoutTime}</Text>
        </View>
      </TouchableOpacity>
      
    );
  }

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
      
    );
  }

  const rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  }

  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }


  return (
    
    <View style={{flex:1}}>
        {/* <Agenda
            testID='agenda'
            items={items}
            loadItemsForMonth={loadItems}
            selected={Date.now()}
            renderItem={(item) => renderItem(item)}
            renderEmptyDate={renderEmptyDate}
            rowHasChanged={rowHasChanged}
          /> */}
          <View style={{ position: 'absolute', top: "50%", right: 0, left: 0 }}>
              <ActivityIndicator size="large" animating={isloading} color={constants.colorPrimary} style={{}} />
          </View>
    </View>
  
    

  );

}
export default CalendarsScreen;
const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  }
});