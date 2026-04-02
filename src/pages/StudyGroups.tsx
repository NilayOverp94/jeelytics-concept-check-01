import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Send, Copy, Link2, LogOut as LeaveIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import logo from '@/assets/logo.png';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Group {
  id: string;
  name: string;
  created_by: string;
  invite_code: string;
  max_members: number;
  created_at: string;
}

interface GroupMessage {
  id: string;
  group_id: string;
  user_id: string;
  message: string;
  created_at: string;
  sender_name?: string;
}

export default function StudyGroups() {
  useSEO({ title: "Study Groups | JEElytics", description: "Create and join study groups to discuss doubts with fellow JEE aspirants." });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchGroups();
      // Check if joining via invite code from URL
      const code = searchParams.get('join');
      if (code) handleJoinByCode(code);
    }
  }, [user]);

  useEffect(() => {
    if (selectedGroup) {
      fetchMessages();
      fetchMemberCount();
      // Real-time messages
      const channel = supabase
        .channel(`group-${selectedGroup.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'study_group_messages',
          filter: `group_id=eq.${selectedGroup.id}`,
        }, () => fetchMessages())
        .subscribe();

      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedGroup]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchGroups = async () => {
    if (!user) return;
    // Get groups where user is a member
    const { data: memberData } = await supabase
      .from('study_group_members')
      .select('group_id')
      .eq('user_id', user.id);

    if (!memberData || memberData.length === 0) {
      setGroups([]);
      return;
    }

    const groupIds = memberData.map(m => m.group_id);
    const { data } = await supabase
      .from('study_groups')
      .select('*')
      .in('id', groupIds)
      .order('created_at', { ascending: false });

    if (data) setGroups(data as Group[]);
  };

  const fetchMessages = async () => {
    if (!selectedGroup) return;
    const { data } = await supabase
      .from('study_group_messages')
      .select('*')
      .eq('group_id', selectedGroup.id)
      .order('created_at', { ascending: true })
      .limit(100);

    if (data) {
      // Fetch sender names
      const userIds = [...new Set(data.map((m: any) => m.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, display_name')
        .in('user_id', userIds);

      const nameMap: Record<string, string> = {};
      profiles?.forEach((p: any) => { nameMap[p.user_id] = p.display_name || 'Student'; });

      setMessages(data.map((m: any) => ({
        ...m,
        sender_name: nameMap[m.user_id] || 'Student'
      })));
    }
  };

  const fetchMemberCount = async () => {
    if (!selectedGroup) return;
    const { count } = await supabase
      .from('study_group_members')
      .select('*', { count: 'exact', head: true })
      .eq('group_id', selectedGroup.id);
    setMemberCount(count || 0);
  };

  const handleCreateGroup = async () => {
    if (!user || !newGroupName.trim()) return;
    const { data, error } = await supabase
      .from('study_groups')
      .insert({ name: newGroupName.trim(), created_by: user.id })
      .select()
      .single();

    if (error) {
      console.error('Create group error:', error);
      toast({ title: "Error", description: error.message || "Failed to create group", variant: "destructive" });
      return;
    }

    // Add creator as admin member
    await supabase.from('study_group_members').insert({
      group_id: data.id,
      user_id: user.id,
      role: 'admin'
    });

    setNewGroupName('');
    setCreateOpen(false);
    fetchGroups();
    toast({ title: "Group created!", description: `"${data.name}" is ready. Share the invite code!` });
  };

  const handleJoinByCode = async (code: string) => {
    if (!user) return;
    // Find group by invite code
    const { data: group, error } = await supabase
      .from('study_groups')
      .select('*')
      .eq('invite_code', code.trim())
      .maybeSingle();

    if (!group || error) {
      toast({ title: "Invalid code", description: "No group found with this invite code.", variant: "destructive" });
      return;
    }

    // Check if already a member
    const { data: existing } = await supabase
      .from('study_group_members')
      .select('id')
      .eq('group_id', group.id)
      .eq('user_id', user.id)
      .maybeSingle();

    if (existing) {
      toast({ title: "Already joined", description: "You're already a member of this group." });
      setSelectedGroup(group as Group);
      setJoinOpen(false);
      return;
    }

    await supabase.from('study_group_members').insert({
      group_id: group.id,
      user_id: user.id,
      role: 'member'
    });

    setJoinCode('');
    setJoinOpen(false);
    fetchGroups();
    setSelectedGroup(group as Group);
    toast({ title: "Joined!", description: `Welcome to "${group.name}"!` });
  };

  const handleSendMessage = async () => {
    if (!user || !selectedGroup || !newMessage.trim()) return;
    await supabase.from('study_group_messages').insert({
      group_id: selectedGroup.id,
      user_id: user.id,
      message: newMessage.trim()
    });
    setNewMessage('');
  };

  const handleInvite = async () => {
    if (!selectedGroup || !inviteEmail.trim()) return;
    await supabase.rpc('send_group_invite', {
      p_invitee_email: inviteEmail.trim(),
      p_group_id: selectedGroup.id,
      p_group_name: selectedGroup.name
    });
    setInviteEmail('');
    toast({ title: "Invite sent!", description: `Notification sent to ${inviteEmail}` });
  };

  const copyInviteLink = () => {
    if (!selectedGroup) return;
    const link = `${window.location.origin}/groups?join=${selectedGroup.invite_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Invite link copied to clipboard" });
  };

  const handleLeaveGroup = async () => {
    if (!user || !selectedGroup) return;
    await supabase
      .from('study_group_members')
      .delete()
      .eq('group_id', selectedGroup.id)
      .eq('user_id', user.id);
    setSelectedGroup(null);
    fetchGroups();
    toast({ title: "Left group", description: "You have left the study group." });
  };

  const handleDeleteGroup = async () => {
    if (!user || !selectedGroup || selectedGroup.created_by !== user.id) return;
    await supabase.from('study_groups').delete().eq('id', selectedGroup.id);
    setSelectedGroup(null);
    fetchGroups();
    toast({ title: "Group deleted" });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => selectedGroup ? setSelectedGroup(null) : navigate('/home')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <img src={logo} alt="JEElytics" className="h-8 w-8 rounded" />
            <span className="text-xl font-bold text-gradient-primary">
              {selectedGroup ? selectedGroup.name : 'Study Groups'}
            </span>
            {selectedGroup && (
              <span className="text-xs text-muted-foreground ml-auto">{memberCount} members</span>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        {!selectedGroup ? (
          // Group List View
          <div className="space-y-4">
            <div className="flex gap-2">
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" className="flex-1">
                    <Plus className="h-4 w-4 mr-2" /> Create Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create Study Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Group name (e.g., JEE 2026 Warriors)"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()}
                    />
                    <Button onClick={handleCreateGroup} className="w-full" disabled={!newGroupName.trim()}>
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">
                    <Link2 className="h-4 w-4 mr-2" /> Join Group
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Join Study Group</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input
                      placeholder="Enter invite code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleJoinByCode(joinCode)}
                    />
                    <Button onClick={() => handleJoinByCode(joinCode)} className="w-full" disabled={!joinCode.trim()}>
                      Join
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {groups.length === 0 ? (
              <Card className="card-jee">
                <CardContent className="py-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No Study Groups Yet</h3>
                  <p className="text-sm text-muted-foreground">Create a group or join one using an invite code!</p>
                </CardContent>
              </Card>
            ) : (
              groups.map((g) => (
                <Card
                  key={g.id}
                  className="card-jee cursor-pointer hover:shadow-card transition-shadow"
                  onClick={() => setSelectedGroup(g)}
                >
                  <CardContent className="py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{g.name}</p>
                      <p className="text-xs text-muted-foreground">Code: {g.invite_code}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          // Chat View
          <div className="flex flex-col h-[calc(100vh-180px)]">
            {/* Actions bar */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <Button variant="outline" size="sm" onClick={copyInviteLink}>
                <Copy className="h-3.5 w-3.5 mr-1" /> Copy Link
              </Button>
              <div className="flex gap-1 flex-1 max-w-xs">
                <Input
                  placeholder="Invite by email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button variant="outline" size="sm" onClick={handleInvite} disabled={!inviteEmail.trim()}>
                  Invite
                </Button>
              </div>
              <div className="flex gap-1 ml-auto">
                {selectedGroup.created_by === user?.id ? (
                  <Button variant="destructive" size="sm" onClick={handleDeleteGroup}>
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" onClick={handleLeaveGroup} className="text-destructive">
                    <LeaveIcon className="h-3.5 w-3.5 mr-1" /> Leave
                  </Button>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-2 border border-border rounded-lg p-3 bg-card/30">
              {messages.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">
                  No messages yet. Start the conversation! 💬
                </p>
              )}
              {messages.map((m) => {
                const isOwn = m.user_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                      isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}>
                      {!isOwn && (
                        <p className="text-[10px] font-medium text-primary mb-0.5">{m.sender_name}</p>
                      )}
                      <p className="break-words">{m.message}</p>
                      <p className={`text-[10px] mt-1 ${isOwn ? 'text-primary-foreground/60' : 'text-muted-foreground/60'}`}>
                        {new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex gap-2 mt-3">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
