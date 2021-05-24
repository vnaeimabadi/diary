import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  TouchableOpacity,
  BackHandler,
} from 'react-native';

import {useSelector} from 'react-redux';

import {queryAllDiaryLists} from '../database/allSchemas';

import {icons, FONTS, SIZES, COLORS} from '../constants/index';

const PLACE_ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width / 1.25 : SIZES.width / 1.2;
const EMPTY_ITEM_SIZE = (SIZES.width - PLACE_ITEM_SIZE) / 2;

let firstAdd = true;
const DiaryYearList = ({navigation}) => {
  const [diaryList, setDiaryList] = useState([]);
  const diaryScrollX = useRef(new Animated.Value(0)).current;
  const newDiaryYearAdded = useSelector(status => status.diaryYear);
  const userName = useSelector(status => status.userName);

  const addNewDiary = () => {
    navigation.navigate('AddEditDiary', {yearId: ''});
  };

  const SingleDiary = year => {
    navigation.navigate('DiaryList', {yearId: year});
  };

  const reloadData = () => {
    queryAllDiaryLists()
      .then(data => {
        if (data.length > 0) {
          let dat = [...data].sort((a, b) => b.year - a.year);
          setDiaryList([{id: -1}, ...dat, {id: -2}]);
        }
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
        setDiaryList([]);
      });
  };
  const renderHeader = () => {
    const renderLogout = () => {
      return (
        <View style={{position: 'absolute', top: 20, right: 20}}>
          <TouchableOpacity onPress={() => BackHandler.exitApp()}>
            <View
              style={{
                height: 30,
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomColor: COLORS.red,
                borderBottomWidth: 2,
              }}>
              <Text style={{fontWeight: 'bold'}}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View style={{padding: 20, display: 'flex'}}>
        {renderLogout()}
        <Image style={{width: 50 / 1.3, height: 50}} source={icons.logo} />
        <Text style={{...FONTS.h3}}>Good morning, {userName}!</Text>
        <Text style={{...FONTS.h6}}>
          {diaryList.length > 0
            ? 'Select Your Diary Year!'
            : 'How Have You Been Today?'}
        </Text>
      </View>
    );
  };

  const renderAddStoryButton = () => {
    return (
      <TouchableWithoutFeedback onPress={addNewDiary}>
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

  const renderDiaryBookByYear = () => {

    const renderItem=({item, index}) => 
    {
      const opacity = diaryScrollX.interpolate({
        inputRange: [
          (index - 2) * PLACE_ITEM_SIZE,
          (index - 1) * PLACE_ITEM_SIZE,
          index * PLACE_ITEM_SIZE,
        ],
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });

      let activeHeight = 0;
      if (Platform.OS === 'ios') {
        if (SIZES.height > 800) {
          activeHeight = SIZES.height / 2;
        } else {
          activeHeight = SIZES.height / 1.65;
        }
      } else {
        activeHeight = SIZES.height / 1.6;
      }

      const height = diaryScrollX.interpolate({
        inputRange: [
          (index - 2) * PLACE_ITEM_SIZE,
          (index - 1) * PLACE_ITEM_SIZE,
          index * PLACE_ITEM_SIZE,
        ],
        outputRange: [
          SIZES.height / 1.9,
          activeHeight / 1,
          SIZES.height / 1.9,
        ],
        extrapolate: 'clamp',
      });

      if (index == 0 || index == diaryList.length - 1) {
        return <View style={{width: EMPTY_ITEM_SIZE}} />;
      } else {
        return (
          <Animated.View
            opacity={opacity}
            style={{
              width: PLACE_ITEM_SIZE,
              height: height,
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback
              onPress={() => SingleDiary(item.year)}>
              <View>
                <View
                  style={{
                    backgroundColor: 'red',
                    height: '100%',
                    borderRadius: 20,
                    padding: 10,
                    width: PLACE_ITEM_SIZE - 2,
                    justifyContent: 'space-between',
                  }}>
                  <View
                    style={{
                      borderBottomColor: COLORS.white,
                      borderBottomWidth: 1,
                    }}>
                    <Text style={{...FONTS.body1, color: COLORS.white}}>
                      Diary Book
                    </Text>
                  </View>

                  <View
                    style={{
                      backgroundColor: COLORS.blue,
                      width: 90,
                      height: 50,
                      bottom: 0,
                      right: 0,
                      position: 'absolute',
                      borderTopLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  />
                  <View style={{alignItems: 'flex-end'}}>
                    <Text style={{...FONTS.body1, color: COLORS.white}}>
                      {item.year}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Animated.View>
        );
      }
    }

    return (
      <FlatList
        data={diaryList}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{alignItems: 'center', marginTop: -50}}
        snapToAlignment="center"
        snapToInterval={
          Platform.OS === 'ios' ? PLACE_ITEM_SIZE + 28 : PLACE_ITEM_SIZE
        }
        scrollEventThrottle={16}
        decelerationRate={0}
        bounces={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {x: diaryScrollX}}}],
          {useNativeDriver: false},
        )}
        renderItem={renderItem}
        keyExtractor={item => `${item.id}`}
      />
    );
  };

  const renderDiaryAddButtonIfEmptyDiaryList = () => {
    return (
      <TouchableWithoutFeedback onPress={addNewDiary}>
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

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (firstAdd) {
      firstAdd = false;
      return;
    }
    reloadData(true);
  }, [newDiaryYearAdded]);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {diaryList.length > 0
        ? renderDiaryBookByYear()
        : renderDiaryAddButtonIfEmptyDiaryList()}
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

export default DiaryYearList;
