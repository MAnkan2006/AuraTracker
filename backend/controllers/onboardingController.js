const User = require('../models/User');
const academicKnowledgeService = require('../services/academicKnowledgeService');

exports.getOnboarding = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      academicProfile: user.academicProfile,
      onboardingComplete: user.onboardingComplete
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveOnboarding = async (req, res) => {
  try {
    const { college, department, semester, academicSession, university, program } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.academicProfile = {
      college,
      department,
      semester,
      academicSession,
      university,
      program
    };
    user.onboardingComplete = true;
    
    await user.save();

    // Trigger async syllabus fetching in background (fire-and-forget)
    academicKnowledgeService.getOrFetch(college, department, semester, university).catch(err => {
      console.error("[Onboarding] Background syllabus fetch failed:", err);
    });

    res.json({ 
      success: true, 
      message: 'Onboarding complete', 
      academicProfile: user.academicProfile 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
