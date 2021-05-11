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
import { SettingModel } from "../models/Setting.model";

export default function SettingScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const onChangeSearch = (query: any) => setSearchQuery(query);

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    const settings: SettingModel[] = [
        {
           code: 'setting1',
            description: 'asdasd',
            name: 'setting 1',
            status: 'ACTIVE',
            type: 'number',
            value: '1',
        },
        {
            code: 'setting2',
            description: 'xcvxcfggh',
            name: 'setting 2',
            status: 'ACTIVE',
            type: 'string',
            value: 'alamakota',
        },
        {
            code: 'setting3',
            description: 'jhhhhh',
            name: 'setting 3',
            status: 'ACTIVE',
            type: 'boolean',
            value: 'true',
        }
    ];
    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'settings'}/>
            <ModuleNavigation elements={[
                {text: 'Add new setting', url: 'SettingAdd'}
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
                    <DataTable.Title>Type</DataTable.Title>
                    <DataTable.Title>Status</DataTable.Title>
                </DataTable.Header>

                {
                    settings.slice(from, to).map(setting =>
                        <DataTable.Row key={setting.code} onPress={() => navigation.navigate("Root", { screen: 'SettingDetails', params: { setting: setting }})}>
                            <DataTable.Cell>{setting.code}</DataTable.Cell>
                            <DataTable.Cell>{setting.name}</DataTable.Cell>
                            <DataTable.Cell>{setting.type}</DataTable.Cell>
                            <DataTable.Cell>{setting.status}</DataTable.Cell>
                        </DataTable.Row>
                    )
                }

                <DataTable.Pagination
                    page={page}
                    numberOfPages={Math.floor(settings.length / itemsPerPage)}
                    onPageChange={page => setPage(page)}
                    label={`${from + 1}-${to} of ${settings.length}`}
                />
            </DataTable>
        </View>
    );
}
