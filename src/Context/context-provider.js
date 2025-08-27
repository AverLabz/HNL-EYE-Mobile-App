import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useState } from 'react';
import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import RNFS from 'react-native-fs';
import Geolocation from 'react-native-geolocation-service';
import ImgToBase64 from 'react-native-image-base64';
import JsonServer from '../Api/api/JsonServer';

export const DataContext = createContext('  ')

const ContextProvider = props => {

    const [userTenantId, setUserTenantId] = useState('')
    const [userCredential, setUserCredential] = useState('')
    const [userInfo, setUserInfo] = useState('')
    const [UserCheckIn, setUserCheckIn] = useState('')
    const [userId, setUserId] = useState('')
    const [userCompany, setUserCompany] = useState('')
    const [startDutyTime, setStartDutyTime] = useState('')
    const [underCheckedSiteData, setUnderCheckedSiteData] = useState('')
    const [underCheckedWOData, setUnderCheckedWOData] = useState('')
    const [departmentInfo, setDepartmentInfo] = useState(null)
    const [dropdownValueIndex, setDropdownValueIndex] = useState(null)
    const [wOScreenNavigationProps, setWOScreenNavigationProps] = useState(null)
    const [setSelected, setSetSelected] = useState('');
    const [pendingWos, setPendinfWOs] = useState([]);
    const [acceptedWos, setAcceptedWos] = useState([]);
    const [getAllAttendance, setGetAllAttendance] = useState([]);
    const [teamAttendance, setTeamAttendance] = useState([]);
    const [imageSource, setImageSource] = useState('');
    const [isLoadingActivityIncatorForImage, setIsLoadingActivityIncatorForImage] = useState(false);
    const [assignedInventory, setAssignedInventory] = useState([]);
    const [acceptedInventory, setAcceptedInventory] = useState([]);
    const [placedAtSiteInventory, setPlacedAtSiteInventory] = useState([]);
    const [inventoryReturnToWH, setInventoryReturnToWH] = useState([]);
    const [inventoryWarrantyClaim, setInventoryWarrantyClaim] = useState([]);
    const [storeItems, setStoreItems] = useState([]);
    const [serviceItems, setServiceItems] = useState([]);
    const [selectedSite, setSelectedSite] = useState("")
    const [selectedWO, setSelectedWO] = useState("")
    const [vehicleNumber, setVehicleNumber] = useState('')
    const [vehicleMillage, setVehicleMillage] = useState('')
    const [fsrNumber, setFsrNumber] = useState('')
    const [activityType, setActivityType] = useState('')

    const [openInventorySites, setOpenInventorySites] = useState(false);
    const [inventorySiteValues, setInventorySiteValues] = useState(null);

    const [woShortDec, setWoShortDec] = useState('')
    const [woSiteCode, setWoSiteCode] = useState('')
    // PM work order states
    const [pendingWoPM, setPendingWoPM] = useState([])
    const [acceptedWoPM, setAcceptedWoPM] = useState([])
    const [closedWoPM, setClosedWoPM] = useState([])

    // CM work order states
    const [pendingWoCM, setPendingWoCM] = useState([])
    const [acceptedWoCM, setAcceptedWoCM] = useState([])
    const [closedWoCM, setClosedWoCM] = useState([])
    const [createdWoCM, setCreatedWoCM] = useState([])
    const [GetAllIssuances, setGetAllIssuances] = useState([])
    const [profileData, setProfileData] = useState(null)

    const saveToAsyncStorageTenantId = async (dataTenantName) => {
        await AsyncStorage.setItem('userTenantId', JSON.stringify(dataTenantName));
    }

    const saveToAsyncStoragePMWOQuestionsData = async (WOQuestionsData) => {
        await AsyncStorage.setItem('PMWOQuestionsData', JSON.stringify(WOQuestionsData));
    }

    const saveToAsyncStorageCMWOQuestionsData = async (WOQuestionsData) => {
        await AsyncStorage.setItem('CMWOQuestionsData', JSON.stringify(WOQuestionsData));
    }

    const saveToAsyncStorageCredentials = async (dataToInsert) => {

        await AsyncStorage.setItem('userCredential', JSON.stringify(dataToInsert));
        setUserCredential(JSON.stringify(dataToInsert))
        // getUserData(dataToInsert, (result));
    }

    const saveToAsyncStorageUserId = async (dataToInsert) => {

        await AsyncStorage.setItem('userId', JSON.stringify(dataToInsert));
        setUserId(dataToInsert);
        // getUserData(dataToInsert, (result));
    }
    const saveToAsyncStorageUserInfo = async (responseJson) => {
        await AsyncStorage.setItem('userInfo', JSON.stringify(responseJson));
    }
    const saveToAsyncStorageCheckInData = async (responseJson) => {
        await AsyncStorage.setItem('UserCheckIn', JSON.stringify(responseJson));
    }
    const saveToAsyncStorageAllCompany = async (responseJson) => {

        await AsyncStorage.setItem('userCompany', JSON.stringify(responseJson));
    }

    const saveToAsyncStorage = async (storageName, dataToInsert) => {
        await AsyncStorage.setItem(storageName, JSON.stringify(dataToInsert));
    }

    const getTenantId = (TenantData, callback) => {

        var TenantBody = JSON.stringify(TenantData);
        fetch(JsonServer.baseURL + "services/app/Account/IsTenantAvailable", {
            method: 'POST',
            headers: {
                accept: 'text/plain',
                'Content-Type': 'application/json',
                // 'Abp.TenantId': 4
            },
            body: TenantBody,
        })
            .then(response => response.json())
            .then(responseJson => {
                setUserTenantId(responseJson.result);
                saveToAsyncStorageTenantId(responseJson.result);
                // callback(responseJson)
                callback(responseJson.success, responseJson.result, responseJson.error);
            })
            .catch(error => {
                callback(false, null, error.message);
            });
    }

    const getAccessToken = (tenantId, logInData, callback) => {

        var loginBody = JSON.stringify(logInData);
        fetch(JsonServer.baseURL + "TokenAuth/Authenticate", {
            method: 'POST',
            headers: {
                accept: 'text/plain',
                'Content-Type': 'application/json',
                'Abp.TenantId': tenantId
            },
            body: loginBody,
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.success == false)
                    callback(responseJson.success, responseJson.result, responseJson.error.details);
                else {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                    setUserId(responseJson.result.userId)
                }
            })
            .catch(error => {
                callback(false, null, error.message);
            });
    }
    const getUserData = async (value, callback) => {
        var userData = { userNameOrEmailAddress: JSON.parse(value.value).userNameOrEmailAddress, password: JSON.parse(value.value).password, rememberClient: true };
        getAccessToken(value.tenantId, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", value.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,

            };
            fetch(JsonServer.baseURL + "services/app/User/Get?Id=" + result.userId, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    // setUserInfo(responseJson.result);
                    // saveToAsyncStorageUserInfo(responseJson.result);
                    callback(responseJson)
                })
                .catch(error => {
                    console.log('error', error)
                });
        })


    }
    const getUserHomeData = async (paramToUser, value, callback) => {
        var userData = { userNameOrEmailAddress: JSON.parse(value).userNameOrEmailAddress, password: JSON.parse(value).password, rememberClient: true };
        getAccessToken(paramToUser.tenantId, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", value.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,

            };
            fetch(JsonServer.baseURL + "services/app/UserHome/GetUserHomeByErpId?id=" + JSON.parse(value).userNameOrEmailAddress, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error)
                })
                .catch(error => {
                    console.log('error', error)
                });
        })


    }
    const getSiteData = async (callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };
            fetch(JsonServer.baseURL + "services/app/UserSiteAllocation/GetAllUserSiteAllocationDataByUserId?userId=" + result.userId, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }
    const getCurretLocation = async (callback) => {

        if (Platform.OS == "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        'title': 'HNL Eye',
                        'message': 'HNL Eye wants to access your location please turn on'
                    }
                )

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            callback(position, true)
                        },
                        (error) => {
                            // See error code charts below.
                            // Alert.alert("Please turn On your location")
                            Alert.alert(
                                'Location Permission Denied',
                                'Please go to your device settings and enable location permissions for HNL Eye.',
                                [
                                    {
                                        text: 'Cancel',
                                        style: 'cancel'
                                    },
                                    {
                                        text: 'Settings',
                                        onPress: () => {
                                            Linking.openSettings();
                                        }
                                    }
                                ]
                            );
                            // callback(false, false)
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                } else {
                    console.log("location permission denied")
                    // alert("Location permission denied");
                }
            } catch (err) {
                console.log(err)
            }
        } else {
            try {
                const permissionStatus = await Geolocation.requestAuthorization('always');
                if (permissionStatus === 'granted') {
                    Geolocation.getCurrentPosition(
                        (position) => {
                            callback(position, true)
                        },
                        (error) => {
                            // See error code charts below.
                            Alert.alert("Please turn On your location")
                            // callback(false, false)
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
                    );
                } else {
                    callback('Permission not granted', false);
                }
            } catch (error) {
                return callback(error, false);
            }
        }

        // BackgroundGeolocation.ready(
        //     {
        //         locationAuthorizationRequest: 'Always',
        //         disableLocationAuthorizationAlert: true,
        //         desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
        //         stopTimeout: 10,
        //         debug: false,
        //         logLevel: BackgroundGeolocation.LOG_LEVEL_ERROR,
        //         stopOnTerminate: false,
        //         startOnBoot: true,
        //         autoSync: false,
        //         enableHeadless: true,
        //         motionTriggerDelay: 30000,
        //         preventSuspend: true,
        //     }, (state) => {
        //         BackgroundGeolocation.getCurrentPosition({
        //             persist: true,
        //             samples: 1,
        //             maximumAge: 0
        //         }, (location) => {

        //             callback(location, true)
        //         }, (error) => {
        //             callback(false, false)
        //         });
        //     });
    }


    const rad = (x) => {
        return x * Math.PI / 180;
    };

    const checkDistance = (lat1, lon1, lat2, lon2, unit) => {
        var R = 6378137; // Earth’s mean radius in meter
        var dLat = rad(lat2 - lat1);
        var dLong = rad(lon2 - lon1);
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(lat1)) * Math.cos(rad(lat2)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;
        return d; // returns the distance in meter
    };

    const getCheckInData = async (dataToInsert, callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var AttandanceBody = JSON.stringify(dataToInsert);
            fetch(JsonServer.baseURL + "services/app/Attendance/UserCheckIn", {
                method: 'POST',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
                body: AttandanceBody,
            })
                .then(response => response.json())
                .then(responseJson => {
                    setUserCheckIn(responseJson.result);
                    saveToAsyncStorageCheckInData(responseJson.result);
                    callback(responseJson.success, responseJson.result, responseJson.error);

                })
                .catch(error => {

                });
        })
    }
    const getCheckOutData = async (dataToInsert, callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var AttandanceBody = JSON.stringify(dataToInsert);
            fetch(JsonServer.baseURL + "services/app/Attendance/UserCheckOut", {
                method: 'PUT',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
                body: AttandanceBody,
            })
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                });
        })
    }
    const putAPICall = async (url, callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            fetch(url, {
                method: 'PUT',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
            })
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                });
        })
    }
    const getStartTimeByUser = async (paramToDate, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(paramToDate.value).userNameOrEmailAddress, password: JSON.parse(paramToDate.value).password, rememberClient: true };
        getAccessToken(paramToDate.tenantId, userData, (success, result, error) => {
            var myHeaders = new Headers();

            myHeaders.append("Abp.TenantId", paramToDate.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);
            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,

            };
            fetch(JsonServer.baseURL + "services/app/Attendance/GetStartTimeByUser?userId=" + result.userId + "&date=" + paramToDate.todaysDate, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }

    // Get All User Attendance 

    const getAllUserAttendance = async (timeOrDate, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(timeOrDate.value).userNameOrEmailAddress, password: JSON.parse(timeOrDate.value).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();

            myHeaders.append("Abp.TenantId", timeOrDate.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);
            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,

            };
            fetch(JsonServer.baseURL + "services/app/Attendance/GetAllUserAttendancewithstartOrEndDate?StartDate=2021-04-23&EndDate=2021-05-23&MaxResultCount=10")
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                    console.log('error', error)
                });
        })
    }


    const getAPICall = async (url, callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantIdData);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);
            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };
            fetch(url, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })


    }
    const getTeamAPICall = async (url, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var urlToSend = url;
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantIdData);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);
            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,

            };
            fetch(urlToSend, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    //  console.log('error', error)
                });
        })


    }
    const getAPICallByUserDetails = async (value, url, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(value.value).userNameOrEmailAddress, password: JSON.parse(value.value).password, rememberClient: true };
        getAccessToken(value.tenantId, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", value.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);
            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,

            };
            fetch(url, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    //  console.log('error', error)
                });
        })


    }
    const putRequest = async (dataToInsert, url, callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {

            var dataBody = JSON.stringify(dataToInsert);
            fetch(url, {
                method: 'PUT',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
                body: dataBody,
            })
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                });
        })
    }

    const postRequest = async (dataToInsert, url, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {

            var dataBody = JSON.stringify(dataToInsert);
            fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
                body: dataBody,
            })
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                });
        })
    }
    
    const deleteRequest = async ( url, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {

            fetch(url, {
                method: 'DELETE',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
            })
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                });
        })
    }
    const postSubmitWORequest = async (dataToInsert, url, callback) => {
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {

            var dataBody = JSON.stringify(dataToInsert.allQuestions);
            fetch(url, {
                method: 'POST',
                headers: {
                    accept: 'text/plain',
                    'Content-Type': 'application/json',
                    'Abp.TenantId': userTenantId.tenantId,
                    'Authorization': 'Bearer ' + result.accessToken,
                },
                body: dataBody,
            })
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {

                });
        })
    }

    const GetAllCompany = async (callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };
            fetch(JsonServer.baseURL + "services/app/Company/GetAll", requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    setUserCompany(responseJson.result);
                    saveToAsyncStorageAllCompany(responseJson.result);
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }
    const GetAllDepartment = async (callback) => {
        //
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };
            fetch(JsonServer.baseURL + "services/app/Department/GetAll", requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }
    const GetAllTaskTicketTemplate = async (callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };
            fetch(JsonServer.baseURL + "services/app/TaskTicketTemplate/GetAll", requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }
    const GetAllDepartmentByCompanyId = async (id, callback) => {

        var UserCompanyById = id
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };
            fetch(JsonServer.baseURL + "services/app/Department/GetAllDepartmentByCompanyId?companyId=" + UserCompanyById, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }
    const GetAllticketsTemplatesbydepartmentId = async (id, callback) => {

        var UserDepartmentById = id
        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };

            fetch(JsonServer.baseURL + "services/app/TaskTicketTemplate/GetAllticketsTemplatesbydepartmentId?departmentId=" + UserDepartmentById, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }

    const GetAllQuestionnaireOptionbyQuestionIdAndOptionId = async (questionId, optionId, callback) => {

        var userTenantIdData = userTenantId.tenantId
        var userData = { userNameOrEmailAddress: JSON.parse(userCredential).userNameOrEmailAddress, password: JSON.parse(userCredential).password, rememberClient: true };
        getAccessToken(userTenantIdData, userData, (success, result, error) => {
            var myHeaders = new Headers();
            myHeaders.append("Abp.TenantId", userTenantId.tenantId);
            myHeaders.append("Authorization", "Bearer " + result.accessToken);

            var requestOptions = {
                accept: 'text/plain',
                method: 'GET',
                headers: myHeaders,
            };

            fetch(JsonServer.baseURL + "services/app/QuestionOptionsAllocation/GetAllQuestionnaireOptionbyQuestionIdAndOptionId?questionId=" + questionId + "&optionId=" + optionId, requestOptions)
                .then(response => response.json())
                .then(responseJson => {
                    callback(responseJson.success, responseJson.result, responseJson.error);
                })
                .catch(error => {
                    console.log('error', error)
                });
        })
    }

    const TextMatcher = (listOfItem, value) => {
        return listOfItem.filter((item) => {
            const textMatch = item.userName.toLowerCase().includes(value.toLowerCase());
            return textMatch;
        });
    };
    const removeDuplicationRows = (dataArr) => {
        let getUniqueUserName = [...new Set(dataArr.map((a) => a.userName))];
        let finalArray = [];

        for (let j = 0; j < getUniqueUserName.length; j++) {
            for (let i = 0; i < dataArr.length; i++) {
                if (getUniqueUserName[j] === dataArr[i].userName) {
                    if (finalArray.length > 0) {
                        let checkValueExist = TextMatcher(finalArray, getUniqueUserName[j]);
                        if (checkValueExist.length === 0) {
                            finalArray.push(dataArr[i]);
                        }
                    }
                    if (finalArray.length === 0) {
                        finalArray.push(dataArr[i]);
                    }
                }
            }
        }
        return finalArray;
    };

    const ConvertImageToBase64 = (image, callback) => {
        RNFS.readFile(image, 'base64')
            .then(res => {
                callback(res);
            });
    }
    const ConvertImageUrlToBase64 = async (image, callback) => {
        ImgToBase64.getBase64String(image)
            .then(base64String => {
                callback(base64String)
            })
            .catch(err => doSomethingWith(err));

    }

    const value = {
        userCredential,
        userInfo,
        UserCheckIn,
        startDutyTime,
        departmentInfo,
        dropdownValueIndex,
        wOScreenNavigationProps,
        setSelected,
        pendingWos,
        acceptedWos,
        getAllAttendance,
        teamAttendance,
        imageSource,
        userTenantId,
        userCompany,
        underCheckedSiteData,
        underCheckedWOData,
        isLoadingActivityIncatorForImage,
        assignedInventory,
        acceptedInventory,
        placedAtSiteInventory,
        inventoryReturnToWH,
        inventoryWarrantyClaim,
        userId,
        storeItems,
        serviceItems,
        selectedSite,
        selectedWO,
        openInventorySites,
        inventorySiteValues,
        woShortDec,
        pendingWoPM,
        acceptedWoPM,
        pendingWoCM,
        acceptedWoCM,
        woSiteCode, 
        closedWoPM, 
        closedWoCM, 
        GetAllIssuances,
        vehicleNumber, 
        vehicleMillage,
        activityType, 
        fsrNumber, 
        createdWoCM, 
        profileData, 
        setProfileData,
        setCreatedWoCM,
        setFsrNumber,
        setActivityType,
        setVehicleMillage,
        setVehicleNumber,
        setGetAllIssuances,
        deleteRequest,
        setClosedWoCM,
        setClosedWoPM,
        setWoSiteCode,
        setAcceptedWoCM,
        setPendingWoCM,
        setAcceptedWoPM,
        setPendingWoPM,
        saveToAsyncStorage,
        setWoShortDec,
        setInventorySiteValues,
        setOpenInventorySites,
        setSelectedWO,
        setSelectedSite,
        setServiceItems,
        setStoreItems,
        ConvertImageUrlToBase64,
        setUserId,
        setInventoryWarrantyClaim,
        setInventoryReturnToWH,
        setPlacedAtSiteInventory,
        setAssignedInventory,
        setAcceptedInventory,
        setIsLoadingActivityIncatorForImage,
        setUnderCheckedWOData,
        setUnderCheckedSiteData,
        setImageSource,
        setUserTenantId,
        getTenantId,
        setDropdownValueIndex,
        setDepartmentInfo,
        checkDistance,
        saveToAsyncStorageTenantId,
        saveToAsyncStorageCredentials,
        setUserCredential,
        setUserCompany,
        getAccessToken,
        getUserData,
        getSiteData,
        getCurretLocation,
        getCheckInData,
        getStartTimeByUser,
        getCheckOutData,
        setUserCheckIn,
        setStartDutyTime,
        getAllUserAttendance,
        getAPICall,
        putAPICall,
        getAPICallByUserDetails,
        putRequest,
        getTeamAPICall,
        postRequest,
        setWOScreenNavigationProps,
        setSetSelected,
        postSubmitWORequest,
        setPendinfWOs,
        setAcceptedWos,
        setGetAllAttendance,
        setTeamAttendance,
        saveToAsyncStoragePMWOQuestionsData,
        saveToAsyncStorageCMWOQuestionsData,
        GetAllCompany,
        GetAllDepartment,
        GetAllTaskTicketTemplate,
        GetAllDepartmentByCompanyId,
        GetAllticketsTemplatesbydepartmentId,
        saveToAsyncStorageAllCompany,
        GetAllQuestionnaireOptionbyQuestionIdAndOptionId,
        removeDuplicationRows,
        getUserHomeData,
        ConvertImageToBase64,
        saveToAsyncStorageUserId
    }

    return (
        <DataContext.Provider value={value}>
            {props.children}
        </DataContext.Provider>
    )
}

export default
    ContextProvider
