// ============================================================
// PrintPadi – features/product/components/design-upload.tsx
// Exact port of design-upload.tsx from the Next.js project.
// ============================================================

import { useId, useRef, useState } from 'react';
import { toast } from 'sonner';
import { DocumentUpload, Trash } from 'iconsax-reactjs';
import { cn } from '@/lib/utils';
import {
  hasCloudinaryUploadConfig,
  uploadImageToCloudinary,
} from '@/lib/cloudinary';

export type DesignUploadValue = {
  url: string;
  publicId: string;
  fileName: string;
};

type DesignUploadProps = {
  value: DesignUploadValue | null;
  onChange: (value: DesignUploadValue | null) => void;
  variant?: 'panel' | 'drawer' | 'quote';
};

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function DesignUpload({
  value,
  onChange,
  variant = 'panel',
}: DesignUploadProps) {
  const isDrawer = variant === 'drawer';
  const isQuote = variant === 'quote';
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error('Please upload a PNG, JPG, or SVG image.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error('File must be 10MB or smaller.');
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImageToCloudinary(file);
      onChange({
        url: result.secureUrl,
        publicId: result.publicId,
        fileName: file.name,
      });
      toast.success(isQuote ? 'Reference uploaded.' : 'Design uploaded.');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Upload failed.',
      );
    } finally {
      setUploading(false);
    }
  };

  if (!hasCloudinaryUploadConfig) {
    return (
      <p
        className={cn(
          'text-gray-4',
          isDrawer ? 'mt-2 text-[10px]' : isQuote ? 'text-[12px]' : 'mt-3 text-[12px]',
        )}
      >
        {isQuote
          ? 'Reference uploads are not configured yet. You can still submit your request.'
          : 'Design uploads are not configured yet. Please choose another option or contact us.'}
      </p>
    );
  }

  return (
    <div className={cn(isDrawer ? 'mt-2' : isQuote ? '' : 'mt-3')}>
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        className="hidden"
        onChange={handleFileChange}
      />

      {value ? (
        <div
          className={cn(
            'flex items-center gap-3 border border-gray-1 bg-white',
            isQuote ? 'rounded-[15px] p-2.5' : 'rounded-xl',
            isDrawer ? 'p-2' : !isQuote ? 'p-2.5' : undefined,
          )}
        >
          <img
            src={value.url}
            alt={value.fileName}
            className={cn(
              'shrink-0 rounded-lg object-cover',
              isDrawer ? 'size-9' : isQuote ? 'size-10' : 'size-12',
            )}
            loading="lazy"
            decoding="async"
          />
          <div className="flex min-w-0 flex-1 flex-col">
            <span
              className={cn(
                'truncate font-medium text-black',
                isDrawer ? 'text-[10px]' : isQuote ? 'text-[11px]' : 'text-[12px]',
              )}
            >
              {value.fileName}
            </span>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className={cn(
                'self-start text-[#5EB447] underline disabled:opacity-50',
                isDrawer ? 'text-[9px]' : isQuote ? 'text-[10px]' : 'text-[11px]',
              )}
            >
              {uploading ? 'Uploading…' : 'Replace'}
            </button>
          </div>
          <button
            type="button"
            aria-label="Remove uploaded file"
            onClick={() => onChange(null)}
            disabled={uploading}
            className="shrink-0 text-gray-4 disabled:opacity-50"
          >
            <Trash size={isDrawer ? 14 : isQuote ? 15 : 16} color="#808080" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className={cn(
            'flex w-full items-center justify-center gap-2 border border-dashed border-[#AAAAAA] text-gray-4 disabled:opacity-50',
            isQuote
              ? 'rounded-[15px] py-3 text-[12px]'
              : cn(
                  'rounded-xl',
                  isDrawer ? 'py-2.5 text-[10px]' : 'py-3.5 text-[12px]',
                ),
          )}
        >
          <DocumentUpload
            size={isDrawer ? 14 : isQuote ? 15 : 16}
            color="#808080"
          />
          {uploading
            ? 'Uploading…'
            : isQuote
              ? 'Upload reference (PNG, JPG, SVG)'
              : 'Upload your design (PNG, JPG, SVG)'}
        </button>
      )}
    </div>
  );
}
