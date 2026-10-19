"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Dropcursor } from "@tiptap/extension-dropcursor";
import { useEffect, useRef, useState } from "react";
import {
  FiBold,
  FiItalic,
  FiList,
  FiLink,
  FiCode,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiAlignJustify,
  FiImage,
  FiTable,
  FiType,
  FiTrash2,
  FiArrowDown,
  FiArrowRight,
  FiMinus,
  FiMaximize2,
  FiMinimize2,
  FiMove,
} from "react-icons/fi";
import {
  MdFormatQuote,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdHorizontalRule,
  MdUndo,
  MdRedo,
} from "react-icons/md";
import { debounce } from "lodash";

// Custom Image extension WITHOUT float - text will NOT wrap around image
const BlockImage = Image.extend({
  name: "blockImage",

  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      // We'll handle everything through CSS
      width: {
        default: "auto",
        parseHTML: (element) => {
          const width = element.getAttribute("width") || element.style.width;
          return width ? width.replace("px", "") : "auto";
        },
        renderHTML: (attributes) => {
          // We don't set width/height attributes, let CSS handle it
          return {};
        },
      },
      align: {
        default: "block",
        parseHTML: (element) => element.getAttribute("data-align") || "block",
        renderHTML: (attributes) => {
          const align = attributes.align || "block";
          return {
            "data-align": align,
            class: `editor-image ${align}-aligned`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setBlockImage:
        (options) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
      setImageAlign:
        (align) =>
        ({ commands }) => {
          return commands.updateAttributes("blockImage", { align });
        },
      setImageWidth:
        (width) =>
        ({ commands }) => {
          return commands.updateAttributes("blockImage", { width });
        },
      setImageHeight:
        (height) =>
        ({ commands }) => {
          return commands.updateAttributes("blockImage", { height });
        },
    };
  },

  // Make image a block node (not inline)
  inline: false,
  group: "block",
});

// Custom Table Cell
const WorkingTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (attributes.style) {
            return { style: attributes.style };
          }
          return {};
        },
      },
    };
  },
});

const WorkingTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (attributes.style) {
            return { style: attributes.style };
          }
          return {};
        },
      },
    };
  },
});

