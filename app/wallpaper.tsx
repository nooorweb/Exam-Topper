import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useApp } from '../src/context/AppContext';
import {
  ArrowLeft,
  Smartphone,
  Monitor,
  Download,
  Info,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Bookmark,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react-native';
import ViewShot, { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import Svg, { Defs, LinearGradient as SvgGradient, Stop, Rect } from 'react-native-svg';
import { setDeviceWallpaper } from '../src/lib/wallpaperUtils';

const GRADIENTS = [
  { id: 0, name: 'Midnight Nebula', colors: ['#312e81', '#0f172a'], text: '#ffffff', accent: '#a5b4fc' },
  { id: 1, name: 'Sunset Aura', colors: ['#831843', '#1e1b4b'], text: '#ffffff', accent: '#fbcfe8' },
  { id: 2, name: 'Emerald Calm', colors: ['#064e3b', '#022c22'], text: '#ffffff', accent: '#a7f3d0' },
  { id: 3, name: 'Charcoal Dark', colors: ['#1e293b', '#09090b'], text: '#ffffff', accent: '#cbd5e1' },
  { id: 4, name: 'Royal Plum', colors: ['#581c87', '#17002e'], text: '#ffffff', accent: '#e9d5ff' },
];

const FONTS = [
  { id: 'Poppins', name: 'Poppins' },
  { id: 'sans-serif', name: 'Clean Sans' },
  { id: 'serif', name: 'Elegant Serif' },
  { id: 'monospace', name: 'Code Mono' },
];

export default function WallpaperScreen() {
  const { vocab, daySeed, currentTheme, autoDownloadWallpaper } = useApp();
  const isDark = currentTheme === 'dark';

  // State
  const [selectedGradientIdx, setSelectedGradientIdx] = useState(0);
  const [selectedFont, setSelectedFont] = useState('Poppins');
  const [showUrdu, setShowUrdu] = useState(true);
  const [showDetails, setShowDetails] = useState(true); // synonyms & example
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSettingWallpaper, setIsSettingWallpaper] = useState(false);

  // Refs for capturing
  const mobileRef = useRef<ViewShot>(null);
  const desktopRef = useRef<ViewShot>(null);

  useEffect(() => {
    // Auto update wallpaper if enabled
    if (autoDownloadWallpaper && Platform.OS === 'android') {
      // Small delay to ensure the view is rendered and refs are attached
      const timer = setTimeout(() => {
        handleApplyWallpaper('both', true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [vocab, daySeed, autoDownloadWallpaper, selectedGradientIdx, showUrdu, showDetails]);

  const colors = {
    bg: isDark ? '#09090b' : '#f9fafb',
    card: isDark ? '#121214' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1f2937',
    textMuted: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#1f1f23' : '#e5e7eb',
    primary: '#6366f1',
    success: '#10b981',
  };

  const selectedGradient = GRADIENTS[selectedGradientIdx];

  // Extract exactly 2 English words deterministically
  const todayWords = useMemo(() => {
    const englishWords = vocab.filter(w => w.category !== 'Exam Acronym' && w.id.startsWith('vocab'));
    if (englishWords.length === 0) {
      return vocab.slice(0, 2);
    }
    const selected = [];
    for (let i = 0; i < 2; i++) {
      const idx = (daySeed + i) % englishWords.length;
      selected.push(englishWords[idx]);
    }
    return selected.filter(Boolean);
  }, [vocab, daySeed]);

  // Wrap text helper for HTML Canvas (Web rendering)
  const wrapText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;
    
    for (let n = 0; n < words.length; n++) {
      let testLine = line + words[n] + ' ';
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY;
  };

  // Web Canvas Downloader
  const handleWebDownload = (format: 'mobile' | 'desktop') => {
    try {
      const canvas = document.createElement('canvas');
      const isMobile = format === 'mobile';
      canvas.width = isMobile ? 1080 : 1920;
      canvas.height = isMobile ? 1920 : 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const scale = isMobile ? 1 : 1.5;

      // Draw Gradient
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, selectedGradient.colors[0]);
      grad.addColorStop(1, selectedGradient.colors[1]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Subtle geometric accents (Overlaying bordered rect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 15;
      ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

      // Fonts
      const fontName = selectedFont === 'Poppins' ? 'Poppins' : selectedFont === 'serif' ? 'Georgia' : selectedFont === 'monospace' ? 'Courier New' : 'Arial';
      
      // Title
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = `600 ${22 * scale}px ${fontName}`;
      ctx.textAlign = 'center';
      ctx.fillText('📅 DAILY VOCABULARY LOCKSCREEN', canvas.width / 2, 100 * scale);
      
      ctx.fillStyle = selectedGradient.accent;
      ctx.font = `${14 * scale}px ${fontName}`;
      ctx.fillText(`EXAM TOPPER PREP • ${new Date().toDateString().toUpperCase()}`, canvas.width / 2, 130 * scale);

      // Render Words
      if (todayWords.length >= 2) {
        const item1 = todayWords[0];
        const item2 = todayWords[1];

        if (isMobile) {
          // Layout for Mobile (Vertical Stack)
          // Word 1 Block
          let y = 380;
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold 64px ${fontName}`;
          ctx.fillText(item1.word.toUpperCase(), canvas.width / 2, y);
          
          if (showUrdu && item1.urduMeaning) {
            y += 50;
            ctx.fillStyle = selectedGradient.accent;
            ctx.font = `500 36px ${fontName}`;
            ctx.fillText(item1.urduMeaning, canvas.width / 2, y);
          }

          y += 55;
          ctx.fillStyle = '#f3f4f6';
          ctx.font = `400 28px ${fontName}`;
          y = wrapText(ctx, item1.meaning, canvas.width / 2, y, 900, 38);

          if (showDetails) {
            if (item1.synonyms && item1.synonyms.length > 0) {
              y += 45;
              ctx.fillStyle = 'rgba(255,255,255,0.6)';
              ctx.font = `italic 24px ${fontName}`;
              ctx.fillText(`Synonyms: ${item1.synonyms.slice(0, 3).join(', ')}`, canvas.width / 2, y);
            }
            if (item1.example) {
              y += 45;
              ctx.fillStyle = 'rgba(255,255,255,0.5)';
              ctx.font = `italic 22px ${fontName}`;
              y = wrapText(ctx, `"${item1.example}"`, canvas.width / 2, y, 860, 30);
            }
          }

          // Divider Line
          y += 100;
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2 - 200, y);
          ctx.lineTo(canvas.width / 2 + 200, y);
          ctx.stroke();

          // Word 2 Block
          y += 100;
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold 64px ${fontName}`;
          ctx.fillText(item2.word.toUpperCase(), canvas.width / 2, y);

          if (showUrdu && item2.urduMeaning) {
            y += 50;
            ctx.fillStyle = selectedGradient.accent;
            ctx.font = `500 36px ${fontName}`;
            ctx.fillText(item2.urduMeaning, canvas.width / 2, y);
          }

          y += 55;
          ctx.fillStyle = '#f3f4f6';
          ctx.font = `400 28px ${fontName}`;
          y = wrapText(ctx, item2.meaning, canvas.width / 2, y, 900, 38);

          if (showDetails) {
            if (item2.synonyms && item2.synonyms.length > 0) {
              y += 45;
              ctx.fillStyle = 'rgba(255,255,255,0.6)';
              ctx.font = `italic 24px ${fontName}`;
              ctx.fillText(`Synonyms: ${item2.synonyms.slice(0, 3).join(', ')}`, canvas.width / 2, y);
            }
            if (item2.example) {
              y += 45;
              ctx.fillStyle = 'rgba(255,255,255,0.5)';
              ctx.font = `italic 22px ${fontName}`;
              y = wrapText(ctx, `"${item2.example}"`, canvas.width / 2, y, 860, 30);
            }
          }

        } else {
          // Layout for Desktop (Side-by-side Columns)
          const colWidth = 760;
          const leftColCenterX = 480;
          const rightColCenterX = 1440;

          // Vertical divider in middle
          ctx.strokeStyle = 'rgba(255,255,255,0.1)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvas.width / 2, 280);
          ctx.lineTo(canvas.width / 2, 850);
          ctx.stroke();

          // Column 1 (Word 1)
          let y = 350;
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold 62px ${fontName}`;
          ctx.fillText(item1.word.toUpperCase(), leftColCenterX, y);

          if (showUrdu && item1.urduMeaning) {
            y += 55;
            ctx.fillStyle = selectedGradient.accent;
            ctx.font = `500 34px ${fontName}`;
            ctx.fillText(item1.urduMeaning, leftColCenterX, y);
          }

          y += 60;
          ctx.fillStyle = '#f3f4f6';
          ctx.font = `400 24px ${fontName}`;
          y = wrapText(ctx, item1.meaning, leftColCenterX, y, colWidth, 34);

          if (showDetails) {
            if (item1.synonyms && item1.synonyms.length > 0) {
              y += 50;
              ctx.fillStyle = 'rgba(255,255,255,0.6)';
              ctx.font = `italic 22px ${fontName}`;
              ctx.fillText(`Synonyms: ${item1.synonyms.slice(0, 3).join(', ')}`, leftColCenterX, y);
            }
            if (item1.example) {
              y += 45;
              ctx.fillStyle = 'rgba(255,255,255,0.5)';
              ctx.font = `italic 20px ${fontName}`;
              y = wrapText(ctx, `"${item1.example}"`, leftColCenterX, y, colWidth - 40, 26);
            }
          }

          // Column 2 (Word 2)
          y = 350;
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold 62px ${fontName}`;
          ctx.fillText(item2.word.toUpperCase(), rightColCenterX, y);

          if (showUrdu && item2.urduMeaning) {
            y += 55;
            ctx.fillStyle = selectedGradient.accent;
            ctx.font = `500 34px ${fontName}`;
            ctx.fillText(item2.urduMeaning, rightColCenterX, y);
          }

          y += 60;
          ctx.fillStyle = '#f3f4f6';
          ctx.font = `400 24px ${fontName}`;
          y = wrapText(ctx, item2.meaning, rightColCenterX, y, colWidth, 34);

          if (showDetails) {
            if (item2.synonyms && item2.synonyms.length > 0) {
              y += 50;
              ctx.fillStyle = 'rgba(255,255,255,0.6)';
              ctx.font = `italic 22px ${fontName}`;
              ctx.fillText(`Synonyms: ${item2.synonyms.slice(0, 3).join(', ')}`, rightColCenterX, y);
            }
            if (item2.example) {
              y += 45;
              ctx.fillStyle = 'rgba(255,255,255,0.5)';
              ctx.font = `italic 20px ${fontName}`;
              y = wrapText(ctx, `"${item2.example}"`, rightColCenterX, y, colWidth - 40, 26);
            }
          }
        }
      }

      // Branding / Watermark
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.font = `bold ${16 * scale}px ${fontName}`;
      ctx.fillText('WWW.EXAMTOPPER.PK • MASTER YOUR SYLLABUS', canvas.width / 2, canvas.height - 70);

      // Trigger Web Download
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `ExamTopper_Vocab_${format}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e: any) {
      Alert.alert('Download Failed', 'Failed to generate wallpaper asset on web.');
      console.error(e);
    }
  };

  // Native Native ViewShot capture & Media Library Saver
  const handleNativeDownload = async (format: 'mobile' | 'desktop') => {
    setIsCapturing(true);
    const ref = format === 'mobile' ? mobileRef : desktopRef;

    try {
      // 1. Request Permission
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photo library to save wallpapers. You can also share it directly.',
          [
            { text: 'OK' },
            {
              text: 'Share instead',
              onPress: () => handleNativeShare(format)
            }
          ]
        );
        setIsCapturing(false);
        return;
      }

      // 2. Capture ViewShot
      if (ref.current) {
        const uri = await captureRef(ref, {
          format: 'png',
          quality: 1.0,
        });

        // 3. Save to gallery
        await MediaLibrary.saveToLibraryAsync(uri);
        Alert.alert('🎉 Saved successfully!', `The ${format} vocabulary wallpaper has been saved to your gallery!`);
      }
    } catch (e: any) {
      console.error(e);
      Alert.alert('Generation Error', 'Failed to capture wallpaper view. Try sharing it instead.');
    } finally {
      setIsCapturing(false);
    }
  };

  // Fallback Share
  const handleNativeShare = async (format: 'mobile' | 'desktop') => {
    const ref = format === 'mobile' ? mobileRef : desktopRef;
    try {
      if (ref.current) {
        const uri = await captureRef(ref, {
          format: 'png',
          quality: 1.0,
        });
        await Share.share({
          url: uri,
          title: `Daily Vocab Wallpaper (${format})`,
          message: `Check out today's vocabulary wallpaper from Exam Topper!`,
        });
      }
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Unable to share wallpaper.');
    }
  };

  const handleDownload = (format: 'mobile' | 'desktop') => {
    if (Platform.OS === 'web') {
      handleWebDownload(format);
    } else {
      handleNativeDownload(format);
    }
  };

  const handleApplyWallpaper = async (target: 'system' | 'lock' | 'both', silent: boolean = false) => {
    if (Platform.OS === 'web') {
      if (!silent) Alert.alert('Not Supported', 'Setting device wallpaper directly is not supported in the web browser. Please download the image and set it manually.');
      return;
    }
    
    if (Platform.OS === 'ios') {
      if (!silent) Alert.alert(
        'iOS Restriction', 
        'iOS does not allow third-party apps to change the wallpaper programmatically. Please use the "Download" button to save it to your Photos app, then set it from your iOS settings.',
        [
          { text: 'Cancel' },
          { text: 'Download & Save', onPress: () => handleNativeDownload('mobile') }
        ]
      );
      return;
    }

    if (!silent) setIsSettingWallpaper(true);
    try {
      if (mobileRef.current) {
        const uri = await captureRef(mobileRef, {
          format: 'png',
          quality: 1.0,
        });

        const success = await setDeviceWallpaper(uri, target);
        if (!silent) {
          if (success) {
            Alert.alert('🎉 Success!', `Today's Daily Vocabulary has been applied to your device ${target === 'system' ? 'Home Screen' : target === 'lock' ? 'Lock Screen' : 'Home and Lock Screens'}!`);
          } else {
            Alert.alert('Failed', 'Unable to set wallpaper.');
          }
        }
      }
    } catch (e: any) {
      console.error(e);
      if (!silent) Alert.alert('Error', e.message || 'An unexpected error occurred while setting the wallpaper.');
    } finally {
      if (!silent) setIsSettingWallpaper(false);
    }
  };

  // Dynamic Font styles for preview rendering
  const getPreviewFontStyle = (weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular') => {
    const familyMap = {
      regular: 'Poppins-Regular',
      medium: 'Poppins-Medium',
      semibold: 'Poppins-SemiBold',
      bold: 'Poppins-Bold',
    };
    return { fontFamily: familyMap[weight] };
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bg }]}>
      {/* Header bar */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Wallpaper Studio</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>Convert learning to passive exposure</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Responsive Preview Cards */}
        <View style={styles.previewContainer}>
          {/* Interactive Live Mockup */}
          <View style={[styles.mockupWrapper, { borderColor: colors.border }]}>
            <View style={[styles.mobileMockup, { backgroundColor: selectedGradient.colors[1] }]}>
              <Svg style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <SvgGradient id="gradMock" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={selectedGradient.colors[0]} />
                    <Stop offset="100%" stopColor={selectedGradient.colors[1]} />
                  </SvgGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#gradMock)" />
              </Svg>

              <View style={styles.mockupInner}>
                <Text style={[styles.mockupBranding, { color: 'rgba(255,255,255,0.4)', ...getPreviewFontStyle('bold') }]}>
                  DAILY VOCABULARY
                </Text>

                <View style={styles.mockupWordList}>
                  {todayWords.map((item, idx) => (
                    <View key={item.id} style={styles.mockupWordBlock}>
                      {idx > 0 && <View style={styles.mockupDivider} />}
                      <Text style={[styles.mockupWord, getPreviewFontStyle('bold')]}>
                        {item.word.toUpperCase()}
                      </Text>
                      {showUrdu && item.urduMeaning && (
                        <Text style={[styles.mockupUrdu, { color: selectedGradient.accent }, getPreviewFontStyle('medium')]}>
                          {item.urduMeaning}
                        </Text>
                      )}
                      <Text style={[styles.mockupMeaning, getPreviewFontStyle('regular')]} numberOfLines={2}>
                        {item.meaning}
                      </Text>
                      {showDetails && item.synonyms && item.synonyms.length > 0 && (
                        <Text style={[styles.mockupSynonyms, getPreviewFontStyle('regular')]} numberOfLines={1}>
                          Syns: {item.synonyms.slice(0, 2).join(', ')}
                        </Text>
                      )}
                    </View>
                  ))}
                </View>

                <Text style={[styles.mockupWatermark, { color: 'rgba(255,255,255,0.2)', ...getPreviewFontStyle('semibold') }]}>
                  EXAMTOPPER.PK
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Customization controls */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>🎨 Style & Theme Options</Text>

          {/* Gradients Select */}
          <Text style={[styles.label, { color: colors.textMuted }]}>Background Theme</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.gradientsRow}>
            {GRADIENTS.map((grad) => (
              <TouchableOpacity
                key={grad.id}
                onPress={() => setSelectedGradientIdx(grad.id)}
                style={[
                  styles.gradientPill,
                  { borderColor: selectedGradientIdx === grad.id ? colors.primary : colors.border }
                ]}
              >
                <View style={[styles.gradientIndicator, { backgroundColor: grad.colors[0] }]} />
                <Text style={[styles.gradientName, { color: colors.text }]}>{grad.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Content Switches */}
          <View style={[styles.switchRow, { borderBottomColor: colors.border, borderBottomWidth: 1, paddingBottom: 10, marginTop: 14 }]}>
            <View>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Include Urdu Meanings</Text>
              <Text style={[styles.switchSub, { color: colors.textMuted }]}>Show translation help (e.g. عملی)</Text>
            </View>
            <Switch
              value={showUrdu}
              onValueChange={setShowUrdu}
              trackColor={{ false: '#374151', true: '#a5b4fc' }}
              thumbColor={showUrdu ? colors.primary : '#9ca3af'}
            />
          </View>

          <View style={[styles.switchRow, { paddingTop: 10 }]}>
            <View>
              <Text style={[styles.switchLabel, { color: colors.text }]}>Include Extra Details</Text>
              <Text style={[styles.switchSub, { color: colors.textMuted }]}>Include synonyms & contextual examples</Text>
            </View>
            <Switch
              value={showDetails}
              onValueChange={setShowDetails}
              trackColor={{ false: '#374151', true: '#a5b4fc' }}
              thumbColor={showDetails ? colors.primary : '#9ca3af'}
            />
          </View>
        </View>

        <View style={styles.downloadButtonsContainer}>
          <TouchableOpacity
            onPress={() => handleDownload('mobile')}
            style={[styles.actionBtn, { backgroundColor: colors.primary }]}
          >
            <Download size={18} color="#fff" />
            <Text style={styles.actionBtnText}>Download to Gallery</Text>
          </TouchableOpacity>
        </View>

        {/* Set Device Wallpaper Section */}
        {Platform.OS === 'android' && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>📱 Apply as Device Wallpaper</Text>
            <Text style={[styles.switchSub, { color: colors.textMuted, marginBottom: 10 }]}>
              Instantly set today's vocabulary wallpaper on your phone's background. Enable auto-download in settings to do this automatically.
            </Text>

            <View style={{ gap: 8 }}>
              <TouchableOpacity
                onPress={() => handleApplyWallpaper('both')}
                disabled={isSettingWallpaper}
                style={[styles.actionBtn, { backgroundColor: colors.primary }]}
              >
                {isSettingWallpaper ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <ImageIcon size={16} color="#fff" />
                    <Text style={styles.actionBtnText}>Set on Home & Lock Screens</Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => handleApplyWallpaper('system')}
                  disabled={isSettingWallpaper}
                  style={[styles.actionBtn, { flex: 1, backgroundColor: '#4b5563', height: 48 }]}
                >
                  <Text style={styles.actionBtnText}>Home Screen only</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleApplyWallpaper('lock')}
                  disabled={isSettingWallpaper}
                  style={[styles.actionBtn, { flex: 1, backgroundColor: '#4b5563', height: 48 }]}
                >
                  <Text style={styles.actionBtnText}>Lock Screen only</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ─────────────────────────────────────────────────────────────────────────────
          HIDDEN OFFSCRREN ELEMENTS FOR VIEWSHOT NATIVE CAPTURE (Only rendered on mobile)
          ───────────────────────────────────────────────────────────────────────────── */}
      {Platform.OS !== 'web' && (
        <View style={styles.hiddenContainer} pointerEvents="none">
          {/* 1. Mobile Capture Template (1080 x 1920) */}
          <ViewShot ref={mobileRef} options={{ format: 'png', quality: 1.0 }} style={styles.mobileCaptureFrame}>
            <View style={[styles.captureBackground, { backgroundColor: selectedGradient.colors[1] }]}>
              <Svg style={StyleSheet.absoluteFillObject}>
                <Defs>
                  <SvgGradient id="gradMobileCap" x1="0%" y1="0%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor={selectedGradient.colors[0]} />
                    <Stop offset="100%" stopColor={selectedGradient.colors[1]} />
                  </SvgGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#gradMobileCap)" />
              </Svg>

              {/* Decorative accent border */}
              <View style={styles.captureBorder} />

              <View style={styles.captureInner}>
                <Text style={[styles.captureBranding, getPreviewFontStyle('bold')]}>
                  📅 DAILY VOCABULARY LOCKSCREEN
                </Text>
                <Text style={[styles.captureSubtitle, { color: selectedGradient.accent }, getPreviewFontStyle('semibold')]}>
                  EXAM TOPPER PREP • {new Date().toDateString().toUpperCase()}
                </Text>

                <View style={styles.captureWordsList}>
                  {todayWords.map((item, idx) => (
                    <View key={item.id} style={styles.captureWordBlock}>
                      {idx > 0 && <View style={styles.captureDivider} />}
                      <Text style={[styles.captureWord, getPreviewFontStyle('bold')]}>
                        {item.word.toUpperCase()}
                      </Text>
                      {showUrdu && item.urduMeaning && (
                        <Text style={[styles.captureUrdu, { color: selectedGradient.accent }, getPreviewFontStyle('medium')]}>
                          {item.urduMeaning}
                        </Text>
                      )}
                      <Text style={[styles.captureMeaning, getPreviewFontStyle('regular')]}>
                        {item.meaning}
                      </Text>
                      {showDetails && (
                        <View style={{ gap: 8, alignItems: 'center' }}>
                          {item.synonyms && item.synonyms.length > 0 && (
                            <Text style={[styles.captureSynonyms, getPreviewFontStyle('regular')]}>
                              Synonyms: {item.synonyms.slice(0, 3).join(', ')}
                            </Text>
                          )}
                          {item.example && (
                            <Text style={[styles.captureExample, getPreviewFontStyle('regular')]}>
                              "{item.example}"
                            </Text>
                          )}
                        </View>
                      )}
                    </View>
                  ))}
                </View>

                <Text style={[styles.captureWatermark, getPreviewFontStyle('semibold')]}>
                  WWW.EXAMTOPPER.PK • MASTER YOUR SYLLABUS
                </Text>
              </View>
            </View>
          </ViewShot>

        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 14,
  },
  backBtn: {
    padding: 6,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  previewContainer: {
    gap: 10,
  },
  previewTabs: {
    flexDirection: 'row',
    gap: 8,
  },
  previewTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  previewTabText: {
    fontSize: 11,
    fontWeight: '600',
  },
  mockupWrapper: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(128,128,128,0.03)',
  },
  mobileMockup: {
    width: '100%',
    maxWidth: 200,
    aspectRatio: 9 / 16,
    borderRadius: 14,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  mockupInner: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockupBranding: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
  },
  mockupWordList: {
    width: '100%',
    gap: 12,
  },
  mockupWordBlock: {
    alignItems: 'center',
  },
  mockupDivider: {
    width: 40,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: 10,
  },
  mockupWord: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  mockupUrdu: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
  mockupMeaning: {
    fontSize: 9,
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 12,
  },
  mockupSynonyms: {
    fontSize: 7.5,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 3,
    fontStyle: 'italic',
  },
  mockupWatermark: {
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Desktop Preview
  desktopMockup: {
    width: '100%',
    maxWidth: 320,
    aspectRatio: 16 / 9,
    borderRadius: 10,
    overflow: 'hidden',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  mockupInnerDesktop: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockupBrandingDesktop: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },
  mockupColumns: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mockupCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mockupVerticalDivider: {
    width: 1,
    height: 60,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  mockupWordDesk: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  mockupUrduDesk: {
    fontSize: 8,
    fontWeight: '500',
    marginTop: 1,
  },
  mockupMeaningDesk: {
    fontSize: 7,
    color: '#e5e7eb',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 9,
  },
  mockupSynonymsDesk: {
    fontSize: 6,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 2,
  },
  mockupWatermarkDesk: {
    fontSize: 7,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  // Controls
  section: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  gradientsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  gradientPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  gradientIndicator: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  gradientName: {
    fontSize: 11,
    fontWeight: '500',
  },
  fontsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fontBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  fontBtnText: {
    fontSize: 11,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  switchSub: {
    fontSize: 9.5,
    marginTop: 2,
  },
  // Downloads
  downloadButtonsContainer: {
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  // Guide Card
  guideCard: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  guideTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  guideBody: {
    borderTopWidth: 1,
    padding: 14,
    gap: 12,
  },
  guideSection: {
    gap: 4,
  },
  guideSectionTitle: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  guideText: {
    fontSize: 10.5,
    lineHeight: 15,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 10,
    borderRadius: 10,
    marginTop: 4,
  },
  tipText: {
    fontSize: 10.5,
    lineHeight: 14,
    flex: 1,
  },
  // ─────────────────────────────────────────────────────────────────────────────
  // OFFSCRREN EXPORT DESIGNS
  // ─────────────────────────────────────────────────────────────────────────────
  hiddenContainer: {
    position: 'absolute',
    left: -9999,
    top: -9999,
    opacity: 0,
  },
  mobileCaptureFrame: {
    width: 1080,
    height: 1920,
  },
  desktopCaptureFrame: {
    width: 1920,
    height: 1080,
  },
  captureBackground: {
    flex: 1,
  },
  captureBorder: {
    position: 'absolute',
    left: 40,
    top: 40,
    right: 40,
    bottom: 40,
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  captureInner: {
    flex: 1,
    padding: 80,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captureBranding: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: 2,
    marginTop: 20,
  },
  captureSubtitle: {
    fontSize: 15,
    fontWeight: '500',
    marginTop: -20,
    letterSpacing: 0.5,
  },
  captureWordsList: {
    width: '100%',
    gap: 60,
    marginVertical: 40,
  },
  captureWordBlock: {
    alignItems: 'center',
  },
  captureDivider: {
    width: 250,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: 40,
  },
  captureWord: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -1,
  },
  captureUrdu: {
    fontSize: 32,
    fontWeight: '500',
    marginTop: 6,
  },
  captureMeaning: {
    fontSize: 24,
    color: '#f3f4f6',
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 34,
    paddingHorizontal: 40,
  },
  captureSynonyms: {
    fontSize: 20,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    fontStyle: 'italic',
  },
  captureExample: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 6,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 60,
    lineHeight: 24,
  },
  captureWatermark: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 20,
  },
  // Desktop captures
  captureInnerDesktop: {
    flex: 1,
    padding: 70,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  captureBrandingDesk: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 26,
    fontWeight: '600',
    letterSpacing: 3,
  },
  captureSubtitleDesk: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: -15,
  },
  captureColumnsDesk: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureColDesk: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  captureVerticalDividerDesk: {
    width: 2,
    height: 450,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  captureWordDesk: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: -1,
  },
  captureUrduDesk: {
    fontSize: 30,
    fontWeight: '500',
    marginTop: 6,
  },
  captureMeaningDesk: {
    fontSize: 22,
    color: '#f3f4f6',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 30,
  },
  captureSynonymsDesk: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 10,
    fontStyle: 'italic',
  },
  captureExampleDesk: {
    fontSize: 17,
    color: 'rgba(255,255,255,0.45)',
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
  },
  captureWatermarkDesk: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
