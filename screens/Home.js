import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getCampaignsandStores } from '../features/user/userService';
import { getRecommendedCampaignProducts, getRecommendedDressProducts, getRecommendedTechnologyProducts } from '../features/product';
import Product from '../components/Product';
import { useNavigation } from '@react-navigation/native';
import { useFilterContext } from '../context/filterContext';
import CampaignModal from '../components/CampaignModal';

export default function Home() {
    const [campaigns, setCampaigns] = useState([]);
    const [stores, setStores] = useState([]);
    const [visible, setVisible] = useState(false);
    const [campaignId, setCampaignId] = useState(null);
    const navigation = useNavigation()

    const {
        setSelectedCategories,
        setApply,
        reset,
        apply
    } = useFilterContext();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCampaignsandStores();
                const result = await response.json();
                if (!response.ok) {
                    throw new Error(result.message);
                }
                setCampaigns(result.campaigns);
                setStores(result.stores);
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
    }, []);

    const [RCP, setRCP] = useState()
    const [RTP, setRTP] = useState()
    const [RDP, setRDP] = useState()
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getRecommendedCampaignProducts();
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setRCP(result.products)
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
      }, []);
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getRecommendedTechnologyProducts();
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setRTP(result)
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
        };
        fetchData();
      }, []);
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getRecommendedDressProducts();
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            setRDP(result)
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
        };
        fetchData();
      }, []);

    const clickCampaign = (id) => {
        setCampaignId(id);
        setVisible(true)
    };
    const clickStore = (id) => {
        navigation.navigate('Seller', {id})
    };


    return (
        <ScrollView>
            {campaigns.length > 0 && (
            <ScrollView horizontal style={styles.carouselContainer}  showsHorizontalScrollIndicator={false}>
            {campaigns.map((campaign) => (
                <TouchableOpacity
                    key={campaign._id}
                    style={styles.campaign}
                    onPress={() => clickCampaign(campaign._id)}
                >
                    <Image
                        style={styles.campaignImage}
                        source={{ uri: `https://kckticaretapi.onrender.com/images/${campaign?.img}` }}
                        resizeMode='stretch'
                    />
                </TouchableOpacity>
            ))}
            </ScrollView>
            )}
            {
                stores?.length > 0 &&
                <View style={styles.stores}>
                    <Text style={{textAlign: 'center', marginVertical: 10, fontWeight: 'bold', fontSize: 18}}>Stores</Text>
                    <ScrollView horizontal style={styles.storesCarouselContainer}  showsHorizontalScrollIndicator={false}>
                    {stores.map((store) => (
                        <TouchableOpacity
                            key={store.id}
                            style={styles.store}
                            onPress={() => clickStore(store.id)}
                        >
                            <Image
                                style={styles.storeImage}
                                source={{ uri: `https://kckticaretapi.onrender.com/images/${store?.profilePicture}` }}
                                resizeMode='stretch'
                            />
                            <Text>{store.company}</Text>
                        </TouchableOpacity>
                    ))}
                    </ScrollView>
                </View>
            }

            {
                RCP?.length > 0 &&
                <View style={styles.products}>
                    <Text style={{marginTop: 5, marginLeft: 5, fontWeight: 'bold', fontSize: 16}}>Recommended Campaign Products</Text>
                    <ScrollView horizontal style={styles.storesCarouselContainer}  showsHorizontalScrollIndicator={false}>
                    {RCP?.map((product) => (
                            <Product product={product} key={product._id}/>
                    ))}
                    </ScrollView>
                </View>
            }
            {
                RTP?.length > 0 &&
                <View>
                    <View style={styles.categories}>
                        <TouchableOpacity style={styles.category} onPress={() => {
                            reset()
                            setApply(apply + 1)
                            setSelectedCategories([1])
                            navigation.navigate('Search')
                        }}>
                            <Text>Computer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.category} onPress={() => {
                            reset()
                            setApply(apply + 1)
                            setSelectedCategories([3])
                            navigation.navigate('Search')
                        }}>
                            <Text>Phone</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.category} onPress={() => {
                            reset()
                            setApply(apply + 1)
                            setSelectedCategories([2])
                            navigation.navigate('Search')
                        }}>
                            <Text>Tablet</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.products}>
                        <Text style={{marginTop: 5, marginLeft: 5, fontWeight: 'bold', fontSize: 16}}>Recommended Technology Products</Text>
                        <ScrollView horizontal style={styles.storesCarouselContainer}  showsHorizontalScrollIndicator={false}>
                        {RTP?.map((product) => (
                                <Product key={product._id} product={product}/>
                        ))}
                        </ScrollView>
                    </View>
                </View>
            }
            {
                RDP?.length > 0 &&
                <View>
                    <View style={styles.categories}>
                        <TouchableOpacity style={styles.category} onPress={() => {
                            reset()
                            setApply(apply + 1)
                            setSelectedCategories([4])
                            navigation.navigate('Search')
                        }}>
                            <Text style={{fontSize: 12}}>Women's Wear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.category} onPress={() => {
                            reset()
                            setApply(apply + 1)
                            setSelectedCategories([5])
                            navigation.navigate('Search')
                        }}>
                            <Text style={{fontSize: 12}}>Kids' Wear</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.category} onPress={() => {
                            reset()
                            setApply(apply + 1)
                            setSelectedCategories([6])
                            navigation.navigate('Search')
                        }}>
                            <Text style={{fontSize: 12}}>Men's Wear</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.products}>
                        <Text style={{marginTop: 5, marginLeft: 5, fontWeight: 'bold', fontSize: 16}}>Recommended Clothing Prodcuts</Text>
                        <ScrollView horizontal style={styles.storesCarouselContainer}  showsHorizontalScrollIndicator={false}>
                        {RDP?.map((product) => (
                            <Product key={product._id} product={product}/>
                        ))}
                        </ScrollView>
                    </View>
                </View>
            }
            <CampaignModal id={campaignId} visible={visible} onClose={() => setVisible(false)}/>
        </ScrollView>
    );
}

const {width, height} = Dimensions.get('window')
const styles = StyleSheet.create({
    carouselContainer: {
        flexDirection: 'row',
        width: width - 10,
        height: height / 4,
    },
    campaign: {
        padding: 5,
    },
    campaignImage: {
        width: width - 10,
        height: height / 4,
        resizeMode: 'cover',
        borderRadius: 5
    },
    storesCarouselContainer: {
        flexDirection: 'row',
        width: width - 10,
    },
    stores: {
        width: width,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    store: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 25
    },
    storeImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: 'gray'
    },
    products: {
        backgroundColor: '#e7e5e5',
        marginTop: 10
    },
    categories: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
        marginTop: 10
    },
    category: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: '#dddddd',
    }
});
