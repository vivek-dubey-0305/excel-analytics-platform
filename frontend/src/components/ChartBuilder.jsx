// // ChartBuilder.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { saveAs } from "file-saver";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadarController,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ScatterController,
//   BubbleController,
// } from "chart.js";
// import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadarController,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ScatterController,
//   BubbleController
// );

// // map friendly names to a render type and options
// const CHART_OPTIONS = {
//   "Bar Chart": { renderer: "bar", extra: {} },
//   "Horizontal Bar Chart": { renderer: "bar", extra: { indexAxis: "y" } },
//   "Line Chart": { renderer: "line", extra: {} },
//   "Multi-line Chart": { renderer: "line", extra: {} },
//   "Pie Chart": { renderer: "pie", extra: {} },
//   "Doughnut Chart": { renderer: "doughnut", extra: {} },
//   "Radar Chart": { renderer: "radar", extra: {} },
//   "Polar Area Chart": { renderer: "polarArea", extra: {} },
//   "Bubble Chart": { renderer: "bubble", extra: {} },
//   "Scatter Chart": { renderer: "scatter", extra: {} },
//   "Area Chart": { renderer: "line", extra: { fill: true } },
//   "Mixed Chart": { renderer: "mixed", extra: {} },
//   // advanced/3D/heatmap/treemap handled separately (see notes)
// };

// const DEFAULT_CHART_TYPES = [
//   "Bar Chart",
//   "Horizontal Bar Chart",
//   "Line Chart",
//   "Multi-line Chart",
//   "Pie Chart",
//   "Doughnut Chart",
//   "Radar Chart",
//   "Polar Area Chart",
//   "Bubble Chart",
//   "Scatter Chart",
//   "Area Chart",
//   "Mixed Chart",
// ];

// function pickColor(i) {
//   // simple deterministic palette
//   const colors = [
//     "rgba(54,162,235,0.8)",
//     "rgba(255,99,132,0.8)",
//     "rgba(255,206,86,0.8)",
//     "rgba(75,192,192,0.8)",
//     "rgba(153,102,255,0.8)",
//     "rgba(255,159,64,0.8)",
//     "rgba(199,199,199,0.8)",
//   ];
//   return colors[i % colors.length];
// }

// export default function ChartBuilder({ fileObject /* the object you posted */ }) {
//   const parsedData = fileObject?.parsedData || []; // array of row objects
//   const parsedSample = fileObject?.parsedSample || []; // sample array
//   const chartRef = useRef(null);

//   // derive columns from parsedSample or first row
//   const columns = useMemo(() => {
//     if (!parsedData || parsedData.length === 0) return [];
//     const first = parsedData[0];
//     return Object.keys(first);
//   }, [parsedData]);

//   // auto-detect numeric columns by scanning a subset
//   const numericColumns = useMemo(() => {
//     const numeric = new Set();
//     if (!parsedData || parsedData.length === 0) return [];
//     const sampleRows = parsedData.slice(0, 100); // check first 100 rows
//     columns.forEach((col) => {
//       let numericCount = 0;
//       let totalChecked = 0;
//       for (const r of sampleRows) {
//         const v = r[col];
//         if (v === null || v === undefined) continue;
//         totalChecked++;
//         // treat numbers and numeric-like strings (strip commas/spaces)
//         const cleaned = ("" + v).toString().replace(/,/g, "").trim();
//         if (cleaned === "") continue;
//         if (!Number.isNaN(Number(cleaned))) numericCount++;
//       }
//       if (totalChecked > 0 && numericCount / totalChecked > 0.75) {
//         numeric.add(col);
//       }
//     });
//     return Array.from(numeric);
//   }, [parsedData, columns]);

//   const [chartType, setChartType] = useState(DEFAULT_CHART_TYPES[0]);
//   const [xColumn, setXColumn] = useState(() => columns[0] || "");
//   const [yColumns, setYColumns] = useState(() => numericColumns.slice(0, 1));
//   const [aggregateBy, setAggregateBy] = useState("none"); // none | sum | avg | count

//   // when parsedData/columns change, pick sensible defaults
//   useEffect(() => {
//     setXColumn((prev) => (columns.includes(prev) ? prev : columns[0] || ""));
//     setYColumns((prev) => {
//       // keep previous numeric yColumns if still present else fallback
//       const filtered = prev.filter((c) => numericColumns.includes(c));
//       return filtered.length ? filtered : numericColumns.slice(0, 1);
//     });
//   }, [columns, numericColumns]);

//   // helper to compute dataset(s) depending on chart type and aggregate
//   function buildChartData() {
//     if (!xColumn || parsedData.length === 0) return { labels: [], datasets: [] };

//     // If chart type is pie/doughnut/radar/polarArea: need category=>single numeric value (aggregate)
//     const needsCategoryAggregate = ["Pie Chart", "Doughnut Chart", "Radar Chart", "Polar Area Chart"].includes(chartType);

//     // group by X if xColumn is non-numeric (string categories) otherwise treat x as numeric index
//     const xIsNumeric = numericColumns.includes(xColumn);

//     if (needsCategoryAggregate) {
//       // pick first yColumn if multiple
//       const y = yColumns[0];
//       const map = new Map();
//       parsedData.forEach((row) => {
//         const xRaw = row[xColumn];
//         const yRaw = parseFloat((row[y] ?? "").toString().replace(/,/g, "")) || 0;
//         const key = xRaw === null || xRaw === undefined ? "null" : String(xRaw);
//         if (!map.has(key)) map.set(key, { sum: 0, count: 0 });
//         const o = map.get(key);
//         o.sum += yRaw;
//         o.count += 1;
//       });
//       const labels = Array.from(map.keys()).slice(0, 100); // limit categories shown
//       const data = labels.map((l) => {
//         const o = map.get(l);
//         if (aggregateBy === "avg") return o.sum / o.count;
//         if (aggregateBy === "count") return o.count;
//         // default sum
//         return o.sum;
//       });
//       return {
//         labels,
//         datasets: [
//           {
//             label: y,
//             data,
//             backgroundColor: labels.map((_, i) => pickColor(i)),
//           },
//         ],
//       };
//     }

//     // For typical bar/line/multi-line/mixed:
//     if (chartType === "Scatter Chart") {
//       // scatter expects {x:..., y:...} from first two numeric columns
//       const y = yColumns[0];
//       const scatterPoints = parsedData
//         .map((r) => {
//           const xVal = parseFloat((r[xColumn] ?? "").toString().replace(/,/g, "")) || null;
//           const yVal = parseFloat((r[y] ?? "").toString().replace(/,/g, "")) || null;
//           if (xVal === null || yVal === null) return null;
//           return { x: xVal, y: yVal };
//         })
//         .filter(Boolean);
//       return {
//         labels: scatterPoints.map((p, i) => i),
//         datasets: [
//           {
//             label: `${y} vs ${xColumn}`,
//             data: scatterPoints,
//             backgroundColor: pickColor(0),
//           },
//         ],
//       };
//     }

