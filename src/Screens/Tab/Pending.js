import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useContext, useRef, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import styles from '../../Styles/Style';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import Modal from 'react-native-modal';



const Pending = () => {
  let dropDownAlertRef = useRef(null);
  const { getAPICall, postRequest } = useContext(DataContext)
  const [userId, setUserId] = useState('')
  const [pendingNonTelCo, setPendingNonTelCo] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(0)
  const [isModelVisible, setIsModelVisible] = useState(false)
  const [selectedId, setSelectedId] = useState('')


  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("userId").then((value) => {
        getAllPendingNonTelCoInventory(JSON.parse(value))
        setUserId(JSON.parse(value))
      })
    }, [])
  )

  const getAllPendingNonTelCoInventory = (id) => {

    var url = JsonServer.baseURL + "services/app/NonTelcoStoreLedger/GetAllIssuances?MaxResultCount=100&EmployeeId=" + id + "&Status=PENDING"
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setPendingNonTelCo(result.items)
        } else {
          setPendingNonTelCo([])
        }
        setIsLoading(false)
      }
      else {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }
  const handleAcceptInventory = (id, qty) => {
    var url = JsonServer.baseURL + "services/app/NonTelcoEmployeeLedger/AcceptInventories"
    let dataToInsert = {
      id: id,
      quantity: qty
    }
    postRequest(dataToInsert, url, (success, result, error) => {
      if (success) {
        dropDownAlertRef.alertWithType('success', 'Success', "Inventory Accepted Successfully")
        getAllPendingNonTelCoInventory(userId)
      } else if (error) {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }


  const handleDetailPress = (id, qty) => {
    if (qty > 0) {
      setIsModelVisible(false)
      setIsLoading(true)
      handleAcceptInventory(id, qty)
    } else {
      dropDownAlertRef.alertWithType('error', 'Alert', 'Quantity must be Grater than 0')
    }
  }

  const renderItem = (item) => {

    return (
      <TouchableOpacity onPress={() => {
        setSelectedId(item.id)
        setIsModelVisible(true)
      }} style={{
        padding: 10,
        borderColor: constants.colorPrimary,
        borderWidth: 1,
        borderRadius: 10,
        margin: 4,
      }} >
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, }} >Item Code</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, }} >Project</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, }} >Warehouse</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, }} >Issued Quantity</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, }} >Accepted Quantity</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, }} >Remarks</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, fontWeight: "600" }} >{item.itemCode}</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, fontWeight: "600" }} >{item.projectName}</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, fontWeight: "600" }} >{item.warehouseName}</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, fontWeight: "600" }} >{item.issuedQuantity}</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, fontWeight: "600" }} >{item.acceptedQuantity}</Text>
            <Text style={{ ...styles.flatlistItemTextBoldRed, padding: 4, fontWeight: "600" }} >{item.remarks}</Text>

          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, }} >
      {isLoading ? <View style={{ flex: 1, position: 'absolute', top: "40%", right: 0, left: 0, zIndex: 100, }}>
        <ActivityIndicator size="large" animating={isLoading} color={constants.colorPrimary} style={{ flex: 1, justifyContent: 'center', alignItems: "center", zIndex: 100, right: 0, left: 0, bottom: 0, top: 0, }} />
      </View> :
        <FlatList
          data={pendingNonTelCo}
          renderItem={({ item }) => renderItem(item)}
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
      <Modal isVisible={isModelVisible} scrollOffset={0}>
        <View style={{ backgroundColor: "white", paddingVertical: 10, borderRadius: 10 }}>
          <KeyboardAvoidingView enabled behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <TextInput
              placeholder='Enter Quantity'
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
              keyboardType={'number-pad'}
              style={{ borderWidth: 0.5, margin: 15 }}
            />
          </KeyboardAvoidingView>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
            <TouchableOpacity style={{ alignItems: "center", width: 100, padding: 10, borderWidth: 0.5 }} onPress={() => setIsModelVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: constants.colorPrimary, alignItems: "center", width: 100, padding: 10, borderWidth: 0.5 }} onPress={() => { handleDetailPress(selectedId, quantity) }}>
              <Text style={{ color: "white", fontWeight: "600" }}>Accept</Text>
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  )
}

export default Pending

