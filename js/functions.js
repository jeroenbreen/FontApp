var this_field = 1;
var this_id = get_parameters("id", 294);
var this_font_category = "";
var this_font_style = "";

var textfield = new Array ();
textfield[1] = { id: get_parameters("id", 294), size: get_parameters("size", 180), line: get_parameters("line", 50), align: get_parameters("align", "left"), color: get_parameters("color", "100,0,0,0"), focus: 0 };
textfield[2] = { id: 138, size: 0, line: 50, align: "center", color: [0,0,0,100] };
textfield[3] = { id: 23, size: 100, line: 30, align: "center", color: [0,0,0,100] };
textfield[4] = { id: 901, size: 0, line: 75, align: "left", color: [0,0,0,100] };
textfield[5] = { id: 294, size: 80, line: 60, align: "center", color: [0,0,0,100] };
textfield[6] = { id: 683, size: 15, line: 70, align: "center", color: [0,40,30,0] };

var properties = new Array (1, 1, 1, 1, 1, 1);	
var top_items = new Array (1, 1, 1, 1, 1);
var drops = new Array (0, 0, 0);
var favorites = new Array();
var colorbox = 0;

var this_mode = 0;
var mode = new Array();
mode[0] = { x: "0px", y: "145px", height: "360px", width: "100%", field: [1] };
mode[1] = { x: "400px", y: "8px", height: "calc(100% - 60px)", width: "600px", field: [2,3,4] };
mode[2] = { x: "400px", y: "140px", height: "240px", width: "370px", field: [5,6] };

var old_font = new Array("Arial", "400", "Normal");

var overrule = [];
var timeouts = [];

var prevent_slide = 0;





/////////////////////////////////// INITIALIZE ////////////////////////////////////////////////////////////////////


$(function() {
	$('.resizable').draggable({
		handle: ".handle"
	}).resizable();
	$('#slider_1, #slider_2, #slider_3, #slider_4, #slider_5').slider({
		value: 50,
		slide: find_best_match,
		change: helper
	});
	$('#size_slider').slider({
		value: 90, 
		slide: write_array_font_size, 
		change: write_array_font_size
	});
	$('#line_height_slider').slider({
		value: 50, 
		slide: write_array_line_height,	
		change: write_array_line_height
	});
	$('#c, #m, #y, #k').slider({
		value: 100, 
		slide: write_array_color, 
		change: write_array_color
	});
});

function get_parameters (wanted_parameter, alternative) {
	// javascript solution for php GET
	var get_string = window.location.search.substring(1);
	var found = 0;
	var parameters = get_string.split("&");
	
	for (var i = 0; i < parameters.length; i++) {
		var value_array = parameters[i].split("=");
		if (value_array[0] == wanted_parameter) {
			if (wanted_parameter == "color") {
				var colors = value_array[1].split(",");
				var color_array = [colors[0], colors[1], colors[2], colors[3]];
				return color_array;
			}
			else {
				return value_array[1];
			}
			found = 1;
			break;
		}
	}	
	if (found == 0) { 
		if (wanted_parameter == "color") {
			return [0, 0, 0, 100];
		}
		else {
			return alternative;
		}
	}
}

function init() {
	close_top_item (1);
	close_top_item (2);
	close_top_item (3);
	deactivate (2);
	deactivate (4);
	deactivate (5);
	document.getElementById("textfield_1").innerHTML = get_parameters("text", "The quick brown fox jumps over the lazy dog");
	fill_initial_fields ();
	set_all_slides (1);	
}

$(document).ready (function() {	init ();	});

function fill_initial_fields () {
	for (i = 1; i < 7; i++) {
		change_font_family (i);
		change_font_size (i);
		change_text_align (i);
		change_color (i);
	} 
}
			




/////////////////////////////////// WRITE ARRAY FUNCTIONS ////////////////////////////////////////////////////////////////////
// font_family (equals id), font_size, line_height, align, color
// document.getElementById("mytest").innerHTML = 
			
			
function helper () {
	if (prevent_slide == 0 ) {
		find_best_match ();
	}
}

