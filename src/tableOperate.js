/*************************************表格格式设置******************************************************/
//set td width, return width:*px/null
var setTdWidth = function(width){
    if(width){
        return 'width="' + width + '"';
    }else{
        return '';
    }
};

//set category, return j_http/j_percentage/j_time/''
var setCategory = function(json_columns, fieldName){
    var type = '';
    $.each(json_columns, function(index, data){
        if(data.field === fieldName){
            if(data.category === 'url'){
                type = ' j_url';
            }else if(data.category === 'percentage'){
                type = ' j_percentage';
            }else if(data.category === 'time'){
                type = ' j_time';
            }
        }
    });
    return type;
};

var setTime = function(){
    var timeObj = $('.j_time');
    timeObj.each(function(){
        $(this).html($(this).html() + 's');
    });
};

var setPercentage = function(){
    var timeObj = $('.j_percentage');
    timeObj.each(function(){
        $(this).html($(this).html() + '%');
    });
};

var setFormat = function(){
    setTime();
    setPercentage();
};

/*************************************表格内容的添加******************************************************/
//read JSON.columns, return thead
var tableHeader = function(json){
    var theadData = '<thead><tr class="j_thead-tr">';
    $.each(json, function(index, data){
        if(data.sortable === 'true'){
            theadData += '<td class="j_'+ data.field + ' sort-td j_sort-td" ' + setTdWidth(data.width) +'>' + data.name + '<div><span class="sort-up"></span><span class="sort-down"></span></div></td>';
        }else{
            theadData += '<td class="j_'+ data.field + '" ' + setTdWidth(data.width) + '>' + data.name + '</td>';
        }
    });
    theadData += '</tr></thead>';
    return theadData;
};

//read JSON.data, return tbody
var tableBody = function(json){
    var tbodyData = '<tbody>';
    $.each(json.data, function(index, data){
        tbodyData += '<tr>';
        $.each(data, function(index_1, data_1){
            tbodyData += '<td class="j_' + index_1 + setCategory(json.columns, index_1) + '">' + data_1 + '</td>';
        });
        tbodyData += '</tr>';
    });
    tbodyData += '</tbody>';
    return tbodyData;
};

/*************************************排序（归并）******************************************************/
var mergeDesc = function (left, right, field){
    var result=[];
    while(left.length>0 && right.length>0){
        if(parseInt(left[0][field]) > parseInt(right[0][field])){
            result.push(left.shift());
        }else{
            result.push(right.shift());
        }
    }
    return result.concat(left).concat(right);
};

var mergeAsc = function (left, right, field){
    var result = [];
    while(left.length>0 && right.length>0){
        if(parseInt(left[0][field]) < parseInt(right[0][field])){
            result.push(left.shift());
        }else{
            result.push(right.shift());
        }
    }
    return result.concat(left).concat(right);
};

var mergeSort = function (json, field, type){
    if(json.length === 1){
        return json;
    }
    var middle = Math.floor(json.length/2);
    var left=json.slice(0,middle);
    var right=json.slice(middle);
    if(type === 'desc'){
        return mergeDesc(mergeSort(left, field, 'desc'), mergeSort(right, field, 'desc'), field);
    }else{
        return mergeAsc(mergeSort(left, field, 'asc'), mergeSort(right, field, 'asc'), field);
    }
};

/*************************************重置表格******************************************************/
var tableResetOperation = function(json){
    $('tbody').remove();
    $('table').append(tableBody(json));
    sortOperation(json);
    setFormat();
};


var resetTableBody = function(array, jsonColumns){
    $('tbody').remove();
    var tbodyData = '<tbody>';
    for(var i=0; i<array.length; i++){
        tbodyData += '<tr>';
        $.each(array[i], function(index, data){
            tbodyData += '<td class="j_' + index + setCategory(jsonColumns, index) + '">' + data + '</td>';
        });
        tbodyData += '</tr>';
    }
    tbodyData += '</tbody>';
    return tbodyData;
};

var sort = function(html, json, type){
    var fieldName =  html.split('<div>')[0];
    var field = '';
    $.each(json.columns, function(index, data){
        if(fieldName === data.name){
            field = data.field;
            return false;
        }
    });
    var wrapperMainChart = $('.j_wrapper-main-chart');
    if(wrapperMainChart.find('.j_error-show').size() === 1){
        $('.j_error-show').remove();
    }
    if(type === 'asc'){
        $('table').append(resetTableBody(mergeSort(json.data, field, 'asc'), json.columns));
        setFormat();
    }else if(type === 'desc'){
        $('table').append(resetTableBody(mergeSort(json.data, field, 'desc'), json.columns));
        setFormat();
    }
};

/*************************************事件绑定******************************************************/
//set sort operation
var sortOperation = function(json){
    var tableHead = $('.j_thead-tr');
    tableHead.find('.sort-active').removeClass('sort-active');
    $(document).off('click', '.j_sort-td');
    $(document).on('click', '.j_sort-td', function(e){
        var targetEle = $(e.target);
        if(targetEle.find('.sort-active').size() === 0){
            //还没有排序的内容
            tableHead.find('.sort-up').removeClass('sort-active');
            tableHead.find('.sort-down').removeClass('sort-active');
            targetEle.find('.sort-up').addClass('sort-active');
            sort(targetEle.html(), json, 'asc');
        }else{
            //已经有排序的内容了，后面判断后面是什么排序
            if(targetEle.find('.sort-up').hasClass('sort-active')){
                //改变成向下排序
                targetEle.find('.sort-up').removeClass('sort-active');
                targetEle.find('.sort-down').addClass('sort-active');
                sort(targetEle.html(), json, 'desc');
            }else if(targetEle.find('.sort-down').hasClass('sort-active')){
                //改变成向上排序
                targetEle.find('.sort-down').removeClass('sort-active');
                targetEle.find('.sort-up').addClass('sort-active');
                sort(targetEle.html(), json, 'asc');
            }
        }
    });
};

