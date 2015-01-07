(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = '<div class="scape-range scape-range-theme-{{theme}}  scape-range-{{from}}">\n  <div class="scape-range-played">\n    <div class="scape-range-thumb">\n      <div class="scape-range-thumb-inner"></div>\n    </div>\n  </div>\n</div>\n';
},{}],2:[function(require,module,exports){
var scapeHtml = require('./scape.htm.js')
var _ = require('./utils')

/*
 * direction
 * 0 top to bottom
 * 1 right to left
 * 2 bottom to top
 * 3 left to right
 * */
var dirs = {
  'top': 0,
  'right': 1,
  'bottom': 2,
  'left': 3
}
function ScapeRange(setting) {
  /*
   * min
   * max
   * target
   * theme
   * from
   * */
  this._triggers = {}
  var _this = this
  this.target = setting.target
  this._input = setting.targetInput || {}
  // direction
  this._dir = dirs[setting.from]
  this._min = setting.min || 0
  this._max = setting.max || 1
  if (this._dir === undefined) {
    this._dir = 3
  }

  var html = _.tpl(scapeHtml, {
    theme: setting.theme || 'default',
    from: setting.from || 'left'
  })
  var node = _.node(html)
  this.target.appendChild(node)

  this.node = node
  this._played = _.child(node, function (elem){
    return _.hasClass(elem, 'scape-range-played')
  })
  this._thumb = _.child(this._played, function (elem){
    return _.hasClass(elem, 'scape-range-thumb')
  })
  if(this._dir % 2){
    this._thumbSize = this._thumb.clientWidth
    this._width = node.clientWidth
  }else{
    this._thumbSize = this._thumb.clientHeight
    this._width = node.clientHeight
  }


  var _mousemove = function (e) {
    e = e || window.event
    _this._ommousemove(e)
  }
  _.on(node, 'mousedown', function (e) {
    e = e || window.event
    _this._startScreenX = e.screenX
    _this._startScreenY = e.screenY
    _this._startPos = _this._pos
    var thumb = _.parent(e.target, function (elem) {
      return _.hasClass(elem, 'scape-range-thumb')
    }, true)

    if (thumb) {
      e.preventDefault()
      _.on(window, 'mousemove', _mousemove)
    }

  })
  _.on(window, 'mouseup', function () {
    _.off(window, 'mousemove', _mousemove)
  })
  this.val(setting.value || this._min)
}

ScapeRange.prototype.setPos = function (x) {
  var maxPos = this._width
  if (x < 0) {
    x = 0
  }
  if (x > maxPos - this._thumbSize) {
    x = maxPos - this._thumbSize
  }
  var prop = this._dir % 2 === 1 ? 'width' : 'height'
  this._played.style[prop] = (x + this._thumbSize) + 'px'
  this._pos = x
  return x
}

ScapeRange.prototype._ommousemove = function (e) {
  e.preventDefault()
  var screenX = e.screenX,
    screenY = e.screenY
  var newPos
  switch (this._dir) {
    case 0:
      newPos = this._startPos + screenY - this._startScreenY
      break
    case 1:
      newPos = this._startPos - screenX + this._startScreenX
      break
    case 2:
      newPos = this._startPos - screenY + this._startScreenY
      break
    case 3:
      newPos = this._startPos + screenX - this._startScreenX
      break
  }
  newPos = this.setPos(newPos)
  var val = newPos / (this._width - this._thumbSize) * (this._max - this._min) + this._min
  if(this._val !== val){
    this._val = val
    this._input.value = val
    this.trigger('change')
  }
}
ScapeRange.prototype.val = function () {
  if(!arguments.length){
    return this._val
  }else{
    var value = arguments[0],
      minVal = this._min,
      maxVal = this._max
    if(value < minVal){
      value = minVal
    }
    if(value > maxVal){
      value = maxVal
    }
    if(value <= maxVal && value >= minVal){
      var pos = (value - minVal)/(maxVal - minVal)*(this._width - this._thumbSize)
      this.setPos(pos)
      this._val = value
      this._input.value = value
    }
    return this
  }
}
ScapeRange.prototype.trigger = function (type, e) {
  if(e === undefined){
    e = this
  }
  var calls = this._triggers[type] || []
  var callback
  for(var i = 0; i < calls.length; i++){
    callback = calls[i]
    typeof callback === 'function' && callback.call(this, e)
  }
}
ScapeRange.prototype.on = function (type, callback) {
  var calls = this._triggers[type] = this._triggers[type] || []
  calls.push(callback)
}

window.ScapeRange = ScapeRange

},{"./scape.htm.js":1,"./utils":3}],3:[function(require,module,exports){
var _ = {
  tpl: function (str, dict) {
    for (var i in dict) {
      str = str.replace(new RegExp('\\{\\{' + i + '\\}\\}', 'g'), dict[i])
    }
    return str
  },
  log: function () {
    console.log.apply(console, arguments)
  },
  nodes: function (str) {
    var div = document.createElement('div')
    div.innerHTML = str
    var fragment = document.createDocumentFragment()
    var nodes = div.childNodes
    while (nodes[0]) {
      fragment.appendChild(nodes[0])
    }
    return fragment
  },
  node: function (str) {
    return this.nodes(str).childNodes[0]
  },
  hasClass: function (ele, cls) {
    return ele.className && ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
  },
  addClass: function (ele, cls) {
    if (!this.hasClass(ele, cls)) {
      ele.className += " " + cls;
    }
  },
  removeClass: function (ele, cls) {
    if (this.hasClass(ele, cls)) {
      var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
      ele.className = ele.className.replace(reg, ' ');
    }
  },
  on: function (element, type, handler) {
    if (element.addEventListener) {
      element.addEventListener(type, handler, false);
    } else if (element.attachEvent) {
      element.attachEvent("on" + type, handler);
    } else {
      element["on" + type] = handler;
    }
  },
  off: function (element, type, handler) {
    if (element.removeEventListener) {
      element.removeEventListener(type, handler, false);
    } else if (element.detachEvent) {
      element.detachEvent("on" + type, handler);
    } else {
      element["on" + type] = null;
    }
  },
  parent: function (elem, cond, self) {
    if (!self) {
      elem = elem.parentNode
    }
    while (elem) {
      if (cond(elem)) {
        return elem
      }
      elem = elem.parentNode
    }
  },
  child: function (elem, cond, self) {
    var childNodes = elem.childNodes
    var node, result
    var i = 0
    self && (i = -1)
    for(; i < childNodes.length; i++){
      node = childNodes[i] || elem
      result = null
      try{
        result = cond(node)
      }catch (e){}
      if(result){
        return node
      }
    }
  }
}

module.exports = _
},{}]},{},[2]);
