import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Calendar, Clock } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface CustomDateTimePickerProps {
  startDate: Date;
  endDate: Date;
  onStartDateChange: (date: Date) => void;
  onEndDateChange: (date: Date) => void;
  mode?: 'hourly' | 'monthly';
}

export const CustomDateTimePicker: React.FC<CustomDateTimePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  mode = 'hourly',
}) => {
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || startDate;
    setShowStartDate(Platform.OS === 'ios');
    
    // Create a new date with the selected date but keep the original time
    const newDate = new Date(currentDate);
    newDate.setHours(startDate.getHours(), startDate.getMinutes());
    
    onStartDateChange(newDate);
  };

  const handleStartTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || startDate;
    setShowStartTime(Platform.OS === 'ios');
    
    // Create a new date with the original date but update the time
    const newDate = new Date(startDate);
    newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
    
    onStartDateChange(newDate);
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || endDate;
    setShowEndDate(Platform.OS === 'ios');
    
    // Create a new date with the selected date but keep the original time
    const newDate = new Date(currentDate);
    newDate.setHours(endDate.getHours(), endDate.getMinutes());
    
    onEndDateChange(newDate);
  };

  const handleEndTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || endDate;
    setShowEndTime(Platform.OS === 'ios');
    
    // Create a new date with the original date but update the time
    const newDate = new Date(endDate);
    newDate.setHours(currentTime.getHours(), currentTime.getMinutes());
    
    onEndDateChange(newDate);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Start</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowStartDate(true)}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.dateText}>{formatDate(startDate)}</Text>
          </TouchableOpacity>
          
          {mode === 'hourly' && (
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowStartTime(true)}
            >
              <Clock size={16} color={colors.primary} />
              <Text style={styles.timeText}>{formatTime(startDate)}</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.column}>
          <Text style={styles.label}>End</Text>
          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowEndDate(true)}
          >
            <Calendar size={16} color={colors.primary} />
            <Text style={styles.dateText}>{formatDate(endDate)}</Text>
          </TouchableOpacity>
          
          {mode === 'hourly' && (
            <TouchableOpacity 
              style={styles.timeButton}
              onPress={() => setShowEndTime(true)}
            >
              <Clock size={16} color={colors.primary} />
              <Text style={styles.timeText}>{formatTime(endDate)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      
      {showStartDate && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showStartTime && (
        <DateTimePicker
          value={startDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleStartTimeChange}
        />
      )}
      
      {showEndDate && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndDateChange}
          minimumDate={startDate}
        />
      )}
      
      {showEndTime && (
        <DateTimePicker
          value={endDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleEndTimeChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
    marginHorizontal: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: colors.gray[300],
    borderRadius: 8,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
    marginLeft: 8,
  },
});