import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, PenTool } from "lucide-react";
import MoodResult from "@/components/MoodResult";
import Navbar from "@/components/Navbar";

const Journal = () => {
  const [entry, setEntry] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [moodResult, setMoodResult] = useState<{
    mood: string;
    emoji: string;
    advice: string;
    quote: string;
  } | null>(null);

  
  const normalizeMood = (mood: string) => {
    if (!mood) return "Neutral";
    const lowerMood = mood.toLowerCase();
    const validMoods = ["happy","sad","angry","anxious","neutral","excited"];
    return validMoods.includes(lowerMood) ? lowerMood : "neutral";
  };

  const getEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "angry": return "😠";
      case "anxious": return "😰";
      case "excited": return "🤩";
      case "neutral": 
      default: return "😐";
    }
  };

  const handleAnalyze = async () => {
    if (!entry.trim()) return;
    
    setIsAnalyzing(true);

    try {
      const token = localStorage.getItem("token"); 
      console.log("Token being sent:", token);
      const response = await fetch("https://mindease-e9jh.onrender.com/api/journals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        
        body: JSON.stringify({ entry }),
       
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log("Backend response:", data);

       const normalizedMood = normalizeMood(data.mood);

      setMoodResult({
        mood: normalizedMood,
        emoji: getEmoji(normalizedMood),
        advice: data.advice,
        quote: data.quote,
      });
      
    } catch (error) {
      console.error("AI analysis failed:", error);
      setMoodResult({
        mood: "Unknown",
        emoji: "❓",
        advice: "Sorry, analysis failed. Please try again later.",
        quote: "",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
    
   
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Today's Journal</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Take a moment to reflect on your thoughts and feelings. Let MindEase help you understand your emotional state.
          </p>
        </div>

        {/* Journal Entry */}
        <Card className="p-8 bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <PenTool className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">Write Your Thoughts</h2>
            </div>
            
            <Textarea
              placeholder="How are you feeling today? What's on your mind? Let your thoughts flow freely..."
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="journal-input text-base"
              rows={8}
            />
            
            <div className="flex justify-center">
              <Button
                onClick={handleAnalyze}
                disabled={!entry.trim() || isAnalyzing}
                className="px-8 py-3 text-lg font-medium bg-primary hover:bg-primary/90 disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Mood Analysis Result */}
        {moodResult && (
          <div className="animate-in slide-in-from-bottom-5 duration-500">
            <MoodResult
              mood={moodResult.mood}
              emoji={moodResult.emoji}
              advice={moodResult.advice}
              quote={moodResult.quote}
            />
          </div>
        )}

        {/* Helpful Tips */}
        {!moodResult && (
          <Card className="p-6 bg-therapy-calm/50 border border-therapy-calm/30">
            <h3 className="font-semibold text-foreground mb-3">💡 Journaling Tips</h3>
            <ul className="space-y-2 text-foreground/80">
              <li>• Write without worrying about grammar or structure</li>
              <li>• Be honest about your feelings - there's no judgment here</li>
              <li>• Include both positive and challenging emotions</li>
              <li>• Consider what triggered your current mood</li>
              <li>• Reflect on what you're grateful for today</li>
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Journal;