<template>
  <div v-if="show" class="commonTools">
    <!-- 工具列表 -->
    <div
      v-for="item in toolItems"
      :key="item.key"
      class="item"
    >
      <div class="tools" :class="item.key" @click="clickEvent(item)">
        <img :src="item.image" :alt="item.label" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "CommonTools",
  data() {
    return {
      show: true,
      toolItems: [
        {
          key: "location",
          image: require("../static/images/Location.png"),
          label: "经纬度定位"
        },
        {
          key: "measure",
          image: require("../static/images/measuringTools.png"),
          label: "测量工具"
        },
        {
          key: "home",
          image: require("../static/images/Home.png"),
          label: "回到默认视图"
        },
        {
          key: "move",
          image: require("../static/images/Move.png"),
          label: "移动工具"
        },
        {
          key: "addLayer",
          image: require("../static/images/addLayer.png"),
          label: "添加图层"
        },
        {
          key: "removeLayer",
          image: require("../static/images/removeLayer.png"),
          label: "删除图层"
        }
      ]
    };
  },
  methods: {
    clickEvent(item){

    }
  }
};
</script>

<style lang='scss' scope>
.clearFix:after,
.clearFix:before {
  /* 在box1前后添加内容"" */
  content: "";
  /* 使内连元素转换为块元素 */
  display: block;
  /* 清除两侧的浮动 */
  clear: both;
}

#compass {
  margin-left: -28%;
  width: 64px;
  height: 64px;
  background: url("../static/images/compass.png") no-repeat;
  background-position-x: -2px;
  background-size: 110% 110%;
}
.esri-compass .esri-compass__icon {
  font-size: 34px !important;
}
.esri-widget--button {
  color: red !important;
}

.commonTools {
  position: absolute;
  width: 42px;
  top: 10px;
  z-index: 100;
  margin-left: 10px;
}
.tools {
  cursor: pointer;
  width: 42px;
  height: 42px;
  margin-bottom: 9px;
}
#topbar {
  padding: 5px;
}
</style>
