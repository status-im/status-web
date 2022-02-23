export const paste = (elementId: string) => {
  navigator.clipboard
    .readText()
    .then(
      clipText =>
        ((<HTMLInputElement>document.getElementById(elementId)).value =
          clipText)
    )
}