// Simple Background Color extension - FIXED VERSION
const BackgroundColor = TextStyle.extend({
  name: "backgroundColor",

  addAttributes() {
    return {
      ...this.parent?.(),
      backgroundColor: {
        default: null,
        parseHTML: (element) => element.style.backgroundColor,
        renderHTML: (attributes) => {
          if (!attributes.backgroundColor) {
            return {};
          }
          return {
            style: `background-color: ${attributes.backgroundColor}`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setBackgroundColor:
        (backgroundColor) =>
        ({ chain }) => {
          return chain().setMark(this.name, { backgroundColor }).run();
        },
      unsetBackgroundColor:
        () =>
        ({ chain }) => {
          return chain()
            .setMark(this.name, { backgroundColor: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// Simple Font Size extension - FIXED VERSION
const FontSize = TextStyle.extend({
  name: "fontSize",

  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => {
          const fontSize = element.style.fontSize;
          if (fontSize) {
            // Convert px to pt if needed
            if (fontSize.includes("px")) {
              const pxValue = parseFloat(fontSize);
              return `${Math.round(pxValue * 0.75)}pt`; // 1px ≈ 0.75pt
            }
            return fontSize;
          }
          return null;
        },
        renderHTML: (attributes) => {
          if (!attributes.fontSize) {
            return {};
          }
          // Ensure value is in pt
          let fontSizeValue = attributes.fontSize;
          if (fontSizeValue.includes("px")) {
            const pxValue = parseFloat(fontSizeValue);
            fontSizeValue = `${Math.round(pxValue * 0.75)}pt`;
          }
          return {
            style: `font-size: ${fontSizeValue}`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setFontSize:
        (fontSize) =>
        ({ chain }) => {
          // Convert px to pt if provided in px
          let fontSizeValue = fontSize;
          if (fontSizeValue.includes("px")) {
            const pxValue = parseFloat(fontSizeValue);
            fontSizeValue = `${Math.round(pxValue * 0.75)}pt`;
          }
          return chain().setMark(this.name, { fontSize: fontSizeValue }).run();
        },
      unsetFontSize:
        () =>
        ({ chain }) => {
          return chain()
            .setMark(this.name, { fontSize: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// Simple Font Family extension - FIXED VERSION
const FontFamily = TextStyle.extend({
  name: "fontFamily",

  addAttributes() {
    return {
      ...this.parent?.(),
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily,
        renderHTML: (attributes) => {
          if (!attributes.fontFamily) {
            return {};
          }
          return {
            style: `font-family: ${attributes.fontFamily}`,
          };
        },
      },
    };
  },

  addCommands() {
    return {
      setFontFamily:
        (fontFamily) =>
        ({ chain }) => {
          return chain().setMark(this.name, { fontFamily }).run();
        },
      unsetFontFamily:
        () =>
        ({ chain }) => {
          return chain()
            .setMark(this.name, { fontFamily: null })
            .removeEmptyTextStyle()
            .run();
        },
    };
  },
});

// Function to clean Word/Google Docs HTML while preserving formatting
// Function to clean Word/Google Docs HTML while preserving formatting
// FIXED VERSION: Function to clean Word/Google Docs HTML
const cleanWordHTML = (html) => {
  if (!html) return "";

  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // 1. Remove all <br> tags - এইগুলোই extra spacing এর কারণ
  const removeExcessiveLineBreaks = (element) => {
    const allElements = element.querySelectorAll("*");

    allElements.forEach((el) => {
      // Check for multiple consecutive <br> tags
      const childNodes = Array.from(el.childNodes);
      let brCount = 0;
      let lastBrIndex = -1;

      childNodes.forEach((child, index) => {
        if (child.nodeType === Node.ELEMENT_NODE && child.tagName === "BR") {
          brCount++;
          lastBrIndex = index;

          // Keep only the first <br> in a sequence, remove the rest
          if (brCount > 1) {
            child.remove();
          }
        } else if (child.nodeType === Node.TEXT_NODE) {
          // Reset BR count when we hit text
          brCount = 0;
        }
      });

      // Also clean up text nodes with multiple newlines
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      const textNodes = [];
      let node;
      while ((node = walker.nextNode())) {
        textNodes.push(node);
      }

      textNodes.forEach((textNode) => {
        let text = textNode.textContent;
        // Replace multiple newlines with single newline
        text = text.replace(/\n{2,}/g, "\n");
        textNode.textContent = text;
      });
    });

    // Remove empty paragraphs
    const paragraphs = element.querySelectorAll("p, div");
    paragraphs.forEach((p) => {
      // Check if paragraph is empty or only contains whitespace/BR
      const children = Array.from(p.childNodes);
      const hasOnlyBr =
        children.length === 1 &&
        children[0].nodeType === Node.ELEMENT_NODE &&
        children[0].tagName === "BR";

      const hasOnlyWhitespace = p.textContent.trim() === "";

      if (hasOnlyBr || hasOnlyWhitespace) {
        p.remove();
      }
    });
  };

  removeExcessiveLineBreaks(tempDiv);

  // 2. Combine short consecutive paragraphs into one
  const combineShortParagraphs = (element) => {
    const paragraphs = Array.from(element.querySelectorAll("p, div.MsoNormal"));

    for (let i = 0; i < paragraphs.length - 1; i++) {
      const current = paragraphs[i];
      const next = paragraphs[i + 1];

      if (!current || !next) continue;

      const currentText = current.textContent.trim();
      const nextText = next.textContent.trim();

      // If current paragraph doesn't end with sentence-ending punctuation
      // and next paragraph is short, combine them
      const endsWithPunctuation = /[.!?:]$/.test(currentText);
      const nextIsShort = nextText.length < 100;
      const nextStartsWithLowercase = /^[a-z]/.test(nextText);

      if (!endsWithPunctuation && (nextIsShort || nextStartsWithLowercase)) {
        // Add a space and the next paragraph's content
        if (current.innerHTML.endsWith("</span>")) {
          // If ends with a span, add space before the closing tag
          current.innerHTML =
            current.innerHTML.replace(/<\/span>$/, " </span>") + next.innerHTML;
        } else {
          current.innerHTML += " " + next.innerHTML;
        }
        next.remove();
      }
    }
  };

  combineShortParagraphs(tempDiv);

  // 3. Preserve basic formatting
  const preserveFormatting = (element) => {
    // Keep bold, italic, underline
    const boldElements = element.querySelectorAll("strong, b");
    boldElements.forEach((el) => {
      if (!el.hasAttribute("style")) {
        el.style.fontWeight = "bold";
      }
    });

    const italicElements = element.querySelectorAll("em, i");
    italicElements.forEach((el) => {
      if (!el.hasAttribute("style")) {
        el.style.fontStyle = "italic";
      }
    });

    const underlineElements = element.querySelectorAll("u");
    underlineElements.forEach((el) => {
      if (!el.hasAttribute("style")) {
        el.style.textDecoration = "underline";
      }
    });

    // Remove Word-specific classes
    const elementsWithClass = element.querySelectorAll("[class]");
    elementsWithClass.forEach((el) => {
      const classes = Array.from(el.classList);
      if (classes.some((cls) => cls.startsWith("Mso"))) {
        el.removeAttribute("class");
      }
    });
  };

  preserveFormatting(tempDiv);

  return tempDiv.innerHTML;
};

// Function to detect if HTML is from Word
const isFromWord = (html) => {
  return (
    html.includes('xmlns:o="urn:schemas-microsoft-com') ||
    html.includes('xmlns:w="urn:schemas-microsoft-com') ||
    html.includes('class="Mso') ||
    html.includes("mso-") ||
    html.includes("MsoNormal")
  );
};

// Better paste handler for Word/Docs content
const handleWordPaste = (view, html, text) => {
  try {
    // Clean the Word HTML
    const cleanedHTML = cleanWordHTML(html);

    // Create a temporary element to hold the cleaned HTML
    const temp = document.createElement("div");
    temp.innerHTML = cleanedHTML;

    // Convert to TipTap format
    const convertToTipTapFormat = (element) => {
      let result = "";

      const walk = (node, depth = 0) => {
        if (node.nodeType === Node.TEXT_NODE) {
          result += node.textContent;
          return;
        }

        if (node.nodeType === Node.ELEMENT_NODE) {
          const tagName = node.tagName.toLowerCase();

          switch (tagName) {
            case "p":
              if (depth === 0) result += "\n";
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              result += "\n";
              break;

            case "br":
              result += "\n";
              break;

            case "h1":
            case "h2":
            case "h3":
            case "h4":
            case "h5":
            case "h6":
              result += "\n";
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              result += "\n";
              break;

            case "ul":
            case "ol":
              // Don't add extra newlines for lists - let list items handle it
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              break;

            case "li":
              if (
                node.parentNode &&
                node.parentNode.tagName.toLowerCase() === "ol"
              ) {
                // For ordered lists, TipTap will handle numbering
                result += "\n";
                Array.from(node.childNodes).forEach((child) =>
                  walk(child, depth + 1),
                );
              } else {
                // For unordered lists
                result += "\n";
                Array.from(node.childNodes).forEach((child) =>
                  walk(child, depth + 1),
                );
              }
              break;

            case "strong":
            case "b":
              // Bold will be applied by TipTap
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              break;

            case "em":
            case "i":
              // Italic will be applied by TipTap
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              break;

            case "u":
              // Underline will be applied by TipTap
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              break;

            default:
              Array.from(node.childNodes).forEach((child) =>
                walk(child, depth + 1),
              );
              break;
          }
        }
      };

      walk(element);
      return result;
    };

    const convertedText = convertToTipTapFormat(temp);

    // Insert the text
    const { state, dispatch } = view;
    const { from, to } = state.selection;

    // First insert the plain text
    dispatch(state.tr.insertText(convertedText, from, to));

    // Now apply formatting
    const editor = view.state.doc;
    const textContent = convertedText;

    // Apply lists if detected
    if (temp.querySelector("ol")) {
      // Select the inserted text and make it an ordered list
      const endPos = from + convertedText.length;
      const selection = state.selection.constructor.create(
        state.doc,
        from,
        endPos,
      );
      view.dispatch(state.tr.setSelection(selection));
      view.dispatch(
        state.tr.setBlockType(from, endPos, state.schema.nodes.orderedList),
      );
    }

    if (temp.querySelector("ul")) {
      // Select the inserted text and make it a bullet list
      const endPos = from + convertedText.length;
      const selection = state.selection.constructor.create(
        state.doc,
        from,
        endPos,
      );
      view.dispatch(state.tr.setSelection(selection));
      view.dispatch(
        state.tr.setBlockType(from, endPos, state.schema.nodes.bulletList),
      );
    }

    return true;
  } catch (error) {
    console.error("Word paste error:", error);
    return false;
  }
};

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  defaultHeight = "800px",
  minHeight = "600px",
  maxHeight = "800px",
}) {
  const fileInputRef = useRef(null);
  const [mediaUploading, setMediaUploading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#ffffff");
  const [selectedImage, setSelectedImage] = useState(null);

  const [editorHeight, setEditorHeight] = useState(defaultHeight);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  // State for text properties
  const [selectedTextProperties, setSelectedTextProperties] = useState({
    fontSize: null,
    fontFamily: null,
    color: null,
    backgroundColor: null,
    bold: false,
    italic: false,
    underline: false,
    align: "left",
    headingLevel: null,
  });

  // Debounced onChange handler
  const debouncedOnChange = useRef(
    debounce((content) => {
      if (onChange) onChange(content);
    }, 300),
  );

  useEffect(() => {
    setIsMounted(true);

    // Cleanup function
    return () => {
      debouncedOnChange.current.cancel();
    };
  }, []);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: true,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: true,
        },
        history: true,
      }),
      TextStyle,
      Color, // Color extension for text color
      Underline,
      BackgroundColor, // Custom extension for background color
      FontSize, // Custom extension for font size
      FontFamily, // Custom extension for font family
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-green-600 hover:underline",
        },
      }),
      BlockImage.configure({
        inline: false,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full h-auto cursor-move",
          draggable: "true",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-300 w-full my-4",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: "border border-gray-300",
        },
      }),
      WorkingTableCell.configure({
        HTMLAttributes: {
          class: "border border-gray-300 px-4 py-2 align-top min-w-[100px]",
        },
      }),
      WorkingTableHeader.configure({
        HTMLAttributes: {
          class:
            "border border-gray-300 bg-gray-50 px-4 py-2 font-semibold align-top",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
      }),
      Placeholder.configure({
        placeholder: placeholder || "Start writing or paste from Word/Docs...",
      }),
      Dropcursor.configure({
        width: 2,
        color: "#3b82f6",
      }),
    ],
    content: value || "",
    onUpdate: ({ editor: e }) => {
      debouncedOnChange.current(e.getHTML());
    },
    onSelectionUpdate: ({ editor: e }) => {
      const { from, to } = e.state.selection;

      // Check if an image is within the selection
      let imageFound = false;
      e.state.doc.nodesBetween(from, to, (node, pos) => {
        if (node.type.name === "blockImage") {
          setSelectedImage(node);
          setShowImageMenu(true);
          imageFound = true;
          return false; // Stop searching
        }
      });

      if (!imageFound) {
        setSelectedImage(null);
        setShowImageMenu(false);
      }

      // Update text properties based on selection
      updateTextProperties(e);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none px-6 py-5 focus:outline-none focus:ring-0 h-full",
        spellcheck: "true",
      },
      handlePaste: (view, event) => {
        const html = event.clipboardData?.getData("text/html");
        const text = event.clipboardData?.getData("text/plain");

        if (html && isFromWord(html)) {
          event.preventDefault();

          try {
            // Clean the HTML
            const cleanedHTML = cleanWordHTML(html);

            // Create temporary div to process
            const temp = document.createElement("div");
            temp.innerHTML = cleanedHTML;

            // Convert to plain text with SINGLE line breaks
            const convertToSingleSpacedText = (element) => {
              let result = "";

              const processNode = (node, isInParagraph = false) => {
                if (node.nodeType === Node.TEXT_NODE) {
                  let text = node.textContent;

                  // Replace multiple newlines with single newline
                  text = text.replace(/\n{2,}/g, "\n");

                  // If we're in a paragraph and text starts with newline, remove it
                  if (isInParagraph && text.startsWith("\n")) {
                    text = text.substring(1);
                  }

                  result += text;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                  const tagName = node.tagName.toLowerCase();

                  if (tagName === "p" || tagName === "div") {
                    // Start of new paragraph
                    if (result && !result.endsWith("\n\n")) {
                      result += "\n";
                    }

                    // Process children as part of this paragraph
                    Array.from(node.childNodes).forEach((child) =>
                      processNode(child, true),
                    );

                    // End paragraph with single newline
                    if (!result.endsWith("\n")) {
                      result += "\n";
                    }
                  } else if (tagName === "br") {
                    // Single line break (not paragraph break)
                    if (!result.endsWith("\n")) {
                      result += "\n";
                    }
                  } else if (
                    ["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)
                  ) {
                    // Headings - treat as paragraphs
                    if (result && !result.endsWith("\n\n")) {
                      result += "\n";
                    }

                    Array.from(node.childNodes).forEach((child) =>
                      processNode(child, true),
                    );

                    result += "\n";
                  } else {
                    // Inline elements - process normally
                    Array.from(node.childNodes).forEach((child) =>
                      processNode(child, isInParagraph),
                    );
                  }
                }
              };

              Array.from(element.childNodes).forEach((node) =>
                processNode(node, false),
              );
              return result;
            };

            let plainText = convertToSingleSpacedText(temp);

            // Final cleanup: ensure maximum of 2 consecutive newlines
            plainText = plainText.replace(/\n{3,}/g, "\n\n");

            // Trim and ensure it ends with single newline
            plainText = plainText.trim() + (plainText ? "\n" : "");

            // Insert the text
            const { state, dispatch } = view;
            const { from, to } = state.selection;

            dispatch(state.tr.insertText(plainText, from, to));

            return true;
          } catch (error) {
            console.error("Word paste error:", error);
            // Fallback to plain text with cleanup
            if (text) {
              let cleanedText = text.replace(/\n{3,}/g, "\n\n");
              const { state, dispatch } = view;
              const { from, to } = state.selection;
              dispatch(state.tr.insertText(cleanedText, from, to));
              return true;
            }
          }
        }

        // For non-Word content, let TipTap handle it
        return false;
      },
      handleDrop: (view, event, slice, moved) => {
        event.preventDefault();

        const files = event.dataTransfer?.files;
        if (files && files.length > 0) {
          const file = files[0];
          if (file.type.startsWith("image/")) {
            handleImageUpload(file);
            return;
          }
        }

        // Handle image dragging within editor
        const coordinates = view.posAtCoords({
          left: event.clientX,
          top: event.clientY,
        });
        if (coordinates) {
          view.dispatch(view.state.tr.insert(coordinates.pos, slice));
        }
      },
    },
  });

  // Function to update text properties based on current selection
  const updateTextProperties = (editorInstance) => {
    if (!editorInstance) return;

    const newProperties = {
      fontSize: null,
      fontFamily: null,
      color: null,
      backgroundColor: null,
      bold: editorInstance.isActive("bold"),
      italic: editorInstance.isActive("italic"),
      underline: editorInstance.isActive("underline"),
      align: "left",
      headingLevel: null,
    };

    // Check for text alignment
    if (editorInstance.isActive({ textAlign: "center" })) {
      newProperties.align = "center";
    } else if (editorInstance.isActive({ textAlign: "right" })) {
      newProperties.align = "right";
    } else if (editorInstance.isActive({ textAlign: "justify" })) {
      newProperties.align = "justify";
    }

    // Check for heading level
    for (let i = 1; i <= 6; i++) {
      if (editorInstance.isActive("heading", { level: i })) {
        newProperties.headingLevel = i;
        break;
      }
    }

    // Get color from Color extension
    const colorAttrs = editorInstance.getAttributes("textStyle");
    if (colorAttrs && colorAttrs.color) {
      newProperties.color = colorAttrs.color;
    }

    // Get background color from our custom extension
    const bgColorAttrs = editorInstance.getAttributes("backgroundColor");
    if (bgColorAttrs && bgColorAttrs.backgroundColor) {
      newProperties.backgroundColor = bgColorAttrs.backgroundColor;
    }

    // Get font size from our custom extension
    const fontSizeAttrs = editorInstance.getAttributes("fontSize");
    if (fontSizeAttrs && fontSizeAttrs.fontSize) {
      newProperties.fontSize = fontSizeAttrs.fontSize;
    }

    // Get font family from our custom extension
    const fontFamilyAttrs = editorInstance.getAttributes("fontFamily");
    if (fontFamilyAttrs && fontFamilyAttrs.fontFamily) {
      newProperties.fontFamily = fontFamilyAttrs.fontFamily;
    }

    setSelectedTextProperties(newProperties);
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e) => {
      // editor এখনও initialize না হলে return
      if (!editor || !containerRef.current?.contains(e.target)) return;

      if ((e.ctrlKey || e.metaKey) && !e.altKey) {
        switch (e.key.toLowerCase()) {
          case "b":
            e.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case "i":
            e.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case "u":
            e.preventDefault();
            editor.chain().focus().toggleUnderline().run();
            break;
          case "z":
            e.preventDefault();
            if (e.shiftKey) {
              editor.chain().focus().redo().run();
            } else {
              editor.chain().focus().undo().run();
            }
            break;
          case "y":
            e.preventDefault();
            editor.chain().focus().redo().run();
            break;
          case "k":
            e.preventDefault();
            const url = window.prompt("Enter URL:");
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
            break;
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isMounted, editor]);

  // Improved Resize functionality
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing || !containerRef.current) return;

      e.preventDefault();

      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate new height from the top of the container
      const newHeight = e.clientY - containerRect.top;

      // Apply constraints
      const minHeightPx = parseInt(minHeight);
      const maxHeightPx = parseInt(maxHeight);

      if (newHeight >= minHeightPx && newHeight <= maxHeightPx) {
        setEditorHeight(`${newHeight}px`);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "nwse-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, minHeight, maxHeight]);

  // Image upload function - স্থানীয়ভাবে image লোড করার জন্য (সার্ভার ছাড়া)
  const handleImageUpload = async (file) => {
    if (!editor) return;

    setMediaUploading(true);

    try {
      // FileReader ব্যবহার করে image পড়বো
      const reader = new FileReader();

      reader.onload = (e) => {
        // Get base64 data
        const base64Data = e.target?.result;

        if (base64Data) {
          // Insert image directly with base64
          editor
            .chain()
            .focus()
            .setBlockImage({
              src: base64Data,
              alt: file.name,
              title: file.name,
              align: "block",
              width: "100%",
            })
            .run();
        }

        setMediaUploading(false);
      };

      reader.onerror = () => {
        console.error("Failed to read file");
        setMediaUploading(false);
      };

      // Read file as data URL (base64)
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      setMediaUploading(false);
    }
  };

  // Image alignment functions
  const alignImageBlock = () => {
    if (!editor || !selectedImage) return;
    editor.chain().focus().setImageAlign("block").run();
  };

  const alignImageInlineLeft = () => {
    if (!editor || !selectedImage) return;
    editor.chain().focus().setImageAlign("inline-left").run();
  };

  const alignImageInlineRight = () => {
    if (!editor || !selectedImage) return;
    editor.chain().focus().setImageAlign("inline-right").run();
  };

  // Image resize functions
  const resizeImage = (width, height = null) => {
    if (!editor || !selectedImage) return;

    if (height) {
      editor
        .chain()
        .focus()
        .updateAttributes("blockImage", {
          width: width.toString(),
          height: height.toString(),
        })
        .run();
    } else {
      editor
        .chain()
        .focus()
        .updateAttributes("blockImage", { width: width.toString() })
        .run();
    }
  };

  const increaseImageSize = () => {
    if (!editor || !selectedImage) return;
    const currentWidth = parseInt(selectedImage.attrs.width) || 400;
    const newWidth = Math.min(currentWidth + 50, 1200);
    resizeImage(newWidth);
  };

  const decreaseImageSize = () => {
    if (!editor || !selectedImage) return;
    const currentWidth = parseInt(selectedImage.attrs.width) || 400;
    const newWidth = Math.max(currentWidth - 50, 100);
    resizeImage(newWidth);
  };

  const setImageSize = (size) => {
    if (!editor || !selectedImage) return;
    const sizes = {
      small: "200px",
      medium: "400px",
      large: "600px",
      full: "100%",
    };
    resizeImage(sizes[size]);
  };

  const deleteImage = () => {
    if (!editor || !selectedImage) return;
    editor.chain().focus().deleteSelection().run();
    setSelectedImage(null);
    setShowImageMenu(false);
  };

  // Table functions
  const insertTable = (rows = 3, cols = 3) => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows, cols, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  };

  const addColumnBefore = () => {
    if (!editor) return;
    editor.chain().focus().addColumnBefore().run();
  };

  const addColumnAfter = () => {
    if (!editor) return;
    editor.chain().focus().addColumnAfter().run();
  };

  const deleteColumn = () => {
    if (!editor) return;
    editor.chain().focus().deleteColumn().run();
  };

  const addRowBefore = () => {
    if (!editor) return;
    editor.chain().focus().addRowBefore().run();
  };

  const addRowAfter = () => {
    if (!editor) return;
    editor.chain().focus().addRowAfter().run();
  };

  const deleteRow = () => {
    if (!editor) return;
    editor.chain().focus().deleteRow().run();
  };

  const mergeCells = () => {
    if (!editor) return;
    editor.chain().focus().mergeCells().run();
  };

  const splitCell = () => {
    if (!editor) return;
    editor.chain().focus().splitCell().run();
  };

  const deleteTable = () => {
    if (!editor) return;
    editor.chain().focus().deleteTable().run();
  };

  // Cell background - improved version
  const setCellBackground = (color) => {
    if (!editor) return;

    const view = editor.view;
    const { state } = view;
    const { from } = state.selection;

    const $pos = state.doc.resolve(from);
    let cellPos = null;
    let cellNode = null;

    for (let i = $pos.depth; i > 0; i--) {
      const node = $pos.node(i);
      if (node.type.name === "tableCell" || node.type.name === "tableHeader") {
        cellNode = node;
        cellPos = $pos.before(i + 1); // Use before() for accurate position
        break;
      }
    }

    if (cellNode && cellPos !== null) {
      // Remove existing background styles
      const currentStyle = cellNode.attrs.style || "";
      const cleanedStyle = currentStyle.replace(
        /background-color:[^;]+;?/gi,
        "",
      );

      const newStyle =
        cleanedStyle + (color ? `background-color: ${color};` : "");
      const newAttrs = {
        ...cellNode.attrs,
        style: newStyle.trim(),
      };

      const tr = state.tr.setNodeMarkup(cellPos, null, newAttrs);
      view.dispatch(tr);
    } else {
      // For regular text, use our custom backgroundColor extension
      setHighlightColor(color);
    }
  };

  // Text color - using Color extension
  const setTextColor = (color) => {
    if (!editor) return;
    editor.chain().focus().setColor(color).run();
    setSelectedTextProperties((prev) => ({ ...prev, color }));
  };

  // Text highlight (background color) - FIXED VERSION
  const setHighlightColor = (color) => {
    if (!editor) return;

    // If color is null or undefined, remove the highlight
    if (!color) {
      editor.chain().focus().unsetBackgroundColor().run();
      setSelectedTextProperties((prev) => ({ ...prev, backgroundColor: null }));
    } else {
      // Set the highlight color
      editor.chain().focus().setBackgroundColor(color).run();
      setSelectedTextProperties((prev) => ({
        ...prev,
        backgroundColor: color,
      }));
    }
  };

  // Font size - using our custom extension
  const setFontSize = (size) => {
    if (!editor) return;
    editor.chain().focus().setFontSize(size).run();
    setSelectedTextProperties((prev) => ({ ...prev, fontSize: size }));
  };

  // Font family - using our custom extension
  const setFontFamily = (fontFamily) => {
    if (!editor) return;
    editor.chain().focus().setFontFamily(fontFamily).run();
    setSelectedTextProperties((prev) => ({ ...prev, fontFamily }));
  };

  // Text alignment
  const setTextAlignment = (alignment) => {
    if (!editor) return;
    editor.chain().focus().setTextAlign(alignment).run();
    setSelectedTextProperties((prev) => ({ ...prev, align: alignment }));
  };

  // Remove formatting
  const removeFormatting = () => {
    if (!editor) return;

    // Clear all marks including custom ones
    editor.chain().focus().clearNodes().unsetAllMarks().run();

    // Also explicitly remove custom marks
    editor
      .chain()
      .focus()
      .unsetBackgroundColor()
      .unsetFontSize()
      .unsetFontFamily()
      .run();

    setSelectedTextProperties({
      fontSize: null,
      fontFamily: null,
      color: null,
      backgroundColor: null,
      bold: false,
      italic: false,
      underline: false,
      align: "left",
      headingLevel: null,
    });
  };

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  // Add CSS for image styling
  useEffect(() => {
    if (isMounted) {
      const styleId = "tiptap-custom-styles";
      let style = document.getElementById(styleId);

      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          /* Table styling */
          .ProseMirror table {
            border-collapse: collapse;
            width: 100%;
            margin: 1rem 0;
          }
          .ProseMirror table td,
          .ProseMirror table th {
            border: 1px solid #d1d5db;
            padding: 0.5rem 0.75rem;
            position: relative;
          }
          .ProseMirror table th {
            background-color: #f3f4f6;
            font-weight: 600;
          }
          .ProseMirror table td[style*="background-color"],
          .ProseMirror table th[style*="background-color"] {
            background-color: inherit !important;
          }
          
          /* Image styling - BLOCK MODE (NO TEXT WRAPPING) */
          .ProseMirror img {
            max-width: 100%;
            height: auto;
            transition: all 0.2s ease;
            cursor: move;
            position: relative;
            display: block !important;
          }
            /* Add this at the end of your CSS */
.ProseMirror br {
  display: block;
  content: "";
  margin-bottom: 0;
}

/* For very tight spacing */
.ProseMirror p {
  min-height: 0.1em;
}

/* Remove all default spacing */
.ProseMirror * {
  margin-block-start: 0;
  margin-block-end: 0;
}

/* Only add spacing for specific cases */
.ProseMirror > * + * {
  margin-top: 0.25em !important;
}
          
          .ProseMirror img:hover {
            outline: 2px solid #3b82f6;
          }
          
          .ProseMirror img.selected {
            outline: 2px solid #3b82f6;
          }
          
          /* Block alignment - NO text wrapping, takes full width */
          .ProseMirror img[data-align="block"] {
            display: block !important;
            margin: 1.5rem auto !important;
            clear: both !important;
            float: none !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          
          /* If you want centered but smaller */
          .ProseMirror img[data-align="block"][style*="width"] {
            margin-left: auto !important;
            margin-right: auto !important;
            display: block !important;
          }
          
          /* Inline alignment options (if needed) */
          .ProseMirror img[data-align="inline-left"] {
            float: left !important;
            margin-right: 1rem !important;
            margin-bottom: 1rem !important;
            clear: none !important;
            max-width: 50% !important;
          }
          
          .ProseMirror img[data-align="inline-right"] {
            float: right !important;
            margin-left: 1rem !important;
            margin-bottom: 1rem !important;
            clear: none !important;
            max-width: 50% !important;
          }
          
          /* Clear floats to prevent text wrapping */
          .ProseMirror p, .ProseMirror h1, .ProseMirror h2, .ProseMirror h3, 
          .ProseMirror h4, .ProseMirror h5, .ProseMirror h6 {
            clear: both !important;
          }
          
          /* Ensure text doesn't wrap around images */
          .ProseMirror > * {
            overflow: hidden !important;
          }
          
          /* Image upload placeholder */
          .image-uploading-placeholder {
            background: #f3f4f6;
            border: 2px dashed #d1d5db;
            border-radius: 0.5rem;
            padding: 2rem;
            text-align: center;
            color: #6b7280;
            font-style: italic;
            margin: 1rem 0;
          }
          
          /* Improved Resize handle styling */
          .editor-resize-handle {
            position: absolute;
            bottom: 2px;
            right: 2px;
            width: 16px;
            height: 16px;
            cursor: nwse-resize;
            background: linear-gradient(135deg, transparent 50%, #3b82f6 50%);
            border-radius: 2px;
            opacity: 0.7;
            transition: opacity 0.2s, transform 0.2s;
            z-index: 50;
            border: 1px solid white;
          }
          
          .editor-resize-handle:hover {
            opacity: 1;
            transform: scale(1.1);
          }
          
          .editor-resize-handle.resizing {
            opacity: 1;
            background: linear-gradient(135deg, transparent 50%, #1d4ed8 50%);
            box-shadow: 0 0 0 1px #1d4ed8;
          }
          
          /* Editor height display */
          .editor-height-display {
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 11px;
            font-weight: 500;
            backdrop-filter: blur(4px);
            border: 1px solid white;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          }
          
          /* Make sure the resize handle container is clickable */
          .relative > .absolute {
            pointer-events: auto;
          }
          
          /* Better list styling for pasted content */
          .ProseMirror ol {
            list-style-type: decimal;
            padding-left: 1.5em;
            margin: 0.25em 0;
          }
          
          .ProseMirror ol > li {
            position: relative;
            margin: 0.1em 0;
          }
          
          .ProseMirror ul {
            list-style-type: disc;
            padding-left: 1.5em;
            margin: 0.25em 0;
          }
          
          .ProseMirror ul > li {
            position: relative;
            margin: 0.1em 0;
          }
          
          /* Preserve line breaks in lists */
          .ProseMirror li p {
            margin: 0;
            display: inline;
          }
          
          /* Paste handling styles - Better line spacing */
          .ProseMirror {
            line-height: 1.3 !important;
          }
             .ProseMirror br {
          display: block !important;
          content: "" !important;
          margin: 0 !important;
          padding: 0 !important;
          height: 0 !important;
          line-height: 0 !important;
        }
          
        
        /* Single line break spacing */
        .ProseMirror br + br {
          display: none !important;
        }
        
        /* When there's a line break followed by text */
        .ProseMirror p:has(> br) {
          margin-bottom: 0.5em !important;
        }
        
        /* Your existing styles... */
        /* Link styling - FIXED */
        .ProseMirror a {
          color: #2563eb !important; /* Blue color for links */
          text-decoration: underline !important;
          cursor: pointer;
        }

        .ProseMirror a:hover {
          color: #1d4ed8 !important;
          text-decoration: underline !important;
        }

        /* Ensure link color is not overridden by other styles */
        .ProseMirror a[style*="color"] {
          color: #2563eb !important;
        }

        /* Make sure text color doesn't affect links */
        .ProseMirror span[style*="color"] a {
          color: #2563eb !important;
        }

        /* When link is inside colored text */
        .ProseMirror a span {
          color: inherit !important;
        }
        /* Table styling */
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1rem 0;
        }
          
          .ProseMirror p {
            margin: 0 !important;
          padding: 0 !important;
          min-height: 0 !important;
          }
           .ProseMirror p + p {
          margin-top: 0 !important;
        }
          .ProseMirror h1, 
          .ProseMirror h2, 
          .ProseMirror h3, 
          .ProseMirror h4, 
          .ProseMirror h5, 
          .ProseMirror h6 {
            font-weight: bold;
            line-height: 1.15;
          }
          
          /* Heading border REMOVED - এখানে border-bottom লাইনগুলো remove করা হয়েছে */
          .ProseMirror h1 { 
            font-size: 2em; 
            padding-bottom: 0.3em;
          }
          .ProseMirror h2 { 
            font-size: 1.5em; 
            padding-bottom: 0.3em;
          }
          .ProseMirror h3 { font-size: 1.25em; }
          .ProseMirror h4 { font-size: 1.1em; }
          .ProseMirror h5 { font-size: 1em; }
          .ProseMirror h6 { font-size: 0.9em; color: #6b7280; }
          
          .ProseMirror blockquote {
            border-left: 4px solid #d1d5db;
            margin: 1em 0;
            padding-left: 1em;
            font-style: italic;
            color: #4b5563;
          }
          
          .ProseMirror code {
            background: #f3f4f6;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
          }
          
          .ProseMirror pre {
            background: #1f2937;
            color: #f3f4f6;
            padding: 1em;
            border-radius: 6px;
            overflow-x: auto;
            font-family: 'Courier New', monospace;
            margin: 1em 0;
          }
          
          /* Keep formatting from Word/Docs */
          .ProseMirror strong, .ProseMirror b {
            font-weight: 700;
          }
          
          .ProseMirror em, .ProseMirror i {
            font-style: italic;
          }
          
          .ProseMirror u {
            text-decoration: underline;
          }
          
          /* Preserve text alignment */
          .ProseMirror p[style*="text-align: center"] {
            text-align: center;
          }
          
          .ProseMirror p[style*="text-align: right"] {
            text-align: right;
          }
          
          .ProseMirror p[style*="text-align: justify"] {
            text-align: justify;
          }
          
          /* Better spacing for pasted content */
          .ProseMirror > *:first-child {
            margin-top: 0;
          }
          
          .ProseMirror > *:last-child {
            margin-bottom: 0;
          }
          
          /* Selection styling */
          .ProseMirror .selected {
            background-color: rgba(59, 130, 246, 0.1);
          }
          
          /* Custom text styles */
          .ProseMirror span[style*="font-size"] {
            display: inline;
          }
          
          .ProseMirror span[style*="background-color"] {
            display: inline;
            padding: 0 0.1em;
            border-radius: 0.2em;
          }
          
          .ProseMirror span[style*="color"] {
            display: inline;
          }
          
          .ProseMirror span[style*="font-family"] {
            display: inline;
          }
          
          /* Keyboard shortcut hints */
          .toolbar-button {
            position: relative;
          }
          
          .toolbar-button:hover::after {
            content: attr(data-shortcut);
            position: absolute;
            bottom: -25px;
            left: 50%;
            transform: translateX(-50%);
            background: #1f2937;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
            white-space: nowrap;
            z-index: 1000;
          }
          
          /* Text property indicators */
          .text-property-indicator {
            background: #f3f4f6;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 12px;
            color: #4b5563;
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .property-active {
            background: #3b82f6 !important;
            color: white !important;
            border-color: #2563eb !important;
          }
          
          /* Clear formatting button */
          .clear-format-btn {
            background: #ef4444;
            color: white;
            border-radius: 4px;
            padding: 2px 8px;
            font-size: 11px;
            font-weight: 500;
            border: none;
            cursor: pointer;
          }
          
          .clear-format-btn:hover {
            background: #dc2626;
          }
        `;
        document.head.appendChild(style);
      }

      return () => {
        const existingStyle = document.getElementById(styleId);
        if (existingStyle && document.head.contains(existingStyle)) {
          document.head.removeChild(existingStyle);
        }
      };
    }
  }, [isMounted]);

  if (!isMounted) {
    return (
      <div
        className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
        style={{ height: defaultHeight }}
      >
        <div className="h-12 bg-gray-50 border-b border-gray-300"></div>
        <div className="px-6 py-5 prose prose-lg h-[calc(100%-3rem)] overflow-auto">
          <p className="text-gray-400">Loading editor...</p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return (
      <div
        className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm"
        style={{ height: defaultHeight }}
      >
        <div className="h-12 bg-gray-50 border-b border-gray-300"></div>
        <div className="px-6 py-5 prose prose-lg h-[calc(100%-3rem)] overflow-auto">
          <p className="text-gray-500">Initializing editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm relative"
      style={{
        height: editorHeight,
        minHeight: minHeight,
        maxHeight: maxHeight,
        resize: "none",
        overflow: "hidden",
      }}
    >
      {/* Fixed Toolbar */}
      <div className="flex flex-col border-b border-gray-300 sticky top-0 z-10 bg-white">
        {/* First Row - Basic formatting and text properties */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-200 toolbar-button"
            title="Undo (Ctrl+Z)"
            data-shortcut="Ctrl+Z"
          >
            <MdUndo />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-200 toolbar-button"
            title="Redo (Ctrl+Y)"
            data-shortcut="Ctrl+Y"
          >
            <MdRedo />
          </button>

          <button
            type="button"
            onClick={removeFormatting}
            className="p-2 rounded hover:bg-gray-200 text-xs font-medium"
            title="Clear All Formatting"
          >
            Clear
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Heading selector */}
          <select
            onChange={(e) => {
              const value = e.target.value;
              if (value === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({ level: parseInt(value) })
                  .run();
              }
              setSelectedTextProperties((prev) => ({
                ...prev,
                headingLevel: value === "paragraph" ? null : parseInt(value),
              }));
            }}
            value={selectedTextProperties.headingLevel || "paragraph"}
            className="px-3 py-1.5 border border-gray-300 rounded text-sm bg-white"
          >
            <option value="paragraph">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
            <option value="4">Heading 4</option>
            <option value="5">Heading 5</option>
            <option value="6">Heading 6</option>
          </select>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Text formatting buttons - will show active state */}
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleBold().run();
              setSelectedTextProperties((prev) => ({
                ...prev,
                bold: !prev.bold,
              }));
            }}
            className={`p-2 rounded hover:bg-gray-200 toolbar-button ${
              selectedTextProperties.bold ? "bg-green-100 text-green-700" : ""
            }`}
            title="Bold (Ctrl+B)"
            data-shortcut="Ctrl+B"
          >
            <FiBold />
          </button>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleItalic().run();
              setSelectedTextProperties((prev) => ({
                ...prev,
                italic: !prev.italic,
              }));
            }}
            className={`p-2 rounded hover:bg-gray-200 toolbar-button ${
              selectedTextProperties.italic ? "bg-green-100 text-green-700" : ""
            }`}
            title="Italic (Ctrl+I)"
            data-shortcut="Ctrl+I"
          >
            <FiItalic />
          </button>
          <button
            type="button"
            onClick={() => {
              editor.chain().focus().toggleUnderline().run();
              setSelectedTextProperties((prev) => ({
                ...prev,
                underline: !prev.underline,
              }));
            }}
            className={`p-2 rounded hover:bg-gray-200 toolbar-button ${
              selectedTextProperties.underline
                ? "bg-green-100 text-green-700"
                : ""
            }`}
            title="Underline (Ctrl+U)"
            data-shortcut="Ctrl+U"
          >
            <FiUnderline />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Text alignment - will show active state */}
          <button
            type="button"
            onClick={() => setTextAlignment("left")}
            className={`p-2 rounded hover:bg-gray-200 ${
              selectedTextProperties.align === "left"
                ? "bg-green-100 text-green-700"
                : ""
            }`}
            title="Align Left"
          >
            <FiAlignLeft />
          </button>
          <button
            type="button"
            onClick={() => setTextAlignment("center")}
            className={`p-2 rounded hover:bg-gray-200 ${
              selectedTextProperties.align === "center"
                ? "bg-green-100 text-green-700"
                : ""
            }`}
            title="Align Center"
          >
            <FiAlignCenter />
          </button>
          <button
            type="button"
            onClick={() => setTextAlignment("right")}
            className={`p-2 rounded hover:bg-gray-200 ${
              selectedTextProperties.align === "right"
                ? "bg-green-100 text-green-700"
                : ""
            }`}
            title="Align Right"
          >
            <FiAlignRight />
          </button>
          <button
            type="button"
            onClick={() => setTextAlignment("justify")}
            className={`p-2 rounded hover:bg-gray-200 ${
              selectedTextProperties.align === "justify"
                ? "bg-green-100 text-green-700"
                : ""
            }`}
            title="Justify"
          >
            <FiAlignJustify />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Lists */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("bulletList") ? "bg-green-100 text-green-700" : ""
            }`}
            title="Bullet List"
          >
            <MdFormatListBulleted />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("orderedList")
                ? "bg-green-100 text-green-700"
                : ""
            }`}
            title="Numbered List"
          >
            <MdFormatListNumbered />
          </button>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Other formatting */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("blockquote") ? "bg-green-100 text-green-700" : ""
            }`}
            title="Blockquote"
          >
            <MdFormatQuote />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-200 ${
              editor.isActive("codeBlock") ? "bg-green-100 text-green-700" : ""
            }`}
            title="Code Block"
          >
            <FiCode />
          </button>
        </div>

        {/* Second Row - Advanced properties */}
        <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50">
          {/* Font size selector */}
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-gray-200 text-sm font-medium"
              title="Font Size"
            >
              {selectedTextProperties.fontSize
                ? selectedTextProperties.fontSize.replace("pt", "pt")
                : "Size"}
            </button>
            <div className="absolute hidden group-hover:flex flex-col gap-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 min-w-20">
              {[
                "9pt",
                "10pt",
                "11pt",
                "12pt",
                "14pt",
                "16pt",
                "18pt",
                "20pt",
                "22pt",
                "24pt",
                "26pt",
              ].map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setFontSize(size)}
                  className={`px-3 py-1 text-sm rounded hover:bg-gray-100 ${
                    selectedTextProperties.fontSize === size
                      ? "bg-green-100 text-green-700"
                      : ""
                  }`}
                  style={{ fontSize: size }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Font family selector */}
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-gray-200 text-sm"
              title="Font Family"
            >
              {selectedTextProperties.fontFamily
                ? selectedTextProperties.fontFamily
                    .split(",")[0]
                    .replace(/['"]/g, "")
                : "Font"}
            </button>
            <div className="absolute hidden group-hover:flex flex-col gap-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-48">
              {[
                "Arial, sans-serif",
                "Georgia, serif",
                "Times New Roman, serif",
                "Verdana, sans-serif",
                "Courier New, monospace",
                "Tahoma, sans-serif",
                "Trebuchet MS, sans-serif",
              ].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setFontFamily(font)}
                  className={`px-3 py-1 text-sm rounded hover:bg-gray-100 text-left ${
                    selectedTextProperties.fontFamily === font
                      ? "bg-green-100 text-green-700"
                      : ""
                  }`}
                  style={{ fontFamily: font }}
                >
                  {font.split(",")[0]}
                </button>
              ))}
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Text Color */}
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-gray-200 flex items-center gap-1"
              title="Text Color"
            >
              <FiType className="text-lg" />
              {selectedTextProperties.color && (
                <div
                  className="w-3 h-3 rounded border border-gray-300"
                  style={{ backgroundColor: selectedTextProperties.color }}
                />
              )}
            </button>
            <div className="absolute hidden group-hover:flex flex-wrap gap-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-48">
              {[
                "#000000",
                "#FFFFFF",
                "#FF0000",
                "#00FF00",
                "#0000FF",
                "#CCCCCC",
                "#FFFF00",
                "#FF00FF",
                "#00FFFF",
                "#FFA500",
                "#800080",
                "#008080",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setTextColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={selectedTextProperties.color || "#000000"}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer border border-gray-300"
              />
            </div>
          </div>

          {/* Text Highlight */}
          <div className="relative group">
            <button
              className="p-2 rounded hover:bg-gray-200 flex items-center gap-1"
              title="Text Highlight"
            >
              <div className="w-5 h-5 border border-gray-300 flex items-center justify-center">
                <div
                  className="w-4 h-4 rounded"
                  style={{
                    backgroundColor:
                      selectedTextProperties.backgroundColor || "transparent",
                  }}
                />
              </div>
            </button>
            <div className="absolute hidden group-hover:flex flex-wrap gap-1 p-2 bg-white border border-gray-300 rounded shadow-lg z-10 w-48">
              {[
                "#FFFFFF",
                "#FFFF00",
                "#FFCC00",
                "#FF9900",
                "#FF0000",
                "#FF6666",
                "#66FF66",
                "#6666FF",
                "#CCCCCC",
                "#FFCCCC",
                "#CCFFCC",
                "#CCCCFF",
              ].map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setHighlightColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110"
                  style={{ backgroundColor: color }}
                />
              ))}
              <input
                type="color"
                value={selectedTextProperties.backgroundColor || "#FFFF00"}
                onChange={(e) => setHighlightColor(e.target.value)}
                className="w-full h-8 rounded cursor-pointer border border-gray-300"
              />
            </div>
          </div>

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Link */}
          <button
            type="button"
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                const url = window.prompt("Enter URL:");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }
            }}
            className={`p-2 rounded hover:bg-gray-200 toolbar-button ${
              editor.isActive("link") ? "bg-green-100 text-green-700" : ""
            }`}
            title="Insert Link (Ctrl+K)"
            data-shortcut="Ctrl+K"
          >
            <FiLink />
          </button>

          {/* Image Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded hover:bg-gray-200"
            title="Insert Image"
            disabled={mediaUploading}
          >
            {mediaUploading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            ) : (
              <FiImage />
            )}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
              e.target.value = "";
            }}
          />

          {/* Image Menu (when image is selected) */}
          {selectedImage && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowImageMenu(!showImageMenu)}
                className="p-2 rounded hover:bg-gray-200 bg-green-100 text-green-700"
                title="Image Options"
              >
                <FiMove />
              </button>

              {showImageMenu && (
                <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-64 p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Image Options
                  </p>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Display Mode</p>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={alignImageBlock}
                        className={`px-3 py-1.5 text-sm rounded text-left ${
                          !selectedImage.attrs.align ||
                          selectedImage.attrs.align === "block"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">Block Mode</div>
                        <div className="text-xs text-gray-500">
                          Image takes full width, text above/below
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={alignImageInlineLeft}
                        className={`px-3 py-1.5 text-sm rounded text-left ${
                          selectedImage.attrs.align === "inline-left"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">Float Left</div>
                        <div className="text-xs text-gray-500">
                          Text wraps on right side
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={alignImageInlineRight}
                        className={`px-3 py-1.5 text-sm rounded text-left ${
                          selectedImage.attrs.align === "inline-right"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        <div className="font-medium">Float Right</div>
                        <div className="text-xs text-gray-500">
                          Text wraps on left side
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-xs text-gray-600 mb-1">Size</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <button
                        type="button"
                        onClick={() => setImageSize("small")}
                        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Small (200px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSize("medium")}
                        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Medium (400px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSize("large")}
                        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Large (600px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageSize("full")}
                        className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200"
                      >
                        Full Width
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={decreaseImageSize}
                        className="p-1.5 rounded bg-gray-100 hover:bg-gray-200"
                        title="Decrease Size"
                      >
                        <FiMinimize2 className="text-sm" />
                      </button>

                      <span className="text-xs text-gray-600">
                        {selectedImage.attrs.width
                          ? `${selectedImage.attrs.width}`
                          : "Auto"}
                      </span>

                      <button
                        type="button"
                        onClick={increaseImageSize}
                        className="p-1.5 rounded bg-gray-100 hover:bg-gray-200"
                        title="Increase Size"
                      >
                        <FiMaximize2 className="text-sm" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={deleteImage}
                    className="w-full py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
                  >
                    Delete Image
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="w-px h-6 bg-gray-300 mx-1"></div>

          {/* Table Menu */}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowTableMenu(true)}
              className={`p-2 rounded ${
                editor.isActive("table")
                  ? "bg-green-100 text-green-700"
                  : "hover:bg-gray-200"
              }`}
              title="Table"
            >
              <FiTable />
            </button>

            {showTableMenu && (
              <div
                className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-xl z-50 w-72 p-4"
                onMouseEnter={() => setShowTableMenu(true)}
                onMouseLeave={() => setShowTableMenu(false)}
              >
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Insert Table
                  </p>
                  <div className="grid grid-cols-5 gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((row) =>
                      [1, 2, 3, 4, 5].map((col) => (
                        <button
                          key={`${row}-${col}`}
                          type="button"
                          onClick={() => insertTable(row, col)}
                          className="w-8 h-8 border border-gray-300 hover:bg-green-50 flex items-center justify-center"
                          title={`${row}×${col}`}
                        >
                          <span className="text-xs">
                            {row}×{col}
                          </span>
                        </button>
                      )),
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => insertTable(3, 3)}
                    className="w-full py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 font-medium"
                  >
                    Insert 3×3 Table
                  </button>
                </div>

                {editor.isActive("table") && (
                  <>
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Cell Background
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => {
                            setSelectedColor(e.target.value);
                            setCellBackground(e.target.value);
                          }}
                          className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => setCellBackground("#fef3c7")}
                          className="w-8 h-8 rounded-full bg-yellow-100 border border-gray-300 hover:scale-110"
                        />
                        <button
                          type="button"
                          onClick={() => setCellBackground("#dbeafe")}
                          className="w-8 h-8 rounded-full bg-green-100 border border-gray-300 hover:scale-110"
                        />
                        <button
                          type="button"
                          onClick={() => setCellBackground("#d1fae5")}
                          className="w-8 h-8 rounded-full bg-green-100 border border-gray-300 hover:scale-110"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Row Operations
                          </p>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={addRowBefore}
                              className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100"
                            >
                              Add Row Above
                            </button>
                            <button
                              type="button"
                              onClick={addRowAfter}
                              className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100"
                            >
                              Add Row Below
                            </button>
                            <button
                              type="button"
                              onClick={deleteRow}
                              className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                            >
                              Delete Row
                            </button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">
                            Column Operations
                          </p>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={addColumnBefore}
                              className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100"
                            >
                              Add Column Left
                            </button>
                            <button
                              type="button"
                              onClick={addColumnAfter}
                              className="px-2 py-1 text-xs bg-gray-50 rounded hover:bg-gray-100"
                            >
                              Add Column Right
                            </button>
                            <button
                              type="button"
                              onClick={deleteColumn}
                              className="px-2 py-1 text-xs bg-red-50 text-red-700 rounded hover:bg-red-100"
                            >
                              Delete Column
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={mergeCells}
                          className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                        >
                          Merge Cells
                        </button>
                        <button
                          type="button"
                          onClick={splitCell}
                          className="px-3 py-1.5 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100"
                        >
                          Split Cell
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={deleteTable}
                        className="w-full py-2.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 font-medium"
                      >
                        Delete Entire Table
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Horizontal Rule */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded hover:bg-gray-200"
            title="Horizontal Line"
          >
            <MdHorizontalRule />
          </button>
        </div>

        {/* Third Row - Text Properties Display */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 border-t border-gray-200">
          <div className="text-xs text-gray-500 font-medium">
            Selected Text Properties:
          </div>

          {/* Active properties indicators */}
          {selectedTextProperties.bold && (
            <span className="text-property-indicator property-active">
              <FiBold className="text-xs" /> Bold
            </span>
          )}

          {selectedTextProperties.italic && (
            <span className="text-property-indicator property-active">
              <FiItalic className="text-xs" /> Italic
            </span>
          )}

          {selectedTextProperties.underline && (
            <span className="text-property-indicator property-active">
              <FiUnderline className="text-xs" /> Underline
            </span>
          )}

          {selectedTextProperties.color && (
            <span className="text-property-indicator">
              <FiType className="text-xs" />
              Color:{" "}
              <div
                className="w-3 h-3 rounded border"
                style={{ backgroundColor: selectedTextProperties.color }}
              />
            </span>
          )}

          {selectedTextProperties.backgroundColor && (
            <span className="text-property-indicator">
              Highlight:{" "}
              <div
                className="w-3 h-3 rounded border"
                style={{
                  backgroundColor: selectedTextProperties.backgroundColor,
                }}
              />
            </span>
          )}

          {selectedTextProperties.fontSize && (
            <span className="text-property-indicator">
              Size: {selectedTextProperties.fontSize}
            </span>
          )}

          {selectedTextProperties.fontFamily && (
            <span className="text-property-indicator">
              Font:{" "}
              {selectedTextProperties.fontFamily
                .split(",")[0]
                .replace(/['"]/g, "")}
            </span>
          )}

          {selectedTextProperties.headingLevel && (
            <span className="text-property-indicator">
              Heading {selectedTextProperties.headingLevel}
            </span>
          )}

          {selectedTextProperties.align &&
            selectedTextProperties.align !== "left" && (
              <span className="text-property-indicator">
                Align: {selectedTextProperties.align}
              </span>
            )}
        </div>
      </div>

      {/* Editor Content with Scroll */}
      <div className="relative h-[calc(100%-144px)]">
        <EditorContent editor={editor} className="h-full overflow-auto" />

        {/* Height Display and Resize Handle */}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          <div className="editor-height-display">
            {parseInt(editorHeight)}px
          </div>
          <div
            className={`editor-resize-handle ${isResizing ? "resizing" : ""}`}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsResizing(true);
            }}
            title="Drag to resize"
          />
        </div>
      </div>
    </div>
  );
}
