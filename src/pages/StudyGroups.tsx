import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Plus, Users, Send, Copy, Link2, LogOut as LeaveIcon, Trash2, MoreVertical, Reply, Pencil, Check, X, Settings, UserPlus, Mail, Hash, Eye, BookOpen, Beaker, Calculator as CalcIcon, Rocket, Heart, Star, Gamepad2, Music, Code, Globe, Flame, Zap, Crown, Shield, Target, Sparkles, Mic, MicOff, ImageIcon, Pin, PinOff, Search, Smile, Info } from 'lucide-react';
import { useGamification } from '@/hooks/useGamification';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import useSEO from '@/hooks/useSEO';
import logo from '@/assets/logo.png';
import { markGroupSeen } from '@/hooks/useGroupUnread';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';

const GROUP_AVATARS: Record<string, { icon: any; color: string }> = {
  books: { icon: BookOpen, color: 'from-blue-500 to-blue-600' },
  beaker: { icon: Beaker, color: 'from-green-500 to-green-600' },
  calc: { icon: CalcIcon, color: 'from-purple-500 to-purple-600' },
  rocket: { icon: Rocket, color: 'from-orange-500 to-orange-600' },
  heart: { icon: Heart, color: 'from-pink-500 to-pink-600' },
  star: { icon: Star, color: 'from-amber-500 to-amber-600' },
  gamepad: { icon: Gamepad2, color: 'from-indigo-500 to-indigo-600' },
  music: { icon: Music, color: 'from-rose-500 to-rose-600' },
  code: { icon: Code, color: 'from-cyan-500 to-cyan-600' },
  globe: { icon: Globe, color: 'from-teal-500 to-teal-600' },
  flame: { icon: Flame, color: 'from-red-500 to-red-600' },
  zap: { icon: Zap, color: 'from-yellow-500 to-yellow-600' },
  crown: { icon: Crown, color: 'from-amber-400 to-amber-600' },
  shield: { icon: Shield, color: 'from-slate-500 to-slate-600' },
  target: { icon: Target, color: 'from-emerald-500 to-emerald-600' },
  sparkles: { icon: Sparkles, color: 'from-violet-500 to-violet-600' },
};

function GroupAvatar({ avatarKey, size = 'md' }: { avatarKey: string; size?: 'sm' | 'md' | 'lg' }) {
  const avatar = GROUP_AVATARS[avatarKey] || GROUP_AVATARS.books;
  const Icon = avatar.icon;
  const sizeClasses = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  const iconSize = size === 'sm' ? 'h-4 w-4' : size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';
  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`${iconSize} text-white`} />
    </div>
  );
}

// WhatsApp-style double tick SVG
function DoubleTick({ read, className }: { read?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 11" className={`h-3.5 w-4 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.071 0.653L4.214 7.51L1.429 4.725L0 6.154L4.214 10.368L12.5 2.082L11.071 0.653Z" fill={read ? 'white' : 'currentColor'} />
      <path d="M14.071 0.653L7.214 7.51L6.5 6.796L5.071 8.225L7.214 10.368L15.5 2.082L14.071 0.653Z" fill={read ? 'white' : 'currentColor'} />
    </svg>
  );
}

interface Group {
  id: string; name: string; created_by: string; invite_code?: string | null; max_members: number; created_at: string; avatar_key?: string; description?: string | null;
}
interface Reaction { emoji: string; count: number; mine: boolean; }
interface GroupMessage {
  id: string; group_id: string; user_id: string; message: string; created_at: string; sender_name?: string;
  reply_to?: string | null; is_deleted?: boolean; edited_at?: string | null; reply_message?: string; reply_sender?: string;
  is_pinned?: boolean; reactions?: Reaction[];
}

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏', '🎉', '🔥'];

