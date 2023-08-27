import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useLayoutEffect, useState } from 'react'
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import { getSeller } from '../features/seller/sellerService';
import { follow, unfollow } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import SearchBar from '../components/SearchBar';
import Product from '../components/Product';
import Pagination from '../components/Pagination';

export default function Seller({route, navigation}) {
  const [products, setProducts] = useState([]);
  const [seller, setSeller] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [followerCount, setFollowerCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [itemsPerPage] = useState(6);


  const { id } = route.params
  useLayoutEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSeller(id);
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message);
        }
        setProducts(result.products);
        setSeller(result.seller);
        setFollowerCount(result.seller.seller.followerCount);
        navigation.setOptions({
            title: `${result?.seller?.seller?.company}`,
        });
      } catch (error) {
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

  const {user} = useSelector(
    (state) => state.user
   );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const filteredProducts = products.filter(
    (product) => product.name.toLowerCase().includes(searchText.toLowerCase())
  );
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  const dispatch = useDispatch();
  const handleUnfollow = () => {
    setIsLoading(true)
    dispatch(unfollow(id)).then(() => {
    setFollowerCount(followerCount-1)
    setIsLoading(false)
  }
    )
  }
  const handleFollow = () => {
    setIsLoading(true)
    dispatch(follow(id)).then(() => {
      setIsLoading(false)
      setFollowerCount(followerCount+1)
    })
  }

  return (
    <View style={styles.container}>
    {
        seller ?
        <>
            <View style={styles.profile}>
                <Image 
                    style={styles.profilePicture}
                    source={{ uri: `https://kckticaretapi.onrender.com/images/${seller?.profilePicture}` }}
                    resizeMode='stretch'
                />
                <View style={styles.infos}>
                    <Text style={styles.name}>{seller?.seller?.company}</Text>
                    <Text style={styles.productCount}>Number of Products: {products?.length || 0}</Text>
                </View>
                <View style={styles.followSection}>
                    {
                        user && !user?.seller?.isSeller && user?.followings.some(_id => _id === id.toString()) 
                        ? 
                        <TouchableOpacity style={styles.unfollowButton} disabled={isLoading} onPress={handleUnfollow}>
                        {
                          isLoading ? <ActivityIndicator style={{alignSelf: 'center'}}  color="gray" /> :
                          <>
                            <Text>Unfollow</Text>
                            <Text style={styles.followerCount}>{followerCount || 0}</Text>
                          </>
                          
                        }
                        
                        </TouchableOpacity>
                        :
                        user && !user?.seller?.isSeller  
                        ? 
                        <TouchableOpacity style={styles.followButton} disabled={isLoading} onPress={handleFollow}>
                          {
                            isLoading ? <ActivityIndicator style={{alignSelf: 'center'}}  color="gray" /> :
                            <>
                              <Text>Follow</Text>
                              <Text style={styles.followerCount}>{followerCount || 0}</Text>
                            </>
                          }
                        
                        </TouchableOpacity>
                        :
                        <View style={styles.followButton}>
                            <Text>Number of Followers: </Text>
                            <Text style={styles.followerCount}>{followerCount || 0}</Text>
                        </View>
                    }
                </View>

            </View>
            <Text style={styles.title}>Products</Text>
            {
                products?.length !== 0 ? (
                    <>
                        <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                        {
                            currentItems?.length !== 0 ?
                            <FlatList
                                showsVerticalScrollIndicator={false}
                                style={styles.products}
                                data={currentItems}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => 
                                  <Product product={item} />
                                }
                                numColumns={2} 
                            />
                            :
                            <Text style={styles.noProducts}>The product you are looking for could not be found</Text>
                        }
                        <Pagination
                            itemsPerPage={itemsPerPage}
                            totalItems={filteredProducts?.length}
                            paginate={paginate}
                            currentPage={currentPage}
                        />
                    </>
                )
                :
                <Text style={styles.noProducts}>There are no products belonging to the seller.</Text>
            }
        </>
        :
        <ActivityIndicator style={{alignSelf: 'center'}} size="large" color="gray" />
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
    profile: {
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 2,
        width: '98%'
    },
    profilePicture: {
        width: 75,
        height: 75,
        borderRadius: 50,
        resizeMode: 'cover', 
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    productCount: {
        fontSize: 14,
        marginBottom: 8,
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#ececec',
        borderColor: 'gray',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
        marginVertical: 1,
    },
    followSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    followButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#3498db',
        color: '#fff',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontSize: 14,
      },
      unfollowButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: '#eb2626',
        color: '#fff',
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 20,
        fontSize: 14,
      },
      followerCount: {
        fontSize: 10,
        marginLeft: 5,
        backgroundColor: '#f0f0f0',
        paddingVertical: 2,
        paddingHorizontal: 5,
        borderRadius: 5,
        color: '#888',
      },
      title: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
      },
      noProducts: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'gray',
        marginTop: 10
      }
})