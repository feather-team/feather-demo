var $ = require('common:jquery'), isFunction = $.isFunction;

function clone(target, source, unfunc){
    //映射每个参数对象
    $.each(source, function(index, value){
        if(value instanceof $ || value.nodeType){
            target[index] = value;
            return;
        }

        if(unfunc && isFunction(value) || value == null) return;
        target[index] = $.isArray(value) ? clone([], value) : value.constructor == Object ? clone({}, value) : value;
    });

    return target;
}
        

module.exports = function(opt){
    var 
    //构造函数
    constructor = function(){
        var self = this;

        self.options = {};
        //只克隆非函数部分，减少内存消耗
        clone(self, prototype, true);
        //构造函数初始化
        self.initialize.apply(self, arguments);   
    },

    prototype = constructor.prototype, extend;

    if(extend = opt.extend){
        constructor.$parent = extend;

        clone(prototype, extend.prototype);
        clone(prototype, {
            //第一级为自身
            $depth: constructor, 
            
            //可调用父类的initialize函数
            parent: function(){
                var temp = this;
                  
                //调用父类intialize函数时 切换至更深一级父级
                temp.$depth = temp.$depth.$parent;
                //获取更深一级的parent函数
                temp.parent = temp.$depth ? temp.$depth.prototype.parent : null;
                //调用获取到的initialize函数
                temp.$depth.prototype.initialize.apply(temp, arguments);
                //还原深度
                temp.$depth = constructor;
                //还原parent函数
                temp.parent = arguments.callee;
             }
        });
        
        $.each(extend.prototype, function(index, p){
            if(isFunction(p) && $.inArray(index, ['parent', '$depth']) == -1){
                prototype.parent[index] = p;
            }
        });
    }

    delete opt.extend;
    
    clone(prototype, opt);

    //添加initialize函数
    if(!prototype.initialize){
        prototype.initialize = function(){};
    }    

    if(!prototype.setOptions){
        prototype.setOptions = function(opt){
            clone(this.options, opt);
        };
    }

    prototype.constructor = constructor;

    return constructor;
};