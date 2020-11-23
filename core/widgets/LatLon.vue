<!--显示经纬度-->
<template>
  <div class="latlon">经度:{{ lon }}，纬度:{{ lat }}</div>
</template>

<script>
export default {
  name: 'LatLon',
  data() {
    return {
      lat: 0,
      lon: 0
    }
  },
  methods: {},
  mounted(){
    this.$EventBus.$on(['mapLoaded', 'mapChanged'], ()=>{
      this.$arcgis.view.on('pointer-move', (event) => {
        const point = { x: event.x, y: event.y }
        const latlon = this.$arcgis.view.toMap(point)
        if(!latlon) return;
        this.lat = latlon.latitude.toFixed(6)
        this.lon = latlon.longitude.toFixed(6)
      })
    })
  },
  destroyed(){
    this.$EventBus.$off(['mapLoaded', 'mapChanged'])
  }
}
</script>

<style scoped>
.latlon{
    position: absolute;
    bottom: 5px;
    left: 5px;
    color: white;
    font-size: 14px;
    font-weight: 700;
}
</style>