// the helper function is a workaround for the 'slider problem'
// the ui slider isn't working properly with only 'slide'. It also needs 'change', otherwise, sometimes it doesn't respond correctly when you slide to the 0 or 100 value (don't know why exactly, has something to do with the speed you are sliding?)
// but we need to prevent the change to call find_best_match, when you use set_parameters () to put the slides to a position. Therefore this construction.

function find_best_match () {
	prevent_slide = 0;
	var difference_array = new Array();
	for (var i = 1; i < font.length; i++) {
		if (font[i][3] == this_font_category && this_font_style == font[i][10]) {
			var difference = 0;
			for (j = 1; j < 6; j++) {
				if (properties[j] == 1) {
					var prop_focus = $("#slider_" + j).slider("value");
					difference += Math.abs (font[i][j + 3] - prop_focus);
				}
			}
			difference_array[i] = new Array (i, difference);
		}
	}
		
	difference_array.sort ( function (a, b) { return a[1] - b[1]; } );
	var best_match = difference_array[0][0];
	textfield[this_field].id = best_match;
	set_font_info (best_match);
	change_font_family (this_field);
}

function write_array_font_size () {
	var size = $("#size_slider").slider("value");
	if (this_field == 1) { size *= 2; }
	textfield[this_field].size = size;
	change_font_size (this_field);
}

function write_array_line_height () {
	textfield[this_field].line = $("#line_height_slider").slider("value");
	change_line_height (this_field);
}

function write_array_text_align (align) {
	textfield[this_field].align = align;
	change_text_align (this_field);
}

function write_array_color () {
	var c = $("#c").slider("value");
	var m = $("#m").slider("value");
	var y = $("#y").slider("value");
	var k = $("#k").slider("value");
	textfield[this_field].color = [c, m, y, k];
	change_color (this_field);
}





/////////////////////////////////// CHANGE FUNCTIONS ////////////////////////////////////////////////////////////////////
// font_family (equals id), font_size, line_height, top_margin (as reaction on changed line_height) align, color


function change_one (id) {
	textfield[this_field].id = id;
	change_font_family (this_field);
	set_font_category (font[id][3]);
	set_font_style (font[id][10]);
	set_parameters (id);
	set_font_info (id);
}

function change_font_family (field) {
	close_all ();
	var id = textfield[field].id;
	
	
	var font_family = font[id][0];
	var font_weight = font[id][9];
	var font_style = font[id][10];
	var new_font = new Array (font_family, font_weight, font_style);
	
	if (font[id][12] == "google") {
		WebFont.load ({
			google: { families: [new_font[0] + ":" + font_weight + font_style.toLowerCase()] },
			loading: function() {
				timeouts.push (setTimeout (loading_gif, 500) );
				overrule[field] = 0;
				document.getElementById("textfield_" + field).style.fontFamily = old_font[0];
				document.getElementById("textfield_" + field).style.fontWeight = old_font[1];
				document.getElementById("textfield_" + field).style.fontStyle = old_font[2];
			 },
			 active: function() {
				for (var i = 0; i < timeouts.length; i++) {
					clearTimeout(timeouts[i]);
				}
				timeouts = [];
				
				document.getElementById("loading").style.display = "none";
				overrule[field] = 1;
				document.getElementById("textfield_" + field).style.visibility = "visible";
				document.getElementById("textfield_" + field).style.fontFamily = new_font[0];
				document.getElementById("textfield_" + field).style.fontWeight = new_font[1];
				document.getElementById("textfield_" + field).style.fontStyle = new_font[2];
				change_font_size (field, id);
				old_font = new_font;
			 },
			 inactive: function() {
				if (overrule[field] == 0) {
					for (var i = 0; i < timeouts.length; i++) {
						clearTimeout(timeouts[i]);
					}
					timeouts = [];
					document.getElementById("loading").style.display = "none";
					document.getElementById("textfield_" + field).style.visibility = "hidden";
					document.getElementById("mytest").innerHTML = "Problems finding " + new_font[0] + " " + new_font[1] + " " + new_font[2] +  ". We are looking at it, if you are using Safari, try Firefox or Chrome instead";
				}
			 }		 
		});
	}
	else if (font[id][12] == "custom") {
		WebFont.load ({
			custom: { families: [new_font[0] + ":" + font_weight + font_style.toLowerCase()] },
			loading: function() {
				timeouts.push (setTimeout (loading_gif, 500) );
				overrule[field] = 0;
				document.getElementById("textfield_" + field).style.fontFamily = old_font[0];
				document.getElementById("textfield_" + field).style.fontWeight = old_font[1];
				document.getElementById("textfield_" + field).style.fontStyle = old_font[2];
			 },
			 active: function() {
				for (var i = 0; i < timeouts.length; i++) {
					clearTimeout(timeouts[i]);
				}
				timeouts = [];
				
				document.getElementById("loading").style.display = "none";
				overrule[field] = 1;
				document.getElementById("textfield_" + field).style.visibility = "visible";
				document.getElementById("textfield_" + field).style.fontFamily = new_font[0];
				document.getElementById("textfield_" + field).style.fontWeight = new_font[1];
				document.getElementById("textfield_" + field).style.fontStyle = new_font[2];
				change_font_size (field, id);
				old_font = new_font;
			 },
			 inactive: function() {
				if (overrule[field] == 0) {
					for (var i = 0; i < timeouts.length; i++) {
						clearTimeout(timeouts[i]);
					}
					timeouts = [];
					document.getElementById("loading").style.display = "none";
					document.getElementById("textfield_" + field).style.visibility = "hidden";
					document.getElementById("mytest").innerHTML = "Problems finding " + new_font[0] + " " + new_font[1] + " " + new_font[2] +  ". We are looking at it, if you are using Safari, try Firefox or Chrome instead";
				}
			 }	 
		});
	}
}

