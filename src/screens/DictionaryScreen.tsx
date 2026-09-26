import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/theme';
import { FSL_SIGNS, SIGN_CATEGORIES, FSLSign, SignCategory } from '../constants/signs';

interface Props {
  navigation: any;
}

const CATEGORY_COLORS: Record<string, string> = {
  symptoms: '#EF4444',
  body_parts: '#3B82F6',
  procedures: '#F59E0B',
  history: '#8B5CF6',
  conversational: '#10B981',
};

export const DictionaryScreen: React.FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const { colors, fs } = useTheme();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<SignCategory | 'all'>('all');
  const [selectedSign, setSelectedSign] = useState<FSLSign | null>(null);

  const filtered = useMemo(() =>
    FSL_SIGNS.filter(s => {
      const matchSearch =
        s.label.toLowerCase().includes(search.toLowerCase()) ||
        s.labelFil.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'all' || s.category === activeCategory;
      return matchSearch && matchCat;
    }),
    [search, activeCategory]
  );

  const catColor = (cat: string) => CATEGORY_COLORS[cat] ?? colors.primary;

  const categories = [
    { key: 'all', label: 'All' },
    ...SIGN_CATEGORIES.map(c => ({ key: c.key, label: c.label })),
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[
        styles.header,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
          paddingTop: insets.top + 12,
        },
      ]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontSize: fs(20) }]}>
          Sign Dictionary
        </Text>
        <Text style={[styles.headerSub, { color: colors.textSecondary, fontSize: fs(13) }]}>
          {FSL_SIGNS.length} medical FSL signs
        </Text>
      </View>

      {/* Search */}
      <View style={[
        styles.searchWrap,
        { backgroundColor: colors.surface, borderBottomColor: colors.border },
      ]}>
        <View style={[
          styles.searchBox,
          { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
        ]}>
          <Icon name="magnify" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, fontSize: fs(14) }]}
            placeholder="Search signs..."
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Icon name="close-circle" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter — ScrollView instead of FlatList to avoid stale render */}
      <View style={[styles.filterContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
        >
          {categories.map(item => {
            const isActive = activeCategory === item.key;
            const color = item.key === 'all'
              ? colors.primary
              : catColor(item.key);
            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? color : colors.surfaceElevated,
                    borderColor: isActive ? color : colors.border,
                  },
                ]}
                onPress={() => setActiveCategory(item.key as SignCategory | 'all')}
                activeOpacity={0.75}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    {
                      color: isActive ? '#FFFFFF' : colors.textSecondary,
                      fontSize: fs(12),
                    },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Signs List */}
      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const color = catColor(item.category);
          return (
            <TouchableOpacity
              style={[
                styles.signCard,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setSelectedSign(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.signEmoji, { backgroundColor: color + '12' }]}>
                <Text style={{ fontSize: 22 }}>{item.emoji}</Text>
              </View>
              <View style={styles.signInfo}>
                <Text style={[styles.signLabel, { color: colors.textPrimary, fontSize: fs(15) }]}>
                  {item.label}
                </Text>
                <Text style={[styles.signFil, { color: colors.textSecondary, fontSize: fs(13) }]}>
                  {item.labelFil}
                </Text>
              </View>
              <View style={[styles.catDot, { backgroundColor: color }]} />
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Icon name="magnify-remove-outline" size={40} color={colors.textMuted} />
            <Text style={[styles.emptyText, { color: colors.textSecondary, fontSize: fs(14) }]}>
              No signs found
            </Text>
          </View>
        }
      />

      {/* Sign Detail Modal */}
      <Modal
        visible={!!selectedSign}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedSign(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />
            {selectedSign && (
              <>
                <Text style={styles.modalEmoji}>{selectedSign.emoji}</Text>
                <Text style={[styles.modalLabel, { color: colors.textPrimary, fontSize: fs(26) }]}>
                  {selectedSign.label}
                </Text>
                <Text style={[styles.modalFil, { color: colors.primary, fontSize: fs(16) }]}>
                  {selectedSign.labelFil}
                </Text>
                <Text style={[styles.modalDesc, { color: colors.textSecondary, fontSize: fs(13) }]}>
                  {selectedSign.description}
                </Text>
                <View style={[
                  styles.modalCat,
                  { backgroundColor: catColor(selectedSign.category) + '15' },
                ]}>
                  <Text style={[
                    styles.modalCatText,
                    { color: catColor(selectedSign.category), fontSize: fs(12) },
                  ]}>
                    {SIGN_CATEGORIES.find(c => c.key === selectedSign.category)?.label}
                  </Text>
                </View>
                <TouchableOpacity
                  style={[
                    styles.modalClose,
                    { backgroundColor: colors.surfaceElevated, borderColor: colors.border },
                  ]}
                  onPress={() => setSelectedSign(null)}
                >
                  <Text style={[styles.modalCloseText, { color: colors.textPrimary, fontSize: fs(15) }]}>
                    Close
                  </Text>
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
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  headerTitle: { fontWeight: '700', letterSpacing: -0.3 },
  headerSub: { marginTop: 2 },
  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
  },
  searchInput: { flex: 1, padding: 0 },
  filterContainer: {
    borderBottomWidth: 1,
    height: 52,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
    paddingVertical: 10,
  },
  filterChip: {
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
  },
  filterChipText: { fontWeight: '500' },
  list: { padding: 16, gap: 10 },
  signCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    borderRadius: 6,
    borderWidth: 1,
  },
  signEmoji: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInfo: { flex: 1 },
  signLabel: { fontWeight: '500' },
  signFil: { marginTop: 2 },
  catDot: { width: 8, height: 8, borderRadius: 4 },
  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: {},
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingTop: 12,
    alignItems: 'center',
    gap: 10,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    marginBottom: 8,
  },
  modalEmoji: { fontSize: 52 },
  modalLabel: { fontWeight: '700' },
  modalFil: { fontWeight: '400' },
  modalDesc: { textAlign: 'center', lineHeight: 20 },
  modalCat: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  modalCatText: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalClose: {
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 13,
    marginTop: 8,
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  modalCloseText: { fontWeight: '500' },
});