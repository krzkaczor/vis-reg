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

  const t = await nightmare.evaluate(() => {
    return document.title;
  });
  console.log("Title", t);
  if (t !== "TESTPAGE"){
    console.log("TITLE DOESNT MATCH!:", nightmare.title());
    throw new Error("TITLE DOESNT MATCH!:")
  }

  await nightmare.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
