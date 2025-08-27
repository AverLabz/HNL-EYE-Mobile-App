import React, { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../Api/api/JsonServer';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import FocusAwareStatusBar from '../../Components/statusBar/FocusAwareStatusBar';

const ScanInventoryTabs = ({ navigation }) => {

    const { postRequest } = useContext(DataContext);
    let dropDownAlertRef = useRef(null);
    const [allQuestionnaireTabs, setAllQuestionnaireTabs] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [response, setResponse] = useState(null)

    useEffect(() => {
        getAllTemplates()
    }, [])

    const getAllTemplates = () => {

        var url = JsonServer.baseURL + 'services/app/SiteAssets_Template/FetchTemplate?TemplateId=16'
        postRequest('', url, (success, result, error) => {

            if (success) {
                setAllQuestionnaireTabs(result.headers)
                setResponse(result)
                setIsLoading(false)
            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }


    const handleSelectedTabNavigation = (item) => {
        navigation.navigate("ScanInventory", { item: item, response: response })
    }

    const renderItemCategoriesFlatList = ({ item }) => {
        return (
            <TouchableOpacity
                onPress={() => { handleSelectedTabNavigation(item) }}
                style={{
                    flex: 1,
                    margin: 5,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 20,
                    backgroundColor: "#404040"
                }}>
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text
                        style={{
                            fontSize: 14,
                            color: 'white',
                            fontFamily: constants.fontMedium,
                            textTransform: 'capitalize'
                        }}>
                        {item?.name}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.viewHeading}>
            <FocusAwareStatusBar />
            <View style={{}}>
                <FlatList
                    data={allQuestionnaireTabs}
                    renderItem={renderItemCategoriesFlatList}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ flexGrow: 1, margin: 5 }}
                    numColumns={2}
                    maxToRenderPerBatch={1}
                />
            </View>

            {isLoading && <View style={{ flex: 1, position: 'absolute', top: "40%", right: 0, left: 0, zIndex: 100, }}>
                <ActivityIndicator size="large" animating={isLoading} color={constants.colorPrimary} style={{ flex: 1, justifyContent: 'center', alignItems: "center", zIndex: 100, right: 0, left: 0, bottom: 0, top: 0, }} />
            </View>}

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
}

export default ScanInventoryTabs

const styles = StyleSheet.create({
    viewHeading: {
        flex: 1,
        flexDirection: 'column',
        // paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 20,
        // justifyContent: "space-around"
    },
    tabStyle: {
        marginRight: 10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 8
    },
    textStyle: { fontSize: 16, fontWeight: "bold", color: constants.colorWhite },
    filterButtonContainer: {
        flex: 1,
        position: 'absolute',
        alignItems: "center",
        bottom: 35,
        zIndex: 1,
        alignSelf: "flex-end",
        right: 15,
        justifyContent: 'center',
    },
    touchableButtonStyle: { alignItems: "center", padding: 10, backgroundColor: constants.colorPrimary, justifyContent: 'center', borderRadius: 50 },
    modelContainer: { alignSelf: "center", padding: 20, backgroundColor: constants.colorWhite, borderRadius: 6, width: "85%" },
    modelSubContainer: { flexDirection: "row", alignItems: "center", justifyContent: 'space-between', marginTop: 20 },
    btnContainer: { padding: 10, width: 100, alignItems: "center", justifyContent: 'center', backgroundColor: constants.colorPrimary, borderRadius: 4 },
    decText: { fontSize: 16, fontWeight: "700", color: constants.blackText, marginBottom: 10 },
    inputStyle: { borderWidth: 1, borderRadius: 6, paddingLeft: 10 },
    modelTextStyle: { fontSize: 14, fontWeight: "700", color: constants.colorWhite },
    renderTemplateStyle: { flexDirection: "row", backgroundColor: constants.lightGrayColor, borderWidth: 0.5, borderColor: constants.colorPrimary, borderRadius: 6, padding: 15, marginTop: 10, alignItems: "center", justifyContent: "space-between" },
    renderTextStyle: { fontSize: 16, fontWeight: "bold", color: constants.blackText },
})