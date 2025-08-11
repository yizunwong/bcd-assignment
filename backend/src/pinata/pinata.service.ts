import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { config } from 'dotenv';
import { Blob } from 'buffer';

config();

@Injectable()
export class PinataService {
  private readonly endpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  private readonly jwt = process.env.PINATA_JWT!;

  async uploadPolicyDocument(file: Express.Multer.File): Promise<string> {
    const formData = new FormData();
    formData.append('file', new Blob([file.buffer]), file.originalname);

    const response = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.jwt}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const msg = await response.text();
      throw new InternalServerErrorException(
        `Failed to upload document to Pinata: ${msg}`,
      );
    }

    const data = (await response.json()) as { IpfsHash: string };
    return data.IpfsHash;
  }
}

