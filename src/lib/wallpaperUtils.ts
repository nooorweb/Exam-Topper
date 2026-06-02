import { Platform, NativeModules } from 'react-native';
import { VocabWord } from '../types';

export const GRADIENTS = [
  { id: 0, name: 'Midnight Nebula', colors: ['#312e81', '#0f172a'], text: '#ffffff', accent: '#a5b4fc' },
  { id: 1, name: 'Sunset Aura', colors: ['#831843', '#1e1b4b'], text: '#ffffff', accent: '#fbcfe8' },
  { id: 2, name: 'Emerald Calm', colors: ['#064e3b', '#022c22'], text: '#ffffff', accent: '#a7f3d0' },
  { id: 3, name: 'Charcoal Dark', colors: ['#1e293b', '#09090b'], text: '#ffffff', accent: '#cbd5e1' },
  { id: 4, name: 'Royal Plum', colors: ['#581c87', '#17002e'], text: '#ffffff', accent: '#e9d5ff' },
];

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

export const drawWallpaperToCanvas = (
  canvas: HTMLCanvasElement,
  todayWords: VocabWord[],
  gradientIdx: number,
  selectedFont: string,
  showUrdu: boolean,
  showDetails: boolean,
  format: 'mobile' | 'desktop'
) => {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const selectedGradient = GRADIENTS[gradientIdx] || GRADIENTS[0];
  const isMobile = format === 'mobile';
  canvas.width = isMobile ? 1080 : 1920;
  canvas.height = isMobile ? 1920 : 1080;

  const scale = isMobile ? 1 : 1.5;

  // Background Gradient
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, selectedGradient.colors[0]);
  grad.addColorStop(1, selectedGradient.colors[1]);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Subtle border border rect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.lineWidth = 15;
  ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

  const fontName = selectedFont === 'serif' ? 'Georgia' : selectedFont === 'monospace' ? 'Courier New' : 'Arial';
  
  // Title
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.font = `600 ${22 * scale}px ${fontName}`;
  ctx.textAlign = 'center';
  ctx.fillText('📅 DAILY VOCABULARY LOCKSCREEN', canvas.width / 2, 100 * scale);
  
  ctx.fillStyle = selectedGradient.accent;
  ctx.font = `${14 * scale}px ${fontName}`;
  ctx.fillText(`EXAM TOPPER PREP • ${new Date().toDateString().toUpperCase()}`, canvas.width / 2, 130 * scale);

  if (todayWords.length >= 2) {
    const item1 = todayWords[0];
    const item2 = todayWords[1];

    if (isMobile) {
      // Mobile layout (Vertical Stack)
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

      // Divider line
      y += 100;
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2 - 200, y);
      ctx.lineTo(canvas.width / 2 + 200, y);
      ctx.stroke();

      // Word 2
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
      // Desktop Layout (Columns)
      const colWidth = 760;
      const leftColCenterX = 480;
      const rightColCenterX = 1440;

      // Vertical divider
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 280);
      ctx.lineTo(canvas.width / 2, 850);
      ctx.stroke();

      // Word 1
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

      // Word 2
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

  // Footer branding
  ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.font = `bold ${16 * scale}px ${fontName}`;
  ctx.fillText('WWW.EXAMTOPPER.PK • MASTER YOUR SYLLABUS', canvas.width / 2, canvas.height - 70);
};

export const triggerWebDownload = (
  todayWords: VocabWord[],
  gradientIdx: number,
  selectedFont: string,
  showUrdu: boolean,
  showDetails: boolean,
  format: 'mobile' | 'desktop'
) => {
  if (Platform.OS !== 'web') return;
  try {
    const canvas = document.createElement('canvas');
    drawWallpaperToCanvas(canvas, todayWords, gradientIdx, selectedFont, showUrdu, showDetails, format);
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `ExamTopper_Vocab_${format}_${new Date().toISOString().split('T')[0]}.png`;
    link.href = dataUrl;
    link.click();
    return true;
  } catch (e) {
    console.error('Web wallpaper download failed', e);
    return false;
  }
};

const { WallpaperModule } = NativeModules;

export const setDeviceWallpaper = async (filePath: string, target: 'system' | 'lock' | 'both' = 'both'): Promise<boolean> => {
  if (Platform.OS === 'android' && WallpaperModule) {
    try {
      const result = await WallpaperModule.setWallpaper(filePath, target);
      return !!result;
    } catch (e) {
      console.error('Failed to set device wallpaper', e);
      throw e;
    }
  } else {
    throw new Error('WallpaperModule is only supported on native Android.');
  }
};
