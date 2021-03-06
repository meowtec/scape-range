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
