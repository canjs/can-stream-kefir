var Kefir = require('kefir');
var stache = require('can-stache');

require('../can-stream-kefir');

var view = stache.from('demo');

var val = Kefir.stream(function(emitter) {
  emitter.emit('Kevin');
  emitter.end();
});

document.body.appendChild(
    view({ val: val })
);
