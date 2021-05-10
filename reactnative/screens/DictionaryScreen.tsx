import * as React from 'react';
import { View } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable } from 'react-native-paper';

import { DictionaryModel } from "../models/Dictionary.model";

export default function DictionaryScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => setSearchQuery(query);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const dictionaries: DictionaryModel[] = [
        {
            code: 'dictionary1',
            description: 'asdasd',
            name: 'dictionary 1',
            status: 'ACTIVE',
            languages: 'cos',
        },
        {
            code: 'dictionary2',
            description: 'xcvxcfggh',
            name: 'dictionary 2',
            status: 'ACTIVE',
            languages: 'cos2',
        },
        {
            code: 'dictionary3',
            description: 'jhhhhh',
            name: 'dictionary 3',
            status: 'ACTIVE',
            languages: 'cos3',
        }
    ];

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'dictionary'}/>
            <ModuleNavigation elements={[
                {text: 'Add new dictionary', url: 'DictionaryAdd'}
            ]} />
            <Searchbar
                placeholder="Filter"
                onChangeText={onChangeSearch}
                style={moduleStyles.filter}
                inputStyle={moduleStyles.filterText}
                value={searchQuery}
            />
            <DataTable style={moduleStyles.box}>
                <DataTable.Header>
                    <DataTable.Title>Code</DataTable.Title>
                    <DataTable.Title>Name</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                </DataTable.Header>

                {
                    dictionaries.slice(from, to).map(dictionary =>
                        <DataTable.Row key={dictionary.code} onPress={() => navigation.navigate("Root", { screen: 'DictionaryDetails', params: { dictionary: dictionary }})}>
                            <DataTable.Cell>{dictionary.code}</DataTable.Cell>
                            <DataTable.Cell>{dictionary.name}</DataTable.Cell>
                            <DataTable.Cell>{dictionary.status}</DataTable.Cell>
                        </DataTable.Row>
                    )
                }

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.floor(dictionaries.length / itemsPerPage)}
                    onPageChange={page => setPage(page)}
                    label={`${from + 1}-${to} of ${dictionaries.length}`}
                />
            </DataTable>
        </View>
    );
}
