export const extractJsonData = (originalJson) => {
  const segments = [];
  let counter = 1;

  const traverse = (node) => {
    if (Array.isArray(node)) {
      node.forEach((item) => traverse(item));
    } else if (typeof node === "object" && node !== null) {
      Object.values(node).forEach((value) => traverse(value));
    } else if (typeof node === "string" || typeof node === "number") {
      segments.push({
        id: `seg_${counter++}`,
        sourceText: String(node),
        targetText: "",
        status: "untranslated",
      });
    }
  };

  traverse(originalJson);
  return segments;
};

export const rebuildJson = (originalJson, segments) => {
  let currentIndex = 0;
  const clonedJson = JSON.parse(JSON.stringify(originalJson));

  const traverseAndReplace = (node) => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        if (typeof item === "object" && item !== null) {
          traverseAndReplace(item);
        } else if (typeof item === "string" || typeof item === "number") {
          const seg = segments[currentIndex++];
          node[index] = seg && seg.targetText ? seg.targetText : node[index];
        }
      });
    } else if (typeof node === "object" && node !== null) {
      Object.keys(node).forEach((key) => {
        if (typeof node[key] === "object" && node[key] !== null) {
          traverseAndReplace(node[key]);
        } else if (
          typeof node[key] === "string" ||
          typeof node[key] === "number"
        ) {
          const seg = segments[currentIndex++];
          node[key] = seg && seg.targetText ? seg.targetText : node[key];
        }
      });
    }
  };

  traverseAndReplace(clonedJson);
  return clonedJson;
};
