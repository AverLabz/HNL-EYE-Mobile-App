import { View, Text } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomLoader from '../../Components/CustomLoader/CustomLoader';
import { DataContext } from '../../Context/context-provider';
import constants from '../../constants/constants';

const Splash = () => {

    const navigation = useNavigation()
    const { setUserCredential, setUserTenantId } = useContext(DataContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        var tenantId = "";
        AsyncStorage.getItem('userTenantId').then((value) => {
            if (value === null || value == "") {
                setTimeout(() => {
                    navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Login'
                            }
                        ]
                    });
                    setIsLoading(false)
                }, 1300);
            } else {
                tenantId = JSON.parse(value).tenantId;
                setUserTenantId(JSON.parse(value));
                AsyncStorage.getItem('userCredential').then((value) => {
                    if (value === null || value == "") {
                        setTimeout(() => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Login'
                                    }
                                ]
                            });
                            setIsLoading(false)
                        }, 1300);
                    } else {
                        setTimeout(() => {
                            navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'DrawerNavigator'
                                    }
                                ]
                            });
                            setIsLoading(false)
                        }, 1300);
                        setUserCredential(value);
                    }
                });

            }
        });
    }, [navigation]);
    return (
        <View style={{ flex: 1, backgroundColor: constants.screenBackgroundWhite }}>
            {isLoading && <CustomLoader />}
        </View>
    )
}

export default Splash