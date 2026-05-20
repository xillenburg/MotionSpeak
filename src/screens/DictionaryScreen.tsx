import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../constants/colors';
import { Header } from '../components/Header';
import { SignCard } from '../components/SignCard';
import { FSL_SIGNS, SIGN_CATEGORIES, FSLSign, SignCategory } from '../constants/signs';

interface Props {
  navigation: any;
}

export const DictionaryScreen: React.FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SignCategory | 'all'>('all');
  const [selectedSign, setSelectedSign] = useState<FSLSign | null>(null);

  const filteredSigns = useMemo(() => {
    return FSL_SIGNS.filter(sign => {
      const matchesSearch =
        sign.label.toLowerCase().includes(search.toLowerCase()) ||
        sign.labelFil.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || sign.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <Header
        title="Sign Dictionary"
        subtitle={`${FSL_SIGNS.length} medical FSL signs`}
        showBack
        onBack={() => navigation.goBack()}
      />

      {/* Search */}
      <View style={styles.searchRow}>
        <Icon name="magnify" size={20} color={Colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search signs..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon name="close-circle" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filter */}
      <FlatList
        data={[{ key: 'all', label: 'All', color: Colors.primary }, ...SIGN_CATEGORIES.map(c => ({ key: c.key, label: c.label, color: c.color }))]}
        keyExtractor={item => item.key}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.categoryChip,
              activeCategory === item.key && { backgroundColor: item.color + '30', borderColor: item.color },
            ]}
            onPress={() => setActiveCategory(item.key as SignCategory | 'all')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.categoryChipText,
                activeCategory === item.key && { color: item.color },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Signs List */}
      <FlatList
        data={filteredSigns}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <SignCard sign={item} onPress={setSelectedSign} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="sign-text" size={48} color={Colors.textMuted} />
            <Text style={styles.emptyText}>No signs found</Text>
          </View>
        }
      />

      {/* Sign Detail Modal */}
      <Modal
        visible={!!selectedSign}
        animationType="slide"
        transparent
        onRequestClose={() => setSelectedSign(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            {selectedSign && (
              <>
                <Text style={styles.modalEmoji}>{selectedSign.emoji}</Text>
                <Text style={styles.modalLabel}>{selectedSign.label}</Text>
                <Text style={styles.modalLabelFil}>{selectedSign.labelFil}</Text>
                <Text style={styles.modalDesc}>{selectedSign.description}</Text>
                <View style={styles.modalCategoryTag}>
                  <Text style={styles.modalCategoryText}>
                    {SIGN_CATEGORIES.find(c => c.key === selectedSign.category)?.label}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.modalClose}
                  onPress={() => setSelectedSign(null)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  searchRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    margin: 16, backgroundColor: Colors.card,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10,
    borderWidth: 1, borderColor: Colors.border,
  },
  searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary, padding: 0 },
  categoryList: { paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  categoryChip: {
    borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7,
    backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border,
  },
  categoryChipText: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  list: { paddingHorizontal: 16, paddingBottom: 32 },
  empty: { alignItems: 'center', paddingTop: 64, gap: 12 },
  emptyText: { fontSize: 15, color: Colors.textSecondary },
  modalBackdrop: {
    flex: 1, backgroundColor: '#00000090',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, paddingTop: 12, alignItems: 'center', gap: 10,
    borderTopWidth: 1, borderColor: Colors.border,
  },
  modalHandle: {
    width: 40, height: 4, borderRadius: 2,
    backgroundColor: Colors.textMuted, marginBottom: 12,
  },
  modalEmoji: { fontSize: 56 },
  modalLabel: { fontSize: 28, fontWeight: '700', color: Colors.textPrimary },
  modalLabelFil: { fontSize: 18, color: Colors.primary },
  modalDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  modalCategoryTag: {
    backgroundColor: Colors.primary + '20', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  modalCategoryText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  modalClose: {
    backgroundColor: Colors.surfaceElevated, borderRadius: 12,
    paddingHorizontal: 32, paddingVertical: 14, marginTop: 8,
    borderWidth: 1, borderColor: Colors.border,
  },
  modalCloseText: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
});