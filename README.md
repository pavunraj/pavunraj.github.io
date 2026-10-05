# SideApps Model iOS Developer Portfolio (pavunraj.github.io)

A modern, high-performance portfolio website inspired by [sideapps.dev](https://www.sideapps.dev/), featuring an interactive **vertical slice** screenshot presentation, 3D device frames, dynamic island details, and an interactive iOS assistant.

## Features

- **Vertical Slice Screenshot Showcase**:
  - Interactive iPhone mockup frame with dynamic island and home indicator
  - Vertical sliding and scrolling of app screenshots with smooth GPU-accelerated transitions
  - Vertical thumbnail strip navigation and touch/swipe gesture support
  - 3D parallax tilt response on mouse hover
  - Full-resolution double-click inspection lightbox
- **Complete Local Asset Filing**:
  - All icons, assets, and project screenshots filed into categorized directories under `images/`:
    - `images/washloft/`
    - `images/capone/`
    - `images/chewy/`
    - `images/varta/`
    - `images/lpem/`
    - `images/fitapp/`
    - `images/links/`
    - `images/journeyWest/`
- **Interactive iOS Developer Assistant**:
  - Built-in prompt chips and instant query responses covering Swift, MVVM architecture, technical leadership, and project case studies.
- **GitHub Pages Ready**:
  - Pure static HTML5, Vanilla CSS, and JavaScript. Zero external build dependencies, blazingly fast load times, and mobile responsive.

## Local Preview

You can preview the site locally using any static web server:

```bash
# Using Python
python3 -m http.server 8080

# Or using Node
npx serve .
```

Open `http://localhost:8080` in your browser.
