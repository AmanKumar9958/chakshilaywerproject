import React from 'react';
import './admin.css';

const Settings = () => {
	return (
		<div className="admin-page">
			<h2>Settings</h2>
			<div className="admin-card">
				<label className="admin-field">
					<span>Site Title</span>
					<input defaultValue="Chakshi Pro" />
				</label>

				<label className="admin-field">
					<span>Support Email</span>
					<input defaultValue="support@example.com" />
				</label>

				<div className="admin-actions">
					<button className="btn btn-primary">Save</button>
				</div>
			</div>
		</div>
	);
};

export default Settings;
