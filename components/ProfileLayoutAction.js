import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'

export default function ProfileLayoutAction({text, selected=false, onPress}) {
  return (
    <TouchableOpacity disabled={selected} style={[styles.action, selected && styles.selected]} onPress={onPress}>
        <Text>{text}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  action: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#e7e4e4',
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    borderRadius: 4,
    borderColor: 'gray',
  },
  selected: {
    backgroundColor: '#b6b5b5'
  }
})