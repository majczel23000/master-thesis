import * as React from 'react';
import { ScrollView, Text, View} from 'react-native';
import { useCallback, useEffect, useState } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import {Modal, Portal, Button, Provider, TextInput, ActivityIndicator, Snackbar} from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import { SettingModel } from "../models/settings/Setting.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { SettingResponseModel } from "../models/settings/SettingResponse.model";




export default function SettingDetailsScreen( route: { setting: SettingModel } ) {

    const [setting, setSetting] = React.useState<SettingModel>({});
    const [name, setName] = React.useState<string>(route.setting.name || 'Name');
    const [description, setDescription] = React.useState<string>(route.setting.description || 'Description');
    const [type, setType] = React.useState<string>(route.setting.type || 'Type');
    const [value, setValue] = React.useState<string>(route.setting.value || 'Value');



    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [visibleModal, setVisibleModal] = React.useState<boolean>(false);
    const [visibleModalRemove, setVisibleModalRemove] = React.useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [snackbarMsg, setSnackbarMsg] = useState<string>('');
    const [visibleSnackbar, setVisibleSnackbar] = React.useState<boolean>(false);
    const [isLoadingModifyBtn, setIsLoadingModifyBtn] = React.useState<boolean>(false);
    const [submitted, setSubmitted] = useState<boolean>(false);

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
                fetch(`${environment.apiUrl}settings/${route.setting._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((settingData: SettingResponseModel) => {
                        console.log(settingData);
                        // @ts-ignore
                        setSetting(settingData.data);
                        // @ts-ignore
                        setType(settingData.data.type);
                        // @ts-ignore
                        setValue(settingData.data.value);
                        // @ts-ignore
                        setName(settingData.data.name);
                        // @ts-ignore
                        setDescription(settingData.data.description);
                        setIsLoading(false);
                    })
            }
        });
    }, [route.setting]));

    // Modal logic
    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const showModalRemove = () => setVisibleModalRemove(true);
    const hideModalRemove = () => setVisibleModalRemove(false);
    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const save = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!name.length || !description.length || !type.length || !value.length) return;
        setIsLoadingModifyBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}settings/${setting._id}`, {
                    method: 'PUT',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        value: value,
                        type: type,
                    })
                })
                    .then(res => res.json())
                    .then((resUpdateData: SettingResponseModel) => {
                        setIsLoadingModifyBtn(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                            setSetting(resUpdateData.data as SettingModel);
                            // @ts-ignore
                            setType(resUpdateData.data.type);
                            // @ts-ignore
                            setValue(resUpdateData.data.value);
                            // @ts-ignore
                            setName(resUpdateData.data.name);
                            // @ts-ignore
                            setDescription(resUpdateData.data.description);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

    const remove = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}settings/${setting._id}`, {
                    method: 'DELETE',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: SettingResponseModel) => {
                        setVisibleModalRemove(false);
                        navigation.navigate("Root", { screen: 'Setting' });
                    })
            }
        })
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = setting.status === 'INACTIVE' ? `${environment.apiUrl}settings/${setting._id}/activate` : `${environment.apiUrl}settings/${setting._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: SettingResponseModel) => {
                        setSetting(resUpdateData.data as SettingModel);
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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this setting?</Text>
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
                    <Text style={detailsStyles.modalTitle}>Remove setting</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to remove this setting?</Text>
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
                <ScrollView>
                    <View style={moduleStyles.container}>
                        <Location location={`settings > ${setting.code}`}/>
                        <ModuleNavigation elements={[
                            {text: 'Settings list', url: 'Setting'},
                            {text: 'Add new setting', url: 'SettingAdd'}
                        ]} />
                        {
                           !isLoading ? <View style={moduleStyles.box}>
                                <Text style={moduleStyles.header}>Setting: {setting.name}</Text>
                                <Text style={detailsStyles.label}>Code:</Text>
                                <TextInput
                                    style={detailsStyles.input}
                                    underlineColor={'#DB995A'}
                                    selectionColor={'#DB995A'}
                                    theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                    value={setting.code}
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
                                <Text style={detailsStyles.label}>Type:</Text>
                                <TextInput
                                    style={detailsStyles.input}
                                    underlineColor={'#DB995A'}
                                    selectionColor={'#DB995A'}
                                    theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                    value={type}
                                    onChangeText={setType}
                                    error={submitted && !type.length}

                                />
                                <Text style={detailsStyles.label}>Value:</Text>
                                <TextInput
                                    style={detailsStyles.input}
                                    underlineColor={'#DB995A'}
                                    selectionColor={'#DB995A'}
                                    theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                    value={value}
                                    onChangeText={setValue}
                                    error={submitted && !value.length}

                                />
                                <Text style={detailsStyles.label}>Created At:</Text>
                                <TextInput
                                    style={detailsStyles.input}
                                    underlineColor={'#DB995A'}
                                    selectionColor={'#DB995A'}
                                    theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                    value={setting.createdAt || 'data utworzenia'}
                                />
                                <Text style={detailsStyles.label}>Updated At:</Text>
                                <TextInput
                                    style={detailsStyles.input}
                                    underlineColor={'#DB995A'}
                                    selectionColor={'#DB995A'}
                                    theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                    value={setting.updatedAt || 'data modyfikacji'}
                                />
                                <Text style={detailsStyles.label}>Status:</Text>
                                <Button color={setting.status === 'ACTIVE' ? 'green' : 'red'}
                                        labelStyle={detailsStyles.status}
                                        onPress={showModal}>{setting.status || 'UNKNOW'}</Button>
                                <Button
                                    mode="contained"
                                    style={moduleStyles.btnRemove}
                                    onPress={remove}>
                                    Remove setting
                                </Button>
                               <Button
                                   mode="contained"
                                   style={moduleStyles.btn}
                                   onPress={save}
                                   loading={isLoadingModifyBtn}>
                                   Save changes
                               </Button>

                        </View>: <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
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
