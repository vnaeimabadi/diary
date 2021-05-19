import React from 'react';
import {View, Text} from 'react-native';

const PageOne = ({navigation}) => {
  const goToHomepage = () => {
    navigation.navigate('PageTwo');
  };
  return (
    <View style={{flex: 1, justifyContent: 'flex-start', alignItems: 'center',backgroundColor:"gray"}}>
      {/* <Text>one</Text> */}
      <View>
        <Text onPress={goToHomepage}>go to home page</Text>
      </View>
    </View>
  );
};

export default PageOne;
