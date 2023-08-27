import { ActivityIndicator, Dimensions, Image, ScrollView, StyleSheet, Text, Touchable, TouchableOpacity, View } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { addOrder, decreaseQuantityOrder, deleteOrder, increaseQuantityOrder } from '../features/user/userSlice';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Cart({navigation}) {
  const {cart, user} = useSelector(
    (state) => state.user
  );
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const decreaseQuantity = (productId) => {
    dispatch(decreaseQuantityOrder(productId))
  };

  const increaseQuantity = (productId) => {
    dispatch(increaseQuantityOrder(productId))
  };

  const deleteProduct = (productId) => {
    dispatch(deleteOrder(productId))
  };

  const calculateProductPrice = (item) => {
    if (item.campaign) {
      const discountedPrice =
        item.price - item.price * (item.campaign.discountPercentage / 100);
      return (discountedPrice * item.quantity).toFixed(2);
    } else {
      return (item.price * item.quantity).toFixed(2);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => {
      if (item.campaign) {
        const discountedPrice =
          item.price - item.price * (item.campaign.discountPercentage / 100);
        return total + discountedPrice * item.quantity;
      } else {
        return total + item.price * item.quantity;
      }
    }, 0);
  };
  const handleSubmit = async() => {
    
    if(user){
      if(user?.seller?.isSeller){
        Toast.show({
          type: 'error',
          text1: 'Something went wrong',
          text2: "Those in the seller role cannot perform this operation.",
          position: 'bottom',
          visibilityTime: 2000,
          autoHide: true,
      });
      }
      else{
        setIsLoading(true)
        const cart = await AsyncStorage.getItem('cart')
        const orders = {orders: JSON.parse(cart)};
        dispatch(addOrder(orders)).then(() => setIsLoading(false))
      }
    }else{
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: "You must log in to place an order.",
        position: 'bottom',
        visibilityTime: 2000,
        autoHide: true,
      });
    }
  }
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {
        cart && cart.length > 0 ?
        <>
          <View style={styles.productSection} showsVerticalScrollIndicator={false}>
            {
              cart.map((item) => (
                <View style={styles.product} key={item._id}>
                  <TouchableOpacity style={styles.goToProduct} onPress={() => navigation.navigate('ProductDetail', {id: item._id})}><Text style={{color: '#888', fontSize: 10}}>Go to the product page</Text></TouchableOpacity>
                  <Image
                    style={styles.productImage}
                    source={{ uri: `https://kckticaretapi.onrender.com/images/${item?.img}` }}
                    resizeMode='stretch'
                  />
                  <View style={styles.details}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <View style={styles.price}>
                      {
                        new Date(item?.campaign?.endDate) > new Date() ?
                        <>
                          <Text style={styles.oldPrice}>{item.price} TL</Text>
                          <Text style={styles.newPrice}>
                            {(
                              item.price -
                              item.price * (item.campaign.discountPercentage / 100)
                            ).toFixed(2)}{' '}
                            TL
                          </Text>
                        </>
                        :
                        <Text style={styles.price}>{item.price} TL</Text>
                      }
                    </View>
                    <View style={styles.productActions}>
                      <TouchableOpacity onPress={() => decreaseQuantity(item._id)} style={styles.button}>
                        <Text style={{color: '#fff'}}>-</Text>
                      </TouchableOpacity>
                      <Text style={styles.quantity}>{item.quantity}</Text>
                      <TouchableOpacity onPress={() => increaseQuantity(item._id)} style={styles.button}>
                        <Text style={{color: '#fff'}}>+</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteProduct(item._id)} style={styles.button}>
                        <Text style={{color: '#fff'}}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
          <View style={styles.summarySection}>
            <View style={styles.summary}>
              {
                cart.map((item) => 
                  <View style={styles.orderItem} key={item._id}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>
                      {item.quantity} * {" "}
                      {new Date(item?.campaign?.endDate) > new Date() ? (
                        item.price -
                        item.price * (item.campaign.discountPercentage / 100)
                        ).toFixed(2) : item.price } TL = {' '}
                      {calculateProductPrice(item)} TL
                    </Text>
                  </View>
                )
              }
            </View>
            <View style={styles.total}>
              <Text style={styles.totalText}>TOTAL: </Text>
              <Text style={styles.totalPrice}>{calculateTotalPrice().toFixed(2)}{' '}TL</Text>
            </View>
            <TouchableOpacity onPress={() => handleSubmit()} style={styles.confirmOrderButton} disabled={isLoading}>
              {
                isLoading 
                ? <ActivityIndicator style={{alignSelf: 'center'}} color="gray" />
                : <Text style={{color: 'white'}}>Confirm The Order</Text>
              }
            </TouchableOpacity>
          </View>
        </>
        :
        <View style={styles.invalid}>
          <Ionicons name="cart" size={250} color='gray' />
          <Text style={{fontWeight: 'bold', color: 'gray', fontSize: 18}}>Oops! Your cart is currently empty.</Text>
        </View>
      }
    </ScrollView>
  )
}

const {height} = Dimensions.get('window')
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  productSection: {
    padding: 5
  },
  product: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingTop: 20,
    marginBottom: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
   
  },
  productImage: {
    width: 125,
    height: 150,
    borderRadius: 10,
    marginRight: 30
  },
  productName: {
    maxWidth: '90%',
    fontWeight: 'bold',
    marginBottom: 5

  },
  goToProduct: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  price: {
    marginBottom: 5,
    flexDirection: 'row'
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 2,
  },
  newPrice: {
    color: '#f00'
  },
  price: {
    color: '#000',
  },
  productActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f00',
  },
  summarySection: {
    margin: 5,
    marginBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,

  },
  summary: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    marginBottom: 5,
  },
  orderItem: {
    gap: 2,
    marginBottom: 5
  },
  itemName: {
    fontWeight: 'bold'
  },
  itemPrice: {
    color: '#f00',
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 5
  },
  totalText: {
    fontWeight: 'bold',
  },
  totalPrice: {
    fontWeight: 'bold',
    color: '#888',
  },
  confirmOrderButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: '#f00',
    alignSelf: 'flex-start',
    margin: 5,
    borderRadius: 5
  },
  invalid: {
    alignItems: 'center',
    justifyContent: 'center',
    height: height/1.3
  }

})