# Scroll-driven portfolio

Plain HTML, CSS and JavaScript. No libraries, no build step. Open `index.html`, or serve the folder with `python3 -m http.server`.

## How the animation works
- Hero: time-based CSS entrance (photo clip-path reveal, staggered text).
- Desktop and mobile showcases: a tall section with a sticky 100svh stage. A CSS view timeline (`view-timeline`, `animation-timeline`, `animation-range: cover`) maps scroll progress to keyframes, so everything scrubs with the scrollbar and reverses when you scroll up.
- Desktop: the screenshot is a full-viewport layer clipped to the monitor screen. Animating `clip-path` to `inset(0)` expands it to full screen while the frame fades out, then the steps reverse.
- Mobile: the phone rotates from landscape to portrait and back. The screen content is counter-rotated so the page stays upright.
- Contact: Intersection Observer reveal.

## Compatibility and fallback
Scroll-driven animations work in current Chrome and Edge, and in recent Safari. Check caniuse for Firefox. Where unsupported, or when the user prefers reduced motion, the page shows a static layout: monitor with screenshot, upright phone, all content visible. No extension needed.

## Swap images
Replace `assets/profile.png` (square, about 600px) and `assets/project-preview.webp` (about 1600x1000). Keep the file names, or edit the paths and alt text in `index.html`.

## Name, links, form
- Search `index.html` for "Your Name", `example.com`, `your-username` and `hello@example.com`.
- Colors: edit the variables at the top of `css/style.css`.
- Form: set `data-endpoint` on `#contact-form` to your form service URL (for example Formspree, or your own API). While empty, the form runs in demo mode and says nothing was sent. Validate input and rate-limit on the server too.

## Deployment
Serve over HTTPS and send security headers, for example `Content-Security-Policy: default-src 'self'; connect-src 'self' https://your-form-service; img-src 'self' data:`, plus `X-Content-Type-Options: nosniff` and a `Referrer-Policy`.
