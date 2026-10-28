import { useEffect, useState } from "react";

import gitRemoteService from "../services/gitRemoteService";
import "../styles/settings.css";

function Settings() {
  const [gitRemote, setGitRemote] = useState(null);
  const [remoteName, setRemoteName] = useState("origin");
  const [remoteUrl, setRemoteUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadGitRemote() {
      try {
        const result = await gitRemoteService.get();
        if (active) {
          setGitRemote(result.gitRemote);
          if (result.gitRemote) {
            setRemoteName(result.gitRemote.name);
            setRemoteUrl(result.gitRemote.url);
          }
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadGitRemote();

    return () => {
      active = false;
    };
  }, []);

  async function handleSave(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    try {
      const result = await gitRemoteService.save({
        name: remoteName,
        url: remoteUrl,
      });
      setGitRemote(result.gitRemote);
      setRemoteName(result.gitRemote.name);
      setRemoteUrl(result.gitRemote.url);
      setMessage("Git remote saved.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setError("");
    setMessage("");
    setSaving(true);

    try {
      await gitRemoteService.remove();
      setGitRemote(null);
      setRemoteName("origin");
      setRemoteUrl("");
      setMessage("Git remote removed.");
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="settings-page surface-card">
      <h2>Settings</h2>
      <p className="muted-text">
        Application preferences will be configured here.
      </p>

      <div className="settings-row">
        <div>
          <h3>Appearance</h3>
          <p className="muted-text mb-0">
            TaskFlow currently uses the default light theme.
          </p>
        </div>

        <span className="settings-status">Light</span>
      </div>

      <div className="settings-row">
        <div>
          <h3>Data storage</h3>
          <p className="muted-text mb-0">
            Persistent database storage will be connected in a later phase.
          </p>
        </div>

        <span className="settings-status">Not connected</span>
      </div>

      <div className="settings-row settings-git-row">
        <div className="settings-git-heading">
          <h3>Git remote</h3>
          <p className="muted-text mb-0">
            Save a repository remote URL to your account. This does not
            authorize GitHub or sync repository data. Do not include access
            tokens or passwords in the URL.
          </p>
        </div>
        <span className="settings-status">
          {loading ? "Loading" : gitRemote ? "Configured" : "Not configured"}
        </span>
      </div>

      {error && (
        <p className="settings-feedback settings-error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="settings-feedback settings-success" role="status">
          {message}
        </p>
      )}

      {gitRemote && (
        <div className="settings-remote-current">
          <span className="settings-remote-name">{gitRemote.name}</span>
          <code className="settings-remote-url">
            {gitRemote.url}
          </code>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={handleRemove}
            disabled={loading || saving}
          >
            Remove remote
          </button>
        </div>
      )}

      <form className="settings-remote-form" onSubmit={handleSave}>
        <label htmlFor="git-remote-name">Remote name</label>
        <input
          id="git-remote-name"
          name="remoteName"
          value={remoteName}
          onChange={(event) => setRemoteName(event.target.value)}
          maxLength={64}
          pattern="[A-Za-z0-9._-]+"
          title="Use letters, numbers, dots, underscores, or hyphens"
          required
          disabled={loading || saving}
        />

        <label htmlFor="git-remote-url">Repository URL</label>
        <input
          id="git-remote-url"
          name="remoteUrl"
          type="text"
          value={remoteUrl}
          onChange={(event) => setRemoteUrl(event.target.value)}
          placeholder="https://github.com/owner/repository.git"
          maxLength={2048}
          required
          disabled={loading || saving}
        />
        <p className="muted-text settings-url-hint">
          HTTPS and SSH remote URLs are supported.
        </p>

        <button
          type="submit"
          className="btn btn-primary btn-sm settings-remote-submit"
          disabled={loading || saving}
        >
          {saving ? "Saving..." : gitRemote ? "Update remote" : "Add remote"}
        </button>
      </form>
    </section>
  );
}

export default Settings;