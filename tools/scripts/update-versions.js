const { existsSync, writeFileSync, readFileSync } = require('fs');

const version = process.argv[2];

const updateLocations = process.argv[3].split(',');

for (const filePath of updateLocations) {
  if (existsSync(filePath)) {
    const packageContent = JSON.parse(readFileSync(filePath).toString());
    writeFileSync(
      filePath,
      `${JSON.stringify({ ...packageContent, version }, undefined, 2)}\n`
    );
  }
}
