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

const Filter = ({ navigation }) => {

  const { getAPICall } = useContext(DataContext)
  let dropDownAlertRef = useRef(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [screen, setScreen] = useState("telcoInventoryMain");
  const setListTitle = (titleToSet) => {
    setScreen(titleToSet);
  }

  const [openDepartment, setOpenDepartment] = useState(false);
  const [departmentValue, setDepartmentValue] = useState(null);
  const [departmentItems, setDepartmentItems] = useState([]);

  const [openRegion, setOpenRegion] = useState(false);
  const [regionValue, setRegionValue] = useState(null);
  const [regionItems, setRegionItems] = useState([]);

  const [openSubRegion, setOpenSubRegion] = useState(false);
  const [subRegionValue, setSubRegionValue] = useState(null);
  const [subRegionItems, setSubRegionItems] = useState([]);

  const [openMBUName, setOpenMBUName] = useState(false);
  const [mBUNameValue, setMBUNameValue] = useState(null);
  const [mBUNameItems, setMBUNameItems] = useState([]);

  const [telcoInventoryMainTableHead, setTelcoInventoryMainTableHead] = useState(['Site Code', 'Site Name', 'Site Region Name', 'Latitude', 'Longitude', 'MBU_Name', 'Site_Type', 'Site_Category', 'Site_Priority', 'Site Status', 'Inventory-List IDU', 'Inventory-List ODU', 'Inventory-List Antennas', 'Ret-Installed', 'Site Asset Type', 'Site_PP_Type_Id', 'Inventory-List RRUs', 'Bts Cabinet', 'Mechanical-Assembly', 'Electrical-Tilt-2G', 'Electrical-Tilt-3G', 'Electrical-Tilt-4G', 'Mechanical-Tilt', 'Zonal Manager', 'Action'])
  const [widthArr, setWidthArr] = useState([120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 120, 140, 140, 120, 120, 120, 120, 120, 120, 120, 120])
  const [telcoInventoryMainTableData, setTelcoInventoryMainTableData] = useState([])

  const [btsCabinetTableHead, setBtsCabinetTableHead] = useState(['Site Code', 'No Of DBC', 'No Of Fibers', 'Serving Technology', 'IsActive', 'Action'])
  const [btsCabinetWidthArr, setBtsCabinetWidthArr] = useState([120, 120, 120, 120, 120, 120])
  const [btsCabinetTableData, setBtsCabinetTableData] = useState([])

  const [antennasTableHead, setAntennasTableHead] = useState(['Site Code', 'Antenna Type', 'Antenna Ports', 'Installation Height', 'Count', 'Azimuth', 'IsActive', 'Action'])
  const [antennasWidthArr, setAntennasWidthArr] = useState([120, 120, 120, 120, 120, 120, 120, 120])
  const [antennasTableData, setAntennasTableData] = useState([])

  const [rRUsTableHead, setRRUsTableHead] = useState(['Site Code', 'RRU Type', 'Installation Height', 'Serial Number', 'IsActive', 'Action'])
  const [rRUsWidthArr, setRRUsWidthArr] = useState([120, 120, 120, 120, 120, 120])
  const [rRUsTableData, setRRUsTableData] = useState([])

  const [iDUTableHead, setIDUTableHead] = useState(['Site Code', 'IDU Type', 'Count', 'Faculty Slots', 'Chassis Type', 'Sr.# Type', 'IsActive', 'Action'])
  const [iDUWidthArr, setIDUWidthArr] = useState([120, 120, 120, 120, 120, 120, 120, 120])
  const [iDUTableData, setIDUTableData] = useState([])

  const [oDUTableHead, setODUTableHead] = useState(['Site Code', 'OdU Type', 'No Of IF-Cables', 'Installation Height', 'RSL', 'Sr.# Type', 'Cable Grounding', 'IsActive', 'Action'])
  const [oDUWidthArr, setODUWidthArr] = useState([120, 120, 120, 120, 120, 120, 120, 120, 120])
  const [oDUTableData, setODUTableData] = useState([])

  const [btsCabinetBoardCardsTableHead, setBtsCabinetBoardCardsTableHead] = useState(['Site Code', 'Board Name', 'Board Status', 'Quantity', 'Serial #', 'Action'])
  const [btsCabinetBoardCardsWidthArr, setBtsCabinetBoardCardsWidthArr] = useState([120, 120, 120, 120, 120, 120])
  const [btsCabinetBoardCardsTableData, setBtsCabinetBoardCardsTableData] = useState([])

  const [btsCabinetBoardVSWRsTableHead, setBtsCabinetBoardVSWRsTableHead] = useState(['Site Code', 'Cell-ID', 'Cell Name', 'VSWR Value', 'Action'])
  const [btsCabinetBoardVSWRsWidthArr, setBtsCabinetBoardVSWRsWidthArr] = useState([120, 120, 120, 120, 120])
  const [btsCabinetBoardVSWRsTableData, setBtsCabinetBoardVSWRsTableData] = useState([])

  const [iDUMMUCardsTableHead, setIDUMMUCardsTableHead] = useState(['Site Code', 'Type', 'Quantity', 'Serial Number', 'Status', 'Lb Verification', 'Action'])
  const [iDUMMUCardsWidthArr, setIDUMMUCardsWidthArr] = useState([120, 120, 120, 120, 120, 120, 120])
  const [iDUMMUCardsTableData, setIDUMMUCardsTableData] = useState([])

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
    getAllTelcoInventoryMain(departmentValue, regionValue, subRegionValue, mBUNameValue)
  }, [])

  const getAllTelcoInventoryMain = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_TelcoInventoryMain?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {

      if (success) {

        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode.toString(),
            )
            tableDataArr.push(
              element.siteName,
            )
            tableDataArr.push(
              element.regionName,
            )
            tableDataArr.push(
              element.latitude.toString(),
            )
            tableDataArr.push(
              element.longitude.toString(),
            )
            tableDataArr.push(
              element.mbuName,
            )
            tableDataArr.push(
              element.siteTypeName,
            )
            tableDataArr.push(
              element.siteCategoryName,
            )
            tableDataArr.push(
              element.sitePriorityName,
            )
            tableDataArr.push(
              element.siteStatusName,
            )
            tableDataArr.push(
              element.inventoryListIDUName,
            )
            tableDataArr.push(
              element.inventoryListODUName,
            )
            tableDataArr.push(
              element.inventoryListAntennaName,
            )
            tableDataArr.push(
              element.retInstalledName,
            )
            tableDataArr.push(
              element.siteAssetTypeName,
            )
            tableDataArr.push(
              element.sitePowerProfileTypeName,
            )
            tableDataArr.push(
              element.inventoryListRRUName,
            )
            tableDataArr.push(
              element.btsCabinetName,
            )
            tableDataArr.push(
              element.mechanicalAssemblyName,
            )
            tableDataArr.push(
              element.electricalTilt2G,
            )
            tableDataArr.push(
              element.electricalTilt3G,
            )
            tableDataArr.push(
              element.electricalTilt4G,
            )
            tableDataArr.push(
              element.mechanicalTilt,
            )
            tableDataArr.push(
              element.zonalManager,
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);
          });
          setTelcoInventoryMainTableData(tableDataArrTemp);
          setLoading(false)

        } else {
          setTelcoInventoryMainTableData([]);
          setLoading(false);
        }
      }
      else {

        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllBtsCabinet = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_MainBtsCabinet?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {

        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.noOfDBC.toString(),
            )
            tableDataArr.push(
              element.noOfFibers.toString(),
            )
            tableDataArr.push(
              element.servingTechnologyName,
            )
            tableDataArr.push(
              element.isActive.toString(),
            )
            tableDataArr.push(
              element.id.toString(),
            )
            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);
          })
          setBtsCabinetTableData(tableDataArrTemp)
          setLoading(false)
        } else {
          setBtsCabinetTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllAntennas = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_Antennas?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result.items.length > 0) {
          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.antennaTypeName,
            )
            tableDataArr.push(
              element.antennaPortName,
            )
            tableDataArr.push(
              element.installationHeight.toString(),
            )
            tableDataArr.push(
              element.count.toString(),
            )
            tableDataArr.push(
              element.azimuth,
            )
            tableDataArr.push(
              element.isActive.toString(),
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);

          })
          setAntennasTableData(tableDataArrTemp)
          setLoading(false)
        } else {
          setAntennasTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAll_RRUs = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_RRUs?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.rruTypeName,
            )
            tableDataArr.push(
              element.installationHeight.toString(),
            )
            tableDataArr.push(
              element.serialNumber,
            )
            tableDataArr.push(
              element.isActive.toString(),
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);

          })
          setRRUsTableData(tableDataArrTemp)
          setLoading(false)
        } else {
          setRRUsTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const GetAll_IDUs = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_IDUs?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.iduType,
            )
            tableDataArr.push(
              element.count.toString(),
            )
            tableDataArr.push(
              element.facultySlotName,
            )
            tableDataArr.push(
              element.chassisTypeName,
            )
            tableDataArr.push(
              element.serialNumber,
            )
            tableDataArr.push(
              element.isActive.toString(),
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);
          })
          setIDUTableData(tableDataArrTemp)
          setLoading(false)

        } else {
          setIDUTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }

    })
  }

  const getAll_ODUs = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_ODUs?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.oduType,
            )
            tableDataArr.push(
              element.noOfIFCable.toString(),
            )
            tableDataArr.push(
              element.installationHeight.toString(),
            )
            tableDataArr.push(
              element.rsl,
            )
            tableDataArr.push(
              element.serialNumber,
            )
            tableDataArr.push(
              element.cableGroundingName,
            )
            tableDataArr.push(
              element.isActive.toString(),
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);
          })
          setODUTableData(tableDataArrTemp)
          setLoading(false)
        } else {
          setODUTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const GetAll_BtsCabinetBoardCards = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_BtsCabinetBoardCards?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []
          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.boardName,
            )
            tableDataArr.push(
              element.boardStatus,
            )
            tableDataArr.push(
              element.quantity.toString(),
            )
            tableDataArr.push(
              element.serialNumber,
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);

          })
          setLoading(false)
          setBtsCabinetBoardCardsTableData(tableDataArrTemp)
        } else {
          setBtsCabinetBoardCardsTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const GetAll_BtsCabinetVSWRs = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_BtsCabinetVSWRs?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []

          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.cellId.toString(),
            )
            tableDataArr.push(
              element.cellName_Name,
            )
            tableDataArr.push(
              element.vswrValue,
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);

          })
          setLoading(false)
          setBtsCabinetBoardVSWRsTableData(tableDataArrTemp)
        } else {
          setBtsCabinetBoardVSWRsTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const GetAll_IDUMMUCards = (departmentId1, regionId1, subRegionId1, mBUId1) => {
    setLoading(true)
    var departmentId = departmentId1 == null ? 0 : departmentId1;
    var regionId = regionId1 == null ? 0 : regionId1;
    var subRegionId = subRegionId1 == null ? 0 : subRegionId1;
    var mBUId = mBUId1 == null ? 0 : mBUId1;

    var url = JsonServer.baseURL + "services/app/AMS/GetAll_IDUMMUCards?DepartmentId=" + departmentId + "&RegionId=" + regionId + "&SubRegionId=" + subRegionId + "&MBUId=" + mBUId;
    getAPICall(url, (success, result, error) => {
      if (success) {

        if (result.items.length > 0) {

          var tableDataArr = []
          var tableDataArrTemp = []

          result.items.forEach(element => {

            tableDataArr.push(
              element.siteCode,
            )
            tableDataArr.push(
              element.type,
            )
            tableDataArr.push(
              element.quantity.toString(),
            )
            tableDataArr.push(
              element.serialNumber,
            )
            tableDataArr.push(
              element.idummuStatusName,
            )
            tableDataArr.push(
              element.lbVerificationName,
            )
            tableDataArr.push(
              element.id.toString(),
            )

            var arrayToStringTemp = tableDataArr;
            tableDataArr = [];
            tableDataArrTemp.push(arrayToStringTemp);

          })
          setLoading(false)
          setIDUMMUCardsTableData(tableDataArrTemp)
        } else {
          setIDUMMUCardsTableData([]);
          setLoading(false);
        }
      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllDepartment = () => {
    var url = JsonServer.baseURL + "services/app/Suggestions/GetDepartments";
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result) {

          let departmentTempArr = [];
          result.forEach((itemsElement) => {
            departmentTempArr.push({
              label: itemsElement.departmentName,
              value: itemsElement.departmentId,
            });
          });
          setDepartmentItems(departmentTempArr)
        }

      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllRegions = () => {
    var url = JsonServer.baseURL + "services/app/Suggestions/GetRegions";
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result) {

          let departmentTempArr = [];
          result.forEach((itemsElement) => {
            departmentTempArr.push({
              label: itemsElement.regionName,
              value: itemsElement.regionId,
            });
          });
          setRegionItems(departmentTempArr)
        }

      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllSubRegions = () => {
    var url = JsonServer.baseURL + "services/app/Suggestions/GetSubRegions";
    getAPICall(url, (success, result, error) => {
      if (success) {
        if (result) {

          let departmentTempArr = [];
          result.forEach((itemsElement) => {
            departmentTempArr.push({
              label: itemsElement.subRegionName,
              value: itemsElement.subRegionId,
            });
          });
          setSubRegionItems(departmentTempArr)
        }

      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const getAllMBU = () => {
    var url = JsonServer.baseURL + "services/app/MBU/GetAllMBUWithFilter?MaxResultCount=50";
    getAPICall(url, (success, result, error) => {
      if (success) {

        if (result.totalCount > 0) {

          let departmentTempArr = [];
          result.items.forEach((itemsElement) => {
            departmentTempArr.push({
              label: itemsElement.name,
              value: itemsElement.id,
            });
          });
          setMBUNameItems(departmentTempArr)
        }

      } else if (error) {
        setLoading(false)
        dropDownAlertRef.alertWithType('error', 'Alert', error.message)
      }
    })
  }

  const element = (data, index, screenName) => (
    <TouchableOpacity onPress={() => navigation.navigate(screenName, { id: data, GetAll_BtsCabinetBoardCards: () => GetAll_BtsCabinetBoardCards(departmentValue, regionValue, subRegionValue, mBUNameValue) })}>
      <View style={styles.btn}>
        <Text style={styles.btnText}>Edit</Text>
      </View>
    </TouchableOpacity >
  )


  const toggleModal = () => {
    getAllDepartment()
    getAllRegions()
    getAllSubRegions()
    getAllMBU()
    setModalVisible(true);
  };

  const applyFilterOnPress = () => {
    setModalVisible(false);
    if (screen == "telcoInventoryMain") {
      getAllTelcoInventoryMain(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "btsCabinet") {
      getAllBtsCabinet(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "Antennas") {
      getAllAntennas(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "RRUs") {
      getAll_RRUs(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "IDU") {
      GetAll_IDUs(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "ODU") {
      getAll_ODUs(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "BtsCabinetBoardCards") {
      GetAll_BtsCabinetBoardCards(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "BtsCabinetBoardVSWRs") {
      GetAll_BtsCabinetVSWRs(departmentValue, regionValue, subRegionValue, mBUNameValue)
    } else if (screen == "IDUMMUCards") {
      GetAll_IDUMMUCards(departmentValue, regionValue, subRegionValue, mBUNameValue)
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: constants.colorWhite }}>

      <DatabaseTopTabs
        telcoInventoryMain={() => {
          setListTitle('telcoInventoryMain');
          getAllTelcoInventoryMain(departmentValue, regionValue, subRegionValue, mBUNameValue);
        }}
        btsCabinet={() => {
          setListTitle('btsCabinet');
          getAllBtsCabinet(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        Antennas={() => {
          setListTitle('Antennas');
          getAllAntennas(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        RRUs={() => {
          setListTitle('RRUs');
          getAll_RRUs(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        IDU={() => {
          setListTitle('IDU');
          GetAll_IDUs(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        ODU={() => {
          setListTitle('ODU');
          getAll_ODUs(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        BtsCabinetBoardCards={() => {
          setListTitle('BtsCabinetBoardCards');
          GetAll_BtsCabinetBoardCards(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        BtsCabinetBoardVSWRs={() => {
          setListTitle('BtsCabinetBoardVSWRs');
          GetAll_BtsCabinetVSWRs(departmentValue, regionValue, subRegionValue, mBUNameValue)
        }}
        IDUMMUCards={() => {
          setListTitle('IDUMMUCards');
          GetAll_IDUMMUCards(departmentValue, regionValue, subRegionValue, mBUNameValue)
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

      {screen == "telcoInventoryMain" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={telcoInventoryMainTableHead} widthArr={widthArr} style={styles.header} textStyle={styles.text} />

            {telcoInventoryMainTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={widthArr[cellIndex]} data={cellIndex === 24 ? element(cellData, index, "Edittelcoinventory") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40, }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "btsCabinet" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={btsCabinetTableHead} widthArr={btsCabinetWidthArr} style={styles.header} textStyle={styles.text} />

            {btsCabinetTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={btsCabinetWidthArr[cellIndex - 1]} data={cellIndex === 5 ? element(cellData, index, "EditBtscabinet") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "Antennas" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={antennasTableHead} widthArr={antennasWidthArr} style={styles.header} textStyle={styles.text} />

            {antennasTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={antennasWidthArr[cellIndex]} data={cellIndex === 7 ? element(cellData, index, "EditAntennas") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "RRUs" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={rRUsTableHead} widthArr={rRUsWidthArr} style={styles.header} textStyle={styles.text} />

            {rRUsTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={rRUsWidthArr[cellIndex - 1]} data={cellIndex === 5 ? element(cellData, index, "EditRrus") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "IDU" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={iDUTableHead} widthArr={iDUWidthArr} style={styles.header} textStyle={styles.text} />

            {iDUTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={iDUWidthArr[cellIndex - 1]} data={cellIndex === 7 ? element(cellData, index, "EditIdu") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "ODU" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={oDUTableHead} widthArr={oDUWidthArr} style={styles.header} textStyle={styles.text} />

            {oDUTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={oDUWidthArr[cellIndex - 1]} data={cellIndex === 8 ? element(cellData, index, "EditOdu") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "BtsCabinetBoardCards" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={btsCabinetBoardCardsTableHead} widthArr={btsCabinetBoardCardsWidthArr} style={styles.header} textStyle={styles.text} />

            {btsCabinetBoardCardsTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={btsCabinetBoardCardsWidthArr[cellIndex - 1]} data={cellIndex === 5 ? element(cellData, index, "EditBtscabinetboard") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "BtsCabinetBoardVSWRs" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={btsCabinetBoardVSWRsTableHead} widthArr={btsCabinetBoardVSWRsWidthArr} style={styles.header} textStyle={styles.text} />

            {btsCabinetBoardVSWRsTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={btsCabinetBoardVSWRsWidthArr[cellIndex - 1]} data={cellIndex === 4 ? element(cellData, index, "BtsCabinetVswrs") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      {screen == "IDUMMUCards" && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>

        <View>
          <Table borderStyle={{ borderWidth: 0.5, borderColor: constants.blackText }}>
            <Row data={iDUMMUCardsTableHead} widthArr={iDUMMUCardsWidthArr} style={styles.header} textStyle={styles.text} />

            {iDUMMUCardsTableData.map((rowData, index) => (
              <TableWrapper key={index} style={styles.row}>
                {
                  rowData.map((cellData, cellIndex) => (
                    <Cell key={cellIndex} width={iDUMMUCardsWidthArr[cellIndex - 1]} data={cellIndex === 6 ? element(cellData, index, "IduMmuCards") : cellData} textStyle={{ ...styles.text, textAlignVertical: "center", height: 40 }} />
                  ))
                }
              </TableWrapper>
            ))}

          </Table>
        </View>
      </ScrollView>}

      <Modal
        isVisible={isModalVisible}
        swipeDirection='down'
        style={{ margin: 0 }}>

        <SafeAreaView style={styles.main}>
          <ScrollView>

            <View style={{ marginBottom: 10, alignItems: "flex-end" }}>
              <TouchableOpacity style={styles.closeButtonStyle} onPress={() => setModalVisible(false)}>
                <Text style={{ fontWeight: "700", color: constants.colorWhite }}>X</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.filterViewContainer}>
              <View style={{ width: "80%" }}>
                <DropDownPicker
                  open={openDepartment}
                  value={departmentValue}
                  items={departmentItems}
                  setOpen={setOpenDepartment}
                  setValue={setDepartmentValue}
                  setItems={setDepartmentItems}
                  placeholder="Select Department"
                  style={styles.DropDownPicker}
                  onChangeValue={(item) => {
                    if (item) {
                      setDepartmentValue(item)
                    }
                  }}
                  searchable
                  listMode="MODAL"
                />
              </View>
              <TouchableOpacity onPress={() => setDepartmentValue(null)} style={styles.iconContainer}>
                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
              </TouchableOpacity>

            </View>

            <View style={styles.filterViewContainer}>
              <View style={{ width: "80%" }}>
                <DropDownPicker
                  open={openRegion}
                  value={regionValue}
                  items={regionItems}
                  setOpen={setOpenRegion}
                  setValue={setRegionValue}
                  setItems={setRegionItems}
                  placeholder="Select Region"
                  style={styles.DropDownPicker}
                  onChangeValue={(item) => {
                    if (item) {
                      setRegionValue(item)
                    }
                  }}
                  searchable
                  listMode="MODAL"
                />
              </View>
              <TouchableOpacity onPress={() => setRegionValue(null)} style={styles.iconContainer}>
                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterViewContainer}>
              <View style={{ width: "80%" }}>
                <DropDownPicker
                  open={openSubRegion}
                  value={subRegionValue}
                  items={subRegionItems}
                  setOpen={setOpenSubRegion}
                  setValue={setSubRegionValue}
                  setItems={setSubRegionItems}
                  placeholder="Select Sub Region"
                  style={styles.DropDownPicker}
                  onChangeValue={(item) => {
                    if (item) {
                      setSubRegionValue(item)
                    }
                  }}
                  searchable
                  listMode="MODAL"
                />
              </View>
              <TouchableOpacity onPress={() => setSubRegionValue(null)} style={styles.iconContainer}>
                <MaterialIcons name="refresh" size={25} color={constants.blackText} />
              </TouchableOpacity>
            </View>

            <View style={styles.filterViewContainer}>
              <View style={{ width: "80%" }}>
                <DropDownPicker
                  open={openMBUName}
                  value={mBUNameValue}
                  items={mBUNameItems}
                  setOpen={setOpenMBUName}
                  setValue={setMBUNameValue}
                  setItems={setMBUNameItems}
                  placeholder="Select MBU Name"
                  style={styles.DropDownPicker}
                  onChangeValue={(item) => {
                    if (item) {
                      setMBUNameValue(item)
                    }
                  }}
                  searchable
                  listMode="MODAL"
                />
              </View>
              <TouchableOpacity onPress={() => setMBUNameValue(null)} style={styles.iconContainer}>
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

export default Filter;

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
    padding: 20
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
  closeButtonStyle: { backgroundColor: constants.colorPrimary, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 100 },
  row: { flexDirection: 'row', backgroundColor: constants.lightGrayColor, },
  header: { height: 40, backgroundColor: "#C0C0C0" },
  text: { fontSize: 14, textAlign: 'center', color: constants.blackText, },
  btn: { width: 58, backgroundColor: '#78B7BB', borderRadius: 2, alignSelf: "center" },
  btnText: { textAlign: 'center', color: '#fff' },
  loadingContainer: { flex: 1, position: 'absolute', top: '40%', right: 0, left: 0, zIndex: 1 },
  filterViewContainer: { width: "100%", padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", },
  iconContainer: { width: "15%", backgroundColor: constants.lightGrayColor, padding: 5, alignItems: "center", borderRadius: 8 },
});
