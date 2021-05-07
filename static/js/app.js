//{"names":["940",...],
//  "metadata":[{"id":"940",ethnicity, gender, age, location, bbtype, wfreq},...],
// "samples":[{"id":"940", otu_ids:[], otu_labels:[]},...]}

// Fetch the JSON data and console log it
d3.json("data/samples.json").then(function(dataSamples) {
    // log into console to check the array size
    console.log(dataSamples);
    console.log(dataSamples["names"]);
    let uniqueNames=dataSamples["names"].filter((item, i, ar) => ar.indexOf(item) === i);
    // make sure every object is unique in the dataset
    console.log(uniqueNames);
    // apppend the subject id into the dropdown menu
    uniqueNames.forEach(name => d3.select("#selDataset").append("option").text(name));
    d3.select("#selDataset").on("change", updatePage);


    function updatePage() {
      // get the Test Subject ID no from the dropdown menu
      let chooseId=d3.select("#selDataset").property("value");
      console.log(chooseId);

      // match the id with metadata
      d3.select("#sample-metadata").html("");
      let chooseMeta=dataSamples['metadata'].filter(sampleInfo =>sampleInfo["id"]==chooseId);
      console.log(chooseMeta[0]);

      // output the Demographic Info
      chooseMeta.forEach(demoInfo=> {
        Object.entries(demoInfo).forEach(([key,value])=> {
          d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
        })
      });

      // get the top 10 OTUs
      let chooseOtus=dataSamples['samples'].filter(otu => otu["id"]==chooseId);
      console.log(chooseOtus[0]);
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