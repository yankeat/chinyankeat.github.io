

type = ['', 'info', 'success', 'warning', 'danger'];
phpusername = 'digibot';
phppassword = 'akl23kl!1l2kj9od13lkjsd';
urlstring = 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json';
//urlstring = 'http://35.201.218.38/action.php';

botdata = {
	initPickColor: function () {
		$('.pick-class-label').click(function () {
			var new_class = $(this).attr('new-class');
			var old_class = $('#display-buttons').attr('data-class');
			var display_div = $('#display-buttons');
			if (display_div.length) {
				var display_buttons = display_div.find('.btn');
				display_buttons.removeClass(old_class);
				display_buttons.addClass(new_class);
				display_div.attr('data-class', new_class);
			}
		});
	},
}

function getDate(dayOffset = 0) {
	var returnDate = new Date();
	returnDate.setDate(returnDate.getDate() + dayOffset);
	var month = returnDate.getMonth() + 1;
	var day = returnDate.getDate();
	return returnDate.getFullYear() + '-' +
		(month < 10 ? '0' : '') + month + '-' +
		(day < 10 ? '0' : '') + day;
}

function get_bot_kpi_summary(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_kpi_summary";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			console.log(data_php);
			data = JSON.parse(data_php);
			$("#users_summary").text(data.results.total_user);
			$("#user_messages").text(data.results.total_input);
			$("#answer_accuracy").text(data.results.answer_accuracy);
			$("#response_time").text(data.results.avg_response_time + " ms");
		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};


