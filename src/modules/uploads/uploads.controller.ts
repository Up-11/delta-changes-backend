import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { FileResponseDto, FilesResponseDto } from './dto';
import { AdminGuard } from '../../common/guards/admin.guard';
import { MediaType } from '@prisma/client';
import 'multer';

@ApiTags('Uploads')
@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all uploaded files (admin only)' })
  findAll(): Promise<FileResponseDto[]> {
    return this.uploadsService.findAll();
  }

  @Post('image')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload single image (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image file (jpg, png, gif, webp)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    return this.uploadsService.uploadFile(file, MediaType.IMAGE);
  }

  @Post('video')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload single video (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Video file (mp4, mov, avi, webm)',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadVideo(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }), // 100MB
          new FileTypeValidator({ fileType: /(mp4|mov|avi|webm|mkv)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileResponseDto> {
    return this.uploadsService.uploadFile(file, MediaType.VIDEO);
  }

  @Post('images')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple images (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Multiple image files',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async uploadMultipleImages(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|gif|webp)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<FilesResponseDto> {
    const uploadedFiles = await this.uploadsService.uploadMultiple(
      files,
      MediaType.IMAGE,
    );
    return { files: uploadedFiles };
  }

  @Post('videos')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload multiple videos (admin only)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
          description: 'Multiple video files',
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 5))
  async uploadMultipleVideos(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 100 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /(mp4|mov|avi|webm|mkv)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ): Promise<FilesResponseDto> {
    const uploadedFiles = await this.uploadsService.uploadMultiple(
      files,
      MediaType.VIDEO,
    );
    return { files: uploadedFiles };
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete file (admin only)' })
  remove(@Param('id') id: string): Promise<FileResponseDto | null> {
    return this.uploadsService.remove(id);
  }
}
