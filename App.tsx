
import React, { useState, useEffect } from 'react';
import { Student, ViewState, User, Post, TrainingLog, Notice, ContactMessage } from './types';
import StudentCard from './components/StudentCard';
import StudentDetail from './components/StudentDetail';
import Login from './components/Login';
import SocialFeed from './components/SocialFeed';
import ModerationPanel from './components/ModerationPanel';
import AttendanceView from './components/AttendanceView';
import InformationView from './components/InformationView';
import AboutView from './components/AboutView';
import Logo from './components/Logo';

const MOCK_NOTICES: Notice[] = [
  {
    id: 'n1',
    title: 'Alteração de Horário - Feriado',
    content: 'Atenção atletas! Devido ao feriado municipal, o treino de quinta-feira será antecipado para as 18:30 no Estádio Municipal.',
    timestamp: new Date().toISOString(),
    priority: 'high',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'
  }
];

const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'João Silva',
    age: 28,
    photoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    startYear: 2018,
    location: 'Alcanena',
    attendance: ['2023-11-01', '2023-11-03', '2023-11-05', '2025-02-10', '2025-02-12'],
    evolution: [
      { id: 'l1', date: '2023-10-01', exercise: 'Corrida 5km', result: '22:30' },
    ]
  },
  {
    id: '2',
    name: 'Maria Clara',
    age: 32,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
    startYear: 2021,
    location: 'Minde',
    attendance: ['2023-10-05', '2023-11-05', '2025-02-11'],
    evolution: [
      { id: 'l2', date: '2023-10-05', exercise: 'Caminhada 10km', result: '1h15m' },
    ]
  },
  {
    id: '3',
    name: 'Bernardo Costa',
    age: 24,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    startYear: 2022,
    location: 'Alcanena',
    attendance: ['2025-02-10'],
    evolution: []
  }
];

