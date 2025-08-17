# 🎮 3D Portfolio Game

A vibrant, first-person 3D portfolio built with Three.js that showcases your projects as interactive platforms and holographic screens. Navigate through your professional journey in an immersive gaming environment!

![Portfolio Game Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)

## ✨ Features

- **First-Person Navigation**: FPS-style movement with WASD and mouse controls
- **Interactive Project Platforms**: Jump between glowing platforms representing your projects
- **Holographic Info Screens**: Floating screens with detailed project information
- **Clickable Links**: Direct access to GitHub repositories and social profiles
- **Dynamic Content**: Easily updateable through JSON configuration
- **Responsive Design**: Works on desktop browsers with full-screen experience
- **Particle Effects**: Ambient and platform-specific particle animations
- **Vibrant Theme**: Neon colors and futuristic aesthetics

## 🚀 Quick Start

### Local Development

1. **Clone or download** this project to your local machine

2. **Start a local server** (required for loading JSON files):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -SimpleHTTPServer 8000
   
   # Using Node.js (if you have it)
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**:
   - Navigate to `http://localhost:8000`
   - Click "Start Exploring" to begin

### Controls

- **Movement**: WASD or Arrow Keys
- **Look Around**: Mouse movement
- **Jump**: Spacebar
- **Interact**: Click on floating screens
- **Release Mouse**: Escape key

## 🎯 Customizing Your Portfolio

### Adding New Projects

Edit the `projects.json` file to add or modify projects:

```json
{
  "personalInfo": {
    "name": "Your Name",
    "email": "your.email@example.com",
    "linkedin": "https://linkedin.com/in/yourprofile",
    "github": "https://github.com/yourusername"
  },
  "projects": [
    {
      "id": "unique-project-id",
      "name": "Project Name",
      "description": "Detailed description of your project...",
      "techStack": ["Technology", "Stack", "Used"],
      "githubUrl": "https://github.com/yourusername/project-repo",
      "position": { "x": 0, "y": 2, "z": 0 },
      "color": "#00ff88"
    }
  ]
}
```

### Project Configuration Options

| Property | Description | Example |
|----------|-------------|---------|
| `id` | Unique identifier | `"my-awesome-project"` |
| `name` | Display name | `"AI Chat Bot"` |
| `description` | Detailed description | `"Built an AI-powered..."` |
| `techStack` | Array of technologies | `["Python", "React", "API"]` |
| `githubUrl` | Repository link | `"https://github.com/user/repo"` |
| `position` | 3D coordinates | `{"x": 15, "y": 2, "z": -10}` |
| `color` | Hex color code | `"#ff6b35"` |

### Positioning Guidelines

- **X-axis**: Left (-) to Right (+)
- **Y-axis**: Down (-) to Up (+) - Keep platforms at y=2
- **Z-axis**: Back (-) to Front (+)
- **Spacing**: Leave 10-15 units between platforms

### Color Scheme Suggestions

```css
/* Neon Green */ "#00ff88"
/* Orange */     "#ff6b35" 
/* Cyan */       "#4ecdc4"
/* Purple */     "#845ec2"
/* Pink */       "#ff006e"
/* Blue */       "#0077be"
/* Yellow */     "#ffbe0b"
```

## 🌐 Deployment Options

### GitHub Pages (Recommended)

1. **Create a new repository** on GitHub
2. **Upload all files** (index.html, main.js, projects.json, README.md)
3. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save settings
4. **Access your game** at: `https://yourusername.github.io/repository-name`

### Netlify

1. **Drag and drop** the entire folder to [Netlify Drop](https://app.netlify.com/drop)
2. **Get instant URL** for your portfolio game
3. **Optional**: Connect to GitHub for automatic deployments

### Vercel

1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: Run `vercel` in your project directory
3. **Follow prompts** to deploy

### Traditional Web Hosting

Upload all files to your web hosting provider's public directory (usually `public_html` or `www`).

## 🔧 Technical Details

### File Structure
```
portfolio-game/
├── index.html          # Main HTML file
├── main.js            # Game logic and Three.js code
├── projects.json      # Your project data
└── README.md          # This guide
```

### Browser Requirements

- **Modern browsers** with WebGL support
- **Chrome, Firefox, Safari, Edge** (latest versions)
- **Desktop recommended** for optimal experience
- **Mouse and keyboard** required for controls

### Performance Optimization

The game is optimized for:
- **Particle count**: 200 background + 50 per platform
- **Shadow quality**: 2048x2048 shadow maps
- **Render distance**: 100 units with fog
- **Target framerate**: 60 FPS on modern hardware

## 🎨 Customization Advanced

### Modifying Visual Theme

**Colors**: Edit the color values in `main.js`:
```javascript
// Scene background
scene.background = new THREE.Color(0x0a0a0a);

// Ambient lighting
const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
```

**Lighting**: Adjust the point light colors and positions:
```javascript
const colors = [0x00ff88, 0xff6b35, 0x4ecdc4, 0x845ec2];
const positions = [
    [20, 10, 20],   // Top-right
    [-20, 10, 20],  // Top-left
    [20, 10, -20],  // Bottom-right
    [-20, 10, -20]  // Bottom-left
];
```

### Adding New Features

**Custom Platforms**: Modify the `createPlatform()` function to change shapes
**Screen Content**: Edit `drawScreenContent()` to customize info displays  
**Particle Effects**: Adjust particle counts and behaviors in particle functions
**Player Movement**: Tune movement speed and jump height in player object

## 📱 Mobile Support

While optimized for desktop, you can add mobile support by:

1. **Touch Controls**: Implement virtual joystick
2. **Responsive UI**: Add mobile-specific CSS
3. **Performance**: Reduce particle counts for mobile devices

## 🐛 Troubleshooting

### Common Issues

**Game won't load**: 
- Ensure you're running a local server (not file://)
- Check browser console for errors
- Verify projects.json is valid JSON

**Poor performance**:
- Reduce particle counts in `main.js`
- Lower shadow map resolution
- Check hardware acceleration is enabled

**Links not working**:
- Verify URLs in projects.json are correct
- Check popup blocker settings
- Test on different browsers

**Controls not responsive**:
- Click to ensure pointer lock is active
- Check if browser supports PointerLockControls
- Try refreshing the page

### Development Tips

- **Debug Mode**: Open browser DevTools (F12) for console logs
- **Project Positions**: Adjust coordinates in projects.json and refresh
- **Performance**: Use browser's Performance tab to profile rendering
- **Testing**: Test on different screen sizes and browsers

## 📄 License

This project is open source and available under the [MIT License](https://opensource.org/licenses/MIT).

## 🤝 Contributing

Feel free to fork this project and customize it for your own portfolio! If you make improvements, consider sharing them with the community.

---

**Built with ❤️ by Affan Shaikh**  
*Powered by Three.js and modern web technologies*

### 🔗 Connect With Me

- **LinkedIn**: [linkedin.com/in/affan-shaikh-ml](https://www.linkedin.com/in/affan-shaikh-ml/)
- **GitHub**: [github.com/le-Affan](https://github.com/le-Affan)
- **Email**: shaikhaffan.work@gmail.com

---

*Ready to showcase your projects in 3D? Deploy your game and share it with the world!* 🚀
