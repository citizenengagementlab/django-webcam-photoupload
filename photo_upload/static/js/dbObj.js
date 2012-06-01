(function (window, document, undefined) {
	var report = function (selector) {
		if (this === window) {
			return new report(selector);
		}
		this.objClass = 'DBObjV1';
		if (selector !== null && selector !== undefined) {
			this.target = selector;
			if (document.getElementById(selector) === null) {
				var targetInput = document.createElement('input');
				targetInput.id = selector;
				targetInput.type = 'hidden';
				targetInput.className = this.objClass;
				document.body.appendChild(targetInput);
			}
		}
		this.getByClass = function (className) {
			if (document.getElementsByClassName == undefined) {
				var hasClassName = new RegExp("(?:^|\\s)" + className + "(?:$|\\s)"),
						allElements = document.getElementsByTagName("*"), results = [], element;
				for (var i = 0; (element = allElements[i]) != null; i++) {
					var elementClass = element.className;
					if (elementClass && elementClass.indexOf(className) != -1 && hasClassName.test(elementClass))
						results.push(element);
				}
			} else {
				var results = document.getElementsByClassName(className);
			}
			return results;
		};
		this.parseObject = function (obj) {
			var parse = function (o) {
				var a = [], t;
				for (var p in o) {
					if (o.hasOwnProperty(p)) {
						t = o[p];
						if (t && typeof t == "object")
							a[a.length] = p + ":{ " + arguments.callee(t).join(", ") + "}";
						else
							a[a.length] = (typeof t == "string") ? [p + ": \"" + t.toString() + "\""] : [p + ": " + t.toString()];
					}
				}
				return a;
			}
			return "{" + parse(obj).join(", ") + "}";
		};
		this.getData = this.get = function () {
			if (this.target === undefined) {
				var ret = this.getObjects();
			} else {
				var ret = (document.getElementById(this.target) !== undefined && document.getElementById(this.target).value !== null && document.getElementById(this.target).value !== '')
			? eval('(' + document.getElementById(this.target).value + ')')
			: { exception: { status: 'failed', errorCode: '900', message: 'There is no data to return.'} };
			}
			return ret;
		};
		this.setData = this.set = this.buildData = this.build = this.create = function (data) {
			if (data !== undefined && data !== null)
				document.getElementById(this.target).value = this.parseObject(data);
			else
				document.getElementById(this.target).value = '{}';
			return this;
		};
		this.appendData = this.append = function (data) {
			var obj = this.get(), ret = true;
			if (data === null || data === undefined) {
				var ret = { exception: { status: 'failed', errorCode: '700', message: 'You must pass data to this method.'} };
			} else {
				for (var o in data) {
					if (obj[o] !== undefined && typeof data[o] === 'object') {
						for (var e in data[o]) {
							obj[o][e] = data[o][e];
						}
					} else {
						obj[o] = data[o];
					}
				}
				this.set(obj);
			}
			return (ret.exception !== undefined) ? ret : this;
		};
		this.appendChild = this.child = this.add = function (key, data) {
			var ret = true, tmpObj,
					obj = this.get();
			if ((obj === undefined || obj === null) || obj.exception !== undefined)
				obj = {};
			if (obj[key] === undefined || obj[key] === null)
				obj[key] = {};
			if (data !== undefined && data !== null) {
				for (var k in data)
					obj[key][k] = data[k];
			} else if (data === '' && this[this.target] === undefined) {
				obj = {};
			} else if (data === '' && this[this.target] !== undefined) {
				obj = obj;
			} else {
				var ret = { exception: { status: 'failed', errorCode: '700', message: 'You must pass data to this method.'} };
			}
			document.getElementById(this.target).value = this.parseObject(obj);
			return (ret.exception !== undefined) ? ret : this;
		};
		this.getObjects = function () {
			var ret = {}, objects = this.getByClass(this.objClass), obj;
			for (var e in objects) {
				if (typeof objects[e] === 'object') {
					ret[objects[e].id] = eval('(' + objects[e].value + ')');
				}
			}
			return ret;
		}
		return this;
	};
	window.goiReport = window.$rep = window._ = report;
})(window, document);