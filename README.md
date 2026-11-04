# Tayyaba Zubaid | Scroll-driven Portfolio

**Live site:** https://tayyaba-animation-web.vercel.app

A single-page portfolio for Tayyaba Zubaid, Frontend Engineer. The page tells its story through scroll: a hero introduction, a desktop project shown on a monitor, the same project shown on a phone, and a contact section. It is built with plain HTML, CSS and JavaScript, with no libraries and no build step.

## Sections
1. **Hero:** portrait, role and a short introduction, with a staggered entrance animation.
2. **Desktop project:** a monitor shows the project screenshot. As you scroll, the screenshot grows to fill the screen, then returns to the monitor.
3. **Mobile project:** a phone turns from landscape to portrait and back, with two screenshots crossfading during the turn.
4. **Contact:** GitHub, email and LinkedIn links, plus a contact form.

## How the animation works
- The desktop and mobile sections are tall, with a sticky full-screen stage inside them.
- CSS scroll-driven animations (`view-timeline`, `animation-timeline`, `animation-range`) connect scroll progress to the keyframes. The animation follows the scrollbar and plays in reverse when you scroll up.
- A small script measures the monitor screen and sets how far the screenshot must scale to fit the viewport, so it works at any window size.
- Contact content fades in with an Intersection Observer.

## Compatibility
Scroll-driven animations work in current Chrome and Edge, and in recent Safari. When a browser does not support them, or the visitor prefers reduced motion, the page shows a static layout where everything is visible and nothing moves.

## Responsive design
Sizes use rem, vw and svh units. Fonts, spacing, images and corner radii are fluid and grow smoothly with the screen width using `clamp()`.

| Screen | Width | Behavior |
|---|---|---|
| Small mobile | up to 360px | Compact spacing, single column |
| Mobile | up to 600px | Single column, full-width form button |
| Tablet | 601px to 1024px | Fluid sizes, two-column contact layout |
| Laptop | 1025px to 1439px | Reference layout |
| Desktop, TV, 2K, 4K | 1440px and up | Text, images and spacing scale in proportion to the screen width, so the page looks the same as on the laptop |

Portrait screens give the monitor more width, and short landscape phones get a compact two-column hero.

## Accessibility
- Semantic landmarks, one `h1`, and descriptive alt text on every image.
- Visible keyboard focus and labeled form fields with built-in validation.
- Status messages are announced to screen readers.
- Respects `prefers-reduced-motion`.

## Contact form
- Fields: full name, email, subject and message, with a hidden field that catches spam bots.
- Drafts are saved in the visitor's browser (localStorage) while they type and restored on reload.
- Submitted messages are also kept in localStorage, limited to the last 50. This storage stays in the visitor's own browser. It does not deliver messages to anyone.

## Tech stack
HTML5, CSS3 (custom properties, scroll-driven animations, responsive units), and vanilla JavaScript (ES6).

## Project structure
```
index.html
css/style.css
js/script.js
assets/
  profile.png
  project-preview.png
  mobile-preview.jpeg
  mobile-tilt.jpeg
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python3 -m http.server
```

## Deployment
The site is static and is hosted on Vercel, which serves the project root with no build command.
