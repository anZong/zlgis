<template>
  <div class="wrapper">
    <div :id="mapId" class="gismap"></div>
    <div class="widgets">
      <BaseMapToggle></BaseMapToggle>
      <LatLon></LatLon>
    </div>
  </div>
</template>

<script>
import ArcGis from "../index";
import BaseMapToggle from '../widgets/BasemapToggle';
import LatLon from '../widgets/LatLon';

import Vue from 'vue';

export default {
  name: "MainMap",
  components:{
    BaseMapToggle, LatLon
  },
  data() {
    return {
      mapId: 'zlmap'
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init(){
      const arcgis = new ArcGis();
      await arcgis.load(this.modules);
      arcgis.genMap(this.mapId);
      // 注册到所有组件
      Vue.prototype.$arcgis = arcgis;
      this.$EventBus.$emit('mapLoaded');
      this.initWedgits()
    },
    initWedgits() {
      let view = this.$arcgis.view, esri = this.$arcgis.esri, map = this.$arcgis.map;
      // 比例尺
      var scaleBar = new esri.ScaleBar({
        view: view,
        unit: 'metric'
      });
      view.ui.add(scaleBar, {
        position: "bottom-left",
        unit: "metric",
        style: "ruler"
      });

      //  Home
      var homeWidget = new esri.Home({
        view: view
      });
      view.ui.add(homeWidget, "top-left");

      // 全屏
      var fullscreen = new esri.Fullscreen({
        view: view
      });
      view.ui.add(fullscreen, "top-left");

      // 缩放
      var zoom = new esri.Zoom({
        view: view
      });
      view.ui.add(zoom, {
        position: 'top-left'
      })

      // 搜索
      var searchWidget = new esri.Search({
        view: view
      });
      view.ui.add(searchWidget, {
        position: "top-right",
      });

      // 罗盘
      var compass = new esri.Compass({
        view: view
      });
      view.ui.add(compass, "top-left");
    },
    changeTab(tabName){
      this.curTab = tabName
    },
    activeBtn(name){
      this.activeBtns.push(name)
    }
  }
};
</script>

<style>
body, html{
  padding: 0;
  margin: 0;
}
</style>

<style scoped lang="scss">
$active: #4CAF50;
.gismap {
  width: 100vw;
  height: 100vh;
}
.wrapper{
  position: relative;
  display: flex;
  align-items: flex-start;
  .widgets{
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }
}
</style>