//     if (chartType === "Bubble Chart") {
//       // bubble needs x,y,r per point: use first 3 numeric columns if available
//       const y = yColumns[0] || numericColumns[0];
//       const sizeCol = numericColumns[1] || y;
//       const points = parsedData
//         .map((r) => {
//           const xVal = parseFloat((r[xColumn] ?? "").toString().replace(/,/g, "")) || 0;
//           const yVal = parseFloat((r[y] ?? "").toString().replace(/,/g, "")) || 0;
//           const rVal = Math.max(2, (parseFloat((r[sizeCol] ?? "").toString().replace(/,/g, "")) || 1) / 10);
//           return { x: xVal, y: yVal, r: rVal };
//         })
//         .slice(0, 1000);
//       return {
//         labels: points.map((_, i) => i),
//         datasets: [{ label: `${y} bubble`, data: points, backgroundColor: pickColor(0) }],
//       };
//     }

//     // Standard case: labels from xColumn (string / categories). For x numeric, use index labels.
//     const labels = parsedData.map((r) => {
//       const raw = r[xColumn];
//       return raw === null || raw === undefined ? "" : String(raw);
//     });

//     // Multi Y -> multiple datasets
//     const datasets = yColumns.map((yCol, idx) => {
//       const data = parsedData.map((r) => {
//         const v = r[yCol];
//         if (v === null || v === undefined) return null;
//         const cleaned = ("" + v).replace(/,/g, "").trim();
//         const num = Number(cleaned);
//         return Number.isNaN(num) ? null : num;
//       });
//       return {
//         label: yCol,
//         data,
//         borderColor: pickColor(idx),
//         backgroundColor: pickColor(idx),
//         fill: chartType === "Area Chart" || (CHART_OPTIONS[chartType] && CHART_OPTIONS[chartType].extra.fill),
//       };
//     });

//     return { labels, datasets };
//   }

//   const chartData = useMemo(buildChartData, [parsedData, chartType, xColumn, yColumns, aggregateBy]);

//   // build options
//   const chartOptions = useMemo(() => {
//     const base = {
//       responsive: true,
//       plugins: { legend: { position: "top" }, title: { display: true, text: `${chartType}` } },
//     };
//     // merge extra options
//     const extra = CHART_OPTIONS[chartType]?.extra || {};
//     return { ...base, ...{ indexAxis: extra.indexAxis || undefined } };
//   }, [chartType]);

//   // UI helpers for selecting multiple yColumns
//   function toggleYColumn(col) {
//     setYColumns((prev) => {
//       if (prev.includes(col)) return prev.filter((c) => c !== col);
//       return [...prev, col];
//     });
//   }

//   // Export PNG
//   function exportPNG() {
//     try {
//       const chart = chartRef.current;
//       const canvas = chart?.canvas || chart?.chartInstance?.canvas || (chart?._chart && chart._chart.canvas);
//       if (!canvas) {
//         console.warn("No canvas found for export");
//         return;
//       }
//       canvas.toBlob((blob) => {
//         saveAs(blob, `${fileObject.originalName || "chart"}.png`);
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   // renderer component selection
//   function renderChart() {
//     const renderer = CHART_OPTIONS[chartType]?.renderer || "bar";
//     // Mixed chart example: multiple dataset types (bar + line)
//     if (chartType === "Mixed Chart") {
//       const mixedData = {
//         labels: chartData.labels,
//         datasets: chartData.datasets.map((d, i) => ({
//           ...d,
//           type: i % 2 === 0 ? "bar" : "line",
//         })),
//       };
//       return <Bar ref={chartRef} options={chartOptions} data={mixedData} />;
//     }

//     if (renderer === "bar") {
//       return <Bar ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     if (renderer === "line") {
//       return <Line ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     if (renderer === "pie") {
//       return <Pie ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     if (renderer === "doughnut") {
//       return <Doughnut ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     if (renderer === "radar") {
//       return <Radar ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     if (renderer === "polarArea") {
//       return <PolarArea ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     if (renderer === "scatter") {
//       return <Scatter ref={chartRef} options={chartOptions} data={chartData} />;
//     }
//     // fallback
//     return <Bar ref={chartRef} options={chartOptions} data={chartData} />;
//   }

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-sm">
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Select Chart Type</label>
//           <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="w-full p-2 border rounded">
//             {DEFAULT_CHART_TYPES.map((c) => (
//               <option key={c} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">X (Category) Column</label>
//           <select value={xColumn} onChange={(e) => setXColumn(e.target.value)} className="w-full p-2 border rounded">
//             {columns.map((col) => (
//               <option key={col} value={col}>
//                 {col}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Y (Numeric) Columns — toggle</label>
//           <div className="flex flex-wrap gap-2">
//             {columns.map((col) => {
//               const isNumeric = numericColumns.includes(col);
//               return (
//                 <button
//                   key={col}
//                   onClick={() => isNumeric && toggleYColumn(col)}
//                   disabled={!isNumeric}
//                   className={`px-2 py-1 rounded border ${yColumns.includes(col) ? "bg-green-200" : ""} ${!isNumeric ? "opacity-50 cursor-not-allowed" : ""}`}
//                   title={!isNumeric ? "Not numeric — cannot be used as Y" : ""}
//                 >
//                   {col}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         <div className="col-span-3">
//           <label className="block text-sm font-medium mb-1">Aggregation (for category charts)</label>
//           <select value={aggregateBy} onChange={(e) => setAggregateBy(e.target.value)} className="p-2 border rounded w-52">
//             <option value="none">Sum (default)</option>
//             <option value="avg">Average</option>
//             <option value="count">Count</option>
//           </select>

//           <button onClick={exportPNG} className="ml-4 px-3 py-2 border rounded bg-sky-600 text-white">
//             Export PNG
//           </button>
//         </div>
//       </div>

//       <div style={{ minHeight: 300 }}>
//         {/* Chart render area */}
//         {renderChart()}
//       </div>
//     </div>
//   );
// }





// !---------------gooddon
// ChartBuilder.jsx
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { saveAs } from "file-saver";

// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadarController,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ScatterController,
//   BubbleController,
//   PieController,
//   PolarAreaController,
// } from "chart.js";
// import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   BarElement,
//   ArcElement,
//   RadarController,
//   RadialLinearScale,
//   Title,
//   Tooltip,
//   Legend,
//   Filler,
//   ScatterController,
//   BubbleController,
//   PieController,
//   PolarAreaController
// );

