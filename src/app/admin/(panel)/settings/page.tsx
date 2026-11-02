import { getAdminSettings } from "@/lib/admin-data";
import { SettingsForm } from "./settings-form";

export default async function SettingsPage() {
  const settings = await getAdminSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-4xl font-black">Details and contact</h1>
      <p className="max-w-2xl text-muted">Everything you change here appears on the website as soon as you press Save changes.</p>
      <SettingsForm settings={settings} />
    </div>
  );
}
