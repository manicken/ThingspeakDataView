var RangeTypeDef = {
    Custom:0,
    Hour:1,
    Day:2,
    Week:3,
    Month:4,
  }
  window.addEventListener('load', documentLoaded);
  
  var SelectedRangeTypeIndex= 0;
  function rangeTypeChanged()
  {
    SelectedRangeTypeIndex = document.getElementById("RangeType").value;
    if (SelectedRangeTypeIndex == 0) { // custom range
      document.getElementById("rangeBackButton").hidden = true;
      document.getElementById("rangeForwardButton").hidden = true;
      document.getElementById("StartDate").removeAttribute("disabled");
      document.getElementById("EndDate").removeAttribute("disabled");
    }
    else { // all other options
      document.getElementById("rangeBackButton").hidden = false;
      document.getElementById("rangeForwardButton").hidden = false;
      document.getElementById("StartDate").setAttribute("disabled","disabled");
      document.getElementById("EndDate").setAttribute("disabled","disabled");
      endDateTime = new Date();
      startDateTime = new Date(endDateTime);
      changeDateTime(startDateTime, RangeDefs[SelectedRangeTypeIndex], -1);
      updateRangeInputBoxes();
      readData({start:startDateTime, end:endDateTime});
    }
    //console.log("Range type changed:" + SelectedRangeTypeIndex);
  }

  

  function changeHour(d,amount) {d.setHours(d.getHours()+amount)};
  function changeDay(d,amount) {d.setDate(d.getDate()+amount)};
  function changeMonth(d,amount) {d.setMonth(d.getMonth()+amount)};
  function changeWeek(d,amount) {d.setDate(d.setDate()+amount*7)}; // TODO fix this function to actually work for weeks
  /** @param {Date} d
   * @param {RangeTypeDef} rtd
   */
  function changeDateTime(d,rd,dir){
    if (rd.type == RangeTypeDef.Day) changeDay(d, rd.amount*dir);
    else if (rd.type == RangeTypeDef.Hour) changeHour(d, rd.amount*dir);
    else if (rd.type == RangeTypeDef.Week) changeWeek(d, rd.amount*dir);
    else if (rd.type == RangeTypeDef.Month) changeMonth(d, rd.amount*dir);
  }

  var RangeDefs = [
    {label:"Custom Range",  type:RangeTypeDef.Custom, amount:0}, // 0
    {label:"1 hour",     type:RangeTypeDef.Hour,   amount:1},    // 1
    {label:"2 hours",  type:RangeTypeDef.Hour,   amount:2},      // 2
    {label:"4 hours",  type:RangeTypeDef.Hour,   amount:4},      
    {label:"6 hours",  type:RangeTypeDef.Hour,   amount:6},
    {label:"8 hours",  type:RangeTypeDef.Hour,   amount:8},
    {label:"12 hours", type:RangeTypeDef.Hour,   amount:12},
    {label:"24 hours", type:RangeTypeDef.Hour,   amount:24},
    {label:"48 hours", type:RangeTypeDef.Hour,   amount:48},
    {label:"72 hours", type:RangeTypeDef.Hour,   amount:72},
    {label:"96 hours", type:RangeTypeDef.Hour,   amount:96},
    {label:"Day",           type:RangeTypeDef.Day,    amount:1},
    {label:"7 days",   type:RangeTypeDef.Day,    amount:7},
    {label:"Week",          type:RangeTypeDef.Week,   amount:1},
    {label:"30 days",  type:RangeTypeDef.Day,    amount:30},
    {label:"Month",         type:RangeTypeDef.Month,  amount:1},
  ];
  
  function getIndexOfRangeDefLabel(label)
  {
    for (var i=0;i<RangeDefs.length;i++)
      if (RangeDefs[i].label == label) return i;
      
    return -1;
  }
  function getRangeTypeStrings()
  {
    var ret = [];
    for (var i=0;i<RangeDefs.length;i++)
      ret.push(RangeDefs[i].label);
    return ret;
  }

  function documentLoaded()
  {
      //document.getElementById("log2").innerHTML = navigator.userAgent;
      document.getElementById("RangeType").innerHTML = getOptionsHtml(getRangeTypeStrings(), false, 7);
      setupDateTimePicker();
      
      if (checkIfMobileDevice() == true)
      {
        document.getElementById("backToMenu").hidden = true;
        
        document.getElementById("rangeBackButton").style.width = "100px";
        document.getElementById("rangeBackButton").style.height = "100px";
        document.getElementById("rangeBackButton").style.fontSize  = "50px";
        
        document.getElementById("rangeForwardButton").style.width = "100px";
        document.getElementById("rangeForwardButton").style.height = "100px";
        document.getElementById("rangeForwardButton").style.fontSize = "50px";
        
        document.getElementById("StartDate").style.width = "290px";
        document.getElementById("StartDate").style.height = "84px";
        document.getElementById("StartDate").style.fontSize = "20px";
        
        document.getElementById("EndDate").style.width = "290px";
        document.getElementById("EndDate").style.height = "84px";
        document.getElementById("EndDate").style.fontSize = "20px";
        
        
        document.getElementById("RangeType").style.width = "200px";
        document.getElementById("RangeType").style.height = "84px";
        document.getElementById("RangeType").style.fontSize  = "35px";

      }
      

      document.getElementById("rangeBackButton").hidden = true;
      document.getElementById("rangeForwardButton").hidden = true;
      
      var indexOfDefaultSelection = getIndexOfRangeDefLabel("24 hours");
      if (indexOfDefaultSelection != -1) {
          document.getElementById("RangeType").value = indexOfDefaultSelection;
      }
      else
      {
        document.getElementById("RangeType").value = 1; // set the first after Custom range
      }
      rangeTypeChanged();
  }

  function updateRangeInputBoxes()
  {
    flatpickr_startDate.setDate(startDateTime);
    flatpickr_endDate.setDate(endDateTime);
  }
  function addToLog2(str)
  {
    document.getElementById('log2').innerHTML += str + "<br>";
  }
  function rangeBack()
  {
    endDateTime = new Date(startDateTime);
    changeDateTime(startDateTime, RangeDefs[SelectedRangeTypeIndex], -1);
    //var log = "range back - start:" + startDateTime.toJSON() + ", end:" + endDateTime.toJSON();
    //addToLog2(log);
    updateRangeInputBoxes();
    readData({start:startDateTime, end:endDateTime});
  }

  function rangeForward()
  {
    startDateTime = new Date(endDateTime);
    changeDateTime(endDateTime, RangeDefs[SelectedRangeTypeIndex], 1);
    //var log = "range forward - start:" + startDateTime.toJSON() + ", end:" + endDateTime.toJSON();
    //addToLog2(log);
    updateRangeInputBoxes();
    readData({start:startDateTime, end:endDateTime});
  }