function change_font_size (field) {
	close_all ();
	var id = textfield[field].id;
	var size = size_correction (textfield[field].size, font[id][2]);
    document.getElementById("textfield_" + field).style.fontSize = size + "px";
    change_line_height (field, id);
}

function change_line_height (field) {
// line height is depending on font size, since its a ratio not an absolute number
	close_all ();
	var id = textfield[field].id;			
    var size = size_correction (textfield[field].size, font[id][2]);
    var line = textfield[field].line;
    var line_correction = (line + 50) * size / 100;
    document.getElementById("textfield_" + field).style.lineHeight = line_correction + "px";
    change_top_margin (field, id);
}

function change_top_margin (field) {
// correct x-line for height correction
	close_all ();
	var id = textfield[field].id;
	var a = 0.5 * textfield[field].size + 20;
	var size = size_correction (textfield[field].size, font[id][2]);
	var margin = a - size;
	if (field == 1 ) { margin += 20; }
	document.getElementById("textfield_" + field).style.marginTop = margin + "px";
}

function change_text_align (field) {
	close_all ();
	var align = textfield[field].align;
	document.getElementById("textfield_" + field).style.textAlign = align;
	set_text_align (align);
}

function change_color (field) {
	close_all ();
	var c = textfield[field].color[0];
	var m = textfield[field].color[1];
	var y = textfield[field].color[2];
	var k = textfield[field].color[3];
	
	var color = cmyk_to_rgb (c, m, y, k);
	document.getElementById("textfield_" + field).style.color = "#" + color;
}





/////////////////////////////////// SET FUNCTIONS ////////////////////////////////////////////////////////////////////
			
			
function set_all_slides (field) {
// misschien zelfs de id er hieruit halen en in elke subfunctie per field eruit halen?
	var id = textfield[field].id;
	set_font_category (font[id][3]);
	set_font_style (font[id][10]);
	set_parameters (id);
	set_font_info (id);
	set_font_size (field, textfield[field].size);
	set_line_height (textfield[field].line);
	set_text_align (textfield[field].align);
	set_color (textfield[field].color);
}

function set_font_category (font_category) {
	this_font_category = font_category;
    document.getElementById("selected_1").innerHTML = "<a id='a_selected_1' onclick='drop_out(1);'>" + font_category.substr(4) + "</a>";
    if (drops[1] == 1) {
	    drop_out(1);
    }
    count_fonts ();
}

function set_font_style (font_style) {
    this_font_style = font_style;
    document.getElementById("selected_2").innerHTML = "<a id='a_selected_2' onclick='drop_out(2);'>" + font_style + "</a>";
    if (drops[2] == 1) {
	    drop_out(2);
    }
    count_fonts ();
}

