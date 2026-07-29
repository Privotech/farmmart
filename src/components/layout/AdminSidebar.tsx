
import Link from 'next/link';

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold">Admin</h2>
      </div>
      <nav>
        <ul>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/dashboard">Dashboard</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/users">Users</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/orders">Orders</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/analytics">Analytics</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/moderation">Moderation</Link>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <Link href="/admin/settings">Settings</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
