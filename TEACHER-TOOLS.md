# Teacher Tools Documentation

## Overview
A comprehensive suite of productivity tools designed specifically for teachers to enhance their teaching workflow and save time on administrative tasks.

## Tools Structure
All tools are organized under `/teacher/tools/` with a main hub page at `/teacher/tools/`

## Available Tools

### 1. **File Conversion Tools**

#### PDF to PPTX
- **Location**: `/teacher/tools/pdf-to-pptx`
- **Status**: UI Complete (API requires integration)
- **Description**: Convert PDF documents to editable PowerPoint presentations
- **Features**:
  - Drag & drop interface
  - File size validation (50MB limit)
  - Preview before conversion
  - Download converted files

#### PPTX to PDF
- **Location**: `/teacher/tools/pptx-to-pdf`
- **Status**: UI Complete (API requires integration)
- **Description**: Convert PowerPoint presentations to PDF format
- **Features**:
  - Universal PDF format
  - Print-ready output
  - High-quality graphics preservation

#### Word to PPTX
- **Location**: `/teacher/tools/word-to-pptx`
- **Status**: UI Complete (API requires integration)
- **Description**: Convert Word documents to PowerPoint presentations
- **Features**:
  - Smart content-to-slide conversion
  - Structure preservation
  - Fully editable output

### 2. **OMR Answer Checker** ⭐
- **Location**: `/teacher/tools/omr-checker`
- **Status**: UI Complete (OCR requires integration)
- **Description**: Automatically grade OMR (Optical Mark Recognition) answer sheets
- **Features**:
  - Answer key input
  - Image upload with preview
  - Automatic scoring
  - Percentage calculation
  - CSV export of results
  - Batch processing support
- **Use Cases**:
  - Multiple choice exams
  - Quick quiz grading
  - Standardized test scoring
- **Technical Requirements**: Requires computer vision library (OpenCV/TensorFlow) for production

### 3. **Online Whiteboard** ⭐
- **Location**: `/teacher/tools/whiteboard`
- **Status**: ✅ Fully Functional
- **Description**: Interactive digital whiteboard for teaching and collaboration
- **Features**:
  - Drawing tools (pen, eraser)
  - Shapes (line, circle, rectangle)
  - Color picker with preset colors
  - Adjustable line width (1-20px)
  - Undo/Redo functionality
  - Clear canvas
  - Export as PNG image
  - Real-time preview
- **Use Cases**:
  - Virtual teaching
  - Math demonstrations
  - Brainstorming sessions
  - Student collaboration
- **Technology**: HTML5 Canvas API

### 4. **Grade Calculator** ⭐
- **Location**: `/teacher/tools/grade-calculator`
- **Status**: ✅ Fully Functional
- **Description**: Calculate weighted and unweighted grade averages
- **Features**:
  - Add/remove grade items dynamically
  - Individual score and weight input
  - Weighted average calculation
  - Unweighted average calculation
  - Letter grade conversion (A-F)
  - GPA calculation (4.0 scale)
  - CSV export
  - Real-time percentage display
  - Weight validation (alerts if not 100%)
- **Use Cases**:
  - Final grade calculation
  - Progress tracking
  - Report card preparation
  - What-if scenarios

### 5. **Class Timer** ⭐
- **Location**: `/teacher/tools/timer`
- **Status**: ✅ Fully Functional
- **Description**: Countdown timer for classroom activities
- **Features**:
  - Customizable minutes and seconds
  - Play/Pause controls
  - Reset functionality
  - Visual progress bar
  - Audio notification on completion
  - Quick preset buttons (5, 10, 15, 25, 30, 45, 60, 90 minutes)
- **Use Cases**:
  - Timed activities
  - Break management
  - Exam time limits
  - Pomodoro technique
- **Technology**: JavaScript intervals with audio feedback

### 6. **Attendance Tracker**
- **Location**: `/teacher/tools/attendance-tracker`
- **Status**: 🚧 Coming Soon (Placeholder created)
- **Planned Features**:
  - Daily attendance marking
  - Student attendance history
  - Attendance reports and analytics
  - Export attendance data
  - Absence notifications

