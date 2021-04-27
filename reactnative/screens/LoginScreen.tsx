import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';

export default function LoginScreen({navigation}: {navigation: any}) {
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
                <Button mode="contained" style={styles.btn}>Login</Button>
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
        shadowRadius: 15,
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
        color: 'gray'
    },
    btn: {
        backgroundColor: '#DB995A',
        marginTop: '5vh'
    }
});
