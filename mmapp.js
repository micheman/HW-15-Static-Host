function main() {
  // load in the json
  // extract column data of all names/Id# of "Lab Rats" tested as RatID
  d3.json("samples.json").then(function(jsondata) {
    // WHAT TO DO WITH Promise Pending ????
    // const dataPromise = d3.json(url);
    // console.log("Data Promise: ", dataPromise);
    console.log(jsondata);
    console.log(`json read success: ---${jsondata.names[0] == "940"}---`); //testit
    let RatIDs = jsondata.names.map(item => {
      return item}); // .map won't work @ dictioanries only arrays
    // slect RatIDs drop down list location
    let ddlLocation = d3.select("#selDataset");
    // what follows selDataset...
    //  <option value="dataset1">dataSet1</option>
    // Now populate the list of RatID's into the drop down
    ddlLocation.html(""); // clear previous data
    var row = ddlLocation.append("option"); // Put instruction string for default upon POR
    var cell = row.append("value");          
    cell.text("Select ID here");            
    RatIDs.forEach((arrayitem) => {
      row = ddlLocation.append("option"); // NOTE: every time through this loop
      cell = row.append("value");         // the .on procedure call gets executed
      cell.text(arrayitem);
    // now that the pull down is loaded
    // enable .on event service 
    d3.selectAll("#selDataset").on("change", ProcessUserPullDownReq); 
    // the rest is up to the user interacting with event driver ProcessUserPullDownReq:
    // IT Gets the user selection for data and process it
    });
  });
}

function ProcessUserPullDownReq() {
  // This function is called when a dropdown menu item is selected
  // returns: the string the user selected from the pulldown
  // Use D3 to select the dropdown menu`
  // need a static variable in here to compare old vs new input
  // then if change update all vizz
  var dropdownMenu = d3.select("#selDataset");
  // Assign the value of the dropdown menu slected item to variable
  var RatIDselected = dropdownMenu.property("value");
  // Above is another way to do it besides using "this"
  // Why are there two? Which is better?
  console.log(`Per *.on handler, new dropdown item is: ${RatIDselected}`);
  // Ultimately we will do everything in this function...
  // MPG means slow brute force NOW, fast dainty morsels LATER
  if (RatIDselected != "Select ID here") { 
      d3.json("samples.json").then(function(jsondata) {
      console.log(`Using locale compare new dropdown item is: ${RatIDselected}`);
      // ES6 version.
      var result = [];
      RatIDselected.split('').map(letter => {
        result.push(letter);
      });
      console.log(`The RAT string is: ${result}<--The End`);
      console.log(result);
      // })
      SelectedIndex = jsondata.names.indexOf(RatIDselected);
      console.log(`The index of ${RatIDselected} into jsondata.names is ${SelectedIndex}`);
      console.log(` `);
      // This worked/..
      // RatAge = jsondata.metadata[SelectedIndex].age;
      // console.log(`Rat ID #${RatIDselected}'s age is ${RatAge}.`);
      // So now try this... brute force first, elegance if time
      //    Show the RadIDs Demographic Info ie Metadata
      // if time refactor with array/dict source now its ugly
      let demogTableID = d3.select("#idtext");
      demogTableID.text(jsondata.metadata[SelectedIndex].id);
      //
      let demogTableEth = d3.select("#ethtext");
      demogTableEth.text(jsondata.metadata[SelectedIndex].ethnicity);
      // 
      let demogTableGen = d3.select("#gentext");
      demogTableGen.text(jsondata.metadata[SelectedIndex].gender);
      // 
      let demogTableAge = d3.select("#agetext");
      demogTableAge.text(jsondata.metadata[SelectedIndex].age);
      // 
      let demogTableLoc = d3.select("#loctext");
      demogTableLoc.text(jsondata.metadata[SelectedIndex].location);
      // 
      let demogTableBBT = d3.select("#bbttext");
      demogTableBBT.text(jsondata.metadata[SelectedIndex].bbtype);
      // 
      let demogTableWFreq = d3.select("#wfrtext");
      demogTableWFreq.text(jsondata.metadata[SelectedIndex].wfreq);
      // 
      //
      // NOW Build and output the Hbar chart using the top 10 OTU's
      // 
      // ********************COPIED FROM INITAIALIZED***********
      let xdata = [];
      let ydata = [];
      //xdata = jsondata.samples.[SelectedIndex].sample_values.map(sample => {
      for (var i=9; i>=0; i--) {
        xdata.push(jsondata.samples[SelectedIndex].sample_values[i]);
        OTUstr = jsondata.samples[SelectedIndex].otu_ids[i].toString(10);
        console.log(`${OTUstr}`);
        ydata.push("OTU "+ OTUstr);
      }
      do {
        var trace1 = {
          x: xdata,
          y: ydata,
          text: ["ZIP","two","three"],
          name: "Test HBar Out",
          type: "bar",
          orientation: "h"
        };
        //console.log(`trace 1 x data: ${trace1.x}`);
        //console.log(`trace 1 y data: ${trace1.y}`);
        // data
        var data = [trace1];
      
        // Apply the group bar mode to the layout
        var layout = {
          title: "Operational Taxonomic Units (OTU) Representation",
          //xaxis: "X-Axis",

          xaxis: {
            title: {
              text: 'Number of Specimens Detected in OTU',
            }
          },
          yaxis: {
            title: {
              text: "Top 10 OTU's",
            }
          },
          margin: {
            l: 100,
            r: 100,
            t:  100,
            b: 100
          }
        };
        // Render the plot to the div tag with id "plot"
        //Plotly.newPlot("plot", data, layout);
        // Important: the first argument is the ID of the location in HTML
        Plotly.newPlot("bar-chart-location-id", data, layout);
        PlotBubble(jsondata.samples[SelectedIndex]);
        PlotGauge(jsondata.metadata[SelectedIndex].wfreq);
        //
      } while (false);
      // ********************COPIED FROM INITAIALIZED***********
    });
  }
}

