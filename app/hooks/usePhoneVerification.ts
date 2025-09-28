'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfileService } from '../../lib/user-profile-service';

export function usePhoneVerification() {
  const { user, loading: authLoading } = useAuth();
  const [needsPhoneNumber, setNeedsPhoneNumber] = useState(false);
  const [checkingPhone, setCheckingPhone] = useState(false);

  useEffect(() => {
    const checkPhoneNumber = async () => {
      if (!user || authLoading) return;

      setCheckingPhone(true);
      try {
        // Check if user has phone in their metadata directly
        const hasPhone = !!(user?.user_metadata?.phone);
        setNeedsPhoneNumber(!hasPhone);
      } catch (error) {
        console.error('Error checking phone number:', error);
        // If we can't check, assume they need phone number to be safe
        setNeedsPhoneNumber(true);
      } finally {
        setCheckingPhone(false);
      }
    };

    checkPhoneNumber();
  }, [user, authLoading]);

  return {
    needsPhoneNumber,
    checkingPhone,
    userId: user?.id
  };
}
