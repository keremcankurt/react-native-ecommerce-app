import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { addCart, decreaseQuantityOrder, favProduct, increaseQuantityOrder } from '../features/user/userSlice';
import { FontAwesome } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
export function Product({ product }) {
    const { user, cart } = useSelector((state) => state.user);
    const productQuantity = cart.filter((item) => item._id === product._id)[0]?.quantity;
    const dispatch = useDispatch();
    const navigation = useNavigation()
    const [isFavorited, setIsFavorited] = useState(false);
    useEffect(() => {
        if (user?.favProducts && product) {
            const isProductFavorited = user.favProducts.some((id) => id === product._id);
            setIsFavorited(isProductFavorited);
        }
    }, [user, product]);

    const handleFavorite = () => {
        setIsFavorited((prevValue) => !prevValue);
        dispatch(favProduct(product._id));
    };
    const handleAddToCart = async() => {
        const selectedProduct = {
            ...product,
            quantity: 1,
        };
        dispatch(addCart(selectedProduct));
        let cart = await AsyncStorage.getItem("cart") || []
        cart = cart && cart.length > 0 ? JSON.parse(cart) : []
        cart.push({[product._id]: 1})
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
    };

    const decreaseQuantity = () => {
        dispatch(decreaseQuantityOrder(product._id));
    };

    const increaseQuantity = () => {
        dispatch(increaseQuantityOrder(product._id));
    };

    const formatPrice = (price) => {
        const parts = price.toString().split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const decimalPart = parts[1] ? `,${parts[1]}` : '';
        return `${integerPart}${decimalPart}`;
    };
    return (
        <TouchableOpacity style={styles.productComp} onPress={() => navigation.navigate('ProductDetail', {id: product?._id})}>
            {new Date(product.campaign?.endDate) > new Date() && (
                <Text style={styles.campaign}>%{product.campaign.discountPercentage}</Text>
            )}
            <View style={[styles.productImgContainer, product.stock === 0 && styles.soldOutContainer]}>
                <Image style={styles.productImg} source={{ uri: `https://kckticaretapi.onrender.com/images/${product?.img}` }} alt="product" />
                {product.stock === 0 && (
                    <Text style={styles.soldOutText}>Out of Stock</Text>
                )}
            </View>
            <View style={styles.productReviews}>
            <View style={styles.starsContainer}>
                <Rating imageSize={16} reviewSize={0} startingValue={product?.star} readonly={true}/>
                <Text>({product?.comments?.length})</Text>
            </View>
        </View>
            <View style={styles.seller}>
                <Image style={styles.sellerLogo} source={{ uri: `https://kckticaretapi.onrender.com/images/${product.seller.profilePicture}` }} resizeMode='stretch' />
                <Text style={styles.sellerCompany}>{product.seller.company}</Text>
            </View>
            <View style={styles.productInfos}>
                <Text numberOfLines={1} style={styles.productName}>{product.name}</Text>
                {new Date(product.campaign?.endDate) > new Date() ? (
                    <View style={styles.campaignPriceContainer}>
                        <Text style={styles.oldPrice}>{formatPrice(product.price)} TL</Text>
                        <Text style={styles.campaignPrice}>{formatPrice((product.price - (product.price * product.campaign.discountPercentage) / 100).toFixed(2))} TL</Text>
                        
                    </View>
                ) : (
                    <Text style={styles.price}>{formatPrice(product.price)} TL</Text>
                )}
            </View>
            <View style={styles.buttons}>
                {!user || (user.role === 'user' && !user.seller.isSeller) ? (
                    <View style={styles.actions}>
                        {user && (
                            <TouchableOpacity
                                onPress={handleFavorite}
                            >
                                <FontAwesome  style={[styles.addToFavorites, styles.heartIcon, isFavorited && styles.favorited]} name="heart" />
                            </TouchableOpacity>
                        )}
                        {product.stock === 0 ? (
                            <Text style={styles.invalid}>Out of Stock</Text>
                        ) : (
                            <>
                                {cart.some((item) => item._id === product._id) ? (
                                    <View style={styles.productButtons}>
                                        <TouchableOpacity onPress={() => decreaseQuantity()}>
                                            <Text style={styles.quantityButton}>-</Text>
                                        </TouchableOpacity>
                                        <Text style={styles.quantity}>{productQuantity}</Text>
                                        <TouchableOpacity onPress={() => increaseQuantity()}>
                                            <Text style={styles.quantityButton}>+</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity style={styles.addToCart} onPress={handleAddToCart}>
                                        <Text style={styles.addToCartText}>Add to Cart</Text>
                                    </TouchableOpacity>
                                )}
                            </>
                        )}
                    </View>
                ) : (
                    <Text style={styles.invalid}>Only users can purchase...</Text>
                )}
            </View>
        </TouchableOpacity>
    );
}

