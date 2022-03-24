import React from 'react';
import * as d3 from "https://cdn.skypack.dev/d3@5";
//This example uses D3 v5

export default class InteractiveRadarChart extends React.Component {
  constructor(props) {
    super(props);

    this.myReference = React.createRef();
  }

  componentDidMount() {
    this.update();
  }

  update() {


    var container = d3.select(this.myReference.current);

    var data = this.props.data;
    var cfg = this.props.cfg;
          
    var color = d3.scaleOrdinal().range(["#0014fe", "#00baff", "#00dbaf", "#f4bf02", "#ffa600", "#ee693e", "#ff0000", "#ff00c4", "#99958f"]);
    var maxValue = d3.max(data, function(i) {
        return d3.max(i[1].map(function(o) {
            return o.value
        }))
    });
    var minValue = d3.min(data, function(i) {
        return d3.min(i[1].map(function(o) {
            return o.value
        }))
    });
    // D?finition des axes
    var allAxis = (data[0][1].map(function(i, j) {
            return i.axis
        })),
        total = allAxis.length, // autant d'axes que d''axis' indiqu?s dans data
        radius = (cfg.h / 3), //rayon du cercle le plus ?loign?
        innerRadius = (radius / cfg.levels) * cfg.ratio,
        Format = d3.format('.0%'), //affiche en pourcentage, arrondi ? l'entier
        angleSlice = Math.PI * 2 / total; // L'?cart entre chaque part de camembert
    // D?finition des axes 2
    var allAxis2 = (data[0][3].map(function(i, j) {
            return i.axis
        })),
        total = allAxis.length, // autant d'axes que d''axis' indiqu?s dans data
        radius = (cfg.h / 3), //rayon du cercle le plus ?loign?
        innerRadius = (radius / cfg.levels) * cfg.ratio,
        Format = d3.format('.0%'), //affiche en pourcentage, arrondi ? l'entier
        angleSlice = Math.PI * 2 / total; // L'?cart entre chaque part de camembert
    // Echelle du rayon
    var rScale = d3.scaleLinear().range([innerRadius, radius]).domain([0, maxValue]);
    // Cr?ation du canevas
    var svg = container.append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar")

    // Background
    svg.append("rect")
        .attr("width", cfg.w)
        .attr("height", cfg.h)
        .style("fill", "white")
        .style("stroke", "lightgrey")
        .style("opacity", 1).lower();
    
    // Cr?ation du groupe
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 3.3 + cfg.margin.left) + "," + (cfg.h / 1.9 - cfg.margin.top) + ")");
    // Cr?ation du groupe 2
    var g2 = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 1.3 + cfg.margin.left) + "," + (cfg.h / 1.9 - cfg.margin.top) + ")");
    // Grid
    var axisGrid = g.append("g")
        .attr("class", "axisWrapper");
    // Grid 2
    var axisGrid2 = g2.append("g")
        .attr("class", "axisWrapper2");
    // variables pour le fond du grid
    var inconnu = 2.13 //ratio: 1.8
    var distance = cfg.ratio * inconnu;
    var step = distance / (cfg.levels + 1)
    // Dessin du fond du Grid
    axisGrid.selectAll(".levels")
        .data(d3.range(0, distance, step).reverse()) //nombres et ?cart (1) de cercles ? partir du centre
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", 0)
        .style("fill", "white")
        .style("stroke", "lightgrey")
        .style("stroke-dasharray", function(d, i) {
            if (i < 1) {
                return "none"
            } else {
                return 3, 3
            }
        })
        .style("stroke-width", function(d, i) {
            if (i < 1) {
                return 1
            } else {
                return 0.8
            }
        }) //selectionne le cercle exterieur et d?finie sa largeur bords
        .style("display", "true");
    // Dessin du fond du Grid 2
    axisGrid2.selectAll(".levels2")
        .data(d3.range(0, distance, step).reverse()) //nombres et ?cart (1) de cercles ? partir du centre
        .enter()
        .append("circle")
        .attr("class", "gridCircle2")
        .attr("r", 0)
        .style("fill", "white")
        .style("stroke", "lightgrey")
        .style("stroke-dasharray", function(d, i) {
            if (i < 1) {
                return "none"
            } else {
                return 3, 3
            }
        })
        .style("stroke-width", function(d, i) {
            if (i < 1) {
                return 1
            } else {
                return 0.8
            }
        }) //selectionne le cercle exterieur et d?finie sa largeur bords
        .style("display", "true");
    // indication des pourcentages
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, cfg.levels + 1)) // ? partir du 2? cercle jusqau'au 5?me
        .enter()
        .append("text")
        .attr("class", "axisLabel")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d, i) {
            return Format((d / cfg.levels))
        })
        .style("display", "true");
    // indication des pourcentages 2
    axisGrid2.selectAll(".axisLabel2")
        .data(d3.range(1, cfg.levels + 1)) // ? partir du 2? cercle jusqau'au 5?me
        .enter()
        .append("text")
        .attr("class", "axisLabel2")
        .attr("x", 0)
        .attr("y", 0)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function(d, i) {
            return Format((d / cfg.levels))
        })
        .style("display", "true");
    // Dessin des axes
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");
    axis.append("line")
        .attr("x1", 0) //x du point de d?part des lignes
        .attr("y1", 0) //y du point de d?part des lignes
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("class", "line")
        .style("stroke", "lightgrey")
        .style("stroke-dasharray", (3, 3))
        .style("stroke-width", 1)
        .attr("display", "true");
    // Dessin des axes 2
    var axis2 = axisGrid2.selectAll(".axis2")
        .data(allAxis2)
        .enter()
        .append("g")
        .attr("class", "axis2");
    axis2.append("line")
        .attr("x1", 0) //x du point de d?part des lignes
        .attr("y1", 0) //y du point de d?part des lignes
        .attr("x2", 0)
        .attr("y2", 0)
        .attr("class", "line2")
        .style("stroke", "lightgrey")
        .style("stroke-dasharray", (3, 3))
        .style("stroke-width", 1)
        .attr("display", "true");
    // L?gende: noms de marque
    var legende = svg.selectAll("bar")
        .data(data)
        .enter()
        .append("g")
    legende.append("text")
        .text(function(d) {
            return d[0].map(function(o) {
                return o.name
            })
        })
        .attr("class", "legtext")
        .style("font-family", "Roboto")
        .style("font-weight", "bolder")
        .style("fill-opacity", 1)
        .attr("x", 4)
        .attr("y", function(d, i) {
            if (i == 8) {
                return 269
            } else {
                return 99 + i * 20
            }
        })
        .attr("id", function(d, i) {
            return "leg" + i;
        })
        .style("font-size", 10)
        .style("fill", function(d, i) {
            return color(i)
        })
        .style("text-decoration", "none")
        .style("opacity", 1);
    legende.append("rect")
        .attr("class", "recta")
        .attr("x", 2)
        .attr("y", function(d, i) {
            if (i == 8) {
                return 258
            } else {
                return 88 + i * 20
            }
        })
        .attr("width", 65)
        .attr("height", 15)
        .style("fill", function(d, i) {
            return color(i)
        })
        .style("opacity", 0.09);
    legende.append("rect")
        .attr("class", "rectastroke")
        .attr("id", function(d, i) {
            return "str" + i
        })
        .attr("x", 2)
        .attr("y", function(d, i) {
            if (i == 8) {
                return 258
            } else {
                return 88 + i * 20
            }
        })
        .attr("width", 65)
        .attr("height", 15)
        .style("stroke", function(d, i) {
            return color(i)
        })
        .style("stroke-width", 0.5)
        .style("fill", "none")
        .attr("display", "none");
    // Dessin des aires
    var radarLine = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(function(d) {
            return rScale(d.value);
        })
        .angle(function(d, i) {
            return i * angleSlice
        });
    // Dessin des aires 2
    var radarLine2 = d3.radialLine()
        .curve(d3.curveLinearClosed)
        .radius(function(d) {
            return rScale(d.value);
        })
        .angle(function(d, i) {
            return i * angleSlice
        });
    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveLinearClosed)
    }
    //
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "radarWrapper");
    var blobWrapper2 = g2.selectAll(".radarWrapper2")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "radarWrapper2");
    // Dessin du fond des aires
    blobWrapper.append("g")
        .attr("id", function(d, i) {
            return "tog" + i
        })
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function(d, i) {
            return radarLine(d[2])
        })
        .style("fill", function(d, i) {
            return color(i)
        })
        .style("fill-opacity", cfg.opacityArea)
        .attr("id", function(d, i) {
            return "tag" + i
        })
        .on("mouseover", function(d, i) {

            if (!d3.selectAll(".active")
                .empty()) {
                return;
            } //d?sactive la function mouseover lorsque la fonction clic est actionn?e
            d3.selectAll(".radarArea")
                .transition()
                .duration(100)
                .style("fill-opacity", 0.1);
            d3.select(this)
                .raise()
                .transition()
                .duration(100)
                .style("fill-opacity", 1);
            d3.selectAll(".legtext")
                .style("opacity", 0.2);
            d3.select("#leg" + i)
                .style("opacity", 1);
            d3.select("#str" + i)
                .attr("display", "true")
        })
        .on("mouseout", function(d, i) {
            if (!d3.selectAll(".active")
                .empty()) {
                return;
            }
            d3.selectAll(".radarArea")
                .transition()
                .duration(100)
                .style("fill-opacity", cfg.opacityArea);
            d3.select("#leg" + i)
                .style("opacity", 1);
            d3.select("#str" + i)
                .attr("display", "none");
            d3.selectAll(".legtext")
                .style("opacity", 1)
        });
    // Dessin du fond des aires 2
    blobWrapper2.append("g")
        .attr("id", function(d, i) {
            return "tog2" + i
        })
        .append("path")
        .attr("class", "radarArea2")
        .attr("d", function(d, i) {
            return radarLine2(d[2])
        })
        .style("fill", function(d, i) {
            return color(i)
        })
        .style("fill-opacity", cfg.opacityArea)
        .attr("id", function(d, i) {
            return "tag2" + i
        })
        .on("mouseover", function(d, i) {
            if (!d3.selectAll(".active")
                .empty()) {
                return;
            } //d?sactive la function mouseover lorsque la fonction clic est actionn?e
            d3.selectAll(".radarArea2")
                .transition()
                .duration(100)
                .style("fill-opacity", 0.1);
            d3.select(this)
                .raise()
                .transition()
                .duration(100)
                .style("fill-opacity", 1);
            d3.selectAll(".legtext")
                .style("opacity", 0.2);
            d3.select("#leg" + i)
                .style("opacity", 1);
            d3.select("#str" + i)
                .attr("display", "true")
        })
        .on("mouseout", function(d, i) {
            if (!d3.selectAll(".active").empty()) {
                return;
            }
            d3.selectAll(".radarArea2")
                .transition()
                .duration(100)
                .style("fill-opacity", cfg.opacityArea);
            d3.select("#leg" + i).style("opacity", 1);
            d3.select("#str" + i).attr("display", "none");
            d3.selectAll(".legtext").style("opacity", 1)
        });
    // Transition des fonds des aires
    d3.selectAll(".radarArea")
        .transition()
        .delay(function(d, i) {
            return i * 50
        })
        .duration(800)
        .attr("d", function(d, i) {
            return radarLine(d[1])
        });
    // Transition des fonds des aires 2
    d3.selectAll(".radarArea2")
        .transition()
        .delay(function(d, i) {
            return i * 50
        })
        .duration(800)
        .attr("d", function(d, i) {
            return radarLine2(d[3])
        });
    // Dessin des bords des aires
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function(d, i) {
            return radarLine(d[1]);
        })
        .style("stroke", function(d, i) {
            return color(i);
        })
        .style("stroke-width", 3)
        .style("fill", "none")
        .attr("display", "none")
        .attr("id", function(d, i) {
            return "rad" + i
        });
    // Dessin des bords des aires 2
    blobWrapper2.append("path")
        .attr("class", "radarStroke2")
        .attr("d", function(d, i) {
            return radarLine2(d[3]);
        })
        .style("stroke", function(d, i) {
            return color(i);
        })
        .style("stroke-width", 3)
        .style("fill", "none")
        .attr("display", "none")
        .attr("id", function(d, i) {
            return "rad2" + i
        });
    // Affiche les pourcentages pour chaque aire
    data.forEach(function(d, i) {
        d3.select("#tog" + i)
            .selectAll("pourcentage")
            .data(function(d, i) {
                return d[1]
            })
            .enter()
            .append("text")
            .attr("class", "perct" + i)
            .style("text-anchor", "middle")
            .style("dominant-baseline", "central")
            .attr("x", function(d, i) {
                return rScale(d.value + 0.15) * Math.cos(angleSlice * i - Math.PI / 2)
            })
            .attr("y", function(d, i) {
                return rScale(d.value + 0.05) * Math.sin(angleSlice * i - Math.PI / 2)
            })
            .style("font-size", 10)
            .style("fill", "dimgrey")
            .style("font-family", "Open Sans", "sans serif")
            .style("font-size", 10)
            .style("opacity", 0)
            .text(function(d, i) {
                if (d.value == 0) {
                    return "";
                }
                else {
                    return Format(d.value)
                }
            })
            .attr("display", "true");
    })
    // Affiche les pourcentages pour chaque aire 2
    data.forEach(function(d, i) {
        d3.select("#tog2" + i)
            .selectAll("pourcentage")
            .data(function(d, i) {
                return d[3]
            })
            .enter().append("text")
            .attr("class", "perct2" + i)
            .attr("x", function(d, i) {
                return rScale(d.value + 0.15) * Math.cos(angleSlice * i - Math.PI / 2)
            })
            .attr("y", function(d, i) {
                return rScale(d.value + 0.15) * Math.sin(angleSlice * i - Math.PI / 2)
            })
            .style("font-size", 10)
            .style("fill", "dimgrey")
            .style("font-family", "Open Sans", "sans serif")
            .style("font-size", 10)
            .style("opacity", 0)
            .text(function(d, i) {
                if (d.value == 0) {
                    return "";
                }
                else {
                    return Format(d.value)
                }
            })
            .attr("display", "true");
    })
    // Affiche les points d'angle pour chaque aire (not displayed at the moment)
    data.forEach(function(d, i) {
        var idx = i
        d3.select("#tog" + i)
            .selectAll("circle")
            .data(function(d, i, j) {
                return d[1]
            })
            .enter().append("circle")
            .attr("class", "points" + i)
            .attr("r", cfg.dotRadius)
            .attr("cx", function(d, i) {
                return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
            })
            .attr("cy", function(d, i) {
                return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2)
            })
            .style("fill", function(d, i, j) {
                if (d.value == 0) {
                    return "none"
                } else {
                    return color(idx)
                }
            })
            .style("fill-opacity", 0);
    })
    // Affiche le nom des mati?res pour chaque aire
    data.forEach(function(d, i) {
        d3.select("#tog" + i)
            .selectAll("textile")
            .data(function(d, i) {
                return d[1]
            })
            .enter().append("text")
            .attr("class", "textile" + i)
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function(d, i) {
                return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("y", function(d, i) {
                return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .text(function(d, i) {
                if (d.value > 0) {
                    return d.axis
                } else {
                    return "";
                }
            })
            .style("font-weight", "bold")
            .style("fill", "grey")
            .style("opacity", 0);
    })
    // Affiche le nom des pays pour chaque aire 2
    data.forEach(function(d, i) {
        d3.select("#tog2" + i)
            .selectAll("pays")
            .data(function(d, i) {
                return d[3]
            })
            .enter().append("text")
            .attr("class", "pays" + i)
            .style("font-size", "11px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function(d, i) {
                return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
            })
            .attr("y", function(d, i) {
                return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
            })
            .text(function(d, i) {
                if (d.value > 0) {
                    return d.axis
                } else {
                    return "";
                }
            })
            .style("font-weight", "bold")
            .style("fill", "grey")
            .style("opacity", 0);
    })
    // Interactions de la l?gende
    legende.on("click", function(d, i) {
        var active = d.active ? false : true;
        d3.select(this)
            .classed("active", active);
        d3.selectAll(".radarArea")
            .transition()
            .duration(100)
            .style("fill-opacity", function() {
                if (active) {
                    return 0
                } else {
                    return 0
                }
            });
        d3.selectAll(".radarArea2")
            .transition()
            .duration(100)
            .style("fill-opacity", function() {
                if (active) {
                    return 0
                } else {
                    return 0
                }
            });
        d3.select("#tag" + i)
            .transition()
            .duration(100)
            .style("fill-opacity", 0);
        d3.select("#tag2" + i)
            .transition()
            .duration(100)
            .style("fill-opacity", 0);
        d3.select("#rad" + i)
            .raise()
            .transition()
            .ease(d3.easePoly)
            .duration(100)
            .attr("display", function() {
                if (active) {
                    return "true"
                } else {
                    return "none"
                }
            });
        d3.select("#rad2" + i)
            .raise()
            .transition()
            .ease(d3.easePoly)
            .duration(100)
            .attr("display", function() {
                if (active) {
                    return "true"
                } else {
                    return "none"
                }
            });
        d3.select(this)
            .select("text")
            .style("fill", function(e, j) {
                if (active) {
                    return "white"
                } else {
                    return color(i)
                }
            })
            .raise();
        d3.select(this)
            .select("rect")
            .style("opacity", function() {
                if (active) {
                    return 1
                }
            }); //si active est false, renvoie l'opacit? pr?cis?e dans le CCS
        d3.selectAll(".gridCircle")
            .transition()
            .ease(d3.easePoly)
            .delay(function(d, i) {
                return i * 60
            })
            .duration(500)
            .attr("r", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return innerRadius + (radius / cfg.levels * d)
                } else {
                    return 0
                }
            });
        d3.selectAll(".gridCircle2")
            .transition()
            .ease(d3.easePoly)
            .delay(function(d, i) {
                return i * 60
            })
            .duration(500)
            .attr("r", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return innerRadius + (radius / cfg.levels * d)
                } else {
                    return 0
                }
            });
        d3.selectAll(".line")
            .transition()
            .ease(d3.easePoly)
            .duration(500)
            .attr("x1", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(0) * Math.cos(angleSlice * i - Math.PI / 2)
                }
            }) //x du point de d?part des lignes
            .attr("y1", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(0) * Math.sin(angleSlice * i - Math.PI / 2)
                }
            }) //y du points de d?part des lignes
            .attr("x2", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
                }
            })
            .attr("y2", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
                }
            });
        d3.selectAll(".line2")
            .transition()
            .ease(d3.easePoly)
            .duration(500)
            .attr("x1", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(0) * Math.cos(angleSlice * i - Math.PI / 2)
                }
            }) //x du point de d?part des lignes
            .attr("y1", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(0) * Math.sin(angleSlice * i - Math.PI / 2)
                }
            }) //y du points de d?part des lignes
            .attr("x2", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(maxValue) * Math.cos(angleSlice * i - Math.PI / 2);
                }
            })
            .attr("y2", function(d, i) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return rScale(maxValue) * Math.sin(angleSlice * i - Math.PI / 2);
                }
            });
        d3.selectAll(".perct" + i)
            .transition()
            .duration(100)
            .style("opacity", function(d, i) {
                if (!d.active) {
                    return 0
                } else {
                    return 1
                }
            })
        d3.selectAll(".perct2" + i)
            .transition()
            .duration(100)
            .style("opacity", function(d, i) {
                if (!d.active) {
                    return 0
                } else {
                    return 1
                }
            })
        d3.selectAll(".textile" + i)
            .transition()
            .duration(100)
            .style("opacity", 0)
        d3.selectAll(".pays" + i)
            .transition()
            .duration(100)
            .style("opacity", 0)
        d3.selectAll(".legend")
            .transition()
            .duration(600)
            .style("opacity", 0.7)
        d3.selectAll(".legend2")
            .transition()
            .duration(600)
            .style("opacity", 0.7)
        d3.selectAll(".axisLabel")
            .transition()
            .duration(600)
            .attr("x", -10)
            .attr("y", function(d) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return innerRadius + (radius / (cfg.levels * 1.575) * d)
                } else {
                    return 0
                }
            })
            .style("display", "true")
        d3.selectAll(".axisLabel2")
            .transition()
            .duration(600)
            .attr("x", -10)
            .attr("y", function(d) {
                if (!d3.selectAll(".active")
                    .empty()) {
                    return innerRadius + (radius / (cfg.levels * 1.575) * d)
                } else {
                    return 0
                }
            })
            .style("display", "true")
        d.active = active; // Toggle back
    })
    
    legende.on("mouseover", function(d, i, j) {

            if (!d3.selectAll(".active").empty()) {
                return;
            }
            
            d3.selectAll(".radarArea")
                .transition()
                .duration(100)
                .style("fill-opacity", 0);

            d3.selectAll(".radarArea2")
                .transition()
                .duration(100)
                .style("fill-opacity", 0);

            d3.select(this)
                .selectAll(".rectastroke")
                .attr("display", "true");

            d3.select("#tag" + i)
                .transition()
                .duration(100)
                .style("fill-opacity", 1);
            d3.select("#tag2" + i)
                .transition()
                .duration(100)
                .style("fill-opacity", 1);
            d3.selectAll(".perct" + i)
                .transition()
                .duration(800)
                .style("opacity", function(d, i) {
                    if (d.active) {
                        return 0
                    } else {
                        return 1
                    }
                });
            d3.selectAll(".perct2" + i)
                .transition()
                .duration(800)
                .style("opacity", function(d, i) {
                    if (d.active) {
                        return 0
                    } else {
                        return 1
                    }
                });
            d3.selectAll(".textile" + i)
                .transition()
                .duration(100)
                .style("opacity", 1);
            d3.selectAll(".pays" + i)
                .transition()
                .duration(100)
                .style("opacity", 1);
            d3.selectAll(".legend")
                .transition()
                .duration(100)
                .style("opacity", 0.1);
            d3.selectAll(".legend2")
                .transition()
                .duration(100)
                .style("opacity", 0.1);

            
            //d3.selectAll(".points" + i).transition().duration(100).style("fill-opacity",1)
        })
        .on("mouseout", function(d, i) {

            if (!d3.selectAll(".active").empty()) {
                return;
            }
            d3.selectAll(".radarArea")
                .transition()
                .duration(500)
                .style("fill-opacity", function(d, i) {
                    if (d.active) {
                        return 0
                    } else {
                        return cfg.opacityArea
                    }
                });
            d3.selectAll(".radarArea2")
                .transition()
                .duration(500)
                .style("fill-opacity", function(d, i) {
                    if (d.active) {
                        return 0
                    } else {
                        return cfg.opacityArea
                    }
                });
            d3.select(this).selectAll(".rectastroke").attr("display", "none");
            d3.select("#tag" + i)
                .transition()
                .duration(700)
                .style("fill-opacity", cfg.opacityArea);
            d3.select("#tag2" + i)
                .transition()
                .duration(700)
                .style("fill-opacity", cfg.opacityArea);
            d3.selectAll(".perct" + i)
                .transition()
                .duration(100)
                .style("opacity", 0);
            d3.selectAll(".perct2" + i)
                .transition()
                .duration(100)
                .style("opacity", 0);
            d3.selectAll(".textile" + i)
                .transition()
                .duration(100)
                .style("opacity", 0);
            d3.selectAll(".pays" + i)
                .transition()
                .duration(100)
                .style("opacity", 0);
            d3.selectAll(".legend")
                .transition()
                .duration(500)
                .style("opacity", 0.6);
            d3.selectAll(".legend2")
                .transition()
                .duration(500)
                .style("opacity", 0.6)
            //d3.selectAll(".points" + i).transition().duration(100).style("fill-opacity", 0)
        })
    // Cr?e un cercle blanc au mileu
    var centercircle = g.append("circle")
        .attr("r", innerRadius + 1.5)
        .raise()
        .style("fill", "white")
        .style("opacity", 1)
        .style("stroke-width", 1.5)
        .style("stroke", "lightgrey");
    // Cr?e un cercle blanc au mileu 2
    var centercircle2 = g2.append("circle")
        .attr("r", innerRadius + 1.5)
        .raise()
        .style("fill", "white")
        .style("opacity", 1)
        .style("stroke-width", 1.5)
        .style("stroke", "lightgrey");
    // L?gende des axes: noms des mati?res
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .text(function(d) {
            return d
        })
        .style("opacity", 0);
    // Transition des mati?re
    d3.selectAll(".legend")
        .transition()
        .duration(100)
        .style("opacity", 0.6);
    // L?gende des axes: noms des pays
    axis2.append("text")
        .attr("class", "legend2")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2);
        })
        .attr("y", function(d, i) {
            return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .text(function(d) {
            return d
        })
        .style("opacity", 0);
    // Transition des pays
    d3.selectAll(".legend2")
        .transition()
        .duration(100)
        .style("opacity", 0.6);
    // Points invisibles + tooltip pour afficher les pourcentages au mouseover
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter()
        .append("g")
        .attr("class", "radarCircleWrapper");
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function(d, i) {
            return d[1]
        })
        .enter()
        .append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", 5)
        .attr("cx", function(d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
        })
        .attr("cy", function(d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d, i) {
            let newX = parseFloat(d3.select(this).attr('cx')) - 10;
            let newY = parseFloat(d3.select(this).attr('cy')) - 10;
            tooltip.attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition()
                .duration(200)
                .style('opacity', 1)
        })
        .on("mouseout", function() {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0)
        });
    var tooltip = g.append("text")
        .attr("class", "tooltip")
        .style("opacity", 1);
    var blobCircleWrapper2 = g2.selectAll(".radarCircleWrapper2")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper2");
    blobCircleWrapper2.selectAll(".radarInvisibleCircle2")
        .data(function(d, i) {
            return d[3]
        })
        .enter()
        .append("circle")
        .attr("class", "radarInvisibleCircle2")
        .attr("r", 5)
        .attr("cx", function(d, i) {
            return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2)
        })
        .attr("cy", function(d, i) {
            return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2);
        })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function(d, i) {
            let newX = parseFloat(d3.select(this).attr('cx')) - 10;
            let newY = parseFloat(d3.select(this).attr('cy')) - 10;
            tooltip2.attr('x', newX)
                .attr('y', newY)
                .text(Format(d.value))
                .transition()
                .duration(200)
                .style('opacity', 1)
        })
        .on("mouseout", function() {
            tooltip2.transition()
                .duration(200)
                .style("opacity", 0)
        });
    var tooltip2 = g2.append("text")
        .attr("class", "tooltip")
        .style("opacity", 1);

  
  }

  render() {
    return (
      <div ref={this.myReference}>
      </div>
    );
  }
}