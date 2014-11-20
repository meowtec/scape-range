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