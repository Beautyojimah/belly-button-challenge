// Define the URL for the data
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Fetch the data and store it
d3.json(url).then(data => {
    initializeDashboard(data);
});

function initializeDashboard(data) {
    populateDropdownMenu(data.names);
    const initialSampleId = data.names[0];
    updateMetadata(data.metadata, initialSampleId);
    updateCharts(data.samples, initialSampleId, data.metadata);
}

function populateDropdownMenu(sampleNames) {
    const dropdownMenu = d3.select("#selDataset");
    sampleNames.forEach(sample => {
        dropdownMenu.append("option").text(sample).property("value", sample);
    });
}

function optionChanged(newSampleId) {
    d3.json(url).then(data => {
        updateMetadata(data.metadata, newSampleId);
        updateCharts(data.samples, newSampleId, data.metadata);
    });
}

function updateMetadata(metadataArray, sampleId) {
    const metadataContainer = d3.select("#sample-metadata");
    const metadata = metadataArray.filter(meta => meta.id == parseInt(sampleId))[0];
    metadataContainer.html("");
    Object.entries(metadata).forEach(([key, value]) => {
        metadataContainer.append("h5").text(` ${key}: ${value}`);
    });
}

function updateCharts(samplesArray, sampleId, metadataArray) {
    const sampleData = samplesArray.filter(sample => sample.id == sampleId)[0];
    const { otu_ids, sample_values, otu_labels } = sampleData;
    const wfrequency = metadataArray.filter(meta => meta.id == parseInt(sampleId))[0].wfreq;

    // Bar Chart
    var barData = [{
        x: sample_values.slice(0, 10).reverse(),
        y: otu_ids.slice(0, 10).map(x => `OTU ${x}`).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: 'bar',
        orientation: 'h'
    }];
    var barLayout = {
        title: 'Top 10 OTUs',
    };
    Plotly.newPlot('bar', barData, barLayout);

    // Bubble Chart
    var bubbleData = [{
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
            color: otu_ids,
            size: sample_values,
            colorscale: "Earth"
        }
    }];
    var bubbleLayout = {
        title: 'Belly Button Bubble Chart',
        xaxis: { title: 'OTU ID' },
        showlegend: false,
    };
    Plotly.newPlot('bubble', bubbleData, bubbleLayout);

    // Gauge Chart
    var gaugeData = [{
        type: "indicator",
        mode: "gauge+number",
        value: wfrequency,
        title: { text: "Belly Button Washing Frequency<br><sub>Scrubs per Week</sub>", font: { size: 24 } },
        gauge: {
            axis: { range: [null, 9], tickwidth: 1, tickcolor: "darkblue" },
            bar: { color: "darkblue" },
            bgcolor: "white",
            borderwidth: 2,
            bordercolor: "gray",
            steps: [
                { range: [0, 1], color: "rgba(232, 226, 202, .5)" },
                { range: [1, 2], color: "rgba(210, 206, 145, .5)" },
                { range: [2, 3], color: "rgba(202, 209, 95, .5)" },
                { range: [3, 4], color: "rgba(170, 202, 42, .5)" },
                { range: [4, 5], color: "rgba(110, 154, 22, .5)" },
                { range: [5, 6], color: "rgba(14, 127, 0, .5)" },
                { range: [6, 7], color: "rgba(131, 90, 45, .5)" },
                { range: [7, 8], color: "rgba(84, 48, 5, .5)" },
                { range: [8, 9], color: "rgba(19, 79, 92, .5)" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: wfrequency
            }
        }
    }];
    var gaugeLayout = {
        width: 500,
        height: 400,
        margin: { t: 25, r: 25, l: 25, b: 25 },
        paper_bgcolor: "white",
        font: { color: "darkblue", family: "Arial" }
    };

    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
}
