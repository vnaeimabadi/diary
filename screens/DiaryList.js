import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
} from 'react-native';

import {queryDiaryListsById} from '../database/allSchemas';

import {useSelector} from 'react-redux';

import {icons, FONTS, SIZES, COLORS} from '../constants/index';

const PLACE_ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width / 1.25 : SIZES.width / 1.2;

let firstUpdate = true;
let firstAdd = true;
let firstDelete = true;
const DiaryList = ({navigation, route}) => {
  const yearId = route.params.yearId;
  const [diaryList, setDiaryList] = useState([]);
  const isDeleted = useRef(false);
  const isEmptyList = useRef(false);
  const flatListRef = useRef();
  const sortType = useRef('descending');

  const detailChanged = useSelector(status => status.singleDiaryEdited);
  const newDiaryAdded = useSelector(status => status.singleDiary);
  const diaryDeleted = useSelector(status => status.singleDiaryDeleted);

  const addNewDiaryHandler = () => {
    navigation.navigate('AddEditDiary', {yearId: yearId});
  };
  const singleDiaryHandler = id => {
    isDeleted.current = true;
    navigation.navigate('DiaryDetail', {id: id, yearId: yearId});
  };

  const reloadData = scrollToTop => {
    queryDiaryListsById(yearId)
      .then(data => {
        if (data.length > 0) {
          if (data[0].diaries.length > 0) {
            isEmptyList.current = false;
            let items = [...data[0].diaries].sort(
              (a, b) => b.createdTs - a.createdTs,
            );
            setDiaryList(items);
            if (scrollToTop) {
              setTimeout(() => {
                flatListRef.current.scrollToOffset({animated: true, offset: 0});
              }, 200);
            }
          } else {
            isEmptyList.current = true;
            setDiaryList([]);
          }
        } else {
          isEmptyList.current = true;
          setDiaryList([]);
        }
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
        setDiaryList([]);
      });
  };

  const sortByDateHandler = () => {
    isDeleted.current = false;
    if (sortType.current === 'ascending') {
      sortType.current = 'descending';
      let items = [...diaryList].sort((a, b) => b.createdTs - a.createdTs);

      setDiaryList(items);
    } else {
      sortType.current = 'ascending';
      let items = [...diaryList].sort((a, b) => a.createdTs - b.createdTs);

      setDiaryList(items);
    }
  };

  const renderHeader = () => {
    return (
      <View style={{padding: 20}}>
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
          <View style={{display: 'flex', flexDirection: 'row'}}>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
              }}>
              <Image
                style={{width: 50 / 1.3, height: 50}}
                source={icons.logo}
              />

              <Text
                style={{
                  ...FONTS.h3,
                  marginTop: 10,
                }}>{` My-Diary-${yearId}`}</Text>
            </View>
          </View>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Text style={{...FONTS.h3, marginTop: 10}}>
            What happended today?
          </Text>
          <TouchableOpacity onPress={sortByDateHandler}>
            <View
              style={{
                width: 30,
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image style={{width: 30, height: 30}} source={icons.sort_icon} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderDiaryList = () => {
    const renderItem = ({item, index}) => {
      const longDate =
        item.createdTs.toString().split(' ')[0] +
        ' ' +
        item.createdTs.toString().split(' ')[1] +
        ' ' +
        item.createdTs.toString().split(' ')[2];
      const time = item.createdTs.toString().split(' ')[4];
      return (
        <View
          style={{
            width: PLACE_ITEM_SIZE,
            marginTop: 10,
            height: 80,
            alignItems: 'center',
          }}>
          <TouchableWithoutFeedback onPress={() => singleDiaryHandler(item.id)}>
            <View>
              <View
                style={{
                  backgroundColor: 'red',
                  height: '100%',
                  borderRadius: 10,
                  padding: 10,
                  width: PLACE_ITEM_SIZE - 2,
                }}>
                <Text
                  style={{
                    ...FONTS.body3,
                    color: COLORS.white,
                    fontWeight: 'bold',
                  }}>
                  {item.title}
                </Text>
                <View style={{display: 'flex', flex: 1}} />
                <View
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
                    {longDate}
                  </Text>
                  <Text style={{color: COLORS.white, fontWeight: 'bold'}}>
                    {time}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    };

    return (
      <FlatList
        ref={flatListRef}
        data={diaryList}
        contentContainerStyle={{alignItems: 'center'}}
        scrollEventThrottle={16}
        decelerationRate={0}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
    );
  };

  const renderDiaryAddButtonIfEmptyDiaryList = () => {
    return (
      <TouchableWithoutFeedback onPress={addNewDiaryHandler}>
        <View
          style={{
            display: 'flex',
            flex: 1,
            marginBottom: '10%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              position: 'absolute',
              left: '10%',
              right: '10%',
              top: '5%',
              bottom: '5%',
              backgroundColor: '#4079Ca',
              borderRadius: 30,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.logo}
              style={{width: 120 / 1.3, height: 120}}
            />
            <Text style={{...FONTS.body2, color: 'white', marginTop: 50}}>
              ADD TODAY'S STORY
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderAddStoryButton = () => {
    return (
      <TouchableWithoutFeedback onPress={addNewDiaryHandler}>
        <View
          style={{
            position: 'absolute',
            right: 0,
            bottom: 0,
            minWidth: 100,
            height: 50,
            backgroundColor: '#3663A8',
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            borderTopLeftRadius: 25,
          }}>
          <Text style={{color: 'white', ...FONTS.h3, textAlign: 'center'}}>
            Add Story
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  useEffect(() => {
    isDeleted.current = false;
    reloadData(false);
    Keyboard.dismiss();
  }, []);

  useEffect(() => {
    if (firstAdd) {
      firstAdd = false;
      return;
    }
    isDeleted.current = false;
    reloadData(true);
    Keyboard.dismiss();
  }, [newDiaryAdded]);

  useEffect(() => {
    if (firstUpdate) {
      firstUpdate = false;
      return;
    }
    isDeleted.current = false;
    reloadData(false);
    Keyboard.dismiss();
  }, [detailChanged]);

  useEffect(() => {
    if (firstDelete) {
      firstDelete = false;
      return;
    }
    isDeleted.current = false;
    reloadData(false);
    Keyboard.dismiss();
  }, [diaryDeleted]);

  return (
    <View style={styles.container}>
      {renderHeader()}

      {diaryList.length > 0 && !isDeleted.current
        ? renderDiaryList()
        : isEmptyList.current == true
        ? renderDiaryAddButtonIfEmptyDiaryList()
        : null}

      <View style={{height: 55}} />

      {renderAddStoryButton()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: COLORS.lightYellow,
  },
});

export default DiaryList;
