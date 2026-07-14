import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Trash2, Ticket, Percent, DollarSign, Copy, Loader2 } from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  max_uses: number | null;
  used_count: number;
  course_id: string | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

interface Course {
  id: string;
  title: string;
}

export default function CouponManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [maxUses, setMaxUses] = useState('');
  const [courseId, setCourseId] = useState('all');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    fetchCoupons();
    fetchCourses();
  }, []);

  const fetchCoupons = async () => {
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error && data) setCoupons(data as Coupon[]);
    setLoading(false);
  };

  const fetchCourses = async () => {
    const { data } = await supabase.from('courses').select('id, title').order('title');
    if (data) setCourses(data);
  };

  const generateCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = 'AZ-';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCode(result);
  };

  const handleCreate = async () => {
    if (!code || !discountValue) {
      toast.error('Enter code and discount value');
      return;
    }

    setSaving(true);
    const { error } = await supabase.from('coupons').insert({
      code: code.toUpperCase(),
      discount_type: discountType,
      discount_value: parseFloat(discountValue),
      max_uses: maxUses ? parseInt(maxUses) : null,
      course_id: courseId === 'all' ? null : courseId,
      expires_at: expiresAt || null,
    });

    if (error) {
      if (error.code === '23505') {
        toast.error('This code already exists');
      } else {
        toast.error('Failed to create coupon');
      }
    } else {
      toast.success('Coupon created!');
      setIsDialogOpen(false);
      resetForm();
      fetchCoupons();
    }
    setSaving(false);
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    const { error } = await supabase.from('coupons').update({ is_active: !isActive }).eq('id', id);
    if (!error) {
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: !isActive } : c));
      toast.success(isActive ? 'Coupon deactivated' : 'Coupon activated');
    }
  };

  const deleteCoupon = async (id: string) => {
    const { error } = await supabase.from('coupons').delete().eq('id', id);
    if (!error) {
      setCoupons(prev => prev.filter(c => c.id !== id));
      toast.success('Coupon deleted');
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied!');
  };

  const resetForm = () => {
    setCode('');
    setDiscountType('percentage');
    setDiscountValue('');
    setMaxUses('');
    setCourseId('all');
    setExpiresAt('');
  };

  const getCourseName = (courseId: string | null) => {
    if (!courseId) return 'All Courses';
    return courses.find(c => c.id === courseId)?.title || 'Unknown';
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Ticket className="w-5 h-5 text-primary" />
            Coupon Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Create & manage discount coupons</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => { resetForm(); setIsDialogOpen(true); }}>
              <Plus className="w-4 h-4" />
              New Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create new coupon</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Coupon Code</Label>
                <div className="flex gap-2">
                  <Input 
                    value={code} 
                    onChange={(e) => setCode(e.target.value.toUpperCase())} 
                    placeholder="e.g., AZ-SAVE20"
                    className="font-mono"
                  />
                  <Button variant="outline" size="sm" onClick={generateCode} className="shrink-0">
                    Auto
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select value={discountType} onValueChange={setDiscountType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed (৳)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Discount Value</Label>
                  <Input 
                    type="number" 
                    value={discountValue} 
                    onChange={(e) => setDiscountValue(e.target.value)} 
                    placeholder={discountType === 'percentage' ? '20' : '100'}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Course (optional)</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Applicable to all courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Max Usage</Label>
                  <Input 
                    type="number" 
                    value={maxUses} 
                    onChange={(e) => setMaxUses(e.target.value)} 
                    placeholder="Unlimited"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Expires on</Label>
                  <Input 
                    type="date" 
                    value={expiresAt} 
                    onChange={(e) => setExpiresAt(e.target.value)} 
                  />
                </div>
              </div>

              <Button onClick={handleCreate} disabled={saving} className="w-full gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Create Coupon
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Ticket className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No coupons found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {coupons.map((coupon) => (
            <Card key={coupon.id} className={`transition-all ${!coupon.is_active ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      coupon.discount_type === 'percentage' ? 'bg-primary/10' : 'bg-emerald-500/10'
                    }`}>
                      {coupon.discount_type === 'percentage' ? (
                        <Percent className="w-5 h-5 text-primary" />
                      ) : (
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-bold text-sm">{coupon.code}</code>
                        <button onClick={() => copyCode(coupon.code)} className="text-muted-foreground hover:text-foreground">
                          <Copy className="w-3 h-3" />
                        </button>
                        <Badge variant={coupon.is_active ? 'default' : 'secondary'} className="text-[10px]">
                          {coupon.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% off` : `৳${coupon.discount_value} off`}
                        {' · '}{getCourseName(coupon.course_id)}
                        {' · '}{coupon.used_count}/{coupon.max_uses || '∞'} Usage
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch checked={coupon.is_active} onCheckedChange={() => toggleActive(coupon.id, coupon.is_active)} />
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => deleteCoupon(coupon.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
