import { useFocusEffect } from '@react-navigation/native';
import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import DropdownAlert from 'react-native-dropdownalert';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import JsonServer from '../../../Api/api/JsonServer';
import constants from '../../../constants/constants';
import { DataContext } from '../../../Context/context-provider';


const WOSelectedTabScreen = ({ navigation, route }) => {
    const { postRequest, saveToAsyncStorage, deleteRequest } = useContext(DataContext);
    let dropDownAlertRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true)
    const [allTemplatesAgainstTab, setAllTemplatesAgainstTab] = useState([])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <Text style={{ fontSize: 16, fontWeight: "700", color: constants.colorWhite }}>{route.params.selectedTab}</Text>
            )
        })
    }, [])

    useFocusEffect(
        React.useCallback(() => {
            getAllTemplatesAgainstTabName(route.params.workOrderId, route.params.templateId, route.params.selectedTab)
        }, [navigation])
    )


    const getAllTemplatesAgainstTabName = (WorkOrderId, currentTemplateId, currentTab) => {

        var url = JsonServer.baseURL + 'services/app/Answer/FetchAnswers?WorkOrderId=' + WorkOrderId + '&TemplateId=' + currentTemplateId + '&HeaderName=' + currentTab
        postRequest({}, url, (success, result, error) => {

            if (result) {

                setAllTemplatesAgainstTab(result)
                setIsLoading(false)
            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }

    const handleNavigationOnQuestionOption = (workOrderId, selectedTab, templateQuestions, templateId, incrementLength) => {

        saveToAsyncStorage("AnswerFillingData", {
            workOrderId: workOrderId,
            templateId: templateId,
            headerName: selectedTab,
            remarks: selectedTab + " " + incrementLength,
            answers: []
        })
        navigation.navigate("WOQuestionnaireOptions", { selectedTab: selectedTab, templateQuestions: templateQuestions })
    }

    const handleUpdateNavigationOnQuestionOption = (groupId, workOrderId, templateQuestions, templateId, headerName, answerData, remarks) => {

        let filledAnswers = []
        templateQuestions[0].questions.forEach(element => {
            let findQA = answerData.find(x => x.questionText == element.text)
            filledAnswers.push(findQA)
        });
        debugger
        answerData.forEach(element => {
            var mainIndexValue = templateQuestions[0].questions.find(x => x.text == element.questionText)
            if (mainIndexValue !== undefined) {
                mainIndexValue.answerText = element.answerText
                mainIndexValue.imagePath = element.imagePath
                // mainIndexValue.questionText=mainIndexValue.text;
                // delete mainIndexValue.text
            }
            if (templateQuestions[0].questions.find(x => x.nestedQuestions.length > 0).nestedQuestions.length > 0) {
                var nestedIndexValue = templateQuestions[0].questions.find(x => x.nestedQuestions.length > 0).nestedQuestions.find(x => x.questions.length > 0).questions.find(x => x.text == element.questionText)
                if (nestedIndexValue !== undefined) {
                    nestedIndexValue.answerText = element.answerText
                    nestedIndexValue.imagePath = element.imagePath
                }
            }
            // templateQuestions[0].questions?.find(x=>x.nestedQuestions.length>0).nestedQuestions?.find(x=>x.questions.length>0).questions?.find(x=>x.text==element.questionText).answerText=element.answerText
        });

        saveToAsyncStorage("AnswerFillingDataForUpdate", {
            groupId: groupId,
            workOrderId: workOrderId,
            templateId: templateId,
            headerName: headerName,
            remarks: remarks,
            // answers: answerData
            answers: templateQuestions[0].questions
        })
        navigation.navigate("WOQuestionnaireUpdateOptions", {
            selectedTab: headerName, templateQuestions: templateQuestions, filledAnswers: templateQuestions[0].questions
        })
    }

    const handleDeleteQuestionWithOptions = (groupId) => {
        var url = JsonServer.baseURL + 'services/app/Answer/DeleteAnswers?GroupId=' + groupId
        deleteRequest(url, (success, result, error) => {

            if (success) {
                dropDownAlertRef.alertWithType('success', 'Alert', result)
                getAllTemplatesAgainstTabName(route.params.workOrderId, route.params.templateId, route.params.selectedTab)
            } else {
                setIsLoading(false)
                dropDownAlertRef.alertWithType('error', 'Alert', error.message)
            }
        });
    }

    const askPermission = (groupId)=> {
        Alert.alert('Attention', 'Are you sure to delete this?', [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {text: 'YES', onPress: () => {
                setIsLoading(true)
                handleDeleteQuestionWithOptions(groupId)}},
          ]);
    }

    const renderTemplateItemCategoriesFlatList = ({ item, index }) => {
        console.log(item.groupId)
        return (
            // <TouchableOpacity onPress={() => { handleUpdateNavigationOnQuestionOption(item.groupId, item.workOrderId, route.params.templateQuestions, item.templateId, item.headerName, item.answers, item.remarks) }} activeOpacity={0.6} style={styles.renderTemplateStyle}>
            <View onPress={() => { }} activeOpacity={0.6} style={styles.renderTemplateStyle}>
                <Text style={[styles.renderTextStyle, {}]}>{item.remarks}</Text>
                <Text style={styles.renderTextStyle}>{item.submissionDate}</Text>
                <TouchableOpacity style={{ backgroundColor: "#D11A2A", padding: 5, borderRadius: 5, paddingHorizontal: 10 }} onPress={()=> {
                    askPermission(item.groupId)
                    }}>
                    <Text style={[styles.renderTextStyle, { color: constants.colorWhite }]}>Delete</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <SafeAreaView style={{ flex: 1, }}>
            {isLoading && <View style={{ flex: 1, position: 'absolute', top: "40%", right: 0, left: 0, zIndex: 100, }}>
                <ActivityIndicator size="large" animating={isLoading} color={constants.colorPrimary} style={{ flex: 1, justifyContent: 'center', alignItems: "center", zIndex: 100, right: 0, left: 0, bottom: 0, top: 0, }} />
            </View>}
            <FlatList
                data={allTemplatesAgainstTab}
                renderItem={renderTemplateItemCategoriesFlatList}
                keyExtractor={(item) => item.groupId}
                contentContainerStyle={{ flexGrow: 1, margin: 15 }}
                showsHorizontalScrollIndicator={false}
            />
            <View style={styles.filterButtonContainer}>
                <TouchableOpacity
                    disabled={isLoading ? true : false}
                    onPress={() => { handleNavigationOnQuestionOption(route.params.workOrderId, route.params.selectedTab, route.params.templateQuestions, route.params.templateId, allTemplatesAgainstTab.length + 1) }}
                    style={styles.touchableButtonStyle}>
                    <MaterialIcons name="add" size={25} color={constants.colorWhite} />
                </TouchableOpacity>
            </View>

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

export default WOSelectedTabScreen

const styles = StyleSheet.create({
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
    renderTemplateStyle: { flexDirection: "row", backgroundColor: constants.lightGrayColor, borderWidth: 0.5, borderColor: constants.colorPrimary, borderRadius: 6, padding: 15, marginTop: 10, alignItems: "center", justifyContent: "space-between" },
    renderTextStyle: { fontSize: 16, fontWeight: "bold", color: constants.blackText },
})