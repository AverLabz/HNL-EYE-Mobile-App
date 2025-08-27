import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, Text, TouchableOpacity, View, TouchableWithoutFeedback, Dimensions, StyleSheet } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../../Api/api/JsonServer';
import constants from '../../../constants/constants';
import { DataContext } from '../../../Context/context-provider';
import styles from '../../../Styles/Style';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';

const CMCreate= () => {
  const navigation = useNavigation();

  const [employ, setEmploy] = useState([])
  const [isModalVisible, setModalVisible] = useState(false);
  const [openEmploy, setOpenEmploy] = useState(false);
  const [employValue, setEmployValue] = useState(null);
  const [employItems, setEmployItems] = useState([]);

  const [loading, setLoading] = useState(true)
  const [selectedEmploy, setSelectedEmploy] = useState('')
  const [workOrderId, setWorkOrderId] = useState('')
  const [userId, setUserId] = useState('')

  const { getAPICall, createdWoCM, setCreatedWoCM, postRequest } = useContext(DataContext)
  let dropDownAlertRef = useRef(null);
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(true)

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("userId").then((value) => {
        getAllAcceptedWorkOrderCM(JSON.parse(value))
        setUserId(JSON.parse(value))
      })
    }, [isFocused])
  )

  const getAllAcceptedWorkOrderCM = (id) => {

    var url = JsonServer.baseURL + "services/app/WorkOrder/GetAll?MaxResultCount=1000&CreatorEmployeeId=" + id + "&Status=PENDING";
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setCreatedWoCM(result.items.filter(x => x.workOrderTypeName == "CM"))
        } else{
          setCreatedWoCM([])
        }
        setIsLoading(false)
      }
      else {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllEmploy = () => {
    var url = JsonServer.baseURL + "services/app/Suggestions/GetEmployees?OnlyPresent=true";
    getAPICall(url, (success, result, error) => {

      if (success) {
        if (result.length > 0) {
          let employTempArr = [];
          result.forEach((itemsElement) => {
            employTempArr.push({
              label: itemsElement.employeeName + itemsElement.erpId,
              value: itemsElement.employeeId,
            });
          });
          setEmployItems(employTempArr)
        }

      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }
  const resign = (empId,WoId) => {

    var url = JsonServer.baseURL + 'services/app/WorkOrder/ReAssignWorkOrder?WorkOrderId='+ WoId +'&EmployeeId='+ empId
    postRequest('', url, (success, result, error) => {
      if (result) {
        setLoading(false)
        getAllAcceptedWorkOrderCM(userId)
        dropDownAlertRef.alertWithType('success', 'Success', result)
      } else {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    });
  }
  const renderItem = (item) => {
    return (
      <TouchableOpacity onPress={() => { 
        setWorkOrderId(item.id) 
        setModalVisible(true);
      }} 
      style={{
        padding: 10,
        borderColor: constants.colorPrimary,
        borderWidth: 1,
        borderRadius: 10,
        margin: 2,
      }} >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.flatlistItemTextBoldRed} >{item.siteCode}</Text>
            <Text style={styles.flatlistItemTextBoldRed} >{item.workOrderTypeName}/{item.sourceFieldTypeName}</Text>
            <Text style={styles.flatlistItemTextBoldRed} >{item.assignedERPID}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.flatlistItemTextBoldRed} >{item.workOrderDescription}</Text>
            <Text style={styles.flatlistItemTextBoldRed} >{moment(item.dueDate).format('DD MMM YYYY')}</Text>
            <Text style={styles.flatlistItemTextBoldRed} >{item.assignedName}</Text>

          </View>
        </View>
      </TouchableOpacity>
    )
  }
  
  useEffect(() => {
    getAllEmploy()
  }, [])

  return (

    <View style={{ flex: 1, }} >
      {isLoading ? <View style={{ flex: 1, position: 'absolute', top: "40%", right: 0, left: 0, zIndex: 100, }}>
        <ActivityIndicator size="large" animating={isLoading} color={constants.colorPrimary} style={{ flex: 1, justifyContent: 'center', alignItems: "center", zIndex: 100, right: 0, left: 0, bottom: 0, top: 0, }} />
      </View> :
        <FlatList
          style={styles.list}
          data={createdWoCM}
          renderItem={({ item }) => renderItem(item)}
          onEndReachedThreshold={0.5}
          keyExtractor={item => item.id}
        />}

      <DropdownAlert
        ref={(ref) => {
          if (ref) {
            dropDownAlertRef = ref;
          }
        }}
        showCancel={true}
      />
      <TouchableOpacity
        style={{
          backgroundColor: constants.colorPrimary,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          width: 60,
          position: 'absolute',
          bottom: 10,
          right: 10,
          height: 60,
          borderRadius:100
        }}
        onPress={() => navigation.navigate('CreateCM')}
      >
        <Entypo name='plus' size={50} color={constants.colorWhite} />
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => { setModalVisible(false); }}>
      <Modal
        isVisible={isModalVisible}
        swipeDirection='down'
        style={{ margin: 0 ,height:20}}
        scrollOffset={0}
        backdropOpacity={0.85}
        propagateSwipe
        onBackButtonPress={() => { setModalVisible(false); }}
        onBackdropPress={() => { setModalVisible(false); }}
        onSwipeComplete={() => { setModalVisible(false); }}
        backdropTransitionOutTiming={0}
        >
          <View style={{
            backgroundColor: 'white', position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0, }}>
            <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
              <TouchableOpacity style={styles.closeButtonStyle} onPress={() => setModalVisible(false)}>
                <Text style={{ fontWeight: "700", color: constants.colorWhite}}>X</Text>
              </TouchableOpacity>
            </View>

          <View style={styles.ViewStyle}>
            <DropDownPicker
              open={openEmploy}
              value={employValue}
              items={employItems}
              setOpen={setOpenEmploy}
              setValue={setEmployValue}
              setItems={setEmployItems}
              placeholder="Select Employee"
              style={styles.DropDownPicker}
              searchable
              listMode="MODAL"
              onChangeValue={(item) => {
                setSelectedEmploy(item)
                console.log(item,'teseen')
              }}
              placeholderStyle={{
                color: "grey",
              }} />
          </View>
          <View style={styles.panel}>
            <TouchableOpacity style={styles.panelButton} onPress={()=> {
              setIsLoading(true)
              setModalVisible(false);
              resign(selectedEmploy,workOrderId)}} >
              <Text style={styles.panelButtonTitle}>Re-Assign</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal >
      </TouchableWithoutFeedback>
    </View>

  );
}
export default CMCreate;
