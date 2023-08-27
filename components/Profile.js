import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { useState } from 'react';

export default function Profile() {
  const {user} = useSelector(
    (state) => state.user
  );
  const [isError, setIsError] = useState(false)
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={user.profilePicture && !isError ? { uri: `https://kckticaretapi.onrender.com/images/${user.profilePicture}` }:  require('../assets/default-user.png')}
        onError={() => setIsError(true)}
        resizeMode='stretch'
      />
      <View style={styles.fullName}>
        <Text style={styles.nameText}>{user.name}</Text>
        <Text style={styles.nameText}>{' '}{user.surname}</Text>
      </View>
      <Text style={styles.text}>{user?.place || 'Not Specified'}</Text>
      <Text style={styles.text}>{user.email}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 0.8,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        padding: 10,
        gap: 10
    },
    image: {
      width: 150,
      height: 150,
      borderRadius: 100
    },
    fullName: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 5
      
    },
    nameText: {
      width: '50%',
      textAlign: 'center',
      fontSize: 18,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: '#dfdfdf',
      color: '#555555',
      paddingVertical: 5
    },
    text: {
      textAlign: 'center',
      fontSize: 18,
      borderWidth: 1,
      borderRadius: 10,
      backgroundColor: '#dfdfdf',
      color: '#555555',
      width: '100%',
      paddingVertical: 5
    }

})