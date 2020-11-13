 

//Import React
import React from 'react';

//Import all required component
import { View, Image, TouchableOpacity } from 'react-native';

const NavigationDrawerHeader = props => {
  const toggleDrawer = () => {
    props.navigationProps.toggleDrawer();
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity onPress={toggleDrawer}>
        <Image
          source={{
            uri:
              'https://cosync-assets.s3-us-west-1.amazonaws.com/drawerWhite.png',
          }}
          style={{ width: 25, height: 25, marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default NavigationDrawerHeader;