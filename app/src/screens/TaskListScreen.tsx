import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  SafeAreaView, 
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList, Task, TaskStatus, TaskFilter } from '../lib/types';
import { useTasks } from '../hooks';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
  open: { color: '#007AFF', bg: '#E5F1FF', label: 'Offen' },
  in_progress: { color: '#FF9500', bg: '#FFF3E0', label: 'In Arbeit' }, // Orange
  done: { color: '#34C759', bg: '#E8F8ED', label: 'Erledigt' },
};

/**
 * Minimalist task list with Notion/OpenAI style
 */
export function TaskListScreen() {
  const navigation = useNavigation<TaskListNavigationProp>();
  const { tasks, loading, error, filter, setFilter, fetchTasks, updateTask } = useTasks();
  const [refreshing, setRefreshing] = useState(false);
  const [tabContainerWidth, setTabContainerWidth] = useState(0);
  
  // Animation for filter indicator
  const slideAnim = useRef(new Animated.Value(0)).current;
  const filterIndex = filters.findIndex(f => f.key === filter);

  // Animate filter indicator when filter changes
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: filterIndex,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  }, [filterIndex, slideAnim]);

  // Handle filter change with animation
  const handleFilterChange = (newFilter: TaskFilter) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilter(newFilter);
  };

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
  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const config = statusConfig[item.status];
    
    return (
      <Animated.View
        style={{
          opacity: 1,
          transform: [{ scale: 1 }],
        }}
      >
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
            {/* Checkbox indicator - separate touchable area */}
            <TouchableOpacity
              onPress={(e) => {
                // Toggle task status
                const newStatus: TaskStatus = item.status === 'done' ? 'open' : 'done';
                updateTask(item.id, { status: newStatus });
              }}
              activeOpacity={0.6}
              style={{
                width: 32,
                height: 32,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 6,
                borderWidth: 2,
                borderColor: item.status === 'done' ? config.color : '#D1D1D6',
                backgroundColor: item.status === 'done' ? config.color : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                {item.status === 'done' && (
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            
            {/* Title */}
            <Text style={{ 
              flex: 1, 
              fontSize: 16, 
              fontWeight: '500', 
              color: item.status === 'done' ? '#86868B' : '#1D1D1F',
              textDecorationLine: item.status === 'done' ? 'line-through' : 'none',
              marginTop: 4,
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
            {item.description.length > 28 
              ? `${item.description.substring(0, 28)}...` 
              : item.description}
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
      </Animated.View>
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

  // Render loading state
  if (loading && tasks.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#86868B', fontSize: 14 }}>
          Aufgaben werden geladen...
        </Text>
      </SafeAreaView>
    );
  }

  // Render error state
  if (error && tasks.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
        <View style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          backgroundColor: '#FFEBEA',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Ionicons name="alert-circle-outline" size={32} color="#FF3B30" />
        </View>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#1D1D1F', marginBottom: 8, textAlign: 'center' }}>
          Fehler beim Laden
        </Text>
        <Text style={{ fontSize: 14, color: '#86868B', textAlign: 'center', marginBottom: 24 }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={fetchTasks}
          style={{
            backgroundColor: '#007AFF',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 10,
          }}
        >
          <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Erneut versuchen</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // Calculate tab width for animation
  const tabWidth = 80; // Approximate width

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

      {/* Filter Tabs with Animation */}
      <View style={{ 
        paddingHorizontal: 20, 
        marginBottom: 16,
      }}>
        <View 
          style={{ 
            flexDirection: 'row', 
            backgroundColor: '#E5E5EA', 
            borderRadius: 10, 
            padding: 3,
            position: 'relative',
          }}
          onLayout={(e) => {
            setTabContainerWidth(e.nativeEvent.layout.width);
          }}
        >
          {/* Animated indicator */}
          {tabContainerWidth > 0 && (
            <Animated.View
              style={{
                position: 'absolute',
                top: 3,
                left: 3,
                right: 3,
                bottom: 3,
                width: (tabContainerWidth - 6) / filters.length,
                backgroundColor: '#FFFFFF',
                borderRadius: 8,
                transform: [{
                  translateX: slideAnim.interpolate({
                    inputRange: filters.map((_, i) => i),
                    outputRange: filters.map((_, i) => {
                      const tabW = (tabContainerWidth - 6) / filters.length;
                      return i * tabW;
                    }),
                  }),
                }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            />
          )}
          
          {filters.map((f) => (
            <TouchableOpacity
              key={f.key}
              onPress={() => handleFilterChange(f.key)}
              style={{
                flex: 1,
                borderRadius: 8,
                paddingVertical: 8,
                alignItems: 'center',
                zIndex: 1,
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
          {tasks.length} {tasks.length === 1 ? 'Aufgabe' : 'Aufgaben'}
        </Text>
      </View>

      {/* Task List */}
      <FlatList
        data={tasks}
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