// // Enhanced chart options with more types
// const CHART_OPTIONS = {
//   "Bar Chart": { renderer: "bar", extra: {} },
//   "Horizontal Bar Chart": { renderer: "bar", extra: { indexAxis: "y" } },
//   "Stacked Bar Chart": { renderer: "bar", extra: { scales: { x: { stacked: true }, y: { stacked: true } } } },
//   "Line Chart": { renderer: "line", extra: {} },
//   "Multi-line Chart": { renderer: "line", extra: {} },
//   "Stepped Line Chart": { renderer: "line", extra: { stepped: true } },
//   "Pie Chart": { renderer: "pie", extra: {} },
//   "Doughnut Chart": { renderer: "doughnut", extra: {} },
//   "Radar Chart": { renderer: "radar", extra: {} },
//   "Polar Area Chart": { renderer: "polarArea", extra: {} },
//   "Bubble Chart": { renderer: "bubble", extra: {} },
//   "Scatter Chart": { renderer: "scatter", extra: {} },
//   "Area Chart": { renderer: "line", extra: { fill: true } },
//   "Stacked Area Chart": { renderer: "line", extra: { fill: true, scales: { x: { stacked: true }, y: { stacked: true } } } },
//   "Mixed Chart": { renderer: "mixed", extra: {} },
// };

// const CHART_CATEGORIES = {
//   "Bar Charts": ["Bar Chart", "Horizontal Bar Chart", "Stacked Bar Chart"],
//   "Line Charts": ["Line Chart", "Multi-line Chart", "Stepped Line Chart", "Area Chart", "Stacked Area Chart"],
//   "Circular Charts": ["Pie Chart", "Doughnut Chart", "Radar Chart", "Polar Area Chart"],
//   "Point Charts": ["Scatter Chart", "Bubble Chart"],
//   "Special Charts": ["Mixed Chart"],
// };

// const DEFAULT_CHART_TYPES = Object.values(CHART_CATEGORIES).flat();

// function pickColor(i, theme = "light") {
//   if (theme === "dark") {
//     const darkColors = [
//       "rgba(100, 255, 100, 0.8)", // Bright green
//       "rgba(255, 100, 100, 0.8)", // Bright red
//       "rgba(100, 200, 255, 0.8)", // Bright blue
//       "rgba(255, 255, 100, 0.8)", // Bright yellow
//       "rgba(200, 100, 255, 0.8)", // Purple
//       "rgba(255, 150, 50, 0.8)",  // Orange
//       "rgba(100, 255, 255, 0.8)", // Cyan
//     ];
//     return darkColors[i % darkColors.length];
//   } else {
//     const lightColors = [
//       "rgba(34, 139, 34, 0.8)",   // Forest green
//       "rgba(70, 130, 180, 0.8)",  // Steel blue
//       "rgba(255, 140, 0, 0.8)",   // Dark orange
//       "rgba(147, 112, 219, 0.8)", // Medium purple
//       "rgba(50, 205, 50, 0.8)",   // Lime green
//       "rgba(220, 20, 60, 0.8)",   // Crimson
//       "rgba(30, 144, 255, 0.8)",  // Dodger blue
//     ];
//     return lightColors[i % lightColors.length];
//   }
// }

// export default function ChartBuilder({ fileObject, theme = "light" }) {
//   const parsedData = fileObject?.parsedData || [];
//   const parsedSample = fileObject?.parsedSample || [];
//   const chartRef = useRef(null);

//   // Theme-based styles
//   const themeStyles = useMemo(() => {
//     const base = {
//       bg: theme === "dark" ? "bg-gray-900" : "bg-white",
//       text: theme === "dark" ? "text-green-100" : "text-gray-800",
//       border: theme === "dark" ? "border-green-700" : "border-green-300",
//       button: theme === "dark" ? "bg-green-700 hover:bg-green-600 text-white" : "bg-green-500 hover:bg-green-400 text-white",
//       card: theme === "dark" ? "bg-gray-800 border-green-700" : "bg-green-50 border-green-200",
//       input: theme === "dark" ? "bg-gray-700 border-green-600 text-green-100" : "bg-white border-green-300 text-gray-800",
//     };
//     return base;
//   }, [theme]);

//   // Chart.js theme configuration
//   const chartThemeConfig = useMemo(() => ({
//     color: theme === "dark" ? "#bbf7d0" : "#166534", // green-100 vs green-900 equivalent
//     gridColor: theme === "dark" ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.2)",
//     fontColor: theme === "dark" ? "#bbf7d0" : "#166534",
//   }), [theme]);

//   const columns = useMemo(() => {
//     if (!parsedData || parsedData.length === 0) return [];
//     const first = parsedData[0];
//     return Object.keys(first);
//   }, [parsedData]);

//   const numericColumns = useMemo(() => {
//     const numeric = new Set();
//     if (!parsedData || parsedData.length === 0) return [];
//     const sampleRows = parsedData.slice(0, 100);
//     columns.forEach((col) => {
//       let numericCount = 0;
//       let totalChecked = 0;
//       for (const r of sampleRows) {
//         const v = r[col];
//         if (v === null || v === undefined) continue;
//         totalChecked++;
//         const cleaned = ("" + v).toString().replace(/,/g, "").trim();
//         if (cleaned === "") continue;
//         if (!Number.isNaN(Number(cleaned))) numericCount++;
//       }
//       if (totalChecked > 0 && numericCount / totalChecked > 0.75) {
//         numeric.add(col);
//       }
//     });
//     return Array.from(numeric);
//   }, [parsedData, columns]);

//   const [chartType, setChartType] = useState(DEFAULT_CHART_TYPES[0]);
//   const [xColumn, setXColumn] = useState(() => columns[0] || "");
//   const [yColumns, setYColumns] = useState(() => numericColumns.slice(0, 1));
//   const [aggregateBy, setAggregateBy] = useState("none");
//   const [activeCategory, setActiveCategory] = useState("Bar Charts");

//   useEffect(() => {
//     setXColumn((prev) => (columns.includes(prev) ? prev : columns[0] || ""));
//     setYColumns((prev) => {
//       const filtered = prev.filter((c) => numericColumns.includes(c));
//       return filtered.length ? filtered : numericColumns.slice(0, 1);
//     });
//   }, [columns.length, numericColumns.length]);

//   function buildChartData() {
//     if (!xColumn || parsedData.length === 0) return { labels: [], datasets: [] };

