import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {queryDiaryListsById, deleteSingleDiary} from '../database/allSchemas';

import {useDispatch, useSelector} from 'react-redux';
import {changedDatabaseAction} from '../store/databaseChanges';

import {COLORS, FONTS, SIZES, icons} from '../constants';
import Gallery from './component/Gallery';

const DiaryDetail = ({navigation, route}: any) => {
  const id = route.params.id;
  const yearId = route.params.yearId;

  const dispatch = useDispatch();
  const detailChanged = useSelector(status => status.singleDiaryEdited);

  const selectedIndex = useRef(0);
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(null);
  const [images, setImages] = useState([]);

  const showGallery = useSelector(state => state.show);

  const reloadData = () => {
    queryDiaryListsById(yearId)
      .then(data => {
        // setDiaryList(data);
        let dd = data[0].diaries.filter((da: any, index: any) => {
          if (da.id === id) {
            selectedIndex.current = index;
            // return da.id == id;
            return da;
          }
        });
        setTitle(dd[0].title);
        setDetails(dd[0].content);
        setDate(dd[0].createdTs);

        setImages(dd[0].images);
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
        // setDiaryList([]);
      });
  };

  const editDearyHandler = () => {
    let temp: any = [];
    if (images != null && images.length > 0) {
      images.map((item: any) => {
        temp.push({id: item.id, uri: item.path, mime: ''});
      });
    }
    navigation.navigate('AddEditDiary', {
      yearId: yearId,
      date: date.toString(),
      id: id,
      title: title,
      content: details,
      selectedIndex: selectedIndex.current,
      images: JSON.stringify(temp),
    });
  };

  const dialogBoxHandler = () =>
    Alert.alert('Delete Diary', 'Are your sure you want to delete?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'delete', onPress: deleteDearyHandler},
    ]);

  const deleteDearyHandler = () => {
    //
    deleteSingleDiary(yearId, selectedIndex.current)
      .then(() => {
        dispatch(changedDatabaseAction.singleDiaryDeleted());
        navigation.goBack();
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
      });
  };

  const renderHeader = () => {
    return (
      <View>
        <View
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            display: 'flex',
            flexDirection: 'row',
          }}>
          {/*diary delete button*/}
          <TouchableOpacity onPress={dialogBoxHandler}>
            <View
              style={{
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Image
                style={{width: 15, height: 15 * 1.5, marginLeft: 5}}
                source={icons.delete_icon}
              />
            </View>
          </TouchableOpacity>

          {/*diary edit button*/}
          <TouchableOpacity onPress={editDearyHandler} style={{marginLeft: 10}}>
            <View
              style={{
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 10,
              }}>
              <Image style={{width: 22, height: 22}} source={icons.edit_icon} />
            </View>
          </TouchableOpacity>
        </View>

        {/* diary logo */}
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginLeft: -10, marginRight: 10}}>
            <View
              style={{
                height: 30,
                width: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                style={{width: 25 / 2, height: 25}}
                source={icons.back_icon}
              />
            </View>
          </TouchableOpacity>
          <Image style={{width: 50 / 1.3, height: 50}} source={icons.logo} />
        </View>
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <View>
        <Text
          style={{
            marginTop: SIZES.padding,
            height: 40,
            color: COLORS.black,
            ...FONTS.body2,
          }}>
          {title}
        </Text>
      </View>
    );
  };

  const renderImages = () => {
    const renderImageList = ({item, index}: any) => {
      return (
        <View
          style={{
            height: '100%',
            width: 80,
            borderRadius: 5,
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(
                changedDatabaseAction.updateGalleryImages(
                  JSON.stringify(images),
                ),
              );
              dispatch(changedDatabaseAction.showGallery(index));
            }}>
            <Image
              style={{
                width: 80,
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 5,
              }}
              source={{uri: item.path}}
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View>
        <FlatList
          horizontal
          style={{height: 100}}
          contentContainerStyle={{
            height: '80%',
            alignSelf: 'center',
          }}
          data={images}
          keyExtractor={item => `img-${item.id}`}
          renderItem={renderImageList}
        />
      </View>
    );
  };

  const renderContent = () => {
    return (
      <ScrollView>
        <View>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.body3,
              paddingRight: 5,
            }}>
            {details}
          </Text>
        </View>
      </ScrollView>
    );
  };

  useEffect(() => {
    reloadData();
  }, [detailChanged]);

  return (
    <View style={styles.container}>
      {renderHeader()}

      {/* images */}
      {images.length > 0 ? renderImages() : null}

      {renderTitle()}

      {renderContent()}

      {showGallery ? <Gallery /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: COLORS.lightYellow,
  },
  inputs: {
    minHeight: 40,
    marginLeft: 16,
    overflow: 'hidden',
    paddingRight: 25,
    borderBottomColor: '#000000',
    flex: 1,
    position: 'absolute',
    width: '100%',
  },
});

export default DiaryDetail;
