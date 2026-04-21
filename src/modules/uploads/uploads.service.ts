import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core';
import { MediaType } from '@prisma/client';
import { FileResponseDto } from './dto';
import * as path from 'path';
import * as fs from 'fs';
import 'multer';

@Injectable()
export class UploadsService {
  private readonly uploadDir = 'uploads';

  constructor(private readonly prisma: PrismaService) {
    // Ensure uploads directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    type: MediaType,
  ): Promise<FileResponseDto> {
    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${path.extname(file.originalname)}`;
    const filePath = path.join(this.uploadDir, filename);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    // Get file stats
    const stats = fs.statSync(filePath);

    // Create media record in database
    const media = await this.prisma.media.create({
      data: {
        url: `/uploads/${filename}`,
        type,
        mimeType: file.mimetype,
        filename,
        size: stats.size,
        altText: file.originalname,
      },
    });

    return media;
  }

  async uploadMultiple(
    files: Express.Multer.File[],
    type: MediaType,
  ): Promise<FileResponseDto[]> {
    const uploadedFiles: FileResponseDto[] = [];

    for (const file of files) {
      const media = await this.uploadFile(file, type);
      uploadedFiles.push(media);
    }

    return uploadedFiles;
  }

  async findAll() {
    return this.prisma.media.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: string): Promise<FileResponseDto | null> {
    const media = await this.prisma.media.findUnique({
      where: { id },
    });

    if (!media) {
      return null;
    }

    // Delete file from disk
    const filePath = path.join(this.uploadDir, media.filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete record from database
    return this.prisma.media.delete({
      where: { id },
    });
  }
}
