import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

const CustomLoader = ({medium}) => {
  const rotationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const rotateLoader = Animated.loop(
      Animated.timing(rotationValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    rotateLoader.start();

    return () => {
      rotateLoader.stop();
    };
  }, []);

  const rotate = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const imageSize = medium ? 65 : 100; // Adjust the size based on the medium prop

  return (
    <View style={styles.container}>
      <View style={styles.loaderBackground} />
      <Animated.Image
        source={require('../../ImageAssets/loaderImage.png')}
        style={[styles.image, { transform: [{ rotate }], width: imageSize, height: imageSize }]}

      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loaderBackground: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent white background
    width: '100%',
    height: '100%',
  },
  image: {
    // width: 100,
    // height: 100,
  },
});

export default CustomLoader;
