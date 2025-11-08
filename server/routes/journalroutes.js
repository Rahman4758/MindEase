import express from 'express';
const router = express.Router();
import { createJournal, getJournals } from '../controllers/journalController.js';
import protect from '../middleware/authMiddleware.js';

router.post('/',protect, createJournal);//yahan pe  protect lagana h auth enable krne k liye
router.get('/', protect,getJournals);  ////yahan pe  protect lagana h auth enable krne k liye

export default  router;
