/*
 * 
 * File: verify.js
 * 
 * Date: 9:43 2010-8-04
 * 
 * Author: napoleon
 * 
 * Version: 0.0.1
 * 
 * v:base verify function,c:compare verify function,f:function compare verify function,a:Ajax verify function,s:radio and checkbox input verify function
 * 
 * d:default notice information
 * 
 * c:success notice information,e:failure notice information
 * 
 * r:regular expression(can not add quotation marks)
 * 
 * m:compare model，w:the name which compare with the object
 * 
 * u:URL,a:arguments,w:processing notice information
 * 
 * e.g.
 * verifys="{d:'default notice information',v:{r:/^.{1,}$/,c:'success notice information',e:'failure notice informatin'},c:{m:'=',w:'name',c:'compare success notice information',e:'compare failure notice information'},a:{u:'test.php',a:'act=exist',w:'procession...',c:'server verify success notice information',e:'server verify failure notice information'}}"
 * 
 * Optimization：function tip,on submit
 * 
 */
(
	function(window, undefined)
	{
		/*
		 * ajax.js 8:31 2010-8-10 napoleon
		 */
		var ajax = 
		{
			/*
			 * call
			 * 
			 * url         {String}      请求地址
			 * args        {String}      发送参数
			 * callback    {Function}    回调函数
			 * method      {String}      请求方式：GET、POST
			 * type        {String}      返回数据类型：JSON、XML、TEXT
			 * syn         {Boolean}     是否异步请求
			 * 
			 */
			call : function(url, args, callback, method, type, syn)
			{
				method = typeof method == 'string' && method.toUpperCase() === "GET" ? "GET" : "POST";
				type = typeof type == 'string' && (type = type.toUpperCase() === "JSON" || type === "XML") ? type : "TEXT";
				syn = syn === false ? false : true;
				
				var xhr = this.create();
				
				if(method === "GET")
				{
					var d = new Date();
					url += args ? (url.indexOf("?") === - 1 ? "?" : "&") + args : "";
					url = encodeURI(url) + (url.indexOf("?") === - 1 ? "?" : "&") + d.getTime() + d.getMilliseconds();
					args = null;
				}
				xhr.open(method, url, syn);
				if(method === "POST")
				{
					xhr.setRequestHeader("x-requested-with", "XMLHttpRequest");
					xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
				}
				this.loading();
				var self = this;
				xhr.onreadystatechange = function()
				{
					if (xhr.readyState == 4)
					{
						if (xhr.status == 200)
						{
							self.complete();
							callback.call(self, self.response(type, xhr));
						}
					}
				}
				xhr.send(args);
			},
			
			/*
			 * create
			 */
			create : function()
			{
				var xhr = null;
				// 开始初始化XMLHttpRequest对象
				if(window.XMLHttpRequest)
				{
					// FireFox 浏览器
					xhr = new XMLHttpRequest();
					if(xhr.overrideMimeType)
					{
						// 设置MiME类别
						xhr.overrideMimeType('text/xml');
					}
				}
				else if(window.ActiveXObject)
				{
					// IE浏览器
					try
					{
						xhr = new ActiveXObject("Msxml2.XMLHTTP");
					}
					catch (e)
					{
						try
						{
							xhr = new ActiveXObject("Microsoft.XMLHTTP");
						}
						catch (e) {}
					}
				}
				if (!xhr)
				{
					// 异常，创建对象实例失败
					window.alert("不能创建XMLHttpRequest对象实例.");
				}
				return xhr;
			},
			
			/*
			 * loading
			 */
			loading : function()
			{
				
			},
			
			/*
			 * complete
			 */
			complete : function()
			{
				
			},
			
			/*
			 * response
			 */
			response : function (type, xhr)
			{
				var result = null;
				switch (type)
				{
					case "JSON" :
						result = xhr.responseText;
						break;
					case "XML" :
						result = xhr.responseXML;
						break;
					case "TEXT" :
						result = xhr.responseText;
						break;
				}
				return result;
			}
		};
		
		/*
		 * verify Object
		 */
		var verify = new Object;

		/*
		 * whole:global status var
		 */
		verify.whole = true;

		/*
		 * single:current status var
		 */
		verify.single = true;

		/*
		 * str:the attribute contents extends on the form elements
		 */
		verify.str = "";

		/*
		 * obj:the attribute contents extends on the form elements convert to object
		 */
		verify.obj = "";

		/*
		 * str:the attribute name extends on the form elements
		 */
		verify.name = "verifys";

		/*
		 * str:file name
		 */
		verify.filename = "verify.js";

		/*
		 * default tip information
		 */
		verify.defaults = {d:'请输入',c:'验证成功',e:'验证失败',w:'处理中...'};

		/*
		 * init:execute it after the DOM loaded
		 */
		verify.init = function()
		{
			// get all forms in current page
			var forms = document.forms;
		    for(var i=0; i<forms.length; i++)
		    {
		    	// current form
		        var form = forms[i];
		        
		        // bind verify.doSubmit to current form onsubmit
		        form.onsubmit = verify.doSubmit;
		        
		        // elements of current form
		        var elems = form.elements;
		        for(var j=0; j<elems.length; j++)
		        {
		        	// elements of current form
		            var elem = elems[j];
					if(elem.type.toLowerCase()=="radio" || elem.type.toLowerCase()=="checkbox")
					{
						if(elem.getAttribute(verify.name))
						{
							for(var k=0; k<elems.length; k++)
							{
								if(elem.name == elems[k].name)
								{
									elems[k].setAttribute(verify.name, elem.getAttribute(verify.name));
								}
							}
						}
					}
		            if(elem.type.toLowerCase() == "text" || elem.type.toLowerCase()=="password" || elem.type.toLowerCase()=="radio" || elem.type.toLowerCase()=="checkbox" || elem.tagName.toLowerCase() == 'select' || elem.tagName.toLowerCase() == 'textarea')
		            {
		            	verify.compile(elem);
		            	if(verify.obj)
		            	{
							verify.tip(elem.name, (verify.obj.d ? verify.obj.d : verify.defaults.d) , 'show');
		            		elem.onfocus = verify.doFocus;
		            		elem.onblur = verify.doBlur;
		            	}
					}
		        }
		    }
		}

		/*
		 * doSubmit
		 */
		verify.doSubmit = function()
		{
			var firstFail = false;
			verify.whole = true;
			var elems = this.elements;
		    for(var i=0; i<elems.length; i++)
		    {
		        var elem = elems[i];
		    	if(typeof(elem.onblur) == 'function' && elem.ispass !== true)
		    	{
		        	if(typeof(elem.ispass) == 'undefined')
		        	{
		        		if(elem.type.toLowerCase() == "text" || elem.type.toLowerCase() == "password" || elem.type.toLowerCase() == "radio" || elem.type.toLowerCase() == "checkbox" || elem.tagName.toLowerCase() == 'select' || elem.tagName.toLowerCase() == 'textarea')
				        {
			        		elem.onblur();
			        	}
		        	}
		        	verify.whole = elem.ispass === false ? false : verify.whole;
			        if(elem.ispass === false && firstFail === false)
			        {
			        	firstFail = elem;
		        	}
		        }
		    }
		    if(firstFail)
		    {
		    	firstFail.focus();
		    }
			/**
			 * onFormSubmit
			 */
		    if(typeof(onFormSubmit) == 'function' && verify.whole)
		    {
		    	verify.whole = onFormSubmit();
		    }
		    
		    return verify.whole;
		}

		/*
		 * doFocus
		 */
		verify.doFocus = function()
		{
			verify.compile(this);
			verify.tip(this.name, (verify.obj.d ? verify.obj.d : verify.defaults.d), 'focus');
		}

		/*
		 * doBlur
		 */
		verify.doBlur = function()
		{
			verify.single = true;
			verify.compile(this);
			
			verify.doSelect(this, verify.obj);
			verify.doVerify(this, verify.obj);
			verify.doCompare(this, verify.obj);
			verify.doFunction(this, verify.obj);
			verify.doAjax(this, verify.obj);
			
			this.ispass = verify.single;
		}

		/*
		 * doSelect
		 */
		verify.doSelect = function(obj, verifys)
		{
			if(verifys.s)
			{
				var choiced = 0;
				var arr = verifys.s.r.split(',');
				var min = parseInt(arr[0]);
				var max = arr[1] ? parseInt(arr[1]) : min;
				elems = obj.form.elements;
				for(var i=0; i<elems.length; i++)
				{
					if(elems[i].name == obj.name)
					{
						if(elems[i].checked)
						{
							choiced++;
						}
					}
				}
				if(choiced>=min && choiced<=max)
				{
					verify.tip(obj.name, (verifys.s.c ? verifys.s.c : verify.defaults.c), 'correct');
				}
				else
				{
					verify.tip(obj.name, (verifys.s.e ? verifys.s.e : verify.defaults.e), 'error');
					verify.single = verify.whole = false;
				}
			}
		}

		/*
		 * doVerify
		 */
		verify.doVerify = function(obj, verifys)
		{
			if(verifys.v)
			{
				if(verifys.v.r.test(obj.value))
				{
					verify.tip(obj.name, (verifys.v.c ? verifys.v.c : verify.defaults.c), 'correct');
				}
				else
				{
					verify.tip(obj.name, (verifys.v.e ? verifys.v.e : verify.defaults.e), 'error');
					verify.single = verify.whole = false;
				}
			}
		}

		/*
		 * doCompare
		 */
		verify.doCompare = function(obj, verifys)
		{
			if(verifys.c && verify.single)
			{
				var ret = false;
				var v1 = obj.value;
				var v2 = obj.form[verifys.c.w].value;
				switch(verifys.c.m)
				{
					case '=':
						ret = v1 == v2;
						break;
					case '!=':
						ret = v1 != v2;
						break;
					case '>':
						ret = v1 > v2;
						break;
					case '>=':
						ret = v1 >= v2;
						break;
					case '<':
						ret = v1 < v2;
						break;
					case '<=':
						ret = v1 <= v2;
						break;
					case '≧':
						ret = v1.indexOf(v2) > -1; //include
						break;
					case '≦':
						ret = v2.indexOf(v1) > -1; //included in 
						break;
					default:
						break;
				}
				if(ret)
				{
					verify.tip(obj.name, (verifys.c.c ? verifys.c.c : verify.defaults.c), 'correct');
				}
				else
				{
					verify.tip(obj.name, (verifys.c.e ? verifys.c.e : verify.defaults.e), 'error');
					verify.single = verify.whole = false;
				}
			}
		}

		/*
		 * doFunction
		 */
		verify.doFunction = function(obj, verifys)
		{
			if(verifys.f && verify.single)
			{
				if(verifys.f.f(obj))
				{
					verify.tip(obj.name, (verifys.f.c ? verifys.f.c : verify.defaults.c), 'correct');
				}
				else
				{
					verify.tip(obj.name, (verifys.f.e ? verifys.f.e : verify.defaults.e), 'error');
					verify.single = verify.whole = false;
				}
			}
		}

		/*
		 * doAjax
		 */
		verify.doAjax = function(obj, verifys)
		{
			if(verifys.a && verify.single)
			{
				var elems = obj.form.elements;
				for(var i=0; i<elems.length; i++)
				{
					var elem = elems[i];
					if(elem.type == 'submit')
					{
						elem.disabled = 'disabled';
					}
				}
				verify.tip(obj.name, (typeof verifys.a.w != 'undefined' ? verifys.a.w : verify.defaults.w), 'processing');
				verify.ajax(verifys.a.u, verifys.a.a + '&' + obj.name + '=' + obj.value, function(result)
				{
					if(eval(result))
					{
						verify.tip(obj.name, (verifys.a.c ? verifys.a.c : verify.defaults.c), 'correct');
					}
					else
					{
						verify.tip(obj.name, (verifys.a.e ? verifys.a.e : verify.defaults.e), 'error');
						verify.single = verify.whole = false;
					}
					obj.ispass = verify.single;
					for(var i=0; i<elems.length; i++)
					{
						var elem = elems[i];
						if(elem.type == 'submit')
						{
							elem.disabled = '';
						}
					}
				}, 'POST', 'TEXT');
			}
		}

		/*
		 * compile
		 */
		verify.compile = function(obj)
		{
			verify.obj = eval('(' + obj.getAttribute(verify.name) + ')');
		}

		/*
		 * tip
		 */
		verify.tip = function(name, val, style)
		{
			var tip = document.getElementById(name + 'Tip');
			if(tip)
			{
				tip.innerHTML = val;
				tip.style.cssText = 'height:25px;line-height:25px;margin:0 0 0 3px;padding:0 0 0 25px;color:#999999;background:url('+verify.filePath()+style+'.gif) no-repeat 0 0px;';
			}
		}

		/*
		 * addEvent
		 */
		verify.addEvent = function(obj, event, fun)
		{
		    // Mozilla
		    if(obj.addEventListener)
		    {
		    	obj.addEventListener(event, fun, false);
		    }
		    
		    // ie
		    else if(obj.attachEvent)
		    {
		    	obj.attachEvent("on" + event, fun);
		    }
		}

		/*
		 * filePath
		 * 
		 * like "../servtools/verify/"
		 * 
		 */
		verify.filePath = function()
		{
			var elements = document.getElementsByTagName('script');
			for(var i=0, len=elements.length; i<len; i++)
			{
				if(elements[i].src && elements[i].src.match(eval('/'+verify.filename+'/')))
				{
					return elements[i].src.substring(0, elements[i].src.lastIndexOf('/') + 1);
				}
			}
			return '';
		}

		/*
		 * ajax
		 * 
		 * need ajax object,overide it
		 * 
		 */
		verify.ajax = function(url, args, callBack, method, type)
		{
			// override the ajax function yourself
			if(typeof ajax != 'object'){alert('ajax is not exist!');return;}
			ajax.call(url, args, callBack, method, type);
		}

		/*
		 * addEvent after the DOM complete loaded
		 */
		verify.addEvent(window, 'load', verify.init);
	}
)(window);