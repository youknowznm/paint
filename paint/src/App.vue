<template>
  <div id="paint">
    <ul class="controller">
      <li v-for="color in colors.onDone" :class="color.name"></li>
    </ul>
    <canvas class="board" width=508 height=508></canvas>
  </div>
</template>

<script>
export default {

  data () {
    return {
      colors: {
        onDone: [
          {name: 'green', code: '#5cb85c'},
          {name: 'yellow', code: '#f0ad4e'},
          {name: 'red', code: '#d9534f'},
          {name: 'black', code: '#222'},
          {name: 'white', code: '#fff'},
        ],
        onGoing: [
          {name: 'grey', code: '#eee'},
        ],
      },
    };
  },

  methods: {
    init () {
      let board = document.getElementsByClassName('board')[0];
      let controller = document.getElementsByClassName('controller')[0];
      let canvas = canvasEle.getContext('2d')
      canvas.lineCap = 'round'
      canvas.lineWidth = '5'
      canvas.imageSmoothingEnabled = true;
    }
  },

};
</script>

<style lang="stylus">

$green = #5cb85c
$yellow = #f0ad4e
$red = #d9534f
$black = #222
$white = #fff
$grey = #eee

body
  margin 0
  padding 0

#paint
  position relative
  width 510px
  margin 20px auto
  position relative

  .controller
    float right

  .controller li
    float left
    width 20px
    height 20px
    margin-left 6px
    border 2px solid $black
    border-radius 50%
    cursor pointer
    list-style none

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
    &.active
      box-shadow 0 0 4px 0 $black

  .board
    border 1px solid $black

</style>
