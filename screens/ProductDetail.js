import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { getProduct } from '../features/product';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import { addCart, favProduct } from '../features/user/userSlice';
import { FontAwesome } from '@expo/vector-icons';
import HTML from 'react-native-render-html';
import Product from '../components/Product';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Rating } from 'react-native-ratings';
import Comments from '../components/Comments';

export default function ProductDetail({route, navigation}) {
    const {user: authUser} = useSelector(
        (state) => state.auth
    );
    const {user, cart} = useSelector(
        (state) => state.user
    );
    const [quantity, setQuantity] = useState(1);
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
    const [sortType, setSortType] = useState('The Newest')
      
    const { id } = route.params
      
    const [product, setProduct] = useState();
    const [recommendedProducts, setRecommendedProducts] = useState();
    const [comments, setComments] = useState();
    const [isSuccess, setIsSuccess] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [openQuantitySelection, setOpenQuantitySelection] = useState(false);
    const [sortOption, setSortOption] = useState("newest");

    const dispatch = useDispatch();
    const handleSortChange = (event) => {
      setSortOption(event.target.value);
    };
    
    useLayoutEffect(() => {
        const fetchData = async () => {
          try {
            setIsSuccess(false)
            navigation.setOptions({
              title: ``,
          });
            const response = await getProduct(id);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setProduct(result.data)
            setRecommendedProducts(result.recommendedProducts)
            setComments(result.comments)
            setRemainingTime(calculateRemainingTime(result.data?.campaign?.endDate))
            navigation.setOptions({
                title: `${result?.data?.name}`,
            });
            setIsSuccess(true);
          } catch (error) {
            setIsSuccess(false);
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: error.message,
                position: 'bottom',
                visibilityTime: 2000,
                autoHide: true,
            });
          }
        };
        fetchData();
        
      }, [id]);

      const handleAddToCart = async() => {
        const selectedProduct = {
          ...product,
          quantity
        }
        dispatch(addCart(selectedProduct));
        let cart = await AsyncStorage.getItem("cart") || []
        cart = cart && cart.length > 0 ? JSON.parse(cart) : []
        cart.push({[product._id]: quantity})
        await AsyncStorage.setItem("cart", JSON.stringify(cart));
      };
      const handleFavorite = () => {
        setIsFavorited((prevValue) => !prevValue);
        dispatch(favProduct(id));
      };
    
      const handleQuantityChange = (value) => {
        setQuantity((value));
        setOpenQuantitySelection(false)
      };
      useEffect(() => {
        if (user?.favProducts && product) {
          const isProductFavorited = user.favProducts.some((id) => id === product._id);
          setIsFavorited(isProductFavorited);
        }
      }, [user, product]);
    
      const [remainingTime, setRemainingTime] = useState();
    
      useEffect(() => {
        if(isSuccess && new Date(product.campaign?.endDate) > new Date())
        {
          const timer = setInterval(() => {
            const newRemainingTime = calculateRemainingTime(product?.campaign?.endDate);
            setRemainingTime(newRemainingTime);
      
            if (newRemainingTime === '0') {
              clearInterval(timer);
            }
          }, 1000);
      
          return () => {
            clearInterval(timer);
          };
        }
        
      }, [product?.campaign?.endDate, isSuccess]);
    
      const calculateRemainingTime = (endDate) => {
        const currentDate = new Date();
        const remainingTime = new Date(endDate) - currentDate;
      
        if (remainingTime <= 0) {
          return '0';
        }
      
        const seconds = Math.floor((remainingTime / 1000) % 60);
        const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
        const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
        const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      
        const months = Math.floor(days / 30);
        const weeks = Math.floor((days % 30) / 7);
        const remainingDays = days % 7;
      
        let remainingTimeString = '';
      
        if (months > 0) {
          remainingTimeString += `${months} months `;
        }
        if (weeks > 0) {
          remainingTimeString += `${weeks} weeks `;
        }
        if (remainingDays > 0) {
          remainingTimeString += `${remainingDays} days `;
        }
        if (hours > 0) {
          remainingTimeString += `${hours} hours `;
        }
        if (minutes > 0) {
          remainingTimeString += `${minutes} minutes `;
        }
        if (seconds > 0) {
          remainingTimeString += `${seconds} seconds`;
        }
      
        return remainingTimeString.trim();
      };
      
      const formatPrice = (price) => {
        const parts = price.toString().split('.');
        const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        const decimalPart = parts[1] ? `,${parts[1]}` : '';
        return `${integerPart}${decimalPart}`;
      };


  return (
    <ScrollView style={styles.container}>
      {
        isSuccess 
        ?
          <>
            {new Date(product.campaign?.endDate) > new Date() &&
              <View style={styles.campaignInfo}>
                <Text style={styles.timer}>The remaining time until the closure ends: {remainingTime}</Text>
              </View>
            }
            <View style={styles.productInfo}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: `https://kckticaretapi.onrender.com/images/${product?.img}` }}
                    resizeMode='stretch'
                  />
                <View style={styles.productInfoTopRight}>
                  <View style={styles.rightTop}>  
                    <Text style={styles.productName}>{product.name}{' '}
                      {new Date(product.campaign?.endDate) > new Date() && (
                        <Text style={styles.campaign}>{`${product.campaign.discountPercentage}% Discount`}</Text>
                      )}
                    </Text>
                    <View style={styles.priceSection}>
                      {new Date(product.campaign?.endDate) > new Date() 
                        ?
                        <>
                          <Text style={styles.oldPrice}>{formatPrice(product.price)} TL</Text>
                          <Text style={styles.discountedPrice}>
                              {formatPrice((
                                product.price -
                                product.price * (product.campaign.discountPercentage / 100)
                              ).toFixed(2))}{' '}
                              TL
                          </Text>
                        </>
                        :
                        <Text style={styles.price}>{formatPrice(product.price)} TL</Text>
                      }
                    </View>
                    { !authUser || (authUser.role === "user" && !authUser.isSeller) ?
                      <View style={styles.actions}>
                        {
                          authUser && 
                          <TouchableOpacity onPress={handleFavorite}>
                          <FontAwesome  style={[styles.addToFavorites, styles.heartIcon, isFavorited && styles.favorited]} name="heart" />
                          </TouchableOpacity>
                        }
                        {product.stock === 0 ? <Text style={styles.invalid}>the product is not in stock...</Text>
                        :
                        <>
                          <View style={styles.quantitySelection}>
                            <TouchableOpacity style={styles.quantitySelectButton} onPress={() => setOpenQuantitySelection(!openQuantitySelection)}>
                              <Text>{quantity}</Text>
                            </TouchableOpacity>
                            {
                              openQuantitySelection && 
                              <View style={styles.quantitySelect}>
                                {[...Array(product.stock < 5 ? product.stock : 5)].map((_, index) => (
                                  <TouchableOpacity key={index + 1} onPress={() => handleQuantityChange(index + 1)}>
                                    <Text>{index + 1}</Text>
                                  </TouchableOpacity>
                                ))}
                              </View>
                            }
                          </View>
                          <TouchableOpacity style={cart.some(item => item._id === product._id) ? styles.added: styles.addToCart} 
                            onPress={handleAddToCart}
                            disabled={cart.some(item => item._id === product._id)}
                          >
                            <Text style={{color: 'white'}}>{cart.some(item => item._id === product._id) ? "Added to the Cart" : "Add to cart"}</Text>
                          </TouchableOpacity>

                        </>
                        }
                      </View>
                      :
                      <Text style={styles.invalid}>Only Users Can Buy</Text>
                    }
                  </View>
                  <View style={styles.rightBottom}>
                    <TouchableOpacity style={styles.sellerLink} onPress={() => navigation.navigate('Seller', {id: product.seller.id})}>
                      <Image
                        style={styles.sellerLogo}
                        source={{ uri: `https://kckticaretapi.onrender.com/images/${product?.seller.profilePicture}` }}
                        resizeMode='stretch'
                      />
                      <Text style={styles.sellerCompany}>{product.seller.company}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
            {
              recommendedProducts.length >= 10 &&
                <View style={styles.products}>
                    <Text style={{marginTop: 5, marginLeft: 5, fontWeight: 'bold', fontSize: 16}}>Recommended Products</Text>
                    <ScrollView horizontal style={styles.productContainer}  showsHorizontalScrollIndicator={false}>
                    {recommendedProducts?.map((product) => (
                            <Product product={product} key={product._id}/>
                    ))}
                    </ScrollView>
                </View>
            }
            <View style={styles.reviews}>
              <View style={styles.starsContainer}>
                  <Rating imageSize={18} reviewSize={0} startingValue={product?.star} readonly={true}/>
                  <Text>({product?.comments?.length})</Text>
              </View>
              {
                comments.length !== 0 &&
                <View style={styles.commentSort}>
                  <View style={styles.dropDownMenu}>
                      <TouchableOpacity style={styles.dropDownButton} onPress={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
                          <Text style={{textAlign: 'center', fontWeight: 'bold'}}>{sortType}</Text>
                      </TouchableOpacity>
                      <View style={styles.categoriesList}>
                          {
                              isSortDropdownOpen &&
                              <>
                                  {
                                      sortType !== 'The Newest' &&
                                      <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Newest')}}>
                                          <Text style={{textAlign: 'center', marginVertical: 5}}>The Newest</Text>
                                      </TouchableOpacity>
                                  }
                                  {
                                      sortType !== 'The Oldest' &&
                                      <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Oldest')}}>
                                          <Text style={{textAlign: 'center', marginVertical: 5}}>The Oldest</Text>
                                      </TouchableOpacity>
                                  }
                                  {
                                      sortType !== 'The Lowest Rating' &&
                                      <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Lowest Rating')}}>
                                          <Text style={{textAlign: 'center', marginVertical: 5}}>The Lowest Rating</Text>
                                      </TouchableOpacity>
                                  }
                                  {
                                      sortType !== 'The Highest Rating' &&
                                      <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Highest Rating')}}>
                                          <Text style={{textAlign: 'center', marginVertical: 5}}>The Highest Rating</Text>
                                      </TouchableOpacity>
                                  }
                              </>
                          }
                      </View>
                  </View>
                </View>
              }
            </View>
            <Comments comments={comments} sortOption={sortType}/>
          </>
        :
          <ActivityIndicator style={{alignSelf: 'center'}} size='large' color="gray" />
      }
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  campaignInfo: {
    margin: 10,
    backgroundColor: '#ff7300',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timer: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#eceaea',
  },
  productInfo: {
    alignItems: 'center',
  },
  productImage: {
    width: 250,
    height: 250,
    borderRadius: 10,
    marginTop: 5
  },
  productInfoTopRight: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  campaign: {
    color: '#f44336',
    fontSize: 10,
    alignSelf: 'flex-end',
    marginBottom: 10
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  oldPrice: {
    textDecorationLine: 'line-through',
    color: '#888',
    marginRight: 5
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#f44336',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888'
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
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
  quantitySelectButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    paddingHorizontal: 8
  },
  quantitySelect: {
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#cccccc'
  },
  addToCart: {
    backgroundColor: '#2196f3',
    borderWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  added: {
    backgroundColor: '#888',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  sellerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    padding: 10,
  },
  sellerLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#888',
    marginRight: 5
  },
  sellerCompany: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviews: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15,
    padding: 5,
    borderRadius: 5,
    marginBottom: 0,
    borderBottomWidth: 1
  },
  starsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: 10,
  },
  dropDownMenu: {
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10
  },
  dropDownButton: {
    padding: 2,
    borderWidth: 1,
    borderRadius: 5
  },
  categoriesList: {
    gap: 2,
  },
  category: {
    margin: 3,
  },
  invalid: {
    color: 'red',
    textAlign: 'center',
    fontSize: 15
  }
})