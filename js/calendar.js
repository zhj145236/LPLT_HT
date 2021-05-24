/**
 * 强大的JS日历选择插件
 * @date 2016-05-20
 * @author TangQing
 * @email 1158383833@qq.com
 */
(function(factory) {
	// AMD RequireJS
	if (typeof define !== 'undefined' && define.amd) {
		define([], factory);
	} else {
		window.calendar = factory();
	}
})(function() {
	function addEvent(target, eventType, handle) {
		if (document.addEventListener) {
			Event.addEvent = function(target, eventType, handle) {
				target.addEventListener(eventType, handle, false);
			}
		} else if (document.attachEvent) {
			Event.addEvent = function(target, eventType, handle) {
				target.attachEvent('on' + eventType, function() {
					handle.call(target, arguments); //改变this指向
				});
			}
		} else {
			Event.addEvent = function(target, eventType, handle) {
				target['on' + eventType] = handle;
			}
		}
		Event.addEvent(target, eventType, handle);
	}

	function getClass(el, cls) {
		var result = [];
		var tag = el.getElementsByTagName('*');
		for (var i = 0; i < tag.length; i++) {
			if (tool.hasClass(tag[i], cls)) {
				result.push(tag[i]);
			}
		}
		return result;
	}

	var calendarMsg = {
		/**
		 * 农历1900-2100的润大小信息表
		 * @Array Of Property
		 * @return Hex 
		 */
		lunarInfo: [0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2, //1900-1909
			0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 0x0d6a0, 0x0ada2, 0x095b0, 0x14977, //1910-1919
			0x04970, 0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, //1920-1929
			0x06566, 0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950, //1930-1939
			0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2, 0x0a950, 0x0b557, //1940-1949
			0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5b0, 0x14573, 0x052b0, 0x0a9a8, 0x0e950, 0x06aa0, //1950-1959
			0x0aea6, 0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260, 0x0f263, 0x0d950, 0x05b57, 0x056a0, //1960-1969
			0x096d0, 0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, //1970-1979
			0x095b0, 0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50, 0x06d40, 0x0af46, 0x0ab60, 0x09570, //1980-1989
			0x04af5, 0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58, 0x055c0, 0x0ab60, 0x096d5, 0x092e0, //1990-1999
			0x0c960, 0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0, 0x0abb7, 0x025d0, 0x092d0, 0x0cab5, //2000-2009
			0x0a950, 0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0, 0x0a5b0, 0x15176, 0x052b0, 0x0a930, //2010-2019
			0x07954, 0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6, 0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, //2020-2029
			0x05aa0, 0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0, 0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, //2030-2039
			0x0b5a0, 0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0, 0x0aa50, 0x1b255, 0x06d20, 0x0ada0, //2040-2049
			/**Add By JJonline@JJonline.Cn**/
			0x14b63, 0x09370, 0x049f8, 0x04970, 0x064b0, 0x168a6, 0x0ea50, 0x06b20, 0x1a6c4, 0x0aae0, //2050-2059
			0x0a2e0, 0x0d2e3, 0x0c960, 0x0d557, 0x0d4a0, 0x0da50, 0x05d55, 0x056a0, 0x0a6d0, 0x055d4, //2060-2069
			0x052d0, 0x0a9b8, 0x0a950, 0x0b4a0, 0x0b6a6, 0x0ad50, 0x055a0, 0x0aba4, 0x0a5b0, 0x052b0, //2070-2079
			0x0b273, 0x06930, 0x07337, 0x06aa0, 0x0ad50, 0x14b55, 0x04b60, 0x0a570, 0x054e4, 0x0d160, //2080-2089
			0x0e968, 0x0d520, 0x0daa0, 0x16aa6, 0x056d0, 0x04ae0, 0x0a9d4, 0x0a2d0, 0x0d150, 0x0f252, //2090-2099
			0x0d520
		], //2100

		/*
		 * 假期安排时间表
		 * 
		 * 
		 * 
		 * */

		// holiday: {
		// 	// 农历节日
		// 	Lfestival: {
		// 		"正月:初一": "春节",
		// 		"正月:十五": "元宵节",
		// 		"五月:初五": "端午节",
		// 		"七月:初七": "乞巧节",
		// 		"八月:十五": "中秋节",
		// 		"九月:初九": "重阳节",
		// 		"腊月:初八": "腊八节",
		// 		"腊月:廿九": "除夕"
		// 	},
		// 	// 传统节日
		// 	festival: {
		// 		"1月1": "元旦",
		// 		"2月2": "世界湿地日",
		// 		"2月14": "情人节",
		// 		"3月3": "全国爱耳日",
		// 		"3月5": "青年志愿者服务日",
		// 		"3月8": "国际妇女节",
		// 		"3月9": "保护母亲河日",
		// 		"3月12": "中国植树节",
		// 		"3月14": "白色情人节",
		// 		"3月15": "世界消费者权益日",
		// 		"3月21": "世界森林日",
		// 		"3月22": "世界水日",
		// 		"3月23": "世界气象日",
		// 		"3月24": "世界防治结核病日",
		// 		"4月1": "愚人节",
		// 		"4月7": "世界卫生日",
		// 		"4月22": "世界地球日",
		// 		"4月26": "世界知识产权日",
		// 		"5月1": "国际劳动节",
		// 		"5月3": "世界哮喘日",
		// 		"5月4": "中国青年节",
		// 		"5月8": "世界红十字日",
		// 		"5月12": "国际护士节",
		// 		"5月15": "国际家庭日",
		// 		"5月17": "世界电信日",
		// 		"5月20": "全国学生营养日",
		// 		"5月23": "国际牛奶日",
		// 		"5月31": " 世界无烟日",
		// 		"6月1": " 国际儿童节",
		// 		"6月5": "世界环境日",
		// 		"6月6": "全国爱眼日",
		// 		"6月17": "世界防治荒漠化和干旱日",
		// 		"6月23": "国际奥林匹克日",
		// 		"6月25": "全国土地日",
		// 		"6月26": "国际禁毒日",
		// 		"7月1": "中国共产党诞生日",
		// 		"7月7": "中国人民抗日战争纪念日",
		// 		"7月11": "世界人口日",
		// 		"8月1": "中国人民解放军建军节",
		// 		"8月12": "国际青年节",
		// 		"9月8": "国际扫盲日",
		// 		"9月10": "中国教师节",
		// 		"9月16": "中国脑健康日",
		// 		"9月20": "全国爱牙日",
		// 		"9月21": "世界停火日",
		// 		"9月27": "世界旅游日",
		// 		"10月1": "中华人民共和国国庆节",
		// 		"10月4": "世界动物日",
		// 		"10月5": "世界教师日",
		// 		"10月8": "全国高血压日",
		// 		"10月9": "世界邮政日",
		// 		"10月10": "世界精神卫生日",
		// 		"10月14": "世界标准日",
		// 		"10月15": "国际盲人节",
		// 		"10月16": "世界粮食日",
		// 		"10月17": "国际消除贫困日",
		// 		"10月24": "联合国日",
		// 		"10月28": "中国男性健康日",
		// 		"10月29": "国际生物多样性日",
		// 		"10月31": "万圣节",
		// 		"11月8": "中国记者节",
		// 		"11月9": "消防宣传日",
		// 		"11月14": "世界糖尿病日",
		// 		"11月17": "国际大学生节",
		// 		"11月25": "国际消除对妇女的暴力日",
		// 		"12月1": "世界爱滋病日",
		// 		"12月3": "世界残疾人日",
		// 		"12月4": "全国法制宣传日",
		// 		"12月9": "世界足球日",
		// 		"12月25": "圣诞节",
		// 		"12月29": "国际生物多样性日"
		// 	},
		// 	rest: {
		// 		'元旦': '1=>01:01',
		// 		'除夕': '2=>腊月:廿九',
		// 		'春节': '2=>正月:初一',
		// 		'清明节': '1=>04:04',
		// 		'劳动节': '1=>05:01',
		// 		'端午节': '2=>五月:初五',
		// 		'中秋节': '2=>八月:十五',
		// 		'国庆节': '1=>10:01'
		// 	}
		// },
		// 公历节日
		// isholiday: function(year, month, day) {
		// 	for (var attr in this.holiday.festival) {
		// 		var msg = attr.split('月');
		// 		var m = parseInt(msg[0]);
		// 		var d = parseInt(msg[1]);
		// 		if (month == m && day == d) {
		// 			return this.holiday.festival[attr];
		// 		}
		// 	}
		// 	return false;
		// },
		// 农历节日
		// isLholiday: function(year, month, day) {
		// 	for (var attr in this.holiday.Lfestival) {
		// 		var msg = attr.split(':');
		// 		if (msg[0] == month && msg[1] == day) {
		// 			return this.holiday.Lfestival[attr];
		// 		}
		// 	}
		// 	return false;
		// },
		/**
		 * 公历每个月份的天数普通表
		 * @Array Of Property
		 * @return Number 
		 */
		solarMonth: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],

		/**
		 * 天干地支之天干速查表
		 * @Array Of Property trans["甲","乙","丙","丁","戊","己","庚","辛","壬","癸"]
		 * @return Cn string 
		 */
		Gan: ["\u7532", "\u4e59", "\u4e19", "\u4e01", "\u620a", "\u5df1", "\u5e9a", "\u8f9b", "\u58ec", "\u7678"],

		/**
		 * 天干地支之地支速查表
		 * @Array Of Property 
		 * @trans["子","丑","寅","卯","辰","巳","午","未","申","酉","戌","亥"]
		 * @return Cn string 
		 */
		Zhi: ["\u5b50", "\u4e11", "\u5bc5", "\u536f", "\u8fb0", "\u5df3", "\u5348", "\u672a", "\u7533", "\u9149", "\u620c", "\u4ea5"],

		/**
		 * 天干地支之地支速查表<=>生肖
		 * @Array Of Property 
		 * @trans["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"]
		 * @return Cn string 
		 */
		Animals: ["\u9f20", "\u725b", "\u864e", "\u5154", "\u9f99", "\u86c7", "\u9a6c", "\u7f8a", "\u7334", "\u9e21", "\u72d7", "\u732a"],

		/**
		 * 24节气速查表
		 * @Array Of Property 
		 * @trans["小寒","大寒","立春","雨水","惊蛰","春分","清明","谷雨","立夏","小满","芒种","夏至","小暑","大暑","立秋","处暑","白露","秋分","寒露","霜降","立冬","小雪","大雪","冬至"]
		 * @return Cn string 
		 */
		solarTerm: ["\u5c0f\u5bd2", "\u5927\u5bd2", "\u7acb\u6625", "\u96e8\u6c34", "\u60ca\u86f0", "\u6625\u5206", "\u6e05\u660e", "\u8c37\u96e8", "\u7acb\u590f", "\u5c0f\u6ee1", "\u8292\u79cd", "\u590f\u81f3", "\u5c0f\u6691", "\u5927\u6691", "\u7acb\u79cb", "\u5904\u6691", "\u767d\u9732", "\u79cb\u5206", "\u5bd2\u9732", "\u971c\u964d", "\u7acb\u51ac", "\u5c0f\u96ea", "\u5927\u96ea", "\u51ac\u81f3"],

		/**
		 * 1900-2100各年的24节气日期速查表
		 * @Array Of Property 
		 * @return 0x string For splice
		 */
		sTermInfo: ['9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f',
			'97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f', 'b027097bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd0b06bdb0722c965ce1cfcc920f',
			'b027097bd097c36b0b6fc9274c91aa', '9778397bd19801ec9210c965cc920e', '97b6b97bd19801ec95f8c965cc920f',
			'97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2', '9778397bd197c36c9210c9274c91aa',
			'97b6b97bd19801ec95f8c965cc920e', '97bd09801d98082c95f8e1cfcc920f', '97bd097bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec95f8c965cc920e', '97bcf97c3598082c95f8e1cfcc920f',
			'97bd097bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e',
			'97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e', '97bcf97c3598082c95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f',
			'97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
			'97bcf97c359801ec95f8c965cc920f', '97bd097bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e', '97bcf97c359801ec95f8c965cc920f', '97bd097bd07f595b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9210c8dc2', '9778397bd19801ec9210c9274c920e', '97b6b97bd19801ec95f8c965cc920f',
			'97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
			'97b6b97bd19801ec95f8c965cc920f', '97bd07f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36c9210c9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bd07f1487f595b0b0bc920fb0722',
			'7f0e397bd097c36b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
			'97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e', '97bcf7f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b97bd19801ec9210c965cc920e',
			'97bcf7f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
			'97b6b97bd19801ec9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9210c91aa', '97b6b97bd197c36c9210c9274c920e', '97bcf7f0e47f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '9778397bd097c36c9210c9274c920e',
			'97b6b7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c36b0b6fc9210c8dc2',
			'9778397bd097c36b0b70c9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc9210c8dc2', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f595b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
			'9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc920fb0722', '9778397bd097c36b0b6fc9274c91aa', '97b6b7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9274c91aa',
			'97b6b7f0e47f531b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
			'9778397bd097c36b0b6fc9210c91aa', '97b6b7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722', '9778397bd097c36b0b6fc9210c8dc2', '977837f0e37f149b0723b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f5307f595b0b0bc920fb0722', '7f0e397bd097c35b0b6fc9210c8dc2',
			'977837f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e37f1487f595b0b0bb0b6fb0722',
			'7f0e397bd097c35b0b6fc9210c8dc2', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722', '977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd097c35b0b6fc920fb0722',
			'977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14998082b0787b06bd',
			'7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0b0bb0b6fb0722', '7f0e397bd07f595b0b0bc920fb0722',
			'977837f0e37f14998082b0723b06bd', '7f07e7f0e37f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e397bd07f595b0b0bc920fb0722', '977837f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f595b0b0bb0b6fb0722', '7f0e37f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e37f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e37f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e37f14898082b072297c35',
			'7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722',
			'7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f149b0723b0787b0721',
			'7f0e27f1487f531b0b0bb0b6fb0722', '7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14998082b0723b06bd',
			'7f07e7f0e47f149b0723b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722', '7f0e37f0e366aa89801eb072297c35',
			'7ec967f0e37f14998082b0723b06bd', '7f07e7f0e37f14998083b0787b0721', '7f0e27f0e47f531b0723b0b6fb0722',
			'7f0e37f0e366aa89801eb072297c35', '7ec967f0e37f14898082b0723b02d5', '7f07e7f0e37f14998082b0787b0721',
			'7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66aa89801e9808297c35', '665f67f0e37f14898082b0723b02d5',
			'7ec967f0e37f14998082b0787b0721', '7f07e7f0e47f531b0723b0b6fb0722', '7f0e36665b66a449801e9808297c35',
			'665f67f0e37f14898082b0723b02d5', '7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721',
			'7f0e36665b66a449801e9808297c35', '665f67f0e37f14898082b072297c35', '7ec967f0e37f14998082b0787b06bd',
			'7f07e7f0e47f531b0723b0b6fb0721', '7f0e26665b66a449801e9808297c35', '665f67f0e37f1489801eb072297c35',
			'7ec967f0e37f14998082b0787b06bd', '7f07e7f0e47f531b0723b0b6fb0721', '7f0e27f1487f531b0b0bb0b6fb0722'
		],

		/**
		 * 数字转中文速查表
		 * @Array Of Property 
		 * @trans ['日','一','二','三','四','五','六','七','八','九','十']
		 * @return Cn string 
		 */
		nStr1: ["\u65e5", "\u4e00", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341"],

		/**
		 * 日期转农历称呼速查表
		 * @Array Of Property 
		 * @trans ['初','十','廿','卅']
		 * @return Cn string 
		 */
		nStr2: ["\u521d", "\u5341", "\u5eff", "\u5345"],

		/**
		 * 月份转农历称呼速查表
		 * @Array Of Property 
		 * @trans ['正','一','二','三','四','五','六','七','八','九','十','冬','腊']
		 * @return Cn string 
		 */
		nStr3: ["\u6b63", "\u4e8c", "\u4e09", "\u56db", "\u4e94", "\u516d", "\u4e03", "\u516b", "\u4e5d", "\u5341", "\u51ac", "\u814a"],

		/**
		 * 返回农历y年一整年的总天数
		 * @param lunar Year
		 * @return Number
		 * @eg:var count = calendarMsg.lYearDays(1987) ;//count=387
		 */
		lYearDays: function(y) {
			var i, sum = 348;
			for (i = 0x8000; i > 0x8; i >>= 1) {
				sum += (calendarMsg.lunarInfo[y - 1900] & i) ? 1 : 0;
			}
			return (sum + calendarMsg.leapDays(y));
		},

		/**
		 * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
		 * @param lunar Year
		 * @return Number (0-12)
		 * @eg:var leapMonth = calendarMsg.leapMonth(1987) ;//leapMonth=6
		 */
		leapMonth: function(y) { //闰字编码 \u95f0
			return (calendarMsg.lunarInfo[y - 1900] & 0xf);
		},

		/**
		 * 返回农历y年闰月的天数 若该年没有闰月则返回0
		 * @param lunar Year
		 * @return Number (0、29、30)
		 * @eg:var leapMonthDay = calendarMsg.leapDays(1987) ;//leapMonthDay=29
		 */
		leapDays: function(y) {
			if (calendarMsg.leapMonth(y)) {
				return ((calendarMsg.lunarInfo[y - 1900] & 0x10000) ? 30 : 29);
			}
			return (0);
		},

		/**
		 * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
		 * @param lunar Year
		 * @return Number (-1、29、30)
		 * @eg:var MonthDay = calendarMsg.monthDays(1987,9) ;//MonthDay=29
		 */
		monthDays: function(y, m) {
			if (m > 12 || m < 1) {
				return -1
			} //月份参数从1至12，参数错误返回-1
			return ((calendarMsg.lunarInfo[y - 1900] & (0x10000 >> m)) ? 30 : 29);
		},

		/**
		 * 返回公历(!)y年m月的天数
		 * @param solar Year
		 * @return Number (-1、28、29、30、31)
		 * @eg:var solarMonthDay = calendarMsg.leapDays(1987) ;//solarMonthDay=30
		 */
		solarDays: function(y, m) {
			if (m > 12 || m < 1) {
				return -1
			} //若参数错误 返回-1
			var ms = m - 1;
			if (ms == 1) { //2月份的闰平规律测算后确认返回28或29
				return (((y % 4 == 0) && (y % 100 != 0) || (y % 400 == 0)) ? 29 : 28);
			} else {
				return (calendarMsg.solarMonth[ms]);
			}
		},

		/**
		 * 传入offset偏移量返回干支
		 * @param offset 相对甲子的偏移量
		 * @return Cn string
		 */
		toGanZhi: function(offset) {
			return (calendarMsg.Gan[offset % 10] + calendarMsg.Zhi[offset % 12]);
		},

		/**
		 * 传入公历(!)y年获得该年第n个节气的公历日期
		 * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起 
		 * @return day Number
		 * @eg:var _24 = calendarMsg.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
		 */
		getTerm: function(y, n) {
			if (y < 1900 || y > 2100) {
				return -1;
			}
			if (n < 1 || n > 24) {
				return -1;
			}
			var _table = calendarMsg.sTermInfo[y - 1900];
			var _info = [
				parseInt('0x' + _table.substr(0, 5)).toString(),
				parseInt('0x' + _table.substr(5, 5)).toString(),
				parseInt('0x' + _table.substr(10, 5)).toString(),
				parseInt('0x' + _table.substr(15, 5)).toString(),
				parseInt('0x' + _table.substr(20, 5)).toString(),
				parseInt('0x' + _table.substr(25, 5)).toString()
			];
			var _calday = [
				_info[0].substr(0, 1),
				_info[0].substr(1, 2),
				_info[0].substr(3, 1),
				_info[0].substr(4, 2),

				_info[1].substr(0, 1),
				_info[1].substr(1, 2),
				_info[1].substr(3, 1),
				_info[1].substr(4, 2),

				_info[2].substr(0, 1),
				_info[2].substr(1, 2),
				_info[2].substr(3, 1),
				_info[2].substr(4, 2),

				_info[3].substr(0, 1),
				_info[3].substr(1, 2),
				_info[3].substr(3, 1),
				_info[3].substr(4, 2),

				_info[4].substr(0, 1),
				_info[4].substr(1, 2),
				_info[4].substr(3, 1),
				_info[4].substr(4, 2),

				_info[5].substr(0, 1),
				_info[5].substr(1, 2),
				_info[5].substr(3, 1),
				_info[5].substr(4, 2),
			];
			return parseInt(_calday[n - 1]);
		},

		/**
		 * 传入农历数字月份返回汉语通俗表示法
		 * @param lunar month
		 * @return Cn string
		 * @eg:var cnMonth = calendarMsg.toChinaMonth(12) ;//cnMonth='腊月'
		 */
		toChinaMonth: function(m) { // 月 => \u6708
			if (m > 12 || m < 1) {
				return -1
			} //若参数错误 返回-1
			var s = calendarMsg.nStr3[m - 1];
			s += "\u6708"; //加上月字
			return s;
		},

		/**
		 * 传入农历日期数字返回汉字表示法
		 * @param lunar day
		 * @return Cn string
		 * @eg:var cnDay = calendarMsg.toChinaDay(21) ;//cnMonth='廿一'
		 */
		toChinaDay: function(d) { //日 => \u65e5
			var s;
			switch (d) {
				case 10:
					s = '\u521d\u5341';
					break;
				case 20:
					s = '\u4e8c\u5341';
					break;
					break;
				case 30:
					s = '\u4e09\u5341';
					break;
					break;
				default:
					s = calendarMsg.nStr2[Math.floor(d / 10)];
					s += calendarMsg.nStr1[d % 10];
			}
			return (s);
		},

		/**
		 * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
		 * @param y year
		 * @return Cn string
		 * @eg:var animal = calendarMsg.getAnimal(1987) ;//animal='兔'
		 */
		getAnimal: function(y) {
			return calendarMsg.Animals[(y - 4) % 12]
		},

		/**
		 * 传入公历年月日获得详细的公历、农历object信息 <=>JSON
		 * @param y  solar year
		 * @param m solar month
		 * @param d  solar day
		 * @return JSON object
		 * @eg:console.log(calendarMsg.solar2lunar(1987,11,01));
		 */

		solar2lunar: function(y, m, d) { //参数区间1900.1.31~2100.12.31
			if (y < 1900 || y > 2100) {
				return -1;
			} //年份限定、上限
			if (y == 1900 && m == 1 && d < 31) {
				return -1;
			} //下限
			if (!y) { //未传参 获得当天
				var objDate = new Date();
			} else {
				var objDate = new Date(y, parseInt(m) - 1, d)
			}
			var i, leap = 0,
				temp = 0;
			//修正ymd参数
			var y = objDate.getFullYear(),
				m = objDate.getMonth() + 1,
				d = objDate.getDate();
			var offset = (Date.UTC(objDate.getFullYear(), objDate.getMonth(), objDate.getDate()) - Date.UTC(1900, 0, 31)) / 86400000;
			for (i = 1900; i < 2101 && offset > 0; i++) {
				temp = calendarMsg.lYearDays(i);
				offset -= temp;
			}
			if (offset < 0) {
				offset += temp;
				i--;
			}

			//是否今天
			var isTodayObj = new Date(),
				isToday = false;
			if (isTodayObj.getFullYear() == y && isTodayObj.getMonth() + 1 == m && isTodayObj.getDate() == d) {
				isToday = true;
			}
			//星期几
			var nWeek = objDate.getDay(),
				cWeek = calendarMsg.nStr1[nWeek];
			if (nWeek == 0) {
				nWeek = 7;
			} //数字表示周几顺应天朝周一开始的惯例
			//农历年
			var year = i;

			var leap = calendarMsg.leapMonth(i); //闰哪个月
			var isLeap = false;

			//效验闰月
			for (i = 1; i < 13 && offset > 0; i++) {
				//闰月
				if (leap > 0 && i == (leap + 1) && isLeap == false) {
					--i;
					isLeap = true;
					temp = calendarMsg.leapDays(year); //计算农历闰月天数
				} else {
					temp = calendarMsg.monthDays(year, i); //计算农历普通月天数
				}
				//解除闰月
				if (isLeap == true && i == (leap + 1)) {
					isLeap = false;
				}
				offset -= temp;
			}

			if (offset == 0 && leap > 0 && i == leap + 1)
				if (isLeap) {
					isLeap = false;
				} else {
					isLeap = true;
					--i;
				}
			if (offset < 0) {
				offset += temp;
				--i;
			}
			//农历月
			var month = i;
			//农历日
			var day = offset + 1;

			//天干地支处理
			var sm = m - 1;
			var term3 = calendarMsg.getTerm(year, 3); //该农历年立春日期
			var gzY = calendarMsg.toGanZhi(year - 4); //普通按年份计算，下方尚需按立春节气来修正

			//依据立春日进行修正gzY
			if (sm < 2 && d < term3) {
				gzY = calendarMsg.toGanZhi(year - 5);
			} else {
				gzY = calendarMsg.toGanZhi(year - 4);
			}

			//月柱 1900年1月小寒以前为 丙子月(60进制12)
			var firstNode = calendarMsg.getTerm(y, (m * 2 - 1)); //返回当月「节」为几日开始
			var secondNode = calendarMsg.getTerm(y, (m * 2)); //返回当月「节」为几日开始

			//依据12节气修正干支月
			var gzM = calendarMsg.toGanZhi((y - 1900) * 12 + m + 11);
			if (d >= firstNode) {
				gzM = calendarMsg.toGanZhi((y - 1900) * 12 + m + 12);
			}

			//传入的日期的节气与否
			var isTerm = false;
			var Term = null;
			if (firstNode == d) {
				isTerm = true;
				Term = calendarMsg.solarTerm[m * 2 - 2];
			}
			if (secondNode == d) {
				isTerm = true;
				Term = calendarMsg.solarTerm[m * 2 - 1];
			}
			//日柱 当月一日与 1900/1/1 相差天数
			var dayCyclical = Date.UTC(y, sm, 1, 0, 0, 0, 0) / 86400000 + 25567 + 10;
			var gzD = calendarMsg.toGanZhi(dayCyclical + d - 1);

			return {
				'lYear': year,
				'lMonth': month,
				'lDay': day,
				'Animal': calendarMsg.getAnimal(year),
				'IMonthCn': (isLeap ? "\u95f0" : '') + calendarMsg.toChinaMonth(month),
				'IDayCn': calendarMsg.toChinaDay(day),
				'cYear': y,
				'cMonth': m,
				'cDay': d,
				'gzYear': gzY,
				'gzMonth': gzM,
				'gzDay': gzD,
				'isToday': isToday,
				'isLeap': isLeap,
				'nWeek': nWeek,
				'ncWeek': "\u661f\u671f" + cWeek,
				'isTerm': isTerm,
				'Term': Term
			};
		},

		/**
		 * 传入公历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
		 * @param y  lunar year
		 * @param m lunar month
		 * @param d  lunar day
		 * @param isLeapMonth  lunar month is leap or not.
		 * @return JSON object
		 * @eg:console.log(calendarMsg.lunar2solar(1987,9,10));
		 */
		lunar2solar: function(y, m, d, isLeapMonth) { //参数区间1900.1.31~2100.12.1
			var leapOffset = 0;
			var leapMonth = calendarMsg.leapMonth(y);
			var leapDay = calendarMsg.leapDays(y);
			if (isLeapMonth && (leapMonth != m)) {
				return -1;
			} //传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
			if (y == 2100 && m == 12 && d > 1 || y == 1900 && m == 1 && d < 31) {
				return -1;
			} //超出了最大极限值
			var day = calendarMsg.monthDays(y, m);
			if (y < 1900 || y > 2100 || d > day) {
				return -1;
			} //参数合法性效验

			//计算农历的时间差
			var offset = 0;
			for (var i = 1900; i < y; i++) {
				offset += calendarMsg.lYearDays(i);
			}
			var leap = 0,
				isAdd = false;
			for (var i = 1; i < m; i++) {
				leap = calendarMsg.leapMonth(y);
				if (!isAdd) { //处理闰月
					if (leap <= i && leap > 0) {
						offset += calendarMsg.leapDays(y);
						isAdd = true;
					}
				}
				offset += calendarMsg.monthDays(y, i);
			}
			//转换闰月农历 需补充该年闰月的前一个月的时差
			if (isLeapMonth) {
				offset += day;
			}
			//1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
			var stmap = Date.UTC(1900, 1, 30, 0, 0, 0);
			var calObj = new Date((offset + d - 31) * 86400000 + stmap);
			var cY = calObj.getUTCFullYear();
			var cM = calObj.getUTCMonth() + 1;
			var cD = calObj.getUTCDate();

			return calendarMsg.solar2lunar(cY, cM, cD);
		}
	};

	var tool = {
		ajax: function(obj) {
			var Ajax = function() {
				function request(opt) {
					function fn() {}
					var url = opt.url || "";
					var async = opt.async !== false, method = opt.method || 'GET', data = opt.data || null, success = opt.success || fn, error = opt.failure || fn;
					method = method.toUpperCase();
					if (method == 'GET' && data) {
						var args = "";
						if (typeof data == 'string') {
							//alert("string")  
							args = data;
						} else if (typeof data == 'object') {
							//alert("object")  
							var arr = new Array();
							for (var k in data) {
								var v = data[k];
								arr.push(k + "=" + v);
							}
							args = arr.join("&");
						}
						url += (url.indexOf('?') == -1 ? '?' : '&') + args;
						data = null;
					}
					var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
					xhr.onreadystatechange = function() {
						_onStateChange(xhr, success, error);
					};
					xhr.open(method, url, async);
					if (method == 'POST') {
						xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded;');
					}
					if (opt.header) {
						for (var attr in opt.header) {
							xhr.setRequestHeader(attr, opt.header[attr]);
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
					} else {}
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
					if (ele) {
						type = type.substring(1);
						result = getClass(ele, type);
					}
					break;
				default:
					if (ele) {
						result = ele.getElementsByTagName(type);
					}
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

	var func = {
		select: function(el, callback) {
			var ar = tool.find(el, '.calendar_select');

			for (var i = 0; i < ar.length; i++) {
				ar[i].onclick = function() {
					for (var i = 0; i < ar.length; i++) {
						if (ar[i] === this) continue;
						tool.removeClass(ar[i], 'show');
					}
					tool.toggleClass(this, 'show');
				}
				var item = tool.find(tool.find(ar[i], '.calendar_select_item')[0], 'li');
				(function(i) {
					for (var j = 0; j < item.length; j++) {
						item[j].onclick = function() {
							tool.find(tool.parent(this, '.calendar_select'), '.calendar_select_v_txt')[0].innerHTML = this.innerHTML;
							callback && callback(i, tool.getAttr(this, 'data-value'), tool.find(tool.parent(this, '.calendar_select'), '.calendar_select_v_txt')[0], this.innerHTML);
						}
					}
				})(i);
			}
		}
	}

	var template = {
		wappeer: function(self) {
			var str = '<div class="calendar_wrap">';
			str += this.body(self);
			if (self.opt.herbs && !self.input) {
				str += this.slide(self);
			}
			str += '</div>';
			return str;
		},
		slide: function(self) {
			return '<div class="calendar_slide"></div>';
		},
		body: function(self) {
			var str = '<div class="calendar_body">';
			str += this.header(self);
			str += this.table(self);
			str += '</div>';
			return str;
		},
		table: function(self) {
			var strVar = "";
			strVar += "<table>";
			strVar += "						<thead>";
			strVar += "							<tr>";
			strVar += "								<th>周一<\/th>";
			strVar += "								<th>周二<\/th>";
			strVar += "								<th>周三<\/th>";
			strVar += "								<th>周四<\/th>";
			strVar += "								<th>周五<\/th>";
			strVar += "								<th>周六<\/th>";
			strVar += "								<th>周日<\/th>";
			strVar += "							<\/tr>";
			strVar += "						<\/thead>";
			strVar += "						<tbody>";
			for (var i = 0; i < 6; i++) {
				strVar += "							<tr>";
				for (var j = 0; j < 7; j++) {
					strVar += "								<td><\/td>";
				}
				strVar += "							<\/tr>";
			}
			strVar += "						<\/tbody>";
			strVar += "					<\/table>";
			return strVar;
		},
		header: function(self) {
			var strVar = "";
			strVar += "<div class=\"calendar_header\">";
			strVar += "	<div class=\"calendar_header_select\">";
			strVar += "		<div class=\"calendar_select\" data-value=" + self.opt.current.year + ">";
			strVar += "			<p class=\"calendar_select_v\">";
			strVar += "				<span class=\"calendar_select_v_txt\">" + self.opt.current.year + "年<\/span><i class=\"calendar_png calendar_ico\"><\/i>";
			strVar += "			<\/p>";
			strVar += "			<ul class=\"calendar_select_item\">";
			var min = msg.min(self);
			var max = msg.max(self);
			for (var i = min; i <= max; i++) {
				strVar += "				<li data-value=\"" + i + "\">" + i + "年<\/li>";
			}
			strVar += "			<\/ul>";
			strVar += "		<\/div>";
			strVar += "	<\/div>";
			strVar += "	<div class=\"calendar_header_select\">";
			strVar += "		<div class=\"calendar_select\">";
			strVar += "			<p class=\"calendar_select_v\">";
			strVar += "				<span class=\"calendar_select_v_txt\">" + self.opt.current.month + "月<\/span><i class=\"calendar_png calendar_ico\"><\/i>";
			strVar += "			<\/p>";
			strVar += "			<ul class=\"calendar_select_item\">";
			for (var i = 1; i <= 12; i++) {
				strVar += "				<li data-value=" + i + ">" + i + "月<\/li>";
			}
			strVar += "			<\/ul>";
			strVar += "		<\/div>";
			strVar += "	<\/div>";
			// strVar += "	<div class=\"calendar_header_select\">";
			// strVar += "		<div class=\"calendar_select\">";
			// strVar += "			<p class=\"calendar_select_v\">";
			// // strVar += "				<span class=\"calendar_select_v_txt\">假期安排<\/span><i class=\"calendar_png calendar_ico\"><\/i>";
			// strVar += "			<\/p>";
			// strVar += "			<ul class=\"calendar_select_item\">";
			// for (var attr in calendarMsg.holiday.rest) {
			// 	var v = calendarMsg.holiday.rest[attr].split('=>')[0];
			// 	// 公历节日
			// 	if (self.opt.festival && v == '1') {
			// 		strVar += "				<li data-value='" + calendarMsg.holiday.rest[attr] + "'>" + attr + "<\/li>";
			// 	}
			// 	// 农历存在 - 待改进
			// 	if (self.opt.lunar_festival && v == '2' && false) {
			// 		// 将农历转换成公历
			// 		strVar += "				<li data-value='" + calendarMsg.holiday.rest[attr] + "'>" + attr + "<\/li>";
			// 	}
			// }
			// strVar += "			<\/ul>";
			// strVar += "		<\/div>";
			// strVar += "	<\/div>";
			// strVar += "	<button>今天<\/button>";
			strVar += "<\/div>";
			return strVar;
		},
	}

	// 获取的dom节点
	var dom = {
		table: null,
		td: [],
		tr: []
	}
	var cache = {
		firstWeek: false,
		monthNumber: false
	}
	var msg = {
		min: function(self) {
			return parseInt(self.opt.scope.split('~')[0]);
		},
		max: function(self) {
			return parseInt(self.opt.scope.split('~')[1]);
		},
		upcache: function() {
			cache = {};
			cache.monthNumber = calendarMsg.solarDays(this.opt.current.year, this.opt.current.month);
			if (this.opt.current.month - 1 <= 0) {
				if (this.opt.current.year - 1 < msg.min(this)) {
					cache.prevMonthNumber = calendarMsg.solarDays(this.opt.current.year, 1);
				} else {
					cache.prevMonthNumber = calendarMsg.solarDays(this.opt.current.year - 1, 12);
				}
			} else {
				cache.prevMonthNumber = calendarMsg.solarDays(this.opt.current.year, this.opt.current.month - 1);
			}
			cache.firstWeek = calendarMsg.solar2lunar(this.opt.current.year, this.opt.current.month, 1);
			cache.firstWeek = cache.firstWeek.nWeek;
		},
		up: function(i) {
			var num = i + 1;
			if (num - cache.firstWeek < 0) {
				num = cache.prevMonthNumber + num - cache.firstWeek + 1;
				return {
					status: -1,
					num: num
				}
			} else if (num - cache.firstWeek + 1 > cache.monthNumber) {
				num = (num - cache.firstWeek + 1) % cache.monthNumber;
				return {
					status: 1,
					num: num
				}
			} else {
				num = num - cache.firstWeek + 1;
				return {
					status: 0,
					num: num
				}
			}
		},
	}
	var calendar = function(opt) {
		this.opt = tool.extend(true, {
			// el 如果为 input 当做日历插件处理，否则当做日历展示
			el: 'div',
			// 如果不为展示可设置创建的size
			size: {
				width: (document.body.clientWidth > 600 ? 600 : document.body.clientWidth),
				height: 'auto'
			},
			// 初始打开显示的时间 例：2016-05-05 00:00:00
			current: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate() + ' ' + new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds(),
			// 日历选择范围
			scope: '1901~2100',
			// 是否显示农历
			lunar: true,
			// 是否显示农历假日
			lunar_festival: true,
			// 是否显示公历假日
			festival: true,
			// 是否显示节气
			term: true,
			// 是否显示建除神(开发中)
			herbs: false,
		}, opt);
		this.input = false;
		this.initialize();
	}
	calendar.prototype = {
		initialize: function() {
			this.getCurrent();
			this.count_data();
			this.create();
			this.update();
			this.even();
			// 非input不执行此方法
			this.input && this.input_select();
		},
		count_data: function() {
			// this.opt.el
			this.opt.el = document.getElementById(this.opt.el);
			if (this.opt.el.tagName.toLowerCase() == 'input') {
				this.input_even();
			}
		},
		input_even: function() {
			var self = this;
			this.input = this.opt.el;
			this.opt.el = document.createElement('div');
			this.opt.el.style.width = this.opt.size.width + 'px';
			this.opt.el.style.height = this.opt.size.height + 'px';
			this.opt.el.style.position = 'absolute';
			this.opt.el.style.left = this.input.offsetLeft + 'px';
			this.opt.el.style.top = this.input.offsetTop + this.input.offsetHeight + 'px';
			this.opt.el.style.display = 'none';
			this.opt.el.style.background = '#fff';
			document.body.appendChild(this.opt.el);
			// event
			this.input.onfocus = function(ev) {
				var ev = ev || event;
				self.opt.el.style.display = 'block';

				ev.stopPropagation && ev.stopPropagation();
			}
			this.opt.el.onclick = this.input.onclick = function(ev) {
				var ev = ev || event;
				ev.stopPropagation && ev.stopPropagation();
				ev.preventDefault && ev.preventDefault();
			}
			addEvent(window,'click',function(){
				self.opt.el.style.display = 'none';
			});
		},
		input_select: function() {
			var self = this;
			for (var i = 0; i < dom.td.length; i++) {
				addEvent(dom.td[i],'mouseup',function(){
					// 非上一月和下一月
					if (!tool.find(this, '.display_prev_month').length && !tool.find(this, '.display_next_month').length) {
						var day = tool.find(this, 'p')[0].innerHTML;
						self.input.value = self.opt.current.year + '-' + (self.opt.current.month < 10 ? '0' + self.opt.current.month : self.opt.current.month) + '-' + day;
						self.opt.el.style.display = 'none';
					}
				});
			}
		},
		create: function() {
			var self = this;
			var temp = template.wappeer(this);
			this.opt.el.innerHTML = temp;
		},
		parseDate: function(str, el, val) {
			var s = str.split('=>');
			var v = s[1].split(':');
			// 农历
			if (s[0] == '1') {
				this.opt.current.month = parseInt(v[0]);
				this.opt.current.day = parseInt(v[1]);
				this.uphead();
				this.update();
			} else if (s[0] == '2') {
				// 公历
				alert('开发中...');
			}
			el.innerHTML = val;
		},
		even: function() {
			var self = this;
			func.select(this.opt.el, function(i, v, el, value) {
				if (i == 0) { // 年
					self.opt.current.year = parseInt(v);
					self.update();
				} else if (i == 1) { // 月
					self.opt.current.month = parseInt(v);
					self.update();
				} else if (i == 2) { // 假日
					self.parseDate(v, el, value);
				}
			});
			// 回到今天
			// if (tool.find(this.opt.el, '.calendar_header')[0]) {
			// 	tool.find(tool.find(this.opt.el, '.calendar_header')[0], 'button')[0].onclick = function() {
			// 		self.opt.current.year = new Date().getFullYear();
			// 		self.opt.current.month = new Date().getMonth() + 1;
			// 		self.opt.current.day = new Date().getDate();
			// 		self.uphead();
			// 		self.update();
			// 	}
			// }
			// 上下翻页
			for (var i = 0; i < dom.td.length; i++) {
				dom.td[i].onclick = function(ev) {
					var ev = ev || event;
					// 上一页
					if (tool.find(this, '.display_prev_month').length) {
						// 上一页
						self.opt.current.month = self.opt.current.month - 1;
						if (self.opt.current.month < 1) {
							self.opt.current.month = 12;
							self.opt.current.year = self.opt.current.year - 1;
							if (self.opt.current.year < msg.min(self)) {
								self.opt.current.year = msg.min(self);
								self.opt.current.month = 1;
							}
						}
						self.uphead();
						self.update();
					} else if (tool.find(this, '.display_next_month').length) {
						// 下一页
						self.opt.current.month = self.opt.current.month + 1;
						if (self.opt.current.month > 12) {
							self.opt.current.month = 1;
							self.opt.current.year = self.opt.current.year + 1;
							if (self.opt.current.year > msg.max(self)) {
								self.opt.current.year = msg.max(self);
								self.opt.current.month = 12;
							}
						}
						self.uphead();
						self.update();
					}
					ev.preventDefault && ev.preventDefault();
					ev.stopPropagation && ev.stopPropagation();
				}
			}
		},
		uphead: function() {
			var t = tool.find(this.opt.el, '.calendar_select_v_txt');
			t[0].innerHTML = this.opt.current.year + '年';
			t[1].innerHTML = (this.opt.current.month < 10 ? '0' + this.opt.current.month : this.opt.current.month) + '月';
			t[2].innerHTML = '假期安排';
		},
		update: function() {
			dom.table = this.opt.el.getElementsByTagName('table')[0];
			dom.td = dom.table.getElementsByTagName('td');
			// 更新上一次的基本信息
			msg.upcache.call(this);
			for (var i = 0; i < dom.td.length; i++) {
				// 公历信息
				var calendar = this.count_calendar(i);
				// 农历信息
				var lunar = this.count_lunar(i);
				// 节假日信息
				dom.td[i].innerHTML = calendar + lunar;
			}
		},
		count_calendar: function(i) {
			// 计算出当月
			var cls = '';
			var ms = msg.up(i);
			if (ms.status == -1) {
				cls = 'display_prev_month';
			} else if (ms.status == 1) {
				cls = 'display_next_month';
			}
			return '<p class="' + cls + '">' + (ms.num < 10 ? '0' + ms.num : ms.num) + '</p>';
		},
		count_lunar: function(i) {
			var cls = '';
			var ms = msg.up(i);
			if (ms.status == -1) {
				cls = 'display_prev_month';
			} else if (ms.status == 1) {
				cls = 'display_next_month';
			}

			// 除夕
			if (this.opt.lunar_festival && this._set_day) {
				this._set_day = false;
				return this.opt.lunar ? '<p title="除夕" class="' + (cls ? cls + ' ' : '') + 'term">除夕</p>' : '';
			}

			// 大年三十
			var omsg = calendarMsg.solar2lunar(this.opt.current.year, this.opt.current.month + ms.status, ms.num);

			// 显示农历节日
			// if (this.opt.lunar_festival) {
			// 	var snum = calendarMsg.isLholiday(this.opt.current.year, omsg.IMonthCn, omsg.IDayCn);
			// 	if (snum) {
			// 		// 预判二十九 实际存在大年三十
			// 		if (snum == '除夕') {
			// 			var nextMsg = calendarMsg.solar2lunar(this.opt.current.year, this.opt.current.month + ms.status, ms.num + 1);
			// 			if (nextMsg.IMonthCn == '腊月' && nextMsg.IDayCn == '三十') {
			// 				// 恢复上一个节点设置下一个节点
			// 				this._set_day = true;
			// 			} else {
			// 				return this.opt.lunar ? '<p title="' + snum + '" class="' + (cls ? cls + ' ' : '') + 'term">' + snum + '</p>' : '';
			// 			}
			// 		} else {
			// 			return this.opt.lunar ? '<p title="' + snum + '" class="' + (cls ? cls + ' ' : '') + 'term">' + snum + '</p>' : '';
			// 		}
			// 	}
			// }
			// 显示公历节日
			// if (this.opt.festival) {
			// 	var snum = calendarMsg.isholiday(this.opt.current.year, this.opt.current.month + ms.status, ms.num);
			// 	if (snum) {
			// 		return this.opt.lunar ? '<p title="' + snum + '" class="' + (cls ? cls + ' ' : '') + 'term">' + snum + '</p>' : '';
			// 	}
			// }
			// 显示节气
			if (this.opt.term && omsg.isTerm) {
				return this.opt.lunar ? '<p title="' + omsg.Term + '" class="' + (cls ? cls + ' ' : '') + 'term">' + omsg.Term + '</p>' : '';
			}
			return this.opt.lunar ? '<p class="' + cls + '">' + omsg.IDayCn + '</p>' : '';
		},
		getCurrent: function() {
			var datetime = this.opt.current.split(' ');
			var date = datetime[0].split('-');
			var time = datetime[1].split(':');
			this.opt.current = {
				year: parseInt(date[0]),
				month: parseInt(date[1]),
				day: parseInt(date[2]),
				hour: parseInt(time[0]),
				minu: parseInt(time[1]),
				sec: parseInt(time[2]),
			}
			return this.opt.current;
		}
	}

	return calendar;
});