
import Link from 'next/link';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-emerald-800 text-white h-screen sticky top-0 border-r border-emerald-600 shadow-xl">
      <div className="p-6 border-b border-emerald-600">
        <h2 className="text-2xl font-bold">FarmMart Admin</h2>
      </div>
      <nav className="py-4">
        <ul className="space-y-1 px-3">
          <li className="rounded-xl hover:bg-emerald-700 transition">
            <Link href="/admin/dashboard" className="block px-4 py-3 font-semibold">Dashboard</Link>
          </li>
          <li className="rounded-xl hover:bg-emerald-700 transition">
            <Link href="/admin/users" className="block px-4 py-3 font-semibold">Users</Link>
          </li>
          <li className="rounded-xl hover:bg-emerald-700 transition">
            <Link href="/admin/orders" className="block px-4 py-3 font-semibold">Orders</Link>
          </li>
          <li className="rounded-xl hover:bg-emerald-700 transition">
            <Link href="/admin/analytics" className="block px-4 py-3 font-semibold">Analytics</Link>
          </li>
          <li className="rounded-xl hover:bg-emerald-700 transition">
            <Link href="/admin/moderation" className="block px-4 py-3 font-semibold">Moderation</Link>
          </li>
          <li className="rounded-xl hover:bg-emerald-700 transition">
            <Link href="/admin/settings" className="block px-4 py-3 font-semibold">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
