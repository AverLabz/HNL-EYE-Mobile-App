import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View, processColor } from 'react-native';
import styles from './Style';
import WorkOrderPieChart from '../../Components/WorkOrderPieChart';
import { SafeAreaView } from 'react-native-safe-area-context';
import HalfPieChart from '../../Components/HalfPieChart';
import BellIcon from '../../ImageAssets/Svg/BellIcon.svg'
import Location from '../../ImageAssets/Svg/Location.svg'
import Phone from '../../ImageAssets/Svg/Phone.svg'
import Circle from '../../ImageAssets/Svg/Circle.svg'
import constants from '../../constants/constants';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import FocusAwareStatusBar from '../../Components/statusBar/FocusAwareStatusBar';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from "react-native-dropdownalert";
import JsonServer from '../../Api/api/JsonServer';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';
import { showWarning } from '../../Components/AlertsMessage/AlertMessage';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Dashboard = ({ }) => {

  const navigation = useNavigation()
  let dropDownAlertRef = useRef(null);
  const { getCurretLocation, postRequest, setUserCredential, getAPICall, profileData, setProfileData } = useContext(DataContext)
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [present, setPresent] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [startDutyTime, setStartDutyTime] = useState('')
  const [endDutyTime, setEndDutyTime] = useState('')
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [dutyFromHome, setDutyFromHome] = useState(false)
  const [attendanceDate, setAttendanceDate] = useState('')
  const [departmentInfo, setDepartmentInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [showAttendanceChart, setShowAttendanceChart] = useState(false)
  const [showCmChart, setShowCmChart] = useState(false)
  const [showPmChart, setShowPmChart] = useState(false)

  const [halfChartData, setHalfChartData] = useState({
    dataSets: [{
      values: [
        { value: 0, label: '' },
        { value: 0, label: '' },
        { value: 0, label: '' }
      ],
      label: '',
      config: {
        colors: [
          processColor('#D40101'),
          processColor('#F38200'),
          processColor('#67B700')
        ],
        valueTextSize: 14,
        valueTextColor: processColor('#FFFFFF'),
        sliceSpace: 0,
        selectionShift: 0,
        valueFormatter: "#.#'%'",
        valueLineColor: processColor('green'),
        valueLinePart1Length: 0.5
      }
    }],
  })

  const [pmChartData, setPmChartData] = useState({
    dataSets: [{
      values: [
        { value: 0, label: 'Assigned(WO)' },
        { value: 0, label: 'Accepted(WO)' },
        { value: 0, label: 'Pending(WO)' },
        { value: 0, label: 'Closed(WO)' }
      ],
      label: '',
      config: {
        colors: [
          processColor('#ffd16a'),
          processColor('#d12729'),
          processColor('#2352d3'),
          processColor('#68e974')
        ],
        valueTextSize: 0,
        valueTextColor: processColor('black'),
        sliceSpace: 3,
        selectionShift: 13,
        valueFormatter: "#.#'%'",
        valueLineColor: processColor('green'),
        valueLinePart1Length: 0.5
      }
    }],
  })

  const [cmChartData, setCmChartData] = useState({
    dataSets: [{
      values: [
        { value: 0, label: 'Assigned(WO)' },
        { value: 0, label: 'Accepted(WO)' },
        { value: 0, label: 'Pending(WO)' },
        { value: 0, label: 'Closed(WO)' }
      ],
      label: '',
      config: {
        colors: [
          processColor('#ffd16a'),
          processColor('#d12729'),
          processColor('#2352d3'),
          processColor('#68e974')
        ],
        valueTextSize: 0,
        valueTextColor: processColor('black'),
        sliceSpace: 3,
        selectionShift: 13,
        valueFormatter: "#.#'%'",
        valueLineColor: processColor('green'),
        valueLinePart1Length: 0.5
      }
    }],
  })

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/*
          <TouchableOpacity activeOpacity={0.7}>
            <BellIcon height={28} width={28} />
          </TouchableOpacity>*/}
          <TouchableOpacity
            style={{
              borderWidth: 2,
              borderRadius: 100,
              alignItems: 'center',
              justifyContent: 'center',
              height: 44,
              width: 44
            }}
            activeOpacity={0.7}
            onPress={() => {
              setIsCardVisible(true)
            }}>
            {profileData?.imagePath ? <Image
              source={{ uri: profileData?.imagePath }}
              style={styles.headerImage} /> :
              <Feather name="user" size={25} color={constants.defaultTextBlack} />}
          </TouchableOpacity>
        </View>
      ),
    });
  }, [profileData]);

  useFocusEffect(
    React.useCallback(() => {
      checkInternet();
      AsyncStorage.getItem('userCredential').then((value) => {        
        if (value) {
          fetchAttendanceDetails();
          requestLocationPermission();
        }
      });
    }, [])
  );

  useEffect(() => {
    const allZeroAttendance = halfChartData.dataSets[0].values.every(item => item.value === 0);
    setShowAttendanceChart(!allZeroAttendance); // Show the chart if not all values are zero

    const allZeroCm = cmChartData.dataSets[0].values.every(item => item.value === 0);
    setShowCmChart(!allZeroCm); // Show the chart if not all values are zero

    const allZeroPm = pmChartData.dataSets[0].values.every(item => item.value === 0);
    setShowPmChart(!allZeroPm); // Show the chart if not all values are zero
  }, [cmChartData, pmChartData, halfChartData]);

  const checkInternet = () => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = state.isConnected;
      if (!offline) {
        showWarning("Internet not connected")
      }
    });
  }

  const requestLocationPermission = async () => {
    getCurretLocation((location, success) => {
      if (success) {
        setCurrentLatitude(location.coords.latitude);
      }
    });
  }

  const fetchAttendanceDetails = () => {

    var url = JsonServer.baseURL + "services/app/Dashboard_Mobile/GetDetails"
    getAPICall(url, (success, result, error) => {
      if (result) {
        const attendanceTime = result.attendanceTime
        const attendanceReport = result.attendanceReport
        const pm = result.pm
        const cm = result.cm
        setProfileData(result.employeeDetails)

        setHalfChartData(prevState => {
          return {
            ...prevState,
            dataSets: [{
              ...prevState.dataSets[0],
              values: [
                { value: attendanceReport.absentCount, label: '' },
                { value: attendanceReport.leaves, label: '' },
                { value: attendanceReport.presentCount, label: '' }
              ]
            }]
          }
        });
        setPmChartData(prevState => {
          return {
            ...prevState,
            dataSets: [{
              ...prevState.dataSets[0],
              values: [
                { value: pm.assigned, label: 'Assigned(WO)' },
                { value: pm.accepted, label: 'Accepted(WO)' },
                { value: pm.pending, label: 'Pending(WO)' },
                { value: pm.closed, label: 'Closed(WO)' }
              ]
            }]
          }
        });
        setCmChartData(prevState => {
          return {
            ...prevState,
            dataSets: [{
              ...prevState.dataSets[0],
              values: [
                { value: cm.assigned, label: 'Assigned(WO)' },
                { value: cm.accepted, label: 'Accepted(WO)' },
                { value: cm.pending, label: 'Pending(WO)' },
                { value: cm.closed, label: 'Closed(WO)' }
              ]
            }]
          }
        });

        setPresent(attendanceTime.checkIn_Time === '' ? false : true)
        setStartDutyTime(attendanceTime.checkIn_Time)
        setEndDutyTime(attendanceTime.checkOut_Time)
        setAttendanceDate(attendanceTime.attendanceDate)
        IsDutyFromHomeDetails()
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const IsDutyFromHomeDetails = () => {
    var url = JsonServer.baseURL + "services/app/Department/AllocatedDepartment"
    postRequest({}, url, (success, result, error) => {

      if (result) {
        setDutyFromHome(result.workFromHome)
        setDepartmentInfo(result)
        setLoading(false)
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const handleStartDutyFromHome = (lat, long) => {
    if (lat != '') {
      var url = JsonServer.baseURL + 'services/app/Attendance/CheckIn'
      let dataToInsert = {
        location: "HOME",
        latitude: lat,
        longitude: long
      }
      postRequest(dataToInsert, url, (success, result, error) => {
        if (result) {
          console.log("Response ", result)
          dropDownAlertRef.alertWithType('success', 'Success', result)
          fetchAttendanceDetails()
        } else {
          setLoading(false)
          dropDownAlertRef.alertWithType('error', 'Alert', error.message)
        }
      })
    } else {
      dropDownAlertRef.alertWithType('error', 'Alert', "Please turn on your location")
      requestLocationPermission()
      setLoading(false)
    }
  }

  const handleEndDutyFromHome = (lat, long) => {
    if (lat != '') {
      var url = JsonServer.baseURL + 'services/app/Attendance/CheckOut'
      let dataToInsert = {
        location: "HOME",
        latitude: lat,
        longitude: long
      }
      postRequest(dataToInsert, url, (success, result, error) => {
        if (result) {
          dropDownAlertRef.alertWithType('success', 'Success', result)
          fetchAttendanceDetails()
        } else {
          setLoading(false)
          dropDownAlertRef.alertWithType('error', 'Alert', error.message)
        }
      })
    } else {
      dropDownAlertRef.alertWithType('error', 'Alert', "Please turn on your location")
      requestLocationPermission()
      setLoading(false)
    }
  }

  const startDuty = (location) => {
    if (location === '') {
      dropDownAlertRef.alertWithType('error', 'Alert', "Please turn on your location")
    } else {
      navigation.navigate('LocationForStartDuty', { departmentInfo: departmentInfo });
    }
  }
  const endDuty = (location) => {
    if (location == '') {
      dropDownAlertRef.alertWithType('error', 'Alert', "Please turn on your location")
    } else {
      navigation.navigate('LocationForEndDuty', { departmentInfo: departmentInfo });
    }
  }

  const onRefresh = () => {
    setRefreshing(true);

    fetchAttendanceDetails();
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const TeamMemberRow = ({ name, phoneNumber }) => {
    return (
      <View style={modalStyles.teamMemberRowContainer}>
        <View style={modalStyles.headerText}>
          <Circle width="25" height="25" />
        </View>
        <Text style={modalStyles.teamMemberName}>{name}</Text>
        <Text style={[modalStyles.teamMemberName, { flex: 3 }]}>{phoneNumber}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <FocusAwareStatusBar />
      {loading && <CustomLoader medium />}
      <ScrollView contentContainerStyle={styles.contentContainerStyle}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {/* Employee & Site Name  */}
        <View style={[modalStyles.header, { marginBottom: 2 }]}>
          {profileData && <Text style={modalStyles.name}>
            {profileData?.name} <Text style={modalStyles.subText}>({profileData?.designationName})</Text>
          </Text>}
        </View>
        {/* Erp ID */}
        {profileData && <Text style={modalStyles.field}>ERP ID: {profileData?.erpId}</Text>}

        {/* Start & End Duty Button */}
        {endDutyTime === '' && <TouchableOpacity activeOpacity={0.7} style={[styles.attendanceButton, { backgroundColor: present ? constants.monthBackgroundOrange : constants.red }]}
          onPress={() => {
            !present ? startDuty(currentLatitude) : endDuty(currentLatitude)
          }}>
          <Text style={styles.attendanceText}>{present ? 'End' : 'Start'} Duty</Text>
        </TouchableOpacity>}

        {/* Attendance Details Card */}
        {present && <View style={styles.attendanceCard}>
          <View style={styles.attendanceCardSubCOntainerLeft}>
            <Text style={styles.attendanceTitle}>Today Start Time</Text>
            <Text style={[modalStyles.field, { color: constants.textGreen }]}>{startDutyTime}</Text>
          </View>
          <View style={styles.attendanceCardSubCOntainerRight}>
            <Text style={styles.attendanceTitle}>Today End Time</Text>
            <Text style={[modalStyles.field, { color: constants.textOrange }]}>{endDutyTime === '' && startDutyTime !== '' ? 'On Duty' : endDutyTime}</Text>
          </View>
        </View>}

        {showAttendanceChart && <HalfPieChart
          workOrder={'PM'}
          data={halfChartData}
          onSelect={(event) => console.log(event)}
        />}
        {showPmChart && <WorkOrderPieChart
          workOrder={'PM'}
          data={pmChartData}
          onSelect={(event) => console.log(event)}
        />}
        {showCmChart && <WorkOrderPieChart
          workOrder={'CM'}
          data={cmChartData}
          onSelect={(event) => console.log(event)}
        />}
      </ScrollView>

      <Modal
        isVisible={isCardVisible}
        // swipeDirection='down'
        style={{ marginHorizontal: 0, top: -10 }}
        scrollOffset={0}
        backdropOpacity={0.85}
        onBackButtonPress={() => { setIsCardVisible(false); }}
        onBackdropPress={() => { setIsCardVisible(false); }}
        onSwipeComplete={() => { setIsCardVisible(false); }}
        backdropTransitionOutTiming={0}
        backdropColor={constants.screenBackgroundWhite}
        hasBackdrop
      >
        <ScrollView nestedScrollEnabled contentContainerStyle={modalStyles.card}>

          {/* Title & Close Button */}
          <View style={modalStyles.mainContainer}>
            <Text style={modalStyles.profileText}>Profile</Text>
            <TouchableOpacity style={modalStyles.crossContainer} onPress={() => { setIsCardVisible(false) }}>
              <AntDesign name="close" size={18} color={constants.defaultTextBlack} />
            </TouchableOpacity>
          </View>

          {/* Profile Image */}
          <View style={modalStyles.imageContainer}>
            {profileData?.imagePath ? <Image
              source={{ uri: profileData?.imagePath }}
              style={modalStyles.avatar}
            /> :
              <Feather name="user" size={60} color={constants.defaultTextBlack} />}
          </View>

          {/* Employee & Site Name  */}
          <View style={modalStyles.header}>
            <Text style={modalStyles.name}>
              {profileData?.name} <Text style={modalStyles.subText}>({profileData?.designationName})</Text>
            </Text>
            <Text style={[modalStyles.siteName,{flex:0}]}>{profileData?.sourceFieldTypeName}</Text>
          </View>
          {/* Erp ID */}
          <Text style={modalStyles.field}>ERP ID: {profileData?.erpId}</Text>

          <View style={modalStyles.rowField}>
            <Phone />
            <Text style={modalStyles.role}>{profileData?.phoneNumber}</Text>
          </View>

          <View style={modalStyles.rowField}>
            <Location />
            <Text style={modalStyles.role}>{profileData?.address}</Text>
          </View>

          <View style={[modalStyles.rowField, { marginTop: 20, }]}>
            <Text style={modalStyles.teamNameText}>Team Name:</Text>
            <Text style={modalStyles.siteName}>{profileData?.teamName}</Text>
          </View>

          {/* Nested Card */}

          <View style={modalStyles.nestedCard}>
            <Text style={modalStyles.siteName}>Team Members</Text>
            <FlatList
              data={profileData?.teamMembers} // Pass the teamMembers array as data
              renderItem={({ item }) => ( // Define a renderItem function
                <TeamMemberRow
                  name={item.name}
                  phoneNumber={item.phoneNumber}
                />
              )}
              keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
              style={{ height: 120 }}
            />
          </View>
        </ScrollView>
      </Modal>
      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        showCancel={true}
      />
    </SafeAreaView>
  )
}

export default Dashboard

const modalStyles = StyleSheet.create({
  card: {
    backgroundColor: constants.screenBackgroundWhite,
    padding: 20,
    borderRadius: 25,
    elevation: 4,
    marginHorizontal: 20,
    top: 55
  },
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  crossContainer: {
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F1F1',
    height: 32,
    width: 32
  },
  imageContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    height: 118,
    width: 118,
    marginBottom: 20,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 2,
    borderColor: constants.defaultTextBlack,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 11,
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  teamMemberRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  rowField: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 10
  },
  avatar: {
    height: 114,
    width: 114,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  headerText: {
    flex: 1,
    marginLeft: 10,
  },
  teamMemberRowContainerText: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    flex: 1,
    fontFamily: constants.fontMedium,
    fontSize: 20,
    lineHeight: 24.38,
    color: constants.defaultTextBlack,
  },
  subText: {
    fontFamily: constants.fontMedium,
    fontSize: 16,
    lineHeight: 19.5,
    color: constants.defaultTextBlack,
  },
  profileText: {
    fontFamily: constants.fontMedium,
    fontSize: 17,
    lineHeight: 20.72,
    color: constants.defaultTextBlack,
  },
  siteName: {
    flex:1,
    color: constants.defaultTextBlack,
    fontFamily: constants.fontBold,
    fontSize: 16,
    lineHeight: 19.5,
  },
  role: {
    fontFamily: constants.fontMedium,
    fontSize: 16,
    color: constants.defaultTextBlack,
    lineHeight: 19.5,
  },
  teamMemberName: {
    flex: 2.4,
    fontFamily: constants.fontMedium,
    fontSize: 12,
    color: constants.blackText,
    lineHeight: 14.63,
  },
  field: {
    fontFamily: constants.fontBold,
    color: constants.defaultTextBlack,
    fontSize: 16,
    marginBottom: 6,
    lineHeight: 19.5,
  },
  teamNameText: {
    fontFamily: constants.fontRegular,
    fontSize: 16,
    lineHeight: 19.5,
  },
  nestedCard: {
    backgroundColor: constants.profileCardBackground,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 11,
    minHeight: 180
  },

});
