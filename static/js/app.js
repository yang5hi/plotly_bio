
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
    d3.select("#selDataset").on("change", updateDemographicInfo);

    // function to change page content
    function updateDemographicInfo() {
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
      console.log(selectedOtus[0]);

      // .reverse();
      let otuIds=selectedOtus[0].otu_ids;
      let sampleValues=selectedOtus[0].sample_values;
      let otuLabels=selectedOtus[0].otu_labels;
      let selectedList=otuIds.map((a,i)=>[a,sampleValues[i],otuLabels[i]]);
      console.log(selectedList);
      sortedList=selectedList.sort((a,b)=>(b[1]-a[1])).slice(0,10);
      console.log(sortedList);
      var data = [{
        type: 'bar',
        x: sortedList.map(a=>a[1]).reverse(),
        y: sortedList.map(a=>`OTU ${a[0]}`).reverse(),
        text: sortedList.map(a=>a[2]).reverse(),
        orientation: 'h'
      }];
      
      Plotly.newPlot('bar', data);
     

      //------------------------------create bubble chart-----------------------------------------------
     var trace1 = [{
          x: otuIds,
          y: sampleValues,
          text: selectedList,
          mode: 'markers',
          marker: {
            color: otuIds,
            size: sampleValues
          }
        }];

      var layout = {
        xaxis: {title: 'OTU ID'},
        showlegend: false
      };

      Plotly.newPlot('bubble', trace1, layout);
    };  
    
    
  });



// // Initializes the page with a default plot
// function init() {
//     data = [{
//       x: [1, 2, 3, 4, 5],
//       y: [1, 2, 4, 8, 16] }];
  
//     Plotly.newPlot("plot", data);
//   }