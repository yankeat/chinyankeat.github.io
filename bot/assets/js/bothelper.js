

type = ['', 'info', 'success', 'warning', 'danger'];

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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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

var bot_rating_chart = 0;
function get_bot_ratings(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_ratings";
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

			if (bot_rating_chart) {
				bot_rating_chart.data.labels = data.label;
				bot_rating_chart.data.series = [data.results.star1, data.results.star2, data.results.star3, data.results.star4, data.results.star5];
				bot_rating_chart.update();
			} else {
				var dataMessages = {
					labels: data.label,
					series: [data.results.star1, data.results.star2, data.results.star3, data.results.star4, data.results.star5]
				};
				var optionsMessages = {
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

				var responsiveMessages = [
					['screen and (max-width: 640px)', {
						axisX: {
							labelInterpolationFnc: function (value) {
								return value[0];
							}
						}
					}]
				];
				bot_rating_chart = new Chartist.Line('#botRatings', dataMessages, optionsMessages, responsiveMessages);
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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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
	command["start_date"] = startDate;
	command["end_date"] = endDate;

	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
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
function get_bot_answer_accuracy_feedback(startDate = getDate(), endDate = getDate(),dialog_input="All", feedback="All") {
	command = {};
	command["command"] = "bot_get_answer_accuracy_feedback";
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	command["dialog_input"] = dialog_input; 
	command["feedback"] = feedback; 
	
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
			//console.log(data);
			var i = 0;
			$("#feedback_list_header").text("Chat List for " + data.date[0] + "~"+ data.date[1]);
			
			var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Intent</th><th>Feedback</th></tr>';
			$.each(data.results, function (key, value) {
				i++;
				table += ('<tr>');
				table += ('<td>' + i + '</td>');
				table += ('<td>' + value.date + '</td>');
				table += ('<td>' + value.intent + '</td>');
				table += ('<td>' + value.feedback + '</td>');
				table += ('</tr>');
			});
			table += '</table>';
			$("#list_of_feedback").html(table);

		},
		error: function (data) {
			//console.log(data);
			console.log("bot_get_answer_accuracy_feedback error");
			var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Intent</th><th>Feedback</th></tr>';
			$("#list_of_feedback").html(table);
		}
	});
}
function get_bot_answer_accuracy_intents(startDate = getDate(), endDate = getDate(),feedback="All") {
	command = {};
	command["command"] = "bot_get_answer_accuracy_intents";
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	command["feedback"] = feedback; 
	
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
			//console.log(data);
			var i = 0;
			// clear all dropdown data
			$('#answer_dialog_id_dropdown').empty();
			$('#answer_dialog_id_dropdown').append('<option val="All">All</option>');
			
			$.each(data.results, function (key, value) {

				i++;
				$('#answer_dialog_id_dropdown').append('<option value="'+value.intent+'">'+ i +') '+ value.intent +' ('+value.count+')'+'</option>');
			});

		},
		error: function (data) {
			//console.log(data);
			console.log("bot_get_answer_accuracy_intents error");
		}
	});
}

