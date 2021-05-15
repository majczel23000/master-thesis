import * as React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { UserModel } from "../models/users/User.model";
import { Modal, Portal, Button, Provider, Checkbox, TextInput, ActivityIndicator, Snackbar } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { RoleModel } from "../models/roles/Role.model";
import { RolesResponseModel } from "../models/roles/RolesResponse.model";
import { UserResponseModel } from "../models/users/UserResponse.model";
let { vh } = require('react-native-viewport-units');

export default function UserDetailsScreen( route: { user: UserModel } ) {

    const [user, setUser] = React.useState<UserModel>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [roles, setRoles] = React.useState<RoleModel[]>([]);
    const [firstName, setFirstName] = React.useState<string>(route.user.firstName || 'Imie');
    const [lastName, setLastName] = React.useState<string>(route.user.lastName || 'Nazwisko');
    const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
    const [visibleModalRemove, setVisibleModalRemove] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [isLoadingModifyBtn, setIsLoadingModifyBtn] = React.useState<boolean>(false);

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        setVisibleSnackbar(false);
        setSnackbarMsg('');
        setError('');
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}users/${route.user._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((userData: UserResponseModel) => {
                        const tempRoles: RoleModel[] = [];
                        // @ts-ignore
                        setUser(userData.data);
                        setRoles(tempRoles);
                        setFirstName(userData.data?.firstName as string);
                        setLastName(userData.data?.lastName as string);

                        fetch(environment.apiUrl + 'roles', {
                            headers: {
                                Accept: 'application/json',
                                "Authorization": `Bearer ${JSON.parse(result)}`
                            },
                        })
                            .then(res => res.json())
                            .then((roleData: RolesResponseModel) => {
                                // @ts-ignore
                                roleData.data?.forEach(role => {
                                   // @ts-ignore
                                    role.checked = userData.data.roles.includes(role.code);
                                });
                                // @ts-ignore
                                setRoles(roleData.data);
                                setIsLoading(false);
                            })
                    })
            }
        });
    }, [route.user]))

    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const showModalRemove = () => setVisibleModalRemove(true);
    const hideModalRemove = () => setVisibleModalRemove(false);
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

    const save = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!firstName.length || !lastName.length) return;
        const rolesNames: string[] = [];
        roles.filter(role => role.checked).forEach(role => {
            if (role.code != null) {
                rolesNames.push(role.code);
            }
        });
        setIsLoadingModifyBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}users/${user._id}`, {
                    method: 'PUT',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        firstName: firstName,
                        lastName: lastName,
                        roles: rolesNames,
                        password: user.password,
                    })
                })
                    .then(res => res.json())
                    .then((resUpdateData: UserResponseModel) => {
                        setIsLoadingModifyBtn(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                        }
                        setUser(resUpdateData.data as UserModel);
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

    const remove = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}users/${user._id}`, {
                    method: 'DELETE',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: UserResponseModel) => {
                        setVisibleModalRemove(false);
                        navigation.navigate("Root", { screen: 'User' });
                    })
            }
        })
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = user.status === 'INACTIVE' ? `${environment.apiUrl}users/${user._id}/activate` : `${environment.apiUrl}users/${user._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: UserResponseModel) => {
                        const tempUser = user;
                        tempUser.status = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                        setUser(tempUser);
                        setVisibleModal(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        })
    }

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Change Status</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this user?</Text>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnYes}
                        onPress={changeStatus}>
                        Yes
                    </Button>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnNo}
                        onPress={hideModal}>
                        No
                    </Button>
                </Modal>
            </Portal>
            <Portal>
                <Modal
                    visible={visibleModalRemove}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Remove user</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to remove this user?</Text>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnYes}
                        onPress={remove}>
                        Yes
                    </Button>
                    <Button
                        mode="contained"
                        style={detailsStyles.btnNo}
                        onPress={hideModalRemove}>
                        No
                    </Button>
                </Modal>
            </Portal>
            <ScrollView >
                <View style={moduleStyles.container}>
                    <Location location={`users > ${user.email}`}/>
                    <ModuleNavigation elements={[
                        {text: 'Users list', url: 'User'},
                        {text: 'Add new user', url: 'UserAdd'}
                    ]} />
                    {
                        !isLoading ? <View style={moduleStyles.box}>
                            <Text style={moduleStyles.header}>User: {user.email}</Text>
                            <Text style={detailsStyles.label}>First Name:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={firstName}
                                onChangeText={setFirstName}
                                error={submitted && !firstName.length}
                            />
                            <Text style={detailsStyles.label}>Last Name:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={lastName}
                                onChangeText={setLastName}
                                error={submitted && !lastName.length}
                            />
                            <Text style={detailsStyles.label}>Email:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={user.email}
                            />
                            <Text style={detailsStyles.label}>Created At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={user.createdAt || 'data utworzenia'}
                            />
                            <Text style={detailsStyles.label}>Updated At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={user.updatedAt || 'data modyfikacji'}
                            />
                            <Text style={detailsStyles.label}>Status:</Text>
                            <Button color={user.status === 'ACTIVE' ? 'green' : 'red'}
                                    labelStyle={detailsStyles.status}
                                    onPress={showModal}>{user.status || 'UNKNOW'}</Button>
                            <Text style={detailsStyles.label}>Roles:</Text>
                            <View style={styles.checkboxView}>
                                {
                                    roles.map(role =>
                                        <View key={role.code} style={styles.checkbox}>
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
                            </View>
                            <Button
                                mode="contained"
                                style={moduleStyles.btn}
                                onPress={save}
                                loading={isLoadingModifyBtn}>
                                Save changes
                            </Button>
                            <Button
                                mode="contained"
                                style={moduleStyles.btnRemove}
                                onPress={showModalRemove}>
                                Remove user
                            </Button>
                        </View> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
                    }
                    <Snackbar
                        visible={visibleSnackbar}
                        style={error?.length ? moduleStyles.snackbarError : snackbarMsg?.length ? moduleStyles.snackbarMsg : null }
                        onDismiss={onDismissSnackBar}
                        duration={3000}>
                        {error?.length ? error : snackbarMsg?.length ? snackbarMsg : ''}
                    </Snackbar>
                </View>
            </ScrollView>
        </Provider>
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
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%',
    }
})
