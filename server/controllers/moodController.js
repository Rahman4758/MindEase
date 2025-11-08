
import Journal from "../models/JournalEntry.js";
import moment from "moment";

// Mood text → numeric mapping
const moodScale = {
  anxious: 1,
  sad: 2,
  angry: 2.5,
  neutral: 3,
  happy: 4,
  excited: 5
};

// GET /api/mood/trends?period=weekly|monthly
export const getMoodTrends = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { period = "weekly" } = req.query;

     console.log("🧠 Incoming request:", { userId, period });

    if (!userId) {
       console.warn("⚠️ Missing userId in token");
      return res.status(400).json({ message: "Missing user ID" });
    }
    
     // 🟢 Step 1: Find most recent journal entry
    const latest = await Journal.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select("createdAt");

    if (!latest) {
      return res.json({
        chartData: [],
        averageMood: null,
        bestDay: null,
        trend: "No Data",
      });
    }


    // 🟢 Step 2: Define date range based on last entry, not today's date
    const endDate = moment(latest.createdAt).endOf("day");
    const startDate =
      period === "weekly"
        ? endDate.clone().subtract(6, "days").startOf("day")
        : endDate.clone().subtract(29, "days").startOf("day");

    console.log("📅 Using range:", startDate.format("YYYY-MM-DD"), "→", endDate.format("YYYY-MM-DD"));

    // Fetch journal entries for this user
    const entries = await Journal.find({
      user: userId,
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    }).sort({ createdAt: 1 });

    console.log(`🗂️ Found ${entries.length} journal entries`);

    if (!entries.length) {
      return res.json({
        chartData: [],
        averageMood: null,
        bestDay: null,
        trend: "No Data",
      });
    }

    // Convert moods to numeric scale
    // const moodData = entries.map((e) => ({
    //   date: moment(e.createdAt),
    //   moodValue: moodScale[e.mood?.toLowerCase()] || 3, // default neutral
    // }));
    
    //  const moodData = entries
    //   .filter((e) => e.mood && e.createdAt)
    //   .map((e) => {
    //     const val = moodScale[e.mood?.toLowerCase()] || 3;
    //     console.log(`📝 Entry mood: ${e.mood} → ${val}`);
    //     return {
    //       date: moment(e.createdAt),
    //       moodValue: val,
    //     };
    //   });
    const moodData = entries
      .filter((e) => e.mood)
      .map((e) => ({
        date: moment(e.createdAt),
        moodValue: moodScale[e.mood?.toLowerCase()] || 3,
      }));

       if (!moodData.length) {
      console.warn("⚠️ No valid mood data found in journals");
      return res.json({
        chartData: [],
        averageMood: null,
        bestDay: null,
        trend: "No Data",
      });
    }

    // Group moods by day (weekly) or by week (monthly)
    const groups = {};
    moodData.forEach((entry) => {
      const key =
        period === "weekly"
          ? entry.date.format("ddd") // Mon, Tue, ...
          : `Week ${entry.date.week() - startDate.week() + 1}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry.moodValue);
    });

     console.log("📊 Mood groups:", groups);

    const chartData = Object.entries(groups).map(([label, moods]) => ({
      label,
      mood: moods.reduce((a, b) => a + b, 0) / moods.length,
    }));
    
     console.log("📈 Chart Data:", chartData);

    // Calculate averages and summary stats
    const allMoods = moodData.map((m) => m.moodValue);
    const averageMood =
      allMoods.reduce((a, b) => a + b, 0) / allMoods.length;
    
      console.log("🔹 Average Mood:", averageMood.toFixed(1));

    const bestDay = chartData.reduce(
      (best, current) => (current.mood > best.mood ? current : best),
      chartData[0]
    ).label;
     
    console.log("🏆 Best Day:", bestDay);

    // Determine trend (compare first vs. second half)
    const half = Math.floor(allMoods.length / 2);
    const firstHalfAvg =
      allMoods.slice(0, half).reduce((a, b) => a + b, 0) / (half || 1);
    const secondHalfAvg =
      allMoods.slice(half).reduce((a, b) => a + b, 0) /
      (allMoods.length - half || 1);

    let trend = "Stable";
    if (secondHalfAvg > firstHalfAvg + 0.3) trend = "Improving";
    else if (secondHalfAvg < firstHalfAvg - 0.3) trend = "Declining";

     console.log("📉 Trend check →", { firstHalfAvg, secondHalfAvg, trend });


    // Sort days correctly (for weekly)
    const order = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    if (period === "weekly") {
      chartData.sort(
        (a, b) => order.indexOf(a.label) - order.indexOf(b.label)
      );
    }

      // 🧾 Log before response
    console.log("🧾 Final Data Before Response:", {
      chartData,
      averageMood,
      bestDay,
      trend,
    });
    try{
       res.status(200).json({
        chartData,
        averageMood: parseFloat(averageMood.toFixed(1)),
        bestDay,
        trend,
      });
      }catch(jsonErr) {
      console.error("🚨 JSON serialization error:", jsonErr);
      res
        .status(500)
        .json({
          message: "Failed to send trend data",
          error: jsonErr.message,
        });
      }
    console.log("✅ Trend data sent successfully");
  } catch (error) {
    console.error("Error in getMoodTrends:", error);
    res.status(500).json({ message: "Server error" });
  }
};
