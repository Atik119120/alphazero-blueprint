import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Edit, Save, Camera, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface TeacherProfileTabProps {
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'My Profile',
    subtitle: 'Manage your profile information',
    fullName: 'Full Name',
    email: 'Email',
    phone: 'Phone Number',
    bio: 'Bio',
    bioPlaceholder: 'Tell students about yourself...',
    skills: 'Skills',
    addSkill: 'Add skill',
    save: 'Save Changes',
    saving: 'Saving...',
    changePhoto: 'Change Photo',
    profileUpdated: 'Profile updated successfully',
    updateError: 'Failed to update profile',
    linkedTeamProfile: 'Your profile is linked to the Team page',
    loading: 'Loading...',
  },
  bn: {
    title: 'আমার প্রোফাইল',
    subtitle: 'আপনার প্রোফাইল তথ্য ম্যানেজ করুন',
    fullName: 'পূর্ণ নাম',
    email: 'ইমেইল',
    phone: 'ফোন নম্বর',
    bio: 'বায়ো',
    bioPlaceholder: 'শিক্ষার্থীদের নিজের সম্পর্কে বলুন...',
    skills: 'দক্ষতা',
    addSkill: 'দক্ষতা যোগ করুন',
    save: 'পরিবর্তন সেভ করুন',
    saving: 'সেভ হচ্ছে...',
    changePhoto: 'ছবি পরিবর্তন',
    profileUpdated: 'প্রোফাইল আপডেট হয়েছে',
    updateError: 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে',
    linkedTeamProfile: 'আপনার প্রোফাইল টিম পেজের সাথে লিংক করা আছে',
    loading: 'লোড হচ্ছে...',
  },
};

export default function TeacherProfileTab({ language }: TeacherProfileTabProps) {
  const { profile, refreshProfile } = useAuth();
  const { toast } = useToast();
  const t = translations[language];

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone_number: '',
    bio: '',
    skills: [] as string[],
  });
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (profile) {
      loadProfileData();
    }
  }, [profile]);

  const loadProfileData = async () => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, phone_number, bio, skills')
        .eq('id', profile.id)
        .single();

      if (error) throw error;

      setFormData({
        full_name: data.full_name || '',
        phone_number: data.phone_number || '',
        bio: data.bio || '',
        skills: data.skills || [],
      });
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    try {
      setIsSaving(true);

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          bio: formData.bio,
          skills: formData.skills,
        })
        .eq('id', profile.id);

      if (error) throw error;

      // If linked to team member, update there too
      const profileData = await supabase
        .from('profiles')
        .select('linked_team_member_id')
        .eq('id', profile.id)
        .single();

      if (profileData.data?.linked_team_member_id) {
        await supabase
          .from('team_members')
          .update({
            name: formData.full_name,
            bio: formData.bio,
          })
          .eq('id', profileData.data.linked_team_member_id);
      }

      toast({ title: t.profileUpdated });
      setIsEditing(false);
      refreshProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ title: t.updateError, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove),
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      refreshProfile();
      toast({ title: language === 'bn' ? 'ছবি আপলোড হয়েছে' : 'Photo uploaded' });
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({ title: t.updateError, variant: 'destructive' });
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 max-w-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            <Save className="w-4 h-4" />
            {isSaving ? t.saving : t.save}
          </Button>
        )}
      </div>

      {/* Avatar Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="w-24 h-24">
                <AvatarImage src={profile.avatar_url || ''} />
                <AvatarFallback className="text-2xl">
                  <User className="w-10 h-10" />
                </AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="w-4 h-4 text-primary-foreground" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </label>
            </div>
            <div>
              <h2 className="text-xl font-bold">{profile.full_name}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
              <Badge className="mt-2">{language === 'bn' ? 'টিচার' : 'Teacher'}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{language === 'bn' ? 'প্রোফাইল তথ্য' : 'Profile Information'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t.fullName}</Label>
            <Input
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.email}</Label>
            <Input
              value={profile.email}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label>{t.phone}</Label>
            <Input
              value={formData.phone_number}
              onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
              disabled={!isEditing}
              placeholder="+880"
            />
          </div>

          <div className="space-y-2">
            <Label>{t.bio}</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder={t.bioPlaceholder}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.skills}</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  {isEditing && (
                    <button onClick={() => removeSkill(skill)} className="ml-1 hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
            {isEditing && (
              <div className="flex gap-2">
                <Input
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder={t.addSkill}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <Button type="button" onClick={addSkill} size="icon" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
