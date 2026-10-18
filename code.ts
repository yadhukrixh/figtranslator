const ui = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 16px;
        font-family: Inter, sans-serif;
        font-size: 13px;
        color: #1e1e1e;
      }

      h3 {
        margin: 0 0 16px;
        font-size: 16px;
      }

      .label {
        margin-bottom: 6px;
        font-size: 11px;
        color: #666;
      }

      .text {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 6px;
        min-height: 40px;
        word-break: break-word;
        background: #fff;
      }

      .translation {
        margin-top: 16px;
      }

      .loading {
        color: #666;
      }

      .error {
        color: #d32f2f;
      }
    </style>
  </head>

  <body>
    <h3>FigTranslator</h3>

    <div class="label">Selected text</div>

    <div id="source" class="text">
      Select a text layer in Figma
    </div>

    <div class="translation">
      <div class="label">Translation</div>

      <div id="result" class="text">
        -
      </div>
    </div>

    <script>
      window.onmessage = (event) => {
        const message = event.data.pluginMessage;

        if (!message) {
          return;
        }

        // Selected text from Figma
        if (message.type === "selected-text") {
          document.getElementById("source").textContent =
            message.text;

          const resultElement =
            document.getElementById("result");

          resultElement.textContent = "Translating...";
          resultElement.className = "text loading";

          // Ask the plugin main thread to translate
          parent.postMessage(
            {
              pluginMessage: {
                type: "translate",
                text: message.text,
              },
            },
            "*"
          );
        }

        // Translation completed
        if (message.type === "translation-result") {
          const resultElement =
            document.getElementById("result");

          resultElement.textContent =
            message.text || "No translation found";

          resultElement.className = "text";
        }

        // Translation failed
        if (message.type === "translation-error") {
          const resultElement =
            document.getElementById("result");

          resultElement.textContent =
            "Translation failed: " + message.error;

          resultElement.className = "text error";
        }

        // Nothing selected
        if (message.type === "no-selection") {
          document.getElementById("source").textContent =
            "Select a text layer in Figma";

          document.getElementById("result").textContent =
            "-";
        }

        // Selected node isn't a text node
        if (message.type === "invalid-selection") {
          document.getElementById("source").textContent =
            "Selected layer is not a text layer";

          document.getElementById("result").textContent =
            "-";
        }
      };
    </script>
  </body>
</html>
`;

figma.showUI(ui, {
  width: 360,
  height: 300,
});

/**
 * Send the currently selected text node to the UI.
 */
function sendSelectionToUI() {
  const selection = figma.currentPage.selection;

  console.log("Selection count:", selection.length);

  if (selection.length !== 1) {
    figma.ui.postMessage({
      type: "no-selection",
    });

    return;
  }

  const node = selection[0];

  console.log("Selected node:", node);
  console.log("Selected node type:", node.type);

  if (node.type !== "TEXT") {
    figma.ui.postMessage({
      type: "invalid-selection",
    });

    return;
  }

  console.log("Selected text:", node.characters);

  figma.ui.postMessage({
    type: "selected-text",
    text: node.characters,
    nodeId: node.id,
  });
}

/**
 * Handle messages coming from the plugin UI.
 */
figma.ui.onmessage = async (message) => {
  if (message.type !== "translate") {
    return;
  }

  console.log("Translation requested:", message.text);

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single" +
      "?client=gtx" +
      "&sl=auto" +
      "&tl=en" +
      "&dt=t" +
      "&q=" +
      encodeURIComponent(message.text);

    console.log("Translation URL:", url);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Translation API returned ${response.status}`,
      );
    }

    const data = await response.json();

    console.log("Translation response:", data);

    const translatedText = data?.[0]
      ?.map((item: unknown[]) => item?.[0])
      .filter(Boolean)
      .join("");

    if (!translatedText) {
      throw new Error("No translation returned");
    }

    console.log("Translated text:", translatedText);

    figma.ui.postMessage({
      type: "translation-result",
      text: translatedText,
    });
  } catch (error) {
    console.error("Translation error:", error);

    figma.ui.postMessage({
      type: "translation-error",
      error:
        error instanceof Error
          ? error.message
          : String(error),
    });
  }
};

/**
 * Initial selection check.
 */
sendSelectionToUI();

/**
 * Listen for selection changes.
 */
figma.on("selectionchange", () => {
  sendSelectionToUI();
});