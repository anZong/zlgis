<template>
  <div class="wrapper">
    <div :id="mapId" class="gismap"></div>
    <div class="widgets">
      <BaseMapToggle></BaseMapToggle>
      <CommonTools></CommonTools>
      <LatLon></LatLon>
    </div>
  </div>
</template>

<script>
import ArcGis from "../index";
import BaseMapToggle from '../widgets/BasemapToggle';
import CommonTools from '../widgets/CommonTools';
import LatLon from '../widgets/LatLon';

import Vue from 'vue';

export default {
  name: "MainMap",
  components:{
    BaseMapToggle, CommonTools, LatLon
  },
  data() {
    return {
      mapId: 'zlmap',
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
.wrapper{
  position: relative;
}
.gismap {
  width: 100vw;
  height: 100vh;
}
</style>
