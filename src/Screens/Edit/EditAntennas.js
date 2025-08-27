
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';

const EditAntennas = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAllAntennas();
            getAllAntennaBrand();
            getAllAntennaPort();
        }
    }))
    const { getAPICall, putRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);

    //States For TextInputs
    const [height, setHeight] = useState("")
    const [count, setCount] = useState("")
    const [azimuth, setazimuth] = useState("")
    const [siteId, setSiteId] = useState("")
    const [rowId, setrowId] = useState("")


    //States For Dropdowns
    const [openSitecode, setOpenSitecode] = useState(false);
    const [sitecodeValue, setSitecodeValue] = useState(null);
    const [sitecodeItems, setSitecodeItems] = useState([]);

    const [openAntenna, setOpenAntenna] = useState(false);
    const [antennaValue, setAntennaValue] = useState(null);
    const [antennaItems, setAntennaItems] = useState([]);

    const [openBrand, setOpenBrand] = useState(false);
    const [brandValue, setBrandValue] = useState(null);
    const [brandItems, setBrandItems] = useState([]);

    const [openPorts, setOpenPorts] = useState(false);
    const [portsValue, setPortsValue] = useState(null);
    const [portsItems, setPortsItems] = useState([]);

    const [openActive, setOpenActive] = useState(false);
    const [activeValue, setActiveValue] = useState(null);
    const [activeItems, setActiveItems] = useState([{
        label: "True",
        value: true,
    }, {
        label: "False",
        value: false,
    }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getAllAntennas();
        getAllAntennaBrand();
        getAllAntennaPort();
    }, [])

    const handleUpdateData = () => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/Update";
        let dataToInsert = {
            dto: {
                antenna: {
                    site_Id: siteId,
                    antennaType_Id: antennaValue,
                    antennaBrand_Id: brandValue,
                    antennaPort_Id: portsValue,
                    installationHeight: height,
                    count: count,
                    azimuth: azimuth,
                    isActive: activeValue,
                    id: rowId
                }
            }
        }
        putRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
                dropDownAlertRef.alertWithType('success', 'Alert', "Data has been updated")
                setLoading(false)
            } else if (error) {
                setLoading(false)
            }
        })
    }
    const getAllAntennas = () => {
        var url = JsonServer.baseURL + "services/app/AntennaType/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let antennaTypeTempArr = [];
                    result.items.forEach((itemsElement) => {
                        antennaTypeTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setAntennaItems(antennaTypeTempArr);
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllAntennaBrand = () => {
        var url = JsonServer.baseURL + "services/app/AntennaBrand/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let antennaBrandTempArr = [];
                    result.items.forEach((itemsElement) => {
                        antennaBrandTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setBrandItems(antennaBrandTempArr);
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllAntennaPort = () => {
        var url = JsonServer.baseURL + "services/app/AntennaPort/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let antennaPortTempArr = [];
                    result.items.forEach((itemsElement) => {
                        antennaPortTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setPortsItems(antennaPortTempArr);
                    if (props.siteIdToSend != null)
                        getAllAntennaDetails(props.siteIdToSend);
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllAntennaDetails = (id) => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/GetAll_Antennas?SiteId=" + id
        getAPICall(url, (success, result, error) => {

            if (success) {
                if (result.items.length > 0) {
                    setAntennaValue(result.items[0].antennaTypeId);
                    setBrandValue(result.items[0].antennaBrandId);
                    setPortsValue(result.items[0].antennaPortId);
                    setHeight(result.items[0].installationHeight.toString());
                    setCount(result.items[0].count.toString());
                    setazimuth(result.items[0].azimuth.toString());
                    setActiveValue(result.items[0].isActive);
                    setSiteId(result.items[0].siteId);
                    setrowId(result.items[0].id);
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
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={{ backgroundColor: constants.lightGrayColor }}>
                {loading ?
                    <View style={{ flex: 1, marginTop: "55%" }}>
                        <ActivityIndicator
                            size="large"
                            animating={loading}
                            color={constants.colorPrimary}
                            style={{}}
                        />
                    </View> :
                    <View style={{ marginTop: 10 }}>

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Antennas Type:</Text>
                            <DropDownPicker
                                open={openAntenna}
                                value={antennaValue}
                                items={antennaItems}
                                setOpen={setOpenAntenna}
                                setValue={setAntennaValue}
                                setItems={setAntennaItems}
                                placeholder="Select Antennas Type"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Antennas Brand:</Text>
                            <DropDownPicker
                                open={openBrand}
                                value={brandValue}
                                items={brandItems}
                                setOpen={setOpenBrand}
                                setValue={setBrandValue}
                                setItems={setBrandItems}
                                placeholder="Select Antennas Brand"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Antennas Ports:</Text>
                            <DropDownPicker
                                open={openPorts}
                                value={portsValue}
                                items={portsItems}
                                setOpen={setOpenPorts}
                                setValue={setPortsValue}
                                setItems={setPortsItems}
                                placeholder="Select Antennas Ports"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Installation Height :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setHeight(text)}
                                value={height}
                                placeholder="Add Installation Height"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Count :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setCount(text)}
                                value={count}
                                placeholder=" Add Count"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Azimuth :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setazimuth(text)}
                                value={azimuth}
                                placeholder=" Add Azimuth"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> IsActive :</Text>
                            <DropDownPicker
                                open={openActive}
                                value={activeValue}
                                items={activeItems}
                                setOpen={setOpenActive}
                                setValue={setActiveValue}
                                setItems={setActiveItems}
                                placeholder="False"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
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
            />
        </SafeAreaView>
    )
})

export default EditAntennas
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
});