/** @type {Date} */
  var startDateTime = new Date();
  /** @type {Date} */
  var endDateTime = new Date();
  
  var flatpickr_startDate = undefined;
  var flatpickr_endDate = undefined;

  function setupDateTimePicker()
  {
      var options = {
          enableTime: true,
         // dateFormat: "Y-m-d H:i",
          //maxDate: "today",
          defaultDate: "today",
          time_24hr: true,
      };
      flatpickr_startDate = flatpickr("#StartDate", {
          ...options,
          onChange: function(selectedDates, dateStr, instance){
              // ...
              var d = selectedDates[0];
              if (d == undefined) return;
              startDateTime = d;
              document.getElementById('log').innerHTML = "startdate changed:<br>"+ getDateTimeUTC_urlFormat(d).replace("%20", " ");
              //console.log("startdate changed:", getDateTimeUTC_urlFormat(d));
              readData({start:startDateTime, end:endDateTime});
              
              
          },
      });
      flatpickr_endDate = flatpickr("#EndDate", {
          ...options,
          onChange: function(selectedDates, dateStr, instance){
              // ...
              var d = selectedDates[0];
              if (d == undefined) return;
              endDateTime = d;
              //console.log("enddate changed:", getDateTimeUTC_urlFormat(d));
              document.getElementById('log').innerHTML = "enddate changed:<br>"+ getDateTimeUTC_urlFormat(d).replace("%20", " ");
              readData({start:startDateTime, end:endDateTime});
          },
      });
  }

  function getTwoDigitNumber(value)
  {
    //return value;
    value = parseInt(value);
    if (value < 10) return "0" + value.toString();
    else return value.toString();
  }

  /** @param {DateTime} d */
  function getDateTimeUTC_urlFormat(d)
  {
      return d.getUTCFullYear() + "-" 
        + getTwoDigitNumber((d.getUTCMonth()+1)) + "-" 
        + getTwoDigitNumber(d.getUTCDate()) + "%20" 
        + getTwoDigitNumber(d.getUTCHours()) + ":" 
        + getTwoDigitNumber(d.getUTCMinutes()) + ":" 
        + getTwoDigitNumber(d.getUTCSeconds());
  }
  /** @param {DateTime} d */
  function getDateTime_urlFormat(d)
  {
      return d.getFullYear() + "-" 
        + getTwoDigitNumber((d.getMonth()+1)) + "-" 
        + getTwoDigitNumber(d.getDate()) + "%20" 
        + getTwoDigitNumber(d.getHours()) + ":" 
        + getTwoDigitNumber(d.getMinutes()) + ":" 
        + getTwoDigitNumber(d.getSeconds());
  }
  class StatType {
    /** @type {string} */
    name = "";
    /** @type {number} */
    maxValue = -1000;
    /** @type {Date} */
    maxDate = {};
    /** @type {number} */
    currValue = 0;
    /** @type {Date} */
    currDate = {};
    /** @type {number} */
    minValue = 1000;
    /** @type {Date} */
    minDate = {};
    StatType()
    {

    }
  }

  var latestUrl = "";
  function readData(options)
  {
      document.getElementById('status').innerHTML = "loading data...";
      
      var channelId = "2777767";
      if (options == undefined) options = {};
      options.api_read_key = undefined;
      options.resultCount = 8000;
      //options.average = 60;
      
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      if (urlParams.get("average")!=undefined) options.average = urlParams.get("average");
      if (urlParams.get("resultCount")!=undefined) options.resultCount = urlParams.get("resultCount");
      if (urlParams.get("api_read_key")!=undefined) options.api_read_key = urlParams.get("api_read_key");
      if (urlParams.get("channelId")!=undefined) channelId = urlParams.get("channelId");

      var url = `https://api.thingspeak.com/channels/${channelId}/feeds.json?`;
      
      if (options.resultCount != undefined) url += `results=${options.resultCount}`;
      if (options.api_read_key != undefined) url += `&api_key=${options.api_read_key}`;
      if (options.average != undefined) url += `&average=${options.average}`;
      if (options.start != undefined) url += `&start=${getDateTimeUTC_urlFormat(options.start)}`;
      if (options.end != undefined) url += `&end=${getDateTimeUTC_urlFormat(options.end)}`;
      console.log(url);
      latestUrl = url;
      getFile(url, function(contents) {
          var data = JSON.parse(contents);
          var labels = [];
          var dataSets = [];
          var dataCount = data.feeds.length;
          /**
           * @type {StatType[]}
           */
          var stats = [];
          for (var fi=0;fi<8;fi++) {
              var fieldName = "field"+(fi+1);
              var currValue = data.feeds[dataCount-1][fieldName];
              var label = data.channel[fieldName] + ` (${currValue})`;
              dataSets.push({label:label, data:[], borderWidth:2, lineTension:0.3});//, borderColor: '#ff8800', backgroundColor:'#88FF00'});
              stats[fi] = new StatType();
              stats[fi].name = data.channel[fieldName];
              stats[fi].currValue = currValue;
              var dateTime = new Date(data.feeds[dataCount-1].created_at);
              var dateTimeUrlFormat = getDateTime_urlFormat(dateTime).replace("%20", " ");
              stats[fi].currDate = dateTimeUrlFormat;
          }
          for (var i=0;i<dataCount;i++) {
            var dateTime = new Date(data.feeds[i].created_at);
            var dateTimeUrlFormat = getDateTime_urlFormat(dateTime).replace("%20", " ");
            labels.push(dateTimeUrlFormat);
            for (var fi=0;fi<8;fi++) {
                var value = parseFloat(data.feeds[i]["field"+(fi+1)]);
                if (value < stats[fi].minValue){ stats[fi].minValue = value; stats[fi].minDate = dateTimeUrlFormat; }
                if (value > stats[fi].maxValue){ stats[fi].maxValue = value; stats[fi].maxDate = dateTimeUrlFormat;}

                dataSets[fi].data.push(value);
            }
          }
          dataSets[7].hidden = true; // hide hydro by default
		      dataSets[4].hidden = true;
		      dataSets[2].hidden = true;
          setData(labels,dataSets);
          setStats(stats);
          document.getElementById('status').innerHTML = "";
      }, function(){
          document.getElementById('status').innerHTML = "fail to get data from thingspeak @ url:<br>" + latestUrl;
      });
  }
  var currentChart = undefined;
  function setData(labels,dataSets)
  {
      const ctx = document.getElementById('myChart');
      if (currentChart != undefined) currentChart.destroy();
      currentChart = new Chart(ctx, {
          type: 'line',
          data: {
              labels: labels,
              datasets: dataSets
          },
        options: {
            scales: {
				
                y: {
					//type: 'logarithmic',

                    position:'right',
                    beginAtZero: true,
					ticks: {
						// Include a dollar sign in the ticks
						callback: function(value, index, ticks) {
							return value + "\u00b0 C";
						},
						font: { size:30 }
					}
                }
                  /*yAxes:[
                      {
                          name:'y',
                          display:true,
                          position:'left'
                      },
                      {
                          name:'y2',
                          display:true,
                          position:'right'
                      }
                  ]*/
              },
			  plugins: {
				legend: {
					//maxWidth:400,
					// maxHeight:700,
					position: 'top',
					labels: {
						font: {
							size: 32 // Adjust this to change the font size of legend labels
						},
						boxWidth: 64,
						boxHeight:64,
						color: '#333' // Optionally, change the label color
					}
				}
        }
          }
      });
  }
  /**
   * 
   * @param {StatType[]} data 
   */
function setStats(data)
{
	var html = "";
	for (var i=0;i<data.length;i++)
	{
		html += getOneStatHtml(data[i]);
	}
	document.getElementById("tempStats").innerHTML = html;
}
/**
 * 
 * @param {StatType} values 
 */
function getOneStatHtml(values)
{
	var html = "";
	html += `<div class="collabel"></div>`;
	html += `<div class="collabel">${values.name}</div>`;
	html += `<div class="collabel">date</div>`;
	html += `<div class="rowlabel">max</div>`;
	html += `<div class="value">${values.maxValue}</div>`;
	html += `<div class="date">${values.maxDate}</div>`;
	html += `<div class="rowlabel">current</div>`;
	html += `<div class="value">${values.currValue}</div>`;
	html += `<div class="date">${values.currDate}</div>`;
	html += `<div class="rowlabel">min</div>`;
	html += `<div class="value">${values.minValue}</div>`;
	html += `<div class="date">${values.minDate}</div>`;
	
	html += `<div class="seperatorLine"></div>`;
	html += `<div class="seperatorLine"></div>`;
	html += `<div class="seperatorLine"></div>`;
  return html;
}