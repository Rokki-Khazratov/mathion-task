import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Task, TaskStatus, TaskFilter } from '../lib/types';
import { useTasks } from '../hooks';

type TaskListNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskList'>;

// Filter options in German
const filters: { key: TaskFilter; label: string }[] = [
  { key: 'all', label: 'Alle' },
  { key: 'open', label: 'Offen' },
  { key: 'in_progress', label: 'In Arbeit' },
  { key: 'done', label: 'Erledigt' },
];

// Status colors
const statusConfig: Record<TaskStatus, { color: string; bg: string; label: string }> = {
  open: { color: '#007AFF', bg: '#E5F1FF', label: 'Offen' }, // Primary
  in_progress: { color: '#FF3B30', bg: '#FFEBEA', label: 'In Arbeit' }, // Red
  done: { color: '#34C759', bg: '#E8F8ED', label: 'Erledigt' }, // Success
};

/**
 * Minimalist task list with Notion/OpenAI style
 */
export function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigationProp>();
  const { tasks, loading, error, filter, setFilter, fetchTasks } = useTasks();
  const [refreshing, setRefreshing] = useState(false);

  // Mock data for UI testing
  const mockTasks: Task[] = [
    {
      id: '1',
      user_id: '1',
      title: 'Projektplanung abschließen',
      description: 'Alle Meilensteine für Q1 definieren',
      status: 'in_progress',
      deadline: '2025-12-15',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      user_id: '1',
      title: 'Design Review durchführen',
      description: 'Feedback vom Team sammeln',
      status: 'open',
      deadline: '2025-12-20',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      user_id: '1',
      title: 'Dokumentation aktualisieren',
      description: null,
      status: 'done',
      deadline: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  // Use mock data for now
  const displayTasks = mockTasks.filter(task => 
    filter === 'all' || task.status === filter
  );

  // Pull to refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  // Navigate to task detail
  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', { taskId: task.id });
  };

  // Format deadline
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    const date = new Date(deadline);
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Render task card
  const renderTask = ({ item }: { item: Task }) => {
    const config = statusConfig[item.status];
    
    return (
      <TouchableOpacity 
        onPress={() => handleTaskPress(item)}
        activeOpacity={0.7}
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 12,
          padding: 16,
          marginBottom: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.04,
          shadowRadius: 4,
        }}
      >
        {/* Header: Title + Status */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 }}>
          {/* Checkbox indicator */}
          <View style={{
            width: 20,
            height: 20,
            borderRadius: 6,
            borderWidth: 2,
            borderColor: item.status === 'done' ? config.color : '#D1D1D6',
            backgroundColor: item.status === 'done' ? config.color : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
            marginTop: 2,
          }}>
            {item.status === 'done' && (
              <Ionicons name="checkmark" size={14} color="#FFFFFF" />
            )}
          </View>
          
          {/* Title */}
          <Text style={{ 
            flex: 1, 
            fontSize: 16, 
            fontWeight: '500', 
            color: item.status === 'done' ? '#86868B' : '#1D1D1F',
            textDecorationLine: item.status === 'done' ? 'line-through' : 'none',
          }}>
            {item.title}
          </Text>
        </View>
        
        {/* Description */}
        {item.description && (
          <Text 
            numberOfLines={2} 
            style={{ 
              fontSize: 14, 
              color: '#86868B', 
              marginLeft: 32,
              marginBottom: 8,
              lineHeight: 20,
            }}
          >
            {item.description}
          </Text>
        )}
        
        {/* Footer: Status Badge + Deadline */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 32 }}>
          {/* Status Badge */}
          <View style={{
            backgroundColor: config.bg,
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: config.color }}>
              {config.label}
            </Text>
          </View>
          
          {/* Deadline */}
          {item.deadline && (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
              <Ionicons name="calendar-outline" size={14} color="#86868B" />
              <Text style={{ fontSize: 12, color: '#86868B', marginLeft: 4 }}>
                {formatDeadline(item.deadline)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render empty state
  const renderEmptyState = () => (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      paddingVertical: 60,
      paddingHorizontal: 40,
    }}>
      <View style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#F2F2F7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Ionicons name="checkbox-outline" size={32} color="#86868B" />
      </View>
      <Text style={{ 
        fontSize: 18, 
        fontWeight: '600', 
        color: '#1D1D1F', 
        marginBottom: 8,
        textAlign: 'center',
      }}>
        Keine Aufgaben
      </Text>
      <Text style={{ 
        fontSize: 14, 
        color: '#86868B', 
        textAlign: 'center',
        lineHeight: 20,
      }}>
        Erstelle deine erste Aufgabe, um loszulegen
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
      {/* Header */}
      <View style={{ 
        paddingHorizontal: 20, 
        paddingTop: 20, 
        paddingBottom: 16,
      }}>
        <Text style={{ 
          fontSize: 28, 
          fontWeight: '700', 
          color: '#1D1D1F',
        }}>
          Meine Aufgaben
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={{ 
        paddingHorizontal: 20, 
        marginBottom: 16,
      }}>
        <View style={{ 
          flexDirection: 'row', 
          backgroundColor: '#E5E5EA', 
          borderRadius: 10, 
          padding: 3,
        }}>
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => setFilter(f.key)}
              style={{
                flex: 1,
                backgroundColor: filter === f.key ? '#FFFFFF' : 'transparent',
                borderRadius: 8,
                paddingVertical: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ 
                fontSize: 13, 
                fontWeight: filter === f.key ? '600' : '400', 
                color: filter === f.key ? '#1D1D1F' : '#86868B',
              }}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Task Count */}
      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <Text style={{ fontSize: 13, color: '#86868B' }}>
          {displayTasks.length} {displayTasks.length === 1 ? 'Aufgabe' : 'Aufgaben'}
        </Text>
      </View>

      {/* Task List */}
      <FlatList
        data={displayTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={{ 
          paddingHorizontal: 20, 
          paddingBottom: 100,
          flexGrow: 1,
        }}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default TaskListScreen;
