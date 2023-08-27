import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

export default function SearchBar({searchText, setSearchText}) {
  return (
    <View style={styles.container}>
        <View style={styles.searchbar}>
            <TextInput
                value={searchText}
                onChangeText={setSearchText}
                style={styles.search}
                placeholder='Search...'
                numberOfLines={1}
            />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchbar: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        width: '75%',
        marginVertical: 10
    },
    search: {
        borderWidth: 1,
        padding: 5,
        width: '100%',
        borderRadius: 25,
        paddingHorizontal: 20,
        backgroundColor: '#ebebeb'

    },
    button: {
        position: 'absolute',
        right: 5,
    },
    name: {
        color: '#949393',
        maxWidth: '30%'
    }

})