import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useRef, useState } from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import DropDownPicker from 'react-native-dropdown-picker';
import { Table, TableWrapper, Row, Rows, Col, Cell } from 'react-native-table-component';
import constants from '../../constants/constants';
import DatabaseTopTabs from '../../Components/DatabaseTopTabs/DatabaseTopTabs';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Edittelcoinventory from '../Edit/EditTelcoinventory';
import EditBtscabinet from '../Edit/EditBtscabinet';
import EditAntennas from '../Edit/EditAntennas';
import EditRrus from '../Edit/EditRrus';
import EditIdu from '../Edit/EditIdu';
import EditOdu from '../Edit/EditOdu';
import EditBtscabinetboard from '../Edit/EditBtscabinetboard';
import BtsCabinetVswrs from '../Edit/BtsCabinetVswrs';
import IduMmuCards from '../Edit/IduMmuCards';

const FilterWithSiteFilterOnly = ({ navigation }) => {
  const childRef = useRef()

  const { getAPICall, userId } = useContext(DataContext)
  let dropDownAlertRef = useRef(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("telcoInventoryMain");
  const setListTitle = (titleToSet) => {
    setScreen(titleToSet);
  }
  const [openSiteName, setOpenSiteName] = useState(false);
  const [SiteNameValue, setSiteNameValue] = useState(null);
  const [SiteNameItems, setSiteNameItems] = useState([]);



  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => toggleModal()}
          style={{ marginRight: 10 }}>
          <MaterialIcons name="filter-list" size={28} color={constants.colorWhite} />
        </TouchableOpacity>
      ),
    });

  }, [navigation]);

  useEffect(() => {
    setModalVisible(true)
    AsyncStorage.getItem('userId').then((value) => {
      getAllSitesById(JSON.parse(value))
    })

  }, [])


  const toggleModal = () => {
    setModalVisible(true);
  };

  const applyFilterOnPress = () => {
    setModalVisible(false);
    childRef.current.childMethod();

  }
  const getAllSitesById = () => {
    var url = JsonServer.baseURL + "services/app/Suggestions/GetSites?MaxResultCount=10000&OnlyAllocated=true"
    getAPICall(url, (success, result, error) => {
      if (success) {

        if (result.totalCount > 0) {

          let siteTempArr = [];
          result.items.forEach((itemsElement) => {
            siteTempArr.push({
              label:itemsElement.siteCode,
              value: itemsElement.siteId,
            });
          });
          setSiteNameItems(siteTempArr)
        }

      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })


  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: constants.colorWhite }}>

      <DatabaseTopTabs
        telcoInventoryMain={() => {
          setListTitle('telcoInventoryMain');
        }}
        btsCabinet={() => {
          setListTitle('btsCabinet');
        }}
        Antennas={() => {
          setListTitle('Antennas');
        }}
        RRUs={() => {
          setListTitle('RRUs');
        }}
        IDU={() => {
          setListTitle('IDU');
        }}
        ODU={() => {
          setListTitle('ODU');
        }}
        BtsCabinetBoardCards={() => {
          setListTitle('BtsCabinetBoardCards');
        }}
        BtsCabinetBoardVSWRs={() => {
          setListTitle('BtsCabinetBoardVSWRs');
        }}
        IDUMMUCards={() => {
          setListTitle('IDUMMUCards');
        }}
      />

      {loading && <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          animating={loading}
          color={constants.colorPrimary}
          style={{}}
        />
      </View>}

      {screen == "telcoInventoryMain" && <Edittelcoinventory ref={childRef} siteIdToSend={SiteNameValue}></Edittelcoinventory>}

      {screen == "btsCabinet" && < EditBtscabinet ref={childRef} siteIdToSend={SiteNameValue}></EditBtscabinet>}

      {screen == "Antennas" && < EditAntennas ref={childRef} siteIdToSend={SiteNameValue}></EditAntennas>}


      {screen == "RRUs" && <EditRrus ref={childRef} siteIdToSend={SiteNameValue} onRRusPress={(tabName, setSerialImagePairs, site_Id) => navigation.navigate("SerialNumber", { tabName: tabName, setSerialImagePairs: setSerialImagePairs, site_Id: site_Id })}></EditRrus>}

      {screen == "IDU" && <EditIdu ref={childRef} siteIdToSend={SiteNameValue} onIduPress={(tabName, setSerialImagePairs, site_Id) => navigation.navigate("SerialNumber", { tabName: tabName, setSerialImagePairs: setSerialImagePairs, site_Id: site_Id })}></EditIdu>}

      {screen == "ODU" && <EditOdu ref={childRef} siteIdToSend={SiteNameValue} onOduPress={(tabName, setSerialImagePairs, site_Id) => navigation.navigate("SerialNumber", { tabName: tabName, setSerialImagePairs: setSerialImagePairs, site_Id: site_Id })}></EditOdu>}

      {screen == "BtsCabinetBoardCards" && <EditBtscabinetboard ref={childRef} siteIdToSend={SiteNameValue} onBtsCabinetBoardCardPress={(tabName, setSerialImagePairs, site_Id) => navigation.navigate("SerialNumber", { tabName: tabName, setSerialImagePairs: setSerialImagePairs, site_Id: site_Id })}></EditBtscabinetboard>}

      {screen == "BtsCabinetBoardVSWRs" && <BtsCabinetVswrs ref={childRef} siteIdToSend={SiteNameValue} ></BtsCabinetVswrs>}

      {screen == "IDUMMUCards" && <IduMmuCards ref={childRef} siteIdToSend={SiteNameValue} onIduMMUCardPress={(tabName, setSerialImagePairs, site_Id) => navigation.navigate("SerialNumber", { tabName: tabName, setSerialImagePairs: setSerialImagePairs, site_Id: site_Id })}></IduMmuCards>}

      <Modal
        isVisible={isModalVisible}
        swipeDirection='down'
        style={{ margin: 0 }}>

        <SafeAreaView style={styles.main}>
          <ScrollView contentContainerStyle={{padding: 20,paddingTop:10}}>

            <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
              <TouchableOpacity style={styles.closeButtonStyle} onPress={() => setModalVisible(false)}>
                <Text style={{ fontWeight: "700", color: constants.colorWhite }}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.filterViewContainer}>
              <View style={{ width: "80%" }}>
                <DropDownPicker
                  open={openSiteName}
                  value={SiteNameValue}
                  items={SiteNameItems}
                  setOpen={setOpenSiteName}
                  setValue={setSiteNameValue}
                  setItems={setSiteNameItems}
                  placeholder="Select Site Name"
                  style={styles.DropDownPicker}
                  onChangeValue={(item) => {
                    if (item) {
                      setSiteNameValue(item)
                    }
                  }}
                  searchable
                  listMode="MODAL"
                />
              </View>
              <TouchableOpacity onPress={() => setSiteNameValue(null)} style={styles.iconContainer}>
                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
              </TouchableOpacity>
            </View>


            <View style={styles.panel}>
              <TouchableOpacity onPress={() => applyFilterOnPress()} style={styles.panelButton}>
                <Text style={styles.panelButtonTitle}>Apply Filter</Text>
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
    </SafeAreaView >
  );
};

export default FilterWithSiteFilterOnly;

const styles = StyleSheet.create({
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
    borderTopRightRadius: 20,
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
  closeButtonStyle: { backgroundColor: constants.colorPrimary, height: 25, width: 25, borderRadius: 100,alignItems:"center",justifyContent: 'center' },
  row: { flexDirection: 'row', backgroundColor: constants.lightGrayColor, },
  header: { height: 40, backgroundColor: "#C0C0C0" },
  text: { fontSize: 14, textAlign: 'center', color: constants.blackText, },
  btn: { width: 58, backgroundColor: '#78B7BB', borderRadius: 2, alignSelf: "center" },
  btnText: { textAlign: 'center', color: '#fff' },
  loadingContainer: { flex: 1, position: 'absolute', top: '40%', right: 0, left: 0, zIndex: 1 },
  filterViewContainer: { width: "100%", padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", },
  iconContainer: { width: "15%", backgroundColor: constants.lightGrayColor, padding: 5, alignItems: "center", borderRadius: 8 },
});
