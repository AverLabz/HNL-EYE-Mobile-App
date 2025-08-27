
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import JsonServer from '../../Api/api/JsonServer';
import DropdownAlert from 'react-native-dropdownalert';

const EditIdu = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAllFacultySlots();
            getAllChassisType();
        }
    }))

    useEffect(() => {
        setLoading(true)
        getAllFacultySlots();
        getAllChassisType();
    }, [])
    const { getAPICall, putRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);

    //States For TextInputs
    const [serial, setSerial] = useState("")
    const [count, setCount] = useState("")
    const [idu, setIdu] = useState("");
    const [siteId, setSiteId] = useState("")
    const [rowId, setrowId] = useState("")

    //States For Dropdowns
    const [openSitecode, setOpenSitecode] = useState(false);
    const [sitecodeValue, setSitecodeValue] = useState(null);
    const [sitecodeItems, setSitecodeItems] = useState([]);


    const [openFaculty, setOpenFaculty] = useState(false);
    const [facultyValue, setFacultyValue] = useState(null);
    const [facultyItems, setFacultyItems] = useState([]);

    const [openChassis, setopenChassis] = useState(false);
    const [chassisValue, setChassisValue] = useState(null);
    const [chassisItems, setChassisItems] = useState([]);

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




    const getAllFacultySlots = () => {
        var url = JsonServer.baseURL + "services/app/FacultySlots/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let facultySlotsTempArr = [];
                    result.items.forEach((itemsElement) => {
                        facultySlotsTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setFacultyItems(facultySlotsTempArr);
                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }
    const getAllChassisType = () => {
        var url = JsonServer.baseURL + "services/app/ChassisType/GetAll"
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result) {
                    let chassisTypeTempArr = [];
                    result.items.forEach((itemsElement) => {
                        chassisTypeTempArr.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setChassisItems(chassisTypeTempArr);
                    if (props.siteIdToSend != null)
                        getAllIDUDetails(props.siteIdToSend);

                }
            } else {
                setLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        })
    }

    const getAllIDUDetails = (id) => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/GetAll_IDUs?SiteId=" + id
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    setCount(result.items[0].count + "");
                    setIdu(result.items[0].iduType);
                    setFacultyValue(result.items[0].facultySlotId);
                    setChassisValue(result.items[0].chassisTypeId);
                    setSerial(result.items[0].serialNumber);
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

    const handleUpdateData = () => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/Update";
        let dataToInsert = {
            dto: {
                idu: {
                    site_Id: siteId,
                    isActive: activeValue,
                    id: rowId,
                    iduType: idu,
                    count: count,
                    facultySlot_Id: facultyValue,
                    chassisType_Id: chassisValue,
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
                            <TouchableOpacity style={styles.btnContainer} onPress={() => props.onIduPress("idu", setSerialImagePairs, props.siteIdToSend)}>
                                <Text style={{ color: "white" }}>Serial Number</Text>
                            </TouchableOpacity>
                        </View>}

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>IDU Type :</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setIdu(text)}
                                value={idu}
                                placeholder=" Add IDU Type:"
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
                            <Text style={styles.textstyle}> Faculty Slots :</Text>
                            <DropDownPicker
                                open={openFaculty}
                                value={facultyValue}
                                items={facultyItems}
                                setOpen={setOpenFaculty}
                                setValue={setFacultyValue}
                                setItems={setFacultyItems}
                                placeholder="Select Faculty Slots"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> Chassis Type :</Text>
                            <DropDownPicker
                                open={openChassis}
                                value={chassisValue}
                                items={chassisItems}
                                setOpen={setopenChassis}
                                setValue={setChassisValue}
                                setItems={setChassisItems}
                                placeholder="Select Chassis Type"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>
                        {/* <View style={styles.viewstyle}>
                        <Text style={styles.textstyle}>Serial Number Type :</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setSerial(text)}
                            value={serial}
                            placeholder="Add Serial Number"
                            keyboardType="default" />
                    </View> */}

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

            </ScrollView >
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

export default EditIdu
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