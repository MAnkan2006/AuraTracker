const AppState = require('../models/AppState');

/**
 * Normalizes legacy `${date}_${slotId}` attendance keys down to plain `YYYY-MM-DD`
 * with status priority: Absent > Late > Present > Excused > Cancelled.
 */
function normalizeAttendance(attendance) {
  if (!attendance || typeof attendance !== 'object') return {};

  const STATUS_PRIORITY = {
    'Absent': 5, 'a': 5,
    'Late': 4, 'l': 4,
    'Present': 3, 'p': 3,
    'Excused': 2, 'e': 2,
    'Cancelled': 1, 'c': 1
  };

  const normalized = {};

  Object.entries(attendance).forEach(([subject, logs]) => {
    if (!logs || typeof logs !== 'object') return;
    normalized[subject] = {};

    Object.entries(logs).forEach(([key, status]) => {
      const match = key.match(/^(\d{4}-\d{2}-\d{2})(?:_.+)?$/);
      const dateKey = match ? match[1] : key;

      const existingStatus = normalized[subject][dateKey];
      if (!existingStatus) {
        normalized[subject][dateKey] = status;
      } else {
        const existingPriority = STATUS_PRIORITY[existingStatus] || 0;
        const currentPriority = STATUS_PRIORITY[status] || 0;
        if (currentPriority > existingPriority) {
          normalized[subject][dateKey] = status;
        }
      }
    });
  });

  return normalized;
}

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

    const stateObj = state.toObject ? state.toObject() : { ...state };
    if (stateObj.attendance) {
      stateObj.attendance = normalizeAttendance(stateObj.attendance);
    }

    res.json({
      success: true,
      state: stateObj
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
          attendance: state.attendance,
          routine: state.routine
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
