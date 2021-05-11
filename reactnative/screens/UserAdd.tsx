import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {useCallback, useEffect, useState} from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import {TextInput, Checkbox, Button, Snackbar} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { RolesResponseModel } from "../models/roles/RolesResponse.model";
import { RoleModel } from "../models/roles/Role.model";

export default function UserAddScreen() {
    const [roles, setRoles] = React.useState<RoleModel[]>([]);
    const [email, setEmail] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [error, setError] = useState<string | undefined>('');
    const [visible, setVisible] = React.useState<boolean>(false);

    const onDismissSnackBar = () => setVisible(false);

    const handleCheck = (checkedCode: string | undefined) => {
        let temp = roles.map((role) => {
            if (checkedCode === role.code) {
                return { ...role, checked: !role.checked };
            }
            return role;
        });
        setRoles(temp);
    }

    const register = () => {
        console.log(roles);
        // collect selected roles codes
        const selectedRoles = roles.filter(role => role.checked);
        fetch(environment.apiUrl + 'users', {
            method: 'POST',
            headers: environment.headers,
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                roles: selectedRoles
            })
        })
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(environment.apiUrl + 'roles', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: RolesResponseModel) => {
                        // @ts-ignore
                        setRoles(data.data);
                    })
            }
        });
    }, []))

    return (
        <View style={moduleStyles.container}>
            <Location location={`users > add `}/>
            <ModuleNavigation elements={[
                {text: 'Users list', url: 'User'}
            ]} />
            <View style={moduleStyles.box}>
                <Text style={moduleStyles.header}>Add new user</Text>
                <TextInput
                    label="Email"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                    value={email}
                    onChangeText={setEmail}
                    autoCorrect={false}
                />
                <Text style={moduleStyles.info}>Type your email here</Text>
                <TextInput
                    label="First Name"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoCorrect={false}
                />
                <Text style={moduleStyles.info}>Type your first name here</Text>
                <TextInput
                    label="Last Name"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                    value={lastName}
                    onChangeText={setLastName}
                    autoCorrect={false}
                />
                <Text style={moduleStyles.info}>Type your last name here</Text>
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                    value={password}
                    onChangeText={setPassword}
                    autoCorrect={false}
                />
                <Text style={moduleStyles.info}>Type your password here</Text>
                <Text style={styles.text}>Select roles:</Text>
                <View style={styles.checkboxView}>
                {
                    roles.map(role =>
                        <View key={role.code + 'v'} style={styles.checkbox}>
                        <Checkbox
                            key={role.code}
                            color={'orange'}
                            status={role.checked ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck(role.code)}
                            />
                            <Text>{role.name}</Text>
                        </View>
                    )
                }
                </View>
                <Button
                    mode="contained"
                    style={moduleStyles.btn}
                    onPress={register}>
                    Register
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
    text: {
        marginTop: '2vh',
        marginBottom: '2vh',
        fontSize: 18,
    },
    checkboxView: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkbox: {
        display: "flex",
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%',
    }
})
