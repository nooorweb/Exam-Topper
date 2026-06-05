import React from 'react';
import { Tabs, router } from 'expo-router';
import { useApp } from '../../src/context/AppContext';
import { Home, Award, BookOpen, BookMarked, User, Settings, Sun, Moon, ClipboardList } from 'lucide-react-native';
import { TouchableOpacity, View, Text } from 'react-native';

export default function TabLayout() {
  const { currentTheme, toggleTheme } = useApp();
  const isDark = currentTheme === 'dark';

  const themeColors = {
    bg: isDark ? '#0E1117' : '#ffffff',
    border: isDark ? '#2A2D3A' : '#f3f4f6',
    text: isDark ? '#e1e2eb' : '#1f2937',
    tint: '#7C6FF0', // Primary Purple
    inactive: isDark ? '#c8c4d6' : '#9ca3af',
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        tabBarInactiveTintColor: themeColors.inactive,
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '900',
          marginTop: -2,
        },
        tabBarStyle: {
          backgroundColor: themeColors.bg,
          borderTopColor: themeColors.border,
          height: 62,
          paddingBottom: 8,
          paddingTop: 6,
        },
        headerStyle: {
          backgroundColor: themeColors.bg,
          borderBottomWidth: 1,
          borderBottomColor: themeColors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '900',
          fontSize: 15,
          letterSpacing: 0.5,
          color: themeColors.text,
        },
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
            {/* Theme Toggle */}
            <TouchableOpacity
              onPress={toggleTheme}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? '#1c1c1f' : '#f4f4f5',
                marginRight: 6,
              }}
            >
              {isDark ? (
                <Sun size={15} color="#fbbf24" />
              ) : (
                <Moon size={15} color="#4b5563" />
              )}
            </TouchableOpacity>

            {/* Admin Panel button */}
            <TouchableOpacity
              onPress={() => router.push('/admin')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? '#1c1c1f' : '#f4f4f5',
                marginRight: 6,
              }}
            >
              <User size={15} color={themeColors.text} />
            </TouchableOpacity>

            {/* Settings button */}
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{
                padding: 8,
                borderRadius: 12,
                backgroundColor: isDark ? '#1c1c1f' : '#f4f4f5',
              }}
            >
              <Settings size={15} color={themeColors.text} />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Exam Topper',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => <Home size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quiz"
        options={{
          title: 'Practice Desk',
          tabBarLabel: 'Practice',
          tabBarIcon: ({ color }) => <Award size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="notes"
        options={{
          title: 'Syllabus Notes',
          tabBarLabel: 'Notes',
          tabBarIcon: ({ color }) => <BookOpen size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="vocab"
        options={{
          title: 'Vocab Builder',
          tabBarLabel: 'Vocab',
          tabBarIcon: ({ color }) => <BookMarked size={20} color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Quiz History',
          tabBarLabel: 'History',
          tabBarIcon: ({ color }) => <ClipboardList size={20} color={color} />,
        }}
      />
    </Tabs>
  );
}
