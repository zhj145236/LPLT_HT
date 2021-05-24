(function(tool) {
	tool();
})(function() {
	tool = {
		ajax: function(obj) {
			var Ajax = function() {  
			    function request(opt) {  
			        function fn() {  
			        }  
			        var url = opt.url || "";  
			        var async = opt.async !== false, method = opt.method || 'GET', data = opt.data  
			                || null, success = opt.success || fn, error = opt.failure  
			                || fn;  
			        method = method.toUpperCase();  
			        if (method == 'GET' && data) {  
			            var args = "";  
			            if(typeof data == 'string'){  
			                //alert("string")  
			            args = data;  
			            }else if(typeof data == 'object'){  
			                //alert("object")  
			                var arr = new Array();  
			                for(var k in data){  
			                    var v = data[k];  
			                    arr.push(k + "=" + v);  
			                }  
			                args = arr.join("&");  
			            }  
			        url += (url.indexOf('?') == -1 ? '?' : '&') + args;  
			            data = null;  
			        }  
			        var xhr = window.XMLHttpRequest ? new XMLHttpRequest()  
			                : new ActiveXObject('Microsoft.XMLHTTP');  
			        xhr.onreadystatechange = function() {  
			            _onStateChange(xhr, success, error);  
			        };  
			        xhr.open(method, url, async);  
			        if (method == 'POST') {
			        	xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded;');  
			        }
			        if(opt.header){
						for(var attr in opt.header){
							xhr.setRequestHeader(attr,opt.header[attr]); 
						}
			       	}
			        xhr.send(data);  
			        return xhr;  
			    }  
			    function _onStateChange(xhr, success, failure) {  
			        if (xhr.readyState == 4) {  
			            var s = xhr.status;  
			            if (s >= 200 && s < 300) {  
			                success(xhr);  
			            } else {  
			                failure(xhr);  
			            }  
			        } else {  
			        }  
			    }  
			    return request; 
			}();
			
			return Ajax(obj);
		},
		extend: function(deep, target, options) {
			var copy;
			for (name in options) {
				copy = options[name];
				if (deep && copy instanceof Array) {
					target[name] = this.extend(deep, [], copy);
				} else if (deep && copy instanceof Object) {
					target[name] = this.extend(deep, {}, copy);
				} else {
					target[name] = options[name];
				}
			}
			return target;
		},
		find: function(ele, type) {
			var result;
			var inf = type.substring(0, 1);
			switch (inf) {
				case '.':
					type = type.substring(1);
					result = ele.getElementsByClassName(type);
					break;
				default:
					result = ele.getElementsByTagName(type);
					break;
			}
			return result;
		},
		hasClass: function(ele, cls) {
			return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
		},
		addClass: function(ele, cls) {
			if (!this.hasClass(ele, cls)) ele.className += " " + cls;
		},
		removeClass: function(ele, cls) {
			if (this.hasClass(ele, cls)) {
				var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
				ele.className = ele.className.replace(reg, ' ');
			}
		},
		toggleClass: function(ele, cls) {
			if (this.hasClass(ele, cls)) {
				this.removeClass(ele, cls);
			} else {
				this.addClass(ele, cls);
			}
		},
		setAttr: function(ele, son) {
			for (var attr in son) {
				ele.setAttribute(attr, son[attr]);
			}
		},
		getAttr: function(ele, attr) {
			return ele.getAttribute(attr);
		},
		parent: function(ele, cls) {
			var attr = '';
			if (cls) {
				var inf = cls.substring(0, 1);
				if (inf == '.') {
					attr = 'className';
				} else if (inf == '#') {
					attr = 'id';
				} else {
					attr = '';
				}
				var search = true;
				while (search) {
					ele = ele.parentNode;
					if (ele.tagName) {
						search = false;
						return ele.parentNode;
					}
					if (attr == 'className') {
						if (tool.hasClass(ele, cls.substring(1))) {
							// 结束遍历
							search = false;
						}
					} else if (attr == 'id') {
						if (ele.id == cls.substring(1)) {
							search = false;
						}
					} else {
						if (ele.tagName.toLowerCase() == cls.toLowerCase()) {
							search = false;
						}
					}
				}
				return ele;
			} else {
				return ele.parentNode;
			}
		}
	}
});