import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Badge({
  label,
  variant = 'default', // 'success', 'warning', 'danger', 'info', 'neutral'
  size = 'medium', // 'small', 'medium'
  style,
  textStyle,
}) {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'success':
        return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0' };
      case 'warning':
        return { bg: '#FFFBEB', text: '#D97706', border: '#FDE68A' };
      case 'danger':
        return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA' };
      case 'info':
        return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE' };
      case 'purple':
        return { bg: '#FAF5FF', text: '#9333EA', border: '#E9D5FF' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const theme = getBadgeStyle();
  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.bg,
          borderColor: theme.border,
          paddingVertical: isSmall ? 2 : 4,
          paddingHorizontal: isSmall ? 6 : 10,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            color: theme.text,
            fontSize: isSmall ? 10 : 12,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
