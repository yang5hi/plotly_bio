// Initialize the page
function init() {updatePage();};
// Function update the page content
function updatePage() {
  d3.json("data/samples.json").then(function(dataSamples) {
      // Fetch the JSON data and log it into console to check the array size
      console.log(dataSamples);
      // make sure every object is unique in the dataset
      let uniqueNames=dataSamples["names"].filter((item, i, ar) => ar.indexOf(item) === i);
      console.log(uniqueNames);
      // apppend the subject id into the dropdown menu
      uniqueNames.forEach(name => d3.select("#selDataset").append("option").text(name));
      //-------------------------update demographic info---------------------------------------
      // get the Test Subject ID number from the dropdown menu
      let selectedId=d3.select("#selDataset").property("value");
      console.log(selectedId); // validate ID
      d3.select("#sample-metadata").html(""); // clear the previrous paragraphs
      // match the id with metadata
      let selectedMeta=dataSamples['metadata'].filter(sampleInfo =>sampleInfo["id"]==selectedId);
      console.log(selectedMeta[0]); // validate the selected metadata
      // output the Demographic Info to DOM
      selectedMeta.forEach(demoInfo=> {
          Object.entries(demoInfo).forEach(([key,value])=> {
              d3.select("#sample-metadata").append("p").append("strong").text(`${key}: ${value}`);
            })
      });
      //--------------------------create the horizontal bar chart-------------------------------
      // select the sample otu data based on id
      let selectedOtus=dataSamples['samples'].filter(otu => otu["id"]==selectedId);
      // store id, value, and labels to an array
      let otuIds=selectedOtus[0].otu_ids;
      console.log(otuIds.map(num=>`#${num.toString(16)}`));
      let sampleValues=selectedOtus[0].sample_values;
      let otuLabels=selectedOtus[0].otu_labels;
      let selectedList=otuIds.map((a,i)=>[a,sampleValues[i],otuLabels[i]]);
      console.log(selectedList);
      // get the top 10 OTUs 
      sortedList=selectedList.sort((a,b)=>(b[1]-a[1])).slice(0,10);
      console.log(sortedList); // validate the data
      // bar graph
      var data = [{
          type: 'bar',
          x: sortedList.map(a=>a[1]).reverse(),
          y: sortedList.map(a=>`OTU#${a[0]} `).reverse(),
          text: sortedList.map(a=>a[2]).reverse(),
          orientation: 'h'
      }];
      var layout = {
        title: `top 10 OTUs found in test subject # ${selectedId}`,
        xaxis: {title: 'OTU Values'},
        showlegend: false
      };
      Plotly.newPlot('bar', data, layout);
    //------------------------------create bubble chart-----------------------------------------------
      var trace1 = {
          x: otuIds,
          y: sampleValues,
          text: selectedList,
          mode: 'markers',
          marker: {
              color: otuIds,
              size: sampleValues
          }
        };
      var layout = {
          title: `all OTUs found in test subject # ${selectedId}`,
          xaxis: {title: 'OTU ID Number'},
          yaxis: {title: 'OTU Values'},
          showlegend: false
        };
      Plotly.newPlot('bubble', [trace1], layout);
  });
};

d3.select("#selDataset").on("change", updatePage);

init();