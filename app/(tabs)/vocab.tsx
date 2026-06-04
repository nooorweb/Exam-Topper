import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, Card } from '../../src/components/common';
import { useApp } from '../../src/context/AppContext';
import { VocabWord } from '../../src/types';
import * as Speech from 'expo-speech';
import { Bookmark, Volume2, ChevronLeft, ChevronRight, BookmarkCheck, Sparkles } from 'lucide-react-native';
import { router } from 'expo-router';
import { GeminiService } from '../../src/services/gemini.service';

const { width: SW } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_W = SW - 48;

// ─── Word Card (single slide) ─────────────────────────────────────────────────
function WordCard({
  word,
  isDark,
  isBookmarked,
  onBookmark,
}: {
  word: VocabWord;
  isDark: boolean;
  isBookmarked: boolean;
  onBookmark: () => void;
}) {
  const text  = isDark ? '#f4f4f5' : '#1f2937';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const bg    = isDark ? '#121214' : '#ffffff';
  const border= isDark ? '#1f1f23' : '#e5e7eb';

  return (
    <View style={[wc.card, { backgroundColor: bg, borderColor: border, width: CARD_W }]}>
      {/* Header Row: Word & Bookmark Button */}
      <View style={wc.headerRow}>
        <Text style={[wc.word, { color: '#6366f1' }]} numberOfLines={1} adjustsFontSizeToFit>
          {word.word}
        </Text>
        <TouchableOpacity
          onPress={onBookmark}
          style={[
            wc.bookmarkBtn,
            {
              backgroundColor: isBookmarked
                ? (isDark ? 'rgba(99,102,241,0.15)' : '#e0e7ff')
                : (isDark ? '#1c1c1f' : '#f3f4f6'),
              borderColor: isBookmarked ? '#6366f1' : border,
            }
          ]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel={isBookmarked ? 'Remove bookmark' : 'Bookmark word'}
        >
          <Bookmark
            size={18}
            color={isBookmarked ? '#6366f1' : muted}
            fill={isBookmarked ? '#6366f1' : 'transparent'}
          />
        </TouchableOpacity>
      </View>

      {/* Urdu */}
      {word.urduMeaning ? (
        <Text style={[wc.urdu, { color: isDark ? '#a5b4fc' : '#6366f1' }]}>
          {word.urduMeaning}
        </Text>
      ) : null}

      {/* Meaning */}
      <View style={[wc.row, { borderTopColor: border }]}>
        <Text style={[wc.rowLabel, { color: muted }]}>Meaning</Text>
        <Text style={[wc.rowVal, { color: text }]}>{word.meaning}</Text>
      </View>

      {/* Synonyms */}
      {word.synonyms.length > 0 && (
        <View style={[wc.row, { borderTopColor: border }]}>
          <Text style={[wc.rowLabel, { color: muted }]}>Synonyms</Text>
          <Text style={[wc.rowVal, { color: text }]}>
            {word.synonyms.slice(0, 4).join('  •  ')}
          </Text>
        </View>
      )}

      {/* Antonyms */}
      {word.antonyms.length > 0 && (
        <View style={[wc.row, { borderTopColor: border }]}>
          <Text style={[wc.rowLabel, { color: muted }]}>Antonyms</Text>
          <Text style={[wc.rowVal, { color: text }]}>
            {word.antonyms.slice(0, 4).join('  •  ')}
          </Text>
        </View>
      )}

      {/* Category tag */}
      {word.category ? (
        <View style={[wc.catTag, { backgroundColor: isDark ? '#18181f' : '#f0f0ff' }]}>
          <Text style={[wc.catText, { color: isDark ? '#a5b4fc' : '#6366f1' }]}>
            {word.category}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const wc = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 22,
    gap: 0,
    // shadow
    shadowColor: '#6366f1',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
    gap: 10,
  },
  word: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    flex: 1,
  },
  bookmarkBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  urdu: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
  },
  row: {
    borderTopWidth: 1,
    paddingTop: 10,
    marginTop: 10,
    gap: 4,
  },
  rowLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  rowVal: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  catTag: {
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  catText: { fontSize: 10, fontWeight: '700' },
});

// ─── Bookmarked Word Row ──────────────────────────────────────────────────────
function BookmarkRow({
  word,
  isDark,
  onRemove,
}: {
  word: VocabWord;
  isDark: boolean;
  onRemove: () => void;
}) {
  const text  = isDark ? '#f4f4f5' : '#1f2937';
  const muted = isDark ? '#9ca3af' : '#6b7280';
  const bg    = isDark ? '#121214' : '#ffffff';
  const border= isDark ? '#1f1f23' : '#e5e7eb';

  return (
    <View style={[bm.row, { backgroundColor: bg, borderColor: border }]}>
      <View style={{ flex: 1 }}>
        <Text style={[bm.word, { color: '#6366f1' }]}>{word.word}</Text>
        <Text style={[bm.meaning, { color: muted }]} numberOfLines={2}>
          {word.meaning}
        </Text>
        {word.urduMeaning ? (
          <Text style={[bm.urdu, { color: isDark ? '#a5b4fc' : '#6366f1' }]}>
            {word.urduMeaning}
          </Text>
        ) : null}
      </View>
      <TouchableOpacity
        onPress={onRemove}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel="Remove bookmark"
        style={bm.removeBtn}
      >
        <BookmarkCheck size={18} color="#6366f1" />
      </TouchableOpacity>
    </View>
  );
}

const bm = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 14,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
    padding: 14,
    gap: 10,
  },
  word: { fontSize: 15, fontWeight: '700' },
  meaning: { fontSize: 12, marginTop: 2, lineHeight: 17 },
  urdu: { fontSize: 12, fontWeight: '600', marginTop: 3 },
  removeBtn: { padding: 4, marginTop: 2 },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function VocabScreen() {
  const { vocab, bookmarkWord, currentTheme, bulkImportVocab } = useApp();
  const isDark = currentTheme === 'dark';

  const [currentIdx, setCurrentIdx] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const sliderRef = useRef<FlatList>(null);

  const handleGenerateAIVocab = async () => {
    setAiLoading(true);
    try {
      const apiKey = await GeminiService.getApiKey();
      if (!apiKey) {
        Alert.alert(
          'API Key Required',
          'Please go to Settings and add your Gemini API Key first to enable vocabulary generation.',
          [
            { text: 'Go to Settings', onPress: () => router.push('/settings') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        setAiLoading(false);
        return;
      }

      const generated = await GeminiService.generateDailyVocab();
      if (!generated || generated.length === 0) {
        throw new Error('No words were returned by the AI.');
      }

      const res = bulkImportVocab(JSON.stringify(generated));
      if (res.success) {
        Alert.alert('🎉 AI Words Generated!', `Successfully added ${res.count} competitive exam vocabulary words to your list!`);
        setCurrentIdx(0);
        setTimeout(() => {
          sliderRef.current?.scrollToIndex({ index: 0, animated: true });
        }, 100);
      } else {
        throw new Error(res.error || 'Failed to import generated vocabulary.');
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Generation Failed', e.message || 'An unexpected error occurred while generating vocabulary.');
    } finally {
      setAiLoading(false);
    }
  };

  const colors = {
    bg:     isDark ? '#09090b' : '#f5f5fa',
    text:   isDark ? '#f4f4f5' : '#1f2937',
    muted:  isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    card:   isDark ? '#121214' : '#ffffff',
  };

  // All vocab words (no filtering — simple slider through everything)
  const words = vocab;
  const bookmarked = useMemo(() => vocab.filter((v) => v.isBookmarked), [vocab]);

  const currentWord = words[currentIdx] ?? null;
  const [ttsPlaying, setTtsPlaying] = useState(false);

  const goTo = (idx: number) => {
    const clamped = Math.max(0, Math.min(idx, words.length - 1));
    setCurrentIdx(clamped);
    sliderRef.current?.scrollToIndex({ index: clamped, animated: true, viewPosition: 0.5 });
  };

  const handleTTS = async () => {
    if (!currentWord || ttsPlaying) return;
    setTtsPlaying(true);
    try {
      await Speech.speak(currentWord.word, {
        rate: 0.95,
        onDone: () => setTtsPlaying(false),
        onError: () => setTtsPlaying(false),
      });
    } catch {
      setTtsPlaying(false);
    }
  };

  const onScrollEnd = (e: any) => {
    const offset = e.nativeEvent.contentOffset.x;
    const idx = Math.round(offset / (CARD_W + CARD_GAP));
    setCurrentIdx(idx);
  };

  return (
    <ScrollView
      style={[s.root, { backgroundColor: colors.bg }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={s.content}
    >
      {/* ── Header ── */}
      <View style={s.headerRow}>
        <View>
          <Text style={[s.headerTitle, { color: colors.text }]}>Vocabulary</Text>
          <Text style={[s.headerSub, { color: colors.muted }]}>
            {words.length} words  •  {bookmarked.length} saved
          </Text>
        </View>

        {/* TTS on current card */}
        {currentWord && (
          <TouchableOpacity
            onPress={handleTTS}
            style={[s.ttsBtn, { backgroundColor: isDark ? '#1c1c1f' : '#e0e7ff' }]}
            accessibilityRole="button"
            accessibilityLabel="Pronounce word"
          >
            <Volume2 size={16} color="#6366f1" />
          </TouchableOpacity>
        )}
      </View>

      {/* ── AI VOCAB GENERATOR BANNER ── */}
      <Card isDark={isDark} style={{ marginHorizontal: 16, marginTop: 4, marginBottom: 12, padding: 14, borderRadius: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'space-between' }}>
          <View style={{ flex: 1, gap: 2 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Sparkles size={14} color="#6366f1" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>Daily AI Vocabulary</Text>
            </View>
            <Text style={{ fontSize: 11, color: colors.muted, lineHeight: 16 }}>
              Generate 30 high-yield exam words matching your competitive exam target.
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleGenerateAIVocab}
            disabled={aiLoading}
            style={{
              backgroundColor: '#6366f1',
              paddingHorizontal: 14,
              paddingVertical: 9,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              opacity: aiLoading ? 0.7 : 1,
            }}
          >
            {aiLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Sparkles size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>Generate AI</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </Card>

      {/* ── Word Slider ── */}
      {words.length > 0 ? (
        <>
          <FlatList
            ref={sliderRef}
            data={words}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_W + CARD_GAP}
            decelerationRate="fast"
            snapToAlignment="center"
            onMomentumScrollEnd={onScrollEnd}
            renderItem={({ item }) => (
              <WordCard
                word={item}
                isDark={isDark}
                isBookmarked={item.isBookmarked}
                onBookmark={() => bookmarkWord(item.id)}
              />
            )}
            style={s.slider}
            contentContainerStyle={{ paddingHorizontal: 24, gap: CARD_GAP }}
            getItemLayout={(_, index) => ({
              length: CARD_W + CARD_GAP,
              offset: (CARD_W + CARD_GAP) * index,
              index,
            })}
          />

          {/* Controls row */}
          <View style={s.controls}>
            <TouchableOpacity
              onPress={() => goTo(currentIdx - 1)}
              disabled={currentIdx === 0}
              style={[
                s.navBtn,
                {
                  backgroundColor: isDark ? '#1c1c1f' : '#f3f4f6',
                  opacity: currentIdx === 0 ? 0.3 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Previous word"
            >
              <ChevronLeft size={20} color={colors.text} />
            </TouchableOpacity>

            {/* Dot indicator */}
            <View style={s.dotsRow}>
              {words.length <= 20
                ? words.map((_, i) => (
                    <View
                      key={i}
                      style={[
                        s.dot,
                        {
                          backgroundColor:
                            i === currentIdx ? '#6366f1' : (isDark ? '#27272a' : '#d1d5db'),
                          width: i === currentIdx ? 18 : 6,
                        },
                      ]}
                    />
                  ))
                : (
                  <Text style={[s.counterText, { color: colors.muted }]}>
                    {currentIdx + 1} / {words.length}
                  </Text>
                )
              }
            </View>

            <TouchableOpacity
              onPress={() => goTo(currentIdx + 1)}
              disabled={currentIdx >= words.length - 1}
              style={[
                s.navBtn,
                s.navBtnRight,
                {
                  backgroundColor: '#6366f1',
                  opacity: currentIdx >= words.length - 1 ? 0.3 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Next word"
            >
              <ChevronRight size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={[s.emptyBox, { borderColor: colors.border }]}>
          <Text style={[s.emptyText, { color: colors.muted }]}>No vocabulary loaded yet.</Text>
        </View>
      )}

      {/* ── Saved Words List ── */}
      {bookmarked.length > 0 && (
        <>
          <View style={[s.sectionHeader, { borderTopColor: colors.border }]}>
            <BookmarkCheck size={13} color="#6366f1" />
            <Text style={[s.sectionTitle, { color: colors.muted }]}>
              SAVED WORDS — {bookmarked.length}
            </Text>
          </View>

          <View style={s.bookmarkList}>
            {bookmarked.map((w) => (
              <BookmarkRow
                key={w.id}
                word={w}
                isDark={isDark}
                onRemove={() => bookmarkWord(w.id)}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingBottom: 40 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  headerSub: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  ttsBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  slider: { flexGrow: 0 },

  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  navBtn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnRight: {},

  dotsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  counterText: { fontSize: 13, fontWeight: '700' },

  emptyBox: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    padding: 40,
    alignItems: 'center',
  },
  emptyText: { fontSize: 14, fontWeight: '500' },

  // Bookmarked list
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  bookmarkList: {
    paddingHorizontal: 16,
    gap: 8,
  },
});
