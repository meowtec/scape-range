#!/usr/bin/env node
var fs = require('fs'), str2js = require('string-to-js')

process.argv.slice(2).forEach(function(arg){
  var plain = fs.readFileSync(arg, 'utf8')
  var js = str2js(plain)
  fs.writeFile(arg + '.js', js)
})