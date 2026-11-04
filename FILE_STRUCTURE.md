# Project File Structure

Latest observed structure for the `gamecraft-2026` project.

```text
gamecraft-2026/
  CONFIGURATION_GUIDE.md
  FILE_STRUCTURE.md
  README.md
  index.html
  package-lock.json
  package.json
  tsconfig.app.json
  tsconfig.json
  tsconfig.node.json
  vite.config.ts
  public/
    favicon.svg
    gamecraft-icon.png
    gamecraftlogo.png
    icons.svg
  src/
    App.css
    App.tsx
    index.css
    main.tsx
    assets/
      hero.png
      react.svg
      vite.svg
    components/
      About.css
      About.tsx
      Challenge.css
      Challenge.tsx
      CTA.css
      CTA.tsx
      Events.css
      Events.tsx
      Footer.css
      Footer.tsx
      Hero.css
      Hero.tsx
      Navbar.css
      Navbar.tsx
      Rules.css
      Rules.tsx
      Schedule.css
      Schedule.tsx
    config/
      eventConfig.ts
    data/
      events.ts
      rules.ts
      schedule.ts
    lib/
      supabase.ts
```

## Key Areas

- `src/components/`: React UI sections for the landing page.
- `src/data/`: Editable content for events, rules, and schedule.
- `src/config/eventConfig.ts`: Main event configuration, links, dates, contact info, and rulebook URL.
- `src/lib/supabase.ts`: Supabase client/helper setup.
- `public/`: Static images and icons served directly by Vite.
- `README.md`: Main project overview.
- `CONFIGURATION_GUIDE.md`: Organizer-facing configuration notes.
