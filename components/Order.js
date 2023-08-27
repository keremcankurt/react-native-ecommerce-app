import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { addComment } from '../features/user/userSlice';
import { Rating } from 'react-native-ratings';

export default function Order({order}) {
    const [rating, setRating] = useState(order?.star || 0);
    const [text, setText] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = () => {
        const data = {
        info: {
            star: rating,
            text: text,
            orderId: order._id
        },
        id: order.productId
        }
        dispatch(addComment(data));
    }
  return (
    <View style={styles.container}>
      <View style={styles.order}>
        <Text style={styles.createdAt}>{new Date(order.createdAt).toLocaleDateString()}</Text>
        <Image 
            style={styles.productImage} 
            source={{ uri: `https://kckticaretapi.onrender.com/images/${order.img}` }} resizeMode='contain' />
        <View style={styles.infos}>
            <Text style={styles.name}>{order.name}</Text>
            <Text style={styles.price}>{order.price} TL</Text>
            <Text style={styles.quantity}>Quantity: {order.unit}</Text>
        </View>
        <View style={styles.evaluation}>
            <View style={styles.starsContainer}>
                <Rating 
                    imageSize={20} 
                    startingValue={rating} 
                    readonly={order.comment !== undefined}
                    onFinishRating={(_rating) => {setRating(_rating)}}
                />
                {
                    order?.comment === undefined ?
                    <View style={styles.addComment}>
                        <TextInput multiline numberOfLines={3} style={styles.input} placeholder='Comment...' value={text} onChangeText={setText}/>
                        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
                            <Text style={{color: 'white'}}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    :
                    order.comment === 'Ürün kaldırılmış' ?
                    <Text style={styles.comment}>You cannot make an evaluation because the product has been removed.</Text>
                    :
                    <Text style={styles.comment}>{order.comment}</Text>
                }
            </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    order: {
        justifyContent: 'space-around',
        alignItems: 'center',
        position: 'relative',
        width: '95%',
        borderRadius: 10,
        padding: 10,
        backgroundColor: 'white',
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        marginBottom: 5
    },
    productImage: {
        marginVertical: 5,
        width: 175,
        height: 200,
        borderRadius: 10
    },
    infos: {
        gap: 5
    },
    name: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    price: {
        color: 'gray',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    quantity: {
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'right',
        color: 'gray'
    },
    evaluation: {
        alignItems: 'center',
        gap: 10,
        marginVertical: 10
    },
    input: {
        height: 100,
        borderWidth: 1,
        maxWidth: 200,
        borderRadius: 10,
        borderColor: 'gray',
        marginVertical: 5,
        minWidth: 200,
        padding: 5
    },
    button: {
        backgroundColor: '#0099ff',
        paddingVertical: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    createdAt: {
        position: 'absolute',
        right: 5,
        top: 5,
        color: '#888',
        fontSize: 10,
        fontWeight: 'bold',
    }
})