const fs = require('fs');
let code = fs.readFileSync('src/components/Registration.css', 'utf8');

// Replace registration-grid animation
code = code.replace(
`.registration-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image:
    linear-gradient(to right, var(--white) 1px, transparent 1px),
    linear-gradient(to bottom, var(--white) 1px, transparent 1px);
  background-size: 40px 40px;
}`,
`@keyframes gridPan {
  0% { background-position: 0 0; }
  100% { background-position: 40px 40px; }
}

.registration-grid {
  position: fixed;
  inset: 0;
  pointer-events: none;
  opacity: 0.12;
  background-image:
    linear-gradient(to right, var(--white) 1px, transparent 1px),
    linear-gradient(to bottom, var(--white) 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridPan 20s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .registration-grid {
    animation: none;
  }
}`
);

code = code.replace(
`.registration-card input {
  display: block;
  width: 100%;
  margin-top: 0.6rem;
  padding: 1rem;
  border: var(--border-thin);
  background: var(--white);
  color: var(--black);
  font-family: var(--font-body);
  font-size: 1rem;
  outline: none;
}`,
`.registration-card input {
  display: block;
  width: 100%;
  margin-top: 0.6rem;
  padding: 1rem;
  border: var(--border-thin);
  background: var(--white);
  color: var(--black);
  font-family: var(--font-body);
  font-size: 1rem;
  outline: none;
  transition: box-shadow 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
}`
);

code = code.replace(
`.registration-card input:focus {
  box-shadow: 4px 4px 0 var(--pink);
}`,
`.registration-card input:focus {
  border-color: var(--pink);
  box-shadow: 4px 4px 0 var(--pink);
  transform: translateY(-2px);
}`
);


code = code.replace(
`.member-count-selector button {
  flex: 1;
  padding: 1rem;
  border: var(--border-thin);
  background: var(--white);
  color: var(--black);
  font-weight: 800;
  cursor: pointer;
}`,
`.member-count-selector button {
  flex: 1;
  padding: 1rem;
  border: var(--border-thin);
  background: var(--white);
  color: var(--black);
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease;
}

.member-count-selector button:not(.selected):hover {
  background: var(--gray-100);
  transform: translateY(-2px);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.1);
}`
);

code = code.replace(
`.event-option {
  text-align: left;
  padding: 1.25rem;
  border: var(--border-thin);
  background: var(--white);
  color: var(--black);
  cursor: pointer;
  transition: transform 0.15s ease;
}`,
`.event-option {
  text-align: left;
  padding: 1.25rem;
  border: var(--border-thin);
  background: var(--white);
  color: var(--black);
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.2s ease;
}`
);

code = code.replace(
`.primary-button {
  margin-left: auto;
  background: var(--pink);
  color: var(--black);
  box-shadow: 5px 5px 0 var(--black);
}`,
`.primary-button {
  margin-left: auto;
  background: var(--pink);
  color: var(--black);
  box-shadow: 5px 5px 0 var(--black);
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.primary-button:hover:not(:disabled) {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--black);
}

.primary-button:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--black);
}`
);

code = code.replace(
`.secondary-button {
  background: var(--white);
  color: var(--black);
}`,
`.secondary-button {
  background: var(--white);
  color: var(--black);
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.secondary-button:hover:not(:disabled) {
  transform: translate(-3px, -3px);
  box-shadow: 5px 5px 0 var(--black);
}

.secondary-button:active:not(:disabled) {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--black);
}`
);

code = code.replace(
`.registration-button {
  background: var(--pink);
  color: var(--black);
  box-shadow: 5px 5px 0 var(--black);
}`,
`.registration-button {
  background: var(--pink);
  color: var(--black);
  box-shadow: 5px 5px 0 var(--black);
  transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.15s cubic-bezier(0.16, 1, 0.3, 1);
}

.registration-button:hover {
  transform: translate(-3px, -3px);
  box-shadow: 8px 8px 0 var(--black);
}

.registration-button:active {
  transform: translate(2px, 2px);
  box-shadow: 3px 3px 0 var(--black);
}`
);

fs.writeFileSync('src/components/Registration.css', code);
console.log('Patched Registration.css')
