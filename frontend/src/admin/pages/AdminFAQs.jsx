import React from 'react';
import { Helmet } from 'react-helmet-async';
import AdminSidebar from '../components/AdminSidebar';
import ManageFAQs from '../components/ManageFAQs';

const AdminFAQs = () => {
  return (
    <>
      <Helmet>
        <title>Manage FAQs | Admin Panel</title>
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <AdminSidebar />
        <div className="flex-1">
          <ManageFAQs />
        </div>
      </div>
    </>
  );
};

export default AdminFAQs;