const {width} = Dimensions.get('window')
const styles = StyleSheet.create({
    productComp: {
        display: 'flex',
        flexDirection: 'column',
        marginVertical: 10,
        marginHorizontal: 7,
        width: width / 2 - 20,
        paddingBottom: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        borderRadius: 4,
        overflow: 'hidden',
        position: 'relative',
        textDecorationLine: 'none',
        color: 'black',
        transitionProperty: 'transform, shadowColor',
        transitionDuration: 300,
        elevation: 5,
        backgroundColor: 'white',
    },
    campaign: {
        position: 'absolute',
        backgroundColor: '#ff9800',
        color: '#fff',
        paddingVertical: 2,
        paddingHorizontal: 5,
        fontSize: 12,
        marginRight: 5,
        zIndex: 99,
        borderTopLeftRadius: 3
    },
    productImgContainer: {
        position: 'relative',
    },
    soldOutContainer: {
        //
    },
    soldOutText: {
        position: 'absolute',
        top: 50,
        left: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        color: 'red',
        fontSize: 25,
        fontWeight: 'bold',
        transform: [{ rotate: '-40deg' }],
    },
    productImg: {
        width: '100%',
        height: 180,
        resizeMode: 'stretch',
    },
    seller: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        margin: 2
    },
    sellerLogo: {
        width: 35,
        height: 35,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'gray',
    },
    sellerCompany: {
        fontWeight: 'bold',
        fontSize: 10
    },
    productInfos: {
        alignItems: 'center',
        height: 65
    },
    productName: {
        fontWeight: 'bold',
    },
    campaignPriceContainer: {
        marginVertical: 5
    },
    campaignPrice: {
        color: 'red',
    },
    oldPrice: {
        color: 'gray',
        textDecorationLine: 'line-through',
        fontSize: 10,
        textAlign: 'center',
    },
    price: {
        textAlign: 'center',
    },
    productReviews: {
        alignSelf: 'flex-end',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    starsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
    },
    buttons: {
        display: 'flex',
    },
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: 5,
        flexDirection: 'row',
        alignItems: 'center',
        height: 30
    },
    addToFavorites: {
        alignItems: 'center',
        fontSize: 24,
        color: 'gray',
        backgroundColor: 'transparent',
        borderWidth: 0,
        marginRight: 10,
    },
    favorited: {
        color: 'red',
    },
    heartIcon: {
        fontSize: 24,
    },
    addToCart: {
        backgroundColor: '#2196f3',
        color: '#fff',
        borderWidth: 0,
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 4,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 14,
    },
    productButtons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        paddingVertical: 2,
        fontSize: 12,
        paddingHorizontal: 6,
        marginRight: 5,
        backgroundColor: '#2196f3',
        color: '#fff',
        borderWidth: 0,
    },
    quantity: {
        fontSize: 16,
        marginHorizontal: 3
    },
    invalid: {
        color: 'red',
    },
});

export default Product;
