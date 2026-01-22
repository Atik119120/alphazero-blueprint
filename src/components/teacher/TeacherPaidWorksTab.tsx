import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, PlayCircle, AlertCircle, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PaidWork } from '@/types/teacher';

interface TeacherPaidWorksTabProps {
  works: PaidWork[];
  isLoading: boolean;
  updateWorkStatus: (workId: string, status: PaidWork['status']) => Promise<{ error: any }>;
  refetch: () => void;
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'Paid Works',
    subtitle: 'Agency projects assigned to you',
    noWorks: 'No paid works assigned',
    noWorksDesc: 'When the agency assigns you a project, it will appear here',
    loading: 'Loading...',
    assigned: 'Assigned',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    deadline: 'Deadline',
    client: 'Client',
    yourShare: 'Your Share (80%)',
    updateStatus: 'Update Status',
    design: 'Design',
    development: 'Development',
    video: 'Video',
    other: 'Other',
    total: 'Total',
  },
  bn: {
    title: 'পেইড ওয়ার্ক',
    subtitle: 'এজেন্সির প্রজেক্ট যা আপনাকে দেওয়া হয়েছে',
    noWorks: 'কোনো পেইড ওয়ার্ক অ্যাসাইন করা হয়নি',
    noWorksDesc: 'এজেন্সি আপনাকে প্রজেক্ট অ্যাসাইন করলে এখানে দেখা যাবে',
    loading: 'লোড হচ্ছে...',
    assigned: 'অ্যাসাইন করা',
    inProgress: 'চলমান',
    completed: 'সম্পন্ন',
    cancelled: 'বাতিল',
    deadline: 'ডেডলাইন',
    client: 'ক্লায়েন্ট',
    yourShare: 'আপনার অংশ (৮০%)',
    updateStatus: 'স্ট্যাটাস আপডেট',
    design: 'ডিজাইন',
    development: 'ডেভেলপমেন্ট',
    video: 'ভিডিও',
    other: 'অন্যান্য',
    total: 'মোট',
  },
};

export default function TeacherPaidWorksTab({ works, isLoading, updateWorkStatus, refetch, language }: TeacherPaidWorksTabProps) {
  const t = translations[language];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'assigned': return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'in_progress': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return t.assigned;
      case 'in_progress': return t.inProgress;
      case 'completed': return t.completed;
      case 'cancelled': return t.cancelled;
      default: return status;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'design': return t.design;
      case 'development': return t.development;
      case 'video': return t.video;
      default: return t.other;
    }
  };

  const handleStatusChange = async (workId: string, newStatus: PaidWork['status']) => {
    const { error } = await updateWorkStatus(workId, newStatus);
    if (!error) {
      refetch();
    }
  };

  const calculateShare = (total: number) => Math.round(total * 0.8);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  // Stats
  const totalWorks = works.length;
  const completedWorks = works.filter(w => w.status === 'completed').length;
  const inProgressWorks = works.filter(w => w.status === 'in_progress').length;
  const totalEarnings = works
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + calculateShare(w.total_amount), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        <p className="text-muted-foreground">{t.subtitle}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-primary">{totalWorks}</p>
            <p className="text-sm text-muted-foreground">{t.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-500">{inProgressWorks}</p>
            <p className="text-sm text-muted-foreground">{t.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{completedWorks}</p>
            <p className="text-sm text-muted-foreground">{t.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-500">৳{totalEarnings.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{t.yourShare}</p>
          </CardContent>
        </Card>
      </div>

      {/* Works List */}
      {works.length === 0 ? (
        <Card className="p-12 text-center">
          <Briefcase className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">{t.noWorks}</h3>
          <p className="text-muted-foreground">{t.noWorksDesc}</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {works.map((work) => (
            <Card key={work.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Work Info */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Briefcase className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold">{work.title}</h3>
                          <Badge variant="outline">{getCategoryLabel(work.category)}</Badge>
                        </div>
                        {work.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {work.description}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      {work.client_name && (
                        <span>{t.client}: {work.client_name}</span>
                      )}
                      {work.deadline && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {t.deadline}: {new Date(work.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Amount & Status */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{t.total}: ৳{work.total_amount.toLocaleString()}</p>
                      <p className="text-lg font-bold text-green-500">
                        {t.yourShare}: ৳{calculateShare(work.total_amount).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(work.status)}
                      {work.status !== 'completed' && work.status !== 'cancelled' ? (
                        <Select
                          value={work.status}
                          onValueChange={(value: PaidWork['status']) => handleStatusChange(work.id, value)}
                        >
                          <SelectTrigger className="w-36">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="assigned">{t.assigned}</SelectItem>
                            <SelectItem value="in_progress">{t.inProgress}</SelectItem>
                            <SelectItem value="completed">{t.completed}</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant={work.status === 'completed' ? 'default' : 'destructive'}>
                          {getStatusLabel(work.status)}
                        </Badge>
                      )}
                    </div>
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
