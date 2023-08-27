import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  if (totalItems < 6) {
    return null;
  }
  return (
    <View style={styles.pagination}>
      <View style={styles.paginationItems}>
        <TouchableOpacity
          onPress={() => paginate(currentPage - 1)}
          style={[
            styles.pageItem,
            { opacity: currentPage <= 1 ? 0.5 : 1 },
          ]}
          disabled={currentPage === 1}
        >
          <Text style={styles.pageLink}>Previous</Text>
        </TouchableOpacity>
        {pageNumbers.map((number) => (
          <TouchableOpacity
            key={number}
            onPress={() => paginate(number)}
            style={[
              styles.pageItem,
              currentPage === number && styles.activePageItem,
            ]}
          >
            <Text
              style={[
                styles.pageLink,
                currentPage === number && styles.activePageLink,
              ]}
            >
              {number}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          onPress={() => paginate(currentPage + 1)}
          style={[
            styles.pageItem,
            { opacity: currentPage === pageNumbers.length ? 0.5 : 1 },
          ]}
          disabled={currentPage === pageNumbers.length}
        >
          <Text style={styles.pageLink}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  pagination: {
    alignItems: 'center',
    marginVertical: 10,
  },
  paginationItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pageItem: {
    marginHorizontal: 5,
    opacity: 1,
  },
  activePageItem: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  pageLink: {
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 10,
    color: '#333',
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },
  activePageLink: {
    backgroundColor: '#333',
    color: '#fff',
    borderColor: '#333',
  },
});

export default Pagination;
