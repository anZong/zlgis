<!--切换底图 todo: 打开调试窗口的时候鼠标划过会闪烁-->
<template>
  <div
    :class="'toggle '+ position"
    @mouseenter="fold=false"
    @mouseleave="fold=true;changeOrder();"
  >
    <div class="images" :class="fold ? 'fold' : 'unfold'">
      <div
        v-for="(item,index) in basemaps"
        :key="item.name"
        class="pointer item"
        :class="curBaseMap == item.name ? 'curItem' : ''"
        :style="fold? 'margin-top:'+(index+1)*10+'px;z-index:'+(10-index) : ''"
        @click="changeBaseMap(item, $event)"
      >
        <img :src="item.image" />
        <p class="label">{{ item.label }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BasemapToggle",
  props:{
    show3D:{
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      curBaseMap: "GoogleImage",
      position: "bottom-right",
      fold: true // 展开还是折叠
    };
  },
  computed:{
    basemaps(){
      let arr = [
        {
          name: "GoogleImage",
          label: "卫星地图",
          image: require("../static/images/imageMap.png"),
          type: "2d"
        },
        {
          name: "GoogleStreetMap",
          label: "街道地图",
          image: require("../static/images/streetMap.png"),
          type: "2d"
        }
      ]
      if(this.show3D){
        arr.push({
          name: "GoogleImage3D",
          label: "3D地图",
          image: require("../static/images/3DMap.png"),
          type: "3d"
        })
      }
      return arr
    }
  },
  methods: {
    changeBaseMap(basemap) {
      // 切换底图
      const arcgis = this.$arcgis;
      const basemapname = basemap.name;
      this.curBaseMap = basemapname;
      this.type = basemap.type;
      const flayer = arcgis.getLayer("GoogleImage");
      const slayer = arcgis.getLayer("GoogleStreetMap");
      if (basemap.type == "2d") {
        if (basemapname == "GoogleImage") {
          flayer.visible = true;
          slayer.visible = false;
        } else if (basemapname == "GoogleStreetMap") {
          flayer.visible = false;
          slayer.visible = true;
        }
      }else{
        // 切换2d/3d
        flayer.visible = true;
        slayer.visible = false;
      }
      const activeLayers = arcgis.map.allLayers.items.filter(v=>{
        return v.id !== "worldElevation"
      });
      arcgis.switchView(basemap.type, activeLayers);
      // 折叠起来的时候，点击切换顺序
      if (this.fold) {
        this.changeOrder();
      }
      this.$EventBus.$emit('mapChanged');
    },
    changeOrder() {
      const index = this.basemaps.findIndex(v => {
        return v.name == this.curBaseMap;
      });
      if (!index) return;
      const obj = this.basemaps.splice(index, 1)[0];
      this.basemaps.unshift(obj);
    }
  }
};
</script>

<style scoped lang="scss">
.toggle {
  position: absolute;
  z-index: 1;
  cursor: pointer;
  width: 200px;
  display: flex;
  justify-content: flex-end;
  &.bottom-right {
    right: 10px;
    bottom: 10px;
  }
  &.top-right {
    right: 10px;
    top: 100px;
  }
  &.bottom-left {
    left: 10px;
    bottom: 10px;
  }
  .images {
    height: 90px;
    display: flex;
    align-items: flex-end;
    &.unfold {
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        .label {
          bottom: 0;
        }
      }
    }
    &.fold {
      .item:not(:first-child) {
        margin-left: -52px;
        margin-top: 10px;
      }
    }
    .item {
      margin-left: 10px;
      position: relative;
      &.curItem {
        img {
          border: 1px solid #eee;
          box-shadow: 0px 0px 5px white;
        }
      }
      .label {
        white-space: nowrap;
        color: white;
        font-size: 12px;
        position: absolute;
        bottom: 5px;
        left: 0;
        right: 0;
        margin: 0 0 2px 0;
        text-align: center;
        background-color: rgba(0, 0, 0, 0.2);
      }
    }
    img {
      // width: 50px;
      height: 52px;
      border: 1px solid transparent;
      border-radius: 5px;
      &:hover {
        border: 1px solid #eee;
        box-shadow: 0px 0px 5px white;
      }
    }
  }
}
</style>
