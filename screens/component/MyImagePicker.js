import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {COLORS, FONTS, SIZES, icons} from '../../constants';
import uuid from 'react-native-uuid';

const MyImagePicker = props => {
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
                    let temp = [];
                    temp.push({
                      id: uuid.v4(),
                      uri: i.path,
                      mime: i.mime,
                    });

                    props.addImage(temp);
                    // setImages(temp);
                    // setVisibleImagePicker(false);
                  })
                  .catch(e => {
                    console.log('e-temp');
                  });
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
                    let temp = [];
                    temp.push({
                      id: uuid.v4(),
                      uri: i.path,
                      mime: i.mime,
                    });
                    props.addImage(temp)
                    // setImages(temp);
                    // setVisibleImagePicker(false);
                  })
                  .catch(e => {
                    console.log('e-temp');
                    console.log(e);
                  });
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
              onPress={props.close}
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

  return renderImagePicker();
};

export default MyImagePicker;
