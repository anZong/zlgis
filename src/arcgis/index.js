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
    this.esri = {}
    // 图层相关操作
    Object.assign(this, layerFunc)
    // 已经加载的modules，如['Map', 'MapView']
    !ArcGis.modules && (ArcGis.modules = [])
    // 当前地图类型
    this.mapType = '2d'
  }

  // 加载modules
  async load(modules = []) {
    modules = defaultModules.concat(modules)
    modules = [...new Set(modules)] // 去重
    modules = modules.filter(m => { // 已经加载过的不用重复加载
      const hasModule = ArcGis.modules.includes(m)
      if (!hasModule) {
        ArcGis.modules.push(m)
      }
      return !hasModule
    })
    const self = await new Promise((resolve) => {
      loadModules(modules).then(params => {
        params.map((v, index) => {
          const module = modules[index]
          const module_name = module.split('/').pop()
          this.esri[module_name] = v
        })
        resolve(this)
      })
    })
    return self
  }
  /**
   * 生成地图, 同时生成2D和3D, 可切换
   * @param options
   * @returns {Promise<any>}
   */
  genMap(sel, options = defaultMapOptions) {
    options = JSON.parse(JSON.stringify(options))
    const config = this.appConfig
    let layers = this.initLayers(options.layers)

    // 2D 地图
    const map2d = new this.esri.Map(options.mapOptions)
    if(layers.length){
      map2d.layers = layers
    }
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
      config.activeVie = config.sceneView
    } else {
      config.mapView.container = sel
      config.activeView = config.mapView
    }
    config.container = sel

    this.map = this.appConfig.activeView.map
    this.view = this.appConfig.activeView
    this.view.ui.components = [];
  }

  // 切换2D和3D
  switchView(type, activeLayers) {
    this.mapType = type;
    const appConfig = this.appConfig;
    if (appConfig.activeView.type == type) return;
    const activeViewPoint = appConfig.activeView.viewpoint.clone();
    appConfig.activeView.container = null;
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
  toDraw(type, styleObj = {}) {
    if (!this.drawObj) {
      this.drawObj = new ArcGisDraw(this)
    }
    let draw = this.drawObj
    draw.styleObj = styleObj
    draw.start(type)
    return draw
  }
}

export default ArcGis
