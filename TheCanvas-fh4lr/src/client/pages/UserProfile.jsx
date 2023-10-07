import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import getUserProfile from '@wasp/queries/getUserProfile';

export function UserProfile() {
  const { userId } = useParams();
  const { data: userProfile, isLoading, error } = useQuery(getUserProfile, { userId });

  if (isLoading) return 'Loading...';
  if (error) return 'Error: ' + error;

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{userProfile.username}</h1>
      <div className="mb-4">
        <img src={userProfile.profileImage} alt="Profile" className="w-32 h-32 rounded-full" />
      </div>
      <p className="mb-2">Bio: {userProfile.bio}</p>
      <p className="mb-2">Social Links: {userProfile.socialLinks}</p>
      {/* Render created content here using another query */}
    </div>
  );
}