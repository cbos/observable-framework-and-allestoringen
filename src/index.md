---
title: Observable Framework ❤️ DownDetector and Allestoringen
toc: true
index: true
---

# Observable Framework ❤️ DownDetector and Allestoringen



## Reports for incident analysis

When you face an incident it is good to make an incident report to see if you can find the root causes of it.    
To share the analysis, you can create a report with all observability data, but actual data will get lost over time. Capture it as screenshot can be helpful, but hard to reproduce.   
There are more ways to do that. 
[Observable Framework](https://observablehq.com/framework) provides a simple way to build interactive data reports.

<div class="note" label="What is Observable Framework"> 

 Create fast, beautiful data apps, dashboards, and reports from the command line. Write Markdown, JavaScript, SQL, Python, R… and any language you like. Free and open-source.   

 _source:_ _[Observable Framework](https://observablehq.com/framework)_

</div>

The engineers of Observable Framework created a framework to create reports and provided an example of that as well:
<div class="card">
    <h1>Example report created</h1>
    <p>
        <a href="https://observablehq.observablehq.cloud/framework-example-api/" target="_blank">
            <picture>
              <source srcset="./images/api.webp" media="(prefers-color-scheme: dark)">
              <img src="./images/api-dark.webp">
            </picture>
            <div class="small arrow">Analyzing web logs</div>
        </a>
    </p>
</div>

It is also very easy to get started: https://observablehq.com/framework/getting-started   
And with the Observable Framework, you can use the [Observable Plot library](https://observablehq.com/plot/) to easily create graphs

## Capture data from DownDetector / Allestoringen 

When an incident occurs, customers report problems pretty quickly. [DownDetector](https://downdetector.com) and [Allestoringen (Dutch version reporting Dutch companies)](https://allestoringen.nl) provide a nice overview of the problems.   
That data can be a starting point for your own incident report to indicate the customer impact.   

There are kind of ways to capture data for the reports. That is described in the following link:   
https://observablehq.com/framework/data-loaders    

<div class="caution" label="Capture once"> 

Data capturing is normally done again during the build phase of the Observable Framework, but in case of an incident, it should be done **once**, otherwise the data gets overwritten and then you loose the old data.

</div>

## Example with ING

In this case I assume you just downloaded the raw HTML file from for example **`https://allestoringen.nl/storing/ing/`** and store that as **`src/data/ing.html`**.
Once you have to that you can make the next steps, as described below.

```js echo
const ing = FileAttachment("./data/ing.html").text();
```

Import the functions from the downdetector.js file to convert the HTML to JSON and plot the data.    
Source is available at https://github.com/cbos/observable-framework-and-allestoringen/blob/main/src/components/downdetector.js    

```js echo
import {convertHtmlToJson, plotOutage} from "./components/downdetector.js";
```

```js echo
const outageData = convertHtmlToJson(ing);
display(outageData);
```

Now you can display the data in a graph:

```js echo
plotOutage(convertHtmlToJson(ing))
```

Or you can render it as a card:
```html echo
<div class="grid grid-cols-1">
  <div class="card">
    ${plotOutage(convertHtmlToJson(ing))}
  </div>
</div>
```

# Reports for major banks in the Netherlands

With the steps above you can create reports for major banks in the Netherlands. This can be the **starting point for your own report**.   
The graph from DownDetector only indicates the number of customers who complained about the problems. 
The actual number of customers affected is not visible.    

Having this as a starting point you can add more actual numbers to the report to indicate what happened.

```js
const rabobank = FileAttachment("./data/rabobank.html").text();
const abnamro = FileAttachment("./data/abnamro.html").text();
const asn = FileAttachment("./data/asn.html").text();
```

<div class="grid grid-cols-2">
    <div class="card">
    <h2>Reports for ING on 18-12-2025</h2>
    ${plotOutage(convertHtmlToJson(ing))}
  </div>
  <div class="card">
    <h2>Reports for Rabobank on 18-12-2025</h2>
    ${plotOutage(convertHtmlToJson(rabobank))}
  </div>
  <div class="card">
    <h2>Reports for ABN AMRO on 18-12-2025</h2>
    ${plotOutage(convertHtmlToJson(abnamro))}
  </div>
<div class="card">
    <h2>Reports for ASN on 18-12-2025</h2>
    ${plotOutage(convertHtmlToJson(asn))}
  </div>
</div>

--- 

This interactive report is related to this blog post [Observable Framework ❤️ DownDetector](https://ceesbos.nl/posts/observable-framework-loves-downdetector/).
