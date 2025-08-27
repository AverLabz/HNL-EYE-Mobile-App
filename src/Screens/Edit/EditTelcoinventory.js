import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';

const Edittelcoinventory = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            InventoryListIDU()
            InventoryListODU()
            InventoryListAntennas()
            InventoryListRetInstalled()
            InventoryListSiteAssetsType()
            InventoryListSitePPTypeId()
            InventoryListRRUs()
            InventoryListBtsCabinet()
            InventoryListMechanicalAssembly()
            if (props.siteIdToSend !== null)
                getAllTelcoInventoryMain(props.siteIdToSend)
        }
    }))


    const { getAPICall, putRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);

    //States For TextInputs
    const [siteName, setSiteName] = useState("");
    const [siteregionName, setSiteregionName] = useState("");
    const [latitude, setLatitude] = useState("")
    const [longitude, setLongitude] = useState("")
    const [mBUNO, setMBUnO] = useState("")
    const [mBUName, setMBUname] = useState("")
    const [mBULead, setMBUlead] = useState("")
    const [siteId, setSiteId] = useState("")
    const [siteCategory, setSitecategory] = useState("")
    const [sitePriority, setSitepriority] = useState("")
    const [siteStatus, setSitestatus] = useState("")
    const [electricalTilt2g, setElectricaltilt2g] = useState("")
    const [electricalTilt3g, setElectricaltilt3g] = useState("")
    const [electricalTilt4g, setElectricaltilt4g] = useState("")
    const [mechanicalTilt, setMechanicaltilt] = useState("")
    const [zonalmanager, setZonalmanager] = useState("")
    const [rowId, setrowId] = useState("")
    const [loading, setLoading] = useState(false);

    //States For Dropdowns
    const [openDepartment, setOpenDepartment] = useState(false);
    const [departmentValue, setDepartmentValue] = useState(null);
    const [departmentItems, setDepartmentItems] = useState([]);

    const [openInventorylistiDU, setopenInventorylistiDU] = useState(false);
    const [inventoryListiDUtValue, setInventorylistiDUvalue] = useState(null);
    const [inventoryListiDUItems, setInventoryListiDUItems] = useState([]);

    const [openInventorylistodu, setopenInventorylistoDU] = useState(false);
    const [inventoryListoDUtValue, setInventorylistoDUvalue] = useState(null);
    const [inventoryListoDUItems, setInventoryListoDUItems] = useState([]);

    const [openInventorylistAntennas, setopenInventorylistAntennas] = useState(false);
    const [inventoryListAntennastValue, setInventorylistAntennasvalue] = useState(null);
    const [inventoryListAntennasItems, setInventoryListAntennasItems] = useState([]);

    const [openInventorylistRetinstalled, setopenInventorylistRetinstalled] = useState(false);
    const [inventoryListRetinstalledtValue, setInventorylistRetinstalledvalue] = useState(null);
    const [inventoryListRetinstalledItems, setInventoryListRetinstalledItems] = useState([]);

    const [openInventorylistAssettype, setopenInventorylistAssettype] = useState(false);
    const [inventoryListAssettypetValue, setInventorylistAssettypevalue] = useState(null);
    const [inventoryListAssettypeItems, setInventoryListAssettypeItems] = useState([]);


    const [openInventorylistPptype, setopenInventorylistPptype] = useState(false);
    const [inventoryListPptypetValue, setInventorylistPptypevalue] = useState(null);
    const [inventoryListPptypeItems, setInventoryListPptypeItems] = useState([]);

    const [openInventorylistRrus, setopenInventorylistRrus] = useState(false);
    const [inventoryListRrustValue, setInventorylistRrusvalue] = useState(null);
    const [inventoryListRrusItems, setInventoryListRrusItems] = useState([]);

    const [openInventoryBtscabinet, setopenInventoryBtscabinet] = useState(false);
    const [inventoryBtscabinetValue, setInventoryBtscabinetvalue] = useState(null);
    const [inventoryBtscabinetItems, setInventoryBtscabinetItems] = useState([]);

    const [openInventoryMechanicalassembly, setopenInventoryMechanicalassembly] = useState(false);
    const [inventoryMechanicalassemblytValue, setInventoryMechanicalassemblyvalue] = useState(null);
    const [inventoryMechanicalassemblyItems, setInventoryMechanicalassemblyItems] = useState([]);

    useEffect(() => {
        InventoryListIDU()
        InventoryListODU()
        InventoryListAntennas()
        InventoryListRetInstalled()
        InventoryListSiteAssetsType()
        InventoryListSitePPTypeId()
        InventoryListRRUs()
        InventoryListBtsCabinet()
        InventoryListMechanicalAssembly()
        if (props.siteIdToSend !== null)
            getAllTelcoInventoryMain(props.siteIdToSend)
    }, [])

    const getAllTelcoInventoryMain = (id) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_TelcoInventoryMain?SiteId=" + id
        getAPICall(url, (success, result, error) => {

            if (success) {
                if (result.items.length > 0) {
                    setElectricaltilt2g(result.items[0].electricalTilt2G)
                    setElectricaltilt3g(result.items[0].electricalTilt3G)
                    setElectricaltilt4g(result.items[0].electricalTilt4G)
                    setMechanicaltilt(result.items[0].mechanicalTilt)
                    setZonalmanager(result.items[0].zonalManager)
                    setInventorylistiDUvalue(result.items[0].inventoryListIDUId)
                    setInventorylistoDUvalue(result.items[0].inventoryListODUId)
                    setInventorylistAntennasvalue(result.items[0].inventoryListAntennaId)
                    setInventorylistRetinstalledvalue(result.items[0].retInstalledId)
                    setInventorylistAssettypevalue(result.items[0].siteAssetTypeId)
                    setInventorylistPptypevalue(result.items[0].sitePowerProfileTypeId)
                    setInventorylistRrusvalue(result.items[0].inventoryListRRUId)
                    setInventoryBtscabinetvalue(result.items[0].btsCabinetId)
                    setInventoryMechanicalassemblyvalue(result.items[0].mechanicalAssemblyId)
                    setSiteId(result.items[0].siteId)
                    setrowId(result.items[0].id)

                    setLoading(false)
                } else {
                    setLoading(false);
                }
            }
            else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListIDU = () => {
        var url = JsonServer.baseURL + "services/app/InventoryListIDU/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListIDUTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListIDUTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListiDUItems(inventoryListIDUTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListODU = () => {
        var url = JsonServer.baseURL + "services/app/InventoryListODU/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListODUTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListODUTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListoDUItems(inventoryListODUTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListAntennas = () => {
        var url = JsonServer.baseURL + "services/app/InventoryListAntenna/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListAntennasTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListAntennasTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListAntennasItems(inventoryListAntennasTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListRetInstalled = () => {
        var url = JsonServer.baseURL + "services/app/RetInstalled/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListRetInstalledTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListRetInstalledTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListRetinstalledItems(inventoryListRetInstalledTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListSiteAssetsType = () => {
        var url = JsonServer.baseURL + "services/app/SiteAssetType/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListSiteAssetsTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListSiteAssetsTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListAssettypeItems(inventoryListSiteAssetsTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListSitePPTypeId = () => {
        var url = JsonServer.baseURL + "services/app/SitePowerProfileType/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListSitePPTypeTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListSitePPTypeTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListPptypeItems(inventoryListSitePPTypeTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListRRUs = () => {
        var url = JsonServer.baseURL + "services/app/InventoryListRRU/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListRRusTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListRRusTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryListRrusItems(inventoryListRRusTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListBtsCabinet = () => {
        var url = JsonServer.baseURL + "services/app/BtsCabinet/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListBtsCabinetTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListBtsCabinetTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryBtscabinetItems(inventoryListBtsCabinetTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const InventoryListMechanicalAssembly = () => {
        var url = JsonServer.baseURL + "services/app/MechanicalAssembly/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {

                    let inventoryListMechanicalAssemblyTempArr = [];
                    result.items.forEach((itemsElement) => {
                        inventoryListMechanicalAssemblyTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setInventoryMechanicalassemblyItems(inventoryListMechanicalAssemblyTempArr)
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const handleUpdateData = () => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/Update";
        let dataToInsert = {
            dto: {
                telcoInventoryMain: {
                    site_Id: siteId,
                    electricalTilt2G: electricalTilt2g,
                    electricalTilt3G: electricalTilt3g,
                    electricalTilt4G: electricalTilt4g,
                    mechanicalTilt: mechanicalTilt,
                    zonalManager: zonalmanager,
                    mechanicalAssembly_Id: inventoryMechanicalassemblytValue,
                    retInstalled_Id: inventoryListRetinstalledtValue,
                    btsCabinet_Id: inventoryBtscabinetValue,
                    inventoryListRRU_Id: inventoryListRrustValue,
                    inventoryListAntenna_Id: inventoryListAntennastValue,
                    inventoryListIDU_Id: inventoryListiDUtValue,
                    inventoryListODU_Id: inventoryListoDUtValue,
                    siteAssetType_Id: inventoryListAssettypetValue,
                    sitePowerProfileType_Id: inventoryListPptypetValue,
                    id: rowId
                },
            }
        }
        putRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                // route.params.GetAll_BtsCabinetBoardCards();
                setLoading(false)
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
            } else if (error) {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ flexGrow: 1, flexDirection: "column", backgroundColor: constants.lightGrayColor }}>
                {loading ?
                    <View style={{ flex: 1, marginTop: "55%" }}>
                        <ActivityIndicator
                            size="large"
                            animating={loading}
                            color={constants.colorPrimary}
                            style={{}}
                        />
                    </View>
                    :
                    <View style={{ marginTop: 10 }}>

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Inventory-List(Qty)IDU :</Text>
                            <DropDownPicker
                                open={openInventorylistiDU}
                                value={inventoryListiDUtValue}
                                items={inventoryListiDUItems}
                                setOpen={setopenInventorylistiDU}
                                setValue={setInventorylistiDUvalue}
                                setItems={setInventoryListiDUItems}
                                placeholder="Select IDU"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Inventory-List(Qty)ODU :</Text>
                            <DropDownPicker
                                open={openInventorylistodu}
                                value={inventoryListoDUtValue}
                                items={inventoryListoDUItems}
                                setOpen={setopenInventorylistoDU}
                                setValue={setInventorylistoDUvalue}
                                setItems={setInventoryListoDUItems}
                                placeholder="Select ODU"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Inventory-List(Qty)Antennas :</Text>
                            <DropDownPicker
                                open={openInventorylistAntennas}
                                value={inventoryListAntennastValue}
                                items={inventoryListAntennasItems}
                                setOpen={setopenInventorylistAntennas}
                                setValue={setInventorylistAntennasvalue}
                                setItems={setInventoryListAntennasItems}
                                placeholder="Select Antennas"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Ret-Installed :</Text>
                            <DropDownPicker
                                open={openInventorylistRetinstalled}
                                value={inventoryListRetinstalledtValue}
                                items={inventoryListRetinstalledItems}
                                setOpen={setopenInventorylistRetinstalled}
                                setValue={setInventorylistRetinstalledvalue}
                                setItems={setInventoryListRetinstalledItems}
                                placeholder="Select Ret-Installed"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey" }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Site Asset Type:</Text>
                            <DropDownPicker
                                open={openInventorylistAssettype}
                                value={inventoryListAssettypetValue}
                                items={inventoryListAssettypeItems}
                                setOpen={setopenInventorylistAssettype}
                                setValue={setInventorylistAssettypevalue}
                                setItems={setInventoryListAssettypeItems}
                                placeholder="Select Site Asset Type"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Site_PP_Type_Id :</Text>
                            <DropDownPicker
                                open={openInventorylistPptype}
                                value={inventoryListPptypetValue}
                                items={inventoryListPptypeItems}
                                setOpen={setopenInventorylistPptype}
                                setValue={setInventorylistPptypevalue}
                                setItems={setInventoryListPptypeItems}
                                placeholder="Select Power Profile Type"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Inventory-List RRUs :</Text>
                            <DropDownPicker
                                open={openInventorylistRrus}
                                value={inventoryListRrustValue}
                                items={inventoryListRrusItems}
                                setOpen={setopenInventorylistRrus}
                                setValue={setInventorylistRrusvalue}
                                setItems={setInventoryListRrusItems}
                                placeholder="Select RRUs"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>BTS Cabinet :</Text>
                            <DropDownPicker
                                open={openInventoryBtscabinet}
                                value={inventoryBtscabinetValue}
                                items={inventoryBtscabinetItems}
                                setOpen={setopenInventoryBtscabinet}
                                setValue={setInventoryBtscabinetvalue}
                                setItems={setInventoryBtscabinetItems}
                                placeholder="Select BTS Cabinet"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Mechanical - Assembly:</Text>
                            <DropDownPicker
                                open={openInventoryMechanicalassembly}
                                value={inventoryMechanicalassemblytValue}
                                items={inventoryMechanicalassemblyItems}
                                setOpen={setopenInventoryMechanicalassembly}
                                setValue={setInventoryMechanicalassemblyvalue}
                                setItems={setInventoryMechanicalassemblyItems}
                                placeholder="Select Assembly"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{ color: "grey", }}
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Electrical-Tilt-2G :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setElectricaltilt2g(text)}
                                value={electricalTilt2g}
                                placeholder=" Input Electrical-Tilt-2G  "
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Electrical-Tilt-3G :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setElectricaltilt3g(text)}
                                value={electricalTilt3g}
                                placeholder="Electrical-Tilt-3G "
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Electrical-Tilt-4G :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setElectricaltilt4g(text)}
                                value={electricalTilt4g}
                                placeholder="Electrical-Tilt-4G"
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Mechanical-Tilt:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setMechanicaltilt(text)}
                                value={mechanicalTilt}
                                placeholder="Input Mechanical-Tilt "
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Zonal Manager :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setZonalmanager(text)}
                                value={zonalmanager}
                                placeholder="Input Zonal Manager "
                                keyboardType="default"
                            />
                        </View>
                        <View style={styles.panel}>
                            <TouchableOpacity onPress={() => handleUpdateData()} style={styles.panelButton}>
                                <Text style={styles.panelButtonTitle}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}

            </ScrollView>
            <DropdownAlert
                ref={(ref) => {
                    if (ref) {
                        dropDownAlertRef = ref;
                    }
                }}
                showCancel={true}
                // zIndex={100}
                // wrapperStyle={{ position: 'absolute', zIndex: 200 }}
            />
        </SafeAreaView>
    )
})

export default Edittelcoinventory
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        backgroundColor: '#fff'
    },
    DropDownPicker: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: 'black',
    },
    viewstyle: {
        margin: 10,
        marginHorizontal: 20
    },
    textstyle: {
        paddingBottom: 10
    },
    panel: {
        margin: 10,
        marginHorizontal: 20
    },
    panelButton: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: constants.colorPrimary,
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    loadingContainer: { flex: 1, top: '20%', right: 0, left: 0, },
});