let cached
export function getScrollBarSize(fresh) {
  if (fresh || cached === undefined) {
    const inner = document.createElement('div')
    inner.style.width = '100%'
    inner.style.height = '200px'

    const outer = document.createElement('div')
    const outerStyle = outer.style

    outerStyle.position = 'absolute'
    outerStyle.top = 0
    outerStyle.left = 0
    outerStyle.pointerEvents = 'none'
    outerStyle.visibility = 'hidden'
    outerStyle.width = '200px'
    outerStyle.height = '150px'
    outerStyle.overflow = 'hidden'

    outer.appendChild(inner)

    document.body.appendChild(outer)

    const widthContained = inner.offsetWidth
    outer.style.overflow = 'scroll'
    let widthScroll = inner.offsetWidth

    if (widthContained === widthScroll) {
      widthScroll = outer.clientWidth
    }

    document.body.removeChild(outer)

    cached = widthContained - widthScroll
  }
  return cached
}

export const debounce = function (func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  let later = function () {
    let last = Date.now() - timestamp; // 获取现在与上一次防抖函数的运行间隔时间

    if (last < wait && last >= 0) {
      // 间隔太小，频率过多，继续延迟
      timeout = setTimeout(later, wait - last); // wait - last为接下来不触发防抖的期望时间
    } else {
      timeout = null; // 间隔够长，运行函数
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (..._args) {
    context = this;
    args = _args;
    timestamp = Date.now(); //刷新最新一次调用该防抖函数的时间戳
    let callNow = immediate && !timeout; // 是否需要立即调用一次，
    if (!timeout) timeout = setTimeout(later, wait); // 同一时间内只存在一个超时
    if (callNow) {
      // 立即调用一次
      result = func.apply(context, args);
      context = args = null;
    }
    // 短时间内触发多次不会调用原函数
    return result;
  };
};


/**
 * 节流函数生成器
 * 对于调用频繁的地方，可保障在设置时间内只执行1次。
 * 使用方法:
 *
 * const currentThrottle = generateThrottle() //生成一个节流函数
 * currentThrottle(Data.now()) //如果超过了阈值则返回true，否则返回false
 *
 * @param throttleTime 设置此生成器的阈值
 */
export const generateThrottle = function (throttleTime) {
  let time = Date.now()
  return function (now) {
    // 如果没有设置节流时间， 使用默认配置的时间 15毫秒
    if (now - time > (throttleTime || 15)) {
      time = now
      return true
    }
  }
}