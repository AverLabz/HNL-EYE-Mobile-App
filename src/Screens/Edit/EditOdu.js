import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import JsonServer from '../../Api/api/JsonServer';
import DropdownAlert from 'react-native-dropdownalert';

const EditOdu = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAllCableGrounding();
        }
    }))

    useEffect(() => {
        setLoading(true)
        getAllCableGrounding();
    }, [])

    const { getAPICall, putRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);
    //States For TextInputs
    const [serial, setSerial] = useState("")
    const [height, setHeight] = useState("")
    const [cable, setCable] = useState("")
    const [rsl, setRsl] = useState("")
    const [oduType, setOduType] = useState("")
    const [siteId, setSiteId] = useState("")
    const [rowId, setrowId] = useState("")

    //States For Dropdowns
    const [openSitecode, setOpenSitecode] = useState(false);
    const [sitecodeValue, setSitecodeValue] = useState(null);
    const [sitecodeItems, setSitecodeItems] = useState([]);




    const [openCable, setopenCable] = useState(false);
    const [cableValue, setCableValue] = useState(null);
    const [cableItems, setCableItems] = useState([]);

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
    const [serialImagePairs, setSerialImagePairs] = useState([])



    const getAllODUDetails = (id) => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/GetAll_ODUs?SiteId=" + id
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result.items.length > 0) {
                    setOduType(result.items[0].oduType);
                    setCable(result.items[0].noOfIFCable + "");
                    setHeight(result.items[0].installationHeight + "");
                    setRsl(result.items[0].rsl);
                    setSerial(result.items[0].serialNumber);
                    setCableValue(result.items[0].cableGroundingId);
                    setSiteId(result.items[0].siteId);
                    setActiveValue(result.items[0].isActive);
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
    const getAllCableGrounding = () => {
        var url = JsonServer.baseURL + "services/app/CableGrounding/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let cableGroundingTempArr = [];
                    result.items.forEach((itemsElement) => {
                        cableGroundingTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setCableItems(cableGroundingTempArr);
                    if (props.siteIdToSend != null)
                        getAllODUDetails(props.siteIdToSend);

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
                odu: {
                    oduType: oduType,
                    noOfIFCable: cable,
                    cableGrounding_Id: cableValue,
                    installationHeight: height,
                    rsl: rsl,
                    site_Id: siteId,
                    isActive: activeValue,
                    id: rowId,
                    serialNumber: serial,
                    serialImagePairs: serialImagePairs,
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

                        {props.siteIdToSend && <View style={styles.viewContainer}>
                            <TouchableOpacity style={styles.btnContainer} onPress={() => props.onOduPress("odu", setSerialImagePairs, props.siteIdToSend)}>
                                <Text style={{ color: "white" }}>Serial Number</Text>
                            </TouchableOpacity>
                        </View>}
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>ODU Type :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setOduType(text)}
                                value={oduType}
                                placeholder="ODU Type"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>No of IF -Cables :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setCable(text)}
                                value={cable}
                                placeholder="No Of IF Cables"
                                keyboardType="default" />
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
                            <Text style={styles.textstyle}>RSL :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setRsl(text)}
                                value={rsl}
                                placeholder="RSL"
                                keyboardType="default" />
                        </View>
                        {/* <View style={styles.viewstyle}>
                        <Text style={styles.textstyle}>Serial Number  :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setSerial(text)}
                            value={serial}
                            placeholder="Add Serial No"
                            keyboardType="default" />
                    </View> */}

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> Cable Grounding :</Text>
                            <DropDownPicker
                                open={openCable}
                                value={cableValue}
                                items={cableItems}
                                setOpen={setopenCable}
                                setValue={setCableValue}
                                setItems={setCableItems}
                                placeholder="Select Grounding"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
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

export default EditOdu
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
    viewContainer: { alignItems: "flex-end", justifyContent: "flex-end", marginRight: 20 },
    btnContainer: { backgroundColor: constants.colorPrimary, padding: 10 }
});