import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Heart, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { toast } from "sonner";

const Affirmations = () => {
  const [affirmation, setAffirmation] = useState("");
  const [category, setCategory] = useState("General");
  const [isGenerating, setIsGenerating] = useState(false);

   const fetchAffirmation = async (cat = "General") => {
    try {
      setIsGenerating(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/affirmations?category=${cat}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      setAffirmation(data.affirmation);
      setCategory(data.category);
    } catch (err) {
      console.error("Error fetching affirmation:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const saveAffirmation = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("http://localhost:5000/api/affirmations/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text: affirmation, category })
      });
      toast.success("💖 Affirmation saved to your favorites!");
      //alert("💖 Affirmation saved to your favorites!");
    } catch (err) {
      console.error("Error saving affirmation:", err);
    }
  };

  const shareAffirmation = () => {
    if (!affirmation) return;
    if (navigator.share) {
      navigator.share({
        title: 'MindEase Affirmation',
        text: affirmation,
      });
    } else {
      navigator.clipboard.writeText(affirmation);
      alert("📋 Copied to clipboard");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Daily Affirmations</h1>
          <p className="text-muted-foreground text-lg">
            Nurture your mind with positive thoughts and gentle reminders of your worth
          </p>
        </div>

        {/* Main Affirmation Card */}
        <div className="flex justify-center">
          <Card className="max-w-2xl w-full p-12 bg-card/20 border-2 border-card/30 backdrop-blur-sm transition-all duration-500">
            <div className="text-center space-y-8">
              {/* Quote Icon */}
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
              </div>

              {/* Affirmation Text */}
              {affirmation ? (
                <div className="space-y-4">
                  <blockquote className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed italic">
                    "{affirmation}"
                  </blockquote>
                  <div className="flex justify-center">
                    <span className="px-4 py-2 bg-card/60 rounded-full text-sm font-medium text-primary border border-primary/20">
                      {category}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-foreground/50 italic">Click below to generate your affirmation ✨</p>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center space-x-4">
                <Button
                  onClick={() => fetchAffirmation(category)}
                  disabled={isGenerating}
                  className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      New Affirmation
                    </>
                  )}
                </Button>

                <Button
                  onClick={shareAffirmation}
                  variant="outline"
                  className="px-6 py-3"
                  disabled={!affirmation}
                >
                  <Share2 className="w-5 h-5 mr-2" />
                  Share
                </Button>

                <Button
                  onClick={saveAffirmation}
                  variant="outline"
                  className="px-6 py-3"
                  disabled={!affirmation}
                >
                  <Heart className="w-5 h-5 mr-2 text-pink-500" />
                  Save
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Affirmation Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {["Self-Worth", "Growth", "Resilience", "Self-Care"].map((cat, index) => (
            <Card
              key={cat}
              onClick={() => fetchAffirmation(cat)}
              className="p-4 bg-card/40 border border-border/50 hover:bg-card/60 transition-colors cursor-pointer"
            >
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {index === 0 && "💝"}
                  {index === 1 && "🌱"}
                  {index === 2 && "💪"}
                  {index === 3 && "🧘‍♀️"}
                </div>
                <h3 className="font-medium text-foreground text-sm">{cat}</h3>
              </div>
            </Card>
          ))}
        </div>

        {/* Mindfulness Tips */}
        <Card className="p-8 bg-therapy-calm/20 border border-therapy-calm/40">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground">How to Use Affirmations</h2>
              <div className="max-w-2xl mx-auto space-y-3 text-foreground/80">
                <p>• Read the affirmation slowly and let the words sink in</p>
                <p>• Take three deep breaths while focusing on the message</p>
                <p>• Repeat the affirmation to yourself throughout the day</p>
                <p>• Write it down in your journal for deeper reflection</p>
                <p>• Believe in the truth of these positive statements about yourself</p>
              </div>
            </div>

            <div className="bg-card/40 rounded-lg p-4 max-w-lg mx-auto">
              <p className="text-sm text-foreground/70 italic">
                "The words you speak to yourself matter. Choose them with the same care you'd use when speaking to someone you love."
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Affirmations;
