export default function SettingsPage() {
  // TODO: Fetch from API /api/settings
  const settings = [
    { group: "General", items: [
      { key: "site_name", value: "Appilico Market", desc: "Platform name" },
      { key: "support_email", value: "support@appilico.com.au", desc: "Support email" },
      { key: "max_gallery_images", value: "20", desc: "Max gallery images per provider" },
    ]},
    { group: "Moderation", items: [
      { key: "auto_approve_providers", value: "false", desc: "Auto-approve new providers" },
      { key: "review_moderation", value: "true", desc: "Moderate reviews before publishing" },
      { key: "min_review_length", value: "10", desc: "Minimum review character length" },
    ]},
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Platform Settings</h1>

      <div className="space-y-8">
        {settings.map((group) => (
          <div key={group.group} className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">{group.group}</h2>
            <div className="space-y-4">
              {group.items.map((item) => (
                <div key={item.key} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.desc}</p>
                    <p className="text-xs text-gray-400 font-mono">{item.key}</p>
                  </div>
                  <input
                    type="text"
                    defaultValue={item.value}
                    className="w-48 px-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/50 focus:outline-none"
                    readOnly
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-sm text-gray-400 mt-6">Settings editing will be available in a future update.</p>
    </div>
  );
}
