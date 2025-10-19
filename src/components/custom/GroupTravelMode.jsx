import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, X, Mail, UserCheck, Clock } from 'lucide-react';
import { toast } from 'sonner';

const GroupTravelMode = ({ onGroupPreferencesUpdate }) => {
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'You', email: '', preferences: [], isOwner: true, status: 'confirmed' }
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [groupPreferences, setGroupPreferences] = useState({
    budget: 'moderate',
    activities: [],
    accommodation: 'shared',
    transport: 'group'
  });

  const addGroupMember = () => {
    if (!newMemberEmail.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    if (groupMembers.some(member => member.email === newMemberEmail)) {
      toast.error('This member is already added');
      return;
    }

    const newMember = {
      id: Date.now(),
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail,
      preferences: [],
      isOwner: false,
      status: 'pending'
    };

    setGroupMembers([...groupMembers, newMember]);
    setNewMemberEmail('');
    toast.success('Group member added! They will receive an invitation.');
  };

  const removeMember = (memberId) => {
    if (groupMembers.find(m => m.id === memberId)?.isOwner) {
      toast.error('Cannot remove the group owner');
      return;
    }
    setGroupMembers(groupMembers.filter(member => member.id !== memberId));
  };

  const updateMemberPreferences = (memberId, preferences) => {
    setGroupMembers(members =>
      members.map(member =>
        member.id === memberId
          ? { ...member, preferences }
          : member
      )
    );
  };

  const commonPreferences = [
    { id: 'adventure', name: 'Adventure Activities', icon: '🏔️' },
    { id: 'culture', name: 'Cultural Sites', icon: '🏛️' },
    { id: 'food', name: 'Food Experiences', icon: '🍜' },
    { id: 'nightlife', name: 'Nightlife', icon: '🌃' },
    { id: 'nature', name: 'Nature & Wildlife', icon: '🌿' },
    { id: 'shopping', name: 'Shopping', icon: '🛍️' },
    { id: 'relaxation', name: 'Relaxation', icon: '🧘' },
    { id: 'photography', name: 'Photography', icon: '📸' }
  ];

  const getConsolidatedPreferences = () => {
    const allPreferences = groupMembers.flatMap(member => member.preferences);
    const preferenceCount = {};
    
    allPreferences.forEach(pref => {
      preferenceCount[pref] = (preferenceCount[pref] || 0) + 1;
    });

    // Sort by popularity
    return Object.entries(preferenceCount)
      .sort(([,a], [,b]) => b - a)
      .map(([pref, count]) => ({
        preference: pref,
        count,
        percentage: Math.round((count / groupMembers.length) * 100)
      }));
  };

  const generateGroupItinerary = () => {
    const consolidated = getConsolidatedPreferences();
    const groupData = {
      members: groupMembers,
      consolidatedPreferences: consolidated,
      groupSize: groupMembers.length,
      groupPreferences
    };

    if (onGroupPreferencesUpdate) {
      onGroupPreferencesUpdate(groupData);
    }

    toast.success('Group preferences consolidated! Generating optimized itinerary...');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Group Travel Planning
          </CardTitle>
          <p className="text-sm text-gray-600">
            Add group members and combine everyone's preferences for the perfect group trip
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add Members */}
          <div className="flex gap-2">
            <Input
              placeholder="Enter member's email address"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addGroupMember()}
            />
            <Button onClick={addGroupMember}>
              <Plus className="w-4 h-4 mr-1" />
              Add Member
            </Button>
          </div>

          {/* Group Members List */}
          <div className="space-y-3">
            <h4 className="font-medium">Group Members ({groupMembers.length})</h4>
            {groupMembers.map((member) => (
              <Card key={member.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      {member.isOwner ? (
                        <UserCheck className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Users className="w-4 h-4 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {member.name}
                        {member.isOwner && <Badge className="ml-2" variant="default">Owner</Badge>}
                      </p>
                      <p className="text-sm text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={member.status === 'confirmed' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {member.status === 'confirmed' ? (
                        <>
                          <UserCheck className="w-3 h-3 mr-1" />
                          Confirmed
                        </>
                      ) : (
                        <>
                          <Clock className="w-3 h-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                    {!member.isOwner && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Member Preferences */}
                <div className="mt-3">
                  <p className="text-sm font-medium mb-2">Travel Preferences:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonPreferences.map((pref) => (
                      <Button
                        key={pref.id}
                        variant={member.preferences.includes(pref.id) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const newPrefs = member.preferences.includes(pref.id)
                            ? member.preferences.filter(p => p !== pref.id)
                            : [...member.preferences, pref.id];
                          updateMemberPreferences(member.id, newPrefs);
                        }}
                        className="text-xs"
                      >
                        {pref.icon} {pref.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Consolidated Preferences */}
      {groupMembers.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Group Preference Analysis</CardTitle>
            <p className="text-sm text-gray-600">
              Based on all group members' preferences
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getConsolidatedPreferences().map(({ preference, count, percentage }) => {
                const prefData = commonPreferences.find(p => p.id === preference);
                return (
                  <div key={preference} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{prefData?.icon}</span>
                      <span className="font-medium">{prefData?.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-600">
                        {count}/{groupMembers.length} members
                      </div>
                      <Badge variant={percentage >= 50 ? "default" : "secondary"}>
                        {percentage}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <Button onClick={generateGroupItinerary} size="lg">
                Generate Group Itinerary
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Group Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Group Travel Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Accommodation Preference</label>
            <div className="flex gap-2 mt-2">
              {['shared', 'separate', 'mixed'].map((option) => (
                <Button
                  key={option}
                  variant={groupPreferences.accommodation === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupPreferences(prev => ({ ...prev, accommodation: option }))}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Transportation</label>
            <div className="flex gap-2 mt-2">
              {['group', 'individual', 'mixed'].map((option) => (
                <Button
                  key={option}
                  variant={groupPreferences.transport === option ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGroupPreferences(prev => ({ ...prev, transport: option }))}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GroupTravelMode;