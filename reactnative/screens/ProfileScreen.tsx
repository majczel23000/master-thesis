import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {useEffect} from "react";
import {StackHeaderLeftButtonProps} from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import {Button} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.header}>PROFILE</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa'
    },
    box: {
        width: '90vw',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.2,
        borderRadius: 5,
        paddingTop: '3vh',
        paddingBottom: '3vh',
        paddingLeft: '4vh',
        paddingRight: '4vh',
        marginTop: 20
    },
    header: {
        fontSize: 50,
        fontWeight: '500',
        textAlign: 'center',
    },
    subheader: {
        backgroundColor: 'white',
        textAlign: 'center',
        padding: 10,
        paddingTop: 0,
    },
    line: {
        height: 1,
        backgroundColor: 'black',
        margin: 10,
    },
    info: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    role: {
        textAlign: 'center',
        padding: 1,
        fontSize: 16
    }
});
