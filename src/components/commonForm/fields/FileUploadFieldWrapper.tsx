import React from 'react';
import FileUploadField from './FileUploadField'; // Adjust the import according to your setup

interface FileFieldProps {
  hexathonId: string | undefined;
  fieldProps: any; // Replace 'any' with the appropriate type if known
}

const FileField: React.FC<FileFieldProps> = ({ hexathonId, fieldProps }) => (
  <FileUploadField {...fieldProps} hexathonId={hexathonId} />
);

export default FileField;