const fs = require('fs');

let code = fs.readFileSync('src/components/Challenge.css', 'utf8');

code = code.replace(
`.challenge::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
}`,
`@keyframes challengeGridPan {
  0% { transform: translateY(0); }
  100% { transform: translateY(30px); }
}

.challenge::before {
  content: '';
  position: absolute;
  inset: -30px 0 0 0;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
  background-size: 30px 30px;
  animation: challengeGridPan 5s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .challenge::before {
    animation: none;
  }
}`
);

code = code.replace(
`.timeline-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}`,
`.timeline-item {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.timeline-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}`
);


code = code.replace(
`.phase-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}`,
`.phase-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.phase-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}`
);

fs.writeFileSync('src/components/Challenge.css', code);
