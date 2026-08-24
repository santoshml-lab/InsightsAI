import {
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Save,
} from "lucide-react";

function Settings() {
  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="section-heading">
        <div>
          <h2>Settings</h2>
          <p>
            Manage your InsightsAI workspace preferences.
          </p>
        </div>

        <SettingsIcon size={24} />
      </div>

      {/* PROFILE */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <User size={20} />
          </div>

          <div>
            <h3>Profile</h3>
            <p>
              Manage your account information.
            </p>
          </div>
        </div>

        <div className="settings-form">

          <div className="form-group">
            <label>Name</label>

            <input
              type="text"
              placeholder="Your name"
              defaultValue="InsightsAI User"
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="your@email.com"
            />
          </div>

        </div>
      </div>

      {/* NOTIFICATIONS */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <Bell size={20} />
          </div>

          <div>
            <h3>Notifications</h3>
            <p>
              Control analytics and AI notifications.
            </p>
          </div>
        </div>

        <div className="setting-row">

          <div>
            <strong>AI Analysis Notifications</strong>

            <p>
              Get notified when dataset analysis is complete.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              defaultChecked
            />

            <span className="slider"></span>
          </label>

        </div>

        <div className="setting-row">

          <div>
            <strong>AI Insights</strong>

            <p>
              Receive notifications when new insights are generated.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              defaultChecked
            />

            <span className="slider"></span>
          </label>

        </div>

      </div>

      {/* APPEARANCE */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <Palette size={20} />
          </div>

          <div>
            <h3>Appearance</h3>
            <p>
              Customize the look of your workspace.
            </p>
          </div>
        </div>

        <div className="setting-row">

          <div>
            <strong>Theme</strong>

            <p>
              Choose your preferred interface theme.
            </p>
          </div>

          <select defaultValue="dark">
            <option value="dark">
              Dark
            </option>

            <option value="light">
              Light
            </option>

            <option value="system">
              System
            </option>
          </select>

        </div>

      </div>

      {/* SECURITY */}
      <div className="settings-card">

        <div className="settings-card-header">
          <div className="settings-icon">
            <Shield size={20} />
          </div>

          <div>
            <h3>Security</h3>
            <p>
              Keep your analytics workspace secure.
            </p>
          </div>
        </div>

        <div className="setting-row">

          <div>
            <strong>Data Privacy</strong>

            <p>
              Your uploaded datasets are processed for analysis.
            </p>
          </div>

          <span className="status-badge">
            Protected
          </span>

        </div>

      </div>

      {/* SAVE BUTTON */}
      <div className="settings-actions">

        <button
          className="save-settings-button"
          type="button"
          onClick={() =>
            alert("Settings saved successfully!")
          }
        >
          <Save size={17} />

          Save Settings
        </button>

      </div>

    </div>
  );
}

export default Settings;
