;(function(window, factory){
if(typeof define == 'function'){
    //seajs or requirejs environment
    define(function(require, exports, module){
        return factory(
            require('common:jquery'),
            require('common:util')
        );
    });
}else{
    window.FeatherUi = window.FeatherUi || {};
    window.FeatherUi.Draggable = factory(window.jQuery || window.$, window.FeatherUi.Util);
}
})(window, function($, Util){

var toInt = Util.number.toInt;

var Draggable = function(opt){
    this.options = $.extend({
        dom: null,
        handle: null,   //触发事件的dom
        start: function(){},
        drag: function(){},
        stop: function(){},
        axis: null  //x, y
    }, opt || {});
    
    this.init();   
}

Draggable.prototype = {
    init: function(){
        var self = this, opt = self.options;
        var $dom = self.dom = $(opt.dom).addClass('ui-draggable');
        self.handle = $(opt.handle || opt.dom).addClass('ui-draggable');
        
        !/fixed|absolute/.test($dom.css('position')) && $dom.css('position', 'relative');
        
        //坐标差距
        this.range = {};
        this.bind();
    },
    
    bind: function(){
        var self = this;
        
        self.handle.mousedown(function(e){
            document.selection && document.selection.empty();
            self.dragStart(e);
            
            return false;
        }).bind('selectstart drag', function(){
            return false;
        });
        
        //simple curry bind
        self.curryDrag = (function(){
            return function(){
                self.drag.apply(self, arguments);
            };
        })();

        self.curryDragStop = (function(){
            return function(){
                self.dragStop.apply(self, arguments);
            }
        })();
    },
    
    dragStart: function(e){
        //获取坐标差距
        var self = this, left = toInt(self.dom.css('left')), top = toInt(self.dom.css('top'));

        self.range = {
            x: e.pageX - left,
            y: e.pageY - top
        };
        
        $(document).mousemove(self.curryDrag).mouseup(self.curryDragStop);
        self.options.start && self.options.start.call(self, left, top);
    },
    
    drag: function(e){
        var self = this, left = e.pageX - self.range.x, top = e.pageY - self.range.y, obj = {left: left, top: top}, axis = self.options.axis;

        axis == 'x' && delete obj.top;
        axis == 'y' && delete obj.left;

        self.dom.css(obj);
        self.options.drag && self.options.drag.call(self, left, top);
    },
    
    dragStop: function(){
        var self = this;

        $(document).unbind('mousemove', self.curryDrag).unbind('mouseup', self.curryDragStop);
        self.options.stop && self.options.stop.call(self);
    }
};

return Draggable;

});