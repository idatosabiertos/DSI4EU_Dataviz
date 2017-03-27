function OrgPanel() {
  var self = this;

  self.create = createPanel
  self.delete = deleteOrgPanelItems

  var maxCountValue;
  var width = $(".modal-panel.map-panel").width(),
      maxScaleValue = width;

  function createPanel(org) {
    fillHeader(org);
    var _radarData = prepareData(org, "support_tags");
    var barchart1Data = prepareData(org, "focus");
    var barchart2Data = prepareData(org, "support_tags");
    var radarData = completeData(_radarData, "technology");

    var maxR = calculateMax(_radarData);
    var maxB1 = calculateMax(barchart1Data);
    var maxB2 = calculateMax(barchart2Data);
    maxCountValue = Math.max(maxR, maxB1, maxB2);

    //drawRadar(radarData, "technology");
    drawDonut(_radarData, "support_tags");
    drawBarChart(barchart1Data, "focus");
    drawBarChart(barchart2Data, "support_tags");

    function calculateMax(obj) {
      var max = d3.max(obj, function(d) {
        return d.count;
      })
      return max;
    }
  }

  function fillHeader(org) {
    $(".map-panel-container h2").html(org.name);
    $(".map-panel-container .org-link")
      .attr("href", org.url)
      .attr("target", "_blank");
    $(".map-panel-container .subtitle").html(org.linked_prjs.length+_.pluralize(" project", org.linked_prjs.length));
    $(".map-panel-container .org-type").html(org.organisation_type);
    $(".map-panel-container .scrolling p").html(org.short_description);
  }


  function prepareData(org, field) {
    var orgPrjs = org.linked_prjs;
    var fieldCountsInit = [];
    orgPrjs.forEach(function(d) {
      d[field].forEach(function(e) {
        fieldCountsInit.push({
          name: e,
          count: 0
        })
      })
    })
    var fieldCounts = _.uniqWith(fieldCountsInit, _.isEqual);
    orgPrjs.forEach(function(d) {
      d[field].forEach(function(e) {
        var el = _.find(fieldCounts, function(o) {
          return o.name == e;
        });
        el.count++;
      })
    })
    return fieldCounts;
  }
  

  function completeData(data, field) {
    var array = APP.dataset.fields[field];
    var output = [];
    array.forEach(function (d, i) {
      if (_.some(data, { "name": d.name })) {
        var el = _.find(data, function(o) {
          return o.name == d.name;
        });
        output.push({
          name: d.name,
          count: el.count
        })
      } else {
        output.push({
          name: d.name,
          count: 0
        })
      }
    })
    return output;
  }


  function drawRadar(data, field) {
    d3.select(".radar-chart").select("h3")
      .text(field)
    var numInd = APP.dataset.fields[field].length, //number of values
      theta = 2 * Math.PI / numInd,
      maxScaleValue;
    var maxCountValue = d3.max(data, function(d) {
      return d.count;
    })
    var width = $(".modal-panel.map-panel").width() * 0.8,
        height = width;
    maxScaleValue = width * 0.48;
    var rScale = d3.scaleLinear()
      .domain([0, maxCountValue])
      .range([0, maxScaleValue])
    var polarLineGenerator = d3.line()
      .x(function(d, i) {
        return (rScale(d.count) * Math.cos(i * theta));
      })
      .y(function(d, i) {
        return (rScale(d.count) * Math.sin(i * theta));
      })
    var svg = d3.select(".radar").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "radar-svg")
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var uniqData = _.uniqBy(data, 'count');
    svg.selectAll(".axis-circle")
      .data(uniqData)
      .enter()
      .append("circle")
      .attr("class", "axis-circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", function(d) {
        return rScale(d.count);
      })
    svg.selectAll(".axis-line")
      .data(APP.dataset.fields[field])
      .enter()
      .append("line")
      .attr("class", "axis-circle")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", function(d, i) {
        return (rScale(maxCountValue) * Math.cos(i * theta));
      })
      .attr("y2", function(d, i) {
        return (rScale(maxCountValue) * Math.sin(i * theta));
      })
    svg.selectAll(".radar-path")
      .data([data])
      .enter()
      .append("path")
      .attr("class", "radar-path")
      .attr("d", function(d) {
        return polarLineGenerator(d);
      })
      .attr("fill-opacity", .9)
    svg.selectAll(".radar-dots")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "radar-dots")
      .attr("cx", function(d, i) {
        return (rScale(d.count) * Math.cos(i * theta));
      })
      .attr("cy", function(d, i) {
        return (rScale(d.count) * Math.sin(i * theta));
      })
      .attr("r", 6)
      .on("mouseover", function(d) {
        var currentDot = d3.select(this);
        svg.append("text")
          .attr("class", "tooltip")
          .text(d.name + ": " + d.count)
      })
      .on("mouseout", function(d) {
        d3.select(".tooltip").remove();
      })
  }


  function drawDonut(data, field) {

    d3.select(".radar-chart").select("h3")
      .text(field)
    var width = $(".modal-panel.map-panel").width() * 0.8,
        height = width;
    var radius = Math.min(width, height) / 2;
    var donutColorScale = APP.getColorScale(field);

    var arc = d3.arc()
      .outerRadius(radius)
      .innerRadius(80)

    var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.count; });

    var svg = d3.select(".radar").append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "radar-svg")
        .append("g")
          .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

      var g = svg.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
          .attr("class", "arc");

      g.append("path")
        .style("fill", "none")
        .attr("d", arc)
        .transition()
        .duration(1000)
        .attrTween("d", arcTween)
        .style("fill", function(d) { return donutColorScale(d.data.name); })

      function arcTween(a) {
        var i = d3.interpolate({endAngle: 0}, a);
        return function(t) {
          return arc(i(t));
        };
      }

  }


  function drawBarChart(data, field) {
    data.sort(function(a, b) {
      return a.count < b.count;
    })
    var rectHeight = 8,
      rectRound = 5,
      textToBarDist = 6,
      barToBarDist = 44,
      offsetDist = 20;

    function hMult() {
      switch (field) {
        case "focus":
          return 4;
          break;
        case "support_tags":
          return 10;
          break;
        case "technology":
          return 16;
          break;
        default:
          return 4;
          break;
      }
    }
    var height = barToBarDist * hMult();
    var lScale = d3.scaleLinear()
      .domain([0, maxCountValue])
      .range([0, maxScaleValue - 16]);
    var barColorScale = APP.getColorScale(field);
    var barchartDiv = d3.select(".map-panel-container .scrolling").append("div")
      .attr("class", "bar-chart")
    barchartDiv.append("h3")
      .text(field)
    var barchartItems = barchartDiv.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("class", "barchart-svg")
      .selectAll(".bar-chart-item." + field)
      .data(data)
      .enter()
      .append("g")
      .attr("class", "bar-chart-item " + field)
    barchartItems.append("text")
      .attr("class", "bar-chart-caption")
      .attr("x", 0)
      .attr("y", function(d, i) {
        return offsetDist + i * barToBarDist;
      })
      .attr("width", width)
      .text(function(d) {
        return d.name + ": " + d.count + _.pluralize(" project", d.count);
      })
    barchartItems.append("rect")
      .attr("x", 0)
      .attr("y", function(d, i) {
        return offsetDist + textToBarDist + i * barToBarDist;
      })
      .attr("width", function(d) {
        return lScale(d.count);
      })
      .attr("height", rectHeight)
      .attr("rx", rectRound)
      .attr("fill", function (d) {
        if (field == "focus") return barColorScale(d.name);
        else return "white";
      })
  }


  function deleteOrgPanelItems() {
    d3.select(".radar-svg").remove();
    d3.selectAll(".bar-chart").remove();
  }


}