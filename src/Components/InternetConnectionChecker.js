import React, { useEffect } from 'react';
import NetInfo from "@react-native-community/netinfo";
import { showWarning } from './AlertsMessage/AlertMessage';
const InternetConnectionChecker = () => {
    useEffect(() => {
        const checkInternet = () => {
            const removeNetInfoSubscription = NetInfo.addEventListener((state) => {
                const offline = !state.isConnected;
                if (offline) {
                    showWarning("Internet not connected");
                }
            });
            return () => removeNetInfoSubscription();
        };

        checkInternet();
    }, []);

    return null; // This component doesn't render anything visible
};

export default InternetConnectionChecker;
