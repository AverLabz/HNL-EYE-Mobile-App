import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Platform } from 'react-native'
import React, { useContext, useEffect, forwardRef, useRef, useImperativeHandle, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';

const EditBtscabinetboard = React.forwardRef((props, ref) => {

    useImperativeHandle(ref, () => ({
        childMethod() {
            GetAll_BtsCabinetBoardCards(props.siteIdToSend)
        }
    }))

    const { getAPICall, putRequest } = useContext(DataContext)
    //States For TextInputs
    let dropDownAlertRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const [board, setBoard] = useState("")
    const [status, setStatus] = useState("")
    const [quantity, setQuantity] = useState("")
    const [serial, setSerial] = useState("")
    const [siteId, setSiteId] = useState("")
    const [rowId, setrowId] = useState("")
    const [serialImagePairs, setSerialImagePairs] = useState([])


    useEffect(() => {
        setLoading(true)
        if (props.siteIdToSend != null)
            GetAll_BtsCabinetBoardCards(props.siteIdToSend);
    }, [])



    const GetAll_BtsCabinetBoardCards = (id) => {
        setLoading(true)

        var url = JsonServer.baseURL + "services/app/AMS/GetAll_BtsCabinetBoardCards?SiteId=" + id;
        getAPICall(url, (success, result, error) => {
            if (success) {
                if (result.totalCount > 0) {

                    setBoard(result.items[0].boardName)
                    setStatus(result.items[0].boardStatus)
                    setQuantity(result.items[0].quantity.toString())
                    setSerial(result.items[0].serialNumber)
                    setSiteId(result.items[0].siteId)
                    setrowId(result.items[0].id)

                    setLoading(false)
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
                btsCabinetBoardCard: {
                    site_Id: siteId,
                    boardName: board,
                    boardStatus: status,
                    quantity: parseInt(quantity),
                    serialNumber: serial,
                    id: rowId,
                    serialImagePairs: serialImagePairs,
                }
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

                        {props.siteIdToSend && <View style={styles.viewContainer}>
                            <TouchableOpacity style={styles.btnContainer} onPress={() => props.onBtsCabinetBoardCardPress("btsCabinetBoardCard", setSerialImagePairs, props.siteIdToSend)}>
                                <Text style={{ color: "white" }}>Serial Number</Text>
                            </TouchableOpacity>
                        </View>}

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}> Board Name</Text>
                            <TextInput
                                style={styles.input}
                                value={board}
                                onChangeText={text => setBoard(text)}
                                placeholder=" Add Board Name"
                                keyboardType="default" />
                        </View>
                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Board Status :</Text>
                            <TextInput
                                style={styles.input}
                                value={status}
                                onChangeText={text => setStatus(text)}
                                placeholder="Add Board Status"
                                keyboardType="default" />
                        </View>

                        <View style={styles.viewstyle}>
                            <Text style={styles.textstyle}>Quantity  :</Text>
                            <TextInput
                                style={styles.input}
                                value={quantity}
                                onChangeText={text => setQuantity(text)}
                                placeholder="Add Quantity"
                                keyboardType="default" />
                        </View>
                        {/* <View style={styles.viewstyle}>
                        <Text style={styles.textstyle}>Serial Number  :</Text>
                        <TextInput
                            style={styles.input}
                            value={serial}
                            onChangeText={text => setSerial(text)}
                            placeholder="Add Serial Number"
                            keyboardType="default" />
                    </View> */}

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

export default EditBtscabinetboard
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
    loadingContainer: { flex: 1, position: 'absolute', top: '40%', right: 0, left: 0, zIndex: 1 },
    viewContainer: { alignItems: "flex-end", justifyContent: "flex-end", marginRight: 20 },
    btnContainer: { backgroundColor: constants.colorPrimary, padding: 10 }
});