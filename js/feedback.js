// functions for showing feedback at the end of a staircase procedure

function makeGraph(stairData, divID) {
  //console.log('make graph stair data: ', stairData);
  var data = [];
  var cols = ['Trial Number','Difficulty', {'type':'string','role':'style'}];

  var pointStyle, color, rotation, shape;

  if (("moveDirectionArray" in stairData) && ("isReversal" in stairData)) {
    // data from the staircase 
    for (var i=0;i<stairData.trialCount;i++) {
      // rotate triangle up for up trials, down triangle for down trials
      rotation = (stairData.moveDirectionArray[i] == 'up') ? 0 : 180;
      // green for correct response, red for incorrect response
      color = (stairData.isCorrResponse[i]) ? 'green' : 'red';
      // circle for reversals
      shape = (stairData.isReversal[i]) ? 'circle' : 'triangle';
      pointStyle = 'point { shape-type: ' + shape + '; fill-color: ' + color + '; shape-rotation: ' + rotation + ';}'; 
      data[i] = [i, stairData.val[i], pointStyle];
    }
  } else {
    // data from catch trials
    for (var j=0;j<stairData.trialCount;j++) {
      // green for correct response, red for incorrect response
      color = (stairData.isCorrResponse[j]) ? 'green' : 'red';
      // there are no directions or reversals (catch trials are not part of an adaptive staircase track) 
      // so always use the same shape and rotation
      pointStyle = 'point { shape-type: square; fill-color: ' + color + ';}'; 
      data[j] = [j, stairData.val[j], pointStyle];
    }
  }
  // unshift adds an element to the start of an array
  data.unshift(cols);
  drawChart(data, divID);
}

function drawChart(array, divID) {
  var data = google.visualization.arrayToDataTable(array);
  var options = {
    legend: { position: 'bottom' },
    vAxis: { minValue: 0.5, maxValue: 1.0, ticks: [0.5, 0.6, 0.7, 0.8, 0.9, 1.0], title: 'Difficulty', titleTextStyle: {italic: false, fontSize: 20}, textStyle: {fontSize: 20} },
    hAxis: { title: 'Trial Number', titleTextStyle: {italic: false, fontSize: 20}, textStyle: {fontSize: 20} },
    height: 500,
    width: 900,
    pointSize: 18,
    //pointShape: {type: 'triangle', rotation: 0},
    series: [
      {visibleInLegend: false},
      {visibleInLegend: false}
    ]
  };
  var chart = new google.visualization.LineChart(document.getElementById(divID));
  chart.draw(data, options);
}