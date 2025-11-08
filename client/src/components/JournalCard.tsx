import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Eye } from "lucide-react";

interface JournalCardProps {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  preview: string;
  onClick: () => void;
}

const JournalCard = ({ date, mood, emoji, preview, onClick }: JournalCardProps) => {
  return (
    <Card className="mood-card hover:scale-[1.02] cursor-pointer" onClick={onClick}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{emoji}</span>
            <span className="text-sm font-medium text-foreground">{mood}</span>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-2">
          <p className="text-foreground/70 text-sm leading-relaxed line-clamp-3">
            {preview}
          </p>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            <Eye className="w-4 h-4 mr-1" />
            View Full Entry
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default JournalCard;