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
import { FaqModel } from "../models/faqs/Faq.model";
import { FaqResponseModel } from "../models/faqs/FaqResponse.model";

export default function FaqDetailsScreen( route: { faq: FaqModel } ) {



    const [faq, setFaq] = React.useState<FaqModel>({});
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [name, setName] = React.useState<string>(route.faq.name || 'Name');
    const [description, setDescription] = React.useState<string>(route.faq.description || 'Description');
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
                fetch(`${environment.apiUrl}faqs/${route.faq._id}`, {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((faqData: FaqResponseModel) => {
                        // @ts-ignore
                        setFaq(faqData.data);
                        setName(faqData.data?.name as string);
                        setDescription(faqData.data?.description as string);
                        setIsLoading(false);
                    })
            }
        });
    }, [route.faq]))

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
                fetch(`${environment.apiUrl}faqs/${faq._id}`, {
                    method: 'PUT',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({
                        name: name,
                        description: description,
                        elements: faq.elements
                    })
                })
                    .then(res => res.json())
                    .then((resUpdateData: FaqResponseModel) => {
                        setIsLoadingModifyBtn(false);
                        if (parseInt(resUpdateData.code as string) !== 200) {
                            setError(resUpdateData.message as string);
                        } else {
                            setSnackbarMsg(resUpdateData.message as string);
                            setFaq(resUpdateData.data as FaqModel);
                        }
                        setVisibleSnackbar(true);
                    })
            }
        });
    }

    const remove = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(`${environment.apiUrl}faqs/${faq._id}`, {
                    method: 'DELETE',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: FaqResponseModel) => {
                        setVisibleModalRemove(false);
                        navigation.navigate("Root", { screen: 'Faq' });
                    })
            }
        })
    }

    const changeStatus = () => {
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                const url = faq.status === 'INACTIVE' ? `${environment.apiUrl}faqs/${faq._id}/activate` : `${environment.apiUrl}faqs/${faq._id}/deactivate`;
                fetch(url, {
                    method: 'POST',
                    headers: {
                        ...environment.headers,
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                    body: JSON.stringify({})
                })
                    .then(res => res.json())
                    .then((resUpdateData: FaqResponseModel) => {
                        setFaq(resUpdateData.data as FaqModel);
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

    const addQA = () => {
        const tempFaq: FaqModel = JSON.parse(JSON.stringify(faq));
        // @ts-ignore
        tempFaq.elements.push({
            question: 'Question',
            answear: 'Answear'
        });
        setFaq(tempFaq);
    }

    const removeQA = (index: number) => {
        const tempFaq: FaqModel = JSON.parse(JSON.stringify(faq));
        tempFaq.elements?.splice(index, 1);
        setFaq(tempFaq);
    }

    const addQAElement = (index: number) => {
        const tempFaq: FaqModel = JSON.parse(JSON.stringify(faq));
        // @ts-ignore
        tempFaq.elements[index].elements.push({
            question: 'New question',
            answear: 'New answear'
        });
        setFaq(tempFaq);
    }

    const changeQText = (index: number, text: string) => {
        const tempFaq: FaqModel = JSON.parse(JSON.stringify(faq));
        // @ts-ignore
        tempFaq.elements[index].question = text;
        setFaq(tempFaq);
    }

    const changeAText = (index: number, text: string) => {
        const tempFaq: FaqModel = JSON.parse(JSON.stringify(faq));
        // @ts-ignore
        tempFaq.elements[index].answear = text;
        setFaq(tempFaq);
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
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to change status of this faq?</Text>
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
                    <Text style={detailsStyles.modalTitle}>Remove faq</Text>
                    <Text style={detailsStyles.modalInfo}>Are you sure you want to remove this faq?</Text>
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
                    <Location location={`faq > ${faq.code}`}/>
                    <ModuleNavigation elements={[
                        {text: 'Faqs list', url: 'Faq'},
                        {text: 'Add new faq', url: 'FaqAdd'}
                    ]} />
                    {
                        !isLoading ? <View style={moduleStyles.box}>
                            <Text style={moduleStyles.header}>Faq: {faq.code}</Text>
                            <Text style={detailsStyles.label}>Code:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={faq.code}
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
                                value={faq.createdAt || 'data utworzenia'}
                            />
                            <Text style={detailsStyles.label}>Updated At:</Text>
                            <TextInput
                                style={detailsStyles.input}
                                underlineColor={'#DB995A'}
                                selectionColor={'#DB995A'}
                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                value={faq.updatedAt || 'data modyfikacji'}
                            />
                            <Text style={detailsStyles.label}>Status:</Text>
                            <Button color={faq.status === 'ACTIVE' ? 'green' : 'red'}
                                    labelStyle={detailsStyles.status}
                                    onPress={showModal}>{faq.status || 'UNKNOW'}</Button>
                            <Text style={detailsStyles.label}>Faqs:</Text>
                            <Button
                                mode="contained"
                                style={moduleStyles.btn}
                                onPress={addQA}
                            >Add Q and A</Button>
                            {
                                // @ts-ignore
                                faq.elements.map((element, j) =>
                                        // @ts-ignore
                                        <View key={`faq${j}`}>
                                            <Text style={detailsStyles.label}>QA {
                                                // @ts-ignore
                                                faq.elements.indexOf(element)
                                            }:</Text>
                                            <TextInput
                                                style={detailsStyles.input}
                                                underlineColor={'#DB995A'}
                                                selectionColor={'#DB995A'}
                                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                                value={element.question}
                                                // @ts-ignore
                                                onChangeText={(text) => changeQText(faq.elements.indexOf(element), text)}
                                            />
                                            <TextInput
                                                style={detailsStyles.input}
                                                underlineColor={'#DB995A'}
                                                selectionColor={'#DB995A'}
                                                theme={{colors: {primary: '#DB995A', text: 'black'}}}
                                                value={element.answear}
                                                // @ts-ignore
                                                onChangeText={(text) => changeAText(faq.elements.indexOf(element), text)}
                                            />

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
                                Remove faq
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
