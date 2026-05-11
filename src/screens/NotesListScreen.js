import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  Switch,
  StatusBar,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  LIGHT_THEME, DARK_THEME, TYPOGRAPHY,
  SPACING, RADIUS, CARD_COLORS_LIGHT, CARD_COLORS_DARK,
  TAG_COLORS, TAG_COLORS_DARK,
} from '../theme/colors';

function formatDate(iso) {
  const date = new Date(iso);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function NoteCard({ note, theme, isDark, onPress, index, numColumns }) {
  const [pressed, setPressed] = useState(false);
  const tagPalette = isDark ? TAG_COLORS_DARK : TAG_COLORS;
  const tagStyle = tagPalette[note.tag] || tagPalette.Default;
  const cardColors = isDark ? CARD_COLORS_DARK : CARD_COLORS_LIGHT;
  const cardBg = cardColors[index % cardColors.length];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={StyleSheet.flatten([
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: theme.border,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          flex: numColumns > 1 ? 1 : undefined,
        },
        note.pinned && { borderWidth: 2, borderColor: theme.primary },
      ])}
      accessibilityRole="button"
      accessibilityLabel={`Note: ${note.title}`}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <View style={[styles.pinBadge, { backgroundColor: theme.primary }]}>
          <Text style={styles.pinBadgeText}>📌</Text>
        </View>
      )}

      {/* Title */}
      <Text
        style={[styles.cardTitle, { color: theme.text }]}
        numberOfLines={2}
      >
        {note.title}
      </Text>

      {/* Preview */}
      <Text
        style={[styles.cardPreview, { color: theme.textSecondary }]}
        numberOfLines={3}
      >
        {note.preview}
      </Text>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={[styles.tag, { backgroundColor: tagStyle.bg }]}>
          <Text style={[styles.tagText, { color: tagStyle.text }]}>
            {note.tag}
          </Text>
        </View>
        <Text style={[styles.cardDate, { color: theme.textMuted }]}>
          {formatDate(note.date)}
        </Text>
      </View>
    </Pressable>
  );
}

function EmptyState({ theme, query }) {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🗒️</Text>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {query ? 'No results found' : 'No notes yet'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
        {query ? `Nothing matches "${query}"` : 'Tap + to create your first note'}
      </Text>
    </View>
  );
}

export default function NotesListScreen({ isDark, onToggleDark, onOpenNote, notes }) {
  const { width } = useWindowDimensions();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const isTablet = width > 600;
  const numColumns = 2;

  const filters = ['All', 'Personal', 'Work', 'Reading', 'Travel', 'Health', 'Recipes'];

  const filteredNotes = useMemo(() => {
    let data = notes;
    if (activeFilter !== 'All') {
      data = data.filter((n) => n.tag === activeFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q) ||
          n.tag.toLowerCase().includes(q)
      );
    }
    return [...data].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
  }, [searchQuery, activeFilter, notes]);

  const renderNote = useCallback(
    ({ item, index }) => (
      <NoteCard
        note={item}
        theme={theme}
        isDark={isDark}
        onPress={() => onOpenNote && onOpenNote(item)}
        index={index}
        numColumns={numColumns}
      />
    ),
    [theme, isDark, onOpenNote, numColumns]
  );

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      {/* ── Header ── */}
      <View style={[styles.header, isTablet && styles.headerTablet]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerEyebrow, { color: theme.accent }]}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long', month: 'long', day: 'numeric',
              })}
            </Text>
            <Text style={[styles.headerTitle, { color: theme.text }]}>
              My Notes
            </Text>
          </View>
          <View style={[styles.themeToggle, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={{ opacity: isDark ? 0.4 : 1 }}>☀️</Text>
            <Switch
              value={isDark}
              onValueChange={onToggleDark}
              trackColor={{ false: theme.switchTrackOff, true: theme.primary }}
              thumbColor={theme.switchThumb}
            />
            <Text style={{ opacity: isDark ? 1 : 0.4 }}>🌙</Text>
          </View>
        </View>

        {/* Search */}
        <View style={[styles.searchWrapper, { backgroundColor: theme.inputBackground, borderColor: theme.border }]}>
          <Text style={[styles.searchIcon, { color: theme.textMuted }]}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search notes..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearIcon, { color: theme.textMuted }]}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Note count */}
        <Text style={[styles.noteCount, { color: theme.textMuted }]}>
          {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        </Text>
      </View>

      {/* ── Filter Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterList}
      >
        {filters.map((item) => {
          const isActive = activeFilter === item;
          return (
            <Pressable
              key={item}
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: isActive ? theme.primary : theme.surface,
                  borderColor: isActive ? theme.primary : theme.border,
                  elevation: isActive ? 3 : 1,
                },
              ]}
            >
              <Text style={[
                styles.filterChipText,
                { color: isActive ? '#FFFFFF' : theme.textSecondary },
              ]}>
                {item}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Notes Grid ── */}
      <FlatList
        data={filteredNotes}
        keyExtractor={keyExtractor}
        renderItem={renderNote}
        numColumns={numColumns}
        key={numColumns}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={<EmptyState theme={theme} query={searchQuery} />}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: SPACING.sm }} />}
      />

      {/* ── FAB ── */}
      <Pressable
        onPress={() => onOpenNote && onOpenNote(null)}
        style={({ pressed }) => StyleSheet.flatten([
          styles.fab,
          {
            backgroundColor: theme.fab,
            transform: [{ scale: pressed ? 0.92 : 1 }],
            elevation: pressed ? 4 : 8,
          },
        ])}
        accessibilityRole="button"
        accessibilityLabel="Create new note"
      >
        <Text style={styles.fabIcon}>＋</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 0,              
    paddingBottom: SPACING.sm,
  },
  headerTablet: { paddingHorizontal: SPACING.xxxl },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  headerEyebrow: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.sizes.xxxl,
    fontWeight: TYPOGRAPHY.weights.heavy,
    letterSpacing: -0.5,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  noteCount: {
    fontSize: TYPOGRAPHY.sizes.xs,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xs,
  },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
    height: 46,
    elevation: 2,
  },
  searchIcon: { fontSize: 14, marginRight: SPACING.sm },
  searchInput: { flex: 1, fontSize: TYPOGRAPHY.sizes.md },
  clearIcon: { fontSize: 14, padding: SPACING.xs },

  // Filters
  filterList: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
    flexDirection: 'row',
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    height: 32,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterChipText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.medium,
  },

  // Notes grid
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.xxxl + SPACING.xl,
  },
  columnWrapper: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },

  // Card
  card: {
    flex: 1,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    borderWidth: 1,
    marginBottom: SPACING.xs,
    elevation: 2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    minHeight: 120,
    overflow: 'hidden',
  },
  pinBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinBadgeText: { fontSize: 10 },
  cardTitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: SPACING.sm,
    lineHeight: 22,
  },
  cardPreview: {
    fontSize: TYPOGRAPHY.sizes.sm,
    lineHeight: 19,
    marginBottom: SPACING.md,
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
  tagText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  cardDate: { fontSize: TYPOGRAPHY.sizes.xs },

  // Empty
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyIcon: { fontSize: 52, marginBottom: SPACING.lg },
  emptyTitle: {
    fontSize: TYPOGRAPHY.sizes.xl,
    fontWeight: TYPOGRAPHY.weights.semibold,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    fontSize: TYPOGRAPHY.sizes.md,
    textAlign: 'center',
    paddingHorizontal: SPACING.xxl,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabIcon: {
    color: '#FFFFFF',
    fontSize: 30,
    lineHeight: 32,
    fontWeight: '300',
  },
});