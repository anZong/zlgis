/**
 * Author: ZongAn
 * Date: 2020/7/31
 * Description: gis设置相关
 */

export const defaultOptions = {
  version: '4.15',
}

export const defaultModules = [
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

export const defaultMapOptions = {
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