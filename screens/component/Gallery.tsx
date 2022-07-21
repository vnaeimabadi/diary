import React, {useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {View, FlatList, Image, TouchableOpacity} from 'react-native';
import {COLORS, SIZES, icons} from '../../constants/index';
import {changedDatabaseAction} from '../../store/databaseChanges';

const Gallery = () => {
  const dispatch = useDispatch();

  const selectedImage = useSelector(state => state.selectedImage);
  const images = useSelector(state => JSON.parse(state.images));
  const flatListRef = useRef();

  const closeGalleryHandler = () => {
    dispatch(changedDatabaseAction.showGallery(0));
    dispatch(changedDatabaseAction.updateGalleryImages(null));
  };

  const renderImages = () => {
    const renderImageList = ({item, index}: any) => {
      return (
        <View
          style={{
            height: SIZES.width,
            width: SIZES.width / 1.1,
            borderRadius: 5,
            marginHorizontal: 15,
          }}>
          <Image
            style={{
              height: '100%',
              resizeMode: 'cover',
              borderRadius: 5,
            }}
            source={{uri: item.path}}
          />
        </View>
      );
    };

    return (
      <View>
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          style={{height: SIZES.height}}
          contentContainerStyle={{
            alignSelf: 'center',
          }}
          data={images}
          keyExtractor={item => `img-${item.id}`}
          renderItem={renderImageList}
        />
      </View>
    );
  };

  useEffect(() => {
    if (
      selectedImage != null &&
      selectedImage != undefined &&
      selectedImage != ''
    )
      setTimeout(() => {
        flatListRef?.current.scrollToIndex({
          index: selectedImage,
          animated: true,
        });
      }, 300);
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        zIndex: 100,
      }}>
      <View
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: COLORS.black,
          opacity: 0.6,
        }}
      />
      {renderImages()}
      <View
        style={{
          position: 'absolute',
          left: 16,
          top: 16,
        }}>
        <TouchableOpacity onPress={closeGalleryHandler}>
          <View
            style={{
              height: 30,
              width: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image style={{width: 25, height: 25}} source={icons.close} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Gallery;
