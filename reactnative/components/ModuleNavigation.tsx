import { StyleSheet, Text} from "react-native";
import * as React from "react";
import { View } from "./Themed";
import { NavigationModel } from "../models/NavigationModel";
import { useNavigation } from "@react-navigation/native";

export default function ModuleNavigation(props: NavigationModel) {

    const navigation = useNavigation();

    return (
        <View style={styles.view}>
            {
                props.elements.map(el =>
                    <Text key={el.url} style={styles.text} onPress={
                    () => navigation.navigate("Root", { screen: el.url })
                }>{el.text}</Text>)
            }
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        backgroundColor: 'orange',
        width: '90vw',
        shadowColor: 'black',
        shadowRadius: 5,
        shadowOpacity: 0.2,
        marginTop: '2vh',
        padding: '1vh',
    },
    text: {
        backgroundColor: 'white',
        color: 'black',
        textAlign: 'center',
        margin: '1vh',
        marginLeft: '2vh',
        marginRight: '2vh',
        padding: '1vh'
    }
});
