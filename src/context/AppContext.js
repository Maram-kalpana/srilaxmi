import React, { createContext, useContext, useMemo, useState } from 'react';
import { employeeData as defaultEmployee, LOGIN_CREDENTIALS } from '../data/employeeData';
import { initialWorkReports } from '../data/workReportData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [employee, setEmployee] = useState({ ...defaultEmployee });
  const [workReports, setWorkReports] = useState([...initialWorkReports]);
  const [accountPassword, setAccountPassword] = useState(LOGIN_CREDENTIALS.password);

  const login = () => setIsLoggedIn(true);
  const logout = () => setIsLoggedIn(false);

  const validateCredentials = (employeeId, password) => {
    const idMatch =
      employeeId.trim().toUpperCase() === LOGIN_CREDENTIALS.employeeId.toUpperCase();
    const passMatch = password === accountPassword;
    return idMatch && passMatch;
  };

  const updateEmployeePhone = (phone) => {
    setEmployee((prev) => ({
      ...prev,
      phone,
    }));
  };

  const changePassword = (currentPassword, newPassword) => {
    if (currentPassword !== accountPassword) {
      return { success: false, message: 'Current password is incorrect.' };
    }
    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters.' };
    }
    setAccountPassword(newPassword);
    return { success: true, message: 'Password changed successfully.' };
  };

  const addWorkReport = (report) => {
    const entry = {
      id: String(Date.now()),
      ...report,
    };
    setWorkReports((prev) => [entry, ...prev]);
    return entry;
  };

  const value = useMemo(
    () => ({
      isLoggedIn,
      employee,
      workReports,
      accountPassword,
      login,
      logout,
      validateCredentials,
      updateEmployeePhone,
      changePassword,
      addWorkReport,
    }),
    [isLoggedIn, employee, workReports, accountPassword]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
