import mongoose from'mongoose';

const journalEntrySchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId, //explain
        ref:'User',
        required:true
    },
    content: {
         type: String, 
        required:true,
        trim:true,
    },
    mood: {
      type: String,                          
      enum: ["happy","sad","angry","anxious","neutral","excited","Neutral","Happy","Sad","Angry","Anxious","Excited"],
      default: "neutral",
    },
    advice: {
      type: String,                          // AI-generated or manual advice
      default: "",
      trim: true,
    },
   quote: {
      type: String,                          // motivational quote
      default: "",
      trim: true,
    },
},{timestamps:true});

export default mongoose.model('JournalEntry', journalEntrySchema);