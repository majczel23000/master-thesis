import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { useCallback, useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import {FaqListResponseModel} from "../models/faqs/FaqListResponse.model";
import {FaqModel} from "../models/faqs/Faq.model";

export default function FaqsScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [faq, setFaq] = React.useState<FaqModel[]>([]);
    const [filteredFaqs, setFilteredFaqs] = React.useState<FaqModel[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    useFocusEffect(useCallback(() => {
        setIsLoading(true);
        AsyncStorage.getItem(AsyncStorageKeysEnum.TOKEN).then(result => {
            if (result !== null) {
                fetch(environment.apiUrl + 'faqs', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: FaqListResponseModel) => {
                        // @ts-ignore
                        setFaq(data.data);
                        // @ts-ignore
                        setFilteredFaqs(data.data);
                        setIsLoading(false);
                    })
            }
        });
    }, []))

    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempFaqs = faq.filter(faq => {
            return faq.code?.toUpperCase().includes(text.toUpperCase()) || faq.status?.toUpperCase().includes(text.toUpperCase());
        });
        setFilteredFaqs(tempFaqs);
    }

    const goToDetails = (faq: FaqModel) => {
        navigation.navigate("Root", { screen: 'FaqDetails', params: { faq: faq }})
    }

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <ScrollView>
            <View style={moduleStyles.container}>
                <Location location={'faq'}/>
                <ModuleNavigation elements={[
                    {text: 'Add new faq', url: 'FaqAdd'}
                ]} />
                <Searchbar
                    placeholder="Filter"
                    onChangeText={(text) => applyFilter(text)}
                    style={moduleStyles.filter}
                    inputStyle={moduleStyles.filterText}
                    value={searchQuery}
                />
                {
                    !isLoading ? <DataTable style={moduleStyles.box}>
                        <DataTable.Header>
                            <DataTable.Title>Code</DataTable.Title>
                            <DataTable.Title>Name</DataTable.Title>
                        </DataTable.Header>

                        {
                            filteredFaqs.slice(from, to).map(faq =>
                                <DataTable.Row key={faq.code} onPress={() => goToDetails(faq)}>
                                    <DataTable.Cell>{faq.code}</DataTable.Cell>
                                    <DataTable.Cell>{faq.name}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        }

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(filteredFaqs.length / itemsPerPage)}
                            onPageChange={page => setPage(page)}
                            label={`${from + 1}-${page + 1 === Math.ceil(filteredFaqs.length / itemsPerPage) ? filteredFaqs.length : to} of ${filteredFaqs.length}`}
                        />
                    </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
                }
            </View>
        </ScrollView>
    );
}
