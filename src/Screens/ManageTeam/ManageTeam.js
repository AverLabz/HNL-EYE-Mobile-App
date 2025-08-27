import React, { useEffect } from 'react';
import { BackHandler, StatusBar, View } from 'react-native';
import styles from "../../Styles/Style";
import constants from '../../constants/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

const ManageTeam = ({ navigation }) => {

  const handleAllUserAttendance = () => {
    navigation.navigate('GetAllUserAttendance');
  }


  const handleTeamAttendance = () => {
    navigation.navigate('MarkTeamAttendance');
  }
  const handleTeamCheckoutAttendance = () => {
    navigation.navigate('CheckoutTeamAttendance');
  }
  const handleTeamLocationCheck = () => {
    navigation.navigate('CheckTeamLocation');
  }

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
  return (
    <SafeAreaView edges={['bottom']} style={{flex:1}} >

      <StatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={constants.colorPrimary}
        translucent={false}
      />

      <View style={styles.DashboardMainView}>
        {/* <Button
          onPress={() => handleAllUserAttendance()}
          block
          style={[styles.StartDutyButton, { marginTop: 20 }]}
        >
          <Text style={styles.buttonTextSmall}>View Attendance</Text>
        </Button> */}
        {/* <Button
          onPress={() => handleViewTeamWorkOrder()}
          block
          style={[styles.StartDutyButton, { marginTop: 10 }]}
        >
          <Text style={styles.buttonTextSmall}>View Work Order CM / PM</Text>
        </Button> */}
        {/* <Button
          onPress={() => handleTeamAttendance()}
          block
          style={[styles.StartDutyButton, { marginTop: 10 }]}
        >
          <Text style={styles.buttonTextSmall}>Checkin Team Attendance</Text>
        </Button> */}
        {/* <Button
          onPress={() => handleTeamCheckoutAttendance()}
          block
          style={[styles.StartDutyButton, { marginTop: 10 }]}
        >
          <Text style={styles.buttonTextSmall}>Checkout Team Attendance</Text>
        </Button> */}
        {/* <Button
          onPress={() => handleTeamLocationCheck()}
          block
          style={[styles.StartDutyButton, { marginTop: 10 }]}
        >
          <Text style={styles.buttonTextSmall}>View Team Location</Text>
        </Button> */}
      </View>

    </SafeAreaView>
  );
};
export default ManageTeam;
