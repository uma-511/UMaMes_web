<template>
  <!-- :disabled="disabledTip" -->
  <el-tooltip
    ref="tlp"
    :content="text"
    :disabled="!tooltipFlag"
    :placement="placement"
    effect="dark"
    class="tooltip"
  >
    <span :class="className" @mouseenter="visibilityChange($event)">{{ text }}</span>
  </el-tooltip>
</template>

<script>
export default {
  name: 'EllipsisTooltip',
  props: {
    text: { type: String, default: '' }, // 字符内容
    placement: { type: String, default: 'top-start' },
    className: { type: String, default: 'text' } // class
  },
  data() {
    return {
      disabledTip: false,
      tooltipFlag: false
    }
  },
  methods: {
    // tooltip的可控
    visibilityChange(event) {
      const ev = event.target
      const ev_height = ev.offsetHeight // 文本的实际高度
      const content_height = this.$refs.tlp.$el.parentNode.clientHeight // 文本容器高度
      if (content_height < ev_height) {
        // 实际内容高度 > 文本高度 =》内容溢出
        this.tooltipFlag = true // NameIsIncludeWord ? true : !!false
      } else {
        // 否则为不溢出
        this.tooltipFlag = false
      }
    }
  }
}
</script>
