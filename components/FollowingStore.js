import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

export default function FollowingStore({store}) {
    const navigation = useNavigation()
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Seller', {id: store._id})} style={styles.container}>
      <Image 
        style={styles.sellerLogo} 
        source={{ uri: `https://kckticaretapi.onrender.com/images/${store.profilePicture}` }} 
        resizeMode='stretch' 
      />
      <Text style={styles.name}>{store.seller.company}</Text>
      <Text style={styles.productCount}>Number of Products: {store.seller.productCount}</Text>
      <Text style={styles.followerCount}>Number of Followers: {store.seller.followerCount}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        width: '47%',
        position: 'relative',
        margin: 5,
        gap: 5
    },
    sellerLogo: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    infos: {
        flexGrow: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    productCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray'
    },
    followerCount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'gray'
    }
})