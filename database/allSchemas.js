import Realm from 'realm';

export const DIARYLIST_SCHEMA = 'DiaryList';
export const DIARY_SCHEMA = 'DIARY';
export const IMAGE_SCHEMA = 'Image';

// Define models and their properties
export const DiarySchema = {
  name: DIARY_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: {type: 'string', indexed: true},
    content: {type: 'string', indexed: true},
    createdTs: 'date',
    updatedTs: 'date',
    dateToShow: 'string',
    color: 'string',
    images: {type: 'list', objectType: IMAGE_SCHEMA},
    lat: 'string',
    long: 'string',
    location: 'string',
  },
};
export const DiaryListSchema = {
  name: DIARYLIST_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    title: 'string',
    year: 'string',
    createdTs: 'date',
    diaries: {type: 'list', objectType: DIARY_SCHEMA},
    image: 'string',
  },
};
export const ImageSchema = {
  name: IMAGE_SCHEMA,
  primaryKey: 'id',
  properties: {
    id: 'string',
    path: 'string',
    createdTs: 'date',
  },
};

const databaseOptions = {
  path: 'diaryApp.realm',
  schema: [DiarySchema, DiaryListSchema, ImageSchema],
  schemaVersion: 0,
};

//functions for Diary
export const insertDiaryList = data =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          realm.create(DIARYLIST_SCHEMA, data);
          resolve(data);
        });
      })
      .catch(error => reject(error));
  });

export const restoreDiaryList = data =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let allDiaryList = realm.objects(DIARYLIST_SCHEMA);
          for (let index in allDiaryList) {
            realm.delete(allDiaryList[index].diaries);
          }
          realm.delete(allDiaryList);
          resolve();

          // realm.create(DIARYLIST_SCHEMA, data);
          // resolve(data);
        });
      })
      .catch(error => reject(error));
  });

export const updateDiaryList = (id, data, index) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let filterYear = realm
            .objects(DIARYLIST_SCHEMA)
            .filtered('year == $0', id);

          filterYear[0].diaries[index].title = data.title;
          filterYear[0].diaries[index].content = data.content;
          filterYear[0].diaries[index].updatedTs = data.updatedTs;
          filterYear[0].diaries[index].images = data.images;

          resolve(filterYear);
        });
      })
      .catch(error => reject(error));
  });

export const updateDiaryYearImage = (id, image) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let filterYear = realm
            .objects(DIARYLIST_SCHEMA)
            .filtered('year == $0', id);

          filterYear[0].image = image;

          resolve(filterYear);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllDiaryLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allDiaryList = realm.objects(DIARYLIST_SCHEMA);
        resolve(allDiaryList);
      })
      .catch(error => reject(error));
  });

export const queryDiaryListsById = year =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let filterYear = realm
          .objects(DIARYLIST_SCHEMA)
          .filtered('year == $0', year);
        // .filter(`year CONTAINS[c] "${year}"`);

        resolve(filterYear);
      })
      .catch(error => reject(error));
  });

export const deleteSingleDiary = (year, singleDiaryIndex) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let allDiaryList = realm
            .objects(DIARYLIST_SCHEMA)
            .filtered('year == $0', year);

          realm.delete(allDiaryList[0].diaries[singleDiaryIndex]);
          // allDiaryList[0].diaries.forEach((realmObj, index) => {
          // if (singleDiaryIndex.toString() === index.toString()) {
          //   realm.delete(realmObj);
          // }
          // });

          resolve();
        });
      })
      .catch(error => reject(error));
  });
export const deleteSingleDiaryList = DiaryListId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let deletingDiaryList = realm.objectForPrimaryKey(
            DIARYLIST_SCHEMA,
            DiaryListId,
          );
          realm.delete(deletingDiaryList.diaries);
          realm.delete(deletingDiaryList);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const deleteAllDiaryLists = () =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        realm.write(() => {
          let allDiaryList = realm.objects(DIARYLIST_SCHEMA);
          for (let index in allDiaryList) {
            realm.delete(allDiaryList[index].diaries);
          }
          realm.delete(allDiaryList);
          resolve();
        });
      })
      .catch(error => reject(error));
  });

export const insertDiaryToDiaryList = (DiaryListId, data) =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let singleDiaryList = realm.objectForPrimaryKey(
          DIARYLIST_SCHEMA,
          DiaryListId,
        );
        realm.write(() => {
          singleDiaryList.diaries.push(data);
          resolve(data);
        });
      })
      .catch(error => reject(error));
  });

export const queryAllDiariesFromDiaryLists = DiaryListId =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let allDiaryList = realm.objectForPrimaryKey(
          DIARYLIST_SCHEMA,
          DiaryListId,
        );

        resolve(allDiaryList.diaries);
      })
      .catch(error => reject(error));
  });

export const checkYearValidation = year =>
  new Promise((resolve, reject) => {
    Realm.open(databaseOptions)
      .then(realm => {
        let filterYear = realm
          .objects(DIARYLIST_SCHEMA)
          .filtered('year == $0', year);
        // .filter(`year CONTAINS[c] "${year}"`);

        resolve(filterYear);
      })
      .catch(error => reject(error));
  });

export default new Realm(databaseOptions);