//////////////////////////////////////////////////////////////////////////////////
// Function to get Chat Analysis Page
function get_bot_chat_id_list(startDate = getDate(), endDate = getDate(),rating=0) {
	command = {};
	command["command"] = "bot_get_chat_id_list";
	command["start_date"] = startDate;
	command["end_date"] = endDate;

	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
			//console.log(data);
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
		command["chat_id"] = chat_id;

		$.ajax({
			type: "POST",
			url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
			data: {
				data: JSON.stringify(command)
			},
			cache: false,
			async: true,
			timeout: 10000,
			success: function (data) {
				//console.log(data);
				var i = 0;
				// clear all dropdown data

				var dialog_type = $("#dialog_type_dropdown").val();				
				
				var table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Type</th><th>Text</th><th>Button</th></tr>';
				if ('Fallback Intent' == dialog_type) {
					var result_date, result_dialog_type, result_chat_log, result_dialog_input;

					table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Type</th><th>Text</th><th>Button</th></tr>';
					$.each(data.results, function (key, value) {
						i++;
						if(value.dialog_type == 'Text In') {
							result_date = value.date;
							result_dialog_type = value.dialog_type;
							result_chat_log = value.chat_log;
							result_dialog_input = value.dialog_input;
						} else if (value.chat_log=='Default-Fallback-Intent'){
							table += ('<tr>');
							table += ('<td>' + i + '</td>');
							table += ('<td>' + result_date + '</td>');
							table += ('<td>' + result_dialog_type + '</td>');
							table += ('<td>' + result_chat_log + '</td>');
							table += ('<td>' + result_dialog_input + '</td>');
							table += ('</tr>');							
						}
					});
				} else if(dialog_type=='User Text') {
					table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Input Text</th><th>Intent</th><th>Output Text</th><th>Feedback</th></tr>';
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
								table += ('<td>' + result_feedback + '</td>');
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
								result_text_out +=  "<br><br>" + value.chat_log;
							} else {
								result_text_out = value.chat_log;
							}
						} else if (value.dialog_type=='Intent'){
							result_intent = value.chat_log;
						} else if (value.dialog_type=='Feedback'){
							result_feedback = value.chat_log;
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
						table += ('<td>' + result_feedback + '</td>');
						table += ('</tr>');	
					}
				} else if(dialog_type.substring(0,13)=='User Feedback') {
					table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Input Text</th><th>Intent</th><th>Output Text</th><th>Feedback</th></tr>';
					
					var result_date='', result_dialog_type='', result_chat_log='', result_dialog_input='', result_text_out='', result_intent='', result_feedback='';
					$.each(data.results, function (key, value) {
						i++;
						if(value.dialog_type=='Text In' && value.chat_log!='No' && value.chat_log!='Yes') {
							result_date = value.date;
							result_dialog_input = value.chat_log;
							result_intent = '';
							result_text_out = '';
							result_feedback = '';
						} else if(value.dialog_type == 'Text Out' && value.chat_log!='undefined' && value.chat_log!='Was I able to help you?') {
							if(result_text_out.length>0) {
								result_text_out +=  "\n\n" + value.chat_log;
							} else {
								result_text_out = value.chat_log;
							}
						} else if (value.dialog_type=='Feedback'){
							if((dialog_type=='User Feedback Yes' && value.chat_log=='Yes') ||
							   (dialog_type=='User Feedback No' && value.chat_log=='No') ||
							   (dialog_type=='User Feedback All')) {
								result_feedback = value.chat_log;
								result_intent = value.dialog_input;
								table += ('<tr>');
								table += ('<td>' + i + '</td>');
								table += ('<td>' + result_date + '</td>');
								table += ('<td>' + result_dialog_input + '</td>');
								table += ('<td>' + result_intent + '</td>');
								table += ('<td>' + result_text_out + '</td>');
								table += ('<td>' + result_feedback + '</td>');
								table += ('</tr>');
								result_text_date = '';
								result_dialog_input = '';
								result_intent = '';
								result_text_out = '';
								result_feedback = '';
							}
						}
					});
				} else{
					table = '<table class="mainTable"><tr><th></th><th>Date</th><th>Type</th><th>Text</th><th>Button</th></tr>';
					$.each(data.results, function (key, value) {
						i++;
						if(dialog_type=='All') {
							table += ('<tr>');
							table += ('<td>' + i + '</td>');
							table += ('<td>' + value.date + '</td>');
							table += ('<td>' + value.dialog_type + '</td>');
							table += ('<td>' + value.chat_log + '</td>');
							table += ('<td>' + value.dialog_input + '</td>');
							table += ('</tr>');
						} else if (value.dialog_type == dialog_type) {
							table += ('<tr>');
							table += ('<td>' + i + '</td>');
							table += ('<td>' + value.date + '</td>');
							table += ('<td>' + value.dialog_type + '</td>');
							table += ('<td>' + value.chat_log + '</td>');
							table += ('<td>' + value.dialog_input + '</td>');
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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 20000,
		success: function (data) {
			console.log("bot_force_process_daily_chat_range() success");
		},
		error: function (data) {
			console.log("bot_force_process_daily_chat_range() error");
		}
	});
}
function bot_get_performance_summary(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_performance_stats";
	command["start_date"] = startDate;
	command["end_date"] = endDate;

	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		crossDomain: true,
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {

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

//////////////////////////////////////////////////////////////////////////////////
// Function to get Ratings Page
function get_bot_ratings_summary(startDate = getDate(), endDate = getDate()) {
	command = {};
	command["command"] = "bot_get_ratings_summary";
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
			
			var rating_1star = data.results[0];
			var rating_2star = data.results[1];
			var rating_3star = data.results[2];
			var rating_4star = data.results[3];
			var rating_5star = data.results[4];
			var total_ratings = rating_1star + rating_2star + rating_3star + rating_4star + rating_5star;
			var overall_rating = 0;
			if(total_ratings==0) {
				$("#overall_rating").text("-");
			}
			else {
				overall_rating = (rating_1star+rating_2star*2+rating_3star*3+rating_4star*4+rating_5star*5)*5 /(total_ratings*5);
				overall_rating = Math.round( overall_rating * 10 ) / 10;
				$("#overall_rating").text(overall_rating+"☆");
			}
			
			$("#rating_1star").text(rating_1star);
			$("#rating_2star").text(rating_2star);
			$("#rating_3star").text(rating_3star);
			$("#rating_4star").text(rating_4star);
			$("#rating_5star").text(rating_5star);
		},
		error: function (data) {
			console.log(data);
			console.log("error");
		}
	});
};

function bot_get_ratings_and_feedback(startDate = getDate(), endDate = getDate(),rating=0) {
	command = {};
	command["command"] = "bot_get_ratings_and_feedback";
	command["start_date"] = startDate;
	command["end_date"] = endDate;
	command["rating"] = rating;
	$.ajax({
		type: "POST",
		url: 'https://yankeat-digital.azurewebsites.net/action.ashx?action=json',
		data: {
			data: JSON.stringify(command)
		},
		cache: false,
		async: true,
		timeout: 10000,
		success: function (data) {
			console.log(data);
			var i = 0;
			$("#feedback_date").text("Feedback  " + data.date[0] + "~"+ data.date[1]);
			var table = '<table class="mainTable"><tr><th>Date</th><th>Rating</th><th>Feedback</th></tr>';
			$.each(data.results, function (key, value) {
				table += ('<tr>');
				table += ('<td>' + value.date + '</td>');
				table += ('<td>' + value.rating + '</td>');
				table += ('<td>' + value.feedback + '</td>');
				table += ('</tr>');
			});
			table += '</table>';
			$("#rating_feedback").html(table);

		},
		error: function (data) {
			//console.log(data);
			console.log("getRatingAndFeedback error");
			var table = '<table class="mainTable"><tr><th>Date</th><th>Rating</th><th>Feedback</th></tr></table>';
			$("#rating_feedback").html(table);
		}
	});
}


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
