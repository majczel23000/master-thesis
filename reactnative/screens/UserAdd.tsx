import * as React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { TextInput, Checkbox, Button, Snackbar, ActivityIndicator } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { RolesResponseModel } from "../models/roles/RolesResponse.model";
import { RoleModel } from "../models/roles/Role.model";
import { UserResponseModel } from "../models/users/UserResponse.model";
let { vh } = require('react-native-viewport-units');

export default function UserAddScreen() {
    const [roles, setRoles] = React.useState<RoleModel[]>([]);
    const [email, setEmail] = React.useState<string>('');
    const [firstName, setFirstName] = React.useState<string>('');
    const [lastName, setLastName] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');
    const [error, setError] = useState<string | undefined>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string | undefined>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [areRolesLoading, setAreRolesLoading] = React.useState<boolean>(true);
    const [isLoadingBtn, setIsLoadingBtn] = React.useState<boolean>(false);

    const onDismissSnackBar = () => setVisibleSnackbar(false);

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
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!firstName.length || !lastName.length || !email.length || !password.length) return;
        const rolesNames: string[] = [];
        roles.filter(role => role.checked).forEach(role => {
            if (role.code != null) {
                rolesNames.push(role.code);
            }
        });
        setIsLoadingBtn(true);
        fetch(environment.apiUrl + 'users', {
            method: 'POST',
            headers: environment.headers,
            body: JSON.stringify({
                email: email,
                password: password,
                firstName: firstName,
                lastName: lastName,
                roles: rolesNames
            })
        })
            .then(res => res.json())
            .then((data: UserResponseModel) => {
                setIsLoadingBtn(false);
                if (parseInt(data.code as string) !== 200) {
                    setError(data.message);
                } else {
                    setSnackbarMsg(data.message);
                }
                setVisibleSnackbar(true);
            })
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        setAreRolesLoading(true);
        setVisibleSnackbar(false);
        setSnackbarMsg('');
        setError('');
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
                        setAreRolesLoading(false);
                    })
            }
        });
    }, []))

    return (
        <ScrollView>
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
                        error={submitted && !email.length}
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
                        error={submitted && !firstName.length}
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
                        error={submitted && !lastName.length}
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
                        error={submitted && !password.length}
                    />
                    <Text style={moduleStyles.info}>Type your password here</Text>
                    <Text style={styles.text}>Select roles:</Text>
                    {
                        !areRolesLoading ? <View style={styles.checkboxView}>
                            {
                                roles.map(role =>
                                    <View key={role.code + 'v'} style={styles.checkbox}>
                                        <Checkbox
                                            key={role.code}
                                            color={'orange'}
                                            uncheckedColor={'gray'}
                                            status={role.checked ? 'checked' : 'unchecked'}
                                            onPress={() => handleCheck(role.code)}
                                        />
                                        <Text>{role.name}</Text>
                                    </View>
                                )
                            }
                        </View> : <View>
                            <ActivityIndicator animating={areRolesLoading} color={'orange'} size={100}/>
                        </View>
                    }
                    <Button
                        mode="contained"
                        style={moduleStyles.btn}
                        onPress={register}
                        loading={isLoadingBtn}>
                        Register
                    </Button>
                </View>
                <Snackbar
                    visible={visibleSnackbar}
                    style={error?.length ? moduleStyles.snackbarError : snackbarMsg?.length ? moduleStyles.snackbarMsg : null }
                    onDismiss={onDismissSnackBar}
                    duration={3000}>
                    {error?.length ? error : snackbarMsg?.length ? snackbarMsg : ''}
                </Snackbar>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    text: {
        marginTop: 2*vh,
        marginBottom: 2*vh,
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
