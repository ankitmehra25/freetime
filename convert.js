const fs = require("fs-extra");
const path = require("path");
const { execFileSync } = require("child_process");

const INPUT_DIR = path.join(__dirname, "input");
const OUTPUT_DIR = path.join(__dirname, "output");
const TEMP_DIR = path.join(__dirname, ".temp");

fs.ensureDirSync(INPUT_DIR);
fs.ensureDirSync(OUTPUT_DIR);
fs.ensureDirSync(TEMP_DIR);

function commandExists(command) {
  try {
    execFileSync(command, ["--version"], {
      stdio: "ignore",
      shell: true
    });
    return true;
  } catch {
    return false;
  }
}

function checkDependencies() {
  const missing = [];

  if (!commandExists("pandoc")) {
    missing.push("pandoc");
  }

  if (!commandExists("mmdc")) {
    missing.push("mermaid-cli (mmdc)");
  }

  if (missing.length > 0) {
    console.error("\nMissing required dependencies:");
    missing.forEach((item) => console.error(`  - ${item}`));

    console.error("\nPlease install them and run again.\n");
    process.exit(1);
  }
}

function extractMermaidBlocks(markdown) {
  const blocks = [];

  const regex = /```mermaid\s*\n([\s\S]*?)```/gi;

  let match;
  let index = 0;

  while ((match = regex.exec(markdown)) !== null) {
    blocks.push({
      index,
      source: match[1].trim(),
      fullMatch: match[0]
    });

    index++;
  }

  return blocks;
}

function renderMermaid(source, index, baseName) {
  const mermaidFile = path.join(
    TEMP_DIR,
    `${baseName}-${index}.mmd`
  );

  const svgFile = path.join(
    TEMP_DIR,
    `${baseName}-${index}.svg`
  );

  fs.writeFileSync(mermaidFile, source, "utf8");

  console.log(`  Rendering Mermaid diagram ${index + 1}...`);

  execFileSync(
    "mmdc",
    [
      "-i",
      mermaidFile,
      "-o",
      svgFile,
      "-b",
      "transparent"
    ],
    {
      stdio: "inherit",
      shell: true
    }
  );

  return svgFile;
}

function processMarkdown(markdown, baseName) {
  const mermaidBlocks = extractMermaidBlocks(markdown);

  if (mermaidBlocks.length === 0) {
    return markdown;
  }

  let processedMarkdown = markdown;

  // Replace Mermaid blocks with references to the generated SVG files.
  //
  // Pandoc will embed these SVGs into the resulting DOCX.
  for (let i = mermaidBlocks.length - 1; i >= 0; i--) {
    const block = mermaidBlocks[i];

    const svgFile = renderMermaid(
      block.source,
      block.index,
      baseName
    );

    const relativeSvgPath = path.relative(
      INPUT_DIR,
      svgFile
    );

    const imageMarkdown = `![Mermaid diagram](${svgFile.replace(/\\/g, "/")})`;

    processedMarkdown =
      processedMarkdown.slice(0, block.fullMatch.length === 0 ? 0 : 0);

    // Replace this particular Mermaid block.
    processedMarkdown = markdown.replace(
      block.fullMatch,
      imageMarkdown
    );
  }

  return processedMarkdown;
}

function convertFile(fileName) {
  const inputFile = path.join(INPUT_DIR, fileName);

  const baseName = path.basename(
    fileName,
    path.extname(fileName)
  );

  const outputFile = path.join(
    OUTPUT_DIR,
    `${baseName}.docx`
  );

  console.log(`\nConverting: ${fileName}`);

  let markdown = fs.readFileSync(inputFile, "utf8");

  const mermaidBlocks = extractMermaidBlocks(markdown);

  console.log(
    `  Found ${mermaidBlocks.length} Mermaid diagram(s).`
  );

  /*
   * Replace Mermaid blocks with generated SVG images.
   */
  for (const block of mermaidBlocks) {
    const svgFile = renderMermaid(
      block.source,
      block.index,
      baseName
    );

    const imageMarkdown =
      `![Mermaid diagram](${svgFile.replace(/\\/g, "/")})`;

    markdown = markdown.replace(
      block.fullMatch,
      imageMarkdown
    );
  }

  /*
   * Write a temporary Markdown file.
   *
   * This allows Pandoc to resolve the generated SVG images.
   */
  const tempMarkdownFile = path.join(
    TEMP_DIR,
    `${baseName}.md`
  );

  fs.writeFileSync(
    tempMarkdownFile,
    markdown,
    "utf8"
  );

  console.log("  Generating Word document...");

  execFileSync(
    "pandoc",
    [
      tempMarkdownFile,
      "-o",
      outputFile,
      "--from=markdown",
      "--to=docx",
      "--standalone"
    ],
    {
      stdio: "inherit",
      shell: true
    }
  );

  console.log(`  ✓ Created: ${outputFile}`);
}

function main() {
  console.log("====================================");
  console.log(" Markdown → Microsoft Word Converter");
  console.log("====================================");

  checkDependencies();

  const files = fs
    .readdirSync(INPUT_DIR)
    .filter((file) => file.toLowerCase().endsWith(".md"));

  if (files.length === 0) {
    console.log("\nNo Markdown files found in:");
    console.log(INPUT_DIR);
    return;
  }

  console.log(`\nFound ${files.length} Markdown file(s).`);

  fs.emptyDirSync(TEMP_DIR);

  for (const file of files) {
    try {
      convertFile(file);
    } catch (error) {
      console.error(`\n✗ Failed to convert ${file}`);
      console.error(error.message);
    }
  }

  console.log("\n====================================");
  console.log("Conversion complete.");
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log("====================================\n");
}

main();
