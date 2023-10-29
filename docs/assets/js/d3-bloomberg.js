var dispatch = d3.dispatch(
    'init',
    'voronoi',
    'highlightLine', // Country is hovered
    'tooltip', // Country is hovered
    'mouseoutLine' // Country is mouse out
  )

  var gs = gscroll()
      .container(d3.select('#inner-content'))
      .fixed(d3.selectAll('.sticky-share'))

  gs(d3.select('#inner-content'))

  d3.select("#show-voronoi")
    .property("disabled", false)
    .on("change",function(d) {
      dispatch.voronoi(this.checked)
    })

  var ƒ = function(str){ return function(obj){ return str ? obj[str] : obj; }}

  var chart
  var innerContent = d3.select('#inner-content')

  function getChartSize() {
    var w,h
    if(window.innerWidth>600){
      w =.90*parseInt(innerContent.style('width'))
      h = (window.innerHeight>600) ? .8*window.innerHeight : 600
    }else{
      w = .95*parseInt(innerContent.style('width')),
      h = (window.innerHeight>600) ? .8*window.innerHeight : 600
    }
    return  [w,h]
  }

  var chartWidth = getChartSize()[0]
  var chartHeight = getChartSize()[1]
  var showTwentyFirst

  queue()
      .defer(d3.json, "data.json")
      .await(ready);

  function ready(error, data) {
    d3.select('#refreshbtn').on('click', function(){
      hasAnimated = true
      if(!d3.select('#graphic-button-container').classed('disabled')) restart()
    })
    d3.select('#animationLink').on('click', function(){
      hasAnimated = true
      if(window.innerWidth>568){
        window.scrollTo(0,d3.select('#animationLink').node().offsetTop + 210)
      }else{
        window.scrollTo(0,d3.select('#animationLink').node().offsetTop)
      }
      d3.select('.scroll').style({
        opacity:0,
        'z-index':-1
      })
      d3.select('#graphic-button-container').style('opacity',1)
      restart()
    })

    d3.selectAll('.graphic-button')
      .on("click",function(d) {
        if(!chart.isAnimating()){
          d3.selectAll('.graphic-button').classed('graphic-button-active',false)
          var _this = d3.select(this)
          _this.classed('graphic-button-active',true)

          if(_this.attr('id') == 'records'){
            showRecords()
          }else if(_this.attr('id') == 'all'){
            showAll()
          }
        }
      })

    chart = multiLine('#chart', 'prese', data, chartWidth, chartHeight)
    var y = chart.y()
    var x = chart.x()
    var duration = 150
    var movingline
    var yearDiv
    var recordAvg
    var recordDiv
    var maxRecordDiv
    var newRecordDiv
    var valueDiv
    var maxValueDiv
    var maxValueDiv
    var opac = .8
    var topMax = chart.height()/2
    var activeTab = d3.select('.graphic-button-active').attr('id')
    //last year's values
    var oldValues = d3.range(12).map(function(){ return 0 })

    var color = d3.scale.linear()
    var min = chart.yDomain()[0]
    var max = chart.yDomain()[1]
    var mid = (min + max)/2
    // color
    //   .domain([min, mid, mid, max])
    //   .range(["hsl(221, 100%, 50%)",d3.hsl('183, 100%, 50%'), d3.hsl('34, 100%, 50%'), "hsl(0, 100%, 50%)"])
    //   .interpolate(d3.interpolateHsl)

    // color
    //   .domain([min, max])
    //   .range(["hsl(193, 100%, 60%)", "hsl(359, 96%, 51%)"])
    //   .interpolate(d3.interpolateHsl)

    color
      .domain([min, max])
      .range(["hsl(181, 96%, 57%)", "hsl(359, 96%, 51%)"])
      // .interpolate(d3.interpolateHsl)
    chart.color(color)
    yearDiv = d3.select('.chart-container').append('div').attr('id','year')
    yearDiv.append('div').classed('tt-header', true)
    yearDiv.append('div').classed('record-year',true)

    recordDiv = d3.select('.chart-container').append('div').classed('axis tt-year record',true)
    valueDiv = d3.select('.chart-container').append('div').classed('axis tt-value record',true)
    maxValueDiv = d3.select('.chart-container').append('div').classed('axis tt-value record max',true)
    maxRecordDiv = d3.select('.chart-container').append('div').classed('axis tt-year record max',true)

    newRecordDiv = d3.select('.chart-container').append('div').classed('axis max-year-label',true)
    .text('New Record')
    .attr('opacity', 0)



    var hasAnimated = false
    chart.isAnimating(false)
    var dataExtent = [data[0].year,data[data.length-1].year]
    var yearToShow = data[data.length-1].year
    var dataRecords = []
    var means = []
    var maxMean = 0
    _.each(data, function(d,i) {
      data[i].value = parseFloat(d3.mean(d3.values(d.values.map(function(d){return d.value}))).toFixed(2))
      data[i].key = d.values[0].key
      data[i].color = color(d.values[0].value)
      means.push(data[i].value)

      if(maxMean != d3.max(means)) {
        maxMean = d3.max(means)
        dataRecords.push(d)
      }
    })
    means = []


    data.sort(function(a,b) {
      return a.value-b.value
    })
    _.each(data, function(d,i) {
      data[i].rank = data.length-i
    })
    data.sort(function(a,b) {
      return parseInt(a.year) - parseInt(b.year)
    })

    showRecords()
    d3.select('.tt-header').html('')

    chart.scheduleFn(function(){
      if(hasAnimated) animateLines()
    },duration)

    dispatch.on('mouseoutLine', function(d) {
      chart.el().selectAll('.color-line.line-'+d.year)
        .classed('highlighted-path',false)
        .attr('opacity', opac)

      chart.el().selectAll('.gray-line.line-'+d.year)
        .attr('opacity', opac)
        .attr('stroke', '#aaa')

      d3.selectAll('.tooltip').style('opacity',0)

      chart.el().selectAll('.color-line')
        .attr('opacity', 0)


      chart.el().selectAll('.avg-line')
        .attr('opacity', 0)

      chart.el().selectAll('.gray-line')
        .attr('opacity', function(dd){
          return (d3.select(this).classed('max'))? 1 : .2
        })
        .classed('highlighted-path',false)

      if(d3.select('.graphic-button-active').attr('id') == 'records'){
        chart.el().selectAll('.color-line.record')
          .attr('opacity', function(dd){
            return (d3.select(this).classed('max'))? 1 : .4
          })

        chart.el().selectAll('.avg-line.record.max')
          .attr('opacity', 1)

      }else if(d3.select('.graphic-button-active').attr('id') == 'all'){
        chart.el().selectAll('.gray-line')
          .attr('opacity', opac)

        chart.el().selectAll('.color-line.century')
          .attr('opacity', function(dd){
            return (d3.select(this).classed('max'))? 1 : .4
          })
      }

      recordDiv.style({
          opacity: 0
        })

      valueDiv.style({
          opacity: 0
        })
    })

    dispatch.on('highlightLine', function(d) {

      chart.el().selectAll('.gray-line')
        .attr('opacity', function(dd){
          return (d3.select(this).classed('max'))? opac : .1
        })

      if(d3.select('.graphic-button-active').attr('id') == 'records'){
        chart.el().selectAll('.color-line.record')
          .attr('opacity', function(dd){
            return (d3.select(this).classed('max'))? 1 : .4
          })

        chart.el().selectAll('.avg-line')
          .attr('opacity', function(dd){
            return (d3.select(this).classed('max'))? 1 : 0
          })
      }else if(d3.select('.graphic-button-active').attr('id') == 'all'){
        chart.el().selectAll('.color-line.century')
          .attr('opacity', function(dd){
            return (d3.select(this).classed('max'))? 1 : .2
          })

        chart.el().selectAll('.avg-line')
          .attr('opacity', 0)

        chart.el().selectAll('.gray-line')
          .attr('opacity', .4)
      }

      chart.el().selectAll('.color-line.line-'+d.year)
        .classed('highlighted-path',true)
        .attr('opacity', 1)

      chart.el().selectAll('.gray-line.line-'+d.year)
        .classed('highlighted-path',true)
        .attr('opacity', opac)

      chart.el().selectAll('.avg-line.line-'+d.year)
        .attr('opacity', opac)
        .attr('stroke-dasharray', '2,5')
        .attr('stroke', function(d) {return color(d.values[0].value)})

      var clip = chart.el().select('defs').select('#line-'+d.year)
    })

    dispatch.on('tooltip', function(d) {
      d3.selectAll('.tooltip').style('display','none')

      if(d.key>0){
        var pos = chart.el().node().getBoundingClientRect()
        var tooltip = d3.select('.tooltip.'+chart.id())
        var mons = getMonthData(parseInt(d.key))
        var yrs = getMonthData(parseInt(0))

        mons.sort(function(a, b){
            if(parseFloat(a.value) > parseFloat(b.value)) return -1;
            if(parseFloat(a.value) < parseFloat(b.value)) return 1;
            return 0;
        })

        yrs.sort(function(a, b){
            if(parseFloat(a.value) > parseFloat(b.value)) return -1;
            if(parseFloat(a.value) < parseFloat(b.value)) return 1;
            return 0;
        })

        tooltip
          .html('')

        if(d.id == mons[0].id){
          // tooltip.select('.tt-mon').html()
          tooltip.append('div').text('Hottest').style({ color: d.color })
        }

        tooltip.append('div').classed('tt-mon', true).text(months[d.key-1])
            .style({ color: (d.id == mons[0].id)?d.color:'#767676' })

        tooltip.append('div').classed('tt-year', true).text(d.year)

        tooltip
          .style({
            opacity: 1,
            display: 'block'
          })
          .select('.tt-year').style({ color: '#767676' })

        tooltip.append('div').classed('tt-name', true).html(((d.value>0)?'+':'') + d.value+'&deg;F').style({ color: d.color })


        // if(d.year == yrs[0].year){
        //   tooltip.append('div').classed('tt-ry', true).text('Record year').style({ color: d.color })
        // }

        var tt = tooltip.node().getBoundingClientRect()

        tooltip.style({
          left: x(d.key) + (chart.margin()).left - tt.width/2 + 'px',
          top: y(d.value) + (chart.margin()).top - tt.height -15 +  'px',
        })
      }
      var yearData = getYearData(d.year)

      recordDiv.text(yearData[0].value+'˚F')
        .style({
          opacity: 1,
          color: yearData[0].color,
          'background-color': '#fff',
          position: 'absolute',
          left: x(1) +'px',
          top: y(yearData[0].value)+30 +'px',
        })

      valueDiv.text(yearData[0].year)
        .style({
          opacity: 1,
          color: yearData[0].color,
          'background-color': '#fff',
          position: 'absolute',
          left: (window.innerWidth<900)?x(13)+10+'px':x(13)+10 +'px',
          top: y(yearData[0].value)+30 +'px',
        })
        .append('div')
          .classed('rank',true)
          .text('#'+yearData[0].rank)
          .style('opacity',(activeTab=='all')?1:0)
          .style('height',(activeTab=='all')?'auto':'0px')
    })

    function getYearData (year) {
      return (chart.data()).filter(function(d){return d.year == year})
    }

    function getMonthData (m) {
      return (chart.data()).map(function(d){return d.values[m]})
    }

    function restart () {
      tracker('load', 'reloaded animation')

      d3.selectAll('.graphic-button')
        .classed('graphic-button-active',false)

      d3.select('#records').classed('graphic-button-active',true)

      chart.updateVoronoi(dataRecords)

      chart.isAnimating(true)
      yearToShow = 1880
      means = []
      dataRecords = []
      maxMean = 0
      d3.selectAll('path')
          .attr('opacity', 0)
          .classed('record',false)

      d3.selectAll('#year').remove()
      d3.selectAll('.movingline').remove()
      d3.selectAll('.tt-value.record').remove()
      d3.selectAll('.tt-year.record').remove()
      d3.selectAll('.max-year-label').remove()

      d3.select('.axis--x').selectAll('path')
          .attr('opacity', 1)

      d3.select('.century-avg').select('path')
        .attr('opacity', 0)
    }

    function animateLines() {
      activeTab = d3.select('.graphic-button-active').attr('id')
      if(chart.isAnimating() && yearToShow<data[data.length-1].year+1){

        d3.select('#graphic-button-container')
          .classed('disabled',true)

        d3.selectAll('.tooltip').style({
          display: 'none',
          opacity:0
        })
        var yearData = getYearData(yearToShow)

        var obj = d3.selectAll('.color-line.line-'+yearToShow).data()[0]
        obj.year = yearToShow
        // obj.month = 0
        obj.value = parseFloat(d3.mean(d3.values(obj.values.map(function(d){return d.value}))).toFixed(2))
        means.push(obj.value)
        obj.key = obj.values[0].key
        obj.color = color(obj.values[0].value)

        if(yearToShow == data[0].year){
          yearDiv = d3.select('.chart-container').append('div').attr('id','year')
          yearDiv.append('div').classed('tt-header', true)
          yearDiv.append('div').classed('record-year',true)

          recordDiv = d3.select('.chart-container').append('div').classed('axis tt-year record',true)
          valueDiv = d3.select('.chart-container').append('div').classed('axis tt-value record',true)
          maxValueDiv = d3.select('.chart-container').append('div').classed('axis tt-value record max',true)
          maxRecordDiv = d3.select('.chart-container').append('div').classed('axis tt-year record max',true)

          newRecordDiv = d3.select('.chart-container').append('div').classed('axis max-year-label',true)
          .text('New Record')
          .attr('opacity', 0)

          movingline = d3.select('#prese').select('g').append("g").attr("class", "movingline")

          movingline.selectAll('path').data(yearData).enter()
            .append('path')
            .attr("d", function(d,i) {
                d.line = this;
                var line =chart.line()
                return line(d.values.slice(1,13))
            })
            .attr('class',function(d) {return 'line-'+d.year+' moving-line'})
            .attr('stroke', function(d,i) {return color(d.values[0].value)})
            .attr('stroke-width', '3px')
            .attr('opacity', 1)
        }

        //this year's values
        var curValues = yearData[0].values.map(ƒ('value')).slice(1, 13)

        movingline.selectAll('path').data(yearData)
          .transition().duration(duration)
          .ease('linear')
          .attr("d", function(d,i) {
              d.line = this;
              var line =chart.line()
              return line(d.values.slice(1,13))
          })
          .attr('stroke', function(d,i) {return color(d.values[0].value)})
          .attr('stroke-width', '3px')
          .attr('opacity', 1)
          .each('end', function(){
            oldValues = curValues
          })

        var isRecord = false

        if(maxMean != d3.max(means)) {
          isRecord = true
          maxMean = d3.max(means)
          dataRecords.push(yearData[0])
          chart.updateVoronoi(dataRecords)

          d3.selectAll('.color-line.record')
            .attr('opacity', .4)
            .classed('max', false)

          d3.selectAll('.avg-line').classed('max', false)
            .attr('opacity', 0)

          var recordAvg = d3.select('.avg-line.line-'+yearToShow)
            .classed('record', true)
            .classed('max', true)
            .attr('opacity', opac)
            .attr('stroke-dasharray', '2,5')
            .attr('stroke', function(d) {return color(d.values[0].value)})

          d3.select('.color-line.line-'+yearToShow)
            .classed('record', true)
            .attr('opacity', opac)
            .attr('stroke', function(d) {return color(d.values[0].value)})
            .classed('max', true)

          var record = recordAvg.data()

          maxValueDiv.text(obj.value+'˚F')
            .style({
              color: obj.color,
              'background-color': '#fff',
              position: 'absolute',
              left: x(1) +'px',
              top: y(obj.value)+30 +'px',
            })

          maxRecordDiv.text(obj.year)
            .style({
              color: obj.color,
              'background-color': '#fff',
              position: 'absolute',
              left: (window.innerWidth<900)?x(13)+10+'px':x(13)+10 +'px',
              top: y(obj.value)+30 +'px',
            })
            .append('div')
              .classed('rank',true)
              .text('#'+yearData[0].rank)
              .style('opacity',(activeTab=='all')?1:0)
              .style('height',(activeTab=='all')?'auto':'0px')

          newRecordDiv
            .style({
              position: 'absolute',
              left: x(13)+5 +'px',
              top: y(obj.value)-10 +'px',
            })
            .style({
              left: (window.innerWidth<900)?x(13)-20+'px':x(13)+50 +'px',
              top: (window.innerWidth<900)?y(obj.value)-10 +'px':y(obj.value)+20 +'px',
            })
        }

        d3.select('.gray-line.line-'+yearToShow)
          .attr('stroke-width', 2)
          .attr('opacity', .2)

        updateYear(obj.year,isRecord)
        if(yearToShow == data[data.length-1].year){
          d3.select('.century-avg').select('path')
            .attr('opacity', opac)
        }
        yearToShow = yearToShow+1
        // debugger
      }else{
        chart.isAnimating(false)

        d3.select('#graphic-button-container')
          .classed('disabled',false)

        chart.cancelFn(true)

        d3.selectAll('.tooltip').style({
          display: 'block',
          // opacity:1
        })

        var year = data[data.length-1].year
        var ccWidth = parseInt(d3.select('.chart-container').style('width'))


        yearDiv
          .select('.tt-header')
          .html((activeTab == 'all')?'21<sup>st</sup> Century Years Are Red Hot':year+': The Hottest Year' )
          .style({
            display: 'block',
            opacity: (hasAnimated)?1:0,
            width: '600px',
            height: 'auto',
            position: 'absolute',
            left: ((activeTab == 'all')? ccWidth/4-40 : ccWidth/3-45 ) +'px',
            top: topMax-40 +'px',
            background: 'transperant',
          })

        d3.selectAll('.avg-line.max')
          .attr('opacity', opac)

        d3.select('.max-year-label')
          .classed('show',true)
          .style('opacity', opac)
          .classed('show',false)
          .style('opacity', 0)

      }
    }

    function updateYear (year, recordYear) {

      topMax = y(d3.max(
        dataRecords.slice(-1)[0].values
          .filter(function(d,i){
            if(d3.range(4,8).indexOf(i)>-1) return d
          })
          .map(function(d){return d.value})
      ))

      topMax = (topMax<chart.height()/2)?topMax:chart.height()/2

      yearDiv.select('.tt-header')
        .text(year)
        .style({
          opacity: (hasAnimated)?1:0,
          width: 'auto',
          height: 'auto',
         position: 'absolute',
          left: chart.width()/2 +'px',
          top: topMax-30 +'px',
        })

      d3.select('.max-year-label')
        .classed('show',recordYear)
        .style({
          opacity: (recordYear)?opac:0,
        })
    }

    function redrawRecords() {

      var yearData = data[data.length-1]
      var year = yearData.year
      activeTab = d3.select('.graphic-button-active').attr('id')

      if(!d3.select('#year')[0][0]){
        yearDiv = d3.select('.chart-container').append('div').attr('id','year')
        yearDiv.append('div').classed('tt-header', true)
        yearDiv.append('div').classed('record-year',true)
        recordDiv = d3.select('.chart-container').append('div').classed('axis tt-year record',true)
        valueDiv = d3.select('.chart-container').append('div').classed('axis tt-value record',true)
        maxValueDiv = d3.select('.chart-container').append('div').classed('axis tt-value record max',true)
        maxRecordDiv = d3.select('.chart-container').append('div').classed('axis tt-year record max',true)

        newRecordDiv = d3.select('.chart-container').append('div').classed('axis max-year-label',true)
          .text('New Record')
          .attr('opacity', 0)
      }


      maxValueDiv.text(yearData.value+'˚F')
        .style({
          color: yearData.color,
          'background-color': '#fff',
          position: 'absolute',
          left: x(1) +'px',
          top: y(yearData.value)+30 +'px',
        })

      maxRecordDiv.text(yearData.year)
        .style({
          color: yearData.color,
          'background-color': '#fff',
          position: 'absolute',
          left: (window.innerWidth<900)?x(13)+10+'px':x(13)+10 +'px',
          top: y(yearData.value)+30 +'px',
        })
        .append('div')
          .classed('rank',true)
          .text('#'+yearData.rank)
          .style('opacity',(activeTab=='all')?1:0)
          .style('height',(activeTab=='all')?'auto':'0px')

      var ccWidth = parseInt(d3.select('.chart-container').style('width'))
      yearDiv
        .select('.tt-header')
        .html((activeTab == 'all')?'21<sup>st</sup> Century Years Are Red Hot':year+': The Hottest Year' )
        .style({
          display: 'block',
          opacity: (hasAnimated)?1:0,
          width: '600px',
          height: 'auto',
          position: 'absolute',
          left: ((activeTab == 'all')? ccWidth/4-40 : ccWidth/3-45 ) +'px',
          top: topMax-40 +'px',
          background: 'transperant',
        })


      chart.updateVoronoi(dataRecords)
      _.each(dataRecords,function(d,i){
        d3.selectAll('.avg-line').classed('max', false)

        d3.selectAll('.color-line')
          .attr('opacity', 0)
          .attr('stroke-width', 1)

        d3.selectAll('.color-line.record')
          .attr('opacity', .4)
          .attr('stroke-width', 2)
          .classed('max', false)


        d3.select('.avg-line.line-'+d.year)
          .classed('record', true)
          .classed('max', true)
          .attr('opacity', opac)
          .attr('stroke-dasharray', '2,5')
          .attr('stroke', function(d) {return color(d.values[0].value)})

        d3.select('.color-line.line-'+d.year)
          .classed('record', true)
          .classed('max', true)
          .attr('opacity', opac)
          .attr('stroke', function(d) {return color(d.values[0].value)})

      })
      d3.selectAll('.gray-line')
        .attr('opacity', .2)

      d3.selectAll('.century-avg')
        .attr('opacity', (activeTab == 'all')?.8:.4)

    }

    function showRecords() {
      tracker('load', 'record years')

      activeTab = d3.select('.graphic-button-active').attr('id')
      chart.updateVoronoi(dataRecords)
      yearData = getYearData(yearToShow-1)

      updateYear(yearData[0].year)
      redrawRecords()

      chart.el().selectAll('.color-line.record')
        .attr('opacity', function(dd){
          return (d3.select(this).classed('max'))? 1 : .4
        })

      d3.selectAll('.avg-line')
        .attr('opacity', 0)

      d3.selectAll('.avg-line.max')
        .attr('opacity', opac)

      d3.selectAll('.rank')
        .style('opacity',(activeTab=='all')?1:0)
        .style('height',(activeTab=='all')?'auto':'0px')
    }

    showAll = function () {
      tracker('load', 'all years')

      if(chart.isAnimating() == false){
        var newData = (chart.data()).filter(function(d){return d.year >1999})
        // yearDiv = d3.select('.chart-container').append('div').attr('id','year')
        yearData = getYearData(yearToShow-1)
        updateYear(yearData[0].year)
        redrawRecords()

        chart.updateVoronoi(data)
        chart.el().selectAll('.gray-line')
          .attr('opacity',opac)

        chart.el().selectAll('.color-line')
          .attr('opacity',0)

        d3.selectAll('.avg-line')
          .attr('opacity', 0)

        d3.selectAll('.color-line.max')
          .attr('opacity', opac)

        _.each(newData,function(d,i){
          d3.select('.avg-line.line-'+d.year)
            .classed('century', true)
            .attr('opacity', 0)

          d3.select('.color-line.line-'+d.year)
            .classed('century', true)
            .attr('opacity', .4)
            .attr('stroke', function(d) {return color(d.values[0].value)})

          d3.select('.color-line.max')
            .classed('century', true)
            .attr('opacity', 1)
            .attr('stroke', function(d) {return color(d.values[0].value)})
        })

        d3.selectAll('.avg-line')
          .attr('opacity', 0)

        d3.select('.century-avg').select('path')
          .attr('opacity', opac)
      }
    }

    window.onresize = _.debounce(function(){
      activeTab = d3.select('.graphic-button-active').attr('id')

      chartWidth = getChartSize()[0]
      chartHeight = getChartSize()[1]
      chart.resize(chartWidth ,chartHeight)

      y = chart.y()
      x = chart.x()

      if(chart.isAnimating()) {
        restart()
      }else{
        if(activeTab == 'all'){
          showAll()
        }else{
          showRecords()
        }
      }

    }, 250);


    window.onscroll =function() {
      if(!hasAnimated){
        hasAnimated = true
        d3.select('.scroll').style({
          opacity:0,
          'z-index':-1
        })
        d3.select('#graphic-button-container').style('opacity',1)
        restart()
      }
    }
  }