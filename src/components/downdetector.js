import * as Plot from "npm:@observablehq/plot";

export function convertHtmlToJson(content) {
    try {
        const regex = /window\.DD\.currentServiceProperties\s*=\s*({[\s\S]*?})\s*}/;
        const match = content.match(regex);

        if (!match) {
            throw new Error("Could not find service properties in HTML");
        }

        // 1. Replace single quotes with double quotes
        // 2. Remove trailing commas before closing braces/brackets
        // 3. Wrap unquoted keys (x and y) in double quotes
        // 4. Remove this line: regionalCommunicate: ('False' === 'True'),
        const jsonFriendly = match[1]
            .replace(/regionalCommunicate: \('False' === 'True'\),/, '')
            .replace(/'/g, '"')
            .replace(/ (\w+):/g, '"$1":')
            .replace(/,\s*([\]}])/g, '$1\n')

        const data = JSON.parse(`${jsonFriendly}}`);

        // We only want the series data (reports and baseline)
        const result = {
            company: data.company,
            status: data.status,
            reports: data.series?.reports?.data || [],
            baseline: data.series?.baseline?.data || []
        };

        return result;
    } catch (error) {
        console.error("Error processing HTML:", error);
        return {error: error.message};
    }
}

export function plotOutage(outageData, {width, height} = {}) {

    var color = 'gray'
    if (outageData.status === "danger") {
        color = '#dc3545'
    } else if (outageData.status === "success") {
        color = '#17a2b8'
    } else if (outageData.status === "warning") {
        color = '#ffc107'
    }

    return Plot.plot({
        color: {legend: true},
        x: {label: "Date"},
        y: {label: "Reports"},
        marks: [
            Plot.areaY(outageData.reports,
                {
                    x: (d) => new Date(d.x),
                    y: "y",
                    stroke: color,
                    fill: color,
                    fillOpacity: 0.8,
                    strokeOpacity: 0.8,
                    marker: "tick",
                    name: "Reports"
                }
            ),
            Plot.lineY(outageData.baseline, {x: (d) => new Date(d.x), y: "y", stroke: "black", strokeDasharray: "4,4"}),
            Plot.crosshair(outageData.reports, {x: (d) => new Date(d.x),y: "y"})
        ]
    })
}