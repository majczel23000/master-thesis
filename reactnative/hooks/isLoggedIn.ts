import * as React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncStorageKeysEnum } from "../models/AsyncStorageKeys.enum";

export default function isLoggedIn() {
    const [isLoggedIn, setLoggedIn] = React.useState<boolean | undefined>(false);

    React.useEffect(() => {
        let result: boolean;
        async function checkLoggedIn() {
            try {
               await AsyncStorage.getItem(AsyncStorageKeysEnum.LOGGED_IN).then(res => {
                   if (res === 'true') result = true;
                   else result = false;
               });
            } catch (e) {
                console.warn(e);
            } finally {
                setLoggedIn(result);
            }
        }

        checkLoggedIn();
    }, []);
    return isLoggedIn;
}
