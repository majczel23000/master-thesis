import * as React from 'react';
import { useCallback, useState } from 'react';
import { Text, View, ScrollView} from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { Modal, Portal, Button, Provider, TextInput, ActivityIndicator, Snackbar } from "react-native-paper";
import detailsStyles from "../styles/detailsStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { MenuModel } from "../models/menu/Menu.model";
import { MenuResponseModel } from "../models/menu/MenuResponse.model";

export default function MenuDetailsScreen( route: { menu: MenuModel } ) {

    const [menu, setMenu] = React.useState<MenuModel>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [name, setName] = React.useState<string>(route.menu.name || 'Name');
    const [description, setDescription] = React.useState<string>(route.menu.description || 'Description');
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
                fetch(`${environment.apiUrl}menus/${route.menu._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((menuData: MenuResponseModel) => {
                        // @ts-ignore
                        setMenu(menuData.data);
                        setName(menuData.data?.name as string);
                        setDescription(menuData.data?.description as string);
                        setIsLoading(false);
                    })
            }
        });
    }, [route.menu]))

    const showModal = () => setVisibleModal(true);
    const hideModal = () => setVisibleModal(false);
    const showModalRemove = () => setVisibleModalRemove(true);
    const hideModalRemove = () => setVisibleModalRemove(false);
    const onDismissSnackBar = () => setVisibleSnackbar(false);

    const save = () => {
        setSubmitted(true);
        setError('');
        setSnackbarMsg('');
        if (!name.length || !description.length) return;
        setIsLoadingModifyBtn(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}menus/${menu._id}`, {
                    method: 'PUT',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        elements: menu.elements,
                    })
                })
                    .then(res => res.json())
                    .then((resUpdateData: MenuResponseModel) => {
                        setIsLoadingModifyBtn(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                            setMenu(resUpdateData.data as MenuModel);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

    const remove = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}menus/${menu._id}`, {
                    method: 'DELETE',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: MenuResponseModel) => {
                        setVisibleModalRemove(false);
                        navigation.navigate("Root", { screen: 'Menu' });
                    })
            }
        })
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = menu.status === 'INACTIVE' ? `${environment.apiUrl}menus/${menu._id}/activate` : `${environment.apiUrl}menus/${menu._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: MenuResponseModel) => {
                        setMenu(resUpdateData.data as MenuModel);
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

    const addElement = () => {
        const tempMenus: MenuModel = JSON.parse(JSON.stringify(menu));
        // @ts-ignore
        tempMenus.elements.push({
            text: 'Label',
            url: 'Url'
        });
        setMenu(tempMenus);
    }

    const removeElement = (index: number) => {
        const tempMenus: MenuModel = JSON.parse(JSON.stringify(menu));
        tempMenus.elements?.splice(index, 1);
        setMenu(tempMenus);
    }

    const changeElementText = (index: number, text: string) => {
        const tempMenus: MenuModel = JSON.parse(JSON.stringify(menu));
        // @ts-ignore
        tempMenus.elements[index].text = text;
        setMenu(tempMenus);
    }

    const changeElementUrl = (index: number, text: string) => {
        const tempMenus: MenuModel = JSON.parse(JSON.stringify(menu));
        // @ts-ignore
        tempMenus.elements[index].url = text;
        setMenu(tempMenus);
    }

    // @ts-ignore
    return (
        <Provider>
            <Portal>
                <Modal
                    visible={visibleModal}
                    onDismiss={hideModal}
                    contentContainerStyle={detailsStyles.modal}>
                    <Text style={detailsStyles.modalTitle}>Change Status</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this menu?</Text>
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
                    <Text style={detailsStyles.modalTitle}>Remove menu</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to remove this menu?</Text>
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
                    <Location location={`menu > ${menu.code}`}/>
                    <ModuleNavigation elements={[
                        {text: 'Menus list', url: 'Menu'},
                        {text: 'Add new menu', url: 'MenuAdd'}
                    ]} />
                    {
                        !isLoading ? <View style={moduleStyles.box}>
                            <Text style={moduleStyles.header}>Menu: {menu.code}</Text>
                            <Text style={detailsStyles.label}>Code:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={menu.code}
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
                                value={menu.createdAt || 'data utworzenia'}
                            />
                            <Text style={detailsStyles.label}>Updated At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={menu.updatedAt || 'data modyfikacji'}
                            />
                            <Text style={detailsStyles.label}>Status:</Text>
                            <Button color={menu.status === 'ACTIVE' ? 'green' : 'red'}
                                    labelStyle={detailsStyles.status}
                                    onPress={showModal}>{menu.status || 'UNKNOW'}</Button>
                            <Text style={detailsStyles.label}>Navigation:</Text>
                            <Button
                                mode="contained"
                                style={moduleStyles.btn}
                                onPress={addElement}
                            >Add element</Button>
                            {
                                // @ts-ignore
                                menu.elements.map((element, j) =>
                                    // @ts-ignore
                                    <View key={`el${j}`}>
                                        <Text style={detailsStyles.label}>Text {
                                            // @ts-ignore
                                            menu.elements.indexOf(element)
                                        }:</Text>
                                        <TextInput
                                            style={detailsStyles.input}
                                            underlineColor={'#DB995A'}
                                            selectionColor={'#DB995A'}
                                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                            value={element.text}
                                            // @ts-ignore
                                            onChangeText={(text) => changeElementText(menu.elements.indexOf(element), text)}
                                        />
                                        <Text style={detailsStyles.label}>Url {
                                            // @ts-ignore
                                            menu.elements.indexOf(element)
                                        }:</Text>
                                        <TextInput
                                            style={detailsStyles.input}
                                            underlineColor={'#DB995A'}
                                            selectionColor={'#DB995A'}
                                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                            value={element.url}
                                            // @ts-ignore
                                            onChangeText={(text) => changeElementUrl(menu.elements.indexOf(element), text)}
                                        />
                                        <Button
                                            mode="contained"
                                            style={moduleStyles.btnRemove}
                                            onPress={() => {
                                                // @ts-ignore
                                                removeElement(menu.elements.indexOf(element))
                                            }}
                                        >-</Button>
                                    </View>
                                )
                            }
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
                                Remove menu
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
