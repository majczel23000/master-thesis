import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function isLoggedIn() {
    const [isLoggedIn, setLoggedIn] = React.useState(false);

    // Load any resources or data that we need prior to rendering the app
    React.useEffect(() => {
        let result: boolean;
        async function checkLoggedIn() {
            try {
               await AsyncStorage.getItem('LOGGED_IN').then(res => {
                   if (res === 'true') result = true;
                   else result = false;
               });
            } catch (e) {
                // We might want to provide this error information to an error reporting service
                console.warn(e);
            } finally {
                console.log(result);
                setLoggedIn(result);
            }
        }

        checkLoggedIn();
    }, []);

    return isLoggedIn;
}
