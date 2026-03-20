import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '../components/AdminSidebar';
import ManageMessages from '../components/ManageMessages';

const AdminMessages = () => {
  return (
    <>
      <Helmet>
        <title>Messages | Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar />
        <div className="flex-1">
          <ManageMessages />
        </div>
      </div>
    </>
  );
};

export default AdminMessages;