import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import Order from './Order';

export default function Orders() {
  const { user } = useSelector((state) => state.user);

  const sortOrdersByCreatedAt = (orders) => {
    const sortedOrders = [...orders];

    return sortedOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };
  return (
    <>

      {
        user?.orders?.length !== 0 ? 
        <ScrollView style={styles.container}>
            {sortOrdersByCreatedAt(user?.orders).map((order) => (
              <Order key={order._id} order={order}/>
            ))}
        </ScrollView>
              :
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={styles.invalid}>You do not have an order...</Text>
        </View>
      }
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  invalid: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray'
  }
})