function set_parameters (id) {
	prevent_slide = 1;
	for (var j = 1; j < 6; j++) {
			$("#slider_" + j).slider("value", font[id][j + 3]);
	}
}

function set_font_info (id) {
	var font_name = font[id][0];
	var font_weight = font[id][9];
	var font_style = font[id][10];
	if (font_style == "Normal") { font_style = ""; }
	var download_link = font[id][11];
	document.getElementById("font_name").innerHTML = font_name + " <b> " + font_weight + " " + font_style + "</b>";
	document.getElementById("heart_img").href = "javascript:add_favorite(" + id + ");"; 
	document.getElementById("download_font").href = download_link;
	
	find_related_fonts (id);
}

function set_font_size (field, font_size) {
	if (field == 1) { font_size /= 2; }
	$("#size_slider").slider("value", font_size);
}

function set_line_height (line_height) {
	$("#line_height_slider").slider("value", line_height);
}

function set_text_align (this_align) {
	var align = new Array ("left", "center", "right");
	var innerhtml = "";
	for (var i = 0; i < 3; i++) {
		if (this_align == align[i] ) {
			innerhtml += '<img src="img/align-' + align[i] + '3.png" border="0">&nbsp;';
		}
		else {
			innerhtml += '<a onclick="write_array_text_align(\'' + align[i] + '\');"><img src="img/align-' + align[i] + '1.png" border="0" onmouseover="this.src=\'img/align-' + align[i] + '2.png\';"  onmouseout="this.src=\'img/align-' + align[i] + '1.png\';"></a>&nbsp;';
		}
	}
	document.getElementById("text_align").innerHTML = innerhtml;
}

function set_color (color) {
	var c = color[0];
	var m = color[1];
	var y = color[2];
	var k = color[3];
	$("#c").slider("value", c);
	$("#m").slider("value", m);
	$("#y").slider("value", y);
	$("#k").slider("value", k);
}





/////////////////////////////////// TOPMENU FUNCTIONS ////////////////////////////////////////////////////////////////////
			
			
function search_font (){
    var j = 0;
    var search = document.getElementById("search_field").value.toLowerCase();
    var text = "";
    var a = "";
    if (search.length > 0) {
	    for (var i = 1; i < font.length; i++) {
		    needle = font[i][0].toLowerCase();
		    if (needle.indexOf(search) > -1) {
			    if (j < 15) {
				    if (font[i][10] != "Regular") {
					    a = " " + font[i][10];
				    }
				    else {
					    a = "";
				    }
				    text += "<a onclick='change_one(" + i + ");' class='search'>" + font[i][0] +" " + font[i][9] + a + "</a>";
			    }
			    j++;
		    }
	    }
    }
    if (j > 14) {
	    text += "<br><font style='padding-left:16px;'>... and " + j + " more fonts</font><br><br>";
    }
    document.getElementById("search_results").innerHTML = text;
    if (text != "") {
	    document.getElementById("search_results").style.visibility = "visible";
    }
    else {
	    document.getElementById("search_results").style.visibility = "hidden";
    }		
}

function add_favorite (id) {
	var l = favorites.length;
	var hit = 0;
	for (i = 0; i < l; i++) {
		if (favorites[i] == id) {
			hit = 1;
		}
	}
	if (hit == 0) {
		favorites[l] = id;
		show_favorites ();
		if (top_items[2] == 0) {
			document.getElementById("label_small_2").style.background = "#fff";
			setTimeout( function() {
				document.getElementById("label_small_2").style.background = "#6D6F71";
			},100);
		}
	}
	else {
		document.getElementById("message").style.visibility = "visible";
		document.getElementById("message_txt").innerHTML = "Font already added. Check the Favourites tab at the right of your window.";
	}
}

function remove_favorite (i) {
	favorites[i] = "";
	show_favorites();
}

function show_favorites () {
	var text = "";	
	for (i = 0; i < favorites.length; i++) {
		if (favorites[i] != "") {
			var a = "";
			if (font[favorites[i]][10]  != "Regular") {
				a = " " + font[favorites[i]][10] ;
			}
			text += "<a onclick='change_one (" +  favorites[i] + ");' class='fav_and_rel'>" + font[favorites[i]][0] + " " + font[favorites[i]][9] + a + "</a>&nbsp;&nbsp;<a onclick='remove_favorite(" +  i + ");' class='close_fav'>x</a>";
		}
	}
	document.getElementById("top_item_2").innerHTML = text;
}

