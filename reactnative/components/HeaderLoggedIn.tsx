import * as React from 'react';
import { StyleSheet, Text, View } from "react-native";
import { IconButton } from "react-native-paper";

export function HeaderLoggedIn() {

    const openMenu = () => {

    }

    return (
        <View style={styles.headerBox}>
            <IconButton icon="menu" onPress={openMenu}></IconButton>
            <Text style={styles.headerText}>CMS</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerBox: {
        backgroundColor: '#DB995A',
        height: '10vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
    },
    headerText: {
        color: 'black',
        fontSize: 26,
        fontWeight: 'bold',
    }
});
