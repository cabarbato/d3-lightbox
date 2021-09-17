import React from "react";
import * as d3 from "d3";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

import "./styles.scss";

gsap.registerPlugin(Draggable);
const img_dims = {
  width: 166,
  height: 100
};
const image = `//source.unsplash.com/random/${img_dims.width}x${img_dims.height}/`;
const data = {
  name: "Lightbox",
  children: []
};

const count = 10;
let i = count;

while (i) {
  data.children.push({
    url: `${image}?${i}`,
    i
  });
  --i;
}

export default function App() {
  React.useEffect(() => {
    const sel = ".App";
    const app = d3.select(sel);
    const app_dims = app.node().getBoundingClientRect();
    const svg = d3.select(`${sel} svg`);
    const hierarchy = d3.hierarchy(data).sum((d) => d.i);
    const treemap = d3
      .treemap()
      .size([app_dims.width, app_dims.height])
      .padding(1);
    const root = treemap(hierarchy);

    root.children.forEach(
      (d) =>
        (d.rotate = d.value * (360 / count) + count * 45 * (1 + Math.random()))
    );

    const g = svg
      .attr("height", app_dims.height)
      .attr("width", app_dims.width)
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g");

    g.style("transition-delay", ".5s")
      .transition()
      .duration(300)
      .style("opacity", 1);

    g.append("rect")
      .attr("class", "border")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => img_dims.width)
      .attr("height", (d) => img_dims.height)
      .attr("rx", 1)
      .style("transform", (d) => `rotate(${d.rotate}deg)`);

    g.append("image")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => img_dims.width)
      .attr("height", (d) => img_dims.height)
      .attr("href", (d) => d.data.url)
      .style("transform", (d) => `rotate(${d.rotate}deg)`);

    g.nodes().forEach((el) => {
      Draggable.create(el, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: svg.node(),
        overshootTolerance: 0
      });
    });
  });

  return (
    <div className="App">
      {data.children.length ? <svg id="chart" /> : null}
    </div>
  );
}
