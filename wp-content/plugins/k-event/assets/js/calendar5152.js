;(function($) {
	"use strict";
	
	//plugin calendar master  fix
	Date.prototype.getWeek = function() {
		var onejan = new Date(this.getFullYear(), 0, 1);
		return Math.ceil((((this.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
	};
	Date.prototype.getMonthFormatted = function() {
		var month = this.getMonth() + 1;
		return month < 10 ? '0' + month : month;
	};
	Date.prototype.getDateFormatted = function() {
		var date = this.getDate();
		return date < 10 ? '0' + date : date;
	};
	if(!String.prototype.format) {
		String.prototype.format = function() {
			var args = arguments;
			return this.replace(/{(\d+)}/g, function(match, number) {
				return typeof args[number] != 'undefined' ? args[number] : match;
			});
		};
	}
	if(!String.prototype.formatNum) {
		String.prototype.formatNum = function(decimal) {
			var r = "" + this;
			while(r.length < decimal)
				r = "0" + r;
			return r;
		};
	}
	
	var month_update='';

	function showclosebtt(){
		$(".close-button").css({'z-index':'9', 'opacity':'1'});
		//$(".close-button");//.animate({"opacity":"1"}, 1000);
	};

	function hexToRgb(hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
			} : null;
	}	
	
	function loadingShow(){
		$("#calendar-box").addClass("add-min-height");
		$("#calendar-box #calendar-loading").css("display","block");
	}
	
	function loadingShowkk(callback){
		$("#calendar-box").addClass("add-min-height");
		$("#calendar-box #calendar-loading").css("display","block");
		callback();
	};
	
	function loadingHide(){		
		$("#calendar-box #calendar-loading").css("display","none");
		$("#calendar-box").removeClass("add-min-height");
	}
	
	var defaults = {
		width:              '100%',
		view:               'month',
		day:                'now',
		time_start:         '06:00',
		time_end:           '22:00',
		time_split:         '30',
		events_source:      '',
		tmpl_path:          'tmpls/',
		tmpl_cache:         true,
		classes:            {
			months: {
				inmonth:  'cal-day-inmonth',
				outmonth: 'cal-day-outmonth',
				saturday: 'cal-day-weekend',
				sunday:   'cal-day-weekend',
				holidays: 'cal-day-holiday',
				today:    'cal-day-today'
			},
			week:   {
				workday:  'cal-day-workday',
				saturday: 'cal-day-weekend',
				sunday:   'cal-day-weekend',
				holidays: 'cal-day-holiday',
				today:    'cal-day-today'
			}
		},
		modal:              null,
		modal_type:         "iframe",
		modal_title:        null,
		views:              {
			year:  {
				slide_events: 1,
				enable:       1
			},
			month: {
				slide_events: 1,
				enable:       1
			},
			week:  {
				enable: 1
			},
			day:   {
				enable: 1
			}
		},
		merge_holidays:     false,
		onAfterEventsLoad:  function(events) {
		},
		onBeforeEventsLoad: function(next) {
			next();
		},
		onAfterViewLoad:    function(view) {
		},
		onAfterModalShown:  function(events) {
		},
		onAfterModalHidden: function(events) {
		},
		events:             [],
		templates:          {
			year:  '',
			month: '',
			week:  '',
			day:   ''
		},
		stop_cycling:       false
	};
	var defaults_extended = {
		first_day: 2,
		holidays:  {
		}
	};
	var strings = {
		error_noview:     'Calendar: View {0} not found',
		error_dateformat: 'Calendar: Wrong date format {0}. Should be either "now" or "yyyy-mm-dd"',
		error_loadurl:    'Calendar: Event URL is not set',
		error_where:      'Calendar: Wrong navigation direction {0}. Can be only "next" or "prev" or "today"',
		error_timedevide: 'Calendar: Time split parameter should divide 60 without decimals. Something like 10, 15, 30',
		no_events_in_day: 'No events in this day.',

		title_year:  '{0}',
		title_month: '{0} {1}',
		title_week:  'week {0} of {1}',
		title_day:   '{0} {1} {2}, {3}',

		week:        'Week {0}',
		all_day:     'All day',
		time:        'Time',
		events:      'Events',
		before_time: 'Ends before timeline',
		after_time:  'Starts after timeline',

		m0:  calendar_date_trans.m0,
		m1:  calendar_date_trans.m1,
		m2:  calendar_date_trans.m2,
		m3:  calendar_date_trans.m3,
		m4:  calendar_date_trans.m4,
		m5:  calendar_date_trans.m5,
		m6:  calendar_date_trans.m6,
		m7:  calendar_date_trans.m7,
		m8:  calendar_date_trans.m8,
		m9:  calendar_date_trans.m9,
		m10: calendar_date_trans.m10,
		m11: calendar_date_trans.m11,

		ms0:  calendar_date_trans.ms0,
		ms1:  calendar_date_trans.ms1,
		ms2:  calendar_date_trans.ms2,
		ms3:  calendar_date_trans.ms3,
		ms4:  calendar_date_trans.ms4,
		ms5:  calendar_date_trans.ms5,
		ms6:  calendar_date_trans.ms6,
		ms7:  calendar_date_trans.ms7,
		ms8:  calendar_date_trans.ms8,
		ms9:  calendar_date_trans.ms9,
		ms10: calendar_date_trans.ms10,
		ms11: calendar_date_trans.ms11,
		
		d0: calendar_date_trans.d0,
		d1: calendar_date_trans.d1,
		d2: calendar_date_trans.d2,
		d3: calendar_date_trans.d3,
		d4: calendar_date_trans.d4,
		d5: calendar_date_trans.d5,
		d6: calendar_date_trans.d6		
		/*
		d0: 'Sunday',
		d1: 'Monday',
		d2: 'Tuesday',
		d3: 'Wednesday',
		d4: 'Thursday',
		d5: 'Friday',
		d6: 'Saturday'
		*/
	};

	var browser_timezone = '';
	try {
		if($.type(window.jstz) == 'object' && $.type(jstz.determine) == 'function') {
			browser_timezone = jstz.determine().name();
			if($.type(browser_timezone) !== 'string') {
				browser_timezone = '';				
			}
		}
	}
	catch(e) {
	}

	function buildEventsUrl(events_url, data) {
		var separator, key, url;
		url = events_url;
		separator = (events_url.indexOf('?') < 0) ? '?' : '&';
		for(key in data) {
			url += separator + key + '=' + encodeURIComponent(data[key]);
			separator = '&';
		}
		return url;
	}

	function getExtentedOption(cal, option_name) {
		var fromOptions = (cal.options[option_name] != null) ? cal.options[option_name] : null;
		var fromLanguage = (cal.locale[option_name] != null) ? cal.locale[option_name] : null;
		if((option_name == 'holidays') && cal.options.merge_holidays) {
			var holidays = {};
			$.extend(true, holidays, fromLanguage ? fromLanguage : defaults_extended.holidays);
			if(fromOptions) {
				$.extend(true, holidays, fromOptions);
			}
			return holidays;
		}
		else {
			if(fromOptions != null) {
				return fromOptions;
			}
			if(fromLanguage != null) {
				return fromLanguage;
			}
			return defaults_extended[option_name];
		}
	}

	function getHolidays(cal, year) {
		var hash = [];
		var holidays_def = getExtentedOption(cal, 'holidays');
		for(var k in holidays_def) {
			hash.push(k + ':' + holidays_def[k]);
		}
		hash.push(year);
		hash = hash.join('|');
		if(hash in getHolidays.cache) {
			return getHolidays.cache[hash];
		}
		var holidays = [];
		$.each(holidays_def, function(key, name) {
			var firstDay = null, lastDay = null, failed = false;
			$.each(key.split('>'), function(i, chunk) {
				var m, date = null;
				if(m = /^(\d\d)-(\d\d)$/.exec(chunk)) {
					date = new Date(year, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
				}
				else if(m = /^(\d\d)-(\d\d)-(\d\d\d\d)$/.exec(chunk)) {
					if(parseInt(m[3], 10) == year) {
						date = new Date(year, parseInt(m[2], 10) - 1, parseInt(m[1], 10));
					}
				}
				else if(m = /^easter(([+\-])(\d+))?$/.exec(chunk)) {
					date = getEasterDate(year, m[1] ? parseInt(m[1], 10) : 0);
				}
				else if(m = /^(\d\d)([+\-])([1-5])\*([0-6])$/.exec(chunk)) {
					var month = parseInt(m[1], 10) - 1;
					var direction = m[2];
					var offset = parseInt(m[3]);
					var weekday = parseInt(m[4]);
					switch(direction) {
						case '+':
							var d = new Date(year, month, 1 - 7);
							while(d.getDay() != weekday) {
								d = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
							}
							date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7 * offset);
							break;
						case '-':
							var d = new Date(year, month + 1, 0 + 7);
							while(d.getDay() != weekday) {
								d = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
							}
							date = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7 * offset);
							break;
					}
				}
				if(!date) {
					warn('Unknown holiday: ' + key);
					failed = true;
					return false;
				}
				switch(i) {
					case 0:
						firstDay = date;
						break;
					case 1:
						if(date.getTime() <= firstDay.getTime()) {
							warn('Unknown holiday: ' + key);
							failed = true;
							return false;
						}
						lastDay = date;
						break;
					default:
						warn('Unknown holiday: ' + key);
						failed = true;
						return false;
				}
			});
			if(!failed) {
				var days = [];
				if(lastDay) {
					for(var date = new Date(firstDay.getTime()); date.getTime() <= lastDay.getTime(); date.setDate(date.getDate() + 1)) {
						days.push(new Date(date.getTime()));
					}
				}
				else {
					days.push(firstDay);
				}
				holidays.push({name: name, days: days});
			}
		});
		getHolidays.cache[hash] = holidays;
		return getHolidays.cache[hash];
	}

	getHolidays.cache = {};

	function warn(message) {
		if($.type(window.console) == 'object' && $.type(window.console.warn) == 'function') {
			window.console.warn('[Bootstrap-Calendar] ' + message);
		}
	}

	function Calendar(params, context) {
		this.options = $.extend(true, {position: {start: new Date(), end: new Date()}}, defaults, params);
		this.setLanguage(this.options.language);
		this.context = context;

		context.css('width', this.options.width).addClass('cal-context');

		this.view();
		return this;
	}

	Calendar.prototype.setOptions = function(object) {
		$.extend(this.options, object);
		if('language' in object) {
			this.setLanguage(object.language);
		}
		if('modal' in object) {
			this._update_modal();
		}
	}

	Calendar.prototype.setLanguage = function(lang) {
		if(window.calendar_languages && (lang in window.calendar_languages)) {
			this.locale = $.extend(true, {}, strings, calendar_languages[lang]);
			this.options.language = lang;
		} else {
			this.locale = strings;
			delete this.options.language;
		}
	}

	Calendar.prototype._render = function() {
		this.context.html('');
		this._loadTemplate(this.options.view);
		this.stop_cycling = false;

		var data = {};
		data.cal = this;
		data.day = 1;

		if(getExtentedOption(this, 'first_day') == 1) {
			data.days_name = [this.locale.d1, this.locale.d2, this.locale.d3, this.locale.d4, this.locale.d5, this.locale.d6, this.locale.d0]
		} else {
			data.days_name = [this.locale.d0, this.locale.d1, this.locale.d2, this.locale.d3, this.locale.d4, this.locale.d5, this.locale.d6]
		}

		var start = parseInt(this.options.position.start.getTime());
		var end = parseInt(this.options.position.end.getTime());

		data.events = this.getEventsBetween(start, end);

		switch(this.options.view) {
			case 'month':
				break;
			case 'week':
				this._calculate_hour_minutes(data);
				break;
			case 'day':
				this._calculate_hour_minutes(data);
				break;
		}

		data.start = new Date(this.options.position.start.getTime());
		data.lang = this.locale;

		this.context.append(this.options.templates[this.options.view](data));
		this._update();
	};

	Calendar.prototype._calculate_hour_minutes = function(data) {
		var $self = this;
		var time_split = parseInt(this.options.time_split);
		var time_split_count = 60 / time_split;
		var time_split_hour = Math.min(time_split_count, 1);

		if(((time_split_count >= 1) && (time_split_count % 1 != 0)) || ((time_split_count < 1) && (1440 / time_split % 1 != 0))) {
			$.error(this.locale.error_timedevide);
		}

		var time_start = this.options.time_start.split(":");
		var time_end = this.options.time_end.split(":");

		data.hours = (parseInt(time_end[0]) - parseInt(time_start[0])) * time_split_hour;
		var lines = data.hours * time_split_count - parseInt(time_start[1]) / time_split;
		var ms_per_line = (60000 * time_split);

		var start = new Date(this.options.position.start.getTime());
		start.setHours(time_start[0]);
		start.setMinutes(time_start[1]);
		var end = new Date(this.options.position.end.getTime());
		end.setHours(time_end[0]);
		end.setMinutes(time_end[1]);

		data.all_day = [];
		data.by_hour = [];
		data.after_time = [];
		data.before_time = [];
		$.each(data.events, function(k, e) {
			var s = new Date(parseInt(e.start));
			var f = new Date(parseInt(e.end));

			e.start_hour = s.getHours().toString().formatNum(2) + ':' + s.getMinutes().toString().formatNum(2);
			e.end_hour = f.getHours().toString().formatNum(2) + ':' + f.getMinutes().toString().formatNum(2);

			if(e.start < start.getTime()) {
				warn(1);
				e.start_hour = s.getDate() + ' ' + $self.locale['ms' + s.getMonth()] + ' ' + e.start_hour;
			}

			if(e.end > end.getTime()) {
				warn(1);
				e.end_hour = f.getDate() + ' ' + $self.locale['ms' + f.getMonth()] + ' ' + e.end_hour;
			}

			if(e.start < start.getTime() && e.end > end.getTime()) {
				data.all_day.push(e);
				return;
			}

			if(e.end < start.getTime()) {
				data.before_time.push(e);
				return;
			}

			if(e.start > end.getTime()) {
				data.after_time.push(e);
				return;
			}

			var event_start = start.getTime() - e.start;

			if(event_start >= 0) {
				e.top = 0;
			} else {
				e.top = Math.abs(event_start) / ms_per_line;
			}

			var lines_left = Math.abs(lines - e.top);
			var lines_in_event = (e.end - e.start) / ms_per_line;
			if(event_start >= 0) {
				lines_in_event = (e.end - start.getTime()) / ms_per_line;
			}


			e.lines = lines_in_event;
			if(lines_in_event > lines_left) {
				e.lines = lines_left;
			}

			data.by_hour.push(e);
		});

	};

	Calendar.prototype._hour_min = function(hour) {
		var time_start = this.options.time_start.split(":");
		var time_split = parseInt(this.options.time_split);
		var in_hour = 60 / time_split;
		return (hour == 0) ? (in_hour - (parseInt(time_start[1]) / time_split)) : in_hour;
	};

	Calendar.prototype._hour = function(hour, part) {
		var time_start = this.options.time_start.split(":");
		var time_split = parseInt(this.options.time_split);
		var h = "" + (parseInt(time_start[0]) + hour * Math.max(time_split / 60, 1));
		var m = "" + (time_split * part + ((hour == 0) ? parseInt(time_start[1]) : 0));

		return h.formatNum(2) + ":" + m.formatNum(2);
	};

	Calendar.prototype._week = function(event) {
		this._loadTemplate('week-days');

		var t = {};
		var start = parseInt(this.options.position.start.getTime());
		var end = parseInt(this.options.position.end.getTime());
		var events = [];
		var self = this;
		var first_day = getExtentedOption(this, 'first_day');

		$.each(this.getEventsBetween(start, end), function(k, event) {
			event.start_day = new Date(parseInt(event.start)).getDay();
			if(first_day == 1) {
				event.start_day = (event.start_day + 6) % 7;
			}
			if((event.end - event.start) <= 86400000) {
				event.days = 1;
			} else {
				event.days = ((event.end - event.start) / 86400000);
			}

			if(event.start < start) {

				event.days = event.days - ((start - event.start) / 86400000);
				event.start_day = 0;
			}

			event.days = Math.ceil(event.days);

			if(event.start_day + event.days > 7) {
				event.days = 7 - (event.start_day);
			}

			events.push(event);
		});
		t.events = events;
		t.cal = this;
		return self.options.templates['week-days'](t);
	}

	Calendar.prototype._month = function(month) {
		this._loadTemplate('year-month');

		var t = {cal: this};
		var newmonth = month + 1;
		t.data_day = this.options.position.start.getFullYear() + '-' + (newmonth < 10 ? '0' + newmonth : newmonth) + '-' + '01';
		t.month_name = this.locale['m' + month];

		var curdate = new Date(this.options.position.start.getFullYear(), month, 1, 0, 0, 0);
		t.start = parseInt(curdate.getTime());
		t.end = parseInt(new Date(this.options.position.start.getFullYear(), month + 1, 1, 0, 0, 0).getTime());
		t.events = this.getEventsBetween(t.start, t.end);
		return this.options.templates['year-month'](t);
	}

	Calendar.prototype._day = function(week, day) {
		this._loadTemplate('month-day');

		var t = {tooltip: '', cal: this};
		var cls = this.options.classes.months.outmonth;

		var firstday = this.options.position.start.getDay();
		if(getExtentedOption(this, 'first_day') == 2) {
			firstday++;
		} else {
			firstday = (firstday == 0 ? 7 : firstday);
		}

		day = (day - firstday) + 1;
		var curdate = new Date(this.options.position.start.getFullYear(), this.options.position.start.getMonth(), day, 0, 0, 0);

		if(day > 0) {
			cls = this.options.classes.months.inmonth;
		}

		var daysinmonth = (new Date(this.options.position.end.getTime() - 1)).getDate();
		if((day + 1) > daysinmonth) {
			this.stop_cycling = true;
		}

		if(day > daysinmonth) {
			day = day - daysinmonth;
			cls = this.options.classes.months.outmonth;
		}

		cls = $.trim(cls + " " + this._getDayClass("months", curdate));

		if(day <= 0) {
			var daysinprevmonth = (new Date(this.options.position.start.getFullYear(), this.options.position.start.getMonth(), 0)).getDate();
			day = daysinprevmonth - Math.abs(day);
			cls += ' cal-month-first-row';
		}

		var holiday = this._getHoliday(curdate);
		if(holiday !== false) {
			t.tooltip = holiday;
		}

		t.data_day = curdate.getFullYear() + '-' + curdate.getMonthFormatted() + '-' + (day < 10 ? '0' + day : day);
		t.cls = cls;
		t.day = day;

		t.start = parseInt(curdate.getTime());
		t.end = parseInt(t.start + 86400000);
		t.events = this.getEventsBetween(t.start, t.end);
		return this.options.templates['month-day'](t);
	}

	Calendar.prototype._getHoliday = function(date) {
		var result = false;
		$.each(getHolidays(this, date.getFullYear()), function() {
			var found = false;
			$.each(this.days, function() {
				if(this.toDateString() == date.toDateString()) {
					found = true;
					return false;
				}
			});
			if(found) {
				result = this.name;
				return false;
			}
		});
		return result;
	};

	Calendar.prototype._getHolidayName = function(date) {
		var holiday = this._getHoliday(date);
		return (holiday === false) ? "" : holiday;
	};

	Calendar.prototype._getDayClass = function(class_group, date) {
		var self = this;
		var addClass = function(which, to) {
			var cls;
			cls = (self.options.classes && (class_group in self.options.classes) && (which in self.options.classes[class_group])) ? self.options.classes[class_group][which] : "";
			if((typeof(cls) == "string") && cls.length) {
				to.push(cls);
			}
		};
		var classes = [];
		if(date.toDateString() == (new Date()).toDateString()) {
			addClass("today", classes);
		}
		var holiday = this._getHoliday(date);
		if(holiday !== false) {
			addClass("holidays", classes);
		}
		switch(date.getDay()) {
			case 0:
				addClass("sunday", classes);
				break;
			case 6:
				addClass("saturday", classes);
				break;
		}

		addClass(date.toDateString(), classes);

		return classes.join(" ");
	};

	Calendar.prototype.view = function(view) {
		if(view) {
			if(!this.options.views[view].enable) {
				return;
			}
			this.options.view = view;
		}

		this._init_position();
		this._loadEvents();
		this._render();

		this.options.onAfterViewLoad.call(this, this.options.view);
	};

	Calendar.prototype.navigate = function(where, next) {
		var to = $.extend({}, this.options.position);
		var lenMonth
		if(where == 'next') {
			switch(this.options.view) {
				case 'year':
					to.start.setFullYear(this.options.position.start.getFullYear() + 1);
					break;
				case 'month':
					to.start.setMonth(this.options.position.start.getMonth() + 1);
					
					lenMonth=this.options.position.start.getMonth() + 1;
					if(lenMonth.toString().length>1 ) {
						month_update=this.options.position.start.getFullYear()+'-'+(this.options.position.start.getMonth() + 1)+'-01';						
					}else{						
						month_update=this.options.position.start.getFullYear()+'-0'+(this.options.position.start.getMonth() + 1)+'-01';
					}
					break;
				case 'week':
					to.start.setDate(this.options.position.start.getDate() + 7);
					break;
				case 'day':
					to.start.setDate(this.options.position.start.getDate() + 1);
					break;
			}
		} else if(where == 'prev') {
			switch(this.options.view) {
				case 'year':
					to.start.setFullYear(this.options.position.start.getFullYear() - 1);
					break;
				case 'month':
					to.start.setMonth(this.options.position.start.getMonth() - 1);
					lenMonth=this.options.position.start.getMonth() + 1;
					if(lenMonth.toString().length>1 ) {
						month_update=this.options.position.start.getFullYear()+'-'+(this.options.position.start.getMonth() + 1)+'-01';						
					}else{						
						month_update=this.options.position.start.getFullYear()+'-0'+(this.options.position.start.getMonth() + 1)+'-01';
					}
					break;
				case 'week':
					to.start.setDate(this.options.position.start.getDate() - 7);
					break;
				case 'day':
					to.start.setDate(this.options.position.start.getDate() - 1);
					break;
			}
		} else if(where == 'today') {
			to.start.setTime(new Date().getTime());
		}
		else {
			$.error(this.locale.error_where.format(where))
		}
		this.options.day = to.start.getFullYear() + '-' + to.start.getMonthFormatted() + '-' + to.start.getDateFormatted();
		this.view();
		if(_.isFunction(next)) {
			next();
		}
	};

	Calendar.prototype._init_position = function() {
		var year, month, day;

		if(this.options.day == 'now') {
			var date = new Date();
			year = date.getFullYear();
			month = date.getMonth();
			day = date.getDate();
		} else if(this.options.day.match(/^\d{4}-\d{2}-\d{2}$/g)) {
			var list = this.options.day.split('-');
			year = parseInt(list[0], 10);
			month = parseInt(list[1], 10) - 1;
			day = parseInt(list[2], 10);
		}
		else {
			$.error(this.locale.error_dateformat.format(this.options.day));
		}

		switch(this.options.view) {
			case 'year':
				this.options.position.start.setTime(new Date(year, 0, 1).getTime());
				this.options.position.end.setTime(new Date(year + 1, 0, 1).getTime());
				break;
			case 'month':
				this.options.position.start.setTime(new Date(year, month, 1).getTime());
				this.options.position.end.setTime(new Date(year, month + 1, 1).getTime());
				break;
			case 'day':
				this.options.position.start.setTime(new Date(year, month, day).getTime());
				this.options.position.end.setTime(new Date(year, month, day + 1).getTime());
				break;
			case 'week':
				var curr = new Date(year, month, day);
				var first;
				if(getExtentedOption(this, 'first_day') == 1) {
					first = curr.getDate() - ((curr.getDay() + 6) % 7);
				}
				else {
					first = curr.getDate() - curr.getDay();
				}
				this.options.position.start.setTime(new Date(year, month, first).getTime());
				this.options.position.end.setTime(new Date(year, month, first + 7).getTime());
				break;
			default:
				$.error(this.locale.error_noview.format(this.options.view))
		}
		return this;
	};

	Calendar.prototype.getTitle = function() {
		var p = this.options.position.start;
		switch(this.options.view) {
			case 'year':
				return this.locale.title_year.format(p.getFullYear());
				break;
			case 'month':
				return this.locale.title_month.format(this.locale['m' + p.getMonth()], p.getFullYear());
				break;
			case 'week':
				return this.locale.title_week.format(p.getWeek(), p.getFullYear());
				break;
			case 'day':
				return this.locale.title_day.format(this.locale['d' + p.getDay()], p.getDate(), this.locale['m' + p.getMonth()], p.getFullYear());
				break;
		}
		return;
	};

	Calendar.prototype.isToday = function() {
		var now = new Date().getTime();

		return ((now > this.options.position.start) && (now < this.options.position.end));
	}

	Calendar.prototype.getStartDate = function() {
		//if(this.options.position.start >= 1427821200000 && this.options.position.start<=1428190200000) {
			//return this.options.position.start-86400000;
		//}else{
			return this.options.position.start;
		//};
	};

	Calendar.prototype.getEndDate = function() {
		//if(this.options.position.end >= 1427821200000 && this.options.position.end<=1428190200000) {
			//return this.options.position.end-86400000;
		//}else{
			return this.options.position.end;
		//};
		
	};

	Calendar.prototype._loadEvents = function() {		
		var self = this;
		var source = null;
		if('events_source' in this.options && this.options.events_source !== '') {
			source = this.options.events_source;
		}
		else if('events_url' in this.options) {
			source = this.options.events_url;
			warn('The events_url option is DEPRECATED and it will be REMOVED in near future. Please use events_source instead.');
		}
		var loader;
		switch($.type(source)) {
			
			case 'function':
				loader = function() {
					return source(self.options.position.start, self.options.position.end, browser_timezone);
				};
				break;
			case 'array':
				loader = function() {
					return [].concat(source);
				};
				break;
			case 'string':				
				if(source.length) {
					loader = function() {
						var events = [];						
						loadingShowkk(function(){
							
							var TimeOffset = new Date()
							var nTimeOffset = TimeOffset.getTimezoneOffset() / 60;
							
							var params = {from: self.options.position.start.getTime(), to: self.options.position.end.getTime()};
							if(browser_timezone.length) {
								params.browser_timezone = browser_timezone;
							}
							var param = {
								action					: 'k2t_calendar_data',
								cal_json 				: $('#action_data').val(),
								cat 					: $('#action_cat').val(),
								style					: $('#calendar_style').val(),
								'month-data'			: month_update,
								nTimeOffsetToUTC		: nTimeOffset,
							};
							var ajx_url = $('#check-jsondata').val();
							
							//$.getJSON( buildEventsUrl(ajx_url, params), (param)).done(function(json){events = json.result;});
							
							$.ajax({
								async: false,
								url:      buildEventsUrl(ajx_url, params),
								dataType: 'json',
								type:     'GET',
								data: (param),
								success: function(json){
									 //events = json.result;								 
								},
								statusCode: {
									200: function(json) {
										
										//events = json.result;	
									}
								}
							})
							.done(function(json) {
								if(!json.success) {
									$.error(json.error);
									//loadingHide();
								}
								if(json.result) {								
									events = json.result;
									window.location.hash='m-'+month_update.split('-')[1]+'-'+month_update.split('-')[0];
									loadingHide();
								}
							});
							
						});
						
						return events;
						
					};
				}
				break;
		}
		if(!loader) {
			$.error(this.locale.error_loadurl);
		}
		this.options.onBeforeEventsLoad.call(this, function() {			
			self.options.events = loader();
			self.options.events.sort(function(a, b) {
				var delta;
				delta = a.start - b.start;
				if(delta == 0) {
					delta = a.end - b.end;
				}
				return delta;
			});
			self.options.onAfterEventsLoad.call(self, self.options.events);
		});
	};

	Calendar.prototype._templatePath = function(name) {
		if(typeof this.options.tmpl_path == 'function') {
			return this.options.tmpl_path(name)
		}
		else {
			return this.options.tmpl_path + name + '.php';
		}
	};

	Calendar.prototype._loadTemplate = function(name) {
		if(this.options.templates[name]) {
			return;
		}
		var self = this;
		$.ajax({
			url:      self._templatePath(name),
			dataType: 'html',
			type:     'GET',
			async:    false,
			cache:    this.options.tmpl_cache
		}).done(function(html) {
			self.options.templates[name] = _.template(html);
		});
	};

	Calendar.prototype._update = function() {
		var self = this;

		this['_update_' + this.options.view]();

		this._update_modal();

	};

	Calendar.prototype._update_modal = function() {
		var self = this;

		$('a[data-event-id]', this.context).unbind('click');

		if(!self.options.modal) {
			return;
		}

		var modal = $(self.options.modal);

		if(!modal.length) {
			return;
		}

		var ifrm = null;
		if(self.options.modal_type == "iframe") {
			ifrm = $(document.createElement("iframe"))
				.attr({
					width:       "100%",
					frameborder: "0"
				});
		}
	};

	Calendar.prototype._update_day = function() {
		$('#cal-day-panel').height($('#cal-day-panel-hour').height());
	};

	Calendar.prototype._update_week = function() {
	};

	Calendar.prototype._update_year = function() {
		this._update_month_year();
	};
	
	Calendar.prototype._update_month = function() {
		this._update_month_year();

		var self = this;
		
		$('a.event').mouseenter(function() {
			var dateeventclass=$(this).data('event-class');			
			if(dateeventclass!=null){
				var x_rd = dateeventclass.replace("#","");
				$('<style type="text/css">.day-highlight.dh-'+x_rd+'{background-color:rgba('+hexToRgb(dateeventclass).r+','+hexToRgb(dateeventclass).g+','+hexToRgb(dateeventclass).b+',0.15) !important;}</style>').appendTo('head');
				$('a[data-event-id="' + $(this).data('event-id') + '"]').closest('.cal-cell1').addClass('day-highlight dh-'+x_rd);
			}else{
				$('a[data-event-id="' + $(this).data('event-id') + '"]').closest('.cal-cell1').addClass('day-highlight dh-event-default-red');
			};
		});
		$('a.event').mouseleave(function() {
			var dateeventclass=$(this).data('event-class');
			if(dateeventclass!=null){
				var x_rd = dateeventclass.replace("#","");
				$('div.cal-cell1').removeClass('day-highlight dh-' + x_rd);
			}else{
				$('div.cal-cell1').removeClass('day-highlight dh-event-default-red');
			};			
			
		});
	};

	Calendar.prototype._update_month_year = function() {
		if(!this.options.views[this.options.view].slide_events) {
			return;
		}
		var self = this;
		var activecell = 0;
			//alert(navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/));
		if(null==navigator.userAgent.match(/(Android|iPod|iPhone|iPad|IEMobile|Opera Mini)/)) {
			$('.cal-month-day, .cal-year-box .span3')
			.on('click', function(event) {
					if($('.events-list', this).length == 0) return;
					if($(this).children('[data-cal-date]').text() == self.activecell) return;
				})
				.on('mouseover', function() {
					if($('.events-list', this).length == 0) return;
					if($(this).children('[data-cal-date]').text() == self.activecell) return;
				});

		}
		else{
			$('.cal-cell, .cal-month-day, .cal-year-box .span3')
			.on('click', function(event) {
				if($('.events-list', this).length == 0) return;
				if($(this).children('[data-cal-date]').text() == self.activecell) return;
				if($('.events-list', this).length == 0) return;
				if($(this).children('[data-cal-date]').text() == self.activecell) return;
			})
		};

		var slider = $(document.createElement('div')).attr('id', 'cal-slide-box');
		slider.hide().click(function(event) {
			event.stopPropagation();
		});

		this._loadTemplate('events-list');
	};

	Calendar.prototype.getEventsBetween = function(start, end) {
		var events = [];
		$.each(this.options.events, function() {
			if(this.start == null) {
				return true;
			}
			var event_end = this.end || this.start;
			if((parseInt(this.start) < end) && (parseInt(event_end) >= start)) {
				events.push(this);
			}
		});
		return events;
	};

	function showEventsList(event, slider, self, strdaydata) {
		event.stopPropagation();
	
		slider.slideUp('fast', function() {
			
			var event_list = $('.events-list');
			
			slider.html(self.options.templates['events-list']({
				cal:    self,
				events: self.getEventsBetween(parseInt(event_list.data('cal-start')), parseInt(event_list.data('cal-end')))
			}));
			
			//row.after(slider);
			self.activecell = $('[data-cal-date]').text();

		});
	}

	function getEasterDate(year, offsetDays) {
		var a = year % 19;
		var b = Math.floor(year / 100);
		var c = year % 100;
		var d = Math.floor(b / 4);
		var e = b % 4;
		var f = Math.floor((b + 8) / 25);
		var g = Math.floor((b - f + 1) / 3);
		var h = (19 * a + b - d - g + 15) % 30;
		var i = Math.floor(c / 4);
		var k = c % 4;
		var l = (32 + 2 * e + 2 * i - h - k) % 7;
		var m = Math.floor((a + 11 * h + 22 * l) / 451);
		var n0 = (h + l + 7 * m + 114)
		var n = Math.floor(n0 / 31) - 1;
		var p = n0 % 31 + 1;
		return new Date(year, n, p + (offsetDays ? offsetDays : 0), 0, 0, 0);
	}

	$.fn.calendar = function(params) {
		return new Calendar(params, this);
	}
	//End plugin calendar master fix
	
	var hashDateData = window.location.hash;
			
	/**Calendar**/	
	var monthdata=$('#check-monthdata').val(); // Lấy mốc ngày/tháng/năm sự kiện
	
	function isNumber(n) {return !isNaN(parseFloat(n)) && isFinite(n);};
	if(hashDateData!='' && hashDateData!=null && typeof(hashDateData)!='undefined' && hashDateData.toString().split("-").length == 3){
		if(hashDateData.toString().split('-')[0].toLowerCase()=='#m' && isNumber(hashDateData.toString().split('-')[1]) && isNumber(hashDateData.toString().split('-')[2]) && hashDateData.toString().split('-')[2].length==4) {
			var newMonth=hashDateData.toString().split('-')[1];
			if(hashDateData.toString().split('-')[1].length==1) {newMonth='0'+hashDateData.toString().split('-')[1]};
			
			var newYear = hashDateData.toString().split('-')[2];
			
			monthdata=newYear+'-'+newMonth+'-01';
		};
	};
	
    var jsondata=$('#check-jsondata').val(); //File json chứa data event
	var month_url = $('#month-url').val();
	
	var options;
	var calendar;
	var json_source;	
	function setOptions() {
		loadingShow();
		$('#calendar-box h3').text("Loading...");
		if(month_update=='') {month_update=monthdata};	
		options = {		
			events_source: '?month-data='+month_update,
			view: 'month',
			tmpl_path: month_url,
			tmpl_cache: false,
			day: month_update,
			onAfterViewLoad: function(view) {
				$('#calendar-box h3').text(this.getTitle());
			},
			classes: {
				months: {
					general: 'label'
				}
			},
			first_day: 1
		};		
		calendar = $('#stm-calendar-id').calendar(options);					
	}
	
	function addClassFixDate(){
		if($("#calendar-box").width() <541){$(".number-events").removeClass("addclassfix").addClass("addclasshidden"); $(".event").css("display","none");$(".event.event-default-black-hidden").css("display","inline-block");} 
		else {	
			$(".event").css("display","inline-block");$(".event.event-default-black-hidden").css("display","none");
			$(".number-events").removeClass("addclasshidden");	
					
			if($("#calendar-box").width() >540 && $("#calendar-box").width() < 911){
				$(".number-events").addClass("addclassfix");
			}
			else {
				$(".number-events").removeClass("addclassfix");
			}
		}
	}
	
	$(document).ready(function() {
		if(monthdata!='' && jsondata!='' && monthdata!=undefined && jsondata!=undefined) {
			setOptions();
			
			$('#calendar-box button[data-calendar-nav]').each(function() {
				var $this = $(this);
				$this.click(function() {
					calendar.navigate($this.data('calendar-nav'));					
					addClassFixDate();					
				});
			});	
		};
		addClassFixDate();
	});
	
	$(window).resize(function(){
		addClassFixDate();
	});
	$( window ).load(function() {
		addClassFixDate();
		$('#calendar-box, #calendar-options').show();
	});
	/**End Calendar**/
}(jQuery));