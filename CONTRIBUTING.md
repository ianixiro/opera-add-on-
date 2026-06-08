# Contributing Guide

Thank you for your interest in contributing to Discord Browser Integration!

## How to Contribute

### Reporting Bugs
1. Check existing issues first
2. Create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your Opera version

### Feature Requests
1. Check existing feature requests
2. Describe the feature clearly
3. Explain the benefit
4. Provide use case examples

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/opera-add-on-.git
   cd opera-add-on-
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test thoroughly

4. **Commit Changes**
   ```bash
   git commit -m "Add: Clear description of changes"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Submit a Pull Request**
   - Describe your changes
   - Reference related issues
   - Include screenshots for UI changes

## Code Style

### JavaScript
- Use ES6+ syntax
- Use meaningful variable names
- Comment complex functions
- Use const/let, not var
- Use arrow functions where appropriate

### CSS
- Use descriptive class names
- Organize by component
- Use consistent indentation
- Comment non-obvious styles

### File Structure
```
opera-add-on-/
├── manifest.json
├── popup/
│   ├── index.html
│   ├── popup.js
│   └── styles.css
├── background/
│   └── background.js
├── content/
│   ├── content.js
│   └── inject.js
├── config/
│   └── config.js
├── utils/
│   └── utils.js
├── icons/
│   └── *.png
├── README.md
├── INSTALLATION.md
└── PRIVACY.md
```

## Testing

Before submitting:
1. Test all features locally
2. Check for console errors (F12)
3. Test with different Discord servers
4. Test both free and premium features
5. Verify token handling

## Development Setup

1. **Enable Developer Mode in Opera**
   - opera://extensions/
   - Enable "Developer mode"

2. **Load Unpacked Extension**
   - Click "Load unpacked"
   - Select the project folder

3. **View Logs**
   - opera://extensions/
   - Click "Inspect" on the add-on
   - Check console for messages

## Release Process

Maintainers will:
1. Review all contributions
2. Test thoroughly
3. Update version number
4. Create release notes
5. Submit to Opera Add-ons Store

## Questions?

- Open an issue with the `question` label
- Check existing documentation
- Review code comments

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- No harassment or discrimination
- Report violations to maintainers

---

**Happy Contributing! Your work makes Discord Browser Integration better for everyone! 🚀**
