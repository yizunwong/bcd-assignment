import { CommonResponseDto } from '@/api';
import { customFetcher } from '@/api/fetch';

export function useAgreementUpload() {
  const uploadAgreement = async (
    agreementFile: File | null,
  ): Promise<string | null> => {
    if (!agreementFile) return null;
    const formData = new FormData();
    formData.append('file', agreementFile);
    const res = await customFetcher<CommonResponseDto>({
      url: '/coverage/agreement',
      method: 'POST',
      data: formData,
    });
    return (res.data as { cid: string }).cid as string;
  };

  return { uploadAgreement };
}