var bot_user_chart = 0;
function get_bot_users(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_users";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);

			if (bot_user_chart) {
				bot_user_chart.data.labels = data.label;
				bot_user_chart.data.series = [data.results];
				bot_user_chart.update();
			} else {
				var dataUsers = {
					labels: data.label,
					series: [data.results]
				};
				var optionsUsers = {
					lineSmooth: false,
					low: 0,
					//					  high: 50,
					showArea: true,
					height: "245px",
					axisX: {
						showGrid: false,
					},
					axisY: {
						onlyInteger: true
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: false,
					showPoint: false,
				};

				var responsiveUsers = [
					['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];
				bot_user_chart = new Chartist.Line('#botUsers', dataUsers, optionsUsers, responsiveUsers);
			}
		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

var bot_user_messages_chart = 0;
function get_bot_messages(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_messages";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);

			if (bot_user_messages_chart) {
				bot_user_messages_chart.data.labels = data.label;
				bot_user_messages_chart.data.series = [data.results];
				bot_user_messages_chart.update();
			} else {
				var dataMessages = {
					labels: data.label,
					series: [data.results]
				};
				var optionsMessages = {
					lineSmooth: false,
					low: 0,
					//					  high: 50,
					showArea: true,
					height: "245px",
					axisX: {
						showGrid: false,
					},
					axisY: {
						onlyInteger: true
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: false,
					showPoint: false,
				};

				var responsiveMessages = [
					['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];
				bot_user_messages_chart = new Chartist.Line('#botMessages', dataMessages, optionsMessages, responsiveMessages);
			}

		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

function get_bot_message_stats(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_message_stats";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);

			$("#users_summary").text(data.results.total_user);
			$("#user_messages").text(data.results.total_input);
			$("#cached_intents").text(data.results.total_input-data.results.total_intents);
			$("#total_intents").text(data.results.total_intents);
			$("#intents_unrecognized").text(data.results.total_intents_unrecognized);
			$("#abandoned_chats").text(data.results.total_abandoned_chat);

		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

//////////////////////////////////////////////////////////////////////////////////
// Function to get Answer Accuracy page
function get_bot_answer_accuracy_summary(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_answer_accuracy_summary";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);
			$("#answer_accurate").text(data.results[0]);
			$("#answer_not_accurate").text(data.results[1]);
			$("#total_answer").text(data.results[2]);
			$("#answer_accuracy").text(data.results[3] + " %");
		},
		error: function (data) {
			//console.log(data);
			console.log("bot_get_answer_accuracy_summary error");
			$("#answer_accurate").text("0");
			$("#answer_not_accurate").text("0");
			$("#total_answer").text("0");
			$("#answer_accuracy").text("0");
		}
	});
}

//////////////////////////////////////////////////////////////////////////////////
// Function to get Chat Analysis Page
function get_bot_chat_id_list(startDate = getDate(), endDate = getDate(),rating=0) {

	command = {};
	command["command"] = "bot_get_chat_id_list";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;


console.log('test' + JSON.stringify(command));
	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);
			var i = 0;
			// clear all dropdown data
			$('#chat_id_dropdown').empty();
			$('#chat_id_dropdown').append('<option val="All">All</option>');

			$("#chat_list_header").text("Chat List for " + data.date[0] + "~"+ data.date[1]);

			var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Chat ID</th><th>Num of Messages</th></tr>';
			$.each(data.results, function (key, value) {

				i++;
				$('#chat_id_dropdown').append('<option value="'+value.chat_id+'">'+ i +') '+ value.date +' - '+value.num_msg+'msg </option>');
				table += ('<tr>');
				table += ('<td>' + i + '</td>');
				table += ('<td>' + value.date + '</td>');
				table += ('<td>' + value.chat_id + '</td>');
				table += ('<td>' + value.num_msg + '</td>');
				table += ('</tr>');
			});
			table += '</table>';
			$("#list_of_chat_id").html(table);
		},
		error: function (data) {
			//console.log(data);
			console.log("bot_get_chat_id_list error");
			var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Chat ID</th><th>Num of Messages</th></tr>';
			$("#list_of_chat_id").html(table);
		}
	});
}

function get_bot_message_by_chat_id(chat_id) {
	if(chat_id=="All") {
		get_bot_chat_id_list($("#date_start").val(),$("#date_end").val());
		$("#dialog_type_dropdown").prop("disabled", true);
		$("#dialog_type_dropdown").val("All");	   
	} else {
		$("#dialog_type_dropdown").prop("disabled", false);  
		command = {};
		command["command"] = "bot_get_msg_list_by_chatid";
		command["no_of_params"] = 1;
		command["param1"] = chat_id;

		$.ajax({
			type: "POST",
			url: urlstring,
//			beforeSend: function(xhr) {
//				xhr.setRequestHeader("Authorization", "Basic "
//					+ btoa(phpusername + ":" + phppassword));
//			},
//			crossDomain: true,
			data: JSON.stringify(command),
			cache: false,
			async: true,
			timeout: 10000,
			success: function (data_php) {
				data = JSON.parse(data_php);
				//console.log(data);
				var i = 0;
				// clear all dropdown data

				var dialog_type = $("#dialog_type_dropdown").val();				
				
				var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Type</th><th>Text</th></tr>';
				if (dialog_type=='User Text') {
					table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Input Text</th><th>Intent</th><th>Output Text</th></tr>';
					var result_date='', result_dialog_type='', result_chat_log='', result_dialog_input='', result_text_out='', result_intent='', result_feedback='', text_num=0;
					$.each(data.results, function (key, value) {
						i++;
						if(value.dialog_type=='Text In') {
							if(result_dialog_input.length>0) {
								// log the previous line. 
								table += ('<tr>');
								table += ('<td>' + text_num + '</td>');
								table += ('<td>' + result_date + '</td>');
								table += ('<td>' + result_dialog_input + '</td>');
								table += ('<td>' + result_intent + '</td>');
								table += ('<td>' + result_text_out + '</td>');
								table += ('</tr>');
								// Now log a new line
								text_num = i;
								result_date = value.date;
								result_dialog_input = value.chat_log;
								result_intent = '';
								result_text_out = '';
								result_feedback = '';								
							} else {
								text_num = i;
								result_date = value.date;
								result_dialog_input = value.chat_log;
								result_intent = '';
								result_text_out = '';
								result_feedback = '';								
							}
						} else if(value.dialog_type == 'Text Out' && value.chat_log!='undefined') {
							if(result_text_out.length>0) {
								result_text_out +=  "<br><br> a" + value.chat_log;
							} else {
								result_text_out = value.chat_log;
							}
							result_intent = value.intent;
						}
					});
					if(result_dialog_input.length>0) {
						// log the previous line. 
						table += ('<tr>');
						table += ('<td>' + text_num + '</td>');
						table += ('<td>' + result_date + '</td>');
						table += ('<td>' + result_dialog_input + '</td>');
						table += ('<td>' + result_intent + '</td>');
						table += ('<td>' + result_text_out + '</td>');
						table += ('</tr>');	
					}
				} else{
					table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Type</th><th>Text</th></tr>';
					$.each(data.results, function (key, value) {
						i++;
						if(dialog_type=='All') {
							table += ('<tr>');
							table += ('<td>' + i + '</td>');
							table += ('<td>' + value.date + '</td>');
							table += ('<td>' + value.dialog_type + '</td>');
							if(value.dialog_type == 'Text In') {
								table += ('<td>' +value.intent + value.chat_log + '</td>');
							} else {
								table += ('<td>' + 'Intent['+value.intent+'] '+ value.chat_log + '</td>');
							}
							table += ('</tr>');
						}
					});
				}
				table += '</table>';
				$("#list_of_chat_id").html(table);

			},
			error: function (data) {
				//console.log(data);
				console.log("get_bot_chat_id_list error");
				var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Type</th><th>Text</th><th>Button</th></tr>';
				$("#list_of_chat_id").html(table);
			}
		});
	}
}

//////////////////////////////////////////////////////////////////////////////////
// Function to get Performance Page
function bot_force_process_daily_chat_range(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_force_process_daily_chat_range";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);
			console.log("bot_force_process_daily_chat_range() success");
		},
		error: function (data_php) {
			console.log("bot_force_process_daily_chat_range() error");
		}
	});
}
function bot_get_performance_summary(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_performance_stats";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);
			console.log(data);
			$("#result_user").text(data.results.total_user);
			$("#msg_per_chat").text(data.results.total_input);
			$("#concurrent_session").text(data.results.concurrent_session);
			$("#chat_duration").text(data.results.chat_duration + " sec");
			$("#chat_tps").text(data.results.chat_tps);
			$("#response_time").text(data.results.response_time + " ms");
		},
		error: function (data) {
			//console.log(data);
			console.log("bot_get_performance_summary error");
			$("#result_user").text("0");
			$("#msg_per_chat").text("0");
			$("#concurrent_session").text("0");
			$("#chat_duration").text("0");
			$("#chat_tps").text("0");
			$("#response_time").text("0");
		}
	});
}

