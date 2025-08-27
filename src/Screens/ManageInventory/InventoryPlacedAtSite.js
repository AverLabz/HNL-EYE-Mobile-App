import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useRef, useState } from 'react';
import { FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownAlert from 'react-native-dropdownalert';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import JsonServer from '../../Api/api/JsonServer';
import Loader from '../../Components/Loader/Loader';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import styles from '../../Styles/Style';


const InventoryPlacedAtSite = ({ navigation }) => {
  const {
    userCredential,
    getAPICall,
    userId,
    selectedSite
  } = useContext(DataContext);

  let dropDownAlertRef = useRef(null);
  // const [userId, setUserId] = useState("")
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [text, setText] = useState("")
  const [placedAtSiteInventory, setPlacedAtSiteInventory] = useState([])

  const [openDepartment, setOpenDepartment] = useState(false);
  const [departmentValue, setDepartmentValue] = useState(null);
  const [departmentItems, setDepartmentItems] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      setText("")
      if(selectedSite !=""){
        getAllIssuance(selectedSite)
      }
    }, [navigation,selectedSite])
  )

  const getAllIssuance = (siteId) => {
    setIsLoading(true)
    var url = JsonServer.baseURL + "services/app/JazzTelcoInventoryConsumption/GetAll?Status=CONSUMED&SiteId=" + siteId
    getAPICall(url, (success, result, error) => {
      if (success == true) {
        if (result.items.length > 0) {
          setPlacedAtSiteInventory(result.items)
          setIsLoading(false)
        } else {
          setText("Data Not Found")
          setPlacedAtSiteInventory([])
          setIsLoading(false)
        }
      }
      else {
        setIsLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const handleDetailPress = (item) => {

  };

  const renderItem = (item) => {
    console.log(item)
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handleDetailPress(item)}
        style={{
          padding: 10,
          borderColor: constants.colorPrimary,
          borderWidth: 1,
          borderRadius: 10,
          margin: 5,
          alignItems: "center"
        }}>
        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Serial Number</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                {item.serialNumber}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Item Name</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                {item.itemName}
              </Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Site Code</Text>
              <Text style={styles.flatlistItemTextBoldRed}>{item.siteCode}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed} >Returnable</Text>
              <Text style={styles.flatlistItemTextBoldRed} >{item.isReturnable}</Text>
            </View>

            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.flatlistItemTextBoldRed}>Remarks</Text>
              <Text style={[styles.flatlistItemTextBoldRed, {}]}>
                {item.remarks}
              </Text>
            </View>

          </View>
        </View>
        <Image
          style={{
            height: 150,
            width: "100%",
            backgroundColor: constants.colorGrey838383,
            borderWidth: 1
          }}
          resizeMode="stretch"

          source={{
            uri: JsonServer.imageApiUrl + item.imagePath
          }}
          key={item.id}

        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>

      {isLoading && <Loader animating={isLoading} />}
      {placedAtSiteInventory.length > 0 ?
        <FlatList
          style={styles.list}
          data={placedAtSiteInventory}
          renderItem={({ item }) => renderItem(item)}
          onEndReachedThreshold={0.5}
          keyExtractor={(item) => item.id}
        /> :
        <View style={{ flex: 1, alignItems: "center", justifyContent: 'center', }}>
          <Text style={{ fontSize: 16, fontWeight: "600" }}>{text}</Text>
        </View>}
      <Modal
        isVisible={isModalVisible}
        swipeDirection='down'
        style={{ margin: 0 }}>

        <SafeAreaView style={styles1.main}>
          <ScrollView contentContainerStyle={{padding: 20,paddingTop:10}}>

            <View style={{ margin: 10,alignSelf:"flex-end" }}>
              <TouchableOpacity style={styles1.closeButtonStyle} onPress={() => setModalVisible(false)}>
                <Text style={{ fontWeight: "700", color: constants.colorWhite }}>X</Text>
              </TouchableOpacity>
            </View>

            <View style={styles1.filterViewContainer}>
              <View style={{ width: "80%" }}>
                <DropDownPicker
                  open={openDepartment}
                  value={departmentValue}
                  items={departmentItems}
                  setOpen={setOpenDepartment}
                  setValue={setDepartmentValue}
                  setItems={setDepartmentItems}
                  placeholder="Select Site"
                  style={styles1.DropDownPicker}
                  onChangeValue={(item) => {

                    if (item) {
                      setDepartmentValue(item)
                    }
                  }}
                  searchable
                  listMode="MODAL"
                />
              </View>
              <TouchableOpacity onPress={() => setDepartmentValue(null)} style={styles1.iconContainer}>
                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
              </TouchableOpacity>

            </View>


            <View style={styles1.panel}>
              <TouchableOpacity disabled={departmentValue == null ? true : false} onPress={() => {
                setModalVisible(false)
                getAllIssuance(departmentValue)
              }}
                style={{ ...styles1.panelButton, backgroundColor: departmentValue == null ? constants.lightGrayColor : constants.colorPrimary }}>
                <Text style={styles1.panelButtonTitle}>Apply Filter</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </SafeAreaView>
      </Modal >
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
};

export default InventoryPlacedAtSite;

const styles1 = StyleSheet.create({
  panelButton: {
    padding: 14,
    borderRadius: 8,
    backgroundColor: constants.colorPrimary,
    alignItems: 'center',
    marginVertical: 7,
  },
  main: {
    backgroundColor: '#fff',
    width: "100%",
    alignSelf: 'center',
    bottom: -20,
    position: 'absolute',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20
  },
  panelButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  panel: {
    paddingHorizontal: 10,
  },
  DropDownPicker: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: 'black',
    width: "100%"
  },
  closeButtonStyle: { backgroundColor: constants.colorPrimary, height: 25, width: 25, borderRadius: 100,alignItems:"center",justifyContent: 'center', },
  row: { flexDirection: 'row', backgroundColor: constants.lightGrayColor, },
  header: { height: 40, backgroundColor: "#C0C0C0" },
  text: { fontSize: 14, textAlign: 'center', color: constants.blackText, },
  btn: { width: 58, backgroundColor: '#78B7BB', borderRadius: 2, alignSelf: "center" },
  btnText: { textAlign: 'center', color: '#fff' },
  loadingContainer: { flex: 1, position: 'absolute', top: '40%', right: 0, left: 0, zIndex: 1 },
  filterViewContainer: { width: "100%", padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", },
  iconContainer: { width: "15%", backgroundColor: constants.lightGrayColor, padding: 5, alignItems: "center", borderRadius: 8 },
});