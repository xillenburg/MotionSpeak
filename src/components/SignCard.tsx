import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../constants/colors';
import { FSLSign, SIGN_CATEGORIES } from '../constants/signs';

interface SignCardProps {
  sign: FSLSign;
  onPress?: (sign: FSLSign) => void;
}

export const SignCard: React.FC<SignCardProps> = ({ sign, onPress }) => {
  const category = SIGN_CATEGORIES.find(c => c.key === sign.category);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress?.(sign)}
      activeOpacity={0.75}
    >
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{sign.emoji}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.label}>{sign.label}</Text>
        <Text style={styles.labelFil}>{sign.labelFil}</Text>
        <View style={[styles.categoryTag, { backgroundColor: (category?.color ?? Colors.primary) + '20' }]}>
          <Text style={[styles.categoryText, { color: category?.color ?? Colors.primary }]}>
            {category?.label ?? sign.category}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 14,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  labelFil: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});