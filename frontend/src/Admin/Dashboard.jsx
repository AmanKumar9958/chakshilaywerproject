import React from 'react';
import './admin.css';

const StatCard = ({ title, value, delta }) => (
	<div className="admin-stat-card">
		<div className="admin-stat-title">{title}</div>
		<div className="admin-stat-value">{value}</div>
		{delta !== undefined && <div className="admin-stat-delta">{delta}</div>}
	</div>
);

const RecentUsersTable = ({ users }) => (
	<div className="admin-card">
		<h3 className="admin-card-title">Recent Users</h3>
		<div className="admin-table-wrap">
			<table className="admin-table">
				<thead>
					<tr>
						<th>Name</th>
						<th>Email</th>
						<th>Role</th>
						<th>Joined</th>
					</tr>
				</thead>
				<tbody>
					{users.map((u) => (
						<tr key={u.email}>
							<td>{u.name}</td>
							<td>{u.email}</td>
							<td>{u.role}</td>
							<td>{u.joined}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	</div>
);

const AdminDashboard = () => {
	// Mock data for demo. Replace with API calls as needed.
	const stats = [
		{ title: 'Active Users', value: '1,243', delta: '+3.2%' },
		{ title: 'New Signups (7d)', value: '87', delta: '+12%' },
		{ title: 'Revenue (30d)', value: '$12.4k', delta: '+8.5%' },
	];

	const users = [
		{ name: 'Asha Singh', email: 'asha@example.com', role: 'Advocate', joined: '2025-09-12' },
		{ name: 'Ravi Kumar', email: 'ravi@example.com', role: 'Clerk', joined: '2025-09-10' },
		{ name: 'Meera Patel', email: 'meera@example.com', role: 'Student', joined: '2025-09-08' },
	];

	return (
		<div className="admin-dashboard">
			<div className="admin-hero">
				<h1>Admin Dashboard</h1>
				<p className="muted">Overview of platform activity and quick actions</p>
			</div>

			<div className="admin-stats-grid">
				{stats.map((s) => (
					<StatCard key={s.title} title={s.title} value={s.value} delta={s.delta} />
				))}
			</div>

			<div className="admin-layout-grid">
				<div className="admin-left-col">
					<RecentUsersTable users={users} />
				</div>
				<div className="admin-right-col">
					<div className="admin-card">
						<h3 className="admin-card-title">Quick Actions</h3>
						<div className="admin-actions">
							<button className="btn btn-primary">Invite User</button>
							<button className="btn">View Reports</button>
							<button className="btn">Manage Settings</button>
						</div>
					</div>

					<div className="admin-card">
						<h3 className="admin-card-title">System Status</h3>
						<ul className="muted small">
							<li>API: Online</li>
							<li>Jobs: 2 running</li>
							<li>DB replication: Healthy</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
