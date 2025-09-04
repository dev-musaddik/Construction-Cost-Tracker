import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { toast } from 'react-toastify';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { useTranslation } from 'react-i18next';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error(t('passwordsDoNotMatch'));
      return;
    }

    try {
      const updatedUser = await authService.updateProfile({
        name,
        email,
        password: password || undefined,
      });
      // Re-login to update user in context and localStorage with new token/data
      login(updatedUser.data.email, password || user.password);
      toast.success(t('profileUpdatedSuccess'));
    } catch (err) {
      toast.error(t('failedToUpdateProfile'));
    }
  };

  const handleScheduleReport = async () => {
    try {
      await authService.scheduleDailyReport();
      toast.success(t('dailyReportScheduledSuccess'));
    } catch (err) {
      toast.error(t('failedToScheduleDailyReport'));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-4">
        <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h1 className="text-2xl font-bold mb-4">{t('userProfile')}</h1>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              {t('name')}
            </label>
            <Input
              id="name"
              type="text"
              placeholder={t('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              {t('email')}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={t('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              {t('password')}
            </label>
            <Input
              id="password"
              type="password"
              placeholder={t('leaveBlankToKeepPassword')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
              {t('confirmPassword')}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmNewPassword')}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Button type="submit">
              {t('updateProfile')}
            </Button>
          </div>
        </form>

        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8">
          <h2 className="text-xl font-bold mb-4">{t('scheduledReports')}</h2>
          <p className="mb-4">{t('scheduleDailyReportInfo')}</p>
          <Button onClick={handleScheduleReport}>
            {t('scheduleDailyReport')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;