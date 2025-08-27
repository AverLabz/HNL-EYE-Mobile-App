import AsyncStorage from '@react-native-async-storage/async-storage';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownAlert from 'react-native-dropdownalert';
import Modal from 'react-native-modal';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DataContext } from '../../Context/context-provider';
import constants from '../../constants/constants';
import AcceptFaulty from './AcceptFaulty';
import InventoryAcceptedByEmployee from './InventoryAcceptedByEmployee';
import InventoryAssigned from './InventoryAssigned';
import InventoryPlacedAtSite from './InventoryPlacedAtSite';
import InventoryReturnToWarehouse from './InventoryReturnToWarehouse';
import Partial from './Partial';

const ManageInventoryParent = ({ navigation }) => {
  let dropDownAlertRef = useRef(null);
  const Tab = createMaterialTopTabNavigator();
  const { setWOScreenNavigationProps, setSelectedSite } = useContext(DataContext)
  const [isModalVisible, setModalVisible] = useState(false);
  const [openDepartment, setOpenDepartment] = useState(false);
  const [departmentValue, setDepartmentValue] = useState(null);
  const [departmentItems, setDepartmentItems] = useState([]);
  const [selectedSiteName, setSelectedSiteName] = useState("")

  useEffect(() => {
    AsyncStorage.getItem('userCredential').then((value) => {
      let id = parseInt(JSON.parse(value).userNameOrEmailAddress)
      // getAllSitesData(id)
    })
  }, [])

  React.useEffect(() => {
    setWOScreenNavigationProps(navigation);

    const backAction = () => {
      navigation.goBack()
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );
    return () => backHandler.remove();
  }, []);


  return (
    <View style={{ flex: 1, backgroundColor: constants.lightGrayColor }}>

      <Tab.Navigator
        screenOptions={{
          tabBarScrollEnabled: true,

        }}
        tabBarOptions={{
          activeTintColor: constants.colorPrimary,
          inactiveTintColor: constants.colorPrimary,
          scrollEnabled: true,
          indicatorStyle: {
            backgroundColor: constants.colorPrimary,
          },
        }}
      >
        <Tab.Screen name="InventoryAssigned" component={InventoryAssigned} options={{ tabBarLabel: 'Assigned' }} />
        <Tab.Screen name="InventoryAcceptedByEmployee" component={InventoryAcceptedByEmployee} options={{ tabBarLabel: 'Accepted' }} />
        <Tab.Screen name="Partial" component={Partial} options={{ tabBarLabel: 'Partial' }} />
        <Tab.Screen name="InventoryPlacedAtSite" component={InventoryPlacedAtSite} options={{ tabBarLabel: 'Placed At Site' }} />
        <Tab.Screen name="AcceptFaulty" component={AcceptFaulty} options={{ tabBarLabel: 'Return Faulty' }} />
        <Tab.Screen name="InventoryReturnToWarehouse" component={InventoryReturnToWarehouse} options={{ tabBarLabel: 'Return To WH' }} />
      </Tab.Navigator>

      <Modal
        isVisible={isModalVisible}
        swipeDirection='down'
        style={{ margin: 0 }}>

        <SafeAreaView style={styles1.main}>
          <ScrollView contentContainerStyle={{ padding: 20, paddingTop: 10 }}>

            <View style={{ margin: 10, alignSelf: "flex-end" }}>
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
                  onSelectItem={(item) => {
                    setSelectedSite(item.value)
                    setSelectedSiteName(item.label)
                    setModalVisible(false)
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
}

export default ManageInventoryParent

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
  closeButtonStyle: { backgroundColor: constants.colorPrimary, height: 25, width: 25, borderRadius: 100, alignItems: "center", justifyContent: 'center', },
  row: { flexDirection: 'row', backgroundColor: constants.lightGrayColor, },
  header: { height: 40, backgroundColor: "#C0C0C0" },
  text: { fontSize: 14, textAlign: 'center', color: constants.blackText, },
  btn: { width: 58, backgroundColor: '#78B7BB', borderRadius: 2, alignSelf: "center" },
  btnText: { textAlign: 'center', color: '#fff' },
  loadingContainer: { flex: 1, position: 'absolute', top: '40%', right: 0, left: 0, zIndex: 1 },
  filterViewContainer: { width: "100%", padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", },
  iconContainer: { width: "15%", backgroundColor: constants.lightGrayColor, padding: 5, alignItems: "center", borderRadius: 8 },
});