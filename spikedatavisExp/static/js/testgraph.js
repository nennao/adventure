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

	var unique_rec_set = new Set();

	// clean the data
    recData.forEach(function(d) { // if no substage then delete, or filter out later... after calculating the 'other' difference though
        for (var i=0; i<numberColumns.length; i++) {
            d[numberColumns[i]] = +d[numberColumns[i]];
        }
		unique_rec_set.add(d["unique_id"]);
    });

    //Create a Crossfilter instance
    var ndx = crossfilter(recData);


    //Define Dimensions
    var uniqueRecDim = ndx.dimension(function(d) {
        return d["unique_id"];
    });

    var numberIdDim = ndx.dimension(function(d) {
        return d["number_id"];
    });

	var stageDim = ndx.dimension(function(d) {
        return d["stage"];
    });


    //Calculate metrics
    var uniqueTimeGroup = uniqueRecDim.group().reduceSum(function(d) {return d["run_time_sec"]}); // add 'other' to rec_time_sec! (run() - everything else())
    var numberGroup = numberIdDim.group().reduceSum(function(d) {return d["run_time_sec"]}); // add 'other' to rec_time_sec! (run() - everything else())
	var averageTime = ndx.groupAll().reduceSum(function(d) {return d["run_time_sec"]});
    var stageTimeGroup = stageDim.group().reduceSum(function(d) {return d["run_time_sec"]});


    //Charts
    var uniqueTimeChart = dc.barChart("#unique-time-chart");
    var averageND = dc.numberDisplay("#average-runtime-nd");
    var stageChart = dc.pieChart("#stage-pie-chart");

	console.log('checkpoint');
    uniqueTimeChart
        .width(800)
        .height(250)
        // .x(d3.scale.ordinal())
        // .xUnits(dc.units.ordinal)
        .x(d3.scale.linear().domain([0.5, 3.5]))
        .centerBar(true)
        .yAxisLabel('time (s)')
        .dimension(numberIdDim)
        // .barPadding(0.1)
        // .outerPadding(0.05)
        .group(numberGroup);

        // .width(800)
        // .height(250)
        // .margins({top: 10, right: 50, bottom: 20, left: 50})
        // .dimension(uniqueRecDim)
        // .group(uniqueTimeGroup)
        // .transitionDuration(1000)
        // .centerBar(true)
        // .x(d3.scale.ordinal());

	console.log('checkpoint2');

	averageND
        .formatNumber(d3.format("d"))
        .group(averageTime)
        .valueAccessor(function(d) {return d})
        .transitionDuration(750)
        .formatNumber(d3.format(".2f"));


	stageChart
        .ordinalColors(['#66c2a5','#fc8d62','#8da0cb','#e78ac3','#a6d854','#ffd92f','#e5c494'])
        .height(250)
        .radius(110)
        .innerRadius(10)
        .transitionDuration(500)
        .dimension(stageDim)
        .group(stageTimeGroup);

    dc.renderAll();
}

makeGraphs(null, myData);