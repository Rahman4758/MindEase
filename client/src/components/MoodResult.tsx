import { Card } from "@/components/ui/card";

interface MoodResultProps {
  mood: string;
  emoji: string;
  advice: string;
  quote: string;
}

const MoodResult = ({ mood, emoji, advice, quote }: MoodResultProps) => {
  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case 'happy':
        return 'bg-mood-happy border-mood-happy/30';
      case 'content':
        return 'bg-mood-content border-mood-content/30';
      case 'neutral':
        return 'bg-mood-neutral border-mood-neutral/30';
      case 'sad':
        return 'bg-mood-sad border-mood-sad/30';
      case 'anxious':
        return 'bg-mood-anxious border-mood-anxious/30';
      default:
        return 'bg-therapy-calm border-therapy-calm/30';
    }
  };

  return (
    <Card className={`p-6 ${getMoodColor(mood)} border-2 transition-all duration-300`}>
      <div className="space-y-4">
        {/* Mood Display */}
        <div className="text-center">
          <div className="text-4xl mb-2">{emoji}</div>
          <h3 className="text-xl font-semibold text-foreground mb-1">
            Detected Mood: {mood}
          </h3>
        </div>

        {/* Advice Section */}
        <div className="space-y-3">
          <div className="bg-card/60 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              💡 Gentle Advice
            </h4>
            <p className="text-foreground/80 leading-relaxed">{advice}</p>
          </div>

          {/* Quote Section */}
          <div className="bg-card/60 rounded-lg p-4">
            <h4 className="font-medium text-foreground mb-2 flex items-center">
              ✨ Affirmation for You
            </h4>
            <blockquote className="italic text-foreground/80 leading-relaxed">
              "{quote}"
            </blockquote>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MoodResult;