import React, { useState, useEffect } from 'react';
import { GroupOrder, PageView, DrinkItem, IceLevel, SugarLevel, OrderItem } from './types';
import GroupList from './components/GroupList';
import GroupDetail from './components/GroupDetail';
import CreateGroupModal from './components/CreateGroupModal';
import MenuModal from './components/MenuModal';

const App: React.FC = () => {
  // State for "Database" (persisted in localStorage)
  const [groups, setGroups] = useState<GroupOrder[]>([]);
  
  // UI State
  const [currentView, setCurrentView] = useState<PageView>('HOME');
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedGroups = localStorage.getItem('boba_groups');
    if (savedGroups) {
      try {
        setGroups(JSON.parse(savedGroups));
      } catch (e) {
        console.error("Failed to parse groups", e);
      }
    }
  }, []);

  // Save to LocalStorage whenever groups change
  useEffect(() => {
    localStorage.setItem('boba_groups', JSON.stringify(groups));
  }, [groups]);

  // Routing Logic
  const navigateHome = () => {
    setCurrentView('HOME');
    setActiveGroupId(null);
  };

  const handleSelectGroup = (groupId: string) => {
    setActiveGroupId(groupId);
    setCurrentView('GROUP_DETAIL');
  };

  const handleCreateGroup = (hostName: string, groupName: string) => {
    const newGroup: GroupOrder = {
      id: Date.now().toString(),
      hostName,
      groupName,
      status: 'OPEN',
      createdAt: Date.now(),
      orders: []
    };
    setGroups(prev => [newGroup, ...prev]);
    setIsCreateModalOpen(false);
    handleSelectGroup(newGroup.id);
  };

  const handleAddOrder = (drink: DrinkItem, ice: IceLevel, sugar: SugarLevel, userName: string) => {
    if (!activeGroupId) return;

    const newOrder: OrderItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      drinkId: drink.id,
      drinkName: drink.name,
      userName,
      price: drink.price,
      ice,
      sugar,
      timestamp: Date.now()
    };

    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === activeGroupId 
          ? { ...group, orders: [...group.orders, newOrder] }
          : group
      )
    );
    setIsMenuModalOpen(false);
  };

  const handleDeleteOrder = (orderId: string) => {
     if (!activeGroupId) return;
     if (!window.confirm("Are you sure you want to remove this order?")) return;

     setGroups(prevGroups =>
        prevGroups.map(group =>
            group.id === activeGroupId
            ? { ...group, orders: group.orders.filter(o => o.id !== orderId) }
            : group
        )
     );
  };

  const activeGroup = groups.find(g => g.id === activeGroupId);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 pb-20">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <button onClick={navigateHome} className="flex items-center gap-2 group">
                <div className="w-8 h-8 bg-brand-500 rounded-full flex items-center justify-center text-white font-bold text-lg group-hover:scale-110 transition-transform">B</div>
                <span className="font-bold text-xl tracking-tight text-brand-900">BobaTogether</span>
            </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-8">
        {currentView === 'HOME' && (
          <GroupList 
            groups={groups} 
            onSelectGroup={handleSelectGroup} 
            onCreateGroup={() => setIsCreateModalOpen(true)}
          />
        )}

        {currentView === 'GROUP_DETAIL' && activeGroup && (
          <GroupDetail 
            group={activeGroup} 
            onBack={navigateHome}
            onOpenMenu={() => setIsMenuModalOpen(true)}
            onDeleteOrder={handleDeleteOrder}
          />
        )}
      </main>

      {/* Modals */}
      <CreateGroupModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onSubmit={handleCreateGroup} 
      />

      <MenuModal 
        isOpen={isMenuModalOpen} 
        onClose={() => setIsMenuModalOpen(false)} 
        onSubmit={handleAddOrder} 
      />
    </div>
  );
};

export default App;