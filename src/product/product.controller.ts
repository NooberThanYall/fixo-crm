import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFile, UseInterceptors, Req, UploadedFiles } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from 'src/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

@UseGuards(AuthGuard)
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|png|jpeg|webp)$/)) {
          return cb(new Error('Only images allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
  ) {
    // attach the uploaded file path to the dto
    if (file) {
      createProductDto.images = [
        `/uploads/images/${file.filename}`,
      ];
    }


    console.log('dto:', createProductDto)

    //@ts-expect-error fuck you
    return this.productService.add(createProductDto, req.user.id);
  }
  @Post(':id/image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|png|jpeg|webp)$/)) {
          return cb(new Error('Only images allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async updatePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request
  ) {
    const imagePath = `/uploads/images/${file.filename}`;

    // @ts-expect-error user injected by auth guard
    return this.productService.updatePhoto(id, imagePath, req.user.id);
  }




  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.get(id);
  }

  @Get('/owner/:ownerId')
  getAllByOwner(@Param('ownerId') id: string) {
    return this.productService.listByUser(id)
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/images',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|png|jpeg|webp)$/)) {
          return cb(new Error('Only images allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (file) {
      updateProductDto.images = [
        ...(updateProductDto.images ?? []),
        `/uploads/images/${file.filename}`,
      ];
    }

    return this.productService.update(id, updateProductDto);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.delete(id);
  }

  @Post('import')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/excels',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xls|xlsx)$/)) {
          return cb(new Error('Only Excel files are allowed!'), false);
        }
        cb(null, true);
      },
    }),
  )
  async importExcel(@UploadedFile() file: Express.Multer.File, @Req() req: Request) {
    console.log('controller log')
    if (!file) throw new Error('No file uploaded!');
    //@ts-expect-error fuck you
    return await this.productService.importFromExcel(file.path, req.user.id);
  }
}
