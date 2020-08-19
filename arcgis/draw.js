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
  drawPoint(coordinates) {
    const point = {
      type: "point", // autocasts as /Point
      x: coordinates[0],
      y: coordinates[1],
      spatialReference: this.view.spatialReference
    };
    const pointGraphic = new this.arcgis.esri.Graphic({
      geometry: point,
      symbol: this.styleObj
    });
    this.view.graphics.add(pointGraphic);
    // return pointGraphic;
  }

  // 画线
  drawLine(vertices) {
    var polyline = {
      type: 'polyline',
      paths: vertices,
      spatialReference: this.view.spatialReference
    };
    /*var fillSymbol =
    {
      type: "simple-fill", // autocasts as new SimpleFillSymbol()
      color: [227, 0, 0, 0.8],
      outline: {
        // autocasts as new SimpleLineSymbol()
        color: [255, 255, 255],
        width: 1
      }
    };*/
    var polygonGraphic = new this.arcgis.esri.Graphic({
      geometry: polyline,
      symbol: this.styleObj
    });
    this.view.graphics.add(polygonGraphic);
    // return polygonGraphic;
  }

  // 画多边形
  drawPolygon(vertices) {
    var polygon = {
      type: 'polygon',
      rings: vertices,
      spatialReference: this.view.spatialReference
    }
    // var fillSymbol = {
    //   type: "simple-fill", // autocasts as new SimpleFillSymbol()
    //   color: [255, 255, 0, 0.2],
    //   outline: {
    //     color: [255, 255, 0],
    //     width: 1
    //   }
    // }
    var polygonGraphic = new this.esri.Graphic({
      geometry: polygon,
      symbol: this.styleObj
    })
    this.view.graphics.add(polygonGraphic);
    // return polygonGraphic;
  }
}

export default ArcGisDraw
