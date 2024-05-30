// Definir las opciones para el tipo de archivo permitido
const fileTypes = [
  {
    description: "Image file",
    accept: { "image/png": [".png"], "image/jpeg": [".jpeg", ".jpg"] },
  },
];

interface SaveFileOptions {
  content: string | Blob;
  suggestedName: string;
  contentType: string;
  types?: { description: string; accept: { [key: string]: string[] } }[];
}

// Definir el tipo para SaveFilePickerOptions
interface SaveFilePickerOptions {
  suggestedName?: string;
  types?: { description: string; accept: { [key: string]: string[] } }[];
}

// Verificar si el método showSaveFilePicker está disponible en el navegador
export const isFileSystemAccessAPISupported = (): boolean => {
  return "showSaveFilePicker" in window;
};

export const saveFile = async (options: SaveFileOptions): Promise<void> => {
  const { content, suggestedName, contentType, types = fileTypes } = options;

  // Validar el nombre del archivo sugerido
  if (!suggestedName || typeof suggestedName !== "string") {
    throw new Error("Invalid suggested file name.");
  }

  // Validar el contenido
  if (!(content instanceof Blob) && typeof content !== "string") {
    throw new Error("Invalid content type. Must be a string or a Blob.");
  }

  if (!isFileSystemAccessAPISupported()) {
    throw new Error("File System Access API is not supported in this browser.");
  }

  // Configurar las opciones para el diálogo de guardado de archivo
  const filePickerOptions: SaveFilePickerOptions = {
    suggestedName,
    types,
  };

  try {
    // Mostrar el diálogo para elegir la ubicación de guardado
    const handle = await (window as any).showSaveFilePicker(filePickerOptions);

    // Crear un archivo Blob a partir del contenido
    const blob =
      content instanceof Blob
        ? content
        : new Blob([content], { type: contentType });

    // Crear un stream de escritura
    const writable = await handle.createWritable();

    // Escribir el contenido en el archivo
    await writable.write(blob);

    // Cerrar el archivo
    await writable.close();

    console.log("File saved successfully.");
  } catch (error) {
    console.error("Error saving file:", error);
  }
};
