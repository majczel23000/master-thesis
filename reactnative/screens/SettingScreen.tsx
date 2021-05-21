import * as React from 'react';
import { View } from 'react-native';
import { useCallback, useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SettingModel } from "../models/settings/Setting.model";
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import { ActivityIndicator, DataTable, Searchbar } from "react-native-paper";
import ModuleNavigation from "../components/ModuleNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { environment } from "../environment";
import { SettingsResponseModel } from "../models/settings/SettingsResponse.model";

export default function SettingScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [settings, setSettings] = React.useState<SettingModel[]>([]);
    const [filteredSettings, setFilteredSettings] = React.useState<SettingModel[]>([]);
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
                fetch(environment.apiUrl + 'settings', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: SettingsResponseModel) => {
                        // @ts-ignore
                        setSettings(data.data);
                        // @ts-ignore
                        setFilteredSettings(data.data);
                        setIsLoading(false);
                    })
            }
        });
    }, []))

    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempSettings = settings.filter(setting => {
            return setting.code?.toUpperCase().includes(text.toUpperCase());
        });
        setFilteredSettings(tempSettings);
    }

    const goToDetails = (setting: SettingModel) => {
        navigation.navigate("Root", { screen: 'SettingDetails', params: { setting: setting }})
    }

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
                    numberOfPages={Math.ceil(filteredSettings.length / itemsPerPage)}
                    onPageChange={page => setPage(page)}
                    label={`${from + 1}-${page + 1 === Math.ceil(filteredSettings.length / itemsPerPage) ? filteredSettings.length : to} of ${filteredSettings.length}`}

                />
                </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
            }
        </View>
    );
}
