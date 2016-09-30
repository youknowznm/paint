<template>
  <div id="paint">
    <ul class="controller">
      <li
        v-for="controller in controllers"
        :class="controller">
      </li>
    </ul>
    <ul class="colors">
      <li
        v-for="color in colors"
        :class="color.name"
        :data-selected="color.name === selectedColor.name ? true : false"
        @click="selectColor(color.name)">
      </li>
    </ul>
    <canvas
      class="board"
      width=508
      height=508
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
      controllers: [
        'undo',
        'redo',
        'clear',
      ],
      colors: [
        {name: 'black', code: '#222'},
        {name: 'green', code: '#5cb85c'},
        {name: 'yellow', code: '#f0ad4e'},
        {name: 'red', code: '#d9534f'},
        {name: 'white', code: '#fff'},
      ],
      painter: null,
      hasOnGoingStroke: false,
      selectedColor: '',
      onGoingColorCode: '#eee',
    };
  },

  // created () {
  //   console.log('caonima');
  //   this.initPaint()
  // },

  methods: {
    // 初始化画板
    initPainter () {
      this.painter = this.$el.getElementsByClassName('board')[0].getContext('2d');
      this.painter.lineCap = 'round';
      this.painter.lineJoin = 'round';
      this.painter.lineWidth = 5;
      this.painter.imageSmoothingEnabled = true;
      this.selectedColor = this.colors[0];
    },
    // 拖拽相关
    strokeStart (evt) {
      if (this.painter === null) {
        this.initPainter();
      }
      this.hasOnGoingStroke = true;
      this.painter.beginPath();
      this.painter.moveTo(evt.offsetX, evt.offsetY);
    },
    strokeInProgress (evt) {
      if (this.hasOnGoingStroke === true) {
        this.painter.strokeStyle =
          this.selectedColor.name === 'white'
          ? this.onGoingColorCode
          : this.colors.white.code;
        this.painter.lineTo(evt.offsetX, evt.offsetY);
        this.painter.stroke();
      }
    },
    strokeEnd () {
      this.painter.strokeStyle = this.selectedColor.code;
      this.painter.stroke();
      this.painter.closePath();
      this.hasOnGoingStroke = false;
    },
    strokeOutsideCanvas () {
      this.hasOnGoingStroke = false;
    },
    // 选取颜色
    selectColor (tarColorName) {
      this.selectedColor = (this.colors.find((item) => {
        return item.name === tarColorName;
      }));
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
      width 20px
      height 20px
      margin-right 12px
      cursor pointer
      list-style none
      background no-repeat 0 0
      background-size 20px 20px
      opacity .6
      transition opacity .2s
      &.undo
        background-image url("/src/static/ic-undo.png")
      &.redo
        background-image url("/src/static/ic-redo.png")
      &.clear
        background-image url("/src/static/ic-clear.png")
      &:hover
        opacity 1

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
      list-style none
      opacity .6
      transition all .2s
      &[data-selected]
      &:hover
        opacity 1
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
