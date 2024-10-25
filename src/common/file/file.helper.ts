import { join, extname, parse } from 'path';
import * as fs from 'fs';
import * as fsPromis from 'fs/promises';
export class FileHelper {
  static uploadsPath = join(__dirname, '..', '..', '..', 'uploads');
  static uploadsCoverage = join(this.uploadsPath, 'coverages');
  static uploadsCohtractors = join(this.uploadsPath, 'contratctors');

  public static async createFolder(
    entities: string,
    name: string,
  ): Promise<void> {
    const folderContract = join(this.uploadsPath, entities, name);

    fs.mkdir(folderContract, { recursive: true }, (error) => {
      if (error) console.log(error);
    });
  }
  public static async createFolderPath(path: string): Promise<void> {
    fs.mkdir(path, { recursive: true }, (error) => {
      if (error) console.log(error);
    });
  }
  public static async updateFolder(
    entities: string,
    name: string,
    old: string,
  ): Promise<void> {
    const folderContractNew = join(this.uploadsPath, entities, name);
    const folderContractOld = join(this.uploadsPath, entities, old);
    fs.rename(folderContractOld, folderContractNew, (error) => {
      if (error) throw error;
    });
  }
  public static async deleteFolder(
    entities: string,
    name: string,
  ): Promise<void> {
    const folder = join(this.uploadsPath, entities, name);
    fs.rmSync(folder, { recursive: true, force: true });
  }
  public static async moveFile(newq: string, old: string): Promise<void> {
    await fs.rename(old, newq, (error) => {
      if (error) throw error;
    });
  }

  public static async moveFileAsync(newq: string, old: string): Promise<void> {
    await fsPromis.rename(old, newq).catch((error) => {
      if (error) throw error;
    });
  }
  public static async moveFileAndCreateRoute(
    dir: string,
    newq: string, //directoriy with files
    old: string,
  ): Promise<void> {
    //si el la direccion no existe
    //crea la ruta
    await fsPromis.stat(dir).catch(async (error) => {
      if (error.code === 'ENOENT')
        await fsPromis.mkdir(dir, { recursive: true });
    });
    await fsPromis.rename(old, newq);
  }
  public static async moveAndOverrideFile(
    newdir: string,
    oldDir: string,
    dirWithFile?: string,
  ): Promise<void> {
    //si el archivo existe
    const exists = await this.existFileOrFolder(dirWithFile);
    if (exists) {
      //borra el archivo
      //mueve el archivo
      this.deletFile(dirWithFile);
      this.moveFileAsync(dirWithFile, oldDir);
    } else this.moveFileAndCreateRoute(newdir, dirWithFile, oldDir);
  }
  public static async deletFile(path: string): Promise<void> {
    await fsPromis.unlink(path);
  }
  public static async deleteDir(path: string) {
    fs.rmSync(path, { recursive: true, force: true });
  }
  public static getAllFilesInFolder(path: string): string[] {
    try {
      const files = fs.readdirSync(path);
      return files;
    } catch (err) {
      return [];
    }
  }
  public static isCSV(path: string) {
    return extname(path) === '.csv';
  }
  public static isExcel(path: string) {
    return extname(path) === '.xlsx' || extname(path) === '.xls';
  }
  public static getFileName(path: string) {
    return parse(path).base;
  }
  public static joinPath(path1: string, path2: string) {
    return join(path1, path2);
  }
  public static async existFileOrFolder(path: string): Promise<boolean> {
    try {
      await fsPromis.access(path);
      // Path exists
      return true;
    } catch {
      // Path does not exist
      return false;
    }
  }
  public static async writeIntxt(data: any, fileName: string, path: string) {
    const dir = join(path, `${fileName}.txt`);
    if (!(await this.existFileOrFolder(path))) this.createFolderPath(path);
    try {
      await fsPromis.writeFile(dir, data);
    } catch (err) {
      console.error('Error while writing data to txt file:', err);
    }
  }
  public static existFolder(path: string) {
    return fs.existsSync(path);
  }
}
