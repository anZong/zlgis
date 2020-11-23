/**
 * Author: ZongAn
 * Date: 2020/9/9
 * Description: 工具类
 */

export default class Utils {
  constructor(arcgis) {
    this.arcgis = arcgis
  }
  // 获取地图
  getMap(){
    return this.arcgis.map
  }
  // 获取View
  getView(){
    return this.arcgis.view
  }
  // 获取esri
  getEsri(){
    return this.arcgis.esri
  }

  /**
   * 计算两个经纬度之间的距离
   * @param p1=[lng1, lat1]
   * @param p2=[lng2, lat2]
   * @returns Number 单位：米
   */
  getDistance(p1, p2, wkid=4326){
    let esri = this.getEsri()
    let line = new esri.Polyline({
      paths: [[p1, p2]],
      spatialReference: { wkid }
    })
    return esri.geometryEngine.geodesicLength(line, 'meters')
  }

  /**
   * 获取一条线段的长度
   * @param paths 可以是路径[[p1,p2], [p3, p4]]，也可以是Polyline
   */
  getLineDistance(paths, wkid=4326){
    let line = paths;
    let esri = this.getEsri()
    if(Array.isArray(paths)){
      line = new esri.Polyline({
        paths: paths,
        spatialReference: { wkid }
      })
    }
    return esri.geometryEngine.geodesicLength(line, 'meters')
  }

  /**
   * 经纬度转平面坐标
   * @param point
   * @returns {*}
   */
  lngLatToXY(point=[]){
    let esri = this.getEsri();
    if(!Array.isArray(point)){
      point = [point.lng, point.lat]
    }
    return esri.webMercatorUtils.lngLatToXY(point[0], point[1])
  }

  /**
   * 平面坐标转经纬度
   * @param point
   * @returns {*}
   */
  xyToLngLat(point=[]){
    let esri = this.getEsri();
    if(!Array.isArray(point)){
      point = [point.x, point.y]
    }
    return esri.webMercatorUtils.xyToLngLat(point[0], point[1])
  }

  /**
   * webMercator转地理坐标系
   * @param geometry
   * @returns {*}
   */
  webMercatorToGeographic(geometry){
    let esri = this.getEsri();
    return esri.webMercatorUtils.webMercatorToGeographic(geometry)
  }
  /**
   * 地理坐标系转webMercator
   * @param geometry
   * @returns {*}
   */
  geographicToWebMercator(geometry){
    let esri = this.getEsri();
    return esri.webMercatorUtils.geographicToWebMercator(geometry)
  }

  /**
   * 转换坐标
   * @param arr  坐标数组，可以是点线面
   * @param type 坐标类型: point ployline polygon
   * @param wkid 坐标系 3857: 平面坐标系  4326：地理坐标系
   */
  transCoordinate(arr, type='', wkid=3857){
    if(wkid === 3857){
      // 地理坐标系转为平面坐标系
      if(type === 'point'){
        return this.lngLatToXY(arr)
      }else if(type === 'polyline'){
        let geometry = new this.arcgis.esri.Polyline({
          paths: [arr]
        })
        return this.geographicToWebMercator(geometry)
      }else if(type === 'polygon'){
        let geometry = new this.arcgis.esri.Polygon({
          rings: [arr]
        })
        return this.geographicToWebMercator(geometry)
      }
    }else{
      // 平面坐标系转为地理坐标系
      if(type === 'point'){
        return this.xyToLngLat(arr)
      }else if(type === 'polyline'){
        let geometry = new this.arcgis.esri.Polyline({
          paths: [arr]
        })
        return this.webMercatorToGeographic(geometry)
      }else if(type === 'polygon'){
        let geometry = new this.arcgis.esri.Polyline({
          paths: [arr]
        })
        return this.webMercatorToGeographic(geometry)
      }
    }
  }

  /**
   * 获取一个几何图形的缓冲图形
   * @param geometry
   * @param distance
   * @param unit : meters | feet | kilometers | miles | nautical-miles | yards
   */
  getBuffer(geometry, distance, unit='meters'){
    let esri = this.getEsri();
    return esri.geometryEngine.geodesicBuffer(geometry, distance, unit)
  }

  /**
   * 将一个几何图形偏移
   * @param geometry
   * @param distance >0 向外  <0 向内
   * @param unit  meters | feet | kilometers | miles | nautical-miles | yards
   * @param joinType round | bevel | miter | square
   */
  offset(geometry, distance, unit='meters', joinType='square'){
    let esri = this.getEsri();
    return esri.geometryEngine.geodesicBuffer(geometry, distance, unit, joinType)
  }

  /**
   * 将一个几何图形旋转
   * @param geometry
   * @param angle 旋转角度
   * @param rotationOrigin  旋转中心点，默认几何图形中心点
   */
  rotate(geometry, angle, rotationOrigin){
    let esri = this.getEsri();
    return esri.geometryEngine.geodesicBuffer(geometry, angle, rotationOrigin)
  }

  /**
   * 获取面积
   * unit:  acres | ares | hectares | square-feet | square-meters | square-yards | square-kilometers | square-miles
   */
  getArea(geometry, unit='square-meters'){
    let esri = this.getEsri();
    return esri.geometryEngine.geodesicArea(geometry, unit)
  }
}