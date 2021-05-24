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
  Alert 
} from 'react-native';
import {
  insertDiaryList,
  checkYearValidation,
  insertDiaryToDiaryList,
  queryDiaryListsById,
  deleteSingleDiary,
} from '../database/allSchemas';

import {useDispatch, useSelector} from 'react-redux';
import {changedDatabaseAction} from '../store/databaseChanges';

import realm from '../database/allSchemas';
import {COLORS, FONTS, SIZES, icons, theme} from '../constants';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const DiaryDetail = ({navigation, route}) => {
  const id = route.params.id;
  const yearId = route.params.yearId;

  const dispatch = useDispatch();
  const detailChanged = useSelector(status => status.singleDiaryEdited);
  const detailD = useSelector(status => status.singleDiaryDeleted);

  const selectedIndex = useRef(0);
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [details, setDetails] = useState('');
  const [detailsError, setDetailsError] = useState(false);
  const [height, setHeight] = useState(0);
  const [date, setDate] = useState(null);

  const reloadData = () => {
    queryDiaryListsById(yearId)
      .then(data => {
        // setDiaryList(data);
        let dd = data[0].diaries.filter((da, index) => {
          if (da.id == id) {
            selectedIndex.current = index;
            // return da.id == id;
            return da;
          }
        });
        setTitle(dd[0].title);
        setDetails(dd[0].content);
        setDate(dd[0].createdTs);
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
        setDiaryList([]);
      });
  };

  const editDeary = () => {
    navigation.navigate('AddEditDiary', {
      yearId: yearId,
      date: date.toString(),
      id: id,
      title: title,
      content: details,
      selectedIndex: selectedIndex.current,
    });
  };

  const dialogBoxHandler = () =>
  Alert.alert(
    "Delete Diary",
    "Are your sure you want to delete?",
    [
      {
        text: "Cancel",
        style: "cancel"
      },
      { text: "delete", onPress: deleteDeary }
    ]
  );

  const deleteDeary = () => {
    //
    deleteSingleDiary(yearId, selectedIndex.current)
      .then(data => {
        // setTimeout(() => {
        //   // dispatch(changedDatabaseAction.singleDiaryDeleted());
        //   navigation.goBack();
        //   // navigation.navigate('DiaryList', {yearId: yearId});
        // }, 5000)
        dispatch(changedDatabaseAction.singleDiaryDeleted());
        navigation.goBack();
      })
      .catch(error => {
        console.log('error-reload');
        console.log(error);
      });
  };

  const Header = () => {
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

          <TouchableOpacity onPress={editDeary} style={{marginLeft: 10}}>
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
        <View style={{display: 'flex', flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{marginLeft: -10,marginRight:10}}>
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

  useEffect(() => {
    reloadData();
    // realm.addListener('change', () => {
    //   reloadData();
    // });
  }, [detailChanged]);


  return (
    <View style={styles.container}>
      {/* header */}
      {Header()}

      {/* title */}
      <View>
        <Text
          style={{
            marginTop: SIZES.padding,
            height: 40,
            color: COLORS.black,
            ...FONTS.body2,
          }}
          >
          {title}
        </Text>
      </View>

      {/* content */}
      <ScrollView>
        <View>
          <Text
            style={{
              color: COLORS.black,
              ...FONTS.body3,
            }}>
            {details}
          </Text>
        </View>
      </ScrollView>
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

export default DiaryDetail;