var setTimePicker = function(){
    var formDateTime = $('.j_timePicker');
    var date = new Date();
    var now = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    formDateTime.datetimepicker({
        format: 'yyyy-mm-dd',
        weekStart: 1,
        autoclose: true,
        startView: 2,
        minView: 2,
        forceParse: true,
        language: 'zh-CN'
    });

    formDateTime.val(now);
};

var setWorkBreak = function(){
    $(document).on('click', 'tbody tr td', function(){
        for(var i=0; i<$(this).parent().children().length; i++){
            $(this).parent().children(':eq('+ i +')').toggleClass('word-wrap');
        }
    });
};

var setScroll = function(){
    $(window).on('scroll', function(){
        var scrollToTop = $('.j_scroll-to-top');
        var scrollHeight = document.documentElement.scrollTop?document.documentElement.scrollTop:document.body.scrollTop;
        if(scrollHeight >= 75){
            $('.j_wrapper-nav ul').addClass('scroll-ul');
            if(scrollHeight >= 150){
                scrollToTop.css('display', 'block');
                if(scrollHeight >= 260){
                    scrollToTop.css('opacity', '1');
                }else{
                    scrollToTop.css('opacity', '0');
                }
            }else{
                scrollToTop.css('display', 'none');
            }
        }else{
            $('.j_wrapper-nav ul').removeClass('scroll-ul');
        }
    });

    $(document).on('click', '.j_scroll-to-top', function(){
        $('html,body').animate({scrollTop: '0px'}, 800);
    });
};

var setMainNavTimeRequest = function(url){
    $('.j_wrapper-main-nav-time').on('click', 'li', function(){
        if(!$(this).hasClass('.active')){
            $(this).parent().find('.active').removeClass('active');
            $(this).addClass('active');
        }
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                time: $(this).data('time')
            },
            success: function (json) {
                var wrapperMainChart = $('.j_wrapper-main-chart');
                if(wrapperMainChart.find('.j_error-show').size() === 1){
                    $('.j_error-show').remove();
                }
                tableResetOperation(json);
            },
            error: function(json){
                var wrapperMainChart = $('.j_wrapper-main-chart');
                if(wrapperMainChart.find('.j_error-show').size() === 0){
                    $('.j_wrapper-main-chart table tbody').remove();
                    var errorStr = '<div class="j_error-show error-show">本页面无数据</div>';
                    wrapperMainChart.append(errorStr);
                    sortOperation(json);
                }
            }
        });
    });
};

var setTimePickerRequest = function(url){
    $('.j_timePicker').on('change', function(){
        $('.j_wrapper-main-nav-time').find('.active').removeClass('active');
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                time: $(this).val()
            },
            success: function (json) {
                var wrapperMainChart = $('.j_wrapper-main-chart');
                if(wrapperMainChart.find('.j_error-show').size() === 1){
                    $('.j_error-show').remove();
                }
                tableResetOperation(json);
            },
            error: function(json){
                var wrapperMainChart = $('.j_wrapper-main-chart');
                if(wrapperMainChart.find('.j_error-show').size() === 0){
                    $('.j_wrapper-main-chart table tbody').remove();
                    var errorStr = '<div class="j_error-show error-show">本页面无数据</div>';
                    wrapperMainChart.append(errorStr);
                    sortOperation(json);
                }
            }
        });
    });
};

var setPortPickerRequest = function(url){
    $('.j_port-picker').on('click', 'input[name="portPicker"]', function(){
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: {
                port: $(this).val()
            },
            success: function (json) {
                var wrapperMainChart = $('.j_wrapper-main-chart');
                if(wrapperMainChart.find('.j_error-show').size() === 1){
                    $('.j_error-show').remove();
                }
                tableResetOperation(json);
            },
            error: function(json){
                var wrapperMainChart = $('.j_wrapper-main-chart');
                if(wrapperMainChart.find('.j_error-show').size() === 0){
                    $('.j_wrapper-main-chart table tbody').remove();
                    var errorStr = '<div class="j_error-show error-show">本页面无数据</div>';
                    wrapperMainChart.append(errorStr);
                    sortOperation(json);
                }
            }
        });
    });
};

/*************************************请求数据初始化表格******************************************************/
var tableOperation = function(json){
    var tableData = '<table>' + tableHeader(json.columns) + tableBody(json) + '</table>';
    $('.j_wrapper-main-chart').append(tableData);
    sortOperation(json);
    setWorkBreak();
    setFormat();
};

var dataAnalysisTable = function(url){
    $.ajax({
        url: url,
        type: 'POST',
        dataType: 'json',
        success: function (json) {
            var wrapperMainChart = $('.j_wrapper-main-chart');
            if(wrapperMainChart.find('.j_error-show').size() === 1){
                $('.j_error-show').remove();
            }
            tableOperation(json);
        },
        error: function(){
            var wrapperMainChart = $('.j_wrapper-main-chart');
            if(wrapperMainChart.find('.j_error-show').size() === 0){
                $('tbody').remove();
                var errorStr = '<div class="j_error-show error-show">本页面无数据</div>';
                wrapperMainChart.append(errorStr);
            }
        }
    });
};