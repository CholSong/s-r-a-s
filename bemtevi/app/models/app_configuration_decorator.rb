AppConfiguration.class_eval do
  # Bemtevi
  # Added this new preference to show a simplified admin UI (toogled by configuration).
  # Currently this simplified UI is shown in production mode.
  preference :full_admin_ui, :boolean, :default => true
end