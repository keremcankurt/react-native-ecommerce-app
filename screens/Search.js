import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { getAllProducts } from '../features/product'
import { categories } from '../helper/categories'
import { useFilterContext } from '../context/filterContext'
import { Toast } from 'react-native-toast-message/lib/src/Toast'
import Product from '../components/Product'

export default function Search() {
  const {
    selectedCategories,
    isChecked,
    sortType,
    minPrice,
    maxPrice,
    search,
    apply
} = useFilterContext();


const [page, setPage] = useState(1)
const [data, setData] = useState([])
const [isLoading, setIsLoading] = useState(true)
const fetchData = async(page) => {
  try {
    setIsLoading(true)
    let sortTypeParam= 'newest';
    switch(sortType){
      case 'The Newest':
        sortTypeParam = 'newest'
        break;
      case 'The Lowest Price':
        sortTypeParam = 'lowest-price'
        break;
      case 'The Highest Price':
        sortTypeParam = 'highest-price'
        break;
      case 'The Most Popular':
        sortTypeParam = 'most-foavorited'
        break;
    }
    const campaign = isChecked
    const categoryNames = selectedCategories?.map(categoryId => {
      const category = categories.find(item => item.id === categoryId);
      let name;
      switch(category.name){
        case 'Computer':
          name = 'Bilgisayar';
          break;
        case 'Tablet':
          name = 'Tablet';
          break;
        case 'Phone':
          name = 'Telefon';
          break;
        case "Women's Wear":
          name = 'Kadın Giyim';
          break;
        case "Kids' Wear":
          name = 'Çocuk Giyim';
          break;
        case "Men's Wear":
          name = 'Erkek Giyim';
          break;
          default:
            name = ""
            break
      }
      return name
    });
    const query= `?${sortTypeParam ? "&sortBy="+sortTypeParam : "newest"}${minPrice ? "&minPrice="+parseInt(minPrice) : ""}${maxPrice ? "&maxPrice="+parseInt(maxPrice) : ""}${page ? "&page="+page : ""}${search ? "&search="+search : ""}${categoryNames.length > 0 ? "&categories="+JSON.stringify(categoryNames) : ""}${campaign ? "&isCampaign=true" : ""}`
    const response = await getAllProducts(query)
    const result = await response.json()
    if (!response.ok) {
      throw new Error(result.message);
    }
    setData(result)
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
  finally{
    setIsLoading(false)
  }
}
  useEffect(() => {
    setPage(1)
    fetchData(1)
  },[apply])
  const nextPage = async () => {
    setPage((prevPage) => prevPage + 1);
    fetchData(page + 1)
  };
  
  
  const previousPage = () => {
    setPage(page - 1);
    fetchData(page - 1)
  };

  return (
    <View style={styles.container}>
      {
      !isLoading ?
      <>
        <FlatList
          style={styles.products}
          data={data?.products}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <TouchableOpacity>
            <Product product={item} />
          </TouchableOpacity>}
          numColumns={2} 
        />
        {
          data && Object.keys(data?.pagination)?.length > 0 &&
          <View style={styles.pagination}>
            <TouchableOpacity onPress={previousPage} style={[styles.button, !data?.pagination?.previous && styles.disabled]} disabled={!data?.pagination?.previous}>
              <Text>{'<'}</Text>
            </TouchableOpacity>
            <Text>{page}</Text>
            <TouchableOpacity onPress={nextPage} style={[styles.button, !data?.pagination?.next && styles.disabled]} disabled={!data?.pagination?.next}>
              <Text>{'>'}</Text>
            </TouchableOpacity>
          </View>
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
    marginLeft: 5,
    justifyContent: 'center',
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    margin: 2
  },
  button: {
    borderWidth: 1,
    paddingHorizontal: 5,
    backgroundColor: 'white',
    borderColor: 'gray',
    shadowColor: '#000',
    borderRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .3,
        shadowRadius: 5,
        elevation: 5,
  },
  disabled: {
    backgroundColor: '#c4c4c4'
  }
})