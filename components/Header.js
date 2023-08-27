import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useState } from 'react'
import FilterModal from './FilterModal'

export default function Header() {
    const [visible, setVisible] = useState(false)
  return (
    <View style={styles.container}>
        <TouchableOpacity onPress={() => {setVisible(true)}}>
            <Ionicons name='reorder-three' size={30} />
        </TouchableOpacity>
        <Text style={{fontSize: 18, fontWeight: 'bold'}}>KCKTİCARET</Text>
        <FilterModal visible={visible} onClose={() => setVisible(false)}/>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    }
})