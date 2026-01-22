import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, TrendingUp, Wallet, Clock, CheckCircle, 
  XCircle, PlayCircle, Video, Briefcase, ArrowUpRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { TeacherStats, RevenueRecord, WithdrawalRequest } from '@/types/teacher';

interface TeacherEarningsTabProps {
  stats: TeacherStats | null;
  revenue: RevenueRecord[];
  withdrawals: WithdrawalRequest[];
  isLoading: boolean;
  createWithdrawal: (amount: number, method: 'bkash' | 'nagad' | 'bank', details: Record<string, any>) => Promise<{ error: any }>;
  refetch: () => void;
  language: 'en' | 'bn';
}

const translations = {
  en: {
    title: 'Earnings & Withdrawals',
    subtitle: 'Track your revenue and request payouts',
    totalEarnings: 'Total Earnings',
    availableBalance: 'Available Balance',
    pendingWithdrawal: 'Pending Withdrawal',
    paidOut: 'Paid Out',
    withdraw: 'Withdraw',
    withdrawTitle: 'Request Withdrawal',
    amount: 'Amount (BDT)',
    paymentMethod: 'Payment Method',
    accountNumber: 'Account Number',
    submit: 'Submit Request',
    cancel: 'Cancel',
    revenueHistory: 'Revenue History',
    withdrawalHistory: 'Withdrawal History',
    noRevenue: 'No revenue records yet',
    noWithdrawals: 'No withdrawal requests yet',
    loading: 'Loading...',
    recorded: 'Recorded Course',
    live: 'Live Class',
    paidWork: 'Paid Work',
    free: 'Free Course',
    pending: 'Pending',
    approved: 'Approved',
    paid: 'Paid',
    rejected: 'Rejected',
    yourShare: 'Your Share',
    agencyShare: 'Agency Share',
  },
  bn: {
    title: 'আয় এবং উত্তোলন',
    subtitle: 'আপনার রেভিনিউ ট্র্যাক করুন এবং পেআউট রিকোয়েস্ট করুন',
    totalEarnings: 'মোট আয়',
    availableBalance: 'উপলব্ধ ব্যালেন্স',
    pendingWithdrawal: 'পেন্ডিং উত্তোলন',
    paidOut: 'পরিশোধিত',
    withdraw: 'উত্তোলন করুন',
    withdrawTitle: 'উত্তোলন রিকোয়েস্ট',
    amount: 'পরিমাণ (টাকা)',
    paymentMethod: 'পেমেন্ট মেথড',
    accountNumber: 'একাউন্ট নম্বর',
    submit: 'রিকোয়েস্ট পাঠান',
    cancel: 'বাতিল',
    revenueHistory: 'আয়ের ইতিহাস',
    withdrawalHistory: 'উত্তোলনের ইতিহাস',
    noRevenue: 'এখনো কোনো আয়ের রেকর্ড নেই',
    noWithdrawals: 'এখনো কোনো উত্তোলন রিকোয়েস্ট নেই',
    loading: 'লোড হচ্ছে...',
    recorded: 'রেকর্ডেড কোর্স',
    live: 'লাইভ ক্লাস',
    paidWork: 'পেইড ওয়ার্ক',
    free: 'ফ্রি কোর্স',
    pending: 'পেন্ডিং',
    approved: 'অনুমোদিত',
    paid: 'পরিশোধিত',
    rejected: 'প্রত্যাখ্যাত',
    yourShare: 'আপনার অংশ',
    agencyShare: 'এজেন্সি অংশ',
  },
};

