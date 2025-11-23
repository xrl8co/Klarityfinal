
import React, { useState } from 'react';
import { Box, Lock, Mail, ArrowRight, Loader2, AlertCircle, User, ArrowLeft } from 'lucide-react';

interface LoginProps {
  onLogin: (isAdmin: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Simulação de delay de rede
    setTimeout(() => {
      if (!email || !password || (isRegistering && !name)) {
        setError('Por favor, preencha todos os campos obrigatórios.');
        setLoading(false);
        return;
      }

      if (isRegistering) {
        // Lógica de Cadastro Mock
        setSuccessMsg('Conta criada com sucesso! Redirecionando...');
        setTimeout(() => {
           onLogin(false); // Novos usuários não são admins por padrão
        }, 1000);
      } else {
        // Lógica de Login Mock
        // Verifica se é o admin específico
        if (email === 'umpskyff@gmail.com' && password === '123456') {
           onLogin(true); // É Admin
        } else if (email && password.length >= 4) {
           onLogin(false); // Usuário Comum
        } else {
           setError('Credenciais inválidas. Tente novamente.');
           setLoading(false);
        }
      }
    }, 1500);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl z-10 overflow-hidden animate-fade-in transition-all duration-300">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-3">
               <div className="p-2.5 bg-primary rounded-xl shadow-lg shadow-primary/20">
                  <Box className="text-white w-8 h-8" strokeWidth={2.5} />
               </div>
               <h1 className="text-2xl font-bold text-white tracking-tight">Klarity <span className="text-primary">PRO</span></h1>
            </div>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-xl font-bold text-white mb-2">
              {isRegistering ? 'Crie sua conta' : 'Bem-vindo de volta'}
            </h2>
            <p className="text-slate-400 text-sm">
              {isRegistering ? 'Comece a gerenciar seus projetos hoje.' : 'Acesse seu painel de gestão financeira.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-sm animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}
            
            {successMsg && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-400 text-sm animate-fade-in">
                <AlertCircle size={16} />
                {successMsg}
              </div>
            )}

            {isRegistering && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nome Completo</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                    placeholder="Seu Nome"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Email Corporativo</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="ex: umpskyff@gmail.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
               <div className="flex justify-between ml-1">
                 <label className="text-xs font-bold text-slate-400 uppercase">Senha</label>
                 {!isRegistering && <a href="#" className="text-xs font-bold text-primary hover:text-primary-light transition-colors">Esqueceu?</a>}
               </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-700 text-white pl-12 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-light text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin w-5 h-5" />
              ) : (
                <>{isRegistering ? 'Criar Conta' : 'Entrar no Sistema'} <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>
        
        <div className="p-4 bg-slate-900/80 border-t border-white/5 text-center transition-colors">
          <button 
            onClick={toggleMode}
            className="text-xs text-slate-500 hover:text-white transition-colors"
          >
            {isRegistering ? (
               <>Já tem uma conta? <span className="text-primary font-bold hover:underline ml-1">Faça Login</span></>
            ) : (
               <>Ainda não tem conta? <span className="text-primary font-bold hover:underline ml-1">Crie agora</span></>
            )}
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-6 text-center w-full text-slate-600 text-xs">
        &copy; 2024 Klarity MZ. Todos os direitos reservados.
      </div>
    </div>
  );
};

export default Login;
