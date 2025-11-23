import React from 'react';
import { NavLink } from 'react-router-dom';
import './admin.css';

const AdminSidebar = ({ collapsed, setCollapsed }) => {
	return (
		<aside className={`admin-sidebar ${collapsed ? 'collapsed' : ''}`}>
			<div className="admin-logo">Chakshi Admin</div>
			<nav className="admin-nav">
				<NavLink to="/admin/dashboard" className={({isActive}) => isActive ? 'active' : ''}>Dashboard</NavLink>
				<NavLink to="/admin/users" className={({isActive}) => isActive ? 'active' : ''}>Users</NavLink>
				<NavLink to="/admin/settings" className={({isActive}) => isActive ? 'active' : ''}>Settings</NavLink>
			</nav>

			<div className="admin-sidebar-footer">
				<button onClick={() => setCollapsed(!collapsed)} className="btn-toggle">{collapsed ? 'Expand' : 'Collapse'}</button>
			</div>
		</aside>
	);
};

export default AdminSidebar;