// function PlotBubble(DataSource) { 
function PlotBubble(DataSource) { 
  // Parameter received is expected to be "jsondata.samples[SelectedIndex]"
  // as the base address we will build out the data source arrays from
  // from the rawdata 
  //* Use `otu_ids` for the x values.
  //* Use `sample_values` for the y values.
  //* Use `sample_values` for the marker size.
  //* Use `otu_ids` for the marker colors.
  //* Use `otu_labels` for the text values.
  //
  let xdata = DataSource.otu_ids.map(id=>{return id});
  let ydata = DataSource.sample_values.map(id => {return id});
  console.log(xdata);
  console.log(ydata);
  var trace1 = {
    // x: [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977],
    // x: [xdata],
    // // y: [163, 126, 113, 78, 71, 51, 50, 47, 40, 40],
    // y: [xdata],
    // mode: 'markers',
    // marker: {
    // //   color: [DataSource.otu_ids.map(id=>{return 'rgb(93, 164, 214)'})],
    // //color: [1167, 2859, 482, 2264, 41, 1189, 352, 189, 2318, 1977],
    // color: [xdata],
    // // opacity: [DataSource.otu_ids.map(id=>{return 0.5})],
    // // size: [DataSource.sample_values.map(id=>{return 50})]
    // // size: [163, 126, 113, 78, 71, 51, 50, 47, 40, 40]
    // size: [xdata]
    // }
    x: xdata, // [1,2,3,4],
    y: ydata, // [10, 11, 12, 13],
//    y: [1, 2, 3, 4],
    mode: 'markers',
    marker: {
      color: xdata, // ['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
      // opacity: [1, 0.8, 0.6, 0.4],
      size: ydata // [40, 60, 80, 100]
    }
  };
  
  var data = [trace1];
  
  var layout = {
    title: "Occurences Detected, All Operational Taxonomic Units (OTU)",
    xaxis: {
      title: {
        text: 'OTU ID',
      }
    },
    yaxis: {
      title: {
        text: 'Number of Specimens Detected in OTU',
      }
    },
    autosize: true,
    // nothign I do here changes the plot
    // autosize: false,
    // width: 10,
    // height: 10,

    showlegend: false,
    height: 600,
    width: 600
  };
  
  // Plotly.newPlot('myDiv', data, layout);
  Plotly.newPlot('bubble-chart-location-id', data, layout);
  
  // DONT TRUST THIS LINE IT JUST TO ACT AS A PLACEHOLDER
  // FOR THE PLACEMENT LOCATION OF THE PLOT 
  // Plotly.newPlot("bubble-chart-location-id", data, layout);
  

}

