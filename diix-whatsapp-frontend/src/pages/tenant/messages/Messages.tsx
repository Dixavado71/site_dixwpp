import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  CheckCheck, 
  Clock, 
  AlertCircle,
  Bot,
  User,
  Phone,
  ShoppingCart,
  Send,
  Paperclip,
  Smile,
  X,
  Archive,
  Trash2,
  Star,
  Reply,
  Forward,
  Info
} from 'lucide-react';

interface Message {
  id: string;
  contactId: string;
  contactName: string;
  contactPhone: string;
  content: string;
  timestamp: Date;
  status: 'pending' | 'delivered' | 'read' | 'failed';
  direction: 'inbound' | 'outbound';
  isBot: boolean;
  saleId?: string;
  unread: boolean;
}

const Messages = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'bot' | 'human' | 'archived'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - será substituído pela EvolutionAPI no futuro
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: '1',
        contactId: 'c1',
        contactName: 'João Silva',
        contactPhone: '+55 11 99999-1111',
        content: 'Olá, gostaria de saber mais sobre os produtos!',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'read',
        direction: 'inbound',
        isBot: false,
        unread: true
      },
      {
        id: '2',
        contactId: 'c1',
        contactName: 'João Silva',
        contactPhone: '+55 11 99999-1111',
        content: 'Temos várias opções! Qual categoria você busca?',
        timestamp: new Date(Date.now() - 1000 * 60 * 4),
        status: 'read',
        direction: 'outbound',
        isBot: true,
        unread: false
      },
      {
        id: '3',
        contactId: 'c2',
        contactName: 'Maria Santos',
        contactPhone: '+55 11 98888-2222',
        content: 'Quero fazer um pedido',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'delivered',
        direction: 'inbound',
        isBot: false,
        saleId: 's1',
        unread: true
      },
      {
        id: '4',
        contactId: 'c3',
        contactName: 'Pedro Oliveira',
        contactPhone: '+55 11 97777-3333',
        content: 'Obrigado pelo atendimento!',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'read',
        direction: 'inbound',
        isBot: false,
        unread: false
      },
      {
        id: '5',
        contactId: 'c3',
        contactName: 'Pedro Oliveira',
        contactPhone: '+55 11 97777-3333',
        content: 'Disponha! Seu pedido será entregue em até 2 dias.',
        timestamp: new Date(Date.now() - 1000 * 60 * 59),
        status: 'read',
        direction: 'outbound',
        isBot: true,
        saleId: 's2',
        unread: false
      },
      {
        id: '6',
        contactId: 'c4',
        contactName: 'Ana Costa',
        contactPhone: '+55 11 96666-4444',
        content: 'Qual o prazo de entrega?',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        status: 'failed',
        direction: 'inbound',
        isBot: false,
        unread: false
      }
    ];

    setTimeout(() => {
      setMessages(mockMessages);
      setIsLoading(false);
    }, 800);
  }, []);

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         msg.contactPhone.includes(searchQuery) ||
                         msg.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeTab) {
      case 'unread':
        return msg.unread && matchesSearch;
      case 'bot':
        return msg.isBot && matchesSearch;
      case 'human':
        return !msg.isBot && matchesSearch;
      case 'archived':
        return false; // Implementar lógica de arquivamento
      default:
        return matchesSearch;
    }
  });

  const groupedMessages = filteredMessages.reduce((acc, msg) => {
    const key = msg.contactId;
    if (!acc[key]) {
      acc[key] = {
        contactId: msg.contactId,
        contactName: msg.contactName,
        contactPhone: msg.contactPhone,
        lastMessage: msg,
        unreadCount: 0,
        messages: []
      };
    }
    acc[key].messages.push(msg);
    if (msg.unread) acc[key].unreadCount++;
    if (msg.timestamp > acc[key].lastMessage.timestamp) {
      acc[key].lastMessage = msg;
    }
    return acc;
  }, {} as Record<string, any>);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) {
      return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } else if (hours < 24) {
      return `${hours}h atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'read':
        return <CheckCheck className="w-4 h-4 text-[#00ff9d]" />;
      case 'delivered':
        return <Check className="w-4 h-4 text-blue-400" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-3 sm:p-4 md:p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 sm:mb-6"
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-1 sm:mb-2">
              Mensagens
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">Gerencie conversas com clientes e automações do bot</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar mensagens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all w-full"
              />
            </div>
            
            <button className="p-2.5 bg-slate-900/50 border border-slate-700 rounded-xl hover:bg-slate-800/50 hover:border-cyan-500/50 transition-all group flex-shrink-0">
              <Filter className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-4 sm:mb-6"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          {[
            { id: 'all', label: 'Todas', icon: MessageSquare },
            { id: 'unread', label: 'Não Lidas', icon: AlertCircle },
            { id: 'bot', label: 'Bot', icon: Bot },
            { id: 'human', label: 'Humanas', icon: User },
            { id: 'archived', label: 'Arquivadas', icon: Archive }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-medium transition-all whitespace-nowrap text-xs sm:text-sm ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 text-cyan-400'
                  : 'bg-slate-900/50 border border-slate-700 text-slate-400 hover:bg-slate-800/50 hover:border-slate-600'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {tab.label}
              {tab.id === 'unread' && (
                <span className="px-1.5 sm:px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] sm:text-xs rounded-full flex-shrink-0">
                  {messages.filter(m => m.unread).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Conversations List */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`lg:col-span-1 ${selectedMessage ? 'hidden lg:block' : 'block'}`}
        >
          <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden h-[calc(100vh-280px)] sm:h-[calc(100vh-300px)] lg:h-auto lg:min-h-[600px]">
            <div className="p-3 sm:p-4 border-b border-slate-700/50">
              <h2 className="text-base sm:text-lg font-semibold text-slate-200">Conversas</h2>
              <p className="text-xs sm:text-sm text-slate-400">{Object.keys(groupedMessages).length} conversas ativas</p>
            </div>
            
            <div className="max-h-[calc(100vh-340px)] sm:max-h-[calc(100vh-360px)] lg:max-h-[600px] overflow-y-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                  <p className="text-slate-400">Carregando mensagens...</p>
                </div>
              ) : Object.keys(groupedMessages).length === 0 ? (
                <div className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Nenhuma conversa encontrada</p>
                </div>
              ) : (
                Object.values(groupedMessages).map((group: any, index) => (
                  <motion.div
                    key={group.contactId}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedMessage(group.lastMessage)}
                    className={`p-4 border-b border-slate-700/30 cursor-pointer transition-all hover:bg-slate-800/30 ${
                      selectedMessage?.contactId === group.contactId ? 'bg-slate-800/50 border-l-2 border-l-cyan-500' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        group.lastMessage.isBot 
                          ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                          : 'bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-pink-500/30'
                      }`}>
                        {group.lastMessage.isBot ? (
                          <Bot className="w-5 h-5 text-cyan-400" />
                        ) : (
                          <User className="w-5 h-5 text-pink-400" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-slate-200 truncate">{group.contactName}</h3>
                          <span className="text-xs text-slate-500">{formatTime(group.lastMessage.timestamp)}</span>
                        </div>
                        
                        <p className="text-sm text-slate-400 truncate mb-2">
                          {group.lastMessage.content}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          {getStatusIcon(group.lastMessage.status)}
                          {group.saleId && (
                            <span className="flex items-center gap-1 text-xs text-green-400">
                              <ShoppingCart className="w-3 h-3" />
                              Venda vinculada
                            </span>
                          )}
                          {group.unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">
                              {group.unreadCount} nova(s)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Mobile Back Button */}
            <div className="lg:hidden p-3 border-t border-slate-700/50">
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/50 rounded-xl text-cyan-400 font-medium flex items-center justify-center gap-2 hover:bg-cyan-500/30 transition-all"
              >
                <Reply className="w-4 h-4 rotate-180" />
                Voltar para conversas
              </button>
            </div>
          </div>
        </motion.div>

        {/* Chat Area */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`lg:col-span-2 ${!selectedMessage ? 'hidden lg:block' : 'block'}`}
        >
          {selectedMessage ? (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] lg:h-[700px] flex flex-col">
              {/* Chat Header */}
              <div className="p-3 sm:p-4 border-b border-slate-700/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMessage.isBot 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30' 
                      : 'bg-gradient-to-br from-pink-500/20 to-orange-500/20 border border-pink-500/30'
                  }`}>
                    {selectedMessage.isBot ? (
                      <Bot className="w-5 h-5 text-cyan-400" />
                    ) : (
                      <User className="w-5 h-5 text-pink-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-200">{selectedMessage.contactName}</h3>
                    <p className="text-sm text-slate-400">{selectedMessage.contactPhone}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors" title="Arquivar">
                    <Archive className="w-5 h-5 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors" title="Marcar como favorita">
                    <Star className="w-5 h-5 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors" title="Informações">
                    <Info className="w-5 h-5 text-slate-400" />
                  </button>
                  <button 
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors lg:hidden"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                {groupedMessages[selectedMessage.contactId]?.messages.map((msg: Message, index: number) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[70%] ${msg.direction === 'outbound' ? 'order-1' : 'order-2'}`}>
                      <div className={`p-4 rounded-2xl ${
                        msg.direction === 'outbound'
                          ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30'
                          : 'bg-slate-800/50 border border-slate-700/50'
                      }`}>
                        {msg.isBot && (
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-3 h-3 text-cyan-400" />
                            <span className="text-xs text-cyan-400">Bot Automático</span>
                          </div>
                        )}
                        <p className="text-slate-200">{msg.content}</p>
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <span className="text-xs text-slate-500">{formatTime(msg.timestamp)}</span>
                          {msg.direction === 'outbound' && getStatusIcon(msg.status)}
                        </div>
                      </div>
                      
                      {msg.saleId && (
                        <div className="mt-2 p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                          <div className="flex items-center gap-2 text-green-400 text-sm">
                            <ShoppingCart className="w-4 h-4" />
                            <span>Venda #{msg.saleId}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-3 sm:p-4 border-t border-slate-700/50">
                <div className="flex items-center gap-2 sm:gap-3">
                  <button className="p-2 hover:bg-slate-800/50 rounded-lg transition-colors flex-shrink-0">
                    <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-sm sm:text-base text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                    />
                    <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Smile className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-cyan-400 transition-colors" />
                    </button>
                  </div>
                  
                  <button className="p-2.5 sm:p-3 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl hover:from-cyan-400 hover:to-purple-400 transition-all shadow-lg shadow-cyan-500/25 flex-shrink-0">
                    <Send className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </button>
                </div>
                
                <div className="mt-2 sm:mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2">
                    <Reply className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Responder Rápida</span>
                    <span className="sm:hidden">Responder</span>
                  </button>
                  <button className="flex-1 px-3 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-xs sm:text-sm text-slate-400 hover:text-purple-400 hover:border-purple-500/50 transition-all flex items-center justify-center gap-2">
                    <Forward className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Encaminhar</span>
                    <span className="sm:hidden">Enviar</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] lg:h-[700px] flex items-center justify-center p-4">
              <div className="text-center max-w-xs">
                <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-slate-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-slate-400 mb-2">Selecione uma conversa</h3>
                <p className="text-xs sm:text-sm text-slate-500">Escolha uma mensagem da lista para visualizar e responder</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Messages;
