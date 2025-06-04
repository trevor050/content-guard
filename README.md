# ContentGuard

ContentGuard is a minimal content moderation utility that analyzes text and returns a simple spam score.

## Installation

```bash
npm install content-guard
```

## Usage

```javascript
const { analyze, isSpam, getScore } = require('content-guard');

(async () => {
  const result = await analyze('Hello world');
  console.log(result.isSpam); // false
})();
```

### API

- **analyze(text)** -> `{ isSpam: boolean, score: number }`
- **isSpam(text)** -> `boolean`
- **getScore(text)** -> `number`

## License

MIT
