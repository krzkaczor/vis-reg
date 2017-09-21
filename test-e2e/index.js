const Nightmare = require("nightmare");
const { screenshots } = require("./screenshots");
const { join } = require("path");

async function main() {
  const nightmare = new Nightmare({
    show: false,
  });
  const URL = "file://" + join(__dirname, "../src/index.html");
  await nightmare.goto(URL).wait("body");

  await screenshots(nightmare, "index");

  await await nightmare.end();
}

main().catch(console.error);
