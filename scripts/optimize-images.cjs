const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function optimizeImages() {
  const images = [
    { input: path.join(__dirname, '../public/logo.png'), output: path.join(__dirname, '../public/logo.webp') },
    { input: path.join(__dirname, '../public/og-image.png'), output: path.join(__dirname, '../public/og-image.webp') },
    { input: path.join(__dirname, '../src/assets/hero.png'), output: path.join(__dirname, '../src/assets/hero.webp') },
  ];

  console.log('--- Image Optimization Benchmark ---');

  for (const item of images) {
    if (fs.existsSync(item.input)) {
      const originalSize = fs.statSync(item.input).size;
      await sharp(item.input)
        .webp({ quality: 85, effort: 6 })
        .toFile(item.output);
      const optimizedSize = fs.statSync(item.output).size;
      const savings = (((originalSize - optimizedSize) / originalSize) * 100).toFixed(1);
      console.log(
        `${path.basename(item.input)}: ${originalSize} bytes -> ${path.basename(item.output)}: ${optimizedSize} bytes (${savings}% reduction)`
      );
    } else {
      console.log(`Skipping missing image: ${item.input}`);
    }
  }
}

optimizeImages().catch(err => {
  console.error('Error optimizing images:', err);
  process.exit(1);
});
