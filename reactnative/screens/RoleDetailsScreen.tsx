import * as React from 'react';
import {ScrollView, Text, View} from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { Modal, Portal, Button, Provider, TextInput, Snackbar, ActivityIndicator } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { RoleModel } from "../models/roles/Role.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { RoleResponseModel } from "../models/roles/RoleResponse.model";



export default function RoleDetailsScreen( route: { role: RoleModel } ) {

    const [role, setRole] = React.useState<RoleModel>({});
    const [name, setName] = React.useState<string>(route.role.name || 'Name');
    const [description, setDescription] = React.useState<string>(route.role.description || 'Description');

    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
    const [visibleModalRemove, setVisibleModalRemove] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [isLoadingModifyBtn, setIsLoadingModifyBtn] = React.useState<boolean>(false);


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
                fetch(`${environment.apiUrl}roles/${route.role._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((roleData: RoleResponseModel) => {
                        // @ts-ignore
                        setRole(roleData.data);
                        setName(roleData.data?.name as string);
                        setDescription(roleData.data?.description as string);
                    })
                setIsLoading(false);
            }
        });
    }, [route.role]))

    const navigation = useNavigation();

    const save = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!name.length || !description.length) return;

        setIsLoadingModifyBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}roles/${role._id}`, {
                    method: 'PUT',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                    })
                })
                    .then(res => res.json())
                    .then((resUpdateData: RoleResponseModel) => {
                        setIsLoadingModifyBtn(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                        }
                        setRole(resUpdateData.data as RoleModel);
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = role.status === 'INACTIVE' ? `${environment.apiUrl}roles/${role._id}/activate`
                    : `${environment.apiUrl}roles/${role._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({code: role.code})
                })
                    .then(res => res.json())
                    .then((resUpdateData: RoleResponseModel) => {
                        const tempRole = role;
                        tempRole.status = role.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
                        setRole(tempRole);
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
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const showModalRemove = () => setVisibleModalRemove(true);
    const hideModalRemove = () => setVisibleModalRemove(false);
    const onDismissSnackBar = () => setVisibleSnackbar(false);

    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Change Status</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this role?</Text>
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
            <ScrollView >
                <View style={moduleStyles.container}>
                    <Location location={`roles > ${role.code}`}/>
                    <ModuleNavigation elements={[
                        {text: 'Roles list', url: 'Role'}
                    ]} />
                    {
                        !isLoading ? <View style={moduleStyles.box}>
                        <Text style={moduleStyles.header}>Role: {role.code}</Text>
                        <Text style={detailsStyles.label}>Code: </Text>
                        <TextInput
                            style={detailsStyles.input}
                            underlineColor={'#DB995A'}
                            selectionColor={'#DB995A'}
                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                            value={role.code}
                        />
                        <Text style={detailsStyles.label}>Name:</Text>
                        <TextInput
                            style={detailsStyles.input}
                            underlineColor={'#DB995A'}
                            selectionColor={'#DB995A'}
                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                            value={name}
                            onChangeText={setName}
                            error={submitted && !name.length}
                        />
                        <Text style={detailsStyles.label}>Description:</Text>
                        <TextInput
                            style={detailsStyles.input}
                            underlineColor={'#DB995A'}
                            selectionColor={'#DB995A'}
                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                            value={description}
                            onChangeText={setDescription}
                            error={submitted && !description.length}
                        />
                        <Text style={detailsStyles.label}>Created At:</Text>
                        <TextInput
                            style={detailsStyles.input}
                            underlineColor={'#DB995A'}
                            selectionColor={'#DB995A'}
                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                            value={role.createdAt || 'data utworzenia'}
                        />
                        <Text style={detailsStyles.label}>Status:</Text>
                        <Button color={role.status === 'ACTIVE' ? 'green' : 'red'}
                                labelStyle={detailsStyles.status}
                                onPress={showModal}>{role.status || 'UNKNOW'}</Button>
                        <Button
                            mode="contained"
                            style={moduleStyles.btn}
                            onPress={save}>
                            Save changes
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
