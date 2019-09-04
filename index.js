/**
 * 基础公式：
 * y = a*x^2 + b*x + c
 * x y
 * 开始元素(x, y) 结束元素(x1, y1)
 * y = a*x^2 + b*x + c
 */
function Fly(opts) {
  this.setOpetions(opts);
}
Fly.prototype = {
  /**
   * 初始化
   * @param {*} opts 配置项
   */
  init: function() {
    if (!this.$el) return;
    const { clientWidth: elWidth, clientHeight: elHeight } = this.$el;
    // 此处使用传递进来的flyEL，clone的元素未插入dom中，获取不到宽高
    const { clientWidth: flyElWidth, clientHeight: flyElHeight } = this.opts.flyEl || this.$el;

    // 两点坐标
    const { x: originX, y: originY } = this.$el.getBoundingClientRect();
    const { x: targetX, y: targetY } = this.$targetEl.getBoundingClientRect();
    this.originX = originX + elWidth / 2 - flyElWidth / 2;
    this.originY = originY + elHeight / 2 - flyElHeight / 2;
    // TODO 支持作为dom传入
    // 克隆el 作为抛物
    this.initCloneNode(this.originX, this.originY);
    // 计算抛物线方程的系数
    // 。------------------> x
    // | (originX, originY) 平移到原点 (0, 0) => y=a*x^2 + bx
    // |
    // |
    // v y
    // b =(y - a*x^2) / x
    const offsetX = targetX - originX;
    const offsetY = targetY - originY;

    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.b = (offsetY - this.a * offsetX * offsetX) / offsetX;
  },
  /**
   * 开始抛
   */
  start: function() {
    const self = this;
    this.b || this.init();
    // 开始移动
    if (this.timer) {
      try {
        this.stop();
      } catch (e) {
        return;
      }
    }
    this.fn.start &&
      this.fn.start instanceof Function &&
      this.fn.start.call(this);
    // 暂存开始时间戳
    this.start = dateNow();
    // 计算结束时间
    this.end = this.start + this.duration;
    this.timer = setInterval(function() {
      let now = dateNow();
      self.step(now);
    }, 13);
  },
  /**
   * 结束
   */
  stop: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.removeCloneNode();
    }
  },
  /**
   * 配置项
   * @param {Object} opts
   */
  setOpetions: function(opts) {
    if (!opts) return;
    this.opts = opts;

    this.$el = opts.el; // 开始元素
    this.$targetEl = opts.targetEl; // 终点元素
    if (opts.flyEl) {
      this.$flyEl = opts.flyEl.cloneNode(true);
    } else {
      this.$flyEl = this.$el.cloneNode(true); // 默认clone当前元素，可指定
    }

    this.duration = opts.duration || 1200;
    this.a = opts.a || 0.001; // 系数a
    this.timer = null; // 定时器

    this.fn = {};
    this.fn.start = opts.start; // 开始回调
    this.fn.step = opts.step; // 步进回调
    this.fn.stop = opts.stop; // 结束回调
  },

  /**
   * 移动到指定坐标
   * @param {*} x 偏移的left坐标
   * @param {*} y 偏移的top坐标
   */
  moveTo: function(x, y) {
    swapStyle(this.$flyEl, {
      left: `${x + this.originX}px`,
      top: `${y + this.originY}px`,
    });
  },
  // eachStep
  step: function(now) {
    let x, y;
    if (now > this.end) {
      x = this.offsetX;
      y = this.offsetY;
      this.moveTo(x, y);
      this.stop();
      // 结束回调
      this.fn.stop &&
        this.fn.stop instanceof Function &&
        this.fn.stop.call(this);
    } else {
      let speed = this.offsetX / this.duration;
      let x = speed * (now - this.start);
      let calcRes = calcPoint(this.a, this.b, x);
      this.moveTo(x, calcRes.y);
      // 步进回调
      this.fn.step &&
        this.fn.step instanceof Function &&
        this.fn.step.call(this);
    }
    // 执行动画
  },
  /**
   * 初始化克隆元素
   * @param {*} x
   * @param {*} y
   */
  initCloneNode: function(x, y) {
    const { $flyEl } = this;
    $flyEl.classList.add('e-fly-clone')
    Object.assign($flyEl.style, {
      position: 'fixed',
      left: `${x}px`,
      top: `${y}px`,
      opacity: 1,
    });
    document.body.appendChild($flyEl);
  },
  /**
   * 移除克隆元素
   * @param {*} x
   * @param {*} y
   */
  removeCloneNode: function() {
    const { opts, $flyEl } = this;
    // if (opts.flyEl) {
    //   swapStyle($flyEl, {
    //     opacity: 0,
    //   });
    //   return;
    // }
    $flyEl && $flyEl.remove();
  },
};
/**
 * 计算坐标点
 * @param {*} a
 * @param {*} b
 * @param {*} x
 * @returns (x, y)
 */
function calcPoint(a, b, x) {
  let y = a * x * x + b * x;
  return {
    x,
    y,
  };
}
/**
 * 获取当前时间
 * 相当于new Date().valueOf()/new Date().now()
 * @returns 当前时间
 */
function dateNow() {
  return +new Date();
}

/**
 * 设置ele的样式
 * @param {*} elem
 * @param {*} options
 * @returns
 */
function swapStyle(elem, options) {
  for (let p in options) {
    elem.style[p] = options[p];
  }
  return elem;
}
export default Fly;