export default function TeacherEarningsTab({ 
  stats, revenue, withdrawals, isLoading, createWithdrawal, refetch, language 
}: TeacherEarningsTabProps) {
  const { toast } = useToast();
  const t = translations[language];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad' | 'bank'>('bkash');
  const [accountNumber, setAccountNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !accountNumber) return;

    try {
      setIsSubmitting(true);
      const { error } = await createWithdrawal(withdrawAmount, paymentMethod, {
        account_number: accountNumber,
      });

      if (error) throw error;

      toast({ 
        title: language === 'bn' ? 'রিকোয়েস্ট পাঠানো হয়েছে' : 'Request submitted',
        description: language === 'bn' ? 'অ্যাডমিন অনুমোদনের পর পেমেন্ট প্রসেস হবে' : 'Payment will be processed after admin approval',
      });

      setIsDialogOpen(false);
      setWithdrawAmount(0);
      setAccountNumber('');
      refetch();
    } catch (error) {
      console.error('Error:', error);
      toast({ 
        title: language === 'bn' ? 'ত্রুটি' : 'Error',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRevenueTypeIcon = (type: string) => {
    switch (type) {
      case 'recorded_course': return <PlayCircle className="w-4 h-4 text-blue-500" />;
      case 'live_class': return <Video className="w-4 h-4 text-green-500" />;
      case 'paid_work': return <Briefcase className="w-4 h-4 text-purple-500" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getRevenueTypeLabel = (type: string) => {
    switch (type) {
      case 'recorded_course': return t.recorded;
      case 'live_class': return t.live;
      case 'paid_work': return t.paidWork;
      case 'free_course': return t.free;
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge variant="secondary">{t.pending}</Badge>;
      case 'approved': return <Badge variant="default">{t.approved}</Badge>;
      case 'paid': return <Badge className="bg-green-500">{t.paid}</Badge>;
      case 'rejected': return <Badge variant="destructive">{t.rejected}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const paidTotal = withdrawals
    .filter(w => w.status === 'paid')
    .reduce((sum, w) => sum + w.amount, 0);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" disabled={(stats?.availableBalance || 0) <= 0}>
              <ArrowUpRight className="w-4 h-4" />
              {t.withdraw}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t.withdrawTitle}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="p-4 bg-accent/50 rounded-lg">
                <p className="text-sm text-muted-foreground">{t.availableBalance}</p>
                <p className="text-2xl font-bold text-green-500">৳{stats?.availableBalance?.toLocaleString() || 0}</p>
              </div>
              <div className="space-y-2">
                <Label>{t.amount}</Label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  max={stats?.availableBalance || 0}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label>{t.paymentMethod}</Label>
                <Select value={paymentMethod} onValueChange={(v: 'bkash' | 'nagad' | 'bank') => setPaymentMethod(v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bkash">bKash</SelectItem>
                    <SelectItem value="nagad">Nagad</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>{t.accountNumber}</Label>
                <Input
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder={paymentMethod === 'bank' ? 'Account number' : 'Mobile number'}
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  {t.cancel}
                </Button>
                <Button 
                  onClick={handleWithdraw} 
                  disabled={isSubmitting || !withdrawAmount || !accountNumber || withdrawAmount > (stats?.availableBalance || 0)} 
                  className="flex-1"
                >
                  {isSubmitting ? '...' : t.submit}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.totalEarnings}</p>
                <p className="text-2xl font-bold">৳{stats?.totalEarnings?.toLocaleString() || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.availableBalance}</p>
                <p className="text-2xl font-bold">৳{stats?.availableBalance?.toLocaleString() || 0}</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.pendingWithdrawal}</p>
                <p className="text-2xl font-bold">৳{stats?.pendingWithdrawal?.toLocaleString() || 0}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{t.paidOut}</p>
                <p className="text-2xl font-bold">৳{paidTotal.toLocaleString()}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.revenueHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          {revenue.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t.noRevenue}</p>
          ) : (
            <div className="space-y-3">
              {revenue.slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getRevenueTypeIcon(record.revenue_type)}
                    <div>
                      <p className="font-medium">{getRevenueTypeLabel(record.revenue_type)}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(record.created_at).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-500">+৳{record.teacher_share.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {t.yourShare}: {record.teacher_percentage}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Withdrawal History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t.withdrawalHistory}</CardTitle>
        </CardHeader>
        <CardContent>
          {withdrawals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">{t.noWithdrawals}</p>
          ) : (
            <div className="space-y-3">
              {withdrawals.map((withdrawal) => (
                <div key={withdrawal.id} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">৳{withdrawal.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {withdrawal.payment_method.toUpperCase()} • {new Date(withdrawal.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(withdrawal.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
