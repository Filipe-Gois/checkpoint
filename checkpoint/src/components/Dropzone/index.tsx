import { FileInput, Label } from "flowbite-react";
import { useState } from "react";

type DropzoneProps = {
    totalArquivos: number;
    maximoArquivos?: number;
    onFilesChange: (files: File[]) => void;
};

const Dropzone = ({ onFilesChange, totalArquivos, maximoArquivos = 3 }: DropzoneProps) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
        const newFiles = [...files, ...selectedFiles].slice(0, maximoArquivos); // Respeitar o limite
        setFiles(newFiles);
        onFilesChange(newFiles); // Atualiza o Hook Form
    };

    const removeFile = (index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    const downloadFile = (file: File) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement("a");
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    };

    return (
        <div className="flex w-full flex-col items-center justify-center">
            {totalArquivos < maximoArquivos && (
                <Label
                    htmlFor="dropzone-file"
                    className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                    <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <p className="mb-2 text-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold text-center">Clique para carregar</span> ou arraste arquivos
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG, GIF (Máx: {maximoArquivos})</p>
                    </div>
                    <FileInput
                        id="dropzone-file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                    />
                </Label>
            )}
            <ul className="mt-2 w-full">
                {files.map((file, index) => (
                    <li
                        key={index}
                        className="flex justify-between p-2 text-sm text-gray-700 bg-gray-200 rounded-md my-1"
                        onClick={() => downloadFile(file)}
                    >
                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                            }}
                            className="ml-2 text-red-500"
                        >
                            Remover
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropzone;
