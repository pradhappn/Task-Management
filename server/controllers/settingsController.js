function getGitRemote(req, res) {
  res.status(200).json({
    success: true,
    gitRemote: req.user.gitRemote || null,
  });
}

function isValidRemoteUrl(value) {
  if (/^git@[A-Za-z0-9.-]+:[^\s]+$/.test(value)) {
    return true;
  }

  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "ssh:") &&
      Boolean(url.hostname) &&
      !url.password &&
      (url.protocol !== "https:" || !url.username)
    );
  } catch {
    return false;
  }
}

async function saveGitRemote(req, res, next) {
  try {
    const { name, url } = req.body || {};
    const normalizedName = typeof name === "string" ? name.trim() : "";
    const normalizedUrl = typeof url === "string" ? url.trim() : "";

    if (
      !/^[A-Za-z0-9._-]{1,64}$/.test(normalizedName) ||
      normalizedName === "." ||
      normalizedName === ".."
    ) {
      return res.status(400).json({
        success: false,
        message: "Remote name must use 1–64 letters, numbers, dots, underscores, or hyphens",
      });
    }

    if (
      normalizedUrl.length > 2048 ||
      !isValidRemoteUrl(normalizedUrl)
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid HTTPS, SSH, or Git SSH remote URL",
      });
    }

    req.user.gitRemote = {
      name: normalizedName,
      url: normalizedUrl,
    };
    await req.user.save();

    return res.status(200).json({
      success: true,
      gitRemote: req.user.gitRemote,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteGitRemote(req, res, next) {
  try {
    req.user.gitRemote = null;
    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Git remote removed",
      gitRemote: null,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGitRemote,
  saveGitRemote,
  deleteGitRemote,
};
