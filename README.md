# zlgis

#### 安装  
`npm i zlgis`

#### 使用
##### main.js里面定义事件总线，用于地图加载完成以及切换底图事件时通知需要更新的组件
```javascript
Vue.prototype.$EventBus = new Vue();
```

##### 使用ArcGis  

src/views下新建map.vue
```vue
<template>
  <div class="wrapper">
    <!--地图容器-->
    <div :id="mapId" class="gismap"></div> 
  </div>
</template>
```
```scss
<style scoped lang="scss">
.wrapper{
  position: relative;
}
.gismap {
  width: 100vw;
  height: 100vh;
}
</style>
```
创建ArcGis实例，并初始化需要用到的esri模块
```vue
import ArcGis from "arcgis/index";
import Vue from 'vue';      
    
export default {
  name: "MainMap",
  data() {
    return {
      mapId: 'zlmap',
      modules: [], // 已经内置了大部分常用的模块，其他的可以在这里添加
      mapOptions: {}
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(){
      const arcgis = new ArcGis();            // 创建一个ArcGis实例
      await arcgis.load(this.modules);        // 等待模块异步加载完成
      arcgis.genMap(this.mapId, mapOptions);  // 生成地图
      Vue.prototype.$arcgis = arcgis;         // 注册到所有Vue组件, 方便调用，在其他组件调用this.$arcgis时需要确保mapLoaded事件已经执行
      this.$EventBus.$emit('mapLoaded');      // 地图加载完成，通过事件总线的方式通知关心该事件的组件
    }
  }
};
```
> 注意： 其他vue组件或页面调用this.$arcgis时需要确保地图已经加载完成，
不然会报错。最好通过this.$EventBus.$on('mapLoaded')来监听地图加载完成事件。
  
内置的esri模块， 可通过modules来添加额外的模块。
```javascript
defaultModules = [
  'esri/Map',
  'esri/layers/FeatureLayer',
  'esri/widgets/ScaleBar',
  'esri/views/MapView',
  'esri/views/SceneView',
  'esri/widgets/Home',
  'esri/widgets/Fullscreen',
  'esri/Graphic',
  'esri/layers/GraphicsLayer',
  'esri/Basemap',
  'esri/layers/WebTileLayer',
  'esri/layers/TileLayer',
  'esri/config',
  'esri/request',
  'esri/Color',
  'esri/layers/BaseTileLayer',
  'esri/layers/MapImageLayer',
  'esri/geometry/Point',
  'esri/widgets/Compass',
  'esri/widgets/DistanceMeasurement2D',
  'esri/widgets/AreaMeasurement2D',
  'esri/symbols/PictureMarkerSymbol',
  'esri/symbols/SimpleMarkerSymbol',
  'esri/symbols/TextSymbol',
  'esri/geometry/support/webMercatorUtils',
  'esri/views/draw/Draw',
  "esri/geometry/geometryEngine"
]
```

默认的地图配置项如下,可通过mapOptions来覆盖，如果genMap的时候不传第二个参数，则使用默认配置项。
```javascript
defaultMapOptions = {
  mapOptions: {},
  mapViewOptions: {
    zoom: 8,
    center: [102, 25],
  },
  layers: [{
    urlTemplate: "http://mt1.google.cn/maps/vt/lyrs=y@189&hl=zh-CN&x={x}&y={y}&z={z}&s=Galil",
    title: "GoogleImage",
    id: "GoogleImage",
    visible: true
  }, {
    urlTemplate: "http://mt1.google.cn/maps/vt/lyrs=m@189&hl=zh-CN&x={x}&y={y}&z={z}&s=Galil",
    title: "GoogleStreetMap",
    id: "GoogleStreetMap",
    visible: false
  }],
}
```
#### 添加插件
```vue
// 引入插件
import BaseMapToggle from 'arcgis/widgets/BasemapToggle';   // 底图切换：卫星地图、街道地图、3D地图
import CommonTools from 'arcgis/widgets/CommonTools';       // 工具栏，目前只有样式，没有做功能
import LatLon from 'arcgis/widgets/LatLon';                 // 左下角显示当前经纬度
 
// 组件内注册    
components:{
    BaseMapToggle, CommonTools, LatLon
}
    
// 页面使用
<div class="widgets">
  <BaseMapToggle></BaseMapToggle>
  <CommonTools></CommonTools>
  <LatLon></LatLon>
</div>
```

#### 图层操作
##### 添加多个图层
```javascript
let layers = [{
  layerType: 'FeatureLayer',
  url: "xxx",
  id: "xxx",
}, {
   layerType: 'MapImageLayer',
   url: "xxx",
   id: "xxx",
 }]
// 需要在地图加载后操作，如果不确定地图是否加载完成，可通过事件总线监听mapLoaded事件
this.$EventBus.$on('mapLoaded', ()=>{
  this.$arcgis.addLayers(layers) 
}) 
// or
// 如果此处地图百分百加载完成，则不需要事件总线监听
this.$arcgis.addLayers(layers) 
```
##### 添加单个图层
```javascript
this.$arcgis.addLayer({
  layerType: 'xx',
  url: '',
  id: ''
}) 
```
> 注意：添加图层时，图层选项需要参考arcgis官网，并不是所有的图层都是url，有的是urlTemplate

##### 获取图层
```javascript
this.$arcgis.getLayer('LayerId')
```
##### 显示图层
```javascript
this.$arcgis.showLayer('LayerId')
```
##### 隐藏图层
```javascript
this.$arcgis.hideLayer('LayerId')
```

#### 画图操作
```vue
this.$arcgis.toDraw(type, styleObj)     // 返回的是ArcGisDraw对象，可以接着操作
```
参数说明：    
`typ`：point 点、polyline 线、multipoint 多点、polygon 多边形、rectangle 矩形、circle 圆、ellipse 椭圆
   
`styleObj`: 所画图形的symbol参数