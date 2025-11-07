// import React from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#517cd1", "#00bf63"];

// interface EMIChartProps {
//   principal: number | string;
//   interest: number | string;
//   emi: number | string;
// }

// export default function EMIChart({ principal, interest, emi }: EMIChartProps) {
//   // Safely parse input values
//   const principalNum = parseFloat(
//     typeof principal === "string"
//       ? principal.replace(/[^0-9.-]/g, "")
//       : String(principal)
//   ) || 0;

//   const interestNum = parseFloat(
//     typeof interest === "string"
//       ? interest.replace(/[^0-9.-]/g, "")
//       : String(interest)
//   ) || 0;

//   const emiNum = parseFloat(
//     typeof emi === "string" ? emi.replace(/[^0-9.-]/g, "") : String(emi)
//   ) || 0;

//   const totalAmount = principalNum + interestNum;

//   const data = [
//     { name: "Principal amount", value: principalNum },
//     { name: "Interest amount", value: interestNum },
//   ];

//   const currencyFormat = (value: number) => {
//     if (isNaN(value)) return "₹0";
//     return `₹${value.toLocaleString("en-IN", {
//       maximumFractionDigits: 0,
//     })}`;
//   };

//   const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: any[] }) => {
//     if (active && payload && payload.length) {
//       const data = payload[0];
//       return (
//         <div className="backdrop-blur-sm bg-white/30 p-4 rounded-xl border border-white/30 shadow-lg">
//           <p className="text-black font-medium">{`${data.name}: ${currencyFormat(data.value)}`}</p>
//         </div>
//       );
//     }
//     return null;
//   };

//   return (
//     <div className="relative flex flex-col lg:flex-row justify-between items-start gap-4 w-full p-4 bg-white backdrop-blur-2xl bg-white rounded-3xl shadow-[0_8px_32px_rgba(31,38,135,0.37)] border border-white/20 overflow-hidden">
//       {/* Faint background orbs for glow */}
//       <div className="absolute top-[-50px] left-[-50px] w-32 h-32 bg-green-400/30 rounded-full blur-[60px]"></div>
//       <div className="absolute bottom-[-50px] right-[-50px] w-32 h-32 bg-blue-400/30 rounded-full blur-[60px]"></div>

//       {/* LEFT: Chart */}
//       <div className="w-full h-[300px]">
//         <ResponsiveContainer width={300} height={300}>
//           <PieChart>
//             <Pie
//               data={data}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="45%"
//               innerRadius={80}
//               outerRadius={95}
//               paddingAngle={5}
//               stroke="#ffffff"
//               strokeWidth={1}
//               animationBegin={0}
//               animationDuration={1000}
//               // label={({ name, percent }) =>
//               //   `${name.split(" ")[0]}: ${(percent * 100).toFixed(1)}%`
//               // }
//             >
//               {data.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip content={<CustomTooltip />} />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//         {/* Soft glowing highlight around chart */}
//         <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400/20 to-blue-400/20 blur-sm opacity-50 pointer-events-none"></div>
//       </div>

//       {/* RIGHT: Breakdown */}
//       <div className="w-full lg:w-1/2 z-10">
//         <h2 className="text-2xl pl-3 font-bold text-gray-900 mb-2 font-serif drop-shadow-sm">Loan Breakdown</h2>
//         <div className="backdrop-blur-sm bg-white/20 p-4 rounded-xl border border-white/30 shadow-lg">
//           <div className="grid grid-cols-2 gap-2 text-sm">
//             <div>
//               <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-green-800 font-medium">Monthly EMI</p>
//               <p className="font-bold text-lg text-black break-words">{currencyFormat(emiNum)}</p>
//             </div>
//             <div>
//               <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-green-800 font-medium">Principal amount</p>
//               <p className="font-bold text-lg text-black break-words">{currencyFormat(principalNum)}</p>
//             </div>
//             <div>
//               <p className="text-transparent bg-clip-text bg-gradient-to-r from-green-800 to-blue-800 font-medium">Total interest</p>
//               <p className="font-bold text-lg text-black break-words">{currencyFormat(interestNum)}</p>
//             </div>
//             <div className="col-span-2 mt-4 pt-4 border-t border-white/20">
//               <p className="text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-green-800 font-medium text-xl">Total amount</p>
//               <p className="font-extrabold text-xl text-black break-words">{currencyFormat(totalAmount)}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