const MOCK_POSTS: Post[] = [
  {
    id: 'p1',
    userId: '2',
    userName: 'Maria Clara',
    userPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    content: 'Hoje o treino de pernas foi intenso! Consegui bater o meu recorde pessoal nos 5km. 💪🔥',
    likes: ['1'],
    comments: [],
    status: 'approved',
    timestamp: new Date().toISOString()
  }
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [notices, setNotices] = useState<Notice[]>(MOCK_NOTICES);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [view, setView] = useState<ViewState>(ViewState.INFO);
  const [activeLocation, setActiveLocation] = useState<'Alcanena' | 'Minde'>('Alcanena');
  const [showAddStudentForm, setShowAddStudentForm] = useState(false);
  const [newStudentData, setNewStudentData] = useState({ name: '', age: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('protrain_user');
    if (savedUser) handleLogin(JSON.parse(savedUser));
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('protrain_user', JSON.stringify(loggedUser));
    setView(ViewState.INFO);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('protrain_user');
  };

  const handleUpdateStudentPhoto = (studentId: string) => {
    const newUrl = prompt("Insira o URL da nova foto para este perfil:");
    if (!newUrl) return;

    const updatedStudents = students.map(s => s.id === studentId ? { ...s, photoUrl: newUrl } : s);
    setStudents(updatedStudents);
    
    if (user && user.id === studentId) {
      const updatedUser = { ...user, photoUrl: newUrl };
      setUser(updatedUser);
      localStorage.setItem('protrain_user', JSON.stringify(updatedUser));
    }

    if (selectedStudent && selectedStudent.id === studentId) {
      setSelectedStudent({ ...selectedStudent, photoUrl: newUrl });
    }
  };

  const handleSendMessage = (name: string, message: string) => {
    const newMessage: ContactMessage = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      message,
      timestamp: new Date().toISOString()
    };
    setContactMessages([newMessage, ...contactMessages]);
  };

  const handleAddNotice = (notice: Omit<Notice, 'id' | 'timestamp'>) => {
    const newNotice: Notice = {
      ...notice,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      priority: 'normal'
    };
    setNotices([newNotice, ...notices]);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentData.name) return;
    const newStudent: Student = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStudentData.name,
      age: parseInt(newStudentData.age) || 20,
      photoUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100', 
      startYear: new Date().getFullYear(),
      location: activeLocation,
      attendance: [],
      evolution: []
    };
    setStudents([...students, newStudent]);
    setNewStudentData({ name: '', age: '' });
    setShowAddStudentForm(false);
  };

  const handleCreatePost = (content: string) => {
    if (!user) return;
    const newPost: Post = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      userPhoto: user.photoUrl,
      content,
      likes: [],
      comments: [],
      status: 'approved',
      timestamp: new Date().toISOString()
    };
    setPosts([newPost, ...posts]);
  };

  const handleAddTrainingLog = (studentId: string, log: Omit<TrainingLog, 'id'>) => {
    const newLog: TrainingLog = { ...log, id: Math.random().toString(36).substr(2, 9) };
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return { ...s, evolution: [...s.evolution, newLog] };
      }
      return s;
    });
    setStudents(updatedStudents);
    const updatedSelected = updatedStudents.find(s => s.id === studentId);
    if (updatedSelected) setSelectedStudent(updatedSelected);
  };

  const handleRemoveTrainingLog = (studentId: string, logId: string) => {
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return { ...s, evolution: s.evolution.filter(l => l.id !== logId) };
      }
      return s;
    });
    setStudents(updatedStudents);
    const updatedSelected = updatedStudents.find(s => s.id === studentId);
    if (updatedSelected) setSelectedStudent(updatedSelected);
  };

  const handleUpdateTrainingLog = (studentId: string, updatedLog: TrainingLog) => {
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        return { ...s, evolution: s.evolution.map(l => l.id === updatedLog.id ? updatedLog : l) };
      }
      return s;
    });
    setStudents(updatedStudents);
    const updatedSelected = updatedStudents.find(s => s.id === studentId);
    if (updatedSelected) setSelectedStudent(updatedSelected);
  };

  const toggleAttendance = (studentId: string, date: string) => {
    const updatedStudents = students.map(s => {
      if (s.id === studentId) {
        const hasDate = s.attendance.includes(date);
        return {
          ...s,
          attendance: hasDate ? s.attendance.filter(d => d !== date) : [...s.attendance, date]
        };
      }
      return s;
    });
    setStudents(updatedStudents);
  };

  const handleLike = (postId: string) => {
    if (!user) return;
    setPosts(posts.map(p => p.id === postId ? {
      ...p,
      likes: p.likes.includes(user.id) ? p.likes.filter(id => id !== user.id) : [...p.likes, user.id]
    } : p));
  };

  const handleComment = (postId: string, text: string) => {
    if (!user) return;
    setPosts(posts.map(p => p.id === postId ? {
      ...p,
      comments: [...p.comments, {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        text,
        timestamp: new Date().toISOString()
      }]
    } : p));
  };

  const handleApprovePost = (postId: string) => {
    setPosts(posts.map(p => p.id === postId ? { ...p, status: 'approved' } : p));
  };

  const handleRejectPost = (postId: string) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const handleDeleteMessage = (msgId: string) => {
    setContactMessages(contactMessages.filter(m => m.id !== msgId));
  };

  if (!user) return <Login onLogin={handleLogin} />;

  const isStudent = user.role === 'student';
  const isAdmin = user.role === 'trainer';
  const pendingCount = posts.filter(p => p.status === 'pending').length + contactMessages.length;
  const currentStudent = students.find(s => s.id === user.id);

  const filteredStudents = students
    .filter(s => s.location === activeLocation)
    .sort((a, b) => a.name.localeCompare(b.name));

  const navItems = [
    { id: ViewState.INFO, label: 'Novidades', icon: 'fa-bullhorn' },
    { id: ViewState.FEED, label: 'Mural', icon: 'fa-shapes' },
    { id: ViewState.ATTENDANCE, label: 'Presenças', icon: 'fa-calendar-check' },
    { 
        id: isStudent ? ViewState.DETAIL : ViewState.LIST, 
        label: isStudent ? 'Meu Perfil' : 'Equipa', 
        icon: isStudent ? 'fa-user-ninja' : 'fa-users',
        action: () => {
            if (isStudent) {
              const myData = students.find(s => s.id === user.id);
              if (myData) { setSelectedStudent(myData); setView(ViewState.DETAIL); }
            } else {
              setView(ViewState.LIST);
            }
        }
    },
    { id: ViewState.ABOUT, label: 'Sobre', icon: 'fa-circle-info' }
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-[#050805] text-white">
      {/* HEADER ADAPTATIVO (Site/App) */}
      <header className="w-full max-w-7xl px-6 py-4 flex justify-between items-center border-b border-white/5 sticky top-0 bg-[#050805]/95 backdrop-blur-xl z-[60]">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView(ViewState.INFO)}>
          <Logo size="sm" />
          <div className="hidden sm:flex flex-col">
            <h1 className="text-sm font-black italic tracking-tighter leading-none text-white/60">CMMC</h1>
            <span className="text-[#bef264] text-lg font-black uppercase tracking-tight leading-none">ALCANENA</span>
          </div>
        </div>

        {/* Desktop Navigation Menu */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/5 rounded-full p-1 border border-white/5">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={item.action || (() => setView(item.id))}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${view === item.id ? 'bg-[#bef264] text-black shadow-lg shadow-[#bef264]/20' : 'text-neutral-500 hover:text-white hover:bg-white/5'}`}
            >
              <i className={`fas ${item.icon}`}></i>
              {item.label}
            </button>
          ))}
          {isAdmin && (
            <button 
              onClick={() => setView(ViewState.MODERATION)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 relative ${view === ViewState.MODERATION ? 'bg-[#bef264] text-black' : 'text-neutral-500 hover:text-white'}`}
            >
              <i className="fas fa-shield-halved"></i>
              Mod
              {pendingCount > 0 && <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>}
            </button>
          )}
        </nav>
        
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={() => handleUpdateStudentPhoto(user.id)}>
            <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-[#bef264] to-[#eb5d24] group-hover:scale-110 transition-transform">
              <img src={user.photoUrl} className="w-full h-full rounded-full border-2 border-[#050805] object-cover" alt="" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#bef264] rounded-full flex items-center justify-center border-2 border-[#050805] opacity-0 group-hover:opacity-100 transition-opacity">
              <i className="fas fa-camera text-[8px] text-black"></i>
            </div>
          </div>
          <button onClick={handleLogout} className="bg-neutral-900 p-2.5 rounded-xl hover:bg-red-500/20 text-neutral-500 hover:text-red-500 transition-all">
            <i className="fas fa-power-off text-sm"></i>
          </button>
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL (Largura Expandida para Site) */}
      <main className="w-full max-w-5xl px-6 py-8 flex-1 mb-20 lg:mb-0">
        {view === ViewState.INFO && (
          <InformationView user={user} notices={notices} onAddNotice={handleAddNotice} />
        )}

        {view === ViewState.FEED && (
          <SocialFeed user={user} posts={posts} onCreatePost={handleCreatePost} onLike={handleLike} onComment={handleComment} />
        )}

        {view === ViewState.MODERATION && isAdmin && (
          <ModerationPanel 
            posts={posts} 
            contactMessages={contactMessages}
            onApprove={handleApprovePost} 
            onReject={handleRejectPost}
            onDeleteMessage={handleDeleteMessage}
          />
        )}

        {view === ViewState.ATTENDANCE && (
          <AttendanceView 
            currentStudent={currentStudent}
            allStudents={students}
            canEdit={isAdmin} 
            onToggleAttendance={(studentId, date) => toggleAttendance(studentId, date)} 
          />
        )}

        {view === ViewState.ABOUT && (
          <AboutView onSendMessage={handleSendMessage} />
        )}

        {view === ViewState.LIST && isAdmin && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <header className="flex justify-between items-end">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Equipa</h2>
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em]">Gestão de Atletas</p>
              </div>
              <button 
                onClick={() => setShowAddStudentForm(!showAddStudentForm)}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${showAddStudentForm ? 'bg-red-500/20 text-red-500 border border-red-500/20' : 'bg-[#bef264] text-black shadow-lg glow-lime'}`}
              >
                <i className={`fas ${showAddStudentForm ? 'fa-times' : 'fa-user-plus'}`}></i>
              </button>
            </header>

            <div className="flex gap-2 p-1 bg-white/5 rounded-[2rem] border border-white/5 max-w-sm">
              <button 
                onClick={() => setActiveLocation('Alcanena')}
                className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeLocation === 'Alcanena' ? 'bg-[#bef264] text-black shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Alcanena
              </button>
              <button 
                onClick={() => setActiveLocation('Minde')}
                className={`flex-1 py-3 rounded-[1.8rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeLocation === 'Minde' ? 'bg-[#bef264] text-black shadow-md' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                Minde
              </button>
            </div>

            {showAddStudentForm && (
              <form onSubmit={handleAddStudent} className="glass p-6 rounded-[2.5rem] space-y-4 border-[#bef264]/30 animate-in zoom-in-95 max-w-xl">
                <p className="text-[10px] font-black uppercase text-[#bef264] tracking-widest text-center">Novo Atleta para {activeLocation}</p>
                <input 
                  type="text" 
                  placeholder="Nome do Atleta" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-black uppercase italic text-sm placeholder:text-neutral-600"
                  value={newStudentData.name}
                  onChange={e => setNewStudentData({...newStudentData, name: e.target.value})}
                  required
                />
                <div className="grid grid-cols-1 gap-3">
                  <input 
                    type="number" 
                    placeholder="Idade" 
                    className="bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold"
                    value={newStudentData.age}
                    onChange={e => setNewStudentData({...newStudentData, age: e.target.value})}
                  />
                </div>
                <button type="submit" className="w-full bg-[#bef264] text-black py-4 rounded-2xl font-black uppercase italic text-xs glow-lime">
                  Registar em {activeLocation}
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStudents.length === 0 ? (
                <div className="col-span-full glass p-12 rounded-[2.5rem] text-center border-dashed border-white/10">
                  <p className="text-neutral-500 font-bold uppercase text-[10px] tracking-widest italic">Nenhum atleta em {activeLocation}</p>
                </div>
              ) : (
                filteredStudents.map(s => <StudentCard key={s.id} student={s} onClick={() => { setSelectedStudent(s); setView(ViewState.DETAIL); }} />)
              )}
            </div>
          </div>
        )}

        {view === ViewState.DETAIL && selectedStudent && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <button onClick={() => setView(isAdmin ? ViewState.LIST : ViewState.FEED)} className="text-[#bef264] font-black uppercase text-[10px] tracking-widest flex items-center gap-2 mb-4 bg-white/5 py-2 px-4 rounded-full w-fit hover:bg-[#bef264]/10 transition-colors">
              <i className="fas fa-arrow-left"></i> Voltar
            </button>
            <StudentDetail 
              student={selectedStudent} 
              isAdmin={isAdmin}
              canEdit={isAdmin || user.id === selectedStudent.id} 
              onAddLog={(log) => handleAddTrainingLog(selectedStudent.id, log)}
              onRemoveLog={(logId) => handleRemoveTrainingLog(selectedStudent.id, logId)}
              onUpdateLog={(log) => handleUpdateTrainingLog(selectedStudent.id, log)}
              onToggleAttendance={(date) => toggleAttendance(selectedStudent.id, date)}
              onUpdatePhoto={() => handleUpdateStudentPhoto(selectedStudent.id)}
            />
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION (Apenas visível em telemóvel) */}
      <nav className="lg:hidden fixed bottom-6 w-[94%] max-w-md left-1/2 -translate-x-1/2 glass rounded-[2.5rem] p-1.5 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-lime/20 z-50">
        {navItems.map(item => (
          <button 
            key={item.id}
            onClick={item.action || (() => setView(item.id))}
            className={`flex-1 py-4 rounded-[2rem] flex flex-col items-center gap-1 transition-all ${view === item.id ? 'bg-[#bef264] text-black scale-105 glow-lime' : 'text-neutral-600'}`}
          >
            <i className={`fas ${item.icon} text-lg`}></i>
            <span className="text-[7px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
        {isAdmin && (
          <button 
            onClick={() => setView(ViewState.MODERATION)}
            className={`flex-1 py-4 rounded-[2rem] flex flex-col items-center gap-1 relative ${view === ViewState.MODERATION ? 'bg-[#bef264] text-black' : 'text-neutral-600'}`}
          >
            <i className="fas fa-shield-halved text-lg"></i>
            <span className="text-[7px] font-black uppercase tracking-tighter">Mod</span>
            {pendingCount > 0 && (
              <span className="absolute top-2 right-4 w-3.5 h-3.5 bg-red-600 rounded-full text-[7px] flex items-center justify-center text-white border border-black font-black">
                {pendingCount}
              </span>
            )}
          </button>
        )}
      </nav>
    </div>
  );
};

export default App;
