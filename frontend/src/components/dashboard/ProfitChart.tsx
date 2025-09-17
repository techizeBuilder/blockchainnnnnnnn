
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProfitData } from "@/types/arbitrage";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";

interface ProfitChartProps {
  profitData: ProfitData[];
}

type TimeRange = "daily" | "weekly" | "monthly";

const COLORS = ['#8884d8', '#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

const ProfitChart: React.FC<ProfitChartProps> = ({ profitData }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");
  
  // Filter data based on selected time range
  const filteredData = (() => {
    if (!profitData || profitData.length === 0) {
      return [];
    }
    
    const now = new Date();
    switch(timeRange) {
      case "weekly":
        // Last 7 days
        return profitData.slice(-7);
      case "monthly":
        // Last 30 days
        return profitData;
      case "daily":
      default:
        // Last 24 hours - we'll simulate with last 24 entries
        return profitData.slice(-24);
    }
  })();

  // Prepare data for the pie chart - groups profits by day of week
  const preparePieChartData = () => {
    if (!filteredData || filteredData.length === 0) {
      return [];
    }
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayTotals: {[key: string]: number} = {};
    
    // Initialize all days of the week with 0
    daysOfWeek.forEach(day => {
      dayTotals[day] = 0;
    });
    
    // Sum profits by day of week
    filteredData.forEach(item => {
      const date = new Date(item.date);
      const dayOfWeek = daysOfWeek[date.getDay()];
      dayTotals[dayOfWeek] += item.profit;
    });
    
    // Convert to an array suitable for the pie chart
    return Object.entries(dayTotals)
      .filter(([_, value]) => value > 0) // Only include days with profits
      .map(([name, value]) => ({
        name,
        value
      }));
  };

  const pieData = preparePieChartData();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Profit Over Time</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant={timeRange === "daily" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("daily")}
          >
            Daily
          </Button>
          <Button 
            variant={timeRange === "weekly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("weekly")}
          >
            Weekly
          </Button>
          <Button 
            variant={timeRange === "monthly" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("monthly")}
          >
            Monthly
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-[300px]">
            {filteredData.length > 0 ? (
              <ChartContainer config={{}} className="h-full">
                <BarChart data={filteredData}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => {
                      if (!value) return "";
                      const date = new Date(value);
                      return date.getDate().toString();
                    }}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent 
                            className="bg-white p-2 border rounded shadow-md"
                          >
                            <div className="text-sm font-bold">
                              {payload[0].payload.date}
                            </div>
                            <div className="text-sm">
                              Profit: ${parseFloat(payload[0].value as string).toFixed(2)}
                            </div>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="profit" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No profit data available
              </div>
            )}
          </div>
          
          <div className="h-[300px]">
            {pieData.length > 0 ? (
              <ChartContainer config={{}} className="h-full">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent 
                            className="bg-white p-2 border rounded shadow-md"
                          >
                            <div className="text-sm font-bold">
                              {payload[0].name}
                            </div>
                            <div className="text-sm">
                              Profit: ${parseFloat(payload[0].value as string).toFixed(2)}
                            </div>
                          </ChartTooltipContent>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No profit distribution data available
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitChart;
