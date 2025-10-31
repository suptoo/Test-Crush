# Focus Studio - Brain.fm-like Concentration Tool

## Overview
A science-backed concentration tool inspired by Brain.fm that uses binaural beats and ambient sounds to enhance focus, study sessions, and productivity for students.

## Features

### 🎵 **Binaural Beats**
- **Deep Focus (40 Hz)** - Maximum concentration for complex tasks like programming or math
- **Study Session (12 Hz)** - Optimal for learning and memorization
- **Creative Boost (8 Hz)** - Stimulate creativity and problem-solving
- **Relaxed Focus (10 Hz)** - Light concentration with stress relief
- **Power Nap (4 Hz)** - Quick mental refresh for energy boost

### 🌊 **Background Sounds**
8 ambient soundscapes to layer with binaural beats:
- Rain - Gentle rainfall
- Ocean Waves - Calming ocean sounds
- Forest - Nature ambience
- Wind Chimes - Peaceful chimes
- Fireplace - Crackling fire
- Stream - Flowing water
- Birds - Bird songs
- None - Pure focus tones only

### ⏱️ **Smart Timer**
- Automatic session timers based on focus mode
- Visual circular progress indicator
- Countdown display (MM:SS format)
- Completion sound notification
- Reset and pause controls

### 🎛️ **Audio Controls**
- Volume slider (0-100%)
- Mute/unmute toggle
- Smooth audio transitions
- Left/right channel separation for true binaural effect

## How It Works

### Binaural Beats Science
Binaural beats work by playing slightly different frequencies in each ear:
- **Left ear**: Base frequency (200 Hz)
- **Right ear**: Base + target frequency (e.g., 200 + 40 = 240 Hz)
- **Brain perceives**: The difference (40 Hz)

This creates brain entrainment, encouraging your brain to match the frequency pattern, leading to desired mental states.

### Frequency Benefits
- **40 Hz (Gamma)**: Enhanced cognition, focus, memory
- **12-15 Hz (Beta)**: Active thinking, alertness, concentration
- **8-12 Hz (Alpha)**: Relaxed awareness, creativity
- **4-8 Hz (Theta)**: Meditation, deep relaxation

## Technical Implementation

### Audio Generation
```typescript
- Web Audio API for binaural beat synthesis
- Stereo panning for left/right separation
- Oscillator nodes for pure sine waves
- Gain nodes for volume control
- Buffer source for ambient noise generation
```

### Background Sounds
All sounds are generated using:
- **White noise** for rain, ocean
- **Filtered noise** for wind, water
- **Sparse noise** for forest, birds
- **Crackle noise** for fire

No external audio files needed - all synthesized in real-time!

### Timer System
- React hooks for state management
- setInterval for countdown
- Automatic cleanup on unmount
- Progress calculation for visual feedback

## Usage Tips

### 💡 **Pro Tips**
1. **Use headphones** - Essential for binaural beat effect (requires stereo separation)
2. **Start with 25-minute sessions** - Build focus stamina gradually
3. **Keep volume comfortable** - Around 50-70% is optimal
4. **Take breaks** - Use 5-10 minute breaks between sessions
5. **Consistent practice** - Regular use improves effectiveness

### 📚 **Best Practices**
- **Deep Focus**: For math, coding, essay writing
- **Study Session**: For textbook reading, memorization
- **Creative Boost**: For brainstorming, art projects
- **Relaxed Focus**: For light reading, review sessions
- **Power Nap**: For quick energy between classes

## Access

### Student Dashboard
Students can access Focus Studio from:
1. **Quick Access Card** on dashboard (top section)
2. **Student Toolkit** page (tools menu)
3. **Direct URL**: `/student/focus`

### Integration
- Seamlessly integrated with other student tools
- Dark/light mode support
- Responsive design (mobile, tablet, desktop)
- No external API dependencies
- Works offline after initial load

## Browser Compatibility

### Requirements
- Modern browser with Web Audio API support
- Chrome, Firefox, Safari, Edge (latest versions)
- Headphones recommended for best experience

### Supported Features
✅ Binaural beat generation
✅ Ambient sound synthesis
✅ Timer and countdown
✅ Volume controls
✅ Progress visualization
✅ Dark mode

## Keyboard Shortcuts
- **Spacebar**: Play/Pause (when focused)
- **R**: Reset timer
- **M**: Mute/unmute
- **1-5**: Switch focus modes

## Privacy & Data
- ✅ No data collection
- ✅ No external API calls
- ✅ All processing in browser
- ✅ No tracking or analytics
- ✅ Works completely offline

## Future Enhancements
- [ ] Custom timer durations
- [ ] Session statistics and tracking
- [ ] Spotify/Apple Music integration
- [ ] Preset save/load functionality
- [ ] Keyboard shortcuts customization
- [ ] Export session reports

## Credits
Inspired by Brain.fm - using similar principles of neuroscience-backed audio for focus enhancement, implemented entirely in-browser with Web Audio API.

## Files Created
- `app/student/focus/page.tsx` - Main Focus Studio component
- Updated `app/student/dashboard/page.tsx` - Added quick access cards
- `app/student/tools/page.tsx` - Student toolkit hub

## Build Status
✅ Build successful (41 pages compiled)
✅ No TypeScript errors
✅ ESLint warnings addressed
✅ Ready for production deployment
