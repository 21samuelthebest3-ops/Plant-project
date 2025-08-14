# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modular plant companion web application that combines AI-powered plant recognition with interactive plant care features. The app uses OpenRouter's GPT-4o for plant identification and Coze SDK for plant-specific chatbots.

## Development Setup

### Configuration
1. Copy the configuration template:
   ```bash
   cp config.example.js config.js
   ```
2. Edit `config.js` with your API keys:
   - `OPENROUTER_API_KEY`: Required for plant recognition via GPT-4o
   - `COZE_PAT_TOKEN`: Required for plant chatbot functionality
   - `OPENROUTER_MODEL`: Defaults to "openai/gpt-4o"

### Local Development
Run a local server (required for camera access and API calls):
```bash
npx http-server -p 8080 .
```
Then open http://localhost:8080

### Testing Plant Recognition
Test the OpenRouter vision API integration:
```bash
node scripts/test_openrouter_vision.js
```

## Code Architecture

### Modular Structure
The application follows a modular JavaScript architecture with clear separation of concerns:

```
js/
├── data.js                    # Plant data definitions and global state
├── utils.js                   # Utility functions (page navigation, notifications)
├── plants.js                  # Plant display, switching, and chat functionality
├── tasks.js                   # Task management (add, complete, streak tracking)
├── favorites.js               # Favorites management
├── settings.js                # Local storage initialization and settings
├── photo-recognition.js       # Camera/gallery capture functionality
├── photo-recognition-extra.js # OpenRouter API integration for plant ID
├── coze-sdk.js               # Coze chatbot configurations
└── app.js                    # Main application logic and event listeners
```

### Key Components

#### Plant Recognition System
- **Camera/Gallery**: `photo-recognition.js` handles media capture
- **AI Analysis**: `photo-recognition-extra.js` integrates with OpenRouter GPT-4o
- **Image Processing**: Automatic compression and base64 encoding

#### Plant Chatbots
- **SDK Integration**: Coze Web SDK for plant-specific AI interactions
- **Plant Mapping**: Each plant (moss, cactus, rose, bamboo) has dedicated chatbot
- **Fallback Chat**: Generic chat system for unrecognized plants

#### State Management
- **Global Variables**: Defined in `data.js`
- **Local Storage**: Persistent data for tasks, favorites, settings
- **Plant State**: Current plant index, favorites status, task streaks

## File Loading Order

JavaScript files must load in this specific order (as defined in index.html):
1. `config.js` - Configuration
2. `data.js` - Data definitions
3. `utils.js` - Utility functions
4. `plants.js` - Plant functionality
5. `tasks.js` - Task management
6. `favorites.js` - Favorites
7. `settings.js` - Settings
8. `photo-recognition.js` - Camera/gallery
9. `photo-recognition-extra.js` - AI recognition
10. `coze-sdk.js` - Chatbot SDK
11. `app.js` - Main application

## API Integration

### OpenRouter (Plant Recognition)
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Model**: `openai/gpt-4o` (configurable in config.js)
- **Input**: Base64-encoded images with plant identification prompts
- **Output**: JSON response with plant name, confidence, and analysis

### Coze SDK (Chatbots)
- **CDN**: `https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.10/libs/cn/index.js`
- **Configuration**: Each plant has specific bot ID in `coze-sdk.js`
- **Integration**: Web SDK provides chat interface overlay

## Security Considerations

- **API Keys**: Never commit `config.js` (gitignored)
- **Token Exposure**: All sensitive data loaded from `window.APP_CONFIG`
- **Client-side**: This is a frontend-only application with no backend server

## Common Modifications

### Adding New Plants
1. Add plant data to `plants` array in `data.js`
2. Add chatbot configuration in `coze-sdk.js`
3. Update plant switching logic in `plants.js`
4. Add chat integration in `app.js`

### Modifying Recognition Prompts
Edit the system and user messages in `photo-recognition-extra.js` function `identifyPlantWithOpenRouter()`

### Updating Styles
All CSS is consolidated in `css/styles.css` with Tailwind classes used in HTML

## Legacy Files
- `legacy/` contains previous monolithic HTML versions
- `plant-companion-app.html` was the original single-file version
- These are kept for reference but should not be modified