import { Dimensions, Modal, StatusBar, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View, Checkbox, TouchableOpacity } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { Entypo } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { useFilterContext } from '../context/filterContext'
import { categories } from '../helper/categories'

export default function FilterModal({ visible, onClose }) {
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false)
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false)
    const {
        selectedCategories,
        setSelectedCategories,
        isChecked,
        setIsChecked,
        sortType,
        setSortType,
        minPrice,
        setMinPrice,
        maxPrice,
        setMaxPrice,
        search,
        setSearch,
        apply,
        setApply
    } = useFilterContext();

    const navigation = useNavigation()
    const handleCheckbox = () => {
        setIsChecked(!isChecked)
    }

      const handleSelectCategory = id => {
        if(selectedCategories.includes(id)){
            const updatedCategories = selectedCategories.filter(_id => _id !== id)
            setSelectedCategories(updatedCategories);
        }else{
            setSelectedCategories([...selectedCategories, id]);
        }
      }

      const handleApply = () => {
        setApply(apply+1)
        navigation.navigate('Search')
        onClose()

      }
  return (
    <>
        <Modal animationType='fade' transparent={true} visible={visible}>
            <View style={styles.modal}>
                <Text style={styles.title}>Filter</Text>
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
                                    sortType !== 'The Lowest Price' &&
                                    <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Lowest Price')}}>
                                        <Text style={{textAlign: 'center', marginVertical: 5}}>The Lowest Price</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    sortType !== 'The Highest Price' &&
                                    <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Highest Price')}}>
                                        <Text style={{textAlign: 'center', marginVertical: 5}}>The Highest Price</Text>
                                    </TouchableOpacity>
                                }
                                {
                                    sortType !== 'The Most Popular' &&
                                    <TouchableOpacity onPress={() => {setIsSortDropdownOpen(!isSortDropdownOpen); setSortType('The Most Popular')}}>
                                        <Text style={{textAlign: 'center', marginVertical: 5}}>The Most Popular</Text>
                                    </TouchableOpacity>
                                }
                            </>
                        }
                    </View>
                </View>
                <TextInput
                    numberOfLines={1}
                    style={styles.search}
                    placeholder='Search...'
                    value={search}
                    onChangeText={setSearch}
                />
                <View style={styles.priceFilter}>
                    <View style={styles.price}>
                        <Text>Min</Text>
                        <TextInput
                            numberOfLines={1}
                            style={styles.priceInput}
                            keyboardType="numeric"
                            placeholder='1'
                            value={minPrice}
                            onChangeText={setMinPrice}
                        />
                    </View>
                    <View style={styles.price}>
                        <Text>Max</Text>
                        <TextInput
                            numberOfLines={1}
                            style={styles.priceInput}
                            keyboardType="numeric"
                            placeholder='99999'
                            value={maxPrice}
                            onChangeText={setMaxPrice}
                        />
                    </View>
                </View>
                <View style={styles.checkbox}>
                    <TouchableOpacity style={isChecked ? styles.checked : styles.unChecked} onPress={handleCheckbox}>
                        {isChecked && <Entypo name='check' size={16} color='#FAFAFA'/>}
                    </TouchableOpacity>
                    <Text style={{color: 'gray'}}>Discounted Products</Text>
                </View>
                <View style={styles.dropDownMenu}>
                    <TouchableOpacity style={styles.dropDownButton} onPress={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}>
                        <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Categories</Text>
                    </TouchableOpacity>
                    <View style={styles.categoriesList}>
                        {
                            isCategoryDropdownOpen &&
                            categories.map(category => (
                                <View style={[styles.checkbox, styles.category]} key={category.id}>
                                    <TouchableOpacity style={selectedCategories.includes(category.id) ? styles.checked : styles.unChecked} onPress={() => handleSelectCategory(category.id)}>
                                        {selectedCategories.includes(category.id) && <Entypo name='check' size={16} color='#FAFAFA'/>}
                                    </TouchableOpacity>
                                    <Text style={{color: 'gray'}}>{category.name}</Text>
                                </View>
                            ))
                        }
                    </View>
                </View>
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <Text style={{color: 'white', textAlign: 'center', marginVertical: 5}}>Apply</Text>
                </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalBg}/>
            </TouchableWithoutFeedback>
        </Modal>
    </>
  )
}

const {width} = Dimensions.get('window')
const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        left: 0,
        backgroundColor: 'white',
        height: '100%',
        width: width / 2,
        zIndex: 1000,
        padding: 10,
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontWeight: 'bold',
        paddingBottom: 0,
        alignSelf: 'flex-start'
    },
    search: {
        width: '100%',
        borderWidth: 1,
        padding: 2,
        borderRadius: 5,
        marginVertical: 10
    },
    priceFilter: {
        flexDirection: 'row',
        gap: 5,
        alignSelf: 'flex-start',
        marginVertical: 10
    },
    price: {
        width: '50%',
    },
    priceInput: {
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 2
    },
    checkbox: {
        flexDirection: 'row',
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    checked: {
        width: 20,
        height: 20,
        marginRight: 13,
        borderRadius: 6,
        backgroundColor: '#262626',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .3,
        shadowRadius: 5,
        elevation: 5,
    },
    unChecked: {
        width: 20,
        height: 20,
        marginRight: 13,
        borderWidth: 2,
        borderRadius: 6,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: .1,
        shadowRadius: 5,
        elevation: 5,
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
    applyButton: {
        backgroundColor: '#03c403',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 4,
            height: 10,
        },
        shadowOpacity: .9,
        shadowRadius: 10,
        elevation: 10,
    }
})