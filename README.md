# FigTranslator

A Figma plugin that translates selected text layers to English using Google Translate API.

## Features

- **Instant Translation**: Select any text layer in Figma and instantly translate it to English
- **Auto-Detection**: Automatically detects the source language
- **Real-time Updates**: Translation updates automatically when you select different text layers
- **Simple UI**: Clean and intuitive interface built with HTML and vanilla JavaScript
- **Error Handling**: Clear error messages for translation failures

## Installation

### Prerequisites

- Node.js (which includes npm) - [Download here](https://nodejs.org/en/download/)
- TypeScript - Install globally with: `npm install -g typescript`

### Setup

1. Clone or download this repository
2. Navigate to the plugin directory
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the plugin:
   ```bash
   npm run build
   ```

### Loading in Figma

1. Open Figma
2. Go to **Plugins** → **Development** → **Import plugin from manifest...**
3. Select the `manifest.json` file in this directory
4. The plugin will now be available in your plugins menu

## Usage

1. Open a Figma design file
2. Run the FigTranslator plugin from the plugins menu
3. Select a text layer in your design
4. The plugin will automatically:
   - Display the selected text
   - Translate it to English
   - Show the translation result

5. Select different text layers to translate them automatically

## Development

### Building

- **Build once**: `npm run build`
- **Watch mode** (auto-rebuild on changes): `npm run watch`

### Linting

- **Check code**: `npm run lint`
- **Fix issues**: `npm run lint:fix`

### Recommended Editor

We recommend using [Visual Studio Code](https://code.visualstudio.com/) for development:

1. Open this directory in VS Code
2. Run **Terminal > Run Build Task...** and select "npm: watch"
3. VS Code will automatically rebuild the JavaScript file every time you save

## Technical Details

- **Language**: TypeScript
- **Build Tool**: TypeScript Compiler (tsc)
- **Translation API**: Google Translate (unofficial endpoint)
- **Figma API Version**: 1.0.0
- **Network Access**: Allowed for `https://translate.googleapis.com`

### Project Structure

```
translatoor/
├── code.ts          # Main plugin logic and UI
├── manifest.json    # Figma plugin configuration
├── package.json     # Node.js dependencies and scripts
├── tsconfig.json    # TypeScript configuration
└── README.md        # This file
```

### How It Works

1. The plugin shows a UI panel with selected text and translation sections
2. When a text layer is selected in Figma, the plugin sends the text to the UI
3. The UI requests translation from the main plugin thread
4. The plugin fetches translation from Google Translate API
5. The result is displayed in the UI

## License

This project is provided as-is for educational and personal use.

## Contributing

Feel free to submit issues and pull requests to improve the plugin.
