const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper function to generate unique username if needed
async function generateUniqueUsername(email) {
  let baseUsername = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!baseUsername) baseUsername = "user";
  
  let username = baseUsername;
  let counter = 1;
  while (await User.findOne({ username })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }
  return username;
}

// Redirects
exports.googleLogin = (req, res) => {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const backendUrl = req.protocol + '://' + req.get('host');
  const redirectUri = `${backendUrl}/api/auth/google/callback`;
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=profile email`;
  res.redirect(url);
};

exports.githubLogin = (req, res) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const backendUrl = req.protocol + '://' + req.get('host');
  const redirectUri = `${backendUrl}/api/auth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=user:email`;
  res.redirect(url);
};

// Callbacks
exports.googleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const backendUrl = req.protocol + '://' + req.get('host');
    const redirectUri = `${backendUrl}/api/auth/google/callback`;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5500";

    // Exchange code for token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.redirect(`${FRONTEND_URL}?error=google_auth_failed`);
    }

    // Fetch user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.id) {
      return res.redirect(`${FRONTEND_URL}?error=google_profile_failed`);
    }

    let user = await User.findOne({ $or: [{ googleId: profile.id }, { email: profile.email }] });

    if (!user) {
      const username = await generateUniqueUsername(profile.email);
      user = new User({
        username,
        email: profile.email,
        name: profile.name,
        avatar: profile.picture,
        googleId: profile.id,
        bio: "Keep pushing, stay consistent!",
        targetGoal: 75,
        onboardingComplete: false
      });
      await user.save();
    } else if (!user.googleId) {
      // Link account
      user.googleId = profile.id;
      if (!user.avatar && profile.picture) user.avatar = profile.picture;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${FRONTEND_URL}?token=${jwtToken}`);
  } catch (err) {
    console.error("Google Auth Error:", err);
    res.redirect(`${process.env.FRONTEND_URL || "http://127.0.0.1:5500"}?error=server_error`);
  }
};

exports.githubCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const backendUrl = req.protocol + '://' + req.get('host');
    const redirectUri = `${backendUrl}/api/auth/github/callback`;
    const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
    const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://127.0.0.1:5500";

    // Exchange code for token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri
      }),
    });
    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) {
      return res.redirect(`${FRONTEND_URL}?error=github_auth_failed`);
    }

    // Fetch user profile
    const profileRes = await fetch("https://api.github.com/user", {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        "Accept": "application/json"
      },
    });
    const profile = await profileRes.json();

    if (!profile.id) {
      return res.redirect(`${FRONTEND_URL}?error=github_profile_failed`);
    }

    let email = profile.email;
    // GitHub might not return email if it's private. Fetch emails separately if needed.
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { 
          Authorization: `Bearer ${tokenData.access_token}`,
          "Accept": "application/json"
        },
      });
      const emails = await emailRes.json();
      const primaryEmailObj = emails.find(e => e.primary) || emails[0];
      if (primaryEmailObj) email = primaryEmailObj.email;
    }

    if (!email) {
      // Fallback if no email
      email = `${profile.login}@github.com`;
    }

    let user = await User.findOne({ $or: [{ githubId: profile.id.toString() }, { email }] });

    if (!user) {
      const username = await generateUniqueUsername(email);
      user = new User({
        username,
        email,
        name: profile.name || profile.login,
        avatar: profile.avatar_url,
        githubId: profile.id.toString(),
        bio: "Keep pushing, stay consistent!",
        targetGoal: 75,
        onboardingComplete: false
      });
      await user.save();
    } else if (!user.githubId) {
      // Link account
      user.githubId = profile.id.toString();
      if (!user.avatar && profile.avatar_url) user.avatar = profile.avatar_url;
      await user.save();
    }

    const jwtToken = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${FRONTEND_URL}?token=${jwtToken}`);
  } catch (err) {
    console.error("GitHub Auth Error:", err);
    res.redirect(`${process.env.FRONTEND_URL || "http://127.0.0.1:5500"}?error=server_error`);
  }
};
