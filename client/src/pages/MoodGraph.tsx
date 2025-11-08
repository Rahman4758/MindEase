import { useState,useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Calendar, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import Navbar from "@/components/Navbar";
import axios from "axios";

const MoodGraph = () => {
  const [viewType, setViewType] = useState<"weekly" | "monthly">("weekly");
  const [chartType, setChartType] = useState<"line" | "bar">("line");

    // ✅ replaced mock arrays with backend state
  const [data, setData] = useState<any[]>([]);
  const [averageMood, setAverageMood] = useState<number | null>(null);
  const [bestDay, setBestDay] = useState<string | null>(null);
  const [trend, setTrend] = useState<string | null>(null);

  // Mock mood data (in real app, this would come from your backend)
  // const weeklyData = [
  //   { day: "Mon", mood: 3, label: "Content" },
  //   { day: "Tue", mood: 4, label: "Happy" },
  //   { day: "Wed", mood: 2, label: "Sad" },
  //   { day: "Thu", mood: 1, label: "Anxious" },
  //   { day: "Fri", mood: 4, label: "Happy" },
  //   { day: "Sat", mood: 5, label: "Joyful" },
  //   { day: "Sun", mood: 3, label: "Content" },
  // ];

  // const monthlyData = [
  //   { week: "Week 1", mood: 3.2, label: "Content" },
  //   { week: "Week 2", mood: 2.8, label: "Mixed" },
  //   { week: "Week 3", mood: 3.8, label: "Good" },
  //   { week: "Week 4", mood: 4.1, label: "Happy" },
  // ];

  //const data = viewType === "weekly" ? weeklyData : monthlyData;

   useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:5000/api/mood/trends?period=${viewType}`,{
             headers: {
    Authorization: `Bearer ${token}`}
          }
        );
        // Backend gives chartData + summary
        const apiData = res.data.chartData.map((item: any) => ({
          ...item,
          day: item.label, // for weekly
          week: item.label // for monthly
          //  name: item.label,
          //  label: getMoodLabel(item.mood),
        }));
        setData(apiData);
        setAverageMood(res.data.averageMood);
        setBestDay(res.data.bestDay);
        setTrend(res.data.trend);
      } catch (err) {
        console.error("Error fetching mood trends:", err);
      }
    };

    fetchData();
  }, [viewType]);

  const getMoodColor = (mood: number) => {
    if (mood >= 4.5) return "#10B981"; // Happy - Green
    if (mood >= 3.5) return "#06B6D4"; // Content - Cyan
    if (mood >= 2.5) return "#8B5CF6"; // Neutral - Purple
    if (mood >= 1.5) return "#F59E0B"; // Sad - Amber
    return "#EF4444"; // Anxious - Red
  };

  const getMoodLabel = (mood: number) => {
    if (mood >= 4.5) return "Joyful";
    if (mood >= 3.5) return "Happy";
    if (mood >= 2.5) return "Content";
    if (mood >= 1.5) return "Sad";
    return "Anxious";
  };

  //const averageMood = data.reduce((sum, item) => sum + item.mood, 0) / data.length;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-foreground font-medium">{label}</p>
          <p className="text-primary">
            Mood: {data.mood.toFixed(1)} ({data.label})
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Mood Trends</h1>
          <p className="text-muted-foreground text-lg">
            Visualize your emotional journey and identify patterns over time
          </p>
        </div>

        {/* Controls */}
        <Card className="p-6 bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Time Period:</span>
              <div className="flex rounded-lg bg-muted p-1">
                <Button
                  variant={viewType === "weekly" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("weekly")}
                  className="px-4"
                >
                  Weekly
                </Button>
                <Button
                  variant={viewType === "monthly" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setViewType("monthly")}
                  className="px-4"
                >
                  Monthly
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              <span className="font-medium text-foreground">Chart Type:</span>
              <div className="flex rounded-lg bg-muted p-1">
                <Button
                  variant={chartType === "line" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("line")}
                  className="px-4"
                >
                  Line
                </Button>
                <Button
                  variant={chartType === "bar" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                  className="px-4"
                >
                  Bar
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Mood Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-therapy-calm/30 border border-therapy-calm/50">
            <div className="text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-semibold text-foreground mb-1">Average Mood</h3>
              {/* <p className="text-2xl font-bold text-primary">{averageMood.toFixed(1)}</p>
              <p className="text-sm text-muted-foreground">{getMoodLabel(averageMood)}</p> */}
              <p className="text-2xl font-bold text-primary">
               {averageMood !== null ? averageMood.toFixed(1) : "-"}
              </p>
              <p className="text-sm text-muted-foreground">
               {averageMood !== null ? getMoodLabel(averageMood) : "-"}
              </p>

            </div>
          </Card>

          <Card className="p-6 bg-therapy-peace/30 border border-therapy-peace/50">
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-foreground mb-1">Best Day</h3>
              {/* <p className="text-lg font-bold text-success">
                {data.reduce((best, current) => current.mood > best.mood ? current : best)[viewType === "weekly" ? "day" : "week"]}
              </p> */}
              <p className="text-lg font-bold text-success">
  {bestDay || "-"}
</p>
              <p className="text-sm text-muted-foreground">Highest mood recorded</p>
            </div>
          </Card>

          <Card className="p-6 bg-therapy-hope/30 border border-therapy-hope/50">
            <div className="text-center">
              <div className="text-3xl mb-2">📈</div>
              <h3 className="font-semibold text-foreground mb-1">Trend</h3>
              {/* <div className="flex items-center justify-center space-x-1">
                <TrendingUp className="w-5 h-5 text-success" />
                <p className="text-lg font-bold text-success">Improving</p>
              </div>
              <p className="text-sm text-muted-foreground">Overall positive trend</p> */}
              <div className="flex items-center justify-center space-x-1">
  <TrendingUp className="w-5 h-5 text-success" />
  <p className="text-lg font-bold text-success">
    {trend || "-"}
  </p>
</div>
<p className="text-sm text-muted-foreground">Overall {trend ? trend.toLowerCase() : "trend unavailable"}</p>

            </div>
          </Card>
        </div>

        {/* Chart */}
        <Card className="p-8 bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {viewType === "weekly" ? "This Week's" : "This Month's"} Mood Journey
            </h2>
            <p className="text-muted-foreground">
              Scale: 1 (Anxious) → 2 (Sad) → 3 (Content) → 4 (Happy) → 5 (Joyful)
            </p>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === "line" ? (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey={viewType === "weekly" ? "day" : "week"} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    stroke="hsl(var(--muted-foreground))"
                    tickFormatter={(value) => value.toString()}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--primary))"
                    strokeWidth={3}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              ) : (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey={viewType === "weekly" ? "day" : "week"} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <YAxis 
                    domain={[0, 5]} 
                    stroke="hsl(var(--muted-foreground))"
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="mood" 
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Insights */}
        <Card className="p-6 bg-therapy-calm/20 border border-therapy-calm/40">
          <h3 className="font-semibold text-foreground mb-4 flex items-center">
            💡 Insights & Patterns
          </h3>
          <div className="space-y-3 text-foreground/80">
            <p>• Your mood tends to improve towards the weekend - consider what factors contribute to this positive change.</p>
            <p>• You've shown remarkable resilience, bouncing back from challenging days.</p>
            <p>• Your overall trend is positive, indicating healthy emotional growth and self-awareness.</p>
            <p>• Consider noting specific activities or events that correlate with your happiest days.</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MoodGraph;