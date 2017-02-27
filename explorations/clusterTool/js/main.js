d3.queue()
  .defer(d3.json, '/data/organisations.json')
  .defer(d3.json, '/data/projects.json')
  .await(dataprocess);



/* returns a list of all the field argument unique values */
function allValues(data, field) {
	var temp = [];
  data.forEach(function(d){
  	if (d[field].length > 1) {
  		d[field].forEach(function(e){
  			temp.push(e);
  		});
  	}
  })
  var uniqueTemp = _.uniq(temp);
  //console.log(uniqueTemp);
  return uniqueTemp;
}


function dataprocess(error, orgData, prjData) {
	if (error) throw error;

	//console.log(prjData);
  
  var mainNestField = "linked_organisation_ids";

  var valuesArray = allValues(prjData, mainNestField);

  var mainNestArray = [];

  valuesArray.forEach(function (d) {
  	mainNestArray.push({
  		key: d,
  		values: []
  	});
  });
	
	mainNestArray.forEach(function (f) {
		//selectedPrj = Prj with f.key value present in mainNestField array
		var selectedPrj = prjData.filter(function (d) {
			return d[mainNestField].includes(f.key);
		})
		f.values = (selectedPrj);
	})

	var sortedMainNestArray = mainNestArray.sort(function (a,b) { return b.values.length-a.values.length; });
	var maxMainNestArray = sortedMainNestArray[0].values.length;
	console.log(maxMainNestArray);
	console.log(sortedMainNestArray);

	var w = 200,
			h = 200;
	
	var MainNestArrayScale = d3.scaleSqrt()
		.domain([1, maxMainNestArray])
		.range([1, w/2-10]);

	var mainNestSvgs = d3.select("body").selectAll("svg")
		.data(sortedMainNestArray)
		.enter()
		.append("svg")
			.attr("width", w)
			.attr("height", h)

	var mainNestBubbles = mainNestSvgs
		.append("circle")
			.attr("cx", w/2)
			.attr("cy", h/2)
			.attr("r", function (d) {
				return MainNestArrayScale(d.values.length);
			})
			.attr("fill", "salmon")

	var mainNestCaptions = mainNestSvgs
		.append("text")
			.attr("x", w/2)
			.attr("y", h-30)
			.attr("fill", "black")
			.attr("font-size", ".65rem")
			.attr("text-anchor", "middle")
			.text(function (d) {
				return d.key;
			})

	var mainNestNumbers = mainNestSvgs
		.append("text")
			.attr("x", w/2)
			.attr("y", h/2+5)
			.attr("fill", "black")
			.attr("font-size", ".65rem")
			.attr("text-anchor", "middle")
			.text(function (d) {
				return d.values.length;
			})
	
}