import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import styles from './style';

const DatabaseTopTabs = ({ telcoInventoryMain, btsCabinet, Antennas, RRUs, IDU, ODU, BtsCabinetBoardCards, BtsCabinetBoardVSWRs, IDUMMUCards }) => {

    const [isPress1, setPress1] = useState(true);
    const [isPress2, setPress2] = useState(false);
    const [isPress3, setPress3] = useState(false);
    const [isPress4, setPress4] = useState(false);
    const [isPress5, setPress5] = useState(false);
    const [isPress6, setPress6] = useState(false);
    const [isPress7, setPress7] = useState(false);
    const [isPress8, setPress8] = useState(false);
    const [isPress9, setPress9] = useState(false);

    return (
        <View style={styles.viewContainer}>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.viewSubContainer}>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress1 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(true)
                        setPress2(false)
                        setPress3(false)
                        setPress4(false)
                        setPress5(false)
                        setPress6(false)
                        setPress7(false)
                        setPress8(false)
                        setPress9(false)
                        telcoInventoryMain()
                    }}
                >
                    <Text style={isPress1 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>Telco Inventory Main</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress2 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(true)
                        setPress3(false)
                        setPress4(false)
                        setPress5(false)
                        setPress6(false)
                        setPress7(false)
                        setPress8(false)
                        setPress9(false)
                        btsCabinet()
                    }}
                >
                    <Text style={isPress2 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>Bts Cabinet</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress3 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(true)
                        setPress4(false)
                        setPress5(false)
                        setPress6(false)
                        setPress7(false)
                        setPress8(false)
                        setPress9(false)
                        Antennas()
                    }}
                >
                    <Text style={isPress3 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>Antennas</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress4 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(false)
                        setPress4(true)
                        setPress5(false)
                        setPress6(false)
                        setPress7(false)
                        setPress8(false)
                        setPress9(false)
                        RRUs()
                    }}
                >
                    <Text style={isPress4 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>RRUs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress5 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(false)
                        setPress4(false)
                        setPress5(true)
                        setPress6(false)
                        setPress7(false)
                        setPress8(false)
                        setPress9(false)
                        IDU()
                    }}
                >
                    <Text style={isPress5 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>IDU</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress6 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(false)
                        setPress4(false)
                        setPress5(false)
                        setPress6(true)
                        setPress7(false)
                        setPress8(false)
                        setPress9(false)
                        ODU()
                    }}
                >
                    <Text style={isPress6 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>ODU</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress7 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(false)
                        setPress4(false)
                        setPress5(false)
                        setPress6(false)
                        setPress7(true)
                        setPress8(false)
                        setPress9(false)
                        BtsCabinetBoardCards()
                    }}
                >
                    <Text style={isPress7 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>Bts Cabinet BoardCards</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress8 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(false)
                        setPress4(false)
                        setPress5(false)
                        setPress6(false)
                        setPress7(false)
                        setPress8(true)
                        setPress9(false)
                        BtsCabinetBoardVSWRs()
                    }}
                >
                    <Text style={isPress8 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>Bts Cabinet VSWRs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    activeOpacity={0.6}
                    style={isPress9 ? styles.pressedTab : styles.nonPressedTab}
                    onPress={() => {
                        setPress1(false)
                        setPress2(false)
                        setPress3(false)
                        setPress4(false)
                        setPress5(false)
                        setPress6(false)
                        setPress7(false)
                        setPress8(false)
                        setPress9(true)
                        IDUMMUCards()
                    }}
                >
                    <Text style={isPress9 ? styles.selectedTextStyle : styles.nonSelectedTextStyle}>IDU MMU Cards</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

export default DatabaseTopTabs