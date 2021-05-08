import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import {TextInput, Checkbox, Button} from "react-native-paper";

export default function UserAddScreen() {
    const roles = [
        {id: 0, checked: false, title: 'USER_ADD'},
        {id: 1, checked: false, title: 'USER_DELETE'},
        {id: 2, checked: false, title: 'USER_ADD'},
        {id: 3, checked: false, title: 'USER_DELETE'},
        {id: 4, checked: false, title: 'USER_ADD'},
        {id: 5, checked: false, title: 'USER_DELETE'},
        {id: 6, checked: false, title: 'USER_ADD'},
        {id: 7, checked: false, title: 'USER_DELETE'},
    ]
    const [checkboxes, setCheckboxes] = React.useState(roles)

    const handleCheck = (checkedId: number) => {
        let temp = checkboxes.map((checkbox) => {
            if (checkedId === checkbox.id) {
                return { ...checkbox, checked: !checkbox.checked };
            }
            return checkbox;
        });
        setCheckboxes(temp);
    }

    const register = () => {
        console.log(register);
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    return (
        <View style={moduleStyles.container}>
            <Location location={`users > add `}/>
            <ModuleNavigation elements={[
                {text: 'Users list', url: 'User'}
            ]} />
            <View style={moduleStyles.box}>
                <Text style={moduleStyles.header}>Add new user</Text>
                <TextInput
                    label="Email"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type your email here</Text>
                <TextInput
                    label="First Name"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type your first name here</Text>
                <TextInput
                    label="Last Name"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type your last name here</Text>
                <TextInput
                    label="Password"
                    secureTextEntry={true}
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type your password here</Text>
                <Text style={styles.text}>Select roles:</Text>
                <View style={styles.checkboxView}>
                {
                    checkboxes.map(checkbox =>
                        <View key={checkbox.id + 'v'} style={styles.checkbox}>
                        <Checkbox
                            key={checkbox.id}
                            color={'orange'}
                            status={checkbox.checked ? 'checked' : 'unchecked'}
                            onPress={() => handleCheck(checkbox.id)}
                            />
                            <Text>{checkbox.title}</Text>
                        </View>
                    )
                }
                </View>
                <Button
                    mode="contained"
                    style={moduleStyles.btn}
                    onPress={register}>
                    Register
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    text: {
        marginTop: '2vh',
        marginBottom: '2vh',
        fontSize: 18,
    },
    checkboxView: {
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    checkbox: {
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width: '50%',
    }
})
