// src/screens/NoteEditorScreen.js

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
  StatusBar,
  useWindowDimensions,
  Alert,
} from 'react-native';
import { LIGHT_THEME, DARK_THEME, TYPOGRAPHY, SPACING, RADIUS } from '../theme/colors';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Header Image Placeholder (gradient via overlay) ─────────────────────────

// We use a solid-color ImageBackground since we can't load remote assets in all envs.
// The overlays create the visual interest.
const HEADER_PATTERN = {
  uri: 'https://images.unsplash.com/photo-1519682577862-22b62b24e493?w=800&q=80',
};

// ─── Word / Char Counter ─────────────────────────────────────────────────────

function CounterBar({ content, theme }) {
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  return (
    <View style={[styles.counterBar, { borderTopColor: theme.border }]}>
      <Text style={[styles.counterText, { color: theme.textMuted }]}>
        {wordCount} {wordCount === 1 ? 'word' : 'words'}
      </Text>
      <View style={[styles.counterDot, { backgroundColor: theme.border }]} />
      <Text style={[styles.counterText, { color: theme.textMuted }]}>
        {charCount} {charCount === 1 ? 'character' : 'characters'}
      </Text>
    </View>
  );
}

// ─── Toolbar Button ──────────────────────────────────────────────────────────

function ToolbarButton({ label, onPress, theme, active }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) =>
        StyleSheet.flatten([
          styles.toolbarBtn,
          {
            backgroundColor: active
              ? theme.primary + '22'
              : pressed
              ? theme.surfaceAlt
              : 'transparent',
          },
        ])
      }
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text
        style={[
          styles.toolbarBtnText,
          { color: active ? theme.primary : theme.textSecondary },
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Main Editor Screen ───────────────────────────────────────────────────────

export default function NoteEditorScreen({ isDark, note, onBack, onSave }) {
  const { width, height } = useWindowDimensions();
  const theme = isDark ? DARK_THEME : LIGHT_THEME;

  const isTablet = width > 600;
  const isLandscape = width > height;

  // Pre-fill with note data if editing
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [isSaved, setIsSaved] = useState(false);
  const [headerError, setHeaderError] = useState(false);

  const contentRef = useRef(null);

  const hasChanges = title !== (note?.title || '') || content !== (note?.content || '');

  function handleSave() {
    if (!title.trim()) {
      Alert.alert('Title required', 'Please add a title for your note.');
      return;
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
    onSave && onSave({ title, content });
  }

  function handleBack() {
    if (hasChanges) {
      Alert.alert(
        'Discard changes?',
        'You have unsaved changes. Go back anyway?',
        [
          { text: 'Stay', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: onBack },
        ]
      );
    } else {
      onBack && onBack();
    }
  }

  // Responsive content padding
  const contentPaddingH = isTablet ? SPACING.xxxl : SPACING.xl;
  const editorMaxWidth = isTablet ? 720 : undefined;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={[
            styles.scrollContent,
            isTablet && {
              alignItems: 'center',
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── ImageBackground Header ── */}
          <ImageBackground
            source={headerError ? null : HEADER_PATTERN}
            style={[
              styles.headerBg,
              isLandscape && styles.headerBgLandscape,
              { backgroundColor: theme.headerGradientStart },
            ]}
            imageStyle={styles.headerBgImage}
            onError={() => setHeaderError(true)}
          >
            {/* Dark overlay for legibility */}
            <View style={styles.headerOverlay} />

            {/* Decorative accent blobs */}
            <View style={[styles.decorBlob, styles.decorBlobTopRight, { backgroundColor: theme.accent + '30' }]} />
            <View style={[styles.decorBlob, styles.decorBlobBottomLeft, { backgroundColor: theme.primaryLight + '20' }]} />

            {/* Nav row */}
            <View
              style={[
                styles.navRow,
                isTablet && { paddingHorizontal: SPACING.xxxl },
              ]}
            >
              {/* Back button */}
              <Pressable
                onPress={handleBack}
                style={({ pressed }) =>
                  StyleSheet.flatten([
                    styles.navBtn,
                    styles.backBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ])
                }
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Text style={styles.navBtnIcon}>‹</Text>
                <Text style={styles.navBtnLabel}>Notes</Text>
              </Pressable>

              {/* Save button */}
              <Pressable
                onPress={handleSave}
                style={({ pressed }) =>
                  StyleSheet.flatten([
                    styles.navBtn,
                    styles.saveBtn,
                    {
                      backgroundColor: isSaved
                        ? '#27AE60'
                        : theme.accent,
                      opacity: pressed ? 0.85 : 1,
                      transform: [{ scale: pressed ? 0.96 : 1 }],
                    },
                  ])
                }
                accessibilityRole="button"
                accessibilityLabel="Save note"
              >
                <Text style={styles.saveBtnText}>
                  {isSaved ? '✓ Saved' : 'Save'}
                </Text>
              </Pressable>
            </View>

            {/* Header meta info */}
            <View
              style={[
                styles.headerMeta,
                isTablet && { paddingHorizontal: SPACING.xxxl },
                editorMaxWidth && { maxWidth: editorMaxWidth, alignSelf: 'center', width: '100%' },
              ]}
            >
              <Text style={styles.headerLabel}>
                {note ? '✏️  Editing note' : '✨  New note'}
              </Text>
              {note?.date && (
                <Text style={styles.headerDate}>
                  Created {new Date(note.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </Text>
              )}
            </View>
          </ImageBackground>

          {/* ── Editor Body ── */}
          <View
            style={[
              styles.editorBody,
              { paddingHorizontal: contentPaddingH },
              editorMaxWidth && { maxWidth: editorMaxWidth, width: '100%' },
            ]}
          >
            {/* Title Input */}
            <TextInput
              style={StyleSheet.flatten([
                styles.titleInput,
                { color: theme.text, borderBottomColor: theme.border },
                isTablet && styles.titleInputTablet,
              ])}
              value={title}
              onChangeText={setTitle}
              placeholder="Note title..."
              placeholderTextColor={theme.textMuted}
              returnKeyType="next"
              onSubmitEditing={() => contentRef.current?.focus()}
              blurOnSubmit={false}
              maxLength={120}
              accessibilityLabel="Note title"
            />

            {/* Tag indicator if editing */}
            {note?.tag && (
              <View style={styles.tagRow}>
                <View style={[styles.editorTag, { backgroundColor: theme.tagBackground }]}>
                  <Text style={[styles.editorTagText, { color: theme.tagText }]}>
                    {note.tag}
                  </Text>
                </View>
              </View>
            )}

            {/* Formatting toolbar */}
            <View style={[styles.toolbar, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
              <ToolbarButton label="B" theme={theme} />
              <ToolbarButton label="I" theme={theme} />
              <ToolbarButton label="U" theme={theme} />
              <View style={[styles.toolbarDivider, { backgroundColor: theme.border }]} />
              <ToolbarButton label="H1" theme={theme} />
              <ToolbarButton label="H2" theme={theme} />
              <View style={[styles.toolbarDivider, { backgroundColor: theme.border }]} />
              <ToolbarButton label="• List" theme={theme} />
              <ToolbarButton label="☑ Task" theme={theme} />
            </View>

            {/* Content / Body Input */}
            <TextInput
              ref={contentRef}
              style={StyleSheet.flatten([
                styles.contentInput,
                { color: theme.text },
                isTablet && styles.contentInputTablet,
              ])}
              value={content}
              onChangeText={setContent}
              placeholder="Start writing your note here...

Use this space to capture your thoughts, ideas, meeting notes, or anything you'd like to remember.

The keyboard won't overlap your writing — keep going."
              placeholderTextColor={theme.textMuted}
              multiline
              textAlignVertical="top"
              accessibilityLabel="Note content"
              scrollEnabled={false}
            />

            {/* Unsaved changes indicator */}
            {hasChanges && !isSaved && (
              <View style={[styles.unsavedBadge, { backgroundColor: theme.surfaceAlt, borderColor: theme.border }]}>
                <View style={[styles.unsavedDot, { backgroundColor: theme.accent }]} />
                <Text style={[styles.unsavedText, { color: theme.textSecondary }]}>
                  Unsaved changes
                </Text>
              </View>
            )}

            {/* Bottom padding for keyboard */}
            <View style={{ height: SPACING.xxxl * 3 }} />
          </View>
        </ScrollView>

        {/* ── Word Count Bar ── */}
        <CounterBar content={content} theme={theme} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Image Header
  headerBg: {
    height: 200,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  headerBgLandscape: {
    height: 140,
  },
  headerBgImage: {
    resizeMode: 'cover',
    opacity: 0.45,
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 20, 15, 0.72)',
  },
  decorBlob: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  decorBlobTopRight: {
    top: -60,
    right: -40,
  },
  decorBlobBottomLeft: {
    bottom: -80,
    left: -60,
  },

  // Nav
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl + SPACING.lg, // extra for translucent status bar
    paddingBottom: SPACING.md,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    gap: 2,
  },
  navBtnIcon: {
    color: '#FFFFFF',
    fontSize: 22,
    lineHeight: 22,
    fontWeight: TYPOGRAPHY.weights.light,
  },
  navBtnLabel: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.medium,
    opacity: 0.9,
  },
  saveBtn: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sizes.md,
    fontWeight: TYPOGRAPHY.weights.semibold,
    letterSpacing: 0.3,
  },

  // Header meta
  headerMeta: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  headerLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  headerDate: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: TYPOGRAPHY.sizes.sm,
  },

  // Editor body
  editorBody: {
    flex: 1,
    paddingTop: SPACING.xl,
  },

  // Title
  titleInput: {
    fontSize: TYPOGRAPHY.sizes.xxl,
    fontWeight: TYPOGRAPHY.weights.bold,
    letterSpacing: -0.5,
    lineHeight: 34,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    marginBottom: SPACING.lg,
  },
  titleInputTablet: {
    fontSize: 32,
    lineHeight: 40,
  },

  // Tag
  tagRow: {
    marginBottom: SPACING.lg,
  },
  editorTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  editorTagText: {
    fontSize: TYPOGRAPHY.sizes.xs,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },

  // Formatting toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: SPACING.xs,
    paddingVertical: SPACING.xs,
    marginBottom: SPACING.lg,
    flexWrap: 'wrap',
    gap: 2,
  },
  toolbarBtn: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    minWidth: 36,
    alignItems: 'center',
  },
  toolbarBtnText: {
    fontSize: TYPOGRAPHY.sizes.sm,
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  toolbarDivider: {
    width: 1,
    height: 20,
    marginHorizontal: SPACING.xs,
  },

  // Content input
  contentInput: {
    fontSize: TYPOGRAPHY.sizes.md,
    lineHeight: 28,
    minHeight: 300,
    fontWeight: TYPOGRAPHY.weights.regular,
  },
  contentInputTablet: {
    fontSize: TYPOGRAPHY.sizes.lg,
    lineHeight: 32,
    minHeight: 400,
  },

  // Unsaved badge
  unsavedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    marginTop: SPACING.xl,
    gap: SPACING.xs,
  },
  unsavedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  unsavedText: {
    fontSize: TYPOGRAPHY.sizes.xs,
  },

  // Counter bar
  counterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    gap: SPACING.sm,
  },
  counterText: {
    fontSize: TYPOGRAPHY.sizes.xs,
  },
  counterDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
});
