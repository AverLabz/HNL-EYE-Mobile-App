import React, { useContext } from 'react';
import { FlatList, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import constants from '../../constants/constants';
import { DataContext } from '../../Context/context-provider';
import styles from './styles';

const StoreItemScreen = ({ navigation }) => {

    const { storeItems, setStoreItems } = useContext(DataContext);

    const removeItem = (item) => {
        var objArray = [...storeItems];
        var alteredImages = objArray.filter(function (e) {
            return e !== item
        })
        setStoreItems(alteredImages)
    }

    const renderItem = (item, index) => {

        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { }} style={styles.listContainer} >
                <View style={{ flex: 1, flexDirection: 'column' }}>
                    <View style={styles.listRowStyle}>
                        <Text style={styles.textStyle} >Item Code</Text>
                        <Text style={styles.textStyle} >{item.itemCode}</Text>
                    </View>
                    <View style={styles.listRowStyle}>
                        <Text style={styles.textStyle} >Description</Text>
                        <Text style={styles.textStyle} >{item.description}</Text>
                    </View>
                    <View style={styles.listRowStyle}>
                        <Text style={styles.textStyle} >Quantity</Text>
                        <Text style={styles.textStyle} >{item.quantity}</Text>
                    </View>
                </View>
                <View style={styles.panel}>
                    <TouchableOpacity activeOpacity={0.7} onPress={() => { removeItem(item) }}
                        style={{ ...styles.panelButton, backgroundColor: constants.colorPrimary }}>
                        <Text style={styles.panelButtonTitle}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: constants.lightGrayColor }}>

            <View style={styles.filterButtonContainer}>
                <TouchableOpacity
                    onPress={() => { navigation.navigate("AddItemsScreen", { status: "storeItem" }) }}
                    style={styles.touchableButtonStyle}>
                    <MaterialIcons name="add" size={25} color={constants.colorWhite} />
                </TouchableOpacity>
            </View>

            <FlatList
                style={{ margin: 20 }}
                data={storeItems}
                renderItem={({ item, index }) => renderItem(item, index)}
                keyExtractor={item => item.itemCode}
            />

        </SafeAreaView>
    )
}

export default StoreItemScreen

