// queue()
//     .defer(d3.json, '/data')
//     .await(makeGraphs);


function makeGraphs(error, recData) {
    if (error) {
        console.error("makeGraphs error on receiving dataset:", error.statusText);
        throw error;
    }

    var numberColumns = [
        "run_time_sec"
    ];
    var dateColumns = {
        "date": d3.time.format("%Y-%m-%d"),
        "time": d3.time.format("%H:%M:%S.%L"),
        "cobdate": d3.time.format("%Y%m%d"),
        "timestamp": d3.time.format("%Y%m%d_%H%M%S")
    };
	var unique_rec_set = new Set();
	
	// clean the data
    recData.forEach(function(d) { // if no substage then delete, or filter out later... after calculating the 'other' difference though
        for (var i=0; i<numberColumns.length; i++) {
            d[numberColumns[i]] = +d[numberColumns[i]];
        }

        for (var key in dateColumns) {
            d[key] = dateColumns[key].parse(d[key]);
        }
		unique_rec_set.add(d["unique_id"]);
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(recData);


    //Define Dimensions
    var uniqueRecDim = ndx.dimension(function(d) {
        return d["unique_id"];
    });
	
	var stageDim = ndx.dimension(function(d) {
        return d["stage"];
    });
	
	var substageDim = ndx.dimension(function(d) {
        return d["substage"];
    });
	
	var recNameDim = ndx.dimension(function(d) {return d["rec_name"];});
	var subrecNameDim = ndx.dimension(function(d) {return d["subrec_name"];});
	var profileDim = ndx.dimension(function(d) {return d["profile"];});
	var cobdateDim = ndx.dimension(function(d) {return d["cobdate"];});
	
	
    //Calculate metrics
    var uniqueTimeGroup = uniqueRecDim.group();//.reduceSum(function(d) {return d["run_time_sec"]}); // add 'other' to rec_time_sec! (run() - everything else())
	var averageTime = ndx.groupAll().reduceSum(function(d) {return d["run_time_sec"]});
    var stageTimeGroup = stageDim.group().reduceSum(function(d) {return d["run_time_sec"]});
	var substageTimeGroup = substageDim.group().reduceSum(function(d) {return d["run_time_sec"]});
	
	var recNameGroup = recNameDim.group()
	var subrecNameGroup = subrecNameDim.group()
	var profileGroup = profileDim.group()
	var cobdateGroup = cobdateDim.group()
	
	
    //Charts
    var uniqueTimeChart = dc.barChart("#unique-time-chart");
    var averageND = dc.numberDisplay("#average-runtime-nd");
    var stageChart = dc.pieChart("#stage-pie-chart");
    var substageChart = dc.pieChart("#substage-pie-chart");
	var selectRecName = dc.selectMenu('#selectRecName'),
		selectSubrecName = dc.selectMenu('#selectSubrecName'),
		selectProfile = dc.selectMenu('#selectProfile'),
		selectCobdate = dc.selectMenu('#selectCobdate');

	console.log('checkpoint')
    uniqueTimeChart
        .width(800)
        .height(250)
        .margins({top: 10, right: 50, bottom: 20, left: 50})
        .dimension(uniqueRecDim)
        .group(uniqueTimeGroup)
        .transitionDuration(1000)
        .centerBar(true)
        .x(d3.scale.linear().domain([0, unique_rec_set.size+1]))
		.xAxisLabel("rec")
		.yAxisLabel("time (s)")
        .brushOn(false)
	
	console.log('checkpoint2')
	
	averageND
        .formatNumber(d3.format("d"))
        .group(averageTime)
        .valueAccessor(function(d) {return d})
        .transitionDuration(750)
        .formatNumber(d3.format(".2"));
	
	
	stageChart
        .ordinalColors(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
        .height(250)
        .radius(110)
        .innerRadius(10)
        .transitionDuration(1500)
        .dimension(stageDim)
        .group(stageTimeGroup)
	
	
	substageChart
        .ordinalColors(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
        .height(250)
        .radius(110)
        .innerRadius(10)
        .transitionDuration(1500)
        .dimension(substageDim)
        .group(substageTimeGroup)
	 
	
	selectRecName
		.dimension(recNameDim)
		.group(recNameGroup)
		.multiple(true);
	selectSubrecName
		.dimension(subrecNameDim)
		.group(subrecNameGroup)
		.multiple(true);
	selectProfile
		.dimension(profileDim)
		.group(profileGroup)
		.multiple(true);
	selectCobdate
		.dimension(cobdateDim)
		.group(cobdateGroup)
		.multiple(true);
		

    dc.renderAll();
}

makeGraphs(null, myData);