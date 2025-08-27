import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import JsonServer from '../../../Api/api/JsonServer';
import constants from '../../../constants/constants';
import { DataContext } from '../../../Context/context-provider';

const WOQuestionnaireTabs = ({ navigation, route }) => {

    const { postRequest, saveToAsyncStorage } = useContext(DataContext);
    let dropDownAlertRef = useRef(null);
    const [allQuestionnaireTabs, setAllQuestionnaireTabs] = useState([])
    const [allQuestions, setAllQuestions] = useState([])
    const [selectedTab, setSelectedTab] = useState('')
    const [headerName, setheaderName] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [templateId, setTemplateId] = useState('')

    useEffect(() => {
        getAllTemplates(route.params.sourceFieldTypeId, route.params.workOrderTypeId, route.params.isVisitRequired)
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={{ fontSize: 16, fontWeight: "700", color: constants.colorWhite }}>{headerName}</Text>
            ),
            // headerRight: () => (
            //     <TouchableOpacity style={{ marginRight: 10, padding: 8 }} onPress={() => {
                    
            //         askPermission(route.params.workOrderId)
            //     }}>
            //         <Feather name="check-square" size={22} color={constants.colorWhite} />
            //     </TouchableOpacity>
            // ),
        })
    }, [headerName])

    const askPermission = (id)=> {
        Alert.alert('Attention', 'Are you sure to close this WorkOrder?', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'YES', onPress: () => {
                setIsLoading(true)
                handleCloseWorkOrder(id)}},
          ]);
    }

    const getAllTemplates = (sourceFieldTypeId, workOrderTypeId,visitRequired) => {

        var url = JsonServer.baseURL + 'services/app/Template/FetchTemplate?WorkOrderTypeId=' + workOrderTypeId + '&SourceFieldTypeId=' + sourceFieldTypeId + '&IsVisitRequired=' + visitRequired
        postRequest({}, url, (success, result, error) => {

            if (result) {
                let tabs = []
                result.headers.forEach((element, index) => {
                    tabs.push({
                        id: element.id,
                        tabName: element.name,
                        active: index == 0 ? true : false
                    })
                });
                setTemplateId(result.id)
                setheaderName(result.name)
                setSelectedTab(tabs ? tabs[0].tabName : '')
                setAllQuestionnaireTabs(tabs)
                setAllQuestions(result?.headers?.length > 0 ? result.headers : [])
                setIsLoading(false)

            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }

    const handleQuestionsNavigation = (dec, tab, tabId, tempId, answerData, groupId) => {
        var result = allQuestions.filter(obj => {
            return obj.name === tab
        })
        if (answerData !== undefined) {
            saveToAsyncStorage("AnswerFillingDataForUpdate", {
                GroupId: groupId,
                workOrderId: route.params.workOrderId,
                templateId: tempId,
                headerName: tab,
                remarks: dec,
                answers: answerData
            })
            navigation.navigate("WOQuestionnaireUpdateOptions", { selectedTab: selectedTab, templateQuestions: result, filledAnswers: answerData })

        }
        else {
            saveToAsyncStorage("AnswerFillingData", {
                GroupId: groupId,
                workOrderId: route.params.workOrderId,
                templateId: tempId,
                headerName: tab,
                remarks: dec,
                answers: []
            })
            navigation.navigate("WOQuestionnaireOptions", { selectedTab: selectedTab, templateQuestions: result })

        }
    }

    const handleCloseWorkOrder = (id) => {
        var url = JsonServer.baseURL + 'services/app/WorkOrder/CloseWorkOrder?WorkOrderId=' + id
        postRequest({}, url, (success, result, error) => {

            if (result) {
                dropDownAlertRef.alertWithType('success', 'Success', result)
                setTimeout(() => {
                    navigation.pop(2)
                }, 1200);
                setIsLoading(false)
            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }

    const handleSelectedTabNavigation = (tab) => {
        var result = allQuestions.filter(obj => {
            return obj.name === tab
        })

        navigation.navigate("WOSelectedTabScreen", { selectedTab: tab, templateId: templateId, workOrderId: route.params.workOrderId, templateQuestions: result })
    }

    const renderItemCategoriesFlatList = ({ item, index }) => {
        return (
            <TouchableOpacity
                onPress={() => { handleSelectedTabNavigation(item.tabName) }}
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
                            fontFamily: constants.FontFamilyRegular,
                        }}>
                        {item.tabName}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.viewHeading}>

            <View style={{}}>
                <FlatList
                    data={allQuestionnaireTabs}
                    renderItem={renderItemCategoriesFlatList}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ flexGrow: 1,margin:5 }}
                    numColumns={2}
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

export default WOQuestionnaireTabs

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