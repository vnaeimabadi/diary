import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {
  insertDiaryList,
  checkYearValidation,
  insertDiaryToDiaryList,
  updateDiaryList,
} from '../database/allSchemas';

import uuid from 'react-native-uuid';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ImagePicker from 'react-native-image-crop-picker';

import {useDispatch, useSelector} from 'react-redux';
import {changedDatabaseAction} from '../store/databaseChanges';

import {COLORS, FONTS, SIZES, icons} from '../constants';
import Gallery from './component/Gallery';
import MyImagePicker from './component/MyImagePicker';

const AddEditDiary = ({navigation, route}: any) => {
  const yearId = route.params.yearId;
  const p_date = route.params.date;

  const id = route.params.id;
  const selectedIndex = route.params.selectedIndex;
  const editedTitle = route.params.title;
  const editedContent = route.params.content;
  const all_images = route.params.images;
  const showGallery = useSelector(state => state.show);
  const [images, setImages] = useState(
    all_images == undefined || all_images == null ? [] : JSON.parse(all_images),
    // []
  );

  const dispatch = useDispatch();

  const [title, setTitle] = useState(editedTitle);
  const [titleError, setTitleError] = useState(false);
  const [details, setDetails] = useState(editedContent);
  const [detailsError, setDetailsError] = useState(false);
  const [dateError, setDateError] = useState<boolean | null>(null);
  const [height, setHeight] = useState(0);

  const [visibleImagePicker, setVisibleImagePicker] = useState(false);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [datePickerDate, setDatePickerDate] = useState(
    p_date != undefined && p_date != ''
      ? p_date
      : yearId == undefined || yearId == ''
      ? new Date()
      : yearId !== new Date().toString().split(' ')[3].toString()
      ? ''
      : new Date(),
  );
  const newYearAdded = useRef(false);

  const showDatePickerHandler = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePickerHandler = () => {
    setDatePickerVisibility(false);
  };

  const confirmHandler = (date: any) => {
    if (dateError) setDateError(false);
    setDatePickerDate(date);
    hideDatePickerHandler();
  };

  const checkYearIsAdded = () => {
    let canContinue = true;
    if (title == '' || title == undefined) {
      setTitleError(true);
      canContinue = false;
    } else {
      if (titleError) setTitleError(false);
    }
    if (details == '' || details == undefined) {
      setDetailsError(true);
      canContinue = false;
    } else {
      if (detailsError) setDetailsError(false);
    }
    if (datePickerDate == '' || datePickerDate == undefined) {
      setDateError(true);
      canContinue = false;
    } else {
      if (dateError) setDateError(false);
    }
    if (!canContinue) return;

    if (id != '' && id != undefined) {
      updateDiary();
    } else {
      var today = datePickerDate.toString().split(' ')[3];
      const year = yearId == '' ? today : yearId;
      checkYearValidation(year.toString())
        .then(data => {
          if (data.length > 0) {
            // year-found
            addNewDiary(data[0].id);
          } else {
            //year-is-empty then add new row to DiaryListSchema in db
            newYearAdded.current = true;
            addNewDiaryList();
          }
        })
        .catch(error => {
          console.log('error-checkYear');
          console.log(error);
        });
    }
  };

  const addNewDiaryList = () => {
    let newId = Math.floor(Date.now() / 1000);

    var selectedDate = datePickerDate.toString().split(' ')[3];
    const year = yearId == '' ? selectedDate : yearId;

    const newDiaryContent = {
      id: `diary-${newId}`,
      title: `diary no ${newId}`,
      year: year.toString(),
      color: '#f0a0f0',
      createdTs: datePickerDate,
      updatedTs: datePickerDate,
      image: '',
    };

    insertDiaryList(newDiaryContent)
      .then(data => {
        addNewDiary(data.id);
      })
      .catch(error => {
        console.log('error-insert');
        console.log(error);
      });
  };

  const addNewDiary = (id: any) => {
    let newId = Math.floor(Date.now() / 1000);

    let date =
      datePickerDate.getDate() +
      '/' +
      parseInt(datePickerDate.getMonth() + 1) +
      '/' +
      datePickerDate.getFullYear();

    let addImages = [];

    if (images.length > 0) {
      addImages = images.map((item: any) => {
        return {
          id: item.id,
          path: item.uri,
          createdTs: datePickerDate,
        };
      });
    }

    const newDiaryContent = {
      id: `diary-${newId}`,
      title: title,
      content: details,
      dateToShow: date,
      color: '#f0a0f0',
      createdTs: datePickerDate,
      updatedTs: datePickerDate,
      lat: '',
      long: '',
      location: '',
      images: addImages,
    };

    insertDiaryToDiaryList(id, newDiaryContent)
      .then(() => {
        if (newYearAdded) {
          dispatch(changedDatabaseAction.diaryYearChanged());
        }
        dispatch(changedDatabaseAction.singleDiaryChanged());
        navigation.goBack();
      })
      .catch(error => {
        console.log('error-insert');
        console.log(error);
      });
  };

  const updateDiary = () => {
    let addImages = [];

    if (images.length > 0) {
      addImages = images.map((item: any) => {
        return {
          id: item.id,
          path: item.uri,
          createdTs: datePickerDate,
        };
      });
    }

    console.log(
      'images----------------------------------------------->vali-naeim',
    );
    console.log(addImages);

    const updateDiaryContent = {
      id: `diary`,
      title: title,
      content: details,
      dateToShow: 'asd',
      color: '#f0a0f0',
      createdTs: datePickerDate,
      updatedTs: datePickerDate,
      lat: '',
      long: '',
      location: '',
      images: addImages,
    };

    updateDiaryList(yearId, updateDiaryContent, selectedIndex)
      .then(() => {
        dispatch(changedDatabaseAction.singleDiaryEditedChanged());
        navigation.goBack();
      })
      .catch(error => {
        console.log('error-insert');
        console.log(error);
      });
  };

  const deleteImageDialogBox = (id: any) =>
    Alert.alert('Delete Image', 'Are your sure you want to delete image?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {text: 'delete', onPress: () => deleteImage(id)},
    ]);

  const deleteImage = (id: any) => {
    let temp = images.filter((data: any) => {
      return data.id != id;
    });

    setImages(temp);
  };

  const closeHandler = () => {
    setVisibleImagePicker(false);
  };
  const addImageHandler = (data: any) => {
    let newId = Math.floor(Date.now() / 1000);
    let temp = [...images];
    temp.push({
      // id: uuid.v4(),
      id: `diary-image-${newId}`,
      uri: data[0].uri,
      mime: data[0].mime,
    });
    console.log(temp);
    console.log(data);
    setImages(temp);
    setVisibleImagePicker(false);
  };

  const renderImagePicker = () => {
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
            height: '25%',
            backgroundColor: COLORS.darkBlue,
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
            opacity: 1,
          }}>
          <View
            style={{
              flex: 1,
            }}>
            <TouchableOpacity
              onPress={() => {
                ImagePicker.openCamera({
                  multiple: false,
                  cropping: true,
                  waitAnimationEnd: false,
                  includeExif: true,
                  mediaType: 'photo',
                  forceJpg: true,
                })
                  .then(i => {
                    let newId = Math.floor(Date.now() / 1000);
                    let temp = [...images];
                    temp.push({
                      // id: uuid.v4(),
                      id: `diary-image-${newId}`,
                      uri: i.path,
                      mime: i.mime,
                    });
                    setImages(temp);
                    setVisibleImagePicker(false);
                  })
                  .catch(e => {});
              }}
              style={{
                borderTopLeftRadius: 25,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 25,
                width: '100%',
                height: '100%',
              }}>
              <Text style={{...FONTS.body3, color: COLORS.white}}>
                select camera
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => {
                ImagePicker.openPicker({
                  multiple: false,
                  cropping: true,
                  waitAnimationEnd: false,
                  includeExif: true,
                  mediaType: 'photo',
                  forceJpg: true,
                })
                  .then(i => {
                    let newId = Math.floor(Date.now() / 1000);
                    let temp = [...images];
                    temp.push({
                      // id: uuid.v4(),
                      id: `diary-image-${newId}`,
                      uri: i.path,
                      mime: i.mime,
                    });
                    setImages(temp);
                    setVisibleImagePicker(false);
                  })
                  .catch(e => {});
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%',
              }}>
              <Text style={{...FONTS.body3, color: COLORS.white}}>
                select gallery
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: COLORS.red,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => setVisibleImagePicker(false)}
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

  const renderHeader = () => {
    const renderDatePicker = () => {
      return (
        <TouchableOpacity onPress={showDatePickerHandler}>
          <View
            style={{
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <View
              style={{
                borderBottomColor: COLORS.black,
                borderBottomWidth: 1,
              }}>
              <Text style={{...FONTS.h3, marginTop: 10}}>publish date:</Text>
            </View>
            <View
              style={{
                borderBottomColor:
                  dateError == null
                    ? COLORS.black
                    : dateError
                    ? COLORS.red
                    : COLORS.black,
                borderBottomWidth: 1,
                marginLeft: 5,
              }}>
              <Text
                style={{
                  ...FONTS.h3,
                  marginTop: 10,
                  color:
                    dateError == null
                      ? COLORS.black
                      : dateError
                      ? COLORS.red
                      : COLORS.black,
                }}>
                {' '}
                {datePickerDate.toString() == '' && dateError == null
                  ? 'Add Date'
                  : dateError
                  ? 'Add Date'
                  : datePickerDate.toString().split(' ')[1] +
                    ' ' +
                    datePickerDate.toString().split(' ')[2] +
                    ' ' +
                    datePickerDate.toString().split(' ')[3]}
              </Text>
            </View>

            <Image
              style={{width: 15, height: 15, marginLeft: 5}}
              source={icons.edit_icon}
            />
          </View>
        </TouchableOpacity>
      );
    };

    const renderOpenPicker = () => {
      return (
        <TouchableOpacity
          onPress={() => {
            setVisibleImagePicker(true);
          }}>
          <View
            style={{
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              flexDirection: 'row',
            }}>
            <Image
              style={{width: 25, height: 25, marginLeft: 10}}
              source={icons.image_picker}
            />
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
          }}>
          <Image
            style={{width: 50 / 1.3, height: 50, marginRight: 5}}
            source={icons.logo}
          />
          {renderDatePicker()}
          {renderOpenPicker()}
        </View>

        <Text style={{...FONTS.h3, marginTop: 10}}>What happended today?</Text>
        <View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={confirmHandler}
            onCancel={hideDatePickerHandler}
            maximumDate={
              yearId != undefined && yearId != ''
                ? new Date(+yearId + 1, 0, 0)
                : null
            }
            minimumDate={
              yearId != undefined && yearId != ''
                ? new Date(+yearId, 0, 1)
                : null
            }
          />
        </View>
      </View>
    );
  };

  const renderTitle = () => {
    return (
      <View>
        <TextInput
          style={{
            marginBottom: SIZES.padding,
            borderBottomColor: titleError ? COLORS.red : COLORS.darkBlue,
            borderBottomWidth: 1,
            height: 40,
            color: COLORS.black,
            ...FONTS.body3,
          }}
          autoFocus={true}
          placeholder="Enter diary title"
          placeholderTextColor={COLORS.black}
          selectionColor={COLORS.black}
          onChangeText={value => {
            if (titleError) setTitleError(false);
            setTitle(value);
          }}
          value={title}
        />
        {titleError ? (
          <Text style={{marginLeft: 10, marginTop: -20, color: COLORS.red}}>
            please enter diary title
          </Text>
        ) : null}
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
                  JSON.stringify(images).replace(/uri/g, 'path'),
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
              source={item}
            />
          </TouchableOpacity>

          {/*diary delete button*/}
          <View
            style={{
              position: 'absolute',
              top: 1,
              right: 1,
              backgroundColor: COLORS.white,
              borderBottomLeftRadius: 10,
              borderTopRightRadius: 5,
              elevation: 5,
            }}>
            <TouchableOpacity onPress={() => deleteImageDialogBox(item.id)}>
              <View
                style={{
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 5,
                }}>
                <Image
                  style={{width: 10, height: 10 * 1.5}}
                  source={icons.delete_icon}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View>
        <FlatList
          horizontal
          style={{height: 80}}
          contentContainerStyle={{
            height: '100%',
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
      <View style={{flex: 1, marginBottom: 25}}>
        <TextInput
          multiline={true}
          style={[
            styles.inputs,
            {
              height: Math.max(35, height),
              maxHeight: SIZES.height / 1.5,
              padding: 10,
            },
          ]}
          placeholder="Tell your story..."
          placeholderTextColor={COLORS.black}
          selectionColor={COLORS.gray}
          onChangeText={value => {
            if (detailsError) {
              setDetailsError(false);
            }
            setDetails(value);
          }}
          value={details}
          autoFocus={true}
          underlineColorAndroid={detailsError ? COLORS.red : COLORS.darkBlue}
          onContentSizeChange={e => {
            setHeight(e.nativeEvent.contentSize.height);
          }}
        />
        {detailsError ? (
          <Text style={{marginLeft: 10, color: COLORS.red}}>
            please enter diary content
          </Text>
        ) : null}
      </View>
    );
  };

  const renderFooter = () => {
    const renderSaveEditButton = () => {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
          }}>
          <TouchableOpacity onPress={checkYearIsAdded}>
            <View
              style={{
                backgroundColor: COLORS.darkBlue,
                width: 80,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 25,
              }}>
              <Text style={{color: 'white', ...FONTS.h3, textAlign: 'center'}}>
                {id != '' && id != undefined ? 'edit' : 'save'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    const renderCancelButton = () => {
      return (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
          }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <View
              style={{
                backgroundColor: COLORS.red,
                width: 80,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                borderTopRightRadius: 25,
              }}>
              <Text style={{color: 'white', ...FONTS.h3, textAlign: 'center'}}>
                cancel
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        }}>
        {renderSaveEditButton()}
        {renderCancelButton()}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* header */}
      {renderHeader()}

      {/* images */}
      {images.length > 0 ? renderImages() : null}

      {/* title */}
      {renderTitle()}

      {/* content */}
      {renderContent()}

      {/* footer */}
      {renderFooter()}

      {/* image Picker */}
      {/* {visibleImagePicker ? renderImagePicker() : null} */}
      {visibleImagePicker ? (
        <MyImagePicker
          addImage={(img: any) => addImageHandler(img)}
          close={closeHandler}
        />
      ) : null}

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

export default AddEditDiary;
