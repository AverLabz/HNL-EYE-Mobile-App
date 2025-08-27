import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from "react";

import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
  StyleSheet,
  FlatList,
} from "react-native";
import DropdownAlert from "react-native-dropdownalert";
import JsonServer from "../../Api/api/JsonServer";
import { showWarning } from "../../Components/AlertsMessage/AlertMessage";
import { DataContext } from "../../Context/context-provider";
import styles from "./Style";
import constants from "../../constants/constants";
import FocusAwareStatusBar from "../../Components/statusBar/FocusAwareStatusBar";
import { SafeAreaView } from "react-native-safe-area-context";
import BellIcon from '../../ImageAssets/Svg/BellIcon.svg'
import Modal from 'react-native-modal';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import Location from '../../ImageAssets/Svg/Location.svg'
import Phone from '../../ImageAssets/Svg/Phone.svg'
import Circle from '../../ImageAssets/Svg/Circle.svg'
import ArrowLeft from '../../ImageAssets/Svg/ArrowLeft.svg';
import CalendarPicker from 'react-native-calendar-picker';
import CustomLoader from "../../Components/CustomLoader/CustomLoader";

const currentDate = new Date(); // Current date
// Get the first day of the current month
const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

// Get the last day of the current month
const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
const HomeScreen = ({ navigation }) => {

  const { setUserCredential, setUserTenantId, getAPICall, postRequest, getCurretLocation, profileData } = useContext(DataContext)
  const [startDutyTime, setStartDutyTime] = useState('')
  const [endDutyTime, setEndDutyTime] = useState('')
  const [currentLongitude, setCurrentLongitude] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [dutyFromHome, setDutyFromHome] = useState(false)
  const [departmentInfo, setDepartmentInfo] = useState({})
  const [loading, setLoading] = useState(true)
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [leavesData, setLeavesData] = useState(null)
  let dropDownAlertRef = useRef(null);

  const [data, setData] = useState([
    { type: 'Casual', total: 0, backgroundColor: constants.cardBackgroundYellow },
    { type: 'Sick', total: 0, backgroundColor: constants.cardBackgroundDarkOrange },
    { type: 'Approved', total: 0, backgroundColor: constants.cardBackgroundSkyBlue },
    { type: 'Pending', total: 0, backgroundColor: constants.cardBackgroundDarkBlue },
  ]);

  const checkInternet = () => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = state.isConnected;
      if (!offline) {
        showWarning("Internet not connected")
      }
    });
  }

  const [selectedDates, setSelectedDates] = useState(null);

  const onDateChange = date => {
    // setSelectedStartDate(date);
  };

  const customDayHeaderStylesCallback = ({ dayOfWeek, month, year }) => {
    switch (dayOfWeek) {
      case 0:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontMedium,
            color: constants.defaultTextBlack,
          },
        };
      case 1:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontBold,
            color: constants.defaultTextBlack,
          },
        };
      case 2:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontMedium,
            color: constants.defaultTextBlack,
          },
        };
      case 3:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontMedium,
            color: constants.defaultTextBlack,
          },
        };
      case 4:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontBold,
            color: constants.defaultTextBlack,
          },
        };
      case 5:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontBold,
            color: 'rgba(247, 45, 78, 1)',
          },
        };
      case 6:
        return {
          textStyle: {
            fontSize: 12,
            fontFamily: constants.fontBold,
            color: 'rgba(247, 45, 78, 1)',
          },
        };
      default:
        return {};
    }
  };

  // Custom callback function to style the today's date
  const customDatesStylesCallback = date => {

    if (selectedDates && selectedDates.some(selectedDate =>
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    )) {
      return {
        textStyle: {
          color: constants.defaultTextBlack,
        },
        style:{backgroundColor:constants.selectedDateColor}
      };
    }

    return {};
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={styles.headerRightContainer}>
          {/* <TouchableOpacity activeOpacity={0.7}>
            <BellIcon height={28} width={28} />
          </TouchableOpacity> */}
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
  }, []);

  useEffect(() => {
    checkInternet()
    const unsubscribe = navigation.addListener('focus', () => {
      AsyncStorage.getItem('userTenantId').then((value) => {
        AsyncStorage.getItem('userCredential').then((value) => {
          if (value === null || value == "") {
            navigation.navigate("Login");
          } else {
            setUserCredential(value);
            fetchAttendanceDetails()
            // requestLocationPermission()
          }
        });
      });
    }, [])
    return unsubscribe;
  }, [navigation]);

  const requestLocationPermission = async () => {
    getCurretLocation((location, success) => {
      if (success) {
        setCurrentLatitude(location.coords.latitude);
        setCurrentLongitude(location.coords.longitude);
      }
    });
  }

  const fetchAttendanceDetails = () => {

    var url = JsonServer.baseURL + "services/app/EmployeeLeave/CheckLeaves"
    postRequest({}, url, (success, result, error) => {
      if (result) {
        setStartDutyTime(result.attendanceDetails.checkIn_Time)
        setEndDutyTime(result.attendanceDetails.checkOut_Time)
        data[0].total = result.leaves.Casual
        data[1].total = result.leaves.Sick
        data[2].total = result.approvedCount
        data[3].total = result.unApprovedCount
        const formattedDates = result.absenteesDates.map(dateString => new Date(dateString));
        setSelectedDates(formattedDates);
        console.log('result.absenteesDates', result.absenteesDates)
        // setSelectedDates(result.absenteesDates)
        setLeavesData(result)
        setLoading(false)
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
      // requestLocationPermission()
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
      // requestLocationPermission()
      setLoading(false)
    }
  }

  const startDuty = (location) => {
    if (location == '') {
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
      <ScrollView contentContainerStyle={styles.contentContainerStyle}>

        {/* Attendance Details Card */}
        {startDutyTime !== '' && <View style={styles.attendanceCard}>
          <View style={styles.attendanceCardSubCOntainerLeft}>
            <Text style={styles.attendanceTitle}>Today Start Time</Text>
            <Text style={[styles.field, { color: constants.textGreen }]}>{startDutyTime}</Text>
          </View>
          <View style={styles.attendanceCardSubCOntainerRight}>
            <Text style={styles.attendanceTitle}>Today End Time</Text>
            <Text style={[styles.field, { color: constants.textOrange }]}>{endDutyTime === '' && startDutyTime !== '' ? 'On Duty' : endDutyTime}</Text>
          </View>
        </View>}

        {/* Total Leaves Card */}
        <View style={styles.leaveCard}>
          <View style={styles.leaveCardSubContainer}>
            <Text style={styles.totalLeaveText}>{leavesData?.leftCount ?? 0}</Text>
            <Text style={styles.totalLeaveSubText}>Total Leaves Left</Text>
          </View>
          <View style={[styles.leaveCardSubContainer, styles.leaveCardRightContainer]}>
            <Text style={styles.annualLeaveText}>{leavesData?.totalCount ?? 0}</Text>
            <Text style={styles.annualLeaveSubText}>Annual Leaves</Text>
          </View>
        </View>

        {/* Leaves Cards */}
        <View style={styles.leaveCardContainer}>
          {data.map((item, index) => (
            <View key={index} style={[styles.leaveListCard, { backgroundColor: item.backgroundColor }]}>
              <Text style={styles.leaveListCardTopText}>{item.type}</Text>
              <Text style={styles.leaveListCardCenterText}>Leaves</Text>
              <Text style={styles.totalLeaveText}>{item.total}</Text>
            </View>
          ))}
        </View>

        {/* Calender */}
        <CalendarPicker
          onDateChange={onDateChange}
          nextTitle={<ArrowLeft style={{ transform: [{ rotateY: '180deg' }] }} />}
          previousTitle={<ArrowLeft />}
          weekdays={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
          showDayStragglers={false}
          allowRangeSelection={false}
          scrollable={false}
          todayBackgroundColor={constants.colorTransparent}
          selectedDayColor={constants.selectedDateColor}
          selectedDayTextColor={constants.defaultTextBlack}
          customDayHeaderStyles={customDayHeaderStylesCallback}
          dayLabelsWrapper={styles.dayLabelsWrapper}
          textStyle={styles.calenderText}
          monthTitleStyle={styles.monthAndYearText}
          yearTitleStyle={styles.monthAndYearText}
          customDatesStyles={customDatesStylesCallback}
          enableDateChange={false}
          minDate={firstDayOfMonth}
          maxDate={lastDayOfMonth}
          selectedDates={selectedDates}
          // restrictMonthNavigation
        />
        <View style={{ padding: 20 }} />
        <View style={styles.bottomContainer}>
          <View style={styles.bottomSubContainer}>
            <View style={styles.bottomCircle} />
            <Text style={styles.bottomContainerText}>Full day Leave</Text>
          </View>
          <View style={styles.bottomSubContainer}>
            <View style={[styles.bottomCircle, { backgroundColor: constants.halfLeaveDayColor }]} />
            <Text style={styles.bottomContainerText}>Half day Leave</Text>
          </View>
        </View>
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
  );
};

export default HomeScreen;

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

const theme = {

  "stylesheet.calendar.header": {
    dayHeader: {
      fontSize: 12,
      fontFamily: constants.fontMedium,
      color: constants.defaultTextBlack,
    },
  },
  "stylesheet.day.period": {
    base: {
      alignItems: "center",
      height: 34,
      overflow: "hidden",
      width: 38,
    },
  },
  "stylesheet.day.basic": {
    today: {
      borderColor: "#48BFE3",
      borderWidth: 0.8,
    },
    todayText: {
      color: "#5390D9",
      fontWeight: "800",
    },
  },
  backgroundColor: constants.background,
  calendarBackground: constants.background,
  selectedDayBackgroundColor: constants.selectedDateColor,
  selectedDayTextColor: constants.defaultTextBlack,
  todayTextColor: constants.defaultTextBlack,
  dayTextColor: constants.defaultTextBlack,
  disabledArrowColor: constants.colorTransparent,
  monthTextColor: constants.defaultTextBlack,
  // textDayFontFamily: "Montserrat-Medium",
  // textMonthFontFamily: "Montserrat-Medium",
  // textDayHeaderFontFamily: "Montserrat-Medium",
  // textDayHeaderFontWeight: "700",
  textDayHeaderColor: constants.red,
  textDayFontSize: 16,
  textMonthFontSize: 16,
  headerText: constants.red,
  "stylesheet.calendar.header": {
    week: {
      backgroundColor: constants.screenBackgroundWhite,
      textColor: constants.defaultTextBlack,
      flexDirection: "row",
      justifyContent: "space-between",
      // textAlignVertical: "center",
      // paddingTop: 5,
    },
  },
};


