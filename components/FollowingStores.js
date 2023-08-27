import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { getAllFollowingSellers } from '../features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import FollowingStore from './FollowingStore';
import { useEffect } from 'react';

export default function FollowingStores() {
  const {followingStores} = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  useEffect(() => {
      dispatch(getAllFollowingSellers());
  },[dispatch, followingStores])
  return (
    <View style={styles.container}>
      {followingStores?.length !== 0 ? 
        <FlatList
          showsVerticalScrollIndicator={false}
          style={styles.stores}
          data={followingStores}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => 
          <FollowingStore store={item} key={item._id} />}
          numColumns={2}
        />
        :
        <Text>There is no store that you follow.</Text>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },
  stores: {
  }
})