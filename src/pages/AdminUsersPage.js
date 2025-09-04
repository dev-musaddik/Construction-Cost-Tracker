import React from 'react';
import { useTranslation } from 'react-i18next';

const AdminUsersPage = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h1>{t('adminUsersPage')}</h1>
      <p>{t('adminOnly')}</p>
    </div>
  );
};

export default AdminUsersPage;