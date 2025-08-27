import React, { Component, useContext, useEffect, useState } from "react";
import {
  View,
  StatusBar,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  date,
  Alert,
  ScrollView,
} from "react-native";
import moment from 'moment';
import constants from "../../constants/constants";
import ItemDetailComponents from "./ItemDetailComponents";
import styles from "../../Styles/Style";


const AttendanceDetailScreen = ({ route, navigation }) => {

  const [attendanceDetail, setAttendanceDetail] = useState(route.params.item)

  return (
    <ScrollView>
    <View style={{ margin: 10, padding: 15, flexDirection: 'column', borderWidth: 1, borderRadius: 5, borderColor: constants.colorPrimary }}>
      <ItemDetailComponents title="Erp Id" value={attendanceDetail.userName} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="Start Latitude" value={attendanceDetail.startLat} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="Start Longitude" value={attendanceDetail.startlong} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="End Latitude" value={attendanceDetail.endLat} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="End Longitude" value={attendanceDetail.endlong} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="Check in From" value={attendanceDetail.checkInFrom} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="Check out From" value={attendanceDetail.checkOutFrom} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="Check in Time" value={attendanceDetail.checkinTime} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="Check out Time" value={attendanceDetail.checkoutTime} navigation={navigation} ></ItemDetailComponents>
      {/* <ItemDetailComponents title="Start Overtime " value={attendanceDetail.startOvertime} navigation={navigation} ></ItemDetailComponents>
      <ItemDetailComponents title="End Overtime" value={attendanceDetail.endOvertime} navigation={navigation} ></ItemDetailComponents> */}


      {/* <TouchableOpacity style={[styles.LoginButton, { marginBottom: 10 }]} onPress={() => navigation.navigate("MapsScreen", { latitude: attendanceDetail.startLat, longitude: attendanceDetail.startlong })}>
        <Text style={styles.buttonTextSmall}>View Start Location on Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.LoginButton, { marginTop: 0 }]} onPress={() => navigation.navigate("MapsScreen", { latitude: attendanceDetail.endLat, longitude: attendanceDetail.endlong })}>
        <Text style={styles.buttonTextSmall}>View End Location on Map</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.LoginButton, { marginTop: 0 }]} onPress={() => navigation.navigate("AllTripsScreen", { erpId: attendanceDetail.userName, date: moment(attendanceDetail.checkinTime).format("YYYY-MM-DD") })}>
        <Text style={styles.buttonTextSmall}>View Trips</Text>
      </TouchableOpacity> */}
    </View >
    </ScrollView>


  );

}
export default AttendanceDetailScreen;