//function PlotGuage(DataSource) {
function PlotGauge(DataSource) {
  // build out the data source arrays from the rawdata
  // Parameter received is expected to be "jsondata.metadata[SelectedIndex].wfreq"
  
  // Data we care about is at jsondata.metadata[SelectedIndex].wfreq

  // Enter a speed between 0 and 180
  // The following task is advanced and therefore optional.
  // Adapt the Gauge Chart from https://plot.ly/javascript/gauge-charts/ 
  // to plot the weekly washing frequency of the individual.
  // You will need to modify the example gauge code to account 
  // for values ranging from 0 through 9.
  // Update the chart whenever a new sample is selected.

console.log(`Wash Freq to be gauged: ${DataSource}`); // DtataSource is integer

var level = 0; // change level by a function that 
                  // converts washing per week to degrees

if (DataSource < 1) {
  level = 0;
} else if (DataSource == 1) {
  level = 30;
} else if (DataSource > 9) {
  level = 85;
} else {
  level = 15 + DataSource*15;
}


// Trig to calc meter point
var degrees = 180 - level,
     radius = .5;
var radians = degrees * Math.PI / 180;
var x = radius * Math.cos(radians);
var y = radius * Math.sin(radians);

// Path: may have to change to create a better triangle
var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
     pathX = String(x),
     space = ' ',
     pathY = String(y),
     pathEnd = ' Z';
var path = mainPath.concat(pathX,space,pathY,pathEnd);

var data = [{ type: 'scatter',
   x: [0], y:[0],
    marker: {size: 28, color:'850000'},
    showlegend: false,
    name: 'speed',
    text: level,
    hoverinfo: 'text+name'},
  { values: [50/6, 50/6, 50/6, 50/6, 50/6, 50/6, 50],
  rotation: 90,
  text: ['9+', '8-9', '6-7', '4-5',
            '2-3', '0-1', ''],
  textinfo: 'text',
  textposition:'inside',
  marker: {colors:['rgba(14, 127, 0, .5)', 
                   'rgba(110, 154, 22, .5)',
                   'rgba(170, 202, 42, .5)', 
                   'rgba(202, 209, 95, .5)',
                   'rgba(210, 206, 145, .5)', 
                   'rgba(232, 226, 202, .5)',
                   'rgba(255, 255, 255, 0)']},
  labels: ['151-180', '121-150', '91-120', '61-90', '31-60', '0-30', ''],
  hoverinfo: 'label',
  hole: .5,
  type: 'pie',
  showlegend: false
}];

var layout = {
  shapes:[{
      type: 'path',
      path: path,
      fillcolor: '850000',
      line: {
        color: '850000'
      }
    }],
  title: '<b>Belly Button Washing Frequency</b> <br> Washings per Week',
  height: 500,
  width: 500,
  xaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]},
  yaxis: {zeroline:false, showticklabels:false,
             showgrid: false, range: [-1, 1]}
};

Plotly.newPlot('gauge-chart-location-id', data, layout);
}

main();