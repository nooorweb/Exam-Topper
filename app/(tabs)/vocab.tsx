import React, { useState, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  LayoutAnimation,
  Platform,
} from 'react-native';
import { useApp } from '../../src/context/AppContext';
import { VocabWord } from '../../src/types';
import * as Speech from 'expo-speech';
import {
  Search,
  Bookmark,
  Volume2,
  HelpCircle,
  Check,
  BookOpen,
  Layers,
} from 'lucide-react-native';

export default function VocabScreen() {
  const { vocab, bookmarkWord, currentTheme } = useApp();
  const isDark = currentTheme === 'dark';


  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Flashcard focus state
  const [focusedWord, setFocusedWord] = useState<VocabWord | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [ttsPlaying, setTtsPlaying] = useState(false);

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#f3f4f6',
    borderAccent: isDark ? '#27272a' : '#e5e7eb',
    primary: '#6366f1',
    primaryBg: isDark ? 'rgba(99, 102, 241, 0.15)' : 'rgba(99, 102, 241, 0.06)',
    success: '#10b981',
    warning: '#f59e0b',
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: colors.bg,
    },
    card: {
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
    },
    text: {
      color: colors.text,
    },
    textMuted: {
      color: colors.textMuted,
    },
  });

  // Derive categories
  const categories = useMemo(() => {
    const cats = new Set(vocab.map((v) => v.category || 'General Vocabulary'));
    return ['All', ...Array.from(cats)];
  }, [vocab]);

  // Filter list
  const filteredVocab = useMemo(() => {
    return vocab.filter((v) => {
      const matchesBookmarks = selectedCategory === 'Bookmarks' ? v.isBookmarked : true;
      const matchesCategory =
        selectedCategory === 'Bookmarks' || selectedCategory === 'All' || v.category === selectedCategory;
      const matchesSearch =
        v.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.synonyms.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesBookmarks && matchesCategory && matchesSearch;
    });
  }, [vocab, selectedCategory, searchQuery]);

  // Set initial focused word
  useEffect(() => {
    if (filteredVocab.length > 0) {
      // Find if current focused is still in list
      const stillExists = filteredVocab.find((v) => v.id === focusedWord?.id);
      if (!stillExists) {
        setFocusedWord(filteredVocab[0]);
        setIsFlipped(false);
      }
    } else {
      setFocusedWord(vocab[0] || null);
      setIsFlipped(false);
    }
  }, [selectedCategory, vocab]);

  const handleSelectWord = (word: VocabWord) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setFocusedWord(word);
    setIsFlipped(false);
  };

  const handleTTS = async (wordStr: string) => {
    if (ttsPlaying) return;
    setTtsPlaying(true);
    try {
      await Speech.speak(wordStr, {
        rate: 0.95,
        onDone: () => setTtsPlaying(false),
        onError: () => setTtsPlaying(false),
      });
    } catch (e) {
      setTtsPlaying(false);
    }
  };

  return (
    <ScrollView style={[styles.container, dynamicStyles.container]} contentContainerStyle={styles.content}>
      {/* Search Input bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Search size={14} color={colors.textMuted} />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search vocabulary, synonyms, or meanings..."
          placeholderTextColor={colors.textMuted}
          style={[styles.searchInput, dynamicStyles.text]}
        />
      </View>

      {/* Horizontal Category Pill Scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalPills}
      >
        {/* Bookmarks Pill */}
        <TouchableOpacity
          onPress={() => setSelectedCategory('Bookmarks')}
          style={[
            styles.pillButton,
            {
              backgroundColor: selectedCategory === 'Bookmarks' ? colors.primary : colors.card,
              borderColor: selectedCategory === 'Bookmarks' ? colors.primary : colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
            },
          ]}
        >
          <Bookmark
            size={12}
            color={selectedCategory === 'Bookmarks' ? '#ffffff' : (isDark ? '#d1d5db' : '#595959')}
            fill={selectedCategory === 'Bookmarks' ? '#ffffff' : 'transparent'}
          />
          <Text style={[styles.pillText, { color: selectedCategory === 'Bookmarks' ? '#ffffff' : (isDark ? '#d1d5db' : '#595959') }]}>
            Bookmarks
          </Text>
        </TouchableOpacity>

        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelectedCategory(cat)}
              style={[
                styles.pillButton,
                {
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                },
              ]}
            >
              <Text style={[styles.pillText, { color: isSelected ? '#ffffff' : (isDark ? '#d1d5db' : '#595959') }]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* FLASHCARD INTERACTIVE FLIP MECHANISM */}
      {focusedWord ? (
        <View style={styles.flashcardWrapper}>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setIsFlipped(!isFlipped)}
            style={[
              styles.flashcard,
              dynamicStyles.card,
              isFlipped && {
                backgroundColor: isDark ? 'rgba(99, 102, 241, 0.08)' : '#e0e7ff',
                borderColor: colors.primary,
              },
            ]}
          >
            {/* Card Header Status Indicator */}
            <View style={[styles.flashcardHeader, { borderBottomColor: isDark ? '#27272a' : '#f3f4f6' }]}>
              <Text style={[styles.flashcardCategory, dynamicStyles.textMuted]}>
                {focusedWord.category || 'General Vocabulary'}
              </Text>

              <TouchableOpacity
                onPress={() => bookmarkWord(focusedWord.id)}
                style={styles.btnBookmark}
              >
                <Bookmark
                  size={16}
                  color={focusedWord.isBookmarked ? colors.primary : colors.textMuted}
                  fill={focusedWord.isBookmarked ? colors.primary : 'transparent'}
                />
              </TouchableOpacity>
            </View>

            {/* Simulated Flip Content */}
            {!isFlipped ? (
              // Front Side
              <View style={styles.cardFront}>
                <Text style={[styles.wordText, dynamicStyles.text]}>{focusedWord.word}</Text>
                {focusedWord.urduMeaning && (
                  <Text style={[styles.urduText, { color: colors.primary }]}>
                    {focusedWord.urduMeaning}
                  </Text>
                )}

                <View style={styles.ttsRow}>
                  <TouchableOpacity
                    onPress={() => handleTTS(focusedWord.word)}
                    style={[styles.btnTTS, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}
                  >
                    <Volume2 size={13} color={colors.text} />
                  </TouchableOpacity>
                  <Text style={[styles.ttsLabel, dynamicStyles.textMuted]}>Pronounce Word</Text>
                </View>
              </View>
            ) : (
              // Back Side
              <View style={styles.cardBack}>
                <Text style={styles.backLabel}>MEANING:</Text>
                <Text style={[styles.meaningText, dynamicStyles.text]}>{focusedWord.meaning}</Text>

                {focusedWord.urduMeaning && (
                  <View style={[styles.backDivider, { borderTopColor: isDark ? '#1c1c1f' : '#e5e7eb' }]}>
                    <Text style={styles.backLabel}>URDU / اردو:</Text>
                    <Text style={[styles.urduBackText, { color: colors.primary }]}>
                      {focusedWord.urduMeaning}
                    </Text>
                  </View>
                )}

                {/* Synonyms & Antonyms */}
                <View style={styles.synAntGrid}>
                  <View style={styles.synAntCol}>
                    <Text style={styles.backLabel}>Synonyms</Text>
                    <Text style={[styles.synAntVal, dynamicStyles.text]} numberOfLines={1}>
                      {focusedWord.synonyms.slice(0, 3).join(', ') || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.synAntCol}>
                    <Text style={styles.backLabel}>Antonyms</Text>
                    <Text style={[styles.synAntVal, dynamicStyles.text]} numberOfLines={1}>
                      {focusedWord.antonyms.slice(0, 3).join(', ') || 'N/A'}
                    </Text>
                  </View>
                </View>

                {focusedWord.example && (
                  <View style={[styles.exampleBox, { backgroundColor: isDark ? 'rgba(99,102,241,0.06)' : '#fff' }]}>
                    <Text style={[styles.exampleText, dynamicStyles.textMuted]}>
                      <Text style={{ fontWeight: 'bold', color: colors.primary }}>Ex: </Text>
                      &ldquo;{focusedWord.example}&rdquo;
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Card Footer prompt */}
            <View style={[styles.cardFooter, { borderTopColor: isDark ? '#27272a' : '#f3f4f6' }]}>
              <Text style={[styles.footerPromptText, dynamicStyles.textMuted]}>
                {isFlipped ? 'Tap to view Front Word' : 'Tap to uncover Detail Meaning'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Vocabulary Deck List */}
      <Text style={[styles.sectionTitle, dynamicStyles.textMuted]}>
        Vocabulary Deck — {filteredVocab.length} Words
      </Text>

      {filteredVocab.length === 0 ? (
        <View style={[styles.emptyCard, dynamicStyles.card]}>
          <HelpCircle size={32} color={colors.textMuted} />
          <Text style={[styles.emptyTitle, dynamicStyles.text]}>No matching words found</Text>
          <Text style={[styles.emptySubtitle, dynamicStyles.textMuted]}>
            Try modifying search strings or check bookmarks tags.
          </Text>
        </View>
      ) : (
        <View style={styles.deckList}>
          {filteredVocab.map((w) => {
            const isSelected = focusedWord?.id === w.id;
            return (
              <TouchableOpacity
                key={w.id}
                onPress={() => handleSelectWord(w)}
                style={[
                  styles.deckItem,
                  dynamicStyles.card,
                  isSelected && {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                ]}
              >
                <View style={{ flex: 1, paddingRight: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={[styles.deckWord, dynamicStyles.text]}>{w.word}</Text>
                    <View style={[styles.deckCategoryBadge, { backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6' }]}>
                      <Text style={[styles.deckCategoryText, dynamicStyles.textMuted]}>
                        {w.category || 'Vocab'}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.deckMeaning, dynamicStyles.textMuted]} numberOfLines={1}>
                    {w.meaning}
                  </Text>
                  {w.urduMeaning && (
                    <Text style={[styles.deckUrdu, { color: colors.primary }]}>{w.urduMeaning}</Text>
                  )}
                </View>

                <View style={styles.deckItemActions}>
                  <TouchableOpacity
                    onPress={() => bookmarkWord(w.id)}
                    style={styles.itemActionBtn}
                  >
                    <Bookmark
                      size={14}
                      color={w.isBookmarked ? colors.primary : colors.textMuted}
                      fill={w.isBookmarked ? colors.primary : 'transparent'}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleSelectWord(w);
                      setIsFlipped(true);
                    }}
                    style={styles.itemActionBtn}
                  >
                    <BookOpen size={14} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    padding: 0,
  },
  tabsWrapper: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 12,
  },
  tabText: {
    fontSize: 13,
  },
  horizontalPills: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  pillButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'none',
  },
  flashcardWrapper: {
    marginBottom: 24,
  },
  flashcardPrompt: {
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'none',
  },
  flashcard: {
    borderRadius: 16,
    padding: 24,
    minHeight: 280,
    justifyContent: 'space-between',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  flashcardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  flashcardCategory: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  btnBookmark: {
    padding: 6,
  },
  cardFront: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  wordText: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  urduText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  ttsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  btnTTS: {
    padding: 8,
    borderRadius: 10,
  },
  ttsLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  cardBack: {
    paddingVertical: 12,
  },
  backLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9ca3af',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500',
  },
  backDivider: {
    borderTopWidth: 1,
    borderStyle: 'dashed',
    marginTop: 12,
    paddingTop: 12,
  },
  urduBackText: {
    fontSize: 15,
    fontWeight: '500',
  },
  synAntGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
  },
  synAntCol: {
    flex: 1,
  },
  synAntVal: {
    fontSize: 12,
    fontWeight: '500',
  },
  exampleBox: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(128,128,128,0.1)',
  },
  exampleText: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 16,
  },
  cardFooter: {
    borderTopWidth: 1,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerPromptText: {
    fontSize: 11,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0,
    marginBottom: 14,
    marginTop: 8,
  },
  emptyCard: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  emptySubtitle: {
    fontSize: 13,
    textAlign: 'center',
  },
  deckList: {
    gap: 12,
    marginBottom: 24,
  },
  deckItem: {
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  deckWord: {
    fontSize: 15,
    fontWeight: '600',
  },
  deckCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deckCategoryText: {
    fontSize: 10,
    fontWeight: '500',
  },
  deckMeaning: {
    fontSize: 12,
    marginTop: 4,
  },
  deckUrdu: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 3,
  },
  deckItemActions: {
    flexDirection: 'row',
    gap: 8,
  },
  itemActionBtn: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(128,128,128,0.05)',
  },
});
