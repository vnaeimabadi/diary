import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Platform,
  Animated,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {useSelector} from 'react-redux';
import {updateDiaryYearImage} from '../database/allSchemas';

import {icons, FONTS, SIZES, COLORS} from '../constants/index';
import {useDiaryMachine} from '../src/hooks/machines/use-diaryMachine';

const PLACE_ITEM_SIZE =
  Platform.OS === 'ios' ? SIZES.width / 1.25 : SIZES.width / 1.2;
const EMPTY_ITEM_SIZE = (SIZES.width - PLACE_ITEM_SIZE) / 2;

let firstAdd = true;

let covers = ['orang', 'red', 'blue', 'yellow', 'green', 'pink'];
let isFirstTime = true;
const DiaryYearList = ({navigation, route}: any) => {
  const userName = route.params.userName;
  const {send, state} = useDiaryMachine();

  useEffect(() => {
    console.log('state.value===>', state.value);
    console.log('state.context===>', state?.context?.diaryList);
  }, [state]);
  const diaryScrollX = useRef(new Animated.Value(0)).current;
  const newDiaryYearAdded = useSelector(status => status.diaryYear);
  const [visibleImagePicker, setVisibleImagePicker] = useState(false);
  const coverImage = useRef('');
  const coverImageYearId = useRef('');

  const addNewDiary = () => {
    navigation.navigate('AddEditDiary', {yearId: ''});
  };

  const SingleDiary = (year: any) => {
    navigation.navigate('DiaryList', {yearId: year});
  };

  const closeHandler = () => {
    setVisibleImagePicker(false);
  };
  const addImageHandler = (data: any) => {
    // //// coverImage.current = data[0].uri;
    coverImage.current = data;

    setVisibleImagePicker(false);
    updateImage(coverImageYearId.current, coverImage.current);
  };

  const updateImage = (id: any, img: any) => {
    updateDiaryYearImage(id, img)
      .then(() => {
        // dispatch(changedDatabaseAction.singleDiaryEditedChanged());
        // console.log(data);
        reloadData();
      })
      .catch(error => {
        console.log('error-insert');
        console.log(error);
      });
  };

  const reloadData = () => {
    // queryAllDiaryLists()
    //   .then((data: any) => {
    //     if (data.length > 0) {
    //       let dat = [...data].sort((a, b) => b.year - a.year);
    //       setDiaryList([{id: -1}, ...dat, {id: -2}]);
    //     }
    //   })
    //   .catch(error => {
    //     console.log('error-reload');
    //     console.log(error);
    //     setDiaryList([]);
    //   });
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
        <Text style={{...FONTS.h4}}>Good morning, {userName}</Text>
        <Text style={{...FONTS.h2}}>
          {state?.context?.diaryList?.length > 0
            ? 'Select Your Diary Year!'
            : 'How Have You Been Today?'}
        </Text>
      </View>
    );
  };

  const restore = async () => {
    send({type: 'RESTORE'});
    // const isTrue = await restore_database();
    // if (isTrue) {
    //   reloadData();
    // }
  };

  const renderAddStoryButton = () => {
    return (
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
        <TouchableOpacity
          onPress={addNewDiary}
          style={{
            borderTopLeftRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 25,
            width: '100%',
            height: '100%',
          }}>
          <Text style={{color: 'white', ...FONTS.h3, textAlign: 'center'}}>
            Add Story
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderRestoreButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 100,
          bottom: 0,
          minWidth: 100,
          height: 50,
          backgroundColor: 'green',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
          borderTopRightRadius: 25,
        }}>
        <TouchableOpacity
          onPress={restore}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 25,
            width: '100%',
            height: '100%',
          }}>
          <Text style={{color: 'white', ...FONTS.h3, textAlign: 'center'}}>
            Restore
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderBackupButton = () => {
    return (
      <View
        style={{
          position: 'absolute',
          left: 0,
          bottom: 0,
          minWidth: 100,
          height: 50,
          backgroundColor: '#3663A8',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <TouchableOpacity
          onPress={() => send({type: 'BACKUP'})}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            borderTopRightRadius: 25,
            width: '100%',
            height: '100%',
          }}>
          <Text style={{color: 'white', ...FONTS.h3, textAlign: 'center'}}>
            Backup
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDiaryBookByYear = () => {
    const renderItem = ({item, index}: any) => {
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
        outputRange: [SIZES.height / 1.9, activeHeight / 1, SIZES.height / 1.9],
        extrapolate: 'clamp',
      });

      if (index == 0 || index == state?.context?.diaryList?.length - 1) {
        return <View style={{width: EMPTY_ITEM_SIZE}} />;
      } else {
        return (
          <Animated.View
            style={{
              opacity: opacity,
              width: PLACE_ITEM_SIZE,
              height: height,
              alignItems: 'center',
            }}>
            <TouchableWithoutFeedback onPress={() => SingleDiary(item.year)}>
              <View
                style={{
                  backgroundColor:
                    item.image === '' ? 'transparent' : 'transparent',
                  height: '100%',
                  borderRadius: 20,
                  padding: 10,
                  width: PLACE_ITEM_SIZE - 2,
                  justifyContent: 'space-between',
                }}>
                <Image
                  source={
                    item.image == ''
                      ? icons.cover_pink
                      : getCoverUri(item.image)
                  }
                  style={{
                    position: 'absolute',
                    width: PLACE_ITEM_SIZE - 2,
                    height: '106%',
                    borderRadius: 0,
                    resizeMode: 'stretch',
                  }}
                />

                <View
                  style={{
                    borderBottomColor:
                      item.image == 'yellow' ? COLORS.black : COLORS.white,
                    borderBottomWidth: 1,
                    paddingLeft: 20,
                  }}>
                  <Text
                    style={{
                      ...FONTS.body1,
                      color:
                        item.image == 'yellow' ? COLORS.black : COLORS.white,
                    }}>
                    Diary Book
                  </Text>
                </View>

                <TouchableWithoutFeedback
                  onPress={() => {
                    coverImageYearId.current = item.year;
                    setVisibleImagePicker(true);
                    // backup_database();
                  }}>
                  <View style={{position: 'absolute', top: 10, right: 10}}>
                    <View
                      style={{
                        height: 30,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                      }}>
                      <Image
                        style={{width: 30, height: 30, marginLeft: 10}}
                        source={icons.image_picker}
                      />
                    </View>
                  </View>
                </TouchableWithoutFeedback>

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
            </TouchableWithoutFeedback>
          </Animated.View>
        );
      }
    };

    return (
      <FlatList
        data={state?.context?.diaryList}
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
            <Text style={{...FONTS.body2, color: COLORS.white, marginTop: 50}}>
              ADD TODAY'S STORY
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const getCoverUri = (name: any) => {
    let uris = null;
    switch (name) {
      case 'blue':
        uris = icons.cover_blue;
        break;
      case 'orang':
        uris = icons.cover_orang;
        break;
      case 'red':
        uris = icons.cover_red;
        break;
      case 'yellow':
        uris = icons.cover_yellow;
        break;
      case 'green':
        uris = icons.cover_green;
        break;
      case 'pink':
        uris = icons.cover_pink;
        break;
    }

    return uris;
  };
  const renderBookCover = () => {
    const renderImageList = ({item}: any) => {
      return (
        <View
          style={{
            height: '100%',
            width: 100,
            padding: 5,
            borderRadius: 5,
            marginHorizontal: 5,
          }}>
          <TouchableOpacity
            onPress={() => {
              addImageHandler(item);
            }}>
            <Image
              style={{
                width: 80,
                height: '100%',
                resizeMode: 'cover',
                borderRadius: 5,
              }}
              source={getCoverUri(item)}
            />
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          position: 'absolute',
          zIndex: 100,
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: COLORS.gray,
          opacity: 0.8,
          justifyContent: 'flex-end',
        }}>
        <View
          style={{
            display: 'flex',
            height: '30%',
            backgroundColor: COLORS.darkBlue,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,

            opacity: 1,
          }}>
          <View
            style={{
              flex: 3,
              justifyContent: 'center',
              alignItems: 'center',
              alignContent: 'center',
              height: '100%',
              padding: 10,
            }}>
            <FlatList
              horizontal
              contentContainerStyle={{
                height: '100%',
                // backgroundColor:"pink",
                alignSelf: 'center',
                justifyContent: 'center',
              }}
              data={covers}
              keyExtractor={item => `cover-${item}`}
              renderItem={renderImageList}
            />
          </View>

          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.red,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <Text style={{...FONTS.body3, color: COLORS.white}}>cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const updateState =
    state.matches('finishedBackup') ||
    state.matches('errorGettingBackup') ||
    state.matches('errorRestoring') ||
    state.matches('finishRestoring') ||
    state.matches('diaryListLoaded');

  useEffect(() => {
    console.log('updateState', updateState, isFirstTime);

    if (isFirstTime) {
      isFirstTime = false;
      send({
        type: 'DIARYLIST',
      });
      return;
    }
    if (updateState) {
      if (
        state.matches('errorGettingBackup') ||
        state.matches('errorRestoring')
      ) {
        setTimeout(() => {
          send({
            type: 'BACKTOINITIAL',
          });
        }, 3000);
      } else if (state.matches('finishRestoring')) {
        send({
          type: 'DIARYLIST',
        });
      } else {
        send({
          type: 'BACKTOINITIAL',
        });
      }
    }
  }, [updateState]);
  // useEffect(() => {

  // }, []);

  useEffect(() => {
    reloadData();
  }, []);

  useEffect(() => {
    if (firstAdd) {
      firstAdd = false;
      return;
    }
    // reloadData(true);
    reloadData();
  }, [newDiaryYearAdded]);

  return (
    <View style={styles.container}>
      {renderHeader()}
      {state?.context?.diaryList?.length > 0
        ? renderDiaryBookByYear()
        : renderDiaryAddButtonIfEmptyDiaryList()}
      {renderAddStoryButton()}
      {renderBackupButton()}
      {renderRestoreButton()}
      {/* {visibleImagePicker ? (
        <MyImagePicker
          addImage={img => addImageHandler(img)}
          close={closeHandler}
        />
      ) : null} */}

      {visibleImagePicker ? renderBookCover() : null}
      {(state.matches('errorGettingBackup') ||
        state.matches('errorRestoring')) && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            backgroundColor: 'red',
            height: 56,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
            {state.matches('errorGettingBackup')
              ? 'Database is empty'
              : 'Please select correct restore file!'}
          </Text>
        </View>
      )}
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
