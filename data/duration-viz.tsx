import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const DurationViz = () => {
  // Duration data from the XML
  const durationsData = [
    { interval: 1, duration: 60, title: "минута", hint: "1м", days: 0, seconds: 60 },
    { interval: 10, duration: 600, title: "10 минут", hint: "10м", days: 0, seconds: 600 },
    { interval: 60, duration: 3600, title: "час", hint: "1ч", days: 0, seconds: 3600 },
    { interval: 24, duration: 86400, title: "день", hint: "1д", days: 1, seconds: 86400 },
    { interval: 7, duration: 604800, title: "неделя", hint: "1н", days: 7, seconds: 604800 },
    { interval: 31, duration: 2678400, title: "месяц", hint: "1М", days: 31, seconds: 2678400 },
    { interval: 4, duration: 8035200, title: "квартал", hint: "1К", days: 93, seconds: 8035200 }
  ];

  // Sort data by duration for better visualization
  const sortedData = [...durationsData].sort((a, b) => a.duration - b.duration);
  
  // Calculate days for each duration if not provided
  sortedData.forEach(item => {
    if (!item.days) {
      item.days = item.duration / 86400;
    }
  });

  const [displayUnit, setDisplayUnit] = useState('days');
  
  const getChartData = () => {
    return sortedData.map(item => ({
      name: item.title,
      hint: item.hint,
      value: displayUnit === 'days' ? item.days : 
             displayUnit === 'hours' ? item.duration / 3600 : 
             displayUnit === 'minutes' ? item.duration / 60 : 
             item.duration
    }));
  };

  const formatValue = (value) => {
    if (displayUnit === 'days') {
      return value < 1 ? value.toFixed(2) : value.toFixed(0);
    } else if (displayUnit === 'hours') {
      return value.toFixed(1);
    } else if (displayUnit === 'minutes') {
      return value.toFixed(0);
    } else {
      return value.toFixed(0);
    }
  };

  const unitSuffix = {
    'days': ' days',
    'hours': ' hrs',
    'minutes': ' min',
    'seconds': ' sec'
  };

  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28'
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-blue-800">MOEX Data Timeframes</h2>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            This chart shows the available time intervals for MOEX data retrieval
          </p>
          <div className="flex space-x-2">
            <label className="text-sm font-medium">Units:</label>
            <select 
              className="text-sm border rounded p-1"
              value={displayUnit}
              onChange={(e) => setDisplayUnit(e.target.value)}
            >
              <option value="days">Days</option>
              <option value="hours">Hours</option>
              <option value="minutes">Minutes</option>
              <option value="seconds">Seconds</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={getChartData()}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <XAxis 
              dataKey="name" 
              fontSize={12}
            />
            <YAxis 
              fontSize={12} 
              tickFormatter={(value) => formatValue(value)}
            />
            <Tooltip 
              formatter={(value) => [
                `${formatValue(value)}${unitSuffix[displayUnit]}`, 
                "Duration"
              ]}
              labelFormatter={(name, entry) => `${name} (${entry[0].payload.hint})`}
            />
            <Bar dataKey="value">
              {getChartData().map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2">Available Data Timeframes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {sortedData.map((item, index) => (
            <div key={index} className="p-3 bg-gray-50 rounded border">
              <div className="font-medium text-blue-700">{item.title} <span className="text-gray-500 text-sm">({item.hint})</span></div>
              <div className="text-sm mt-1">
                <div>Duration: {item.duration} seconds</div>
                <div>Days: {item.days < 1 ? item.days.toFixed(2) : item.days.toFixed(0)}</div>
                <div>Hours: {(item.duration / 3600).toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 p-4 bg-gray-50 rounded border text-sm">
        <p className="font-medium">Data retrieval intervals in MOEX trading system</p>
        <p className="mt-1">
          These timeframes are used for historical data requests, candles generation, 
          and various analytical calculations in the MOEX trading system.
        </p>
      </div>
    </div>
  );
};

export default DurationViz;
