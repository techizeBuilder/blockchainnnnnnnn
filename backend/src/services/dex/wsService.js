const WebSocket = require("ws");

function subscribeToPairPrices(pairAddresses = []) {
  const ws = new WebSocket("wss://io.dexscreener.com/dex/screener/pairs/v1");

  ws.on("open", () => {
    console.log("✅ Connected to DexScreener WS");

    ws.send(
      JSON.stringify({
        type: "subscribe",
        pairs: pairAddresses,
      })
    );
  });

  ws.on("message", (data) => {
    try {
      const message = JSON.parse(data.toString());

      if (message.type === "update") {
        console.log("📈 Live update:", message.data);
      } else {
        console.log("ℹ️ Other message:", message);
      }
    } catch (err) {
      console.error("❌ Failed to parse WS message:", err.message);
    }
  });

  ws.on("error", (err) => console.error("❌ WS error:", err.message));
  ws.on("close", () => console.log("⚡ WS closed"));
}

module.exports = { subscribeToPairPrices };
