//import JournalEntry from "../models/JournalEntry"
import Journal from  '../models/JournalEntry.js';

export const getHistory = async (req, res) => {
  try {
    const { search, mood, page= 1, limit = 5 } = req.query;  //catch dynamic values here
    const query = { user: req.user?._id }; // optional if user login system exists

    if (mood) query.mood = mood;  //agar search me mood paas hua h to add a filter by mood in query
    if (search) query.content = { $regex: search, $options: "i" };  //This checks if user has passed search in query params.

    const skip = (page - 1) * limit;
    
    const entries = await Journal.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

    // Also get total count to calculate total pages
    const totalCount = await Journal.countDocuments(query);

    res.status(200).json({
        entries,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: parseInt(page), 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
}