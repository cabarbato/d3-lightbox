import React from "react";
import * as d3 from "d3";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import Lightbox from "./components/Lightbox";

import "./assets/scss/main.scss";
import categories from "./assets/data/categories.json";

gsap.registerPlugin(Draggable);
const img_dims = {
  width: 800,
  height: 600
};
const image = `//source.unsplash.com/random/${img_dims.width}x${img_dims.height}/`;
const data = {
  name: "Lightbox",
  children: []
};

categories.forEach((category, i) => data.children.push({
  url: `${image}?${category}`,
  i,
  category,
})
)

export default function App() {
  const initial_state = {
    show: false,
    image: null,
    category: null
  },
    [{ show, image, category }, setState] = React.useState(initial_state);
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
      (d, i, arr) =>
        (d.rotate = d.value * (360 / arr.length) + arr.length * 45 * (1 + Math.random()))
    );

    const g = svg
      .attr("height", app_dims.height)
      .attr("width", app_dims.width)
      .selectAll("g")
      .data(root.leaves())
      .enter()
      .append("g");

    g.transition().duration(300).style("opacity", 1);

    g.append("rect")
      .attr("class", "border")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => img_dims.width / 4)
      .attr("height", (d) => img_dims.height / 4)
      .attr("rx", 1)
      .style("transform", (d) => `rotate(${d.rotate}deg)`);

    g.append("image")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => img_dims.width / 4)
      .attr("height", (d) => img_dims.height / 4)
      .attr("href", (d) => d.data.url)
      .attr("data-category", (d) => d.data.category)
      .style("transform", (d) => `rotate(${d.rotate}deg)`);

    g.nodes().forEach((el) => {
      Draggable.create(el, {
        type: "x,y",
        edgeResistance: 0.65,
        bounds: svg.node(),
        overshootTolerance: 0,
        onClick(e) {
         if (e.target.href)
           setState({
              show: true,
              image: e.target.href.baseVal,
              category: e.target.attributes["data-category"].value
            });
        }
      });
    });
  });

  return (
    <div className="App">
      {data.children.length ? <svg id="chart" /> : null}
      <Lightbox
        show={show}
        image={image}
        category={category}
        onHide={() => setState({ show: false, image })}
      />
    </div>
  );
}
