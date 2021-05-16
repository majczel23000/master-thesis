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
import { DictionaryModel } from "../models/dictionaries/Dictionary.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { DictionaryResponseModel } from "../models/dictionaries/DictionaryResponse.model";
import {DictionaryElementModel} from "../models/dictionaries/DictionaryElement.model";

export default function DictionaryDetailsScreen( route: { dictionary: DictionaryModel } ) {

    const [dictionary, setDictionary] = React.useState<DictionaryModel>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [name, setName] = React.useState<string>(route.dictionary.name || 'Name');
    const [description, setDescription] = React.useState<string>(route.dictionary.description || 'Description');
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
                fetch(`${environment.apiUrl}dictionaries/${route.dictionary._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((dictData: DictionaryResponseModel) => {
                        // @ts-ignore
                        setDictionary(dictData.data);
                        setName(dictData.data?.name as string);
                        setDescription(dictData.data?.description as string);
                        setIsLoading(false);
                    })
            }
        });
    }, [route.dictionary]))

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
                fetch(`${environment.apiUrl}dictionaries/${dictionary._id}`, {
                    method: 'PUT',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        dictionary: dictionary.dictionary
                    })
                })
                    .then(res => res.json())
                    .then((resUpdateData: DictionaryResponseModel) => {
                        setIsLoadingModifyBtn(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                            setDictionary(resUpdateData.data as DictionaryModel);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

    const remove = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}dictionaries/${dictionary._id}`, {
                    method: 'DELETE',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: DictionaryResponseModel) => {
                        setVisibleModalRemove(false);
                        navigation.navigate("Root", { screen: 'Dictionary' });
                    })
            }
        })
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = dictionary.status === 'INACTIVE' ? `${environment.apiUrl}dictionaries/${dictionary._id}/activate` : `${environment.apiUrl}dictionaries/${dictionary._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: DictionaryResponseModel) => {
                        setDictionary(resUpdateData.data as DictionaryModel);
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

    const addLanguage = () => {
        const tempDictionary: DictionaryModel = JSON.parse(JSON.stringify(dictionary));
        // @ts-ignore
        tempDictionary.dictionary.push({
            elements: [],
            language: 'Language'
        });
        setDictionary(tempDictionary);
    }

    const removeLanguage = (index: number) => {
        const tempDictionary: DictionaryModel = JSON.parse(JSON.stringify(dictionary));
        tempDictionary.dictionary?.splice(index, 1);
        setDictionary(tempDictionary);
        console.log(dictionary.dictionary);
    }

    const addLanguageElement = (index: number) => {
        const tempDictionary: DictionaryModel = JSON.parse(JSON.stringify(dictionary));
        // @ts-ignore
        tempDictionary.dictionary[index].elements.push({
            value: 'New Element'
        });
        setDictionary(tempDictionary);
    }

    const changeLanguageText = (index: number, text: string) => {
        const tempDictionary: DictionaryModel = JSON.parse(JSON.stringify(dictionary));
        // @ts-ignore
        tempDictionary.dictionary[index].language = text;
        setDictionary(tempDictionary);
    }

    const changeLanguageElementText = (parentIndex: number, elIndex: number, text: string) => {
        const tempDictionary: DictionaryModel = JSON.parse(JSON.stringify(dictionary));
        // @ts-ignore
        tempDictionary.dictionary[parentIndex].elements[elIndex].value = text;
        setDictionary(tempDictionary);
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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this dictionary?</Text>
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
                    <Text style={detailsStyles.modalTitle}>Remove dictionary</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to remove this dictionary?</Text>
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
                    <Location location={`dictionary > ${dictionary.code}`}/>
                    <ModuleNavigation elements={[
                        {text: 'Dictionaries list', url: 'Dictionary'},
                        {text: 'Add new dictionary', url: 'DictionaryAdd'}
                    ]} />
                    {
                        !isLoading ? <View style={moduleStyles.box}>
                            <Text style={moduleStyles.header}>Dictionary: {dictionary.code}</Text>
                            <Text style={detailsStyles.label}>Code:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={dictionary.code}
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
                                value={dictionary.createdAt || 'data utworzenia'}
                            />
                            <Text style={detailsStyles.label}>Updated At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={dictionary.updatedAt || 'data modyfikacji'}
                            />
                            <Text style={detailsStyles.label}>Status:</Text>
                            <Button color={dictionary.status === 'ACTIVE' ? 'green' : 'red'}
                                    labelStyle={detailsStyles.status}
                                    onPress={showModal}>{dictionary.status || 'UNKNOW'}</Button>
                            <Text style={detailsStyles.label}>Languages:</Text>
                            <Button
                                mode="contained"
                                style={moduleStyles.btn}
                                onPress={addLanguage}
                            >Add language</Button>
                            {
                                // @ts-ignore
                                dictionary.dictionary.map((element, j) =>
                                        // @ts-ignore
                                        <View key={`${element.language}${j}`}>
                                            <Text style={detailsStyles.label}>Language {
                                                // @ts-ignore
                                                dictionary.dictionary.indexOf(element)
                                            }:</Text>
                                            <TextInput
                                                style={detailsStyles.input}
                                                underlineColor={'#DB995A'}
                                                selectionColor={'#DB995A'}
                                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                                value={element.language}
                                                // @ts-ignore
                                                onChangeText={(text) => changeLanguageText(dictionary.dictionary.indexOf(element), text)}
                                            />
                                            <Button
                                                mode="contained"
                                                style={moduleStyles.btnRemove}
                                                onPress={() => {
                                                    // @ts-ignore
                                                    removeLanguage(dictionary.dictionary.indexOf(element))
                                                }}
                                            >-</Button>
                                            <Button
                                                mode="contained"
                                                style={moduleStyles.btn}
                                                onPress={() => {
                                                    // @ts-ignore
                                                    addLanguageElement(dictionary.dictionary.indexOf(element))
                                                }}
                                            >+</Button>
                                            {
                                                // @ts-ignore
                                                element.elements.map((el, i) => {
                                                    return (
                                                        <TextInput
                                                            // @ts-ignore
                                                            key={`${el.value}${i}`}
                                                            style={detailsStyles.input}
                                                            underlineColor={'#DB995A'}
                                                            selectionColor={'#DB995A'}
                                                            theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                                            value={el.value}
                                                            // @ts-ignore
                                                            onChangeText={(text) => changeLanguageElementText(dictionary.dictionary.indexOf(element), dictionary.dictionary[dictionary.dictionary.indexOf(element)].elements.indexOf(el), text)}
                                                        />
                                                    )
                                                }

                                                )
                                            }
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
                                Remove dictionary
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
