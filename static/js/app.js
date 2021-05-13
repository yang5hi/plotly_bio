// Initialize the page
UpdatePage();

// Function update the page content
function UpdatePage() {
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
      // select the sample otu data based on id
      let selectedOtus=dataSamples['samples'].filter(otu => otu["id"]==selectedId);
      // store id, value, and labels to an array
      let otuIds=selectedOtus[0].otu_ids;
      let sampleValues=selectedOtus[0].sample_values;
      let otuLabels=selectedOtus[0].otu_labels;
      let selectedList=otuIds.map((a,i)=>[a,sampleValues[i],otuLabels[i]]);
      console.log(selectedList);
      // get the top 10 OTUs 
      sortedList=selectedList.sort((a,b)=>(b[1]-a[1])).slice(0,10);
      console.log(sortedList); // validate the data
      //create the horizontal bar chart
      PlotBar(sortedList, selectedId);
      //create bubble chart
      PlotBubble (otuIds, sampleValues,selectedList, selectedId);  
      //create the gauge chart(Bonus Part)
      PlotGauge (selectedMeta[0].wfreq);
  });
};

function PlotBar (sortedList, selectedId) {
    var data = [{
            type: 'bar',
            x: sortedList.map(a=>a[1]).reverse(),
            y: sortedList.map(a=>`OTU${a[0]} `).reverse(),
            text: sortedList.map(a=>a[2]).reverse(),
            marker: {
                color: '#C8A2C8',
                line: {width: 2.5}
            },
            orientation: 'h'
        }];
    var layout = {
            title: `top 10 OTUs in test subject ${selectedId}`,
            xaxis: {title: 'OTU Values'},
            font: {size: 14},
            showlegend: false
        };
    Plotly.newPlot('bar', data, layout);
};

function PlotBubble(otuIds, sampleValues,selectedList, selectedId){
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
          title: `all OTUs found in test subject ${selectedId}`,
          font: {size: 14},
          xaxis: {title: 'OTU ID Number'},
          yaxis: {title: 'OTU Values'},
          showlegend: false
      };
  Plotly.newPlot('bubble', [trace1], layout);
};

function PlotGauge (inNum) {
  var trace2={
        value: inNum,
        title: { text: "Scrubs per Week" },
        type: "indicator",
        gauge: {
            axis: { range: [null, 9] },
            bar: { color: "darkblue" },
            steps: [{ range: [0,1], color: '#ffffff'},
                    { range: [1,2], color: '#f3cec9'},
                    { range: [2,3], color: '#e7a4b6'},
                    { range: [3,4], color: '#cd7eaf'},
                    { range: [4,5], color: '#a262a9'},
                    { range: [5,6], color: '#6f4d96'},
                    { range: [6,7], color: '#3d3b72'},
                    { range: [7,8], color: '#182844'},
                    { range: [8,9], color: '#000000'}]
        },
        mode: "gauge+number"
    };      
    var layout = {
            title: 'Belly Button Washing Frequency',
            font: {size: 20}
        };
  Plotly.newPlot('gauge', [trace2] , layout);
};

d3.select("#selDataset").on("change", UpdatePage);