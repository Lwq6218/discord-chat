import { FileIcon, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';

interface FileWithPreview extends File {
  preview: string;
}

interface FileUploadProps {
  onChange: (file: File | null) => void;
  type: 'image' | 'pdf' | 'both';
}
const FileUpload: React.FC<FileUploadProps> = ({ onChange, type }) => {
  const [file, setFile] = useState<FileWithPreview | null>(null);
  const { t } = useTranslation();
  const anchorRef = useRef(null);

  const acceptType = {
    image: 'image/*',
    pdf: 'application/pdf',
    both: 'image/*, application/pdf',
  };
  const { getRootProps, getInputProps } = useDropzone({
    accept:
      type === 'both'
        ? {
            'image/*': [],
            'application/pdf': [],
          }
        : { [acceptType[type]]: [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      if (selectedFile) {
        const fileWithPreview = Object.assign(selectedFile, {
          preview: URL.createObjectURL(selectedFile),
        });
        setFile(fileWithPreview);
        onChange(selectedFile); // 传递单个文件
      }
    },
  });

  const handleRemoveFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setFile(null);
    onChange(null); // 文件移除时传递 null
  };

  useEffect(() => {
    if (file) {
      return () => URL.revokeObjectURL(file.preview);
    }
  }, [file]);

  return (
    <div
      {...getRootProps({ className: 'dropzone' })}
      className="cursor-pointer rounded-md border-2 border-dashed border-gray-300 p-6"
    >
      <input {...getInputProps()} />
      {file && file.type.includes('image') && (
        <div className="relative">
          <img
            src={file.preview}
            alt={file.name}
            className="size-20 rounded-full"
          />
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {file && file.type.includes('pdf') && (
        <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
          <FileIcon className="size-10 fill-indigo-200 stroke-indigo-400" />
          <a
            href={file.preview}
            target="_blank"
            rel="noopener noreferrer"
            ref={anchorRef}
            onClick={(e) => e.stopPropagation()}
            className="ml-2 line-clamp-1 text-sm text-indigo-500 hover:underline dark:text-indigo-400"
          >
            {file.preview}
          </a>
          <button
            type="button"
            onClick={handleRemoveFile}
            className="absolute right-0 top-0 rounded-full bg-rose-500 p-1 text-white shadow-sm"
          >
            <X className="size-4" />
          </button>
        </div>
      )}
      {!file && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <FileIcon className="size-10 fill-gray-300 stroke-gray-500" />
          <p className="text-gray-500">
            {t("Drag 'n' drop a file here, or click to select a file")}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
