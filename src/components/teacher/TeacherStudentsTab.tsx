import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, BookOpen, Clock, CheckCircle, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { StudentProgress } from '@/types/teacher';

interface TeacherStudentsTabProps {
  students: StudentProgress[];
  isLoading: boolean;
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'My Students',
    subtitle: 'View students enrolled in your courses',
    search: 'Search students...',
    noStudents: 'No students enrolled yet',
    noStudentsDesc: 'Students will appear here once they enroll in your courses',
    loading: 'Loading...',
    progress: 'Progress',
    completed: 'Completed',
    lastActive: 'Last Active',
    course: 'Course',
    videos: 'videos completed',
    active: 'Active',
    inactive: 'Inactive',
  },
  bn: {
    title: 'আমার শিক্ষার্থীরা',
    subtitle: 'আপনার কোর্সে এনরোল করা শিক্ষার্থীদের দেখুন',
    search: 'শিক্ষার্থী খুঁজুন...',
    noStudents: 'এখনো কোনো শিক্ষার্থী এনরোল করেনি',
    noStudentsDesc: 'শিক্ষার্থীরা আপনার কোর্সে এনরোল করলে এখানে দেখা যাবে',
    loading: 'লোড হচ্ছে...',
    progress: 'অগ্রগতি',
    completed: 'সম্পন্ন',
    lastActive: 'সর্বশেষ সক্রিয়',
    course: 'কোর্স',
    videos: 'ভিডিও দেখেছে',
    active: 'সক্রিয়',
    inactive: 'নিষ্ক্রিয়',
  },
};

export default function TeacherStudentsTab({ students, isLoading, language }: TeacherStudentsTabProps) {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((s) => 
    s.student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return language === 'bn' ? 'কখনো না' : 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return language === 'bn' ? 'আজ' : 'Today';
    if (days === 1) return language === 'bn' ? 'গতকাল' : 'Yesterday';
    if (days < 7) return language === 'bn' ? `${days} দিন আগে` : `${days} days ago`;
    return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US');
  };

  const isRecentlyActive = (dateString: string | null) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days < 7;
  };

  if (isLoading) {
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
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.search}
            className="pl-9"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{students.length}</p>
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'মোট শিক্ষার্থী' : 'Total Students'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">
              {students.filter(s => s.is_completed).length}
            </p>
            <p className="text-sm text-muted-foreground">{t.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">
              {students.filter(s => isRecentlyActive(s.last_watched_at)).length}
            </p>
            <p className="text-sm text-muted-foreground">{t.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-yellow-500">
              {Math.round(students.reduce((acc, s) => acc + s.progress_percent, 0) / (students.length || 1))}%
            </p>
            <p className="text-sm text-muted-foreground">{language === 'bn' ? 'গড় অগ্রগতি' : 'Avg Progress'}</p>
          </CardContent>
        </Card>
      </div>

      {/* Students List */}
      {filteredStudents.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t.noStudents}</h3>
          <p className="text-muted-foreground">{t.noStudentsDesc}</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((item, index) => (
            <Card key={`${item.student.id}-${item.course.id}-${index}`} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Student Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={item.student.avatar_url || ''} />
                      <AvatarFallback>
                        <User className="w-5 h-5" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium truncate">{item.student.full_name}</p>
                        <Badge 
                          variant={isRecentlyActive(item.last_watched_at) ? 'default' : 'secondary'}
                          className="shrink-0"
                        >
                          {isRecentlyActive(item.last_watched_at) ? t.active : t.inactive}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {item.student.email}
                        </span>
                        {(item.student as any).phone_number && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {(item.student as any).phone_number}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course & Progress */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-2 text-sm">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {language === 'bn' ? item.course.title : item.course.title_en || item.course.title}
                      </span>
                    </div>

                    <div className="w-full sm:w-32">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span>{t.progress}</span>
                        <span className={item.is_completed ? 'text-green-500' : ''}>
                          {item.progress_percent}%
                        </span>
                      </div>
                      <Progress value={item.progress_percent} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.videos_completed}/{item.total_videos} {t.videos}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatDate(item.last_watched_at)}</span>
                    </div>

                    {item.is_completed && (
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </motion.div>
  );
}