var bot_response_time_chart = 0;
function get_bot_response_time_graph(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_response_time_graph";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);

			if (bot_response_time_chart) {
				bot_response_time_chart.data.labels = data.label;
				bot_response_time_chart.data.series = [data.results_avg];
				bot_response_time_chart.update();
			} else {
				var dataUsers = {
					labels: data.label, 
					series: [data.results_avg ]
				};
				var optionsUsers = {
					lineSmooth: false,
					low: 0,
					//					  high: 50,
					showArea: true,
					height: "245px",
					axisX: {
						showGrid: false,
					},
					axisY: {
						onlyInteger: true
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: false,
					showPoint: false,
				};

				var responsiveUsers = [
					['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];
				bot_response_time_chart = new Chartist.Line('#response_time_graph', dataUsers, optionsUsers, responsiveUsers);
			}
		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

var bot_concurrent_session_chart = 0;
function get_bot_concurrent_session_graph(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_concurrent_session_graph";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);

			if (bot_concurrent_session_chart) {
				bot_concurrent_session_chart.data.labels = data.label;
				bot_concurrent_session_chart.data.series = [data.results];
				bot_concurrent_session_chart.update();
			} else {
				var dataUsers = {
					labels: data.label,
					series: [data.results]
				};
				var optionsUsers = {
					lineSmooth: false,
					low: 0,
					showArea: true,
					height: "245px",
					axisX: {
						showGrid: false,
					},
					axisY: {
						onlyInteger: true
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: false,
					showPoint: false,
				};

				var responsiveUsers = [
					['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];
				bot_concurrent_session_chart = new Chartist.Line('#concurrent_session_graph', dataUsers, optionsUsers, responsiveUsers);
			}
		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

var bot_tps_chart = 0;
function get_bot_tps_graph(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_tps_graph";
	command["no_of_params"] = 2;
	command["param1"] = startDate;
	command["param2"] = endDate;

	$.ajax({
		type: "POST",
		url: urlstring,
//		beforeSend: function(xhr) {
//			xhr.setRequestHeader("Authorization", "Basic "
//				+ btoa(phpusername + ":" + phppassword));
//		},
//		crossDomain: true,
		data: JSON.stringify(command),
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data_php) {
			data = JSON.parse(data_php);

			if (bot_tps_chart) {
				bot_tps_chart.data.labels = data.label;
				bot_tps_chart.data.series = [data.results];
				bot_tps_chart.update();
			} else {
				var dataUsers = {
					labels: data.label,
					series: [data.results]
				};
				var optionsUsers = {
					lineSmooth: false,
					low: 0,
					showArea: true,
					height: "245px",
					axisX: {
						showGrid: false,
					},
					axisY: {
						onlyInteger: true
					},
					lineSmooth: Chartist.Interpolation.simple({
						divisor: 3
					}),
					showLine: false,
					showPoint: false,
				};

				var responsiveUsers = [
					['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];
				bot_tps_chart = new Chartist.Line('#tps_graph', dataUsers, optionsUsers, responsiveUsers);
			}
		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

$(function () {
	var dateFormat = "yy-mm-dd",
		from = $("#date_start")
		.datepicker({
			//defaultDate: "+1w",
			changeMonth: true,
			numberOfMonths: 1
		})
		.on("change", function () {
			from.datepicker("option", "dateFormat", dateFormat);
			to.datepicker("option", "dateFormat", dateFormat);
			to.datepicker("option", "minDate", getDate(this));
		}),
		to = $("#date_end").datepicker({
			//defaultDate: "+1w",
			option: dateFormat,
			changeMonth: true,
			numberOfMonths: 1
		})
		.on("change", function () {
			to.datepicker("option", "dateFormat", dateFormat);
			from.datepicker("option", "dateFormat", dateFormat);
			from.datepicker("option", "maxDate", getDate(this));
		});

	function getDate(element) {
		var date;
		try {
			date = $.datepicker.parseDate(dateFormat, element.value);
		} catch (error) {
			date = null;
		}
		return date;
	}
});

$(document).ready(function () {
	// General on document Ready
});
