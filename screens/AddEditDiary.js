import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Button,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  insertDiaryList,
  checkYearValidation,
  insertDiaryToDiaryList,
  updateDiaryList,
} from '../database/allSchemas';

import DateTimePickerModal from 'react-native-modal-datetime-picker';

import {useDispatch, useSelector} from 'react-redux';
import {changedDatabaseAction} from '../store/databaseChanges';

import realm from '../database/allSchemas';
import {COLORS, FONTS, SIZES, icons, theme} from '../constants';

const AddEditDiary = ({navigation, route}) => {
  const yearId = route.params.yearId;
  const p_date = route.params.date;

  const id = route.params.id;
  const selectedIndex = route.params.selectedIndex;
  const editedTitle = route.params.title;
  const editedContent = route.params.content;

  const dispatch = useDispatch();

  const [title, setTitle] = useState(editedTitle);
  const [titleError, setTitleError] = useState(false);
  const [details, setDetails] = useState(editedContent);
  const [detailsError, setDetailsError] = useState(false);
  const [dateError, setDateError] = useState(null);
  const [height, setHeight] = useState(0);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [datePickerDate, setDatePickerDate] = useState(
    p_date != undefined && p_date != ''
      ? p_date
      : (yearId == undefined || yearId=="")
      ? new Date()
      : yearId !== new Date().toString().split(' ')[3].toString()
      ? ''
      : new Date(),
  );
  const newYearAdded = useRef(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    // console.warn('A date has been picked: ', date);
    if (dateError) setDateError(false);
    setDatePickerDate(date);
    hideDatePicker();
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
      // var today = new Date();
      var today = datePickerDate.toString().split(' ')[3];
      // const year = yearId == '' ? today.getFullYear() : yearId;
      const year = yearId == '' ? today : yearId;
      checkYearValidation(year.toString())
        .then(data => {
          if (data.length > 0) {
            // year-found
            addNewDiary(data[0].id);
          } else {
            //year-is-empty
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

    // var today = new Date();
    var selectedDate = datePickerDate.toString().split(' ')[3];
    // const year = yearId == '' ? today.getFullYear() : yearId;
    const year = yearId == '' ? selectedDate : yearId;

    const newDiaryContent = {
      id: `diary-${newId}`,
      title: `diary no ${newId}`,
      year: year.toString(),
      color: '#f0a0f0',
      createdTs: datePickerDate,
      updatedTs: datePickerDate,
    };

    // const newDiaryContent = {
    //   id: `diary-${newId}`,
    //   title: `diary no ${newId}`,
    //   year: year.toString(),
    //   color: '#f0a0f0',
    //   createdTs: new Date(),
    //   updatedTs: new Date(),
    // };

    insertDiaryList(newDiaryContent)
      .then(data => {
        addNewDiary(data.id);
      })
      .catch(error => {
        console.log('error-insert');
        console.log(error);
      });
  };

  const addNewDiary = id => {
    let newId = Math.floor(Date.now() / 1000);

    // let today = new Date();
    var selectedDate = datePickerDate.toString().split(' ')[3];
    const month = parseInt(datePickerDate.getMonth() + 1);
    const day = datePickerDate.getDate();
    const year = datePickerDate.getFullYear();
    let date =
      datePickerDate.getDate() +
      '/' +
      parseInt(datePickerDate.getMonth() + 1) +
      '/' +
      datePickerDate.getFullYear();

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
    };

    insertDiaryToDiaryList(id, newDiaryContent)
      .then(data => {
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
    };

    updateDiaryList(yearId, updateDiaryContent, selectedIndex)
      .then(data => {
        dispatch(changedDatabaseAction.singleDiaryEditedChanged());
        navigation.goBack();
      })
      .catch(error => {
        console.log('error-insert');
        console.log(error);
      });
  };

  const reloadData = () => {
    queryAllDiaryLists()
      .then(data => {
        setDiaryList(data);
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
        setDiaryList([]);
      });
  };

  const Header = () => {
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
          <TouchableOpacity onPress={showDatePicker}>
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
        </View>

        <Text style={{...FONTS.h3, marginTop: 10}}>What happended today?</Text>
        <View>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
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

  const footer = () => {
    return (
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        }}>
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* header */}
      {Header()}

      {/* title */}
      <View>
        <TextInput
          style={{
            marginVertical: SIZES.padding,
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

      {/* content */}
      <View style={{flex: 1, marginBottom: 25}}>
        <TextInput
          multiline={true}
          // numberOfLines={10}
          style={[
            styles.inputs,
            {
              height: Math.max(35, height),
              maxHeight: SIZES.height / 1.5,
            },
          ]}
          placeholder="Tell your story..."
          placeholderTextColor={COLORS.black}
          selectionColor={COLORS.gray}
          onChangeText={value => {
            if (detailsError) setDetailsError(false);
            setDetails(value);
          }}
          value={details}
          autoFocus={true}
          style={{padding: 10}}
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

      {/* footer */}
      {footer()}
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
    // paddingTop: 10,
    overflow: 'hidden',
    // padding: 10,
    paddingRight: 25,
    borderBottomColor: '#000000',
    flex: 1,
    position: 'absolute',
    width: '100%',
  },
});

export default AddEditDiary;
