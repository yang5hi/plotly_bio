//{"names":["940",...],
//  "metadata":[{"id":"940",ethnicity, gender, age, location, bbtype, wfreq},...],
// "samples":[{"id":"940", otu_ids:[], otu_labels:[]},...]}

// Fetch the JSON data and console log it
d3.json("data/samples.json").then(function(dataSamples) {
    // log into console to check the array size
    console.log(dataSamples);
    console.log(dataSamples["names"]);

   // make sure every object is unique in the dataset
    let uniqueNames=dataSamples["names"].filter((item, i, ar) => ar.indexOf(item) === i);
    console.log(uniqueNames);
    
    // apppend the subject id into the dropdown menu
    uniqueNames.forEach(name => d3.select("#selDataset").append("option").text(name));
    d3.select("#selDataset").on("change", updatePage);

    // function to change page content
    function updatePage() {
      //-------------------------update demographic info---------------------------------------
      // get the Test Subject ID number from the dropdown menu
      let selectedId=d3.select("#selDataset").property("value");
      console.log(selectedId);

      // match the id with metadata
      d3.select("#sample-metadata").html("");
      let selectedMeta=dataSamples['metadata'].filter(sampleInfo =>sampleInfo["id"]==selectedId);
      console.log(selectedMeta[0]);

      // output the Demographic Info
      selectedMeta.forEach(demoInfo=> {
        Object.entries(demoInfo).forEach(([key,value])=> {
          d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        })
      });

      //--------------------------create the horizontal bar chart-------------------------------
      // get the top 10 OTUs
      let selectedOtus=dataSamples['samples'].filter(otu => otu["id"]==selectedId);
      //console.log(selectedOtus[0].otu_ids);
      console.log(selectedOtus[0]);

      let otuIds=selectedOtus[0].otu_ids.slice(0,10).map(id=>`OTU ${id}`).reverse();
      let sampleValues=selectedOtus[0].sample_values.slice(0,10).reverse();
      let otuLabels=selectedOtus[0].otu_labels.slice(0,10).reverse();
      console.log(otuIds);
      var data = [{
        type: 'bar',
        x: sampleValues,
        y: otuIds,
        text: otuLabels,
        orientation: 'h'
      }];
      
      Plotly.newPlot('bar', data);

    };
    
  
  
  });



// // Initializes the page with a default plot
// function init() {
//     data = [{
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16] }];
  
//     Plotly.newPlot("plot", data);
//   }
  
//   // Call updatePlotly() when a change takes place to the DOM
//   d3.selectAll("#selDataset").on("change", updatePlotly);
  
//   // This function is called when a dropdown menu item is selected
//   function updatePlotly() {
//     // Use D3 to select the dropdown menu
//     var dropdownMenu = d3.select("#selDataset");
//     // Assign the value of the dropdown menu option to a variable
//     var dataset = dropdownMenu.property("value");
  
//     // Initialize x and y arrays
//     var x = [];
//     var y = [];
  
//     if (dataset === 'dataset1') {
//       x = [1, 2, 3, 4, 5];
//       y = [1, 2, 4, 8, 16];
//     }
  
//     else if (dataset === 'dataset2') {
//       x = [10, 20, 30, 40, 50];
//       y = [1, 10, 100, 1000, 10000];
//     }
  
//     // Note the extra brackets around 'x' and 'y'
//     Plotly.restyle("plot", "x", [x]);
//     Plotly.restyle("plot", "y", [y]);
//   }
  
//   init();

/* horizontal bar chart
var data = [{
  type: 'bar',
  x: [20, 14, 23],
  y: ['giraffes', 'orangutans', 'monkeys'],
  orientation: 'h'
}];

Plotly.newPlot('myDiv', data);
*/