function find_related_fonts (id) {
	var related_fonts = new Array();
	var j = 0;
	var subclass = "";
	document.getElementById("top_item_3").innerHTML = "";
	for (var i = 1; i < font.length; i++) {
		if (font[id][0] == font[i][0]) {
			if (id == i) { subclass = " strikethrough"; }
			else { subclass = ""; }
			var font_style = "";
			if (font[i][10] != "Normal") {
				font_style = font[i][10];
			}
			related_fonts[j] = "<a style='" + font_style + "' weight='" + font[i][9] + "' onclick='change_one(" + i + ");' class='fav_and_rel" + subclass + "'>" + font[i][0] + " " + font[i][9] + " " + font_style + "</a>";
			j++;
		}
	}
	if (j == 0) {
		document.getElementById("top_item_3").innerHTML = "<i>No related fonts</i>";
	}
	else {
		related_fonts.sort();
		var innerhtml = "";
		for (var k = 0; k < j; k++) {
			innerhtml += related_fonts[k];
		}
		document.getElementById("top_item_3").innerHTML = innerhtml;
	}
}





/////////////////////////////////// VIEW MODE FUNCTIONS ////////////////////////////////////////////////////////////////////
			

function view_mode (q) {
    this_mode = q;
    // move paper
    resize_paper ();
    reposition_paper ();
    
    // set button
    for (i = 0; i < 3; i++) {
	    document.getElementById("viewmode_" + i).className = "fav_and_rel";	
    }
    document.getElementById("viewmode_" + q).className = "chosen_mode";
    
    // move menu
    if (q == 0) {
	    var a = "a";
	    var y = "510px";
	    var overflow = "hidden";
	    document.getElementById("url_img").style.display = "inline";
    }
    if (q > 0) {
	    var a = "b";
	    var y = "100px";
	    var overflow = "visible";
	    document.getElementById("url").style.display = "none";
	    document.getElementById("url_img").style.display = "none";
    }
    document.getElementById("toolbar").style.top = y;
    document.getElementById("paper").style.overflow = overflow;
    for (i = 1; i < 4; i++) {
	    document.getElementById("block_" + i).className = "block_" + a;
    }
    
    // set fields
    for (i = 1; i < 7; i++) {
		if (mode[this_mode].field.indexOf(i) != -1) {
		    document.getElementById("textcontainer_" + i).style.display = "block";
		}
		else {
		    document.getElementById("textcontainer_" + i).style.display = "none";
		}
    }
    // focus field
    this_field = mode[this_mode].field[0];
    document.getElementById("textfield_" + this_field).focus();
    field_focus (this_field);
    show_colorbox("hide");
}

function field_focus (field) {		
	// only change stuff when you change from field. 
	if (field != this_field) {
		this_field = field;
		document.getElementById("textfield_" + this_field).focus();
		set_all_slides (this_field);
	}
}

function resize_paper () {
    document.getElementById("paper").style.height = mode[this_mode].height;
    document.getElementById("paper").style.width = mode[this_mode].width;
    
}

function reposition_paper () {
    document.getElementById("paper").style.left = mode[this_mode].x;
    document.getElementById("paper").style.top = mode[this_mode].y;
}	

function show_focus_lines (q) {
	for (i = 2; i < 7; i++) {
		document.getElementById("textcontainer_" + i).style.border = "1px solid #fff";
		document.getElementById("handle_" + i).style.backgroundColor = "transparent";
	}
	if (q > 1) {
		document.getElementById("textcontainer_" + q).style.outline = "0px";
		document.getElementById("textcontainer_" + q).style.border = "1px solid #E6BE00";
		document.getElementById("handle_" + q).style.backgroundColor = "#E6BE00";
	}

	if (q != this_field) {
		document.getElementById("textcontainer_" + this_field).style.border = "1px dotted #6D6F71";
	}
}