//     const needsCategoryAggregate = ["Pie Chart", "Doughnut Chart", "Radar Chart", "Polar Area Chart"].includes(chartType);

//     const xIsNumeric = numericColumns.includes(xColumn);

//     if (needsCategoryAggregate) {
//       const y = yColumns[0];
//       const map = new Map();
//       parsedData.forEach((row) => {
//         const xRaw = row[xColumn];
//         const yRaw = parseFloat((row[y] ?? "").toString().replace(/,/g, "")) || 0;
//         const key = xRaw === null || xRaw === undefined ? "null" : String(xRaw);
//         if (!map.has(key)) map.set(key, { sum: 0, count: 0 });
//         const o = map.get(key);
//         o.sum += yRaw;
//         o.count += 1;
//       });
//       const labels = Array.from(map.keys()).slice(0, 100);
//       const data = labels.map((l) => {
//         const o = map.get(l);
//         if (aggregateBy === "avg") return o.sum / o.count;
//         if (aggregateBy === "count") return o.count;
//         return o.sum;
//       });
//       return {
//         labels,
//         datasets: [
//           {
//             label: y,
//             data,
//             backgroundColor: labels.map((_, i) => pickColor(i, theme)),
//             borderColor: theme === "dark" ? "#bbf7d0" : "#166534",
//             borderWidth: 1,
//           },
//         ],
//       };
//     }

//     if (chartType === "Scatter Chart") {
//       const y = yColumns[0];
//       const scatterPoints = parsedData
//         .map((r) => {
//           const xVal = parseFloat((r[xColumn] ?? "").toString().replace(/,/g, "")) || null;
//           const yVal = parseFloat((r[y] ?? "").toString().replace(/,/g, "")) || null;
//           if (xVal === null || yVal === null) return null;
//           return { x: xVal, y: yVal };
//         })
//         .filter(Boolean);
//       return {
//         labels: scatterPoints.map((p, i) => i),
//         datasets: [
//           {
//             label: `${y} vs ${xColumn}`,
//             data: scatterPoints,
//             backgroundColor: pickColor(0, theme),
//             borderColor: chartThemeConfig.color,
//             borderWidth: 1,
//           },
//         ],
//       };
//     }

//     if (chartType === "Bubble Chart") {
//       const y = yColumns[0] || numericColumns[0];
//       const sizeCol = numericColumns[1] || y;
//       const points = parsedData
//         .map((r) => {
//           const xVal = parseFloat((r[xColumn] ?? "").toString().replace(/,/g, "")) || 0;
//           const yVal = parseFloat((r[y] ?? "").toString().replace(/,/g, "")) || 0;
//           const rVal = Math.max(2, (parseFloat((r[sizeCol] ?? "").toString().replace(/,/g, "")) || 1) / 10);
//           return { x: xVal, y: yVal, r: rVal };
//         })
//         .slice(0, 1000);
//       return {
//         labels: points.map((_, i) => i),
//         datasets: [{
//           label: `${y} bubble`,
//           data: points,
//           backgroundColor: pickColor(0, theme),
//           borderColor: chartThemeConfig.color,
//           borderWidth: 1,
//         }],
//       };
//     }

//     const labels = parsedData.map((r) => {
//       const raw = r[xColumn];
//       return raw === null || raw === undefined ? "" : String(raw);
//     });

//     const datasets = yColumns.map((yCol, idx) => {
//       const data = parsedData.map((r) => {
//         const v = r[yCol];
//         if (v === null || v === undefined) return null;
//         const cleaned = ("" + v).replace(/,/g, "").trim();
//         const num = Number(cleaned);
//         return Number.isNaN(num) ? null : num;
//       });
      
//       const baseDataset = {
//         label: yCol,
//         data,
//         borderColor: pickColor(idx, theme),
//         backgroundColor: pickColor(idx, theme) + (chartType.includes("Area") ? "80" : "80"),
//         borderWidth: 2,
//         pointBackgroundColor: pickColor(idx, theme),
//         pointBorderColor: chartThemeConfig.color,
//         pointBorderWidth: 1,
//         fill: chartType === "Area Chart" || chartType === "Stacked Area Chart" ||
//               (CHART_OPTIONS[chartType] && CHART_OPTIONS[chartType].extra.fill),
//       };

//       if (chartType === "Stepped Line Chart") {
//         baseDataset.stepped = true;
//       }

//       return baseDataset;
//     });

//     return { labels, datasets };
//   }

//   const chartData = useMemo(buildChartData, [parsedData, chartType, xColumn, yColumns, aggregateBy, theme]);

//   const chartOptions = useMemo(() => {
//     const baseOptions = {
//       responsive: true,
//       maintainAspectRatio: false,
//       plugins: {
//         legend: {
//           position: "top",
//           labels: {
//             color: chartThemeConfig.fontColor,
//             font: { size: 12 },
//             usePointStyle: true,
//           },
//         },
//         title: {
//           display: true,
//           text: `${chartType} - ${fileObject?.originalName || "Chart"}`,
//           color: chartThemeConfig.fontColor,
//           font: { size: 16, weight: "bold" },
//         },
//         tooltip: {
//           backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
//           titleColor: chartThemeConfig.fontColor,
//           bodyColor: chartThemeConfig.fontColor,
//           borderColor: chartThemeConfig.color,
//           borderWidth: 1,
//         },
//       },
//       scales: {
//         x: {
//           ticks: { color: chartThemeConfig.fontColor },
//           grid: { color: chartThemeConfig.gridColor },
//         },
//         y: {
//           ticks: { color: chartThemeConfig.fontColor },
//           grid: { color: chartThemeConfig.gridColor },
//         },
//       },
//     };

//     const extraOptions = CHART_OPTIONS[chartType]?.extra || {};
    
//     // Handle stacked charts
//     if (chartType.includes("Stacked")) {
//       if (!baseOptions.scales.x.stacked) baseOptions.scales.x.stacked = true;
//       if (!baseOptions.scales.y.stacked) baseOptions.scales.y.stacked = true;
//     }

//     return {
//       ...baseOptions,
//       ...extraOptions,
//       indexAxis: extraOptions.indexAxis || undefined,
//     };
//   }, [chartType, chartThemeConfig, theme, fileObject?.originalName]);

//   function toggleYColumn(col) {
//     setYColumns((prev) => {
//       if (prev.includes(col)) return prev.filter((c) => c !== col);
//       return [...prev, col];
//     });
//   }

//   function selectAllNumeric() {
//     setYColumns(numericColumns);
//   }

//   function clearAllYColumns() {
//     setYColumns([]);
//   }

