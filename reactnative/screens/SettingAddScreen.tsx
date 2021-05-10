import * as React from 'react';
import { View, Text } from 'react-native';
import { useEffect } from "react";
import { StackHeaderLeftButtonProps } from "@react-navigation/stack";
import MenuIcon from "../components/MenuIcon";
import { useNavigation } from '@react-navigation/native';
import moduleStyles from "../styles/moduleStyles";
import Location from "../components/Location";
import ModuleNavigation from "../components/ModuleNavigation";
import { TextInput, Button } from "react-native-paper";

export default function SettingAddScreen() {

    const add = () => {
        console.log(add);
    }

    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({
            headerLeft: (props: StackHeaderLeftButtonProps) => (<MenuIcon/>)
        });
    });

    return (
        <View style={moduleStyles.container}>
            <Location location={`settings > add `}/>
            <ModuleNavigation elements={[
                {text: 'Settings list', url: 'Setting'}
            ]} />
            <View style={moduleStyles.box}>
                <Text style={moduleStyles.header}>Add new setting</Text>
                <TextInput
                    label="Code"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type code here</Text>
                <TextInput
                    label="Name"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type name here</Text>
                <TextInput
                    label="Description"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type description here</Text>
                <TextInput
                    label="Setting type"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Choose type </Text>
                <TextInput
                    label="Value"
                    style={moduleStyles.input}
                    underlineColor={'#DB995A'}
                    selectionColor={'#DB995A'}
                    theme={{colors: {primary: '#DB995A'}}}
                />
                <Text style={moduleStyles.info}>Type value here</Text>

                <Button
                    mode="contained"
                    style={moduleStyles.btn}
                    onPress={add}>
                    Add setting
                </Button>
            </View>
        </View>
    );
}
