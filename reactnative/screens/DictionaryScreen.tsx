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
import { DictionaryModel } from "../models/dictionaries/Dictionary.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { DictionaryListResponseModel } from "../models/dictionaries/DictionaryListResponse.model";

export default function DictionaryScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [dictionaries, setDictionaries] = React.useState<DictionaryModel[]>([]);
    const [filteredDictionaries, setFilteredDictionaries] = React.useState<DictionaryModel[]>([]);
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
                fetch(environment.apiUrl + 'dictionaries', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: DictionaryListResponseModel) => {
                        // @ts-ignore
                        setDictionaries(data.data);
                        // @ts-ignore
                        setFilteredDictionaries(data.data);
                        setIsLoading(false);
                    })
            }
        });
    }, []))

    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempDict = dictionaries.filter(dictionary => {
            return dictionary.code?.toUpperCase().includes(text.toUpperCase()) || dictionary.status?.toUpperCase().includes(text.toUpperCase());
        });
        setFilteredDictionaries(tempDict);
    }

    const goToDetails = (dict: DictionaryModel) => {
        navigation.navigate("Root", { screen: 'DictionaryDetails', params: { dictionary: dict }})
    }

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <ScrollView>
            <View style={moduleStyles.container}>
                <Location location={'dictionary'}/>
                <ModuleNavigation elements={[
                    {text: 'Add new dictionary', url: 'DictionaryAdd'}
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
                            <DataTable.Title>Status</DataTable.Title>
                        </DataTable.Header>

                        {
                            filteredDictionaries.slice(from, to).map(dictionary =>
                                <DataTable.Row key={dictionary.code} onPress={() => goToDetails(dictionary)}>
                                    <DataTable.Cell>{dictionary.code}</DataTable.Cell>
                                    <DataTable.Cell>{dictionary.status}</DataTable.Cell>
                                </DataTable.Row>
                            )
                        }

                        <DataTable.Pagination
                            page={page}
                            numberOfPages={Math.ceil(filteredDictionaries.length / itemsPerPage)}
                            onPageChange={page => setPage(page)}
                            label={`${from + 1}-${page + 1 === Math.ceil(filteredDictionaries.length / itemsPerPage) ? filteredDictionaries.length : to} of ${filteredDictionaries.length}`}
                        />
                    </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
                }
            </View>
        </ScrollView>
    );
}