//   function exportPNG() {
//     try {
//       const chart = chartRef.current;
//       const canvas = chart?.canvas || chart?.chartInstance?.canvas || (chart?._chart && chart._chart.canvas);
//       if (!canvas) {
//         console.warn("No canvas found for export");
//         return;
//       }
//       canvas.toBlob((blob) => {
//         saveAs(blob, `${fileObject.originalName || "chart"}.png`);
//       });
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   function renderChart() {
//     const renderer = CHART_OPTIONS[chartType]?.renderer || "bar";
    
//     if (chartType === "Mixed Chart") {
//       const mixedData = {
//         labels: chartData.labels,
//         datasets: chartData.datasets.map((d, i) => ({
//           ...d,
//           type: i % 2 === 0 ? "bar" : "line",
//         })),
//       };
//       return <Bar ref={chartRef} options={chartOptions} data={mixedData} />;
//     }

//     const chartProps = { ref: chartRef, options: chartOptions, data: chartData };

//     switch (renderer) {
//       case "bar": return <Bar {...chartProps} />;
//       case "line": return <Line {...chartProps} />;
//       case "pie": return <Pie {...chartProps} />;
//       case "doughnut": return <Doughnut {...chartProps} />;
//       case "radar": return <Radar {...chartProps} />;
//       case "polarArea": return <PolarArea {...chartProps} />;
//       case "scatter": return <Scatter {...chartProps} />;
//       case "bubble": return <Bubble {...chartProps} />;
//       default: return <Bar {...chartProps} />;
//     }
//   }

//   return (
//     <div className={`p-6 rounded-xl shadow-lg ${themeStyles.bg} ${themeStyles.text} transition-colors duration-300`}>
//       {/* Header */}
//       <div className="mb-6">
//         <h2 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-green-300" : "text-green-700"}`}>
//           Chart Builder
//         </h2>
//         <p className="text-sm opacity-80">
//           {fileObject?.originalName || "No file loaded"} • {parsedData.length} rows • {columns.length} columns
//         </p>
//       </div>

//       <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
//         {/* Chart Type Selection */}
//         <div className={`xl:col-span-1 p-4 rounded-lg border-2 ${themeStyles.card} ${themeStyles.border}`}>
//           <label className="block text-sm font-semibold mb-3">Chart Type</label>
          
//           {/* Category Tabs */}
//           <div className="flex flex-wrap gap-1 mb-3">
//             {Object.keys(CHART_CATEGORIES).map((category) => (
//               <button
//                 key={category}
//                 onClick={() => setActiveCategory(category)}
//                 className={`px-3 py-1 text-xs rounded-full transition-colors ${
//                   activeCategory === category
//                     ? themeStyles.button
//                     : theme === "dark"
//                       ? "bg-gray-700 text-green-200"
//                       : "bg-gray-200 text-gray-700"
//                 }`}
//               >
//                 {category}
//               </button>
//             ))}
//           </div>

//           {/* Chart Type Buttons */}
//           <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
//             {CHART_CATEGORIES[activeCategory]?.map((type) => (
//               <button
//                 key={type}
//                 onClick={() => setChartType(type)}
//                 className={`p-3 rounded-lg text-left transition-all ${
//                   chartType === type
//                     ? themeStyles.button
//                     : theme === "dark"
//                     ? "bg-gray-700 hover:bg-gray-600"
//                     : "bg-gray-100 hover:bg-gray-200"
//                 }`}
//               >
//                 <span className="font-medium">{type}</span>
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Data Configuration */}
//         <div className={`xl:col-span-3 p-4 rounded-lg border-2 ${themeStyles.card} ${themeStyles.border}`}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {/* X Axis Selection */}
//             <div>
//               <label className="block text-sm font-semibold mb-2">X-Axis (Categories)</label>
//               <div className="relative">
//                 <select
//                   value={xColumn}
//                   onChange={(e) => setXColumn(e.target.value)}
//                   className={`w-full p-3 rounded-lg border-2 ${themeStyles.input} appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
//                 >
//                   {columns.map((col) => (
//                     <option key={col} value={col}>{col}</option>
//                   ))}
//                 </select>
//                 <div className="absolute right-3 top-3 pointer-events-none">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//             </div>

//             {/* Y Axis Selection */}
//             <div>
//               <label className="block text-sm font-semibold mb-2">Y-Axis (Values)</label>
//               <div className="relative">
//                 <select
//                   multiple
//                   value={yColumns}
//                   onChange={(e) => setYColumns(Array.from(e.target.selectedOptions, option => option.value))}
//                   className={`w-full p-3 rounded-lg border-2 ${themeStyles.input} min-h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent`}
//                   size={5}
//                 >
//                   {columns.map((col) => {
//                     const isNumeric = numericColumns.includes(col);
//                     return (
//                       <option
//                         key={col}
//                         value={col}
//                         disabled={!isNumeric}
//                         className={!isNumeric ? "opacity-50" : ""}
//                       >
//                         {col} {!isNumeric && "(non-numeric)"}
//                       </option>
//                     );
//                   })}
//                 </select>
//                 <div className="absolute right-3 top-3 pointer-events-none">
//                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                   </svg>
//                 </div>
//               </div>
//               <div className="flex gap-2 mt-2">
//                 <button
//                   onClick={selectAllNumeric}
//                   className={`px-3 py-1 text-xs rounded ${themeStyles.button}`}
//                 >
//                   Select All Numeric
//                 </button>
//                 <button
//                   onClick={clearAllYColumns}
//                   className={`px-3 py-1 text-xs rounded ${
//                     theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
//                   }`}
//                 >
//                   Clear All
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Advanced Options */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-opacity-30">
//             <div>
//               <label className="block text-sm font-semibold mb-2">Aggregation</label>
//               <select
//                 value={aggregateBy}
//                 onChange={(e) => setAggregateBy(e.target.value)}
//                 className={`w-full p-2 rounded-lg border ${themeStyles.input}`}
//               >
//                 <option value="none">Sum</option>
//                 <option value="avg">Average</option>
//                 <option value="count">Count</option>
//               </select>
//             </div>
            
//             <div className="md:col-span-2 flex items-end gap-4">
//               <button
//                 onClick={exportPNG}
//                 className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${themeStyles.button}`}
//               >
//                 Export PNG
//               </button>
              
