/*
paint 初始化函数
@param {Object.node} canvasEle 用作画布的 canvas 元素
@param {Object.node} colorsEle 控制元素颜色的 ul 元素
@param {Object.node} controllersEle 作为画布工具栏的 ul 元素
@param {Object.imageData} imageData 提供时，将其画入画布
*/
const initCanvas = (canvasEle, colorsEle, controllersEle, imageData) => {
  // 颜色值对象
  const colorTable = [
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
  ];

  // 初始化 context
  let ctx = canvasEle.getContext('2d');
  let selectedColor = null;
  let hasOnGoingStroke = false;
  let prevStatusStack = [];
  let futureStatusStack = [];
  let $canvas = $(canvasEle);

  // 方法：将 imageData 写入一个 Image 对象，画在 canvas 上
  const loadImageData = (data) => {
    let img = new Image();
    img.src = data;
    img.onload = () => {
      clearCanvas();
      ctx.drawImage(img, 0, 0);
    };
  }
  // 方法：存储当前的 canvas 内容为 imageData，推入状态栈
  const saveImageData = () => {
    let currentStatus = canvasEle.toDataURL();
    prevStatusStack.unshift(currentStatus);
  };
  // 方法：清除画布
  const clearCanvas = () => {
    ctx.clearRect(0, 0, 500, 500);
  };
  // 若提供了 imageData 参数就画出来
  if (imageData !== null) {
    loadImageData(imageData);
  }
  // 然后无论此时是否已有内容，推入状态栈一次
  saveImageData();

  // 颜色选择器鼠标事件
  $(colorsEle).children('li')
    .on('click', function() {
      let $this = $(this);
      const tarColorName = $this.data('color');
      selectedColor = colorTable.find((item) => {
        return item.name === tarColorName;
      });
      $this
        .siblings('.current')
        .removeClass('current')
        .end()
        .addClass('current');
    })
    .siblings('[data-color=black]')
    .click();
  // canvas 鼠标事件
  $canvas.on('mousedown touchstart', (evt) => {
      let x, y;
      switch (evt.type) {
        case 'touchstart':
          x = evt.touches[0].clientX - $canvas.offset().left;
          y = evt.touches[0].clientY - $canvas.offset().top;
          break;
        default:
          x = evt.offsetX;
          y = evt.offsetY;
          break;
      }
      hasOnGoingStroke = true;
      ctx.strokeStyle = selectedColor.opagueCode;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.imageSmoothingEnabled = true;
      ctx.beginPath();
      ctx.moveTo(x, y);
    })
    .on('mousemove touchmove', (evt) => {
      if (hasOnGoingStroke === true) {
        let x, y;
        switch (evt.type) {
          case 'touchmove':
            x = evt.changedTouches[0].clientX - $canvas.offset().left;
            y = evt.changedTouches[0].clientY - $canvas.offset().top;
            break;
          default:
            x = evt.offsetX;
            y = evt.offsetY;
            break;
        }
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    })
    .on('mouseout mouseup touchend', (evt) => {
      if (hasOnGoingStroke === true) {
        let x, y;
        switch (evt.type) {
          case 'touchend':
            x = evt.changedTouches[0].clientX - $canvas.offset().left;
            y = evt.changedTouches[0].clientY - $canvas.offset().top;
            break;
          default:
            x = evt.offsetX;
            y = evt.offsetY;
            break;
        }
        ctx.strokeStyle = selectedColor.regularCode;
        ctx.lineTo(x, y);
        ctx.stroke();
        hasOnGoingStroke = false;
        saveImageData();
      }
    });

  // 控制器鼠标事件
  $(controllersEle)
    .children('.undo')
    .on('click', (evt) => {
      if (prevStatusStack.length !== 0) {
        loadImageData(prevStatusStack[0]);
        let currentStep = prevStatusStack.splice(0, 1);
        futureStatusStack.unshift(currentStep);
      }
    })
    .end()
    .children('.redo')
    .on('click', (evt) => {
      if (futureStatusStack.length !== 0) {
        loadImageData(futureStatusStack[0]);
        let currentStep = futureStatusStack.splice(0, 1);
        prevStatusStack.unshift(currentStep);
      }
    })
    .end()
    .children('.clear')
    .on('click', () => {
      clearCanvas();
    });
};
