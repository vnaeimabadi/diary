import RNFS from 'react-native-fs';
import {requestMultiple, PERMISSIONS} from 'react-native-permissions';
import DocumentPicker from 'react-native-document-picker';
import {
  queryAllDiaryLists,
  deleteAllDiaryLists,
  insertDiaryToDiaryList,
  insertDiaryList,
} from '../../database/allSchemas';
import uuid from 'react-native-uuid';

const backup_database = async () => {
  const data = await queryAllDiaryLists();

  if (data.length > 0) {
    var currentDate = new Date();

    var dateTime =
      currentDate.getDate() +
      '-' +
      (currentDate.getMonth() + 1) +
      '-' +
      currentDate.getFullYear() +
      '_' +
      currentDate.getHours() +
      '-' +
      currentDate.getMinutes() +
      '-' +
      currentDate.getSeconds();

    await requestMultiple([
      PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
      PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    ]);

    await RNFS.writeFile(
      RNFS.ExternalStorageDirectoryPath + '/diary_backup_' + dateTime + '.txt',
      JSON.stringify(data),
      'utf8',
    );

    // alert(
    //   'Backup successfully created!\n' + '/diary_backup_' + dateTime + '.txt',
    // );
  } else {
    throw new Error('empty database');
  }
};

const restore_database = async () => {
  // Pick a single file
  // try {
  const res = await DocumentPicker.pick({
    type: [DocumentPicker.types.plainText],
  });
  // console.log(
  //   res.uri,
  //   res.type, // mime type
  //   res.name,
  //   res.size,
  // );

  var restore_data = await RNFS.readFile(res.uri, 'utf8');

  const diaries = JSON.parse(restore_data);
  if (diaries.length > 0) {
    await deleteAllDiaryLists();

    diaries.map((item, index) => {
      addEachDiary(item);
    });

    // alert('Database successfully restored!\n *please re-open application*');

    // return true;
  } else {
    throw new Error('');
    // alert('Please select correct restore file!');
  }
  // } catch (err) {
  //   if (DocumentPicker.isCancel(err)) {
  //     // User cancelled the picker, exit any dialogs or menus and move on
  //   } else {
  //     throw err;
  //   }
  // }
};

const addEachDiary = async data => {
  const newDiaryContent = {
    id: data.id,
    title: data.title,
    year: data.year,
    color: data.color,
    createdTs: data.createdTs,
    updatedTs: data.updatedTs,
    image: data.image,
  };

  await insertDiaryList(newDiaryContent);

  data.diaries.map((diary, index) => {
    let addImages = [];

    if (diary.images.length > 0) {
      addImages = diary.images.map((item, index) => {
        return {
          id: uuid.v4(),
          path: item.path,
          createdTs: item.createdTs,
        };
      });
    }

    const newDiaryContent = {
      id: diary.id,
      title: diary.title,
      content: diary.content,
      dateToShow: diary.dateToShow,
      color: diary.color,
      createdTs: diary.createdTs,
      updatedTs: diary.updatedTs,
      lat: diary.lat,
      long: diary.long,
      location: diary.location,
      images: addImages,
    };

    insertDiaryPerYear(data.id, newDiaryContent);
  });
};

const insertDiaryPerYear = async (id, data) => {
  await insertDiaryToDiaryList(id, data);
};

export {backup_database, restore_database};
