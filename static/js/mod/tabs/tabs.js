var $ = require('jquery');

var tabs = function(opt){
    this.options = $.extend({
        dom: null,
        attr: 'href',
        currentclass: '',
        currentClass: '',
        currentindex: 0,
        currentIndex: 0,
        event: 'click',
        callback: function(){}
    }, opt || {});

    this.init();
};

tabs.prototype = {
    init: function(){
        var self = this, opt = self.options;

        self.doms = $(opt.dom);
        self.targets = [];

        $.each(self.doms, function(index, item){
            var id = item[opt.attr] || item.getAttribute(opt.attr);
            var target;
            
            if(target = document.getElementById(id)){
                self.targets.push(target);
            }
        });
        
        self.targets = $(self.targets);
        self.bind();
        self.tabTo(opt.currentindex || opt.currentIndex);
    },
    
    bind: function(){
        var self = this, opt = self.options, cc = opt.currentclass || opt.currentClass;

        $.each(self.doms, function(index, item){
            $(item).bind(opt.event, function(){
                self.targets.hide();
                self.targets[index] && self.targets.eq(index).show();
                
                if(cc){
                    self.doms.removeClass(cc);
                    $(this).addClass(cc);
                }

                opt.callback && opt.callback.call(self, index);

                return false;
            });
        });
    },
    
    tabTo: function(index){
        var self = this, index = index || 0;

        if(index > self.doms.length - 1) return false;
        
        self.doms.eq(index).trigger(self.options.event);
    }
};

return tabs;