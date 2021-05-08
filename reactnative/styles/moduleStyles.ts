import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#fafafa',
        paddingTop: '2vh'
    },
    box: {
        width: '90vw',
        backgroundColor: 'white',
        shadowColor: 'black',
        shadowRadius: 10,
        shadowOpacity: 0.2,
        borderRadius: 5,
        paddingTop: '3vh',
        paddingBottom: '3vh',
        paddingLeft: '4vh',
        paddingRight: '4vh',
        marginTop: 20
    },
    header: {
        fontSize: 50,
        fontWeight: '500',
        textAlign: 'center',
    },
    filter: {
        width: '90vw',
        borderRadius: 0,
        shadowRadius: 0,
        shadowOpacity: 0,
        backgroundColor: 'rgb(250, 250, 250)',
        marginTop: '2vh',
        height: '5vh'
    },
    filterText: {
        fontSize: 14
    }
});