function show_chosen_lines (q) {
	for (i = 2; i < 7; i++) {
		document.getElementById("textcontainer_" + i).style.border = "1px solid #fff";
	}
	if (q > 1) {
		document.getElementById("textcontainer_" + q).style.border = "1px dotted #6D6F71";
	}
}





/////////////////////////////////// SIDE FUNCTIONS ////////////////////////////////////////////////////////////////////


function deactivate (q) {	
	if (properties[q] == 1) {
		document.getElementById("parameter_" + q).className = "box_inactive";
		properties[q] = 0;
	}
	else {
		document.getElementById("parameter_" + q).className = "sliderbox";
		properties[q] = 1;
	}
}

function close_top_item (i) {
	if (top_items[i] == 1) {
		document.getElementById("close_top_" + i).innerHTML = "&#8592;";
		document.getElementById("top_item_" + i).style.display = "none";
		document.getElementById("cover_" + i).style.display = "none";
		document.getElementById("label_" + i).style.left = "278px";
		top_items[i] = 0; 
	}
	else {
		document.getElementById("close_top_" + i).innerHTML = "X";
		document.getElementById("top_item_" + i).style.display = "block";
		document.getElementById("cover_" + i).style.display = "block";
		document.getElementById("label_" + i).style.left = "0px";
		top_items[i] = 1; 
	}
}

function drop_out (i) {
	if (drops[i] == 0) {
		document.getElementById("list_" + i).style.display = "block";
		document.getElementById("a_selected_" + i).style.backgroundImage = "url('img/arrow3.png')";
		drops[i] = 1;
	}
	else {
		document.getElementById("list_" + i).style.display = "none";
		document.getElementById("a_selected_" + i).style.backgroundImage = "url('img/arrow.png')";
		drops[i] = 0;
	}
}

function size_correction (wanted_size, original_size) {
	var size = Math.round ((wanted_size + 32) * 150 / original_size);
	return size;
}

function cmyk_to_rgb (c, m, y, k) {
	c /= 100; 
	m /= 100;
	y /= 100;
	k /= 100;
	var r = Math.round (255 * (1 - c) * (1 - k));
	var g = Math.round (255 * (1 - m) * (1 - k));
	var b = Math.round (255 * (1 - y) * (1 - k));
		
	r = r.toString(16);
	g = g.toString(16);
	b = b.toString(16);
	
	if (r.length == 1) { r = "0" + r; }
	if (g.length == 1) { g = "0" + g; }
	if (b.length == 1) { b = "0" + b; }
	
	var color = r+g+b;
	return color;
}

function show_colorbox (a) {
	if (colorbox == 1 || a == "hide") {
		document.getElementById("colorbox").style.display = "none";
		document.getElementById("color_button").src = "img/color1.png";
		colorbox = 0;
	}
	else {
		document.getElementById("colorbox").style.display = "block";
		document.getElementById("color_button").src = "img/color2.png";
		colorbox = 1;
	}
}

function count_fonts () {
	var count_fonts = 0;
	for (var i = 1; i < font.length; i++) {
		if (font[i][3] == this_font_category && font[i][10] == this_font_style) {
			count_fonts++;
		}
	}
	document.getElementById("nr_of_fonts").innerHTML = count_fonts + " fonts found";
}

function get_url () {
// for now only possible for field 1. Otherwise replace 1 with this_field
	var id = textfield[1].id;
	var link = "http://www.fontapp.org?id=" + id;
	if (document.getElementById("textfield_1").innerHTML != "The quick brown fox jumps over the lazy dog") {
		link += "&text=" + document.getElementById("textfield_1").innerHTML;
	}
	if (textfield[1].align != "left") {
		link += "&align=" + textfield[1].align;
	}
	if (textfield[1].size != 200) {
		link += "&size=" + textfield[1].size;
	}
	if (textfield[1].line != 50) {
		link += "&line=" + textfield[1].line;
	}
	if (textfield[1].color != "0,0,0,100") {
		link += "&color=" + textfield[1].color;
	}
	document.getElementById("url").style.display = "block";
	document.getElementById("url").value = link;
	document.getElementById("url").select();
}

function loading_gif () {
	document.getElementById("loading").style.display = "block";
}

function close_all () {
	document.getElementById("url").style.display = "none";
	document.getElementById("message").style.visibility = "hidden";
}
