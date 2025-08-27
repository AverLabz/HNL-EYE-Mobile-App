import React, { useContext, useEffect, useState } from 'react';
import {
  ImageBackground, KeyboardAvoidingView, ScrollView, Text, TextInput,
  TouchableOpacity, View
} from 'react-native';
import { showSuccess, showWarning } from '../../Components/AlertsMessage/AlertMessage';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import styles from './Style';
import FocusAwareStatusBar from '../../Components/statusBar/FocusAwareStatusBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LogoImage from '../../ImageAssets/Svg/LogoImage.svg'

const LoginScreen = ({ navigation }) => {

  const [tenancyName, setTenancyName] = useState('hnl');
  const [userNameOrEmailAddress, setuserNameOrEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [rememberClient, setrememberClient] = useState(true);
  const { saveToAsyncStorageCredentials, getAccessToken, getTenantId, saveToAsyncStorageUserId, setUserCredential, setUserTenantId } = useContext(DataContext)
  const [loading, setLoading] = useState(false)


  const checkInternet = () => {
    const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
      const offline = state.isConnected;
      if (!offline) {
        showWarning("Internet not connected")
      }

    });
  }


  useEffect(() => {
    checkInternet()
    const unsubscribe = navigation.addListener('focus', () => {
      var tenantId = "";
      AsyncStorage.getItem('userTenantId').then((value) => {
        if (value === null || value == "") {
          // navigation.navigate("Login");
        } else {
          tenantId = JSON.parse(value).tenantId;
          setUserTenantId(JSON.parse(value));
          AsyncStorage.getItem('userCredential').then((value) => {
            if (value === null || value == "") {
              // navigation.navigate("Login");
            } else {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: 'DrawerNavigator'
                  }
                ]
              });
              setUserCredential(value);
            }
          });

        }
      });

    }, [])
    return unsubscribe;
  }, [navigation]);


  const handleOnLoginPress = () => {

    var dataToInsert = {
      userNameOrEmailAddress,
      password,
      rememberClient
    };
    var dataTenantName = {
      tenancyName,
    }

    if (tenancyName == "" && userNameOrEmailAddress == "" && password == "") {
      showWarning('Enter your details')
    }
    else if (tenancyName == "") {
      showWarning('Enter Tenant Id')
    }
    else if (userNameOrEmailAddress == "") {
      showWarning('Enter Username or Email')
    }
    else if (password == "") {
      showWarning('Enter your password')
    }
    else {

      setLoading(true)
      getTenantId(dataTenantName, (success, result, error) => {

        if (success) {
          var tenantId = result.tenantId
          getAccessToken(tenantId, dataToInsert, (success, result, error) => {

            if (success == true) {

              saveToAsyncStorageUserId(result.userId)
              saveToAsyncStorageCredentials(dataToInsert);
              showSuccess('You are Successfully Login',)
              setLoading(false);
              setTimeout(() => navigation.navigate("DrawerNavigator"), 1200)
            }
            else {
              setLoading(false);
              showWarning("Invalid username or password")
            }
          })
        } else if (error) {
          setLoading(false);
          showWarning(error)
        } else {
          setLoading(false);
          showWarning("Pls Enter Correct Tenancy Name")
        }
      })

    }

  }

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <FocusAwareStatusBar />
      {loading && <CustomLoader />}
      <KeyboardAvoidingView
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.contentContainerStyle}>
          <ImageBackground
            source={require('../../ImageAssets/LoginBackgroundImage.png')}
            imageStyle={styles.imageStyle}
            style={styles.container}
            resizeMode='stretch'
          >

            <View style={styles.logoContainer}>
              <LogoImage />
            </View>
            <View style={styles.bottomContainer}>

              <Text style={styles.heading}>Welcome</Text>

              <TextInput
                value={userNameOrEmailAddress}
                style={styles.inputStyle}
                placeholder="ERP ID"
                placeholderTextColor={constants.defaultTextBlack}
                autoCapitalize='none'
                returnKeyType='next'
                keyboardType='number-pad'
                onChangeText={(text => { setuserNameOrEmailAddress(text) })}
                ref={(input) => { _firstTextInput = input; }}
                onSubmitEditing={() => { _secondTextInput.focus() }}
              />

              <TextInput
                value={password}
                style={styles.inputStyle}
                placeholder="Password"
                placeholderTextColor={constants.defaultTextBlack}
                secureTextEntry={true}
                autoCapitalize='none'
                onChangeText={(text => { setPassword(text) })}
                ref={(input) => { _secondTextInput = input; }}
                onSubmitEditing={() => handleOnLoginPress()}
              />

              {/* <TouchableOpacity activeOpacity={0.7} style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity> */}

              <TouchableOpacity activeOpacity={0.7} disabled={loading} style={styles.loginButton} onPress={() => handleOnLoginPress()}>
                <Text style={styles.loginText}>Log In</Text>
              </TouchableOpacity>

            </View>
          </ImageBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>

  )
};


export default LoginScreen;