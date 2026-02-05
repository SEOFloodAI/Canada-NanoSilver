import { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  TrendingUp, 
  Download, 
  Clock, 
  Bell,
  X,
  FileText,
  Heart,
  Activity
} from 'lucide-react';
import { formatDate, downloadFile } from '@/lib/utils';
import { useWellnessStore, useAuthStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { WellnessDisclaimer } from '@/components/ui-custom/Disclaimer';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cn } from '@/lib/utils';

export function WellnessApp() {
  const { user } = useAuthStore();
  const { entries, reminders, addEntry, deleteEntry, addReminder, updateReminder, deleteReminder } = useWellnessStore();
  
  const [activeTab, setActiveTab] = useState('journal');
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // New entry form state
  const [newEntry, setNewEntry] = useState({
    notes: '',
    wellBeingScale: 5,
    tags: [] as string[],
  });
  
  // New reminder form state
  const [newReminder, setNewReminder] = useState({
    title: 'Wellness Routine',
    time: '09:00',
    days: [1, 2, 3, 4, 5] as number[],
  });

  const handleAddEntry = () => {
    if (!user) return;
    
    addEntry({
      userId: user.id,
      date: selectedDate.toISOString(),
      notes: newEntry.notes,
      wellBeingScale: newEntry.wellBeingScale,
      photos: [],
      tags: newEntry.tags,
    });
    
    setNewEntry({ notes: '', wellBeingScale: 5, tags: [] });
    setIsAddEntryOpen(false);
  };

  const handleAddReminder = () => {
    if (!user) return;
    
    addReminder({
      userId: user.id,
      title: newReminder.title,
      time: newReminder.time,
      days: newReminder.days,
      isActive: true,
    });
    
    setNewReminder({ title: 'Wellness Routine', time: '09:00', days: [1, 2, 3, 4, 5] });
    setIsAddReminderOpen(false);
  };

  const handleExportCSV = () => {
    if (entries.length === 0) return;
    
    const csvContent = [
      ['Date', 'Well-being Scale (1-10)', 'Notes', 'Tags'].join(','),
      ...entries.map(entry => [
        formatDate(entry.date),
        entry.wellBeingScale,
        `"${entry.notes.replace(/"/g, '""')}"`,
        entry.tags.join('; '),
      ].join(',')),
    ].join('\n');
    
    downloadFile(csvContent, `wellness-report-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  // Prepare chart data
  const chartData = entries
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map(entry => ({
      date: formatDate(entry.date, { month: 'short', day: 'numeric' }),
      scale: entry.wellBeingScale,
    }));

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Wellness Companion</span>
          </div>
          <h2 className="font-orbitron text-3xl sm:text-4xl font-bold mb-4">
            Personal <span className="text-primary">Wellness</span> Journal
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Track your daily wellness journey with our personal journal app. 
            Set reminders, log your observations, and visualize your progress over time.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mb-8">
          <WellnessDisclaimer />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="journal" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Journal
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Reminders
            </TabsTrigger>
          </TabsList>

          {/* Journal Tab */}
          <TabsContent value="journal" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-orbitron text-xl font-semibold">Wellness Entries</h3>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportCSV} className="border-primary/30">
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
                  <DialogTrigger asChild>
                    <Button className="btn-holographic">
                      <Plus className="w-4 h-4 mr-2" />
                      New Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle className="font-orbitron">Add Wellness Entry</DialogTitle>
                      <DialogDescription>
                        Record your daily wellness observations
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Date</label>
                        <Input
                          type="date"
                          value={selectedDate.toISOString().split('T')[0]}
                          onChange={(e) => setSelectedDate(new Date(e.target.value))}
                          className="input-holographic"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Well-being Scale: {newEntry.wellBeingScale}/10
                        </label>
                        <Slider
                          value={[newEntry.wellBeingScale]}
                          onValueChange={(value) => setNewEntry({ ...newEntry, wellBeingScale: value[0] })}
                          min={1}
                          max={10}
                          step={1}
                          className="py-4"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low (1)</span>
                          <span>High (10)</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">Notes</label>
                        <Textarea
                          placeholder="How are you feeling today? Any observations..."
                          value={newEntry.notes}
                          onChange={(e) => setNewEntry({ ...newEntry, notes: e.target.value })}
                          className="input-holographic min-h-[100px]"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleAddEntry} className="btn-holographic">
                        Save Entry
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Entries List */}
            <div className="space-y-4">
              {entries.length === 0 ? (
                <Card className="holographic-card">
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h4 className="font-orbitron font-semibold mb-2">No entries yet</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Start tracking your wellness journey by adding your first entry
                    </p>
                    <Button onClick={() => setIsAddEntryOpen(true)} className="btn-holographic">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Entry
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                entries
                  .slice()
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <Card key={entry.id} className="holographic-card">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="font-orbitron text-lg">
                              {formatDate(entry.date)}
                            </CardTitle>
                            <CardDescription>
                              Well-being: {entry.wellBeingScale}/10
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <div 
                              className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                                entry.wellBeingScale >= 7 ? 'bg-green-500/20 text-green-400' :
                                entry.wellBeingScale >= 4 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              )}
                            >
                              {entry.wellBeingScale}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteEntry(entry.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      {entry.notes && (
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{entry.notes}</p>
                        </CardContent>
                      )}
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Stats Cards */}
              <Card className="holographic-card">
                <CardHeader>
                  <CardTitle className="font-orbitron text-sm uppercase tracking-wider">
                    Total Entries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{entries.length}</div>
                  <p className="text-sm text-muted-foreground">Journal entries</p>
                </CardContent>
              </Card>

              <Card className="holographic-card">
                <CardHeader>
                  <CardTitle className="font-orbitron text-sm uppercase tracking-wider">
                    Average Well-being
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {entries.length > 0
                      ? (entries.reduce((sum, e) => sum + e.wellBeingScale, 0) / entries.length).toFixed(1)
                      : '-'}
                  </div>
                  <p className="text-sm text-muted-foreground">Out of 10</p>
                </CardContent>
              </Card>

              <Card className="holographic-card">
                <CardHeader>
                  <CardTitle className="font-orbitron text-sm uppercase tracking-wider">
                    Active Reminders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">
                    {reminders.filter(r => r.isActive).length}
                  </div>
                  <p className="text-sm text-muted-foreground">Set reminders</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="holographic-card">
              <CardHeader>
                <CardTitle className="font-orbitron flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Well-being Trend
                </CardTitle>
                <CardDescription>
                  Your well-being scale over time (last 30 entries)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chartData.length > 0 ? (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <YAxis 
                          domain={[0, 10]} 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                        />
                        <Tooltip 
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="scale"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                          dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                          activeDot={{ r: 6, fill: 'hsl(var(--accent))' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center">
                    <div className="text-center">
                      <TrendingUp className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Add entries to see your wellness trend
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reminders Tab */}
          <TabsContent value="reminders" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-orbitron text-xl font-semibold">Wellness Reminders</h3>
              <Dialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen}>
                <DialogTrigger asChild>
                  <Button className="btn-holographic">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Reminder
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="font-orbitron">Add Reminder</DialogTitle>
                    <DialogDescription>
                      Set a daily wellness routine reminder
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Title</label>
                      <Input
                        value={newReminder.title}
                        onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                        className="input-holographic"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Time</label>
                      <Input
                        type="time"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                        className="input-holographic"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Repeat Days</label>
                      <div className="flex flex-wrap gap-2">
                        {daysOfWeek.map((day, index) => (
                          <button
                            key={day}
                            onClick={() => {
                              const days = newReminder.days.includes(index)
                                ? newReminder.days.filter(d => d !== index)
                                : [...newReminder.days, index];
                              setNewReminder({ ...newReminder, days });
                            }}
                            className={cn(
                              'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                              newReminder.days.includes(index)
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            )}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddReminderOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddReminder} className="btn-holographic">
                      Save Reminder
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Reminders List */}
            <div className="space-y-4">
              {reminders.length === 0 ? (
                <Card className="holographic-card">
                  <CardContent className="py-12 text-center">
                    <Bell className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h4 className="font-orbitron font-semibold mb-2">No reminders set</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Set daily reminders for your wellness routine
                    </p>
                    <Button onClick={() => setIsAddReminderOpen(true)} className="btn-holographic">
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Reminder
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                reminders.map((reminder) => (
                  <Card key={reminder.id} className="holographic-card">
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            'w-12 h-12 rounded-full flex items-center justify-center',
                            reminder.isActive ? 'bg-primary/20' : 'bg-muted'
                          )}>
                            <Clock className={cn(
                              'w-5 h-5',
                              reminder.isActive ? 'text-primary' : 'text-muted-foreground'
                            )} />
                          </div>
                          <div>
                            <h4 className={cn(
                              'font-orbitron font-semibold',
                              !reminder.isActive && 'text-muted-foreground'
                            )}>
                              {reminder.title}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {reminder.time} • {reminder.days.map(d => daysOfWeek[d]).join(', ')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateReminder(reminder.id, { isActive: !reminder.isActive })}
                            className={cn(
                              'w-10 h-6 rounded-full transition-colors relative',
                              reminder.isActive ? 'bg-primary' : 'bg-muted'
                            )}
                          >
                            <span className={cn(
                              'absolute top-1 w-4 h-4 rounded-full bg-white transition-all',
                              reminder.isActive ? 'left-5' : 'left-1'
                            )} />
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