### 7. **Lesson Planner**
- **Location**: `/teacher/tools/lesson-planner`
- **Status**: 🚧 Coming Soon (Placeholder created)
- **Planned Features**:
  - Weekly and monthly lesson planning
  - Curriculum mapping
  - Learning objectives tracking
  - Resource attachment
  - Lesson templates

### 8. **Assignment Checker**
- **Location**: `/teacher/tools/assignment-checker`
- **Status**: 🚧 Coming Soon (Placeholder created)
- **Planned Features**:
  - Plagiarism detection
  - Grammar and spelling check
  - AI-generated content detection
  - Similarity comparison
  - Quality score analysis

### 9. **Video Downloader**
- **Location**: `/teacher/tools/video-downloader`
- **Status**: 🚧 Coming Soon (Placeholder created)
- **Planned Features**:
  - Download from YouTube, Vimeo, etc.
  - Multiple quality options
  - Batch download support
  - Audio extraction
  - Subtitle download
- **Note**: Educational use only, respect copyright laws

### 10. **Batch File Converter**
- **Location**: `/teacher/tools/batch-converter`
- **Status**: 🚧 Coming Soon (Placeholder created)
- **Planned Features**:
  - Convert multiple files simultaneously
  - Support for various file formats
  - Queue management
  - Progress tracking
  - Download all as ZIP

## Quick Access
Teachers can access tools from:
1. **Dashboard Quick Tools**: 4 featured tools displayed on main dashboard
2. **Tools Hub**: `/teacher/tools` - Complete grid view of all 12 tools
3. **Direct Links**: Each tool has its own dedicated route

## Dashboard Integration
The teacher dashboard (`/teacher/dashboard`) displays 4 quick-access tool cards:
- PDF to PPTX
- OMR Checker
- Whiteboard
- Grade Calculator

A "View All Tools" button navigates to the complete tools hub.

## Technical Architecture

### Components
- **FileConverter**: Reusable component for file conversion tools
- **Individual Tool Pages**: Each tool has its own page component

### API Routes
- `/api/convert-file`: Handles file conversion (demo mode, requires service integration)
- `/api/process-omr`: Handles OMR processing (demo mode, requires CV library)

### Dependencies
- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Lucide React Icons
- Shadcn UI Components

## Production Requirements

### For File Conversion Tools:
**Option 1: CloudConvert (Recommended)**
```bash
npm install cloudconvert
```
Add to `.env.local`:
```
CLOUDCONVERT_API_KEY=your_api_key_here
```

**Option 2: Alternative Services**
- Zamzar API
- ConvertAPI
- Online-Convert API

### For OMR Checker:
**Computer Vision Libraries**
```bash
npm install sharp @tensorflow/tfjs opencv4nodejs
```
Or use external services:
- Google Cloud Vision API
- Azure Computer Vision
- AWS Rekognition

## Color Scheme
Each tool has its own branded color:
- PDF to PPTX: Blue
- PPTX to PDF: Purple
- Word to PPTX: Green
- OMR Checker: Orange
- Whiteboard: Indigo
- Grade Calculator: Pink
- Attendance: Teal
- Lesson Planner: Cyan
- Assignment Checker: Red
- Timer: Amber
- Video Downloader: Rose
- Batch Converter: Violet

## Responsive Design
All tools are fully responsive with:
- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interfaces
- Optimized for tablets and desktops

## Future Enhancements
1. Real-time collaboration for whiteboard
2. Integration with school management systems
3. Student progress tracking across tools
4. Automated report generation
5. AI-powered features (lesson suggestions, grading assistance)
6. Mobile apps for iOS and Android
7. Offline mode support
8. Cloud storage integration (Google Drive, OneDrive)

## Status Legend
- ✅ Fully Functional: Complete and ready to use
- ⭐ Featured: Highlighted on dashboard
- 🚧 Coming Soon: Placeholder with planned features
- 🔧 Demo Mode: UI complete, requires API integration

## Notes
- File conversion tools are in demo mode and require external API integration
- OMR checker requires computer vision library for production use
- All tools respect user privacy and data security
- Tools are designed for educational use only
