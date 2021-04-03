import React from 'react';
import { View, Text, Button, StyleSheet, StatusBar, Dimensions, Image, ScrollView } from 'react-native';
import { SearchBar } from 'react-native-elements';
import ScrollableTabView , { DefaultTabBar  } from 'react-native-scrollable-tab-view';
import Near from './components/Near';
import Popular from './components/Popular';


const width = Dimensions.get('window').width;
const getHeight = Dimensions.get('window').height;
const height = width * 0.55;
const images = [
  'https://media.foody.vn/images/beauty-upload-api-675x355-%281%29-201224151240.jpg',
  'https://media.foody.vn/images/beauty-upload-api-675x355-210219174402.jpg',
  'https://media.foody.vn/images/beauty-upload-api-675x355.-210309112809.jpg',
  'https://images.foody.vn/biz_banner/foody-upload-api-food-biz-210315111823.jpg'
];
export default class HomeScreen extends React.Component {
  scrollRef = React.createRef();
  constructor(props) {
    super(props);

    this.state = {
      search: '',
      selectedIndex: 0,
    };
  }

  updateSearch = (search) => {
    this.setState(search = this.state.search);
  };

  componentDidMount = () => {
    setInterval(() => {
      this.setState(prev => ({ selectedIndex: prev.selectedIndex === images.length - 1 ? 0 : prev.selectedIndex + 1 }),
        () => {
          this.scrollRef.current.scrollTo({
            animated: true,
            y: 0,
            x: width * this.state.selectedIndex
          })
        })
    }, 3000)
  }

  // componentWillUnmount = () => {

  // }

  setSelectedIndex = (event) => {
    //width of viewsize
    const viewSize = event.nativeEvent.layoutMeasurement.width;
    //position of white dot
    const contentOffset = event.nativeEvent.contentOffset.x;

    const selectedIndex = Math.floor(contentOffset / viewSize)
    this.setState({ selectedIndex });
  }

  render() {
    const { search } = this.state;
    const { selectedIndex } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar barStyle={"light-content"} />
        <View style={styles.banner}>
        <SearchBar
          placeholder="Name of the place..."
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{
            backgroundColor: '#64b5f6',
          }}
          inputContainerStyle={{
            backgroundColor: 'white',

          }}
        />
        
        <ScrollView
          onMomentumScrollEnd={this.setSelectedIndex}
          ref={this.scrollRef}
          pagingEnabled
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ width, height }}>
          {images.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={{ width, height, resizeMode: 'contain' }}
            />
          ))}
        </ScrollView>
        <View style={styles.circleDiv}>
          {images.map((image, i) => (
            <View
              key={image}
              style={[styles.whiteCircle, { opacity: i === selectedIndex ? 0.5 : 1 }]}
            />
          ))}
        </View>
        </View>

        <View style={styles.tabbar}>
          <ScrollableTabView
            style={{marginTop:20 }}
            initialPage={0}
            tabBarActiveTextColor='blue'
            renderTabBar={() => <DefaultTabBar  />}
          >
            <Near key="key1" tabLabel='Near You'></Near>
            <Popular key = 'key2' tabLabel='Popular'></Popular>
          </ScrollableTabView>
          </View>  
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },

  banner: {
    position: 'absolute'
  },

  circleDiv: {
    position: 'absolute',
    bottom: 0,
    height: 50,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },

  whiteCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 5,
    backgroundColor: 'white',

  },
  tabbar: {
    flex: 1,
    marginTop: width*0.69,
    paddingHorizontal: 30,
  },
  viewSpace: {
    marginTop:0,
    height: 10,
  }
});