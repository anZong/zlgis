/**
 * Author: ZongAn
 * Date: 2020/6/16
 * Description: Arcgis画图形
 */
class ArcGisDraw {
  constructor(arcgis) {
    this.arcgis = arcgis
    this.map = arcgis.map
    this.view = arcgis.view
    this.esri = arcgis.esri
    this.styleObj = {} // 样式
    this.draw = new this.esri.Draw({
      view: this.view
    });
  }

  start(type) {
    let action = this.action = this.draw.create(type, { mode: "hybrid" });
    this.view.focus();
    if (type == 'point') {
      action.on([
        "cursor-update",
        // "draw-complete"
      ], (evt) => {
        this.doDraw(type, evt)
      })
    } else {
      action.on([
        "vertex-add",
        "vertex-remove",
        "cursor-update",
        "redo",
        "undo",
        // "draw-complete"
      ], (evt) => {
        this.doDraw(type, evt)
      })
    }
  }

  doDraw(type, evt) {
    this.view.graphics.removeAll();
    switch (type) {
      case 'point':
        this.drawPoint(evt.coordinates)  // 点
        break;
      case 'polyline':    // 线
        this.drawLine(evt.vertices)
        break;
      case 'polygon':     // 多边形
        this.drawPolygon(evt.vertices)
        break;
    }
  }

  // 画点
  drawPoint(coordinates, styleObj=null) {
    const point = {
      type: "point", // autocasts as /Point
      x: coordinates[0],
      y: coordinates[1],
      spatialReference: this.view.spatialReference
    };
    const pointGraphic = new this.arcgis.esri.Graphic({
      geometry: point,
      symbol: styleObj || this.styleObj
    });
    this.view.graphics.add(pointGraphic);
  }

  // 画线
  drawLine(vertices, styleObj=null) {
    var polyline = {
      type: 'polyline',
      paths: vertices,
      spatialReference: this.view.spatialReference
    };
    var polygonGraphic = new this.arcgis.esri.Graphic({
      geometry: polyline,
      symbol: styleObj || this.styleObj
    });
    this.view.graphics.add(polygonGraphic);
  }

  // 画多边形
  drawPolygon(vertices, styleObj=null) {
    var polygon = {
      type: 'polygon',
      rings: vertices,
      spatialReference: this.view.spatialReference
    }
    var polygonGraphic = new this.esri.Graphic({
      geometry: polygon,
      symbol: styleObj || this.styleObj
    })
    this.view.graphics.add(polygonGraphic);
  }
}

export default ArcGisDraw
