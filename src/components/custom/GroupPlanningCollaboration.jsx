import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Users, 
  Share2, 
  ThumbsUp, 
  Heart, 
  Smile,
  Copy,
  Check,
  Download,
  Calendar,
  MessageCircle,
  FileText,
  Link as LinkIcon,
  Vote,
  UserPlus,
  Crown,
  Mail,
  Send
} from 'lucide-react';
import { toast } from 'sonner';
import { emailService } from '@/service/EmailService';

const GroupPlanningCollaboration = ({ tripData, tripId }) => {
  const [shareLink, setShareLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [sendingInvite, setSendingInvite] = useState(false);
  const [groupMembers, setGroupMembers] = useState([
    { id: 1, name: 'You', email: 'you@example.com', role: 'organizer', avatar: '👤', preferences: { budget: 'moderate', interests: ['heritage', 'food'] } }
  ]);
  const [votingItems, setVotingItems] = useState([
    {
      id: 1,
      type: 'hotel',
      name: 'Hotel Taj Palace',
      price: '₹4,500/night',
      votes: { thumbsup: 2, heart: 1, smile: 0 },
      userVote: null
    },
    {
      id: 2,
      type: 'hotel',
      name: 'Radisson Blu',
      price: '₹3,800/night',
      votes: { thumbsup: 1, heart: 2, smile: 1 },
      userVote: null
    },
    {
      id: 3,
      type: 'hotel',
      name: 'Lemon Tree Hotel',
      price: '₹2,500/night',
      votes: { thumbsup: 3, heart: 0, smile: 2 },
      userVote: null
    }
  ]);

  useEffect(() => {
    // Generate shareable link - use view-trip link as collaborate link
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/view-trip/${tripId || 'demo123'}?tab=group`;
    setShareLink(link);
  }, [tripId]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setLinkCopied(true);
    toast.success('Link copied! Share with your group 🔗');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleVote = (itemId, voteType) => {
    setVotingItems(items => items.map(item => {
      if (item.id === itemId) {
        const newVotes = { ...item.votes };
        
        // Remove previous vote if exists
        if (item.userVote) {
          newVotes[item.userVote] = Math.max(0, newVotes[item.userVote] - 1);
        }
        
        // Add new vote
        if (item.userVote === voteType) {
          // Toggle off if clicking same vote
          return { ...item, userVote: null };
        } else {
          newVotes[voteType] = (newVotes[voteType] || 0) + 1;
          return { ...item, votes: newVotes, userVote: voteType };
        }
      }
      return item;
    }));
    
    toast.success('Vote recorded! 👍');
  };

  const getTopVoted = () => {
    return votingItems.reduce((top, item) => {
      const totalVotes = Object.values(item.votes).reduce((sum, count) => sum + count, 0);
      const topVotes = Object.values(top.votes || {}).reduce((sum, count) => sum + count, 0);
      return totalVotes > topVotes ? item : top;
    }, votingItems[0]);
  };

  const exportToWhatsApp = () => {
    const destination = tripData?.tripDetails?.destination || 'Destination';
    const days = tripData?.tripDetails?.duration || '3 days';
    
    let message = `🌟 *${destination} Trip Plan* 🌟\n\n`;
    message += `📅 Duration: ${days}\n`;
    message += `👥 Group Size: ${groupMembers.length} people\n\n`;
    
    if (tripData?.itinerary) {
      tripData.itinerary.forEach((day, index) => {
        message += `*Day ${day.day || index + 1}:*\n`;
        if (day.activities) {
          day.activities.forEach(activity => {
            message += `• ${activity.time || '9:00 AM'} - ${activity.activity || activity.placeName}\n`;
          });
        }
        message += `\n`;
      });
    }
    
    const topHotel = getTopVoted();
    message += `🏨 *Group's Top Choice:* ${topHotel.name} (${topHotel.price})\n\n`;
    message += `✨ Planned with WanderMind AI\n`;
    message += `🔗 ${shareLink}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    toast.success('Opening WhatsApp... 💬');
  };

  const exportToPDF = () => {
    toast.info('PDF export feature coming soon! 📄');
    // In production, this would generate a PDF using jsPDF or similar
  };

  const exportToGoogleCalendar = () => {
    if (!tripData?.itinerary) {
      toast.error('No itinerary to export');
      return;
    }

    // Create Google Calendar event URL
    const destination = tripData?.tripDetails?.destination || 'Trip';
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7); // 7 days from now
    
    tripData.itinerary.forEach((day, index) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(eventDate.getDate() + index);
      
      const activities = day.activities?.map(a => 
        `${a.time || '9:00 AM'} - ${a.activity || a.placeName}`
      ).join('\n') || '';
      
      const title = `${destination} - Day ${day.day || index + 1}`;
      const details = activities;
      const location = destination;
      
      const startTime = eventDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
      const endTime = new Date(eventDate.getTime() + 12 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, '');
      
      const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startTime}/${endTime}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;
      
      if (index === 0) {
        window.open(calendarUrl, '_blank');
      }
    });
    
    toast.success('Opening Google Calendar... 📅');
  };

  const addMember = () => {
    setShowAddMemberDialog(true);
  };

  const sendInviteEmail = async () => {
    if (!newMemberEmail || !newMemberName) {
      toast.error('Please enter both name and email');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSendingInvite(true);

    try {
      // Add member to list first
      const newMember = {
        id: groupMembers.length + 1,
        name: newMemberName,
        email: newMemberEmail,
        role: 'member',
        avatar: '👤',
        preferences: { budget: 'moderate', interests: [] },
        status: 'pending'
      };
      setGroupMembers([...groupMembers, newMember]);

      // Prepare email data
      const destination = tripData?.tripDetails?.destination || tripData?.userSelection?.location?.label || 'Destination';
      const duration = tripData?.tripDetails?.duration || tripData?.userSelection?.noofDays + ' days' || '3 days';
      const organizer = groupMembers[0]?.name || 'Your friend';

      // Send email using EmailService
      const result = await emailService.sendTripInvitation({
        toName: newMemberName,
        toEmail: newMemberEmail,
        fromName: organizer,
        destination: destination,
        duration: duration,
        tripLink: shareLink,
        message: `You've been invited to collaborate on a trip to ${destination}! Click the link to view details, vote on options, and help plan the perfect trip together.`
      });

      if (result.success) {
        if (result.demo) {
          // Demo mode - copy link and show message
          navigator.clipboard.writeText(shareLink);
          toast.success(`✅ ${newMemberName} added to group!`);
          toast.info(`🔗 Link copied! Share it with ${newMemberName} at ${newMemberEmail}`);
        } else {
          // Real email sent
          toast.success(`📧 Invitation email sent to ${newMemberEmail}!`);
        }
        setShowAddMemberDialog(false);
        setNewMemberEmail('');
        setNewMemberName('');
      } else {
        toast.error('Failed to add member. Please try again.');
      }
    } catch (error) {
      console.error('Error sending invite:', error);
      toast.error('Error adding member. Please try again.');
    } finally {
      setSendingInvite(false);
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Group Planning Header */}
        <Card className="border-2 border-blue-300 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Group Planning & Collaboration
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800">
              Social
            </Badge>
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Plan together, vote on options, and share your perfect trip
          </p>
        </CardHeader>
      </Card>

      {/* Share Link */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Share2 className="w-5 h-5 text-green-600" />
            Share with Group
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={shareLink}
              readOnly
              className="flex-1 bg-gray-50 dark:bg-gray-800"
            />
            <Button
              onClick={handleCopyLink}
              variant={linkCopied ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              {linkCopied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Share this link</strong> with your group. They can view the plan, change preferences, and vote on options!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Group Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Group Members ({groupMembers.length})
            </div>
            <Button
              onClick={addMember}
              size="sm"
              variant="outline"
              className="flex items-center gap-1"
            >
              <UserPlus className="w-4 h-4" />
              Add Member
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {groupMembers.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{member.avatar}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {member.name}
                      </span>
                      {member.role === 'organizer' && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                          <Crown className="w-3 h-3 mr-1" />
                          Organizer
                        </Badge>
                      )}
                      {member.status === 'pending' && (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {member.email && <><span>📧 {member.email}</span> • </>}
                      <span>Budget: {member.preferences.budget}</span> • <span>Interests: {member.preferences.interests.length > 0 ? member.preferences.interests.join(', ') : 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Group Voting */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Vote className="w-5 h-5 text-orange-600" />
            Group Voting - Hotels
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Vote with reactions to decide together
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {votingItems.map(item => {
            const totalVotes = Object.values(item.votes).reduce((sum, count) => sum + count, 0);
            const isTopVoted = item.id === getTopVoted().id;
            
            return (
              <div
                key={item.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isTopVoted
                    ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        {item.name}
                      </h4>
                      {isTopVoted && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          🏆 Top Choice
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.price}</p>
                  </div>
                  <Badge variant="outline">
                    {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={item.userVote === 'thumbsup' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(item.id, 'thumbsup')}
                    className="flex items-center gap-1"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    {item.votes.thumbsup || 0}
                  </Button>
                  
                  <Button
                    variant={item.userVote === 'heart' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(item.id, 'heart')}
                    className="flex items-center gap-1"
                  >
                    <Heart className="w-4 h-4" />
                    {item.votes.heart || 0}
                  </Button>
                  
                  <Button
                    variant={item.userVote === 'smile' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleVote(item.id, 'smile')}
                    className="flex items-center gap-1"
                  >
                    <Smile className="w-4 h-4" />
                    {item.votes.smile || 0}
                  </Button>
                </div>
              </div>
            );
          })}
          
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-sm text-green-800 dark:text-green-200">
              ✅ <strong>Group Decision:</strong> {getTopVoted().name} is leading with {Object.values(getTopVoted().votes).reduce((sum, count) => sum + count, 0)} votes!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            Export & Share
          </CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Share your finalized plan in multiple formats
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            onClick={exportToWhatsApp}
            variant="outline"
            className="w-full justify-start h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-green-600" />
              <div className="text-left">
                <div className="font-semibold">Export to WhatsApp</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Day-wise text format, perfect for group chats
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={exportToPDF}
            variant="outline"
            className="w-full justify-start h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <div className="font-semibold">Download PDF Itinerary</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Professional PDF with all details
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={exportToGoogleCalendar}
            variant="outline"
            className="w-full justify-start h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div className="text-left">
                <div className="font-semibold">Add to Google Calendar</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Create calendar events with date/time
                </div>
              </div>
            </div>
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="outline"
            className="w-full justify-start h-auto py-3"
          >
            <div className="flex items-center gap-3">
              <LinkIcon className="w-5 h-5 text-purple-600" />
              <div className="text-left">
                <div className="font-semibold">Copy Shareable Link</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Share link for collaborative planning
                </div>
              </div>
            </div>
          </Button>
        </CardContent>
      </Card>

      {/* Booking Info */}
      <Card className="border-green-300 bg-green-50 dark:bg-green-900/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-green-800 dark:text-green-200">
              <p className="font-semibold mb-1">Ready to Book?</p>
              <p>Once your group finalizes the plan, the organizer can proceed with EaseMyTrip booking. All group preferences and top-voted options will be included!</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    {/* Add Member Dialog */}
    <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Invite Group Member
          </DialogTitle>
          <DialogDescription>
            Enter their details to send an email invitation to collaborate on this trip
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Name</label>
            <Input
              placeholder="Enter member's name"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              disabled={sendingInvite}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block">Email Address</label>
            <Input
              type="email"
              placeholder="member@example.com"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              disabled={sendingInvite}
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              💡 They'll receive an email with a link to view the trip, vote on options, and collaborate with the group.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddMemberDialog(false);
                setNewMemberEmail('');
                setNewMemberName('');
              }}
              disabled={sendingInvite}
            >
              Cancel
            </Button>
            <Button
              onClick={sendInviteEmail}
              disabled={sendingInvite || !newMemberEmail || !newMemberName}
              className="flex items-center gap-2"
            >
              {sendingInvite ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default GroupPlanningCollaboration;