//               <div className="flex-1 text-xs opacity-75">
//                 {yColumns.length > 0 ? (
//                   <span>Selected: {yColumns.length} column{yColumns.length > 1 ? 's' : ''}</span>
//                 ) : (
//                   <span className="text-red-400">Select at least one Y-axis column</span>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Chart Display */}
//       <div className={`rounded-lg border-2 ${themeStyles.border} p-4`}>
//         <div className="h-96 relative">
//           {parsedData.length > 0 && yColumns.length > 0 ? (
//             renderChart()
//           ) : (
//             <div className="absolute inset-0 flex items-center justify-center">
//               <div className="text-center">
//                 <svg className="w-16 h-16 mx-auto opacity-50" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                 </svg>
//                 <p className="mt-2 text-lg font-medium">Configure your chart</p>
//                 <p className="text-sm opacity-75">Select X and Y axis columns to generate your chart</p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Footer Info */}
//       <div className="mt-4 text-xs opacity-60 flex justify-between">
//         <span>Data points: {chartData.labels?.length || 0}</span>
//         <span>Datasets: {chartData.datasets?.length || 0}</span>
//         <span>Theme: {theme}</span>
//       </div>
//     </div>
//   );
// }


// *!newonw
// ChartBuilder.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { saveAs } from "file-saver";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
  BubbleController,
  PieController,
  PolarAreaController,
} from "chart.js";
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter, Bubble } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadarController,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler,
  ScatterController,
  BubbleController,
  PieController,
  PolarAreaController
);

// Enhanced chart options with more types
const CHART_OPTIONS = {
  "Bar Chart": { renderer: "bar", extra: {} },
  "Horizontal Bar Chart": { renderer: "bar", extra: { indexAxis: "y" } },
  "Stacked Bar Chart": { renderer: "bar", extra: { scales: { x: { stacked: true }, y: { stacked: true } } } },
  "Line Chart": { renderer: "line", extra: {} },
  "Multi-line Chart": { renderer: "line", extra: {} },
  "Stepped Line Chart": { renderer: "line", extra: { stepped: true } },
  "Pie Chart": { renderer: "pie", extra: {} },
  "Doughnut Chart": { renderer: "doughnut", extra: {} },
  "Radar Chart": { renderer: "radar", extra: {} },
  "Polar Area Chart": { renderer: "polarArea", extra: {} },
  "Bubble Chart": { renderer: "bubble", extra: {} },
  "Scatter Chart": { renderer: "scatter", extra: {} },
  "Area Chart": { renderer: "line", extra: { fill: true } },
  "Stacked Area Chart": { renderer: "line", extra: { fill: true, scales: { x: { stacked: true }, y: { stacked: true } } } },
  "Mixed Chart": { renderer: "mixed", extra: {} },
};

const CHART_CATEGORIES = {
  "Bar Charts": ["Bar Chart", "Horizontal Bar Chart", "Stacked Bar Chart"],
  "Line Charts": ["Line Chart", "Multi-line Chart", "Stepped Line Chart", "Area Chart", "Stacked Area Chart"],
  "Circular Charts": ["Pie Chart", "Doughnut Chart", "Radar Chart", "Polar Area Chart"],
  "Point Charts": ["Scatter Chart", "Bubble Chart"],
  "Special Charts": ["Mixed Chart"],
};

const DEFAULT_CHART_TYPES = Object.values(CHART_CATEGORIES).flat();

function pickColor(i, theme = "light") {
  if (theme === "dark") {
    const darkColors = [
      "rgba(100, 255, 100, 0.8)", // Bright green
      "rgba(255, 100, 100, 0.8)", // Bright red
      "rgba(100, 200, 255, 0.8)", // Bright blue
      "rgba(255, 255, 100, 0.8)", // Bright yellow
      "rgba(200, 100, 255, 0.8)", // Purple
      "rgba(255, 150, 50, 0.8)",  // Orange
      "rgba(100, 255, 255, 0.8)", // Cyan
    ];
    return darkColors[i % darkColors.length];
  } else {
    const lightColors = [
      "rgba(34, 139, 34, 0.8)",   // Forest green
      "rgba(70, 130, 180, 0.8)",  // Steel blue
      "rgba(255, 140, 0, 0.8)",   // Dark orange
      "rgba(147, 112, 219, 0.8)", // Medium purple
      "rgba(50, 205, 50, 0.8)",   // Lime green
      "rgba(220, 20, 60, 0.8)",   // Crimson
      "rgba(30, 144, 255, 0.8)",  // Dodger blue
    ];
    return lightColors[i % lightColors.length];
  }
}

