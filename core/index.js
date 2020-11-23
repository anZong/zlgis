/**
 * Author: ZongAn
 * Date: 2020/6/16
 * Description: Arcgis
 */

import { loadModules } from 'esri-loader'
import { setDefaultOptions } from 'esri-loader'
import {defaultModules, defaultOptions, defaultMapOptions} from './settings'
import layerFunc from './layer'
import ArcGisDraw from './draw'
import Utils from './utils'

var ESRI = {};
var ESRI_MODULES = [];

class ArcGis {
  constructor(options={}) {
    setDefaultOptions(Object.assign(defaultOptions, options))
    // 存放2D和3D的View，用于切换。详见genMap、switchView
    this.appConfig = {
      mapView: null,
      sceneView: null,
      activeView: null,
      container: ''
    }
    // 加载的arcgis模块
    this.esri = ESRI;
    // 图层相关操作
    Object.assign(this, layerFunc)
    // 地图类型
    this.mapType = '2d'
    // 工具类
    this.$utils = new Utils(this)
  }

  // 加载modules
  async load(modules = []) {
    modules = defaultModules.concat(modules)
    modules = [...new Set(modules)] // 去重
    modules = modules.filter(m => { // 已经加载过的不用重复加载
      const hasModule = ESRI_MODULES.includes(m)
      if (!hasModule) {
        ESRI_MODULES.push(m)
      }
      return !hasModule
    })
    if(!modules.length) return;
    let params = await loadModules(modules);
    params.map((v, index) => {
      const module = modules[index]
      const module_name = module.split('/').pop()
      this.esri[module_name] = v
    })
  }
  /**
   * 生成地图, 同时生成2D和3D, 可切换
   * @param options
   * @returns {Promise<any>}
   */
  genMap(sel, options = {}) {
    options = JSON.parse(JSON.stringify(options))
    options = Object.assign(defaultMapOptions, options)
    const config = this.appConfig

    // 2D 地图
    const map2d = new this.esri.Map(options.mapOptions)
    const mapViewOptions = options.mapViewOptions || {}
    config.mapView = new this.esri.MapView(Object.assign(mapViewOptions, {
      constraints: {
        //设置约束条件
        minZoom: 6,
        maxZoom: 20
      },
      map: map2d
    }));

    // 3D 地图
    const map3d = new this.esri.Map(Object.assign(options.mapOptions, {
      ground: 'world-elevation'
    }));
    config.sceneView = new this.esri.SceneView(Object.assign(mapViewOptions,{
      constraints:{
        altitude: {
          min: 2000,
          max: 1000000
        }
      },
      map: map3d
    }))

    if (options.is3d) {
      config.sceneView.container = sel
      config.activeView = config.sceneView
      this.mapType = '3d'
    } else {
      config.mapView.container = sel
      config.activeView = config.mapView
    }
    config.container = sel

    this.map = this.appConfig.activeView.map
    this.view = this.appConfig.activeView
    this.view.ui.components = [];

    let layers = this.initLayers(options.layers)
    if(layers.length){
      this.map.addMany(layers)
    }
  }

  // 切换2D和3D
  switchView(type, activeLayers) {
    this.mapType = type;
    const appConfig = this.appConfig;
    if (appConfig.activeView.type == type) return;
    const activeViewPoint = appConfig.activeView.viewpoint.clone();
    appConfig.activeView.container = null;
    console.log(activeViewPoint)
    if (type == '3d') {
      appConfig.sceneView.map.addMany(activeLayers);
      appConfig.activeView = appConfig.sceneView;
    } else {
      appConfig.mapView.map.addMany(activeLayers);
      appConfig.activeView = appConfig.mapView;
    }
    appConfig.activeView.viewpoint = activeViewPoint;
    appConfig.activeView.container = appConfig.container;
    this.map = this.appConfig.activeView.map;
    this.view = this.appConfig.activeView;
  }
  /**
   * @description: 画图形
   * @type: point 点、polyline 线、multipoint 多点、polygon 多边形、rectangle 矩形、circle 圆、ellipse 椭圆
   */
  initDraw(){
    if(!this.drawObj){
      this.drawObj = new ArcGisDraw(this)
    }
    return this.drawObj
  }

  toDraw(type, styleObj = {}) {
    let draw = this.initDraw()
    draw.styleObj = styleObj
    draw.start(type)
    return draw
  }
}

export default ArcGis
