import {Animated, View, Image, ScrollView, Dimensions, Text, TouchableOpacity, SafeAreaView, StyleSheet} from 'react-native'
import {data} from '../data/information'
import {useEffect, useRef, useState} from 'react'

const {width} = Dimensions.get('window')

export default () => {
    const animatedValues = {
        topAnimation: useRef(new Animated.Value(-50)).current,
        bottomAnimation: useRef(new Animated.Value(50)).current,
        scale: useRef(new Animated.Value(0)).current
    }

    const {topAnimation, bottomAnimation, scale} = animatedValues

    const images = data
    const [active, setActive] = useState(0)

    useEffect(() => {
        topAnimation.setValue(-50)
        bottomAnimation.setValue(50)
        scale.setValue(0)
        handleAnimated()
    }, [active])

    const handleAnimated = () => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 5,
                delay: 0.98,
                useNativeDriver: true
            }),
            Animated.timing(topAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            }),
            Animated.timing(bottomAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true
            })
        ]).start()
    }

    const onSlide = ({nativeEvent}) => {
        let slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
        setActive(slide)
    }
    
    const animatedTopStyles = {
        transform: [
            {
                translateY: topAnimation
            }
        ]
    }
    
    const animatedBottomStyles = {
        transform: [
            {
                translateY: bottomAnimation
            }
        ]
    }

    const animatedImage = {
        transform: [
            {
                scale: scale
            }
        ]
    }

    return(
        <SafeAreaView style={{flex: 0, backgroundColor: 'transparent'}}>
            <View style={styles.container}>
                <ScrollView
                    style={{flex: 1, alignSelf: 'stretch'}}
                    pagingEnabled
                    onMomentumScrollEnd={onSlide}
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                >
                    {
                        images.map((x, i) => 
                            <View style={{flex: 1}} key={x.id}>
                                <View style={{flex: 1}}/>
                                <Animated.View style={[styles.headerContent, animatedTopStyles, {opacity: active === i ? 1 : 0}]}>
                                    <Text style={styles.headerTitle}>{x.title}</Text>
                                </Animated.View>
                                <Animated.View style={[styles.imageContent, animatedImage, {opacity: active === i ? 1 : 0}]}>
                                    <Image 
                                        style={{width: 275, height: 275, resizeMode: 'contain'}}
                                        source={{uri: x.url}}
                                    />
                                </Animated.View>
                                <Animated.View style={[styles.footerContent, animatedBottomStyles, {opacity: active === i ? 1 : 0}]}>
                                    <Text style={styles.footerSubtitle}>{x.subtitle}</Text>
                                </Animated.View>
                                <View style={{flex: 1}}/>
                            </View>
                        )
                    }
                </ScrollView>
                <View style={styles.paginationContent}>
                    {
                        images.map((x, i) => 
                            <Animated.View
                                style={[styles.paginationItem, {backgroundColor: i === active ? '#4392D3' : '#DADADA', transform: [
                                    {
                                        scale: scale.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [1, i === active ? 0.8 : 1]
                                        })
                                    }
                                ]}]}
                                key={x.id}
                            />
                        )
                    }
                    <View style={styles.continueContent}>
                        <TouchableOpacity>
                            <Text style={[styles.continueTitle, {color: active === (images.length - 1) ? '#4392D3' : '#DADADA'}]}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    headerContent: {
        height: 'auto',
        width,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerTitle: {
        fontSize: 24,
        textAlign: 'center',
        color: '#383838',
        fontWeight: 'bold'
    },
    imageContent: {
        width,
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 15,
    },
    footerContent: {
        height: 'auto',
        width,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center'
    },
    footerSubtitle: {
        fontSize: 19,
        textAlign: 'center',
        color: '#383838',
        fontWeight: '300'
    },
    paginationContent: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 50,
        width
    },
    paginationItem: {
        width: 14,
        height: 14,
        backgroundColor: '#dadada',
        borderRadius: 1.5,
        marginRight: 10
    },
    continueContent: {
        flex: 1,
        alignSelf: 'stretch',
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    continueTitle: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#dadada'
    }
})