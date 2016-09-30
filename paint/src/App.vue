<template>
  <div id="paint">
    <ul class="controller">
      <li class="clear" @click="clear">Clear All<li>
    </ul>
    </ul>
    <ul class="colors">
      <li
        v-for="color in colors"
        :class="color.name"
        :data-selected="color.name === selectedColor.name ? true : false"
        @click="setColor(color.name)">
      </li>
    </ul>
    <canvas
      class="board"
      :width="boardSideLength"
      :height="boardSideLength"
      @mousedown="strokeStart"
      @mousemove="strokeInProgress"
      @mouseup="strokeEnd"
      @mouseout="strokeOutsideCanvas">
    </canvas>
  </div>
</template>

<script>

let vue_paint = {

  data () {
    return {
      boardSideLength: 508,
      colors: [
        {
          name: 'black',
          regularCode: '#222',
          opagueCode: 'rgb(189, 189, 189)',
        },
        {
          name: 'green',
          regularCode: '#5cb85c',
          opagueCode: 'rgb(206, 234, 206)',
        },
        {
          name: 'yellow',
          regularCode: '#f0ad4e',
          opagueCode: 'rgb(251, 231, 202)',
        },
        {
          name: 'red',
          regularCode: '#d9534f',
          opagueCode: 'rgb(244, 203, 202)',
        },
        {
          name: 'white',
          regularCode: '#fff',
          opagueCode: '#fff',
        },
      ],
      context: null,
      hasOnGoingStroke: false,
      selectedColor: '',
    };
  },

  methods: {
    // 初始化画板
    initPainter () {
      this.context = this.$el.getElementsByClassName('board')[0].getContext('2d');
      this.context.lineCap = 'round';
      this.context.lineJoin = 'round';
      this.context.lineWidth = 5;
      this.context.imageSmoothingEnabled = true;
      if (this.selectedColor === '') {
        this.setColor('black');
      }
    },
    // 拖拽相关
    strokeStart (evt) {
      if (this.context === null) {
        this.initPainter();
      }
      this.hasOnGoingStroke = true;
      this.context.beginPath();
      this.context.moveTo(evt.offsetX, evt.offsetY);
    },
    strokeInProgress (evt) {
      if (this.hasOnGoingStroke === true) {
        // mouseup 之前显示为半透明
        this.context.strokeStyle = this.selectedColor.opagueCode;
        this.context.lineTo(evt.offsetX, evt.offsetY);
        this.context.stroke();
      }
    },
    strokeEnd () {
      this.context.strokeStyle = this.selectedColor.regularCode;
      this.context.stroke();
      this.context.closePath();
      this.context.save();
      this.hasOnGoingStroke = false;
    },
    strokeOutsideCanvas () {
      this.hasOnGoingStroke = false;
    },
    // 选取颜色
    setColor (tarColorName) {
      this.selectedColor = (this.colors.find((item) => {
        return item.name === tarColorName;
      }));
    },
    // 清除整块画布
    clear () {
      try {
        this.context.clearRect(0, 0, this.boardSideLength, this.boardSideLength);
      } catch (e) {}
    },

  },

};

export default vue_paint;

</script>

<style lang="stylus">

$green = #5cb85c
$yellow = #f0ad4e
$red = #d9534f
$black = #222
$white = #fff
$grey = #eee

*
  margin 0
  padding 0
  list-style none

#paint
  position relative
  width 510px
  margin 20px auto
  position relative

  .controller
    float left
    margin 12px 0

    > li
      float left
      height 20px
      line-height 20px
      margin-right 12px
      cursor pointer
      transition all .2s
      &:hover
        text-shadow 0 0 1px $black

  .colors
    float right
    margin 12px 0

    > li
      float left
      width 14px
      height 14px
      margin-left 6px
      border 2px solid $black
      border-radius 50%
      cursor pointer
      transition all .2s
      &[data-selected]
      &:hover
        box-shadow 0 0 6px $black
      &.green
        background-color $green
      &.yellow
        background-color $yellow
      &.red
        background-color $red
      &.black
        background-color $black
      &.white
        background-color $white
      &.grey
        background-color $grey

  .board
    border 1px solid $black

</style>
