export default function CategoriesPage() {
  const beautyCategories = ["Nails", "Hair", "Lashes", "Brows", "Skin Care", "Makeup", "Body", "Cosmetic", "Wellness"];
  const itCategories = ["Web Development", "Mobile Apps", "Cloud & DevOps", "Cybersecurity", "Data & Analytics", "IT Support", "AI & ML", "UI/UX Design", "Consulting", "Networking", "E-Commerce", "Digital Marketing"];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Category Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Beauty */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">Beauty Categories ({beautyCategories.length})</h2>
          <div className="space-y-2">
            {beautyCategories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{cat}</span>
                <span className="text-xs text-gray-400">Seeded</span>
              </div>
            ))}
          </div>
        </div>

        {/* IT */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold mb-4">IT Categories ({itCategories.length})</h2>
          <div className="space-y-2">
            {itCategories.map((cat) => (
              <div key={cat} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">{cat}</span>
                <span className="text-xs text-gray-400">Seeded</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TODO: Add/edit/delete categories via API */}
      <p className="text-sm text-gray-400 mt-6">Category editing will be available in a future update.</p>
    </div>
  );
}
