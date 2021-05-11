import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { UserModel } from "../models/User.model";

const modulesInitialData: any = {
    'USERS': false,
    'ROLES': false,
    'FAQS': false,
    'MENUS': false,
    'IMAGES': false,
    'SETTINGS': false,
    'DICTIONARIES': false
}

let user: string = '';

export default function DashboardScreen() {

    const [modules, setModules] = useState(modulesInitialData);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useEffect(() => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.USER).then(
            result => {
                if (result != null) {
                    const modulesData: any = {
                        'USERS': false,
                        'ROLES': false,
                        'FAQS': false,
                        'MENUS': false,
                        'IMAGES': false,
                        'SETTINGS': false,
                        'DICTIONARIES': false
                    }
                    user = JSON.parse(result);
                    // @ts-ignore
                    for (let i = 0; i < user.roles.length; i++) {
                        for (let key in modulesData) {
                            if (modulesData.hasOwnProperty(key)) {
                                // @ts-ignore
                                if (user.roles[i].includes(key)) {
                                    modulesData[key] = true;
                                }
                            }
                        }
                    }
                    setModules(modulesData);
                }
            }
        )
    }, [modulesInitialData])

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.header}>Welcome to</Text>
                <Text style={styles.subheader}>powerfull tool for creating various elements</Text>
                <View style={styles.line}></View>
                <Text style={styles.info}>Here are modules that you have access to (specific actions depends on your roles):</Text>
                {
                    Object.keys(modules).map(key =>
                        modules[key] ? <Text style={styles.role} key={key}>{key}</Text> : null
                    )
                }
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
