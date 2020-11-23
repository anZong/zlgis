/**
 * Author: ZongAn
 * Date: 2020/7/31
 * Description: 图层操作
 */

export default {
  // 初始化底图
  initLayers(layers){
    let arr = [];
    if(layers){
      if(!this.TintLayer){
        this.TintLayer = this.esri.BaseTileLayer.createSubclass({
          properties: {
            urlTemplate: null,
          },
          getTileUrl: function (level, row, col) {
            return this.urlTemplate.replace('{z}', level).replace('{x}', col).replace('{y}', row)
          }
        })
      }
      arr = layers.map(layer=>{
        return this.TintLayer(layer)
      })
    }
    return arr
  },
  // 加载图层
  async addLayers(layers) {
    if (!layers || !Array.isArray(layers)) return
    layers.forEach(layerOption => {
      this.addLayer(layerOption)
    })
  },
  // 加载单个图层
  addLayer(layerOption) {
    if (!layerOption) return null
    let layer = null

    if (layerOption.name && !layerOption.id) {
      layerOption.id = layerOption.name
    }

    switch (layerOption.layerType) {
      case 'GraphicsLayer':
        layer = this.createGraphicsLayer(layerOption)
      case 'WebTileLayer':
        layer = this.createWebTileLayer(layerOption)
      case 'TileLayer':
        layer = this.createTileLayer(layerOption)
      default:
        if (layerOption.layerType in this.esri) {
          layer = new this.esri[layerOption.layerType](layerOption)
        }
    }
    if (layerOption.index && layerOption.index > -1) {
      this.map.add(layer, layerOption.index)
    } else {
      this.map.add(layer)
    }
    return layer
  },

  createWebTileLayer(layerOption) {
    if (!layerOption) return
    const layer = new this.esri.WebTileLayer(layerOption)
    return layer
  },

  createTileLayer(layerOption) {
    if (!layerOption || !layerOption.url) return
    const layer = new this.esri.TileLayer(layerOption)
    return layer
  },

  createGraphicsLayer(layerOption) {
    if (!layerOption || !layerOption.features || !layerOption.features.length) return
    const graphics = []
    layerOption.features.map((v) => {
      graphics.push(new this.esri.Graphic(v))
    })
    const layer = new this.esri.GraphicsLayer()
    layer.graphics.addMany(graphics)
    return layer
  },

  /**
   * 获取图层
   */
  getLayer(layerId) {
    const layer = this.map.findLayerById(layerId)
    return layer
  },
  /**
   * 显示图层
   */
  showLayer(layerName) {
    if (!this.map || !layerName) return
    const layer = this.getLayer(layerName)
    if (!layer) return
    layer.visible = true
  },
  /**
   * 隐藏图层
   */
  hideLayer(layerName) {
    if (!this.map || !layerName) return
    const layer = this.getLayer(layerName)
    if (!layer) return
    layer.visible = false
  },

}