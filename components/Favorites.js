import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getFavProducts } from '../features/product';
import { useEffect, useState } from 'react';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useSelector } from 'react-redux';
import SearchBar from './SearchBar';
import Product from './Product';

export default function Favorites() {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(false);
    const {user} = useSelector(
        (state) => state.user
    );

    useEffect(() => {
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const response = await getFavProducts();
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setProducts(result.data)
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Something went wrong',
              text2: error.message,
              position: 'bottom',
              visibilityTime: 2000,
              autoHide: true,
          })
          }
          finally{
            setIsLoading(false)
          }
        };
        fetchData();
        
    }, [user?.favCount]);
    const [searchText, setSearchText] = useState('');
    const filteredProducts = products?.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
  return (
    <View style={styles.container}>
      {
        !isLoading ? 
        user.favCount !== 0 ?
        <>
          <SearchBar searchText={searchText} setSearchText={setSearchText}/>
          <Text style={styles.title}>Your Favorites</Text>
          {
            filteredProducts?.length !== 0 ?
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.products}
              data={filteredProducts}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => 
              <Product product={item} />}
              numColumns={2} 
            />
            :
            <Text style={styles.invalid}>There are no suitable products for your search.</Text>
          }
        </>
        :
        <Text style={styles.invalid}>There are no products in your favorites.</Text>
        :
        <ActivityIndicator style={{alignSelf: 'center'}} size='large' color="gray" />
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invalid: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
    marginBottom: 5
  }
})