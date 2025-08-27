import React, { Component, useContext, useEffect, useState } from "react";
import {
    View,
    StatusBar,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    date,
    Alert,
} from "react-native";
import moment from 'moment';
import constants from "../../constants/constants";


const ItemDetailComponents = ({ title, value,navigation }) => {


    return (
               <View style={{flexDirection:'row',marginTop:10}}>
               <View style={{ padding: 5, flex: 2, flexDirection: 'row', borderColor: '#d9d9d9', borderWidth: 1, marginRight: 3 }}>
                    <Text >
                        {title}
                </Text>
                </View>
                <View style={{ padding: 5, flex: 3, flexDirection: 'row', borderColor: '#d9d9d9', borderWidth: 1, marginRight: 3 }}>
                    
                    <Text style={{ textAlign: 'center', flex: 1 }}>
                        {value}
                    </Text>
                </View>
               </View>
               

            
            
           

    );

}
export default ItemDetailComponents;
