import * as React from 'react';
import { View } from 'react-native';
import { useCallback, useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import moduleStyles from "../styles/moduleStyles";
import { Searchbar, DataTable, ActivityIndicator } from 'react-native-paper';
import { UserModel } from "../models/users/User.model";
import { environment } from "../environment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";
import { UsersResponseModel } from "../models/users/UsersResponse.model";

export default function UserScreen() {

    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = React.useState('');
    const [users, setUsers] = React.useState<UserModel[]>([]);
    const [filteredUsers, setFilteredUsers] = React.useState<UserModel[]>([]);
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
                fetch(environment.apiUrl + 'users', {
                    headers: {
                        Accept: 'application/json',
                        "Authorization": `Bearer ${JSON.parse(result)}`
                    },
                })
                    .then(res => res.json())
                    .then((data: UsersResponseModel) => {
                        // @ts-ignore
                        setUsers(data.data);
                        // @ts-ignore
                        setFilteredUsers(data.data);
                        setIsLoading(false);
                    })
            }
        });
    }, []))

    const applyFilter = (text: string) => {
        setSearchQuery(text);
        const tempUsers = users.filter(user => {
            return user.email?.includes(text) || user.status?.includes(text);
        });
        setFilteredUsers(tempUsers);
    }

    const [page, setPage] = React.useState(0);
    const itemsPerPage = 5;
    const from = page * itemsPerPage;
    const to = (page + 1) * itemsPerPage;

    return (
        <View style={moduleStyles.container}>
            <Location location={'users'}/>
            <ModuleNavigation elements={[
                {text: 'Add new user', url: 'UserAdd'}
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
                        <DataTable.Title>Email</DataTable.Title>
                        <DataTable.Title>Status</DataTable.Title>
                    </DataTable.Header>

                    {
                        filteredUsers.slice(from, to).map(user =>
                            <DataTable.Row key={user.email} onPress={() => navigation.navigate("Root", { screen: 'UserDetails', params: { user: user }})}>
                                <DataTable.Cell>{user.email}</DataTable.Cell>
                                <DataTable.Cell>{user.status}</DataTable.Cell>
                            </DataTable.Row>
                        )
                    }

                    <DataTable.Pagination
                        page={page}
                        numberOfPages={Math.ceil(filteredUsers.length / itemsPerPage)}
                        onPageChange={page => {
                            setPage(page)
                        }}
                        label={`${from + 1}-${page + 1 === Math.ceil(filteredUsers.length / itemsPerPage) ? filteredUsers.length : to} of ${filteredUsers.length}`}
                    />
                </DataTable> : <ActivityIndicator animating={isLoading} color={'orange'} size={200}/>
            }
        </View>
    );
}
