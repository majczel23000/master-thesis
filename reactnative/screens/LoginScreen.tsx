import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button, Snackbar } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { environment } from "../environment";
import { LoginResponseModel } from "../models/LoginResponse.model";
import moduleStyles from "../styles/moduleStyles";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
let { vw, vh } = require('react-native-viewport-units');

export default function LoginScreen() {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | undefined>('');
    const [visible, setVisible] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const navigation = useNavigation();

    const handleLogin = () => {
        setIsLoading(true);
        fetch(environment.apiUrl + 'users/login', {
            method: 'POST',
            headers: environment.headers,
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
            .then(result => result.json())
            .then((data: LoginResponseModel) => {
                setIsLoading(false);
                if (!data.status) {
                    setError(data.message || environment.defaultError);
                    setVisible(true);
                    return;
                }
                AsyncStorage.setItem(AsyncStorageKeysEnum.LOGGED_IN, 'true');
                AsyncStorage.setItem(AsyncStorageKeysEnum.USER, JSON.stringify(data.data?.user));
                AsyncStorage.setItem(AsyncStorageKeysEnum.TOKEN, JSON.stringify(data.data?.token));
                navigation.navigate("Root", { screen: 'Dashboard' });
            })
            .catch(err => {
                setError(environment.defaultError);
                setVisible(true);
            })
    }

    const onDismissSnackBar = () => setVisible(false);

    return (
        <View style={styles.container}>
            <View style={styles.box}>
                <Text style={styles.header}>Please sign in</Text>
                <TextInput
                    label="Email"
                    style={styles.email}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                    value={email}
                    onChangeText={setEmail}
                />
                <Text style={styles.info}>Type your email here</Text>
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    style={styles.password}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                    value={password}
                    onChangeText={setPassword}
                />
                <Text style={styles.info}>Type your password here</Text>
                <Button
                    mode="contained"
                    style={styles.btn}
                    onPress={handleLogin}
                    loading={isLoading}>
                    Login
                </Button>

            </View>
            <Snackbar
                visible={visible}
                style={moduleStyles.snackbarError}
                onDismiss={onDismissSnackBar}>
                {error}
            </Snackbar>
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
        width: 90*vw,
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.2,
        borderRadius: 5,
        paddingTop: 3*vh,
        paddingBottom: 3*vh,
        paddingLeft: 4*vh,
        paddingRight: 4*vh,
    },
    header: {
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center',
    },
    email: {
        backgroundColor: 'white',
    },
    password: {
        backgroundColor: 'white',
    },
    info: {
        color: 'gray',
        fontSize: 11,
        padding: 2
    },
    btn: {
        backgroundColor: '#DB995A',
        marginTop: 5*vh,
        shadowRadius: 3,
        shadowOpacity: 0.2,
        borderRadius: 3,
    }
});
