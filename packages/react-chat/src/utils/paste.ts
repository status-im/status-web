export const paste = () => {
  navigator.clipboard
    .readText()
    .then(
      (clipText) =>
        ((<HTMLInputElement>document.getElementById("pasteInput")).value =
          clipText)
    );
};
