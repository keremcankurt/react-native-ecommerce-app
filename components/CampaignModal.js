import { Dimensions, Modal, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { categories } from '../helper/categories'
import { useEffect } from 'react'
import { useState } from 'react'
import { getCampaignProducts } from '../features/product'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import Product from './Product'
import SearchBar from './SearchBar'
import Pagination from './Pagination'

export default function FilterModal({ visible, onClose, id }) {
    const [products, setProducts] = useState()
    const [searchText, setSearchText] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getCampaignProducts(id);
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        setProducts(result.products)
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
    setSearchText('')
    setProducts([])
    id && fetchData();
  }, [id]);
  const filteredProducts = products?.filter(product => product.name.toLowerCase().includes(searchText.toLowerCase()));
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts?.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <View>
        <Modal animationType='slide' transparent={true} visible={visible}>
            <View style={styles.modal}> 
                <SearchBar searchText={searchText} setSearchText={setSearchText}/>
                {
                    currentItems?.length > 0 ?
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        style={styles.products}
                        data={currentItems}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item }) => 
                            <Product product={item} />}
                        numColumns={2} 
                    />
                    :
                    <Text style={{fontWeight: 'bold', color: 'gray', textAlign: 'center'}}>No product was found with this name</Text>
                }
                <Pagination
                    itemsPerPage={itemsPerPage}
                    totalItems={filteredProducts?.length}
                    paginate={paginate}
                    currentPage={currentPage}  
                />
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalBg}/>
            </TouchableWithoutFeedback>
        </Modal>
    </View>
  )
}

const {width} = Dimensions.get('window')
const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: '#f5f4f4',
        height: '90%',
        width: width,
        zIndex: 1000,
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
})