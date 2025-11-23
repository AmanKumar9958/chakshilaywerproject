import React from 'react';
import './admin.css';

const Users = () => {
	const users = [
		{ id: 1, name: 'Asha Singh', email: 'asha@example.com', role: 'Advocate' },
		{ id: 2, name: 'Ravi Kumar', email: 'ravi@example.com', role: 'Clerk' },
		{ id: 3, name: 'Meera Patel', email: 'meera@example.com', role: 'Student' },
	];

	return (
		<div className="admin-page">
			<h2>Users</h2>
			<div className="admin-card">
				<table className="admin-table">
					<thead>
						<tr><th>#</th><th>Name</th><th>Email</th><th>Role</th></tr>
					</thead>
					<tbody>
						{users.map(u => (
							<tr key={u.id}>
								<td>{u.id}</td>
								<td>{u.name}</td>
								<td>{u.email}</td>
								<td>{u.role}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};

export default Users;
