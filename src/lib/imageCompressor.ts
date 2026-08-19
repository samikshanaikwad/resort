/**
 * Image Compressor Utility
 * Compresses images in-browser to WebP format targeting under 250KB
 */
export async function compressImageToWebP(
  file: File,
  maxSizeBytes: number = 250 * 1024
): Promise<File> {
  // If file is not an image, return original
  if (!file.type.startsWith("image/")) {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        let width = img.width;
        let height = img.height;
        const maxDimension = 1600;

        // Downscale large images proportionally
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        // Draw image onto canvas
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        let quality = 0.82;
        let compressedBlob: Blob | null = null;

        // Attempt compression with decreasing quality if size exceeds threshold
        for (let attempt = 0; attempt < 4; attempt++) {
          compressedBlob = await new Promise<Blob | null>((res) => {
            canvas.toBlob(
              (blob) => res(blob),
              "image/webp",
              quality
            );
          });

          if (compressedBlob && compressedBlob.size <= maxSizeBytes) {
            break;
          }

          quality -= 0.15;
          if (quality < 0.4) quality = 0.4;
        }

        if (compressedBlob) {
          const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
          const compressedFile = new File(
            [compressedBlob],
            `${originalNameWithoutExt}.webp`,
            { type: "image/webp", lastModified: Date.now() }
          );
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}
