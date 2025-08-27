import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import JsonServer from '../../Api/api/JsonServer';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';

const BtsCabinetVswrs = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            getAll_CellName()
        }
    }))

    const { getAPICall, putRequest } = useContext(DataContext)
    let dropDownAlertRef = useRef(null);
    //States For TextInputs
    const [board, setBoard] = useState("")
    const [value, setValue] = useState("")
    const [siteId, setSiteId] = useState('')
    const [rowId, setRowId] = useState('')
    //    state for dropdown
    const [openCellname, setOpenCellname] = useState(false);
    const [CellnameValue, setCellnameValue] = useState(null);
    const [CellnameItems, setCellnameItems] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getAll_CellName()
    }, [])

    const getAll_CellName = () => {

        var url = JsonServer.baseURL + "services/app/CellName/GetAll";
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result.totalCount > 0) {

                    let celName = [];
                    result.items.forEach((itemsElement) => {
                        celName.push({
                            label: itemsElement.name,
                            value: itemsElement.id,
                        });
                    });
                    setCellnameItems(celName);
                    if (props.siteIdToSend != null)
                        GetAll_BTScabinetVSWR(props.siteIdToSend);
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        })
    }
    const GetAll_BTScabinetVSWR = (id) => {
        setLoading(true)
        var url = JsonServer.baseURL + "services/app/AMS/GetAll_BtsCabinetVSWRs?SiteId=" + id
        getAPICall(url, (success, result, error) => {
            if (success) {

                if (result.items.length > 0) {
                    setBoard(result.items[0].cellId.toString())
                    setCellnameValue(result.items[0].cellName_Id)
                    setValue(result.items[0].vswrValue)
                    setSiteId(result.items[0].siteId);
                    setRowId(result.items[0].id);
                    setLoading(false);
                } else {
                    setLoading(false);
                }
            } else if (error) {
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
                btsCabinetVSWR: {
                    site_Id: siteId,
                    cellId: board,
                    cellName_Id: CellnameValue,
                    vswrValue: value,
                    id: rowId
                },
            }
        }
        putRequest(dataToInsert, url, (success, result, error) => {
            if (success) {
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
                            <Text style={styles.textstyle}> Cell-ID</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setBoard(text)}
                                value={board}
                                placeholder=" Add Cell ID"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Cell Name:</Text>
                            <DropDownPicker
                                open={openCellname}
                                value={CellnameValue}
                                items={CellnameItems}
                                setOpen={setOpenCellname}
                                setValue={setCellnameValue}
                                setItems={setCellnameItems}
                                placeholder="Select Cell Name"
                                style={styles.DropDownPicker}
                                searchable
                                listMode="MODAL"
                                placeholderStyle={{
                                    color: "grey",
                                }} />
                        </View>

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>VSWR Value:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={text => setValue(text)}
                                value={value}
                                placeholder="Add VSWR Value"
                                keyboardType="default" />
                        </View>
                        <View style={styles.panel}>
                            <TouchableOpacity onPress={() => { handleUpdateData() }} style={styles.panelButton}>
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

export default BtsCabinetVswrs
const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: Platform.OS == "ios" ? 15 : 10,
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