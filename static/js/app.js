const sampleDataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

function createDemographicInfo(data) {
    let metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html("") // reset
    for (each in data) {
        metadataPanel.append("h5").text(`${each}: ${data[each]}`);
    };
}

function createBarChart(data) {
    let xData;
    let yData;
    let xLabels;

    yData = data.otu_ids.slice(0,10).map((eachID) => `OTU ${eachID}`).reverse();
    xData = data.sample_values.slice(0,10).reverse();
    xLabels = data.otu_labels.slice(0,10).reverse();

    const layout = {
        title: "Top 10 Bacteria in Sample"
    }

    const barChartData = [
        {
          x: xData,
          y: yData,
          text: xLabels,
          type: 'bar',
          orientation: 'h'
        }
      ];

    Plotly.newPlot('bar', barChartData, layout);
}

function createBubbleChart(data) {
    console.log("data", data);
    const otuIds = data.otu_ids;
    const sampleValues = data.sample_values;
    const labels = data.otu_labels;

    const layout = {
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Sample Values"},
        hovermode: "closest",
        showlegend: false,
    }
    const bubbleChartData = [
        {
            x: otuIds,
            y: sampleValues,
            text: labels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Earth'
            }
        }
    ]

    Plotly.newPlot('bubble', bubbleChartData, layout);
}

function optionChanged(selectedSample) {
    // Get Data
    d3.json(sampleDataURL).then(function(data) {
        const sampleData = data;

        // Get sample's samples
        const sampleValues = sampleData.samples; // array
        // Get sample's metadata
        const sampleMetadata = sampleData.metadata.filter((each) => each.id.toString() === selectedSample);

        const newSampleIdData = sampleValues.filter((each) => each.id === selectedSample);

        // Create demographic info for new sample
        createDemographicInfo(sampleMetadata[0]); // have to index because filter function returns array
        // Create bar chart for new sample
        createBarChart(newSampleIdData[0]); // have to index because filter function returns array
        // Create bubble chart for new sample
        createBubbleChart(newSampleIdData[0]); // have to index because filter function returns array
    });
}


function main() {
    // Fetch the JSON data and console log it
    d3.json(sampleDataURL).then(function(data) {
        const sampleData = data;


        // Get test subject ids for dropdown
        const ids = sampleData.names;
        let dropdown = d3.select("#selDataset");

        for(id of ids) {
            dropdown
            .append("option")
            .text(id)
            .property("value", id)
        }

       

        // Initial data to render
        const initialData = sampleData.samples[0];
        const initialMetadata = sampleData.metadata[0];
       
    
        // BUILD GRAPHS/OTHER FEATURES -------------------------------------------------

        // Create initial demographic info
        createDemographicInfo(initialMetadata)
        // Create initial bar chart
        createBarChart(initialData);
        // Create intial bubble chart
        createBubbleChart(initialData);
       
    });

};

main();