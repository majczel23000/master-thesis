import * as React from 'react';
import { StyleSheet, Text, View } from "react-native";

export function HeaderLoggedIn() {
    return (
        <View style={styles.headerBox}>
            <Text style={styles.headerText}>CMS in</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    headerBox: {
        backgroundColor: '#DB995A',
        height: '10vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    headerText: {
        color: 'black',
        fontSize: 26,
        fontWeight: 'bold',
    }
});
