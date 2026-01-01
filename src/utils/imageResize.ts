export async function resizeImageToDataUrl(
  file: File,
  maxWidth = 1280,
  quality = 0.7
): Promise<string> {
  const createBitmap = typeof createImageBitmap === "function"
  if (createBitmap) {
    const bitmap = await createImageBitmap(file)
    const scale = Math.min(1, maxWidth / bitmap.width)
    const width = Math.round(bitmap.width * scale)
    const height = Math.round(bitmap.height * scale)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(bitmap, 0, 0, width, height)
    return canvas.toDataURL("image/jpeg", quality)
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.onload = () => resolve(image)
      image.onerror = reject
      image.src = url
    })
    const scale = Math.min(1, maxWidth / img.width)
    const width = Math.round(img.width * scale)
    const height = Math.round(img.height * scale)
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")!
    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL("image/jpeg", quality)
  } finally {
    URL.revokeObjectURL(url)
  }
}

export function approxDecodedBytes(dataUrl: string): number {
  const base64 = (dataUrl.split(",")[1] || "").trim()
  return Math.floor(base64.length * 0.75)
}