export default function ChartBuilder({ fileObject, theme = "light" }) {
  const parsedData = fileObject?.parsedData || [];
  const chartRef = useRef(null);

  // Theme-based styles
  const themeStyles = useMemo(() => {
    const base = {
      bg: theme === "dark" ? "bg-gray-900" : "bg-white",
      text: theme === "dark" ? "text-green-100" : "text-gray-800",
      border: theme === "dark" ? "border-green-700" : "border-green-300",
      button: theme === "dark" ? "bg-green-700 hover:bg-green-600 text-white" : "bg-green-500 hover:bg-green-400 text-white",
      card: theme === "dark" ? "bg-gray-800 border-green-700" : "bg-green-50 border-green-200",
      input: theme === "dark" ? "bg-gray-700 border-green-600 text-green-100" : "bg-white border-green-300 text-gray-800",
    };
    return base;
  }, [theme]);

  // Chart.js theme configuration
  const chartThemeConfig = useMemo(() => ({
    color: theme === "dark" ? "#bbf7d0" : "#166534",
    gridColor: theme === "dark" ? "rgba(34, 197, 94, 0.1)" : "rgba(34, 197, 94, 0.2)",
    fontColor: theme === "dark" ? "#bbf7d0" : "#166534",
  }), [theme]);

  // Memoize columns with stable dependency
  const columns = useMemo(() => {
    if (!parsedData || parsedData.length === 0) return [];
    const first = parsedData[0];
    return Object.keys(first);
  }, [parsedData.length]); // Only depend on length, not the entire parsedData array

  // Memoize numeric columns with stable dependency
  const numericColumns = useMemo(() => {
    const numeric = new Set();
    if (!parsedData || parsedData.length === 0) return [];
    
    // Use a smaller sample and stable approach
    const sampleSize = Math.min(50, parsedData.length);
    const sampleRows = parsedData.slice(0, sampleSize);
    
    columns.forEach((col) => {
      let numericCount = 0;
      let totalChecked = 0;
      
      for (const r of sampleRows) {
        const v = r[col];
        if (v === null || v === undefined) continue;
        totalChecked++;
        const cleaned = String(v).replace(/,/g, "").trim();
        if (cleaned === "") continue;
        if (!Number.isNaN(Number(cleaned))) numericCount++;
      }
      
      if (totalChecked > 0 && numericCount / totalChecked > 0.75) {
        numeric.add(col);
      }
    });
    
    return Array.from(numeric);
  }, [parsedData.length, columns.length]); // Depend on lengths only

  const [chartType, setChartType] = useState(DEFAULT_CHART_TYPES[0]);
  const [xColumn, setXColumn] = useState("");
  const [yColumns, setYColumns] = useState([]);
  const [aggregateBy, setAggregateBy] = useState("none");
  const [activeCategory, setActiveCategory] = useState("Bar Charts");

  // Fixed useEffect with proper dependencies and conditions
  useEffect(() => {
    if (columns.length > 0) {
      setXColumn(prev => {
        // Only update if current selection is invalid or empty
        if (!prev || !columns.includes(prev)) {
          return columns[0];
        }
        return prev;
      });
      
      setYColumns(prev => {
        // Only update if current selection is invalid or empty
        const validCurrent = prev.filter(c => numericColumns.includes(c));
        if (validCurrent.length === 0 && numericColumns.length > 0) {
          return numericColumns.slice(0, 1);
        }
        return validCurrent;
      });
    }
  }, [columns, numericColumns]); // These are now stable due to length-based dependencies

  // Initialize state when component mounts or fileObject changes
  useEffect(() => {
    if (columns.length > 0 && !xColumn) {
      setXColumn(columns[0]);
    }
    if (numericColumns.length > 0 && yColumns.length === 0) {
      setYColumns(numericColumns.slice(0, 1));
    }
  }, [columns.length, numericColumns.length]); // Run only when these lengths change

  function buildChartData() {
    if (!xColumn || parsedData.length === 0) return { labels: [], datasets: [] };

    const needsCategoryAggregate = ["Pie Chart", "Doughnut Chart", "Radar Chart", "Polar Area Chart"].includes(chartType);

    if (needsCategoryAggregate) {
      const y = yColumns[0];
      if (!y) return { labels: [], datasets: [] };
      
      const map = new Map();
      parsedData.forEach((row) => {
        const xRaw = row[xColumn];
        const yRaw = parseFloat((row[y] ?? "").toString().replace(/,/g, "")) || 0;
        const key = xRaw === null || xRaw === undefined ? "null" : String(xRaw);
        if (!map.has(key)) map.set(key, { sum: 0, count: 0 });
        const o = map.get(key);
        o.sum += yRaw;
        o.count += 1;
      });
      const labels = Array.from(map.keys()).slice(0, 100);
      const data = labels.map((l) => {
        const o = map.get(l);
        if (aggregateBy === "avg") return o.sum / o.count;
        if (aggregateBy === "count") return o.count;
        return o.sum;
      });
      return {
        labels,
        datasets: [
          {
            label: y,
            data,
            backgroundColor: labels.map((_, i) => pickColor(i, theme)),
            borderColor: theme === "dark" ? "#bbf7d0" : "#166534",
            borderWidth: 1,
          },
        ],
      };
    }

    if (chartType === "Scatter Chart") {
      const y = yColumns[0];
      if (!y) return { labels: [], datasets: [] };
      
      const scatterPoints = parsedData
        .map((r) => {
          const xVal = parseFloat((r[xColumn] ?? "").toString().replace(/,/g, "")) || null;
          const yVal = parseFloat((r[y] ?? "").toString().replace(/,/g, "")) || null;
          if (xVal === null || yVal === null) return null;
          return { x: xVal, y: yVal };
        })
        .filter(Boolean);
      return {
        labels: scatterPoints.map((p, i) => i),
        datasets: [
          {
            label: `${y} vs ${xColumn}`,
            data: scatterPoints,
            backgroundColor: pickColor(0, theme),
            borderColor: chartThemeConfig.color,
            borderWidth: 1,
          },
        ],
      };
    }

    if (chartType === "Bubble Chart") {
      const y = yColumns[0] || numericColumns[0];
      if (!y) return { labels: [], datasets: [] };
      
      const sizeCol = numericColumns[1] || y;
      const points = parsedData
        .map((r) => {
          const xVal = parseFloat((r[xColumn] ?? "").toString().replace(/,/g, "")) || 0;
          const yVal = parseFloat((r[y] ?? "").toString().replace(/,/g, "")) || 0;
          const rVal = Math.max(2, (parseFloat((r[sizeCol] ?? "").toString().replace(/,/g, "")) || 1) / 10);
          return { x: xVal, y: yVal, r: rVal };
        })
        .slice(0, 1000);
      return {
        labels: points.map((_, i) => i),
        datasets: [{
          label: `${y} bubble`,
          data: points,
          backgroundColor: pickColor(0, theme),
          borderColor: chartThemeConfig.color,
          borderWidth: 1,
        }],
      };
    }

    const labels = parsedData.map((r) => {
      const raw = r[xColumn];
      return raw === null || raw === undefined ? "" : String(raw);
    });

    const datasets = yColumns.map((yCol, idx) => {
      const data = parsedData.map((r) => {
        const v = r[yCol];
        if (v === null || v === undefined) return null;
        const cleaned = String(v).replace(/,/g, "").trim();
        const num = Number(cleaned);
        return Number.isNaN(num) ? null : num;
      });
      
      const baseDataset = {
        label: yCol,
        data,
        borderColor: pickColor(idx, theme),
        backgroundColor: pickColor(idx, theme) + (chartType.includes("Area") ? "80" : "80"),
        borderWidth: 2,
        pointBackgroundColor: pickColor(idx, theme),
        pointBorderColor: chartThemeConfig.color,
        pointBorderWidth: 1,
        fill: chartType === "Area Chart" || chartType === "Stacked Area Chart" || 
              (CHART_OPTIONS[chartType] && CHART_OPTIONS[chartType].extra.fill),
      };

      if (chartType === "Stepped Line Chart") {
        baseDataset.stepped = true;
      }

      return baseDataset;
    });

    return { labels, datasets };
  }

  const chartData = useMemo(() => buildChartData(), [parsedData, chartType, xColumn, yColumns, aggregateBy, theme, chartThemeConfig.color]);

  const chartOptions = useMemo(() => {
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: chartThemeConfig.fontColor,
            font: { size: 12 },
            usePointStyle: true,
          },
        },
        title: {
          display: true,
          text: `${chartType} - ${fileObject?.originalName || "Chart"}`,
          color: chartThemeConfig.fontColor,
          font: { size: 16, weight: "bold" },
        },
        tooltip: {
          backgroundColor: theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)",
          titleColor: chartThemeConfig.fontColor,
          bodyColor: chartThemeConfig.fontColor,
          borderColor: chartThemeConfig.color,
          borderWidth: 1,
        },
      },
      scales: {
        x: {
          ticks: { color: chartThemeConfig.fontColor },
          grid: { color: chartThemeConfig.gridColor },
        },
        y: {
          ticks: { color: chartThemeConfig.fontColor },
          grid: { color: chartThemeConfig.gridColor },
        },
      },
    };

    const extraOptions = CHART_OPTIONS[chartType]?.extra || {};
    
    if (chartType.includes("Stacked")) {
      baseOptions.scales.x.stacked = true;
      baseOptions.scales.y.stacked = true;
    }

    return {
      ...baseOptions,
      ...extraOptions,
      indexAxis: extraOptions.indexAxis || undefined,
    };
  }, [chartType, chartThemeConfig, theme, fileObject?.originalName]);

  function toggleYColumn(col) {
    setYColumns((prev) => {
      if (prev.includes(col)) return prev.filter((c) => c !== col);
      return [...prev, col];
    });
  }

  function selectAllNumeric() {
    setYColumns([...numericColumns]);
  }

  function clearAllYColumns() {
    setYColumns([]);
  }

  function exportPNG() {
    try {
      const chart = chartRef.current;
      const canvas = chart?.canvas;
      if (!canvas) {
        console.warn("No canvas found for export");
        return;
      }
      canvas.toBlob((blob) => {
        saveAs(blob, `${fileObject?.originalName || "chart"}.png`);
      });
    } catch (err) {
      console.error(err);
    }
  }

  function renderChart() {
    const renderer = CHART_OPTIONS[chartType]?.renderer || "bar";
    
    if (chartType === "Mixed Chart") {
      const mixedData = {
        labels: chartData.labels,
        datasets: chartData.datasets.map((d, i) => ({
          ...d,
          type: i % 2 === 0 ? "bar" : "line",
        })),
      };
      return <Bar ref={chartRef} options={chartOptions} data={mixedData} />;
    }

    const chartProps = { ref: chartRef, options: chartOptions, data: chartData };

    switch (renderer) {
      case "bar": return <Bar {...chartProps} />;
      case "line": return <Line {...chartProps} />;
      case "pie": return <Pie {...chartProps} />;
      case "doughnut": return <Doughnut {...chartProps} />;
      case "radar": return <Radar {...chartProps} />;
      case "polarArea": return <PolarArea {...chartProps} />;
      case "scatter": return <Scatter {...chartProps} />;
      case "bubble": return <Bubble {...chartProps} />;
      default: return <Bar {...chartProps} />;
    }
  }

  return (
    <div className={`p-6 rounded-xl shadow-lg ${themeStyles.bg} ${themeStyles.text} transition-colors duration-300`}>
      {/* Header */}
      <div className="mb-6">
        <h2 className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-green-300" : "text-green-700"}`}>
          Chart Builder
        </h2>
        <p className="text-sm opacity-80">
          {fileObject?.originalName || "No file loaded"} • {parsedData.length} rows • {columns.length} columns
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-6">
        {/* Chart Type Selection */}
        <div className={`xl:col-span-1 p-4 rounded-lg border-2 ${themeStyles.card} ${themeStyles.border}`}>
          <label className="block text-sm font-semibold mb-3">Chart Type</label>
          
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 mb-3">
            {Object.keys(CHART_CATEGORIES).map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  activeCategory === category 
                    ? themeStyles.button 
                    : theme === "dark" 
                      ? "bg-gray-700 text-green-200" 
                      : "bg-gray-200 text-gray-700"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Chart Type Buttons */}
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
            {CHART_CATEGORIES[activeCategory]?.map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`p-3 rounded-lg text-left transition-all ${
                  chartType === type
                    ? themeStyles.button
                    : theme === "dark"
                    ? "bg-gray-700 hover:bg-gray-600"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                <span className="font-medium">{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Data Configuration */}
        <div className={`xl:col-span-3 p-4 rounded-lg border-2 ${themeStyles.card} ${themeStyles.border}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* X Axis Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">X-Axis (Categories)</label>
              <div className="relative">
                <select 
                  value={xColumn} 
                  onChange={(e) => setXColumn(e.target.value)}
                  className={`w-full p-3 rounded-lg border-2 ${themeStyles.input} appearance-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                >
                  <option value="">Select X-Axis</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Y Axis Selection */}
            <div>
              <label className="block text-sm font-semibold mb-2">Y-Axis (Values)</label>
              <div className="relative">
                <select 
                  multiple
                  value={yColumns}
                  onChange={(e) => setYColumns(Array.from(e.target.selectedOptions, option => option.value))}
                  className={`w-full p-3 rounded-lg border-2 ${themeStyles.input} min-h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  size={5}
                >
                  {columns.map((col) => {
                    const isNumeric = numericColumns.includes(col);
                    return (
                      <option 
                        key={col} 
                        value={col}
                        disabled={!isNumeric}
                        className={!isNumeric ? "opacity-50" : ""}
                      >
                        {col} {!isNumeric && "(non-numeric)"}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-3 top-3 pointer-events-none">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={selectAllNumeric}
                  disabled={numericColumns.length === 0}
                  className={`px-3 py-1 text-xs rounded ${themeStyles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  Select All Numeric
                </button>
                <button 
                  onClick={clearAllYColumns}
                  className={`px-3 py-1 text-xs rounded ${
                    theme === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-opacity-30">
            <div>
              <label className="block text-sm font-semibold mb-2">Aggregation</label>
              <select 
                value={aggregateBy} 
                onChange={(e) => setAggregateBy(e.target.value)}
                className={`w-full p-2 rounded-lg border ${themeStyles.input}`}
              >
                <option value="none">Sum</option>
                <option value="avg">Average</option>
                <option value="count">Count</option>
              </select>
            </div>
            
            <div className="md:col-span-2 flex items-end gap-4">
              <button 
                onClick={exportPNG}
                disabled={!xColumn || yColumns.length === 0}
                className={`px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 ${themeStyles.button} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                Export PNG
              </button>
              
              <div className="flex-1 text-xs opacity-75">
                {yColumns.length > 0 ? (
                  <span>Selected: {yColumns.length} column{yColumns.length > 1 ? 's' : ''}</span>
                ) : (
                  <span className="text-red-400">Select at least one Y-axis column</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className={`rounded-lg border-2 ${themeStyles.border} p-4`}>
        <div className="h-96 relative">
          {parsedData.length > 0 && xColumn && yColumns.length > 0 ? (
            renderChart()
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto opacity-50" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="mt-2 text-lg font-medium">Configure your chart</p>
                <p className="text-sm opacity-75">Select X and Y axis columns to generate your chart</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 text-xs opacity-60 flex justify-between">
        <span>Data points: {chartData.labels?.length || 0}</span>
        <span>Datasets: {chartData.datasets?.length || 0}</span>
        <span>Theme: {theme}</span>
      </div>
    </div>
  );
}