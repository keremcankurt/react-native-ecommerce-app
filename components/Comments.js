import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Rating } from 'react-native-ratings';
import { useState } from 'react';
import Pagination from './Pagination';

export default function Comments({comments, sortOption}) {
  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 5;
  const sortComments = (option) => {
    switch (option) {
      case 'The Newest':
        return comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'The Oldest':
        return comments.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'The Highest Rating':
        return comments.sort((a, b) => b.star - a.star);
      case 'The Lowest Rating':
        return comments.sort((a, b) => a.star - b.star);
      default:
        return comments;
    }
  };

  const sortedComments = sortComments(sortOption);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const indexOfLastItem = currentPage * commentsPerPage;
  const indexOfFirstItem = indexOfLastItem - commentsPerPage;
  const currentItems = sortedComments?.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <View style={styles.comments}>
        {
            currentItems.length > 0 ?
            currentItems.map((comment) => (
                <View style={styles.comment} key={comment._id}>
                    <View style={styles.commentHeader}>
                        <Image
                            style={styles.userAvatar}
                            source={comment.user.profilePicture ? { uri: `https://kckticaretapi.onrender.com/images/${comment?.user.profilePicture}` }:  require('../assets/default-user.png')}
                            resizeMode='stretch'
                        />
                        <Text style={styles.userName}>{comment.user.fullName}</Text>
                        <View style={styles.starsContainer}>
                            <Rating imageSize={18} reviewSize={0} startingValue={comment?.star} readonly={true}/>
                        </View>
                    </View>
                    <Text style={styles.commentText}>{comment.text}</Text>
                    <Text style={styles.createdAt}>{new Date(comment.createdAt).toLocaleDateString()}</Text>
                </View>
            ))
            :
            <Text style={styles.noComments}>Not yet evaluated</Text>
        }
        <Pagination
            itemsPerPage={commentsPerPage}
            totalItems={comments?.length}
            paginate={paginate}
            currentPage={currentPage}  
        />
    </View>
  )
}

const styles = StyleSheet.create({
    comments: {
        backgroundColor: 'white',
        margin: 15,
        marginTop: 0,
        padding: 5,
        borderRadius: 5,
    },
    comment: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
        position: 'relative',
    },
    commentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    userAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 10
    },
    userName: {
        fontWeight: 'bold',
        marginRight: 10
    },
    commentText: {
        fontSize: 10
    },
    createdAt: {
        position: 'absolute',
        top: 0,
        right: 0,
        margin: 10,
        color: '#888'
    },
    noComments: {
        textAlign: 'center',
        color: '#888',
    }
})