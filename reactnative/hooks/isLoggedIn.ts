import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function isLoggedIn() {
    const [isLoggedIn, setLoggedIn] = React.useState('null');

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        let result: string;
        async function checkLoggedIn() {
            try {
               await AsyncStorage.getItem('LOGGED_IN').then(res => {
                   if (res === 'true') result = 'true';
                   else result = "false";
               });
            } catch (e) {
                console.warn(e);
            } finally {
                setLoggedIn(result);
            }
        }

        checkLoggedIn();
    }, []);
    console.log(isLoggedIn);
    return isLoggedIn;
}
