import React, { useState } from 'react';
import { useColorScheme, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NotesListScreen from './src/screens/NotesListScreen';
import NoteEditorScreen from './src/screens/NoteEditorScreen';
import { MOCK_NOTES } from './src/data/mockNotes';

export default function App() {
  const systemScheme = useColorScheme();
  const [isDarkManual, setIsDarkManual] = useState(null);
  const isDark = isDarkManual !== null ? isDarkManual : systemScheme === 'dark';

  const [screen, setScreen] = useState('list');
  const [selectedNote, setSelectedNote] = useState(null);
  const [notes, setNotes] = useState(MOCK_NOTES);

  function handleToggleDark() {
    setIsDarkManual(!isDark);
  }

  function openNote(note) {
    setSelectedNote(note);
    setScreen('editor');
  }

  function goBack() {
    setScreen('list');
    setSelectedNote(null);
  }

  function saveNote(noteData) {
    if (selectedNote) {
      setNotes(prev =>
        prev.map(n =>
          n.id === selectedNote.id
            ? {
                ...n,
                title: noteData.title,
                content: noteData.content,
                preview: noteData.content.slice(0, 80) + '...',
              }
            : n
        )
      );
    } else {
      const newNote = {
        id: Date.now().toString(),
        title: noteData.title,
        content: noteData.content,
        preview: noteData.content.slice(0, 80) + '...',
        date: new Date().toISOString(),
        tag: 'Personal',
        pinned: false,
      };
      setNotes(prev => [newNote, ...prev]);
    }
    setScreen('list');
    setSelectedNote(null);
  }

  return (
    <SafeAreaProvider>
      <View style={styles.root}>
        {screen === 'list' ? (
          <NotesListScreen
            isDark={isDark}
            onToggleDark={handleToggleDark}
            onOpenNote={openNote}
            notes={notes}
          />
        ) : (
          <NoteEditorScreen
            isDark={isDark}
            note={selectedNote}
            onBack={goBack}
            onSave={saveNote}
          />
        )}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
