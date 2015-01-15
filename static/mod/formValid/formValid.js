var $ = require('jquery');

function FormValid(opt){
	this.options = $.extend({
		dom: null,
		rules: {},
		showSuccessStatus: false
	}, opt || {});

	this.init();
}

FormValid.prototype = {
	init: function(){
		this.dom = $(this.options.dom);
		this.initRules();
		this.reset();
	},

	initRules: function(){
		var self = this,
			dRules = FormValid.DEFAULT_RULES, prefix = FormValid.ATTRIBUTE_PREFIX,
			aLen = FormValid.ATTIBUTE_LENGTH, aRule = FormValid.ATTRIBUTE_RULE;

		$.each(self.dom[0].elements, function(index, element){
			var name = element.name;

			if(!name) return;

			var $element = $(element);

			$.each(dRules, function(key, value){
				var attr = prefix + key;

				if($element.attr(attr) != null){
					self.addRule(name, {
						rule: key == 'length' ? new RegExp('^\\S{' + $element.attr(attr) + '}$') : value.rule,
						errorText: $element.attr(attr + '-error') || value.errorText,
						successText: $element.attr(attr + '-success') || value.successText
					});
				}
			});
		});
	},

	check: function(name){
		var self = this, status = true, rules = self.options.rules, tmpRules;

		self.reset(name, false);

        if(name){
            tmpRules = {};
            tmpRules[name] = rules[name] || {};
        }else{
            tmpRules = rules;
        }

		$.each(tmpRules, function(index, item){
			var $tmp = self.getElement(index), value = $tmp.val(), tmpStatus = true;

			if(!$.isArray(item)){
				item = [item];
			}

			var tmp;

			for(var i = 0; i < item.length; i++){
				tmp = item[i];

				if(typeof tmp.rule == 'function' && !tmp.rule(value)){
					status = false; tmpStatus = false;
				}else if (tmp.rule.constructor == RegExp && !tmp.rule.test(value)){
					status = false; tmpStatus = false;
				}

				if(!tmpStatus){
					self.error(index, tmp.errorText);
					return;
				}	
			} 

			self.success(index, tmp.successText);
		});

		return status;
	},

	error: function(name, text){
    	this.setText(name, text || '', 'ui-formvalid-field-error');    
    },

	success: function(name, text){
		if(text != null || this.options.showSuccessStatus){
			text = text || '';
			this.setText(name, text, 'ui-formvalid-field-success');	
		}
	},

	setText: function(name, text, classname){
		var $parent = this.getElement(name).parent();

		$parent.find('.ui-formvalid-field[data-formvalid-target="' + name + '"]').remove();

		if(text != null){
			$parent.append('<span class="ui-formvalid-field ' + classname + '" data-formvalid-target="' + name + '">' + (text || '&nbsp;') + '</span>');
		}
	},

	reset: function(name, _default){
		var self = this;

		if(name){
			var text; 

			if(_default == null || _default){
				text = self.getElement(name).attr(FormValid.ATTRIBUTE_DEFAULT);
			}
            
            self.setText(name, text, 'ui-formvalid-field-default');
        }else{
            $.each(self.dom[0].elements, function(index, element){
            	var name = element.name;

            	if(!name) return;

				if(_default == null || _default){
					text = $(element).attr(FormValid.ATTRIBUTE_DEFAULT);
				}

				self.setText(name, text, 'ui-formvalid-field-default');
        	});
        }
	},

	addRule: function(name, rule){
		var rules = this.options.rules[name] || [];

		if(!$.isArray(rules)){
			rules = [rules];
		}

		rules.push(rule);

		this.options.rules[name] = rules;
	},

	getElement: function(name){
		return this.dom.find('[name=' + name + ']');
	}
};

$.extend(FormValid, {
	ATTRIBUTE_PREFIX: 'data-formvalid-',

	DEFAULT_RULES: {
		required: {
			rule: /\S+/,
			errorText: '该字段必填'
		},

		email: {
			rule: /^[a-z][\w_-]*@[\w_-]+(?:\.[\w_-])+$/i,
			errorText: '邮箱地址格式错误'
		},

		number: {
			rule: /^\d+$/,
			errorText: '该字段必须为数字'
		},

		length: {
			rule: /^[\s\S]*$/
		}
	}
});

FormValid.ATTRIBUTE_DEFAULT = FormValid.ATTRIBUTE_PREFIX + 'default';

return FormValid;