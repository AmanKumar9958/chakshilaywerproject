import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import './admin.css';

const AdminLayout = () => {
	const [collapsed, setCollapsed] = useState(false);

	return (
		<div className="admin-root">
			<AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
			<div className={`admin-main ${collapsed ? 'collapsed' : ''}`}>
				<header className="admin-topbar">
					<div className="admin-topbar-left">Admin Console</div>
					<div className="admin-topbar-right">Welcome, Admin</div>
				</header>
				<main className="admin-content">
					<Outlet />
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
