import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, Filter } from "lucide-react";
import JournalCard from "@/components/JournalCard";
import Navbar from "@/components/Navbar";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);

  //mood filter
  const [selectedMood, setSelectedMood] = useState(""); // "" = no filter
  const [showMoodDropdown, setShowMoodDropdown] = useState(false);

   const [page, setPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);


const fetchJournalEntries = useCallback(async () => {
  try {
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:5000/api/history", {
      params: {
        search: searchTerm || undefined,
        mood: selectedMood || undefined, 
        page,
        limit:6,
      },
      headers:{
         Authorization: `Bearer ${token}`,
      },
      withCredentials: true, // only if you use cookies/auth
    });

    setJournalEntries(response.data.entries || []);
    setTotalPages(response.data.totalPages || 1);
  } catch (error) {
    console.error("Error fetching journal entries:", error);
  } finally {
    setLoading(false);
  }
}, [searchTerm, selectedMood,page]);


  // ✅ Debounce search + filter
useEffect(() => {
  const timeout = setTimeout(() => {
    fetchJournalEntries();
  }, 500);  //// wait 500ms after user stops typing
   return () => clearTimeout(timeout);
   
}, [searchTerm, selectedMood, page,fetchJournalEntries]);
  

  const handleEntryClick = (entry: any) => {
    setSelectedEntry(entry);
  };


  const closeModal = () => {
    setSelectedEntry(null);
  };

  const filteredEntries = journalEntries; 
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground">Journal History</h1>
          <p className="text-muted-foreground text-lg">
            Revisit your thoughts and track your emotional journey over time
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="p-6 bg-card/60 backdrop-blur-sm border border-border/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search your entries or moods..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-card/50 border-border/30"
              />
            </div>
            <Button variant="outline" 
                    className="flex items-center space-x-2 relative"
                    onClick={() => setShowMoodDropdown(!showMoodDropdown)}>
              <Filter className="w-4 h-4" />
              <span>Filter by Mood</span>
              {showMoodDropdown && (
    <div className="absolute top-full left-0 mt-2 bg-card border border-border rounded shadow-md z-50 w-40">
      {["happy","sad","angry","anxious","neutral","excited"].map((mood) => (
        <div
          key={mood}
          className="px-4 py-2 hover:bg-primary/10 cursor-pointer"
          onClick={() => {
            setSelectedMood(mood);
            setShowMoodDropdown(false);
            
          }}
        >
          {mood.charAt(0).toUpperCase() + mood.slice(1)}
        </div>
      ))}
      <div
        className="px-4 py-2 hover:bg-primary/10 cursor-pointer text-sm text-muted-foreground"
        onClick={() => {
          setSelectedMood("");
          setShowMoodDropdown(false);
          fetchJournalEntries(); 
        }}
      >
        Clear Filter
      </div>
    </div>
  )}
            </Button>
          </div>
        </Card>

        {/* Journal Entries Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.isArray(filteredEntries) && filteredEntries.map((entry) => (
            <JournalCard
              key={entry.id}
              id={entry.id}
              date={entry.date}
              mood={entry.mood}
              emoji={entry.emoji}
              preview={entry.preview}
              onClick={() => handleEntryClick(entry)}
            />
          ))}
        </div>

        {/* Pagination controls */}
{filteredEntries.length > 0 && (
  <div className="flex justify-center mt-8 space-x-2">
    <Button 
      disabled={page === 1}
      onClick={() => setPage(p => p - 1)}
    >
      Previous
    </Button>
    <span className="px-3 py-2">{page} / {totalPages}</span>
    <Button 
      disabled={page === totalPages}
      onClick={() => setPage(p => p + 1)}
    >
      Next
    </Button>
  </div>
)}

        {filteredEntries.length === 0 && (
          <Card className="p-12 text-center bg-therapy-calm/30 border border-therapy-calm/50">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No entries found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Start journaling to see your entries here"}
            </p>
          </Card>
        )}
      </div>

      {/* Entry Detail Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-card border border-border">
            <div className="p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedEntry.emoji}</span>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{selectedEntry.mood}</h2>
                    <p className="text-muted-foreground">{selectedEntry.date}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={closeModal} className="text-muted-foreground">
                  ✕
                </Button>
              </div>

              {/* Full Entry */}
              <div className="space-y-4">
                <div className="bg-therapy-calm/30 rounded-lg p-4">
                  <h3 className="font-medium text-foreground mb-2">Journal Entry</h3>
                  <p className="text-foreground/80 leading-relaxed">{selectedEntry.fullEntry}</p>
                </div>

                {/* AI Analysis */}
                <div className="space-y-3">
                  <div className="bg-card/60 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      💡 AI Advice
                    </h4>
                    <p className="text-foreground/80 leading-relaxed">{selectedEntry.advice}</p>
                  </div>

                  <div className="bg-card/60 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-2 flex items-center">
                      ✨ Affirmation
                    </h4>
                    <blockquote className="italic text-foreground/80 leading-relaxed">
                      "{selectedEntry.quote}"
                    </blockquote>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default History;