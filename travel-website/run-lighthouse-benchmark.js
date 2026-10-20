const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const BASE_URL = "http://localhost:3000";
const RUNS = 5;

const OUTPUT_DIR = path.resolve("reports/lighthouse");

const variants = [
  {
    name: "blocking",
    route: "/benchmark/blocking",
  },
  {
    name: "streaming",
    route: "/benchmark/streaming",
  },
];

// Chỉ chạy Mobile
const devices = [
  {
    name: "mobile",
    preset: null,
    formFactor: "mobile",
  },
];

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function runLighthouse(device, variant, runNumber) {
  const url = `${BASE_URL}${variant.route}`;

  const filename =
    `${device.name}-${variant.name}-${String(runNumber).padStart(2, "0")}.html`;

  const outputPath = path.join(OUTPUT_DIR, filename);

  const args = [
    "lighthouse",
    url,
    ...(device.preset ? [`--preset=${device.preset}`] : []),
    `--form-factor=${device.formFactor}`,
    "--throttling-method=devtools",
    "--throttling.cpuSlowdownMultiplier=4",
    "--throttling.rttMs=150",
    "--throttling.throughputKbps=1600",
    "--output=html",
    `--output-path=${outputPath}`,
  ];

  console.log("\n========================================");
  console.log(`Device: ${device.name}`);
  console.log(`Version: ${variant.name}`);
  console.log(`Run: ${runNumber}/${RUNS}`);
  console.log(`URL: ${url}`);
  console.log(`Output: ${outputPath}`);
  console.log("========================================\n");

  const result = spawnSync("npx", args, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error("Không chạy được Lighthouse:", result.error.message);
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`Lighthouse thất bại: ${filename}`);
    process.exit(result.status || 1);
  }

  console.log(`Đã lưu: ${filename}`);
}

async function main() {
  for (const device of devices) {
    for (let run = 1; run <= RUNS; run++) {
      // Đảo thứ tự giữa các lần chạy để giảm ảnh hưởng do thứ tự đo.
      const order =
        run % 2 === 1
          ? variants
          : [...variants].reverse();

      for (const variant of order) {
        runLighthouse(device, variant, run);
      }
    }
  }

  console.log("\nHOÀN TẤT!");
  console.log(`Các báo cáo nằm tại: ${OUTPUT_DIR}`);
  console.log("Tổng số báo cáo dự kiến: 10 file HTML.");
}

main();