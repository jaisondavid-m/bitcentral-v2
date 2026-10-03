import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { haptics } from '../utils/haptics';

const STATUS_BAR_HEIGHT = Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0;

export default function ScreenHeader({
  title = 'BIT-CENTRAL',
  subtitle,
  rightAction,
  rightIcon,
  onRightPress,
  backgroundColor = '#2563EB',
}) {
  return (
    <View style={[styles.header, { backgroundColor }]}>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" translucent={true} />
      <View style={styles.headerRow}>
        <View style={styles.leftContainer}>
          <Ionicons name="star" size={20} color="#FFFFFF" style={styles.starIcon} />
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {rightAction ? (
          rightAction
        ) : rightIcon && onRightPress ? (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => {
              haptics.tap();
              onRightPress();
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name={rightIcon} size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: STATUS_BAR_HEIGHT + 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  starIcon: {
    marginRight: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 1,
  },
  rightButton: {
    padding: 4,
    marginLeft: 8,
  },
});
