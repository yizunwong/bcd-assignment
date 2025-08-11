import { Injectable, InternalServerErrorException } from '@nestjs/common';
import 'dotenv/config';

function toArrayBuffer(buf: Buffer): ArrayBuffer {
  const ab = new ArrayBuffer(buf.length);
  const view = new Uint8Array(ab);
  view.set(buf);
  return ab;
}

@Injectable()
export class PinataService {
  private readonly endpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  private readonly jwt = process.env.PINATA_JWT!;

  async uploadPolicyDocument(
    file: Express.Multer.File,
    meta?: { policyId?: string; userId?: string },
  ): Promise<string> {
    const formData = new FormData();

    const ab = toArrayBuffer(file.buffer);
    const timestamp = Date.now();
    const sanitizedName = file.originalname.replace(/\s+/g, '_');
    const finalFileName = `${timestamp}_${sanitizedName}`;
    const webFile = new File([ab], finalFileName, { type: file.mimetype });
    formData.append('file', webFile);

    // (optional) metadata
    formData.append(
      'pinataMetadata',
      JSON.stringify({
        name: finalFileName,
        keyvalues: {
          ...(meta?.policyId && { policyId: meta.policyId }),
          ...(meta?.userId && { userId: meta.userId }),
        },
      }),
    );
    formData.append('pinataOptions', JSON.stringify({ cidVersion: 1 }));

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.jwt}` },
      body: formData,
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new InternalServerErrorException(
        `Failed to upload document to Pinata: ${msg}`,
      );
    }

    const data = (await res.json()) as { IpfsHash: string };
    return data.IpfsHash;
  }
}
