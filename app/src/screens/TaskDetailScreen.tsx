
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList, TaskStatus, CreateTaskInput, UpdateTaskInput } from '../lib/types';
import { useTasks } from '../hooks';

type TaskDetailNavigationProp = NativeStackNavigationProp<RootStackParamList, 'TaskDetail'>;
type TaskDetailRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

// Status options in German
const statusOptions: { key: TaskStatus; label: string; color: string; bg: string }[] = [
  { key: 'open', label: 'Offen', color: '#007AFF', bg: '#E5F1FF' }, // Primary
  { key: 'in_progress', label: 'In Arbeit', color: '#FF3B30', bg: '#FFEBEA' }, // Red
  { key: 'done', label: 'Erledigt', color: '#34C759', bg: '#E8F8ED' }, // Success
];


export function TaskDetailScreen() {
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const route = useRoute<TaskDetailRouteProp>();
  const { taskId } = route.params || {};
  
  const { getTask, createTask, updateTask, deleteTask, fetchTasks, loading } = useTasks();
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('open');
  const [deadline, setDeadline] = useState('');
  const [initialLoading, setInitialLoading] = useState(!!taskId);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  const isEditMode = !!taskId;
  
  // Debug logging
  useEffect(() => {
    console.log('TaskDetailScreen - taskId:', taskId, 'isEditMode:', isEditMode);
  }, [taskId, isEditMode]);

  // Generate date options
  const currentYear = new Date().getFullYear(); // Current year
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);
  const months = [
    { value: 1, label: 'Januar' },
    { value: 2, label: 'Februar' },
    { value: 3, label: 'März' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mai' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Dezember' },
  ];

  // Get days in month
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  // Default to 31 days if month/year not selected
  const days = selectedMonth && selectedYear 
    ? Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1)
    : Array.from({ length: 31 }, (_, i) => i + 1);

  // Parse deadline on load
  useEffect(() => {
    if (deadline) {
      const date = new Date(deadline);
      if (!isNaN(date.getTime())) {
        setSelectedDay(date.getDate());
        setSelectedMonth(date.getMonth() + 1);
        setSelectedYear(date.getFullYear());
      }
    }
  }, [deadline]);

  // Update deadline when date parts change
  useEffect(() => {
    if (selectedDay && selectedMonth && selectedYear) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      setDeadline(dateStr);
    }
  }, [selectedDay, selectedMonth, selectedYear]);

  // Refs for scrolling to selected values
  const dayListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);

  // Open date picker
  const openDatePicker = () => {
    if (!deadline) {
      const today = new Date();
      setSelectedDay(today.getDate());
      setSelectedMonth(today.getMonth() + 1);
      setSelectedYear(today.getFullYear()); // Default to current year
    }
    setShowDatePicker(true);
    
    // Scroll to selected values after modal opens
    setTimeout(() => {
      const dayToScroll = selectedDay || new Date().getDate();
      const monthToScroll = selectedMonth || new Date().getMonth() + 1;
      const yearToScroll = selectedYear || new Date().getFullYear();
      
      if (dayListRef.current) {
        const dayIndex = days.indexOf(dayToScroll);
        if (dayIndex >= 0) {
          dayListRef.current.scrollToIndex({ index: dayIndex, animated: false });
        }
      }
      if (monthListRef.current) {
        const monthIndex = months.findIndex(m => m.value === monthToScroll);
        if (monthIndex >= 0) {
          monthListRef.current.scrollToIndex({ index: monthIndex, animated: false });
        }
      }
      if (yearListRef.current) {
        const yearIndex = years.indexOf(yearToScroll);
        if (yearIndex >= 0) {
          yearListRef.current.scrollToIndex({ index: yearIndex, animated: false });
        }
      }
    }, 100);
  };

  // Confirm date selection
  const confirmDate = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const dateStr = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
      setDeadline(dateStr);
    }
    setShowDatePicker(false);
  };

  // Clear date
  const clearDate = () => {
    setDeadline('');
    setSelectedDay(null);
    setSelectedMonth(null);
    setSelectedYear(null);
    setShowDatePicker(false);
  };

  // Load task data if editing
  useEffect(() => {
    if (taskId) {
      loadTask();
    }
  }, [taskId]);

  const loadTask = async () => {
    if (!taskId) return;
    
    setInitialLoading(true);
    const task = await getTask(taskId);
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setStatus(task.status);
      setDeadline(task.deadline || '');
    }
    setInitialLoading(false);
  };

  // Validate form
  const validate = (): boolean => {
    if (!title.trim()) {
      setValidationError('Titel ist erforderlich');
      return false;
    }
    setValidationError(null);
    return true;
  };

  // Handle save
  const handleSave = async () => {
    if (!validate()) return;
    
    const taskData: CreateTaskInput | UpdateTaskInput = {
      title: title.trim(),
      description: description.trim() || null,
      status,
      deadline: deadline || null,
    };
    
    try {
      if (isEditMode && taskId) {
        await updateTask(taskId, taskData);
      } else {
        await createTask(taskData as CreateTaskInput);
      }
      // Fetch updated tasks before navigating back
      await fetchTasks();
      navigation.goBack();
    } catch (err) {
      Alert.alert('Fehler', 'Aufgabe konnte nicht gespeichert werden');
    }
  };

  // Handle delete
  const handleDelete = () => {
    console.log('handleDelete called, taskId:', taskId);
    if (!taskId) {
      console.log('No taskId, returning');
      return;
    }
    
    Alert.alert(
      'Aufgabe löschen',
      'Bist du sicher, dass du diese Aufgabe löschen möchtest?',
      [
        { text: 'Abbrechen', style: 'cancel' },
        {
          text: 'Löschen',
          style: 'destructive',
          onPress: async () => {
            console.log('Delete confirmed, calling deleteTask');
            const success = await deleteTask(taskId);
            console.log('Delete result:', success);
            if (success) {
              // Fetch updated tasks before navigating back
              await fetchTasks();
              navigation.goBack();
            } else {
              Alert.alert('Fehler', 'Aufgabe konnte nicht gelöscht werden');
            }
          },
        },
      ]
    );
  };

  // Handle back
  const handleBack = () => {
    navigation.goBack();
  };

  if (initialLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 16, color: '#86868B' }}>Aufgabe wird geladen...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F5F7' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          paddingHorizontal: 20, 
          paddingTop: 12,
          paddingBottom: 16,
        }}>
          <TouchableOpacity 
            onPress={handleBack}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons name="chevron-back" size={24} color="#007AFF" />
            <Text style={{ fontSize: 17, color: '#007AFF' }}>Zurück</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={handleSave}
            disabled={loading}
            style={{ opacity: loading ? 0.5 : 1 }}
          >
            <Text style={{ fontSize: 17, fontWeight: '600', color: '#007AFF' }}>
              {loading ? 'Speichern...' : 'Speichern'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text style={{ 
            fontSize: 28, 
            fontWeight: '700', 
            color: '#1D1D1F',
            marginBottom: 24,
          }}>
            {isEditMode ? 'Aufgabe bearbeiten' : 'Neue Aufgabe'}
          </Text>

          {/* Form Card */}
          <View style={{ 
            backgroundColor: '#FFFFFF', 
            borderRadius: 16, 
            padding: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 8,
            marginBottom: 20,
          }}>
            {/* Title Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#86868B', marginBottom: 8, textTransform: 'uppercase' }}>
                Titel
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Aufgabentitel eingeben"
                placeholderTextColor="#C7C7CC"
                style={{
                  backgroundColor: '#F2F2F7',
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  color: '#1D1D1F',
                }}
              />
              {validationError && !title && (
                <Text style={{ color: '#FF3B30', fontSize: 13, marginTop: 6 }}>
                  {validationError}
                </Text>
              )}
            </View>

            {/* Description Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#86868B', marginBottom: 8, textTransform: 'uppercase' }}>
                Beschreibung
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Beschreibung hinzufügen (optional)"
                placeholderTextColor="#C7C7CC"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                style={{
                  backgroundColor: '#F2F2F7',
                  borderRadius: 10,
                  padding: 14,
                  fontSize: 16,
                  color: '#1D1D1F',
                  minHeight: 100,
                }}
              />
            </View>

            {/* Status Selector */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#86868B', marginBottom: 8, textTransform: 'uppercase' }}>
                Status
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                backgroundColor: '#F2F2F7', 
                borderRadius: 10, 
                padding: 3,
              }}>
                {statusOptions.map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    onPress={() => setStatus(option.key)}
                    style={{
                      flex: 1,
                      backgroundColor: status === option.key ? '#FFFFFF' : 'transparent',
                      borderRadius: 8,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 14, 
                      fontWeight: status === option.key ? '600' : '400', 
                      color: status === option.key ? option.color : '#86868B',
                    }}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Deadline Picker */}
            <View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#86868B', marginBottom: 8, textTransform: 'uppercase' }}>
                Frist
              </Text>
              <TouchableOpacity
                onPress={openDatePicker}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F2F2F7',
                  borderRadius: 10,
                  padding: 14,
                }}
              >
                <Ionicons name="calendar-outline" size={20} color="#86868B" style={{ marginRight: 10 }} />
                <Text style={{
                  flex: 1,
                  fontSize: 16,
                  color: deadline ? '#1D1D1F' : '#C7C7CC',
                }}>
                  {deadline 
                    ? new Date(deadline).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                    : 'Datum auswählen (optional)'}
                </Text>
                {deadline && (
                  <TouchableOpacity
                    onPress={(e) => {
                      e.stopPropagation();
                      clearDate();
                    }}
                    style={{ marginLeft: 8 }}
                  >
                    <Ionicons name="close-circle" size={20} color="#86868B" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Delete Button (Edit Mode Only) */}
          {isEditMode && (
            <TouchableOpacity 
              onPress={handleDelete}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 16,
                padding: 16,
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 8,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#FF3B30' }}>
                Aufgabe löschen
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>

        {/* Date Picker Modal */}
        <Modal
          visible={showDatePicker}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'flex-end',
          }}>
            <View style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingTop: 20,
              paddingBottom: 40,
              maxHeight: '80%', // Increased by ~15% (from 70% to 80%)
            }}>
              {/* Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingBottom: 16,
                borderBottomWidth: 0.5,
                borderBottomColor: '#E5E5EA',
              }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#1D1D1F' }}>
                  Datum auswählen
                </Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close" size={24} color="#1D1D1F" />
                </TouchableOpacity>
              </View>

              {/* Date Pickers - Apple Clock Style (Vertical Wheels) */}
              <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 20 }}>
                <View style={{ 
                  flexDirection: 'row', 
                  height: 200,
                  position: 'relative',
                }}>
                  {/* Selection Indicator (Center Highlight) */}
                  <View style={{
                    position: 'absolute',
                    top: 80,
                    left: 0,
                    right: 0,
                    height: 40,
                    backgroundColor: '#F2F2F7',
                    borderRadius: 8,
                    zIndex: 0,
                  }} />

                  {/* Day Picker - First */}
                  <View style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <FlatList
                      ref={dayListRef}
                      data={days}
                      keyExtractor={(item) => `day-${item}`}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={40}
                      decelerationRate="fast"
                      onMomentumScrollEnd={(event) => {
                        // Center highlight is at top: 80px, height: 40px, so center is at 100px
                        // With paddingVertical: 80px, the first item (index 0) is at offset 80px
                        // When contentOffset.y = 0, item 0 is at position 80px, center is at 100px
                        // So item at center when offset=0 is: (100 - 80) / 40 = 0.5, round to 0
                        // When offset=40, item 1 is at position 80px, center is at 100px, so item 1 is selected
                        // Formula: (contentOffset.y + 80) / 40, but center is at 100px, so: (contentOffset.y + 20) / 40
                        // Actually: center position = 100px, item position = offset + 80, so: (offset + 80 - 100) / 40 = (offset - 20) / 40
                        // But we want: when offset=0, index=0, when offset=40, index=1
                        // So: index = (offset + 80) / 40 - 2 = (offset + 0) / 40
                        // Wait, let's recalculate: center at 100px, padding 80px, so center relative to list start = 100 - 80 = 20px
                        // When offset=0, item 0 at 80px, center at 100px, so item 0 is at center-20px, index = 0
                        // When offset=40, item 1 at 80px, center at 100px, so item 1 is at center-20px, index = 1
                        // Center is at 100px (80px top + 20px center of 40px item)
                        // With paddingVertical 80px, when offset=0, item 0 is at 80px, center at 100px
                        // Adjusting by +8px to account for slight offset (0.3 positions = ~12px, so reduce by 12px from 20)
                        const index = Math.round((event.nativeEvent.contentOffset.y + 8) / 40);
                        const clampedIndex = Math.max(0, Math.min(index, days.length - 1));
                        const day = days[clampedIndex];
                        if (day && (!selectedMonth || !selectedYear || day <= getDaysInMonth(selectedMonth, selectedYear))) {
                          if (selectedDay !== day) {
                            setSelectedDay(day);
                          }
                        }
                      }}
                      onScroll={(event) => {
                        // Update selection during scroll for better UX
                        const index = Math.round((event.nativeEvent.contentOffset.y + 8) / 40);
                        const clampedIndex = Math.max(0, Math.min(index, days.length - 1));
                        const day = days[clampedIndex];
                        if (day && selectedDay !== day && (!selectedMonth || !selectedYear || day <= getDaysInMonth(selectedMonth, selectedYear))) {
                          setSelectedDay(day);
                        }
                      }}
                      getItemLayout={(data, index) => ({
                        length: 40,
                        offset: 40 * index,
                        index,
                      })}
                      renderItem={({ item: day }) => {
                        const isSelected = selectedDay === day;
                        const isValid = !selectedMonth || !selectedYear || day <= getDaysInMonth(selectedMonth, selectedYear);
                        const distance = selectedDay ? Math.abs(selectedDay - day) : 31;
                        const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.15);
                        
                        return (
                          <View style={{
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: isValid ? opacity : 0.2,
                          }}>
                            <Text style={{
                              fontSize: isSelected ? 20 : 16,
                              fontWeight: isSelected ? '600' : '400',
                              color: isSelected ? '#1D1D1F' : '#86868B',
                            }}>
                              {day}
                            </Text>
                          </View>
                        );
                      }}
                      contentContainerStyle={{
                        paddingVertical: 80,
                      }}
                      onScrollToIndexFailed={() => {}}
                    />
                  </View>

                  {/* Month Picker - Second */}
                  <View style={{ flex: 1.5, position: 'relative', zIndex: 1 }}>
                    <FlatList
                      ref={monthListRef}
                      data={months}
                      keyExtractor={(item) => `month-${item.value}`}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={40}
                      decelerationRate="fast"
                      onMomentumScrollEnd={(event) => {
                        // Same calculation as day picker - adjusted for offset
                        const index = Math.round((event.nativeEvent.contentOffset.y + 8) / 40);
                        const clampedIndex = Math.max(0, Math.min(index, months.length - 1));
                        const month = months[clampedIndex];
                        if (month && selectedMonth !== month.value) {
                          setSelectedMonth(month.value);
                          if (selectedDay && selectedYear) {
                            const maxDays = getDaysInMonth(month.value, selectedYear);
                            if (selectedDay > maxDays) {
                              setSelectedDay(null);
                            }
                          }
                        }
                      }}
                      onScroll={(event) => {
                        // Update selection during scroll for better UX
                        const index = Math.round((event.nativeEvent.contentOffset.y + 8) / 40);
                        const clampedIndex = Math.max(0, Math.min(index, months.length - 1));
                        const month = months[clampedIndex];
                        if (month && selectedMonth !== month.value) {
                          setSelectedMonth(month.value);
                        }
                      }}
                      getItemLayout={(data, index) => ({
                        length: 40,
                        offset: 40 * index,
                        index,
                      })}
                      renderItem={({ item: month }) => {
                        const isSelected = selectedMonth === month.value;
                        const distance = selectedMonth ? Math.abs(selectedMonth - month.value) : 12;
                        const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.1);
                        
                        return (
                          <View style={{
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity,
                          }}>
                            <Text style={{
                              fontSize: isSelected ? 20 : 16,
                              fontWeight: isSelected ? '600' : '400',
                              color: isSelected ? '#1D1D1F' : '#86868B',
                            }}>
                              {month.label}
                            </Text>
                          </View>
                        );
                      }}
                      contentContainerStyle={{
                        paddingVertical: 80,
                      }}
                      onScrollToIndexFailed={() => {}}
                    />
                  </View>

                  {/* Year Picker - Last */}
                  <View style={{ flex: 1, position: 'relative', zIndex: 1 }}>
                    <FlatList
                      ref={yearListRef}
                      data={years}
                      keyExtractor={(item) => `year-${item}`}
                      showsVerticalScrollIndicator={false}
                      snapToInterval={40}
                      decelerationRate="fast"
                      onMomentumScrollEnd={(event) => {
                        // Same calculation as day picker - adjusted for offset
                        const index = Math.round((event.nativeEvent.contentOffset.y + 8) / 40);
                        const clampedIndex = Math.max(0, Math.min(index, years.length - 1));
                        const year = years[clampedIndex];
                        if (year && selectedYear !== year) {
                          setSelectedYear(year);
                          if (selectedDay && selectedMonth) {
                            const maxDays = getDaysInMonth(selectedMonth, year);
                            if (selectedDay > maxDays) {
                              setSelectedDay(null);
                            }
                          }
                        }
                      }}
                      onScroll={(event) => {
                        // Update selection during scroll for better UX
                        const index = Math.round((event.nativeEvent.contentOffset.y + 8) / 40);
                        const clampedIndex = Math.max(0, Math.min(index, years.length - 1));
                        const year = years[clampedIndex];
                        if (year && selectedYear !== year) {
                          setSelectedYear(year);
                        }
                      }}
                      getItemLayout={(data, index) => ({
                        length: 40,
                        offset: 40 * index,
                        index,
                      })}
                      renderItem={({ item: year }) => {
                        const isSelected = selectedYear === year;
                        const distance = selectedYear ? Math.abs(selectedYear - year) : 10;
                        const opacity = isSelected ? 1 : Math.max(0.3, 1 - distance * 0.15);
                        
                        return (
                          <View style={{
                            height: 40,
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity,
                          }}>
                            <Text style={{
                              fontSize: isSelected ? 20 : 16,
                              fontWeight: isSelected ? '600' : '400',
                              color: isSelected ? '#1D1D1F' : '#86868B',
                            }}>
                              {year}
                            </Text>
                          </View>
                        );
                      }}
                      contentContainerStyle={{
                        paddingVertical: 80,
                      }}
                      onScrollToIndexFailed={() => {}}
                    />
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View style={{
                flexDirection: 'row',
                paddingHorizontal: 20,
                paddingTop: 16,
                borderTopWidth: 0.5,
                borderTopColor: '#E5E5EA',
              }}>
                <TouchableOpacity
                  onPress={clearDate}
                  style={{
                    flex: 1,
                    padding: 14,
                    alignItems: 'center',
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontSize: 16, color: '#86868B' }}>
                    Löschen
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmDate}
                  style={{
                    flex: 1,
                    padding: 14,
                    backgroundColor: '#007AFF',
                    borderRadius: 12,
                    alignItems: 'center',
                    marginLeft: 8,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFFFFF' }}>
                    Bestätigen
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default TaskDetailScreen;
