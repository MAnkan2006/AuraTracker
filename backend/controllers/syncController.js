const AppState = require('../models/AppState');

/**
 * GET /api/sync
 * Retrieve the current user's state.
 */
exports.getState = async (req, res) => {
  try {
    const state = await AppState.findOne({ userId: req.user.userId });
    if (!state) {
      return res.json({
        success: true,
        state: null,
        message: 'No state found.'
      });
    }
    res.json({
      success: true,
      state
    });
  } catch (err) {
    console.error('[SyncController] getState error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * POST /api/sync
 * Save or update the user's state.
 */
exports.saveState = async (req, res) => {
  try {
    const { state } = req.body;
    if (!state) {
      return res.status(400).json({
        success: false,
        message: 'State payload is required.'
      });
    }

    const userId = req.user.userId;

    const updatedState = await AppState.findOneAndUpdate(
      { userId },
      { 
        $set: { 
          selectedTheme: state.selectedTheme,
          selectedFont: state.selectedFont,
          routineView: state.routineView,
          activeRoutineDay: state.activeRoutineDay,
          todos: state.todos,
          attendance: state.attendance
        } 
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'State saved successfully',
      state: updatedState
    });
  } catch (err) {
    console.error('[SyncController] saveState error:', err);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