export default function StudyGroups() {
  useSEO({ title: "Study Groups | JEElytics", description: "Create and join study groups to discuss doubts with fellow JEE aspirants." });

  const navigate = useNavigate();
  const routeLocation = useLocation();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('books');
  const [joinCode, setJoinCode] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [memberCount, setMemberCount] = useState(0);
  const [members, setMembers] = useState<{ user_id: string; display_name: string; role: string }[]>([]);
  const [membersDialogOpen, setMembersDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteMessageConfirmOpen, setDeleteMessageConfirmOpen] = useState(false);
  const [pendingDeleteMsg, setPendingDeleteMsg] = useState<{ id: string; isOwn: boolean } | null>(null);
  const [renameName, setRenameName] = useState('');
  const [replyingTo, setReplyingTo] = useState<GroupMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<GroupMessage | null>(null);
  const [editText, setEditText] = useState('');
  const [hiddenMessageIds, setHiddenMessageIds] = useState<Set<string>>(new Set());
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const lastMsgCountRef = useRef(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const { grantBadge, awardXP } = useGamification();

  // Scroll to top when landing on groups page (no group selected)
  useEffect(() => {
    if (!selectedGroup) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [selectedGroup]);

  useEffect(() => {
    if (user) {
      fetchGroups();
      const code = searchParams.get('join');
      if (code) handleJoinByCode(code);
    }
  }, [user]);

  useEffect(() => {
    if (routeLocation.state?.openGroupId && groups.length > 0) {
      const group = groups.find(g => g.id === routeLocation.state.openGroupId);
      if (group) setSelectedGroup(group);
    }
  }, [routeLocation.state?.openGroupId, groups]);

  // Fetch hidden message IDs for current user
  const fetchHiddenMessages = useCallback(async () => {
    if (!user || !selectedGroup) return;
    const { data } = await supabase
      .from('study_group_message_states')
      .select('message_id')
      .eq('user_id', user.id)
      .not('hidden_at', 'is', null);
    if (data) {
      setHiddenMessageIds(new Set(data.map(d => d.message_id)));
    }
  }, [user, selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      markGroupSeen(selectedGroup.id);
      setInitialLoadDone(false);
      lastMsgCountRef.current = 0;
      fetchMessages();
      fetchMemberCount();
      fetchHiddenMessages();
      const channel = supabase
        .channel(`group-${selectedGroup.id}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'study_group_messages', filter: `group_id=eq.${selectedGroup.id}` }, () => fetchMessages())
        .subscribe();
      return () => { supabase.removeChannel(channel); };
    }
  }, [selectedGroup]);

  // Helper: scroll only the messages container, never the page
  const scrollMessagesToBottom = (smooth = true) => {
    const c = messagesContainerRef.current;
    if (c) c.scrollTo({ top: c.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  };

  // Smart scroll: only auto-scroll on NEW messages (not initial load)
  useEffect(() => {
    if (!initialLoadDone) return;
    if (messages.length > lastMsgCountRef.current && lastMsgCountRef.current > 0) {
      const container = messagesContainerRef.current;
      if (container) {
        const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
        if (isNearBottom) scrollMessagesToBottom(true);
      }
    }
    lastMsgCountRef.current = messages.length;
  }, [messages, initialLoadDone]);

  const fetchGroups = async () => {
    if (!user) return;
    const { data: memberData } = await supabase.from('study_group_members').select('group_id').eq('user_id', user.id);
    if (!memberData || memberData.length === 0) { setGroups([]); return; }
    const groupIds = memberData.map(m => m.group_id);
    const { data } = await supabase.from('study_groups').select('*').in('id', groupIds).order('created_at', { ascending: false });
    if (data) setGroups(data as Group[]);
  };

  const fetchMessages = async () => {
    if (!selectedGroup) return;
    const { data } = await supabase.from('study_group_messages').select('*').eq('group_id', selectedGroup.id).order('created_at', { ascending: true }).limit(200);
    if (data) {
      const userIds = [...new Set(data.map((m: any) => m.user_id))];
      const { data: profiles } = await supabase.from('profiles').select('user_id, display_name').in('user_id', userIds);
      const nameMap: Record<string, string> = {};
      profiles?.forEach((p: any) => { nameMap[p.user_id] = p.display_name || 'Student'; });
      const msgMap: Record<string, any> = {};
      data.forEach((m: any) => { msgMap[m.id] = m; });
      const msgIds = data.map((m: any) => m.id);
      const { data: rx } = msgIds.length
        ? await supabase.from('message_reactions').select('message_id, user_id, emoji').in('message_id', msgIds)
        : { data: [] as any[] };
      const rxMap: Record<string, Reaction[]> = {};
      (rx || []).forEach((r: any) => {
        const arr = rxMap[r.message_id] = rxMap[r.message_id] || [];
        const ex = arr.find(x => x.emoji === r.emoji);
        if (ex) { ex.count++; if (r.user_id === user?.id) ex.mine = true; }
        else arr.push({ emoji: r.emoji, count: 1, mine: r.user_id === user?.id });
      });
      setMessages(data.map((m: any) => ({
        ...m, sender_name: nameMap[m.user_id] || 'Student',
        reply_message: m.reply_to ? (msgMap[m.reply_to]?.is_deleted ? '🚫 Deleted message' : msgMap[m.reply_to]?.message?.substring(0, 60)) : undefined,
        reply_sender: m.reply_to ? nameMap[msgMap[m.reply_to]?.user_id] || 'Student' : undefined,
        reactions: rxMap[m.id] || [],
      })));
      if (!initialLoadDone) {
        setInitialLoadDone(true);
        setTimeout(() => { scrollMessagesToBottom(false); }, 100);
      }
    }
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!user) return;
    const msg = messages.find(m => m.id === messageId);
    const mine = msg?.reactions?.find(r => r.emoji === emoji)?.mine;
    if (mine) {
      await supabase.from('message_reactions').delete().eq('message_id', messageId).eq('user_id', user.id).eq('emoji', emoji);
    } else {
      await supabase.from('message_reactions').insert({ message_id: messageId, user_id: user.id, emoji } as any);
    }
    fetchMessages();
  };

  const togglePin = async (messageId: string) => {
    const { error } = await supabase.rpc('toggle_pin_message', { p_message_id: messageId });
    if (error) { toast({ title: "Cannot pin", description: error.message, variant: "destructive" }); return; }
    fetchMessages();
  };

  const saveDescription = async () => {
    if (!selectedGroup) return;
    await supabase.from('study_groups').update({ description: editDescription } as any).eq('id', selectedGroup.id);
    setSelectedGroup({ ...selectedGroup, description: editDescription });
    setDescDialogOpen(false);
    fetchGroups();
  };

  const fetchMemberCount = async () => {
    if (!selectedGroup) return;
    const { count } = await supabase.from('study_group_members').select('*', { count: 'exact', head: true }).eq('group_id', selectedGroup.id);
    setMemberCount(count || 0);
  };

  const fetchMembers = async () => {
    if (!selectedGroup) return;
    const { data: memberData } = await supabase.from('study_group_members').select('user_id, role').eq('group_id', selectedGroup.id);
    if (memberData) {
      const userIds = memberData.map(m => m.user_id);
      const { data: profiles } = await supabase.from('profiles').select('user_id, display_name').in('user_id', userIds);
      const nameMap: Record<string, string> = {};
      profiles?.forEach((p: any) => { nameMap[p.user_id] = p.display_name || 'Student'; });
      setMembers(memberData.map(m => ({ user_id: m.user_id, display_name: nameMap[m.user_id] || 'Student', role: m.role })));
      setMembersDialogOpen(true);
    }
  };

  const handleCreateGroup = async () => {
    if (!user || !newGroupName.trim()) return;
    const { data, error } = await supabase.from('study_groups').insert({ name: newGroupName.trim(), created_by: user.id, avatar_key: selectedAvatar } as any).select().single();
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    await supabase.from('study_group_members').insert({ group_id: data.id, user_id: user.id, role: 'admin' });
    setNewGroupName(''); setSelectedAvatar('books'); setCreateOpen(false);
    fetchGroups();
    toast({ title: "Group created!", description: `"${data.name}" is ready.` });
  };

  const handleJoinByCode = async (code: string) => {
    if (!user) return;
    const { data: groupId, error } = await supabase.rpc('join_group_with_code', { p_invite_code: code.trim() });
    if (error || !groupId) {
      toast({ title: "Invalid code", description: error?.message || "No group found with this invite code.", variant: "destructive" });
      return;
    }
    setJoinCode(''); setJoinOpen(false);
    await fetchGroups();
    const { data: fullGroupData } = await supabase.from('study_groups').select('*').eq('id', groupId as string).maybeSingle();
    if (fullGroupData) setSelectedGroup(fullGroupData as Group);
    toast({ title: "Joined!", description: `Welcome!` });
  };

  const handleSendMessage = async () => {
    if (!user || !selectedGroup || !newMessage.trim()) return;
    const msgText = newMessage.trim();
    const replyId = replyingTo?.id || null;
    setNewMessage('');
    setReplyingTo(null);
    const insertData: any = { group_id: selectedGroup.id, user_id: user.id, message: msgText };
    if (replyId) insertData.reply_to = replyId;
    const { error } = await supabase.from('study_group_messages').insert(insertData);
    if (error) {
      toast({ title: "Error sending message", variant: "destructive" });
      return;
    }
    await fetchMessages();
    setTimeout(() => { scrollMessagesToBottom(true); }, 50);
    const r = await awardXP(2);
    if (r?.leveled_up) toast({ title: `Level up! 🎉`, description: `You're now level ${r.new_level}` });
    if (r?.new_level && r.new_level >= 5) grantBadge('level_5');
    if (r?.new_level && r.new_level >= 10) grantBadge('level_10');
    const sentKey = `msgs_sent_${user.id}`;
    const sent = (parseInt(localStorage.getItem(sentKey) || '0', 10) || 0) + 1;
    localStorage.setItem(sentKey, String(sent));
    if (sent >= 50) grantBadge('social');
  };

  const handleDeleteMessage = async (msgId: string, deleteForAll: boolean) => {
    if (deleteForAll) {
      await supabase.from('study_group_messages').update({ is_deleted: true, message: '🚫 This message was deleted' } as any).eq('id', msgId);
    } else {
      // Delete for me: add to local hidden set and persist
      setHiddenMessageIds(prev => new Set([...prev, msgId]));
      // Insert into message_states (no unique constraint needed, just insert)
      await supabase.from('study_group_message_states').insert({
        message_id: msgId, user_id: user!.id, hidden_at: new Date().toISOString()
      } as any);
    }
    fetchMessages();
    setDeleteMessageConfirmOpen(false);
    setPendingDeleteMsg(null);
  };

  const confirmDeleteMessage = (msgId: string, isOwn: boolean) => {
    setPendingDeleteMsg({ id: msgId, isOwn });
    setDeleteMessageConfirmOpen(true);
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !editText.trim()) return;
    await supabase.from('study_group_messages').update({ message: editText.trim(), edited_at: new Date().toISOString() } as any).eq('id', editingMessage.id);
    setEditingMessage(null); setEditText('');
    fetchMessages();
  };

  const canEdit = (msg: GroupMessage) => {
    if (msg.user_id !== user?.id) return false;
    return Date.now() - new Date(msg.created_at).getTime() < 15 * 60 * 1000;
  };

  const handleInvite = async () => {
    if (!selectedGroup || !inviteEmail.trim()) return;
    await supabase.rpc('send_group_invite', { p_invitee_email: inviteEmail.trim(), p_group_id: selectedGroup.id, p_group_name: selectedGroup.name });
    setInviteEmail(''); setInviteDialogOpen(false);
    toast({ title: "Invite sent!", description: `Notification sent to ${inviteEmail}` });
  };

  const fetchInviteCode = async (): Promise<string | null> => {
    if (!selectedGroup) return null;
    const { data } = await supabase.rpc('get_group_invite_code', { p_group_id: selectedGroup.id });
    if (!data) {
      toast({ title: "Not allowed", description: "Only admins can share invite codes.", variant: "destructive" });
      return null;
    }
    return data as string;
  };

  const copyInviteLink = async () => {
    const code = await fetchInviteCode();
    if (!code) return;
    navigator.clipboard.writeText(`${window.location.origin}/groups?join=${code}`);
    toast({ title: "Copied!", description: "Invite link copied" });
  };

  const copyInviteCode = async () => {
    const code = await fetchInviteCode();
    if (!code) return;
    navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: "Invite code copied" });
  };

  const handleLeaveGroup = async () => {
    if (!user || !selectedGroup) return;
    await supabase.from('study_group_members').delete().eq('group_id', selectedGroup.id).eq('user_id', user.id);
    setSelectedGroup(null); fetchGroups();
    toast({ title: "Left group" });
  };

  const handleDeleteGroup = async () => {
    if (!user || !selectedGroup || selectedGroup.created_by !== user.id) return;
    await supabase.from('study_groups').delete().eq('id', selectedGroup.id);
    setSelectedGroup(null); setDeleteConfirmOpen(false); fetchGroups();
    toast({ title: "Group deleted" });
  };

  const handleRename = async () => {
    if (!selectedGroup || !renameName.trim()) return;
    await supabase.from('study_groups').update({ name: renameName.trim() } as any).eq('id', selectedGroup.id);
    setSelectedGroup({ ...selectedGroup, name: renameName.trim() });
    setRenameDialogOpen(false); fetchGroups();
  };

  const handleChangeAvatar = async (key: string) => {
    if (!selectedGroup) return;
    await supabase.from('study_groups').update({ avatar_key: key } as any).eq('id', selectedGroup.id);
    setSelectedGroup({ ...selectedGroup, avatar_key: key });
    setAvatarDialogOpen(false); fetchGroups();
  };

  const handlePromoteToAdmin = async (userId: string) => {
    if (!selectedGroup) return;
    await supabase.from('study_group_members').update({ role: 'admin' } as any).eq('group_id', selectedGroup.id).eq('user_id', userId);
    fetchMembers();
    toast({ title: "Promoted to Admin" });
  };

  const handleDemoteToMember = async (userId: string) => {
    if (!selectedGroup) return;
    await supabase.from('study_group_members').update({ role: 'member' } as any).eq('group_id', selectedGroup.id).eq('user_id', userId);
    fetchMembers();
    toast({ title: "Demoted to Member" });
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedGroup) return;
    await supabase.from('study_group_members').delete().eq('group_id', selectedGroup.id).eq('user_id', userId);
    fetchMembers(); fetchMemberCount();
    toast({ title: "Member removed" });
  };

  // Upload a Blob/File to chat-media bucket and send as a message
  const uploadAndSendMedia = async (blob: Blob, ext: string, kind: 'image' | 'voice' | 'file', originalName?: string) => {
    if (!user || !selectedGroup) return;
    try {
      const fileName = `${user.id}/${selectedGroup.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from('chat-media').upload(fileName, blob, {
        contentType: blob.type || 'application/octet-stream',
        upsert: false,
      });
      if (upErr) {
        toast({ title: "Upload failed", description: upErr.message, variant: "destructive" });
        return;
      }
      const { data: pub } = supabase.storage.from('chat-media').getPublicUrl(fileName);
      const url = pub.publicUrl;
      // Encode media as a tagged message string parsed in render
      const payload = `[${kind}]${url}${originalName ? `|${originalName}` : ''}`;
      const insertData: any = { group_id: selectedGroup.id, user_id: user.id, message: payload };
      if (replyingTo?.id) insertData.reply_to = replyingTo.id;
      const { error } = await supabase.from('study_group_messages').insert(insertData);
      if (error) {
        toast({ title: "Error sending media", variant: "destructive" });
        return;
      }
      setReplyingTo(null);
      await fetchMessages();
      setTimeout(() => { scrollMessagesToBottom(true); }, 50);
    } catch (e: any) {
      toast({ title: "Upload error", description: e?.message || 'Unknown error', variant: "destructive" });
    }
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (audioChunksRef.current.length > 0) {
          const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          await uploadAndSendMedia(blob, 'webm', 'voice');
        }
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast({ title: "Microphone access denied", variant: "destructive" });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,application/pdf,.doc,.docx,.txt,.zip';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.size > 25 * 1024 * 1024) {
        toast({ title: "File too large", description: "Max 25 MB", variant: "destructive" });
        return;
      }
      const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
      const isImage = file.type.startsWith('image/');
      await uploadAndSendMedia(file, ext, isImage ? 'image' : 'file', file.name);
    };
    input.click();
  };

  const startReply = (msg: GroupMessage) => { setReplyingTo(msg); setEditingMessage(null); inputRef.current?.focus(); };
  const startEdit = (msg: GroupMessage) => { setEditingMessage(msg); setEditText(msg.message); setReplyingTo(null); };

  const isGroupAdmin = selectedGroup?.created_by === user?.id || members.find(m => m.user_id === user?.id)?.role === 'admin';
  const isGroupCreator = selectedGroup?.created_by === user?.id;
  const groupAvatarKey = (selectedGroup as any)?.avatar_key || 'books';

  const visibleMessages = messages
    .filter(m => !hiddenMessageIds.has(m.id))
    .filter(m => !searchQuery.trim() || m.message.toLowerCase().includes(searchQuery.toLowerCase()));
  const pinnedMessages = messages.filter(m => m.is_pinned && !m.is_deleted && !hiddenMessageIds.has(m.id));

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-2 sm:px-4 py-2 sm:py-3">
          <div className="flex items-center gap-2 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => selectedGroup ? setSelectedGroup(null) : navigate('/home')}>
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            {selectedGroup ? (
              <>
                <GroupAvatar avatarKey={groupAvatarKey} size="sm" />
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setShowInfo(true)}>
                  <p className="font-bold text-xs sm:text-sm truncate">{selectedGroup.name}</p>
                  <p className="text-[10px] text-muted-foreground/80">{memberCount} members{selectedGroup.description ? ' • tap for info' : ''}</p>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 shrink-0" onClick={() => setShowSearch(s => !s)}>
                  <Search className="h-4 w-4" />
                </Button>
                {/* Invite dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 shrink-0"><UserPlus className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={copyInviteLink}><Link2 className="h-4 w-4 mr-2" /> Copy Link</DropdownMenuItem>
                    <DropdownMenuItem onClick={copyInviteCode}><Hash className="h-4 w-4 mr-2" /> Copy Code</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setInviteDialogOpen(true)}><Mail className="h-4 w-4 mr-2" /> Invite by Email</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                {/* Settings dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 shrink-0"><Settings className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-44">
                    <DropdownMenuItem onClick={fetchMembers}><Eye className="h-4 w-4 mr-2" /> View Members</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowInfo(true)}><Info className="h-4 w-4 mr-2" /> Group Info</DropdownMenuItem>
                    {isGroupAdmin && (
                      <>
                        <DropdownMenuItem onClick={() => { setRenameName(selectedGroup.name); setRenameDialogOpen(true); }}><Pencil className="h-4 w-4 mr-2" /> Change Name</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setAvatarDialogOpen(true)}><Sparkles className="h-4 w-4 mr-2" /> Change Avatar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditDescription(selectedGroup.description || ''); setDescDialogOpen(true); }}><Pencil className="h-4 w-4 mr-2" /> Edit Description</DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    {isGroupCreator ? (
                      <DropdownMenuItem onClick={() => setDeleteConfirmOpen(true)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" /> Delete Group</DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={handleLeaveGroup} className="text-destructive"><LeaveIcon className="h-4 w-4 mr-2" /> Leave Group</DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <img src={logo} alt="JEElytics" className="h-7 w-7 rounded shrink-0" />
                <span className="text-lg sm:text-xl font-bold text-gradient-primary truncate">Study Groups</span>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-2 sm:px-4 py-3 sm:py-4 max-w-3xl mx-auto flex flex-col overflow-x-hidden">
        {!selectedGroup ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button variant="gradient" className="flex-1 text-xs sm:text-sm"><Plus className="h-4 w-4 mr-1 sm:mr-2" /> Create Group</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Study Group</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input placeholder="Group name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateGroup()} />
                    <div>
                      <p className="text-sm font-medium mb-2">Choose Avatar</p>
                      <div className="grid grid-cols-8 gap-2">
                        {Object.entries(GROUP_AVATARS).map(([key, avatar]) => {
                          const Icon = avatar.icon;
                          return (
                            <button key={key} onClick={() => setSelectedAvatar(key)} className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center transition-all ${selectedAvatar === key ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'opacity-60 hover:opacity-100'}`}>
                              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    <Button onClick={handleCreateGroup} className="w-full" disabled={!newGroupName.trim()}>Create</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={joinOpen} onOpenChange={setJoinOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1 text-xs sm:text-sm"><Link2 className="h-4 w-4 mr-1 sm:mr-2" /> Join Group</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Join Study Group</DialogTitle></DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Input placeholder="Enter invite code" value={joinCode} onChange={(e) => setJoinCode(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleJoinByCode(joinCode)} />
                    <Button onClick={() => handleJoinByCode(joinCode)} className="w-full" disabled={!joinCode.trim()}>Join</Button>
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
                <Card key={g.id} className="card-jee cursor-pointer hover:shadow-card transition-shadow" onClick={() => setSelectedGroup(g)}>
                  <CardContent className="py-4 flex items-center gap-3">
                    <GroupAvatar avatarKey={(g as any).avatar_key || 'books'} />
                    <div className="flex-1 min-w-0"><p className="font-medium truncate">{g.name}</p></div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-col flex-1 min-h-0">
            {showSearch && (
              <div className="mb-2">
                <Input placeholder="Search messages..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="h-8 text-sm" />
              </div>
            )}
            {pinnedMessages.length > 0 && !searchQuery && (
              <div className="mb-2 px-2 py-1.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-xs flex items-center gap-2 overflow-hidden">
                <Pin className="h-3 w-3 text-amber-600 shrink-0" />
                <p className="truncate text-amber-700 dark:text-amber-400"><span className="font-semibold">{pinnedMessages[0].sender_name}:</span> {pinnedMessages[0].message.substring(0, 80)}</p>
              </div>
            )}
            {/* Messages area */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto overflow-x-hidden space-y-2 border border-border rounded-lg p-2 sm:p-4 bg-card/30" style={{ maxHeight: 'calc(100vh - 180px)', minHeight: '300px' }}>
              {visibleMessages.length === 0 && (
                <p className="text-center text-muted-foreground py-8 text-sm">{searchQuery ? 'No matches found.' : 'No messages yet. Start the conversation! 💬'}</p>
              )}
              {visibleMessages.map((m) => {
                const isOwn = m.user_id === user?.id;
                const isDeleted = m.is_deleted;
                return (
                  <div key={m.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`relative max-w-[85%] sm:max-w-[75%] px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg text-sm ${
                      isDeleted ? 'bg-muted/30 italic text-muted-foreground'
                        : isOwn ? 'bg-[hsl(180,60%,40%)] text-white rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}>
                      {/* Reply preview */}
                      {m.reply_message && !isDeleted && (
                        <div className={`text-[10px] mb-1 pl-2 border-l-2 ${isOwn ? 'border-white/40 text-white/70' : 'border-primary/40 text-muted-foreground'}`}>
                          <span className="font-semibold">{m.reply_sender}</span>
                          <p className="truncate">{m.reply_message}</p>
                        </div>
                      )}
                      {!isOwn && !isDeleted && (
                        <p className="text-[10px] font-semibold text-primary mb-0.5">{m.sender_name}</p>
                      )}
                      {editingMessage?.id === m.id ? (
                        <div className="flex items-center gap-1">
                          <input value={editText} onChange={(e) => setEditText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleEditMessage()} className="bg-transparent border-b border-white/50 outline-none text-sm flex-1 min-w-0" autoFocus />
                          <button onClick={handleEditMessage} className="p-0.5"><Check className="h-3.5 w-3.5" /></button>
                          <button onClick={() => setEditingMessage(null)} className="p-0.5"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ) : (
                        (() => {
                          const mediaMatch = m.message.match(/^\[(image|voice|file)\](https?:\/\/[^\s|]+)(?:\|(.+))?$/);
                          if (mediaMatch) {
                            const [, kind, url, name] = mediaMatch;
                            if (kind === 'image') {
                              return <a href={url} target="_blank" rel="noreferrer"><img src={url} alt="shared" className="rounded-md max-w-[220px] max-h-[260px] object-cover" /></a>;
                            }
                            if (kind === 'voice') {
                              return <audio controls src={url} className="max-w-[220px]" />;
                            }
                            return <a href={url} target="_blank" rel="noreferrer" className={`underline break-all text-xs ${isOwn ? 'text-white' : 'text-primary'}`}>📎 {name || 'file'}</a>;
                          }
                          return <p className="break-words whitespace-pre-wrap">{m.message}</p>;
                        })()
                      )}
                      {m.is_pinned && !isDeleted && (
                        <div className={`flex items-center gap-0.5 text-[9px] mb-0.5 ${isOwn ? 'text-white/70' : 'text-amber-600'}`}>
                          <Pin className="h-2.5 w-2.5" /> Pinned
                        </div>
                      )}
                      {m.reactions && m.reactions.length > 0 && !isDeleted && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {m.reactions.map(r => (
                            <button key={r.emoji} onClick={() => toggleReaction(m.id, r.emoji)}
                              className={`text-[10px] px-1.5 py-0.5 rounded-full border ${r.mine ? 'bg-primary/20 border-primary/40' : 'bg-background/50 border-border'}`}>
                              {r.emoji} {r.count}
                            </button>
                          ))}
                        </div>
                      )}
                      <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? 'text-white/60' : 'text-muted-foreground/60'}`}>
                        <span className="text-[10px]">{new Date(m.created_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                        {m.edited_at && !isDeleted && <span className="text-[9px] italic">edited</span>}
                        {isOwn && !isDeleted && <DoubleTick className="ml-0.5 text-white/60" />}
                      </div>

                      {/* 3-dot menu — ALWAYS visible */}
                      {!isDeleted && (
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <button className={`absolute top-1 ${isOwn ? '-left-6' : '-right-6'} p-0.5 rounded-full bg-card border border-border shadow-sm`}>
                              <MoreVertical className="h-3 w-3 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align={isOwn ? "start" : "end"} className="w-44" sideOffset={4}>
                            <div className="flex justify-around px-1 py-1.5 border-b border-border">
                              {QUICK_EMOJIS.map(e => (
                                <button key={e} className="text-base hover:scale-125 transition-transform" onClick={() => toggleReaction(m.id, e)}>{e}</button>
                              ))}
                            </div>
                            <DropdownMenuItem onClick={() => startReply(m)}><Reply className="h-3.5 w-3.5 mr-2" /> Reply</DropdownMenuItem>
                            {isGroupAdmin && (
                              <DropdownMenuItem onClick={() => togglePin(m.id)}>
                                {m.is_pinned ? <><PinOff className="h-3.5 w-3.5 mr-2" /> Unpin</> : <><Pin className="h-3.5 w-3.5 mr-2" /> Pin</>}
                              </DropdownMenuItem>
                            )}
                            {isOwn && canEdit(m) && (
                              <DropdownMenuItem onClick={() => startEdit(m)}><Pencil className="h-3.5 w-3.5 mr-2" /> Edit</DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => confirmDeleteMessage(m.id, isOwn)} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-2" /> Delete</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { navigator.clipboard.writeText(m.message); toast({ title: "Copied!" }); }}><Copy className="h-3.5 w-3.5 mr-2" /> Copy</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply preview */}
            {replyingTo && (
              <div className="flex items-center gap-2 mt-2 px-3 py-2 bg-muted/50 rounded-t-lg border border-b-0 border-border">
                <Reply className="h-4 w-4 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-primary">{replyingTo.sender_name}</p>
                  <p className="text-xs text-muted-foreground truncate">{replyingTo.message}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-muted rounded"><X className="h-3.5 w-3.5" /></button>
              </div>
            )}

            {/* Input with voice & upload buttons */}
            <div className={`flex items-center gap-1 sm:gap-2 ${replyingTo ? '' : 'mt-3'}`}>
              <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8 sm:h-9 sm:w-9" onClick={handleImageUpload}>
                <ImageIcon className="h-4 w-4 text-muted-foreground" />
              </Button>
              <Input ref={inputRef} placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()} className="flex-1 h-8 sm:h-9 text-sm" />
              {newMessage.trim() ? (
                <Button onClick={handleSendMessage} size="icon" className="shrink-0 h-8 w-8 sm:h-9 sm:w-9"><Send className="h-4 w-4" /></Button>
              ) : (
                <Button variant={isRecording ? "destructive" : "ghost"} size="icon" className="shrink-0 h-8 w-8 sm:h-9 sm:w-9" onClick={isRecording ? stopRecording : startRecording}>
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4 text-muted-foreground" />}
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Invite by email */}
      <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Invite by Email</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Input placeholder="Enter email address" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleInvite()} />
            <Button onClick={handleInvite} className="w-full" disabled={!inviteEmail.trim()}>Send Invite</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View members with role management */}
      <Dialog open={membersDialogOpen} onOpenChange={setMembersDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Group Members ({members.length})</DialogTitle></DialogHeader>
          <div className="space-y-2 pt-4 max-h-[60vh] overflow-y-auto">
            {members.map(m => (
              <div key={m.user_id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{m.display_name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {m.user_id === selectedGroup?.created_by ? 'Creator' : m.role === 'admin' ? 'Admin' : 'Member'}
                  </p>
                </div>
                {(m.role === 'admin' || m.user_id === selectedGroup?.created_by) && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                    {m.user_id === selectedGroup?.created_by ? 'Creator' : 'Admin'}
                  </span>
                )}
                {isGroupCreator && m.user_id !== user?.id && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7"><MoreVertical className="h-3.5 w-3.5" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-36">
                      {m.role === 'member' ? (
                        <DropdownMenuItem onClick={() => handlePromoteToAdmin(m.user_id)}>
                          <Crown className="h-3.5 w-3.5 mr-2" /> Make Admin
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleDemoteToMember(m.user_id)}>
                          <Users className="h-3.5 w-3.5 mr-2" /> Make Member
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleRemoveMember(m.user_id)} className="text-destructive">
                        <Trash2 className="h-3.5 w-3.5 mr-2" /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rename */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Rename Group</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <Input value={renameName} onChange={(e) => setRenameName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleRename()} />
            <Button onClick={handleRename} className="w-full" disabled={!renameName.trim()}>Rename</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change avatar */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Choose Group Avatar</DialogTitle></DialogHeader>
          <div className="grid grid-cols-8 gap-3 pt-4">
            {Object.entries(GROUP_AVATARS).map(([key, avatar]) => {
              const Icon = avatar.icon;
              return (
                <button key={key} onClick={() => handleChangeAvatar(key)} className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-br ${avatar.color} flex items-center justify-center transition-all hover:scale-110 ${groupAvatarKey === key ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'}`}>
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete group confirmation */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Group?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete "{selectedGroup?.name}" and all messages. This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGroup} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete message — 3 options */}
      <AlertDialog open={deleteMessageConfirmOpen} onOpenChange={setDeleteMessageConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Message?</AlertDialogTitle>
            <AlertDialogDescription>Choose how to delete this message.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex flex-col gap-2 py-2">
            <Button variant="outline" onClick={() => pendingDeleteMsg && handleDeleteMessage(pendingDeleteMsg.id, false)}>
              Delete for me
            </Button>
            {pendingDeleteMsg?.isOwn && (
              <Button variant="destructive" onClick={() => pendingDeleteMsg && handleDeleteMessage(pendingDeleteMsg.id, true)}>
                Delete for everyone
              </Button>
            )}
            <Button variant="ghost" onClick={() => { setDeleteMessageConfirmOpen(false); setPendingDeleteMsg(null); }}>
              Cancel
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
