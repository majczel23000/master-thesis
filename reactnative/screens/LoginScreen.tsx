import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LoginScreen() {

    const navigation = useNavigation();

    const login = () => {
        console.log('LOGIN');

        navigation.navigate("Root", { screen: 'Dashboard' });
        AsyncStorage.setItem('LOGGED_IN', 'true');
    }

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
                />
                <Text style={styles.info}>Type your email here</Text>
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    style={styles.password}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={styles.info}>Type your password here</Text>
                <Button
                    mode="contained"
                    style={styles.btn}
                    onPress={login}>
                    Login
                </Button>
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
    },
    header: {
        fontSize: 30,
        fontWeight: '700',
        textAlign: 'center',
    },
    email: {
        backgroundColor: 'white',
        border: 'none',
    },
    password: {
        backgroundColor: 'white',
        border: 'none',
    },
    info: {
        color: 'gray',
        fontSize: 11,
        padding: 2
    },
    btn: {
        backgroundColor: '#DB995A',
        marginTop: '5vh',
        shadowRadius: 3,
        shadowOpacity: 0.2,
        borderRadius: 3,
    }
});
