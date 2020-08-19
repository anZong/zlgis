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
    this.$EventBus.$on('mapLoaded', ()=>{
      this.$arcgis.view.on('pointer-move', (event) => {
        const point = { x: event.x, y: event.y }
        const latlon = this.$arcgis.view.toMap(point)
        this.lat = latlon.latitude.toFixed(6)
        this.lon = latlon.longitude.toFixed(6)
      })
    })
  }
}
</script>

<style scoped>
.latlon{
    position: absolute;
    bottom: 10px;
    left: 10px;
    color: white;
    font-size: 14px;
    font-family: "Microsoft YaHei UI";
    font-weight: 700;
}
